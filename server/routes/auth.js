import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  loginUser,
  verifyUser,
} from "../controllers/Auth.js";
import { verifyToken } from "../middleware/auth.js";

const authRoute = express.Router();

authRoute.post("/register", createUser);
authRoute.post("/login", loginUser);
authRoute.get("/verify", verifyToken, verifyUser);
authRoute.get("/users", verifyToken, getAllUsers);
authRoute.get("/users/:id", verifyToken, getUser);
authRoute.put("/users/:id", verifyToken, updateUser);
authRoute.delete("/users/:id", verifyToken, deleteUser);

export default authRoute;
