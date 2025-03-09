import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Entry = sequelize.define(
  "Entry", // Changed from "Post" to "Entry" to avoid table name conflict
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    treasuryNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "Entries", // Explicitly set the table name to avoid conflicts
  }
);

export default Entry;
