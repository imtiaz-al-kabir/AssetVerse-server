import mongoose from "mongoose";

const employeeAffiliationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    companyLogo: {
      type: String,
    },
    affiliationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "active", 
    },
  },
  {
    timestamps: true,
  }
);

const EmployeeAffiliation = mongoose.model(
  "EmployeeAffiliation",
  employeeAffiliationSchema
);
export default EmployeeAffiliation;
