import mongoose from "mongoose";

// Create Mongoose schema (equivalent to Sequelize model)
const EntrySchema = new mongoose.Schema(
  {
    Nume_Furnizor: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    Adresa_Furnizor: {
      type: String,
      required: [true, "Please add an address"],
      trim: true,
    },
    CUI_CUI_CIF: {
      type: String,
      required: [true, "Please add a CUI/CIF"],
      trim: true,
    },
    Trezorerie_Furnizor: {
      type: String,
      required: [true, "Please add a treasury"],
      trim: true,
    },
    NR_CONT_IBAN: {
      type: String,
      required: [true, "Please add an IBAN"],
      trim: true,
    },
  },
  {
    timestamps: true, // Equivalent to Sequelize's timestamps: true
  }
);

// Create and export the model
const Entry = mongoose.model("Furnizor", EntrySchema);

export default Entry;
