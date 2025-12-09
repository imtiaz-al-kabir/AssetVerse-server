import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import assetRoutes from "./routes/assetRoutes.js";
import assignedAssetRoutes from "./routes/assignedAssetRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import statsRoutes from "./routes/statsRoutes.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(cookieParser());
app.use("/users", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/assets", assetRoutes);
app.use("/requests", requestRoutes);
app.use("/assigned-assets", assignedAssetRoutes);
app.use('/stats', statsRoutes);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();
