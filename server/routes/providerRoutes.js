import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";

import {
  createEntry,
  deleteEntry,
  getAllEntries,
  getEntry,
  updateEntry,
} from "../controllers/providerController.js";

const providerRoute = express.Router();

// Apply authentication middleware to all entry routes
providerRoute.use(requireAuth);

providerRoute.get("/", getAllEntries);
providerRoute.get("/:id", getEntry);
providerRoute.post("/", createEntry);
providerRoute.put("/:id", updateEntry);
providerRoute.delete("/:id", deleteEntry);

export default providerRoute;
