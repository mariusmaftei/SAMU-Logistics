import express from "express";
import {
  createEntry,
  deleteEntry,
  getAllEntries,
  getEntry,
  updateEntry,
} from "../controllers/entry.js";

const entryRoute = express.Router();

entryRoute.get("/", getAllEntries);
entryRoute.get("/:id", getEntry);
entryRoute.post("/", createEntry);
entryRoute.put("/:id", updateEntry);
entryRoute.delete("/:id", deleteEntry);

export default entryRoute;
