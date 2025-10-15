import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Load allowed emails from env
const allowedEmails = process.env.AUTHORISED_EMAILS
  ? process.env.AUTHORISED_EMAILS.split(",").map((email) =>
      email.trim().toLowerCase()
    )
  : [];

if (allowedEmails.length === 0) {
  console.warn(
    "Warning: No authorised emails defined in AUTHORISED_EMAILS env variable."
  );
}

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found during deserialization:", id);
      return done(null, false);
    }
    console.log("Deserialized user:", user.email);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        `${
          process.env.SERVER_URL || "http://localhost:8080"
        }/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth callback triggered");
        const userEmail = profile.emails?.[0]?.value?.toLowerCase();

        if (!userEmail || !allowedEmails.includes(userEmail)) {
          console.log(`Access denied for email: ${userEmail}`);
          return done(null, false, {
            message: `Access denied. Only these emails are allowed: ${allowedEmails.join(
              ", "
            )}`,
            email: userEmail,
          });
        }

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const userData = {
            googleId: profile.id,
            name:
              profile.displayName ||
              profile.name?.givenName + " " + profile.name?.familyName,
            email: userEmail,
            profileImage: profile.photos?.[0]?.value || "",
            lastLogin: new Date(),
          };

          console.log("Creating new user with data:", userData);
          user = await User.create(userData);
        } else {
          const updateData = {
            lastLogin: new Date(),
          };

          if (profile.photos?.[0]?.value) {
            updateData.profileImage = profile.photos[0].value;
          }

          if (profile.displayName && profile.displayName !== user.name) {
            updateData.name = profile.displayName;
          }

          user = await User.findByIdAndUpdate(user._id, updateData, {
            new: true,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        return done(err, null);
      }
    }
  )
);

export default passport;
