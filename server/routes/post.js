import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controllers/post.js";

const postRoute = express.Router();

// Create a new post
postRoute.post("/", createPost);

// Get all posts
postRoute.get("/", getAllPosts);

// Get a single post by ID
postRoute.get("/:id", getPostById);

// Update a post
postRoute.put("/:id", updatePost);

// Delete a post
postRoute.delete("/:id", deletePost);

export default postRoute;
