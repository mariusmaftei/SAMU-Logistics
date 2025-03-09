import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import authRoute from "./routes/auth.js";
import postRoute from "./routes/post.js";
import setupAssociations from "./models/setupAssociations.js";
import entryRoute from "./routes/entry.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

setupAssociations();

app.get("/", (req, res) => {
  res.send(`<h1>Internal Server Error</h1> 
 
    <p>The server encountered an internal error or misconfiguration and was unable to complete your request.<p>
    <p>Please contact the server administrator at root@localhost to inform them of the time this error occurred, and the actions you performed just before this error.<p>
    <p>More information about this error may be available in the server error log.</p>`);
});
app.use("/entry", entryRoute);
app.use("/auth", authRoute);
app.use("/posts", postRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server has started on port ${port}`);
      console.log("Connected to MYSQL");
    });
  })
  .catch((err) => {
    console.log(err);
  });
