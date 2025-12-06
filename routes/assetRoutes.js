import express from "express";
import {
  createAsset,
  deleteAsset,
  getAssets,
  updateAsset,
} from "../controllers/assetController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAssets).post(protect, admin, createAsset);

router
  .route("/:id")
  .put(protect, admin, updateAsset)
  .delete(protect, admin, deleteAsset);

export default router;
