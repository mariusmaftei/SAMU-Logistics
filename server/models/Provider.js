import mongoose from "mongoose";

// Create Mongoose schema
const ProviderSchema = new mongoose.Schema(
  {
    providers: {
      type: String,
      required: [true, "Please add a provider name"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
      trim: true,
    },
    cui_cif: {
      type: String,
      required: [true, "Please add a CUI/CIF"],
      trim: true,
    },
    treasury: {
      type: String,
      required: [true, "Please add a treasury"],
      trim: true,
    },
    iban: {
      type: String,
      required: [true, "Please add an IBAN"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const Provider = mongoose.model("Provider", ProviderSchema);

export default Provider;
