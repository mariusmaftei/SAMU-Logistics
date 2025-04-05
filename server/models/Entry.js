import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Entry = sequelize.define(
  "Furnizori",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nume_Furnizor: {
      // prev  fullName
      type: DataTypes.STRING,
      allowNull: false,
    },
    Adresa_Furnizor: {
      type: DataTypes.STRING, //prev  address
      allowNull: false,
    },
    CUI_CUI_CIF: {
      type: DataTypes.STRING, // prev treasuryNumber
      allowNull: false,
    },
    Trezorerie_Furnizor: {
      type: DataTypes.STRING, // prev  accountNumber
      allowNull: false,
    },
    NR_CONT_IBAN: {
      type: DataTypes.STRING, // prev  roCode
      allowNull: false,
    },
  },
  {
    tableName: "furnizor",
    timestamps: true,
  }
);

export default Entry;
