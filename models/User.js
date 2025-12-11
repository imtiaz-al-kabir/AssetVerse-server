import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "hr"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    profileImage: {
      type: String,
    },

    companyName: {
      type: String,
      required: function () {
        return this.role === "hr";
      },
    },
    companyLogo: {
      type: String,
      required: function () {
        return this.role === "hr";
      },
    },
    packageLimit: {
      type: Number,
      default: 5,
    },
    currentEmployees: {
      type: Number,
      default: 0,
    },
    subscription: {
      type: String,
      default: "free",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
