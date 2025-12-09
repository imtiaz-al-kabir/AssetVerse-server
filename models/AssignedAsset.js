import mongoose from "mongoose";

const assignedAssetSchema = new mongoose.Schema({
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset",
    required: true,
  },
  assetName: {
    type: String,
    required: true,
  },
  assetImage: {
    type: String,
  },
  assetType: {
    type: String,
    required: true,
  },
  employeeEmail: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  hrEmail: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  assignmentDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["assigned", "returned"],
    default: "assigned",
  },
});

const AssignedAsset = mongoose.model("AssignedAsset", assignedAssetSchema);
export default AssignedAsset;
