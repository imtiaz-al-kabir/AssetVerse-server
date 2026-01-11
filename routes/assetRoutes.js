import express from "express";
import {
  createAsset,
  deleteAsset,
  getAssets,
  updateAsset,
  getAssetById,
} from "../controllers/assetController.js";
import { protect, verifyHR } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAssets).post(protect, verifyHR, createAsset);

router
  .route("/:id")
  .get(protect, getAssetById)
  .put(protect, verifyHR, updateAsset)
  .delete(protect, verifyHR, deleteAsset);

export default router;
