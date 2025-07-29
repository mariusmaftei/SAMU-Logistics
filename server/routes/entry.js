import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";

import {
  createEntry,
  deleteEntry,
  getAllEntries,
  getEntry,
  updateEntry,
} from "../controllers/entry.js";

const entryRoute = express.Router();

// Apply authentication middleware to all entry routes
entryRoute.use(requireAuth);

entryRoute.get("/", getAllEntries);
entryRoute.get("/:id", getEntry);
entryRoute.post("/", createEntry);
entryRoute.put("/:id", updateEntry);
entryRoute.delete("/:id", deleteEntry);

export default entryRoute;
