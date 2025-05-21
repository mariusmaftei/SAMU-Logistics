import express from "express";
import cors from "cors";
import entryRoute from "./routes/entry.js";
import connectDB from "./config/database.js";

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send(`<h1>SAMU Logistics API</h1> 
    <p>Welcome to the SAMU Logistics API</p>
    <p>Use /entry endpoint to access the furnizor data</p>`);
});

app.use("/entry", entryRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server has started on port ${port}`);
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
