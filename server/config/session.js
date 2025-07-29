import { createSessionStore } from "./database.js";

const isProduction = process.env.NODE_ENV === "production";

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key-for-the-application",
  resave: false,
  saveUninitialized: false,
  store: isProduction ? createSessionStore() : undefined,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: isProduction ? "none" : "lax",
  },
  name: "softindex.sid",
  proxy: isProduction,
};
