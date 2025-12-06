import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      enum: ["Returnable", "Non-returnable"],
      required: true,
    },
    productQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    hrEmail: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Auto createdAt/updatedAt
  }
);

const Asset = mongoose.model("Asset", assetSchema);
export default Asset;
