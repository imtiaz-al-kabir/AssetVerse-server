import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import assetRoutes from "./routes/assetRoutes.js";
import assignedAssetRoutes from "./routes/assignedAssetRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

const allowedOrigins = [
  "https://asseetverse.netlify.app",
  "https://asseet-vers-client.vercel.app",
  

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("AssetVerse Server is Running");
});
app.use(cookieParser());
app.use("/users", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/assets", assetRoutes);
app.use("/requests", requestRoutes);
app.use("/assigned-assets", assignedAssetRoutes);
app.use("/stats", statsRoutes);
app.use("/payments", paymentRoutes);
app.use("/packages", packageRoutes);
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
