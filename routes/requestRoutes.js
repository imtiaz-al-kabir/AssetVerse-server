import express from "express";
import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";
import { protect, verifyHR } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createRequest).get(protect, verifyHR, getRequests);

router.route("/myrequests").get(protect, getRequests);

router.route("/:id").put(protect, verifyHR, updateRequestStatus);

export default router;
