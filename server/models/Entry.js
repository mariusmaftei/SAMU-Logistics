import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Entry = sequelize.define(
  "Furnizor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nume_Furnizor: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Adresa_Furnizor: {
      type: DataTypes.STRING(100),
      allowNull: true, // In your SQL, this field is nullable.
    },
    CUI_CUI_CIF: {
      type: DataTypes.STRING(20),
      allowNull: true, // SQL field is nullable.
    },
    Trezorerie_Furnizor: {
      type: DataTypes.STRING(30),
      allowNull: true, // SQL field is nullable.
    },
    NR_CONT_IBAN: {
      type: DataTypes.STRING(100),
      allowNull: true, // SQL field is nullable.
    },
  },
  {
    tableName: "Furnizor", // Matches your SQL table name.
    timestamps: true, // Sequelize will manage createdAt and updatedAt fields.
  }
);

export default Entry;
