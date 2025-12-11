import express from "express";
import {
  createAsset,
  deleteAsset,
  getAssets,
  updateAsset,
} from "../controllers/assetController.js";
import { protect, verifyHR } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAssets).post(protect, verifyHR, createAsset);

router
  .route("/:id")
  .put(protect, verifyHR, updateAsset)
  .delete(protect, verifyHR, deleteAsset);

export default router;
