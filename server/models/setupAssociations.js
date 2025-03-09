import User from "./Auth.js";
import Post from "./Post.js";

const setupAssociations = () => {
  User.hasMany(Post, { as: "posts", foreignKey: "userId" });
  Post.belongsTo(User, { as: "author", foreignKey: "userId" });
};

export default setupAssociations;
