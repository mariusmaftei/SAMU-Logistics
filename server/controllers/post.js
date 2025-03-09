import Post from "../models/Post.js";
import User from "../models/Auth.js";

export const createPost = async (req, res) => {
  try {
    const {
      src,
      frameColor,
      matColor,
      title,
      artist,
      year,
      type,
      orientation,
      userId,
    } = req.body;
    const post = await Post.create({
      src,
      frameColor,
      matColor,
      title,
      artist,
      year,
      type,
      orientation,
      userId,
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, as: "author", attributes: ["id", "username"] }],
    });
    res.json(posts);
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, as: "author", attributes: ["id", "username"] }],
    });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error in getPostById:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const {
      src,
      frameColor,
      matColor,
      title,
      artist,
      year,
      type,
      orientation,
    } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (post) {
      await post.update({
        src,
        frameColor,
        matColor,
        title,
        artist,
        year,
        type,
        orientation,
      });
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error in updatePost:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post) {
      await post.destroy();
      res.json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error in deletePost:", error);
    res.status(500).json({ message: error.message });
  }
};
