import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    assetName: {
      type: String,
      required: true,
    },
    assetType: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      default: "Request",
    },
    requesterName: {
      type: String,
      required: true,
    },
    requesterEmail: {
      type: String,
      required: true,
    },
    requesterImage: {
      type: String,
    },
    hrEmail: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    approvalDate: {
      type: Date,
    },
    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned"],
      default: "pending",
    },
    note: {
      type: String,
    },
    processedBy: {
      type: String, 
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
