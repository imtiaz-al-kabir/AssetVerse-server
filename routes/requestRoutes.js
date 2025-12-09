import express from "express";
import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createRequest).get(protect, admin, getRequests);

router.route("/myrequests").get(protect, getRequests);

router.route("/:id").put(protect, admin, updateRequestStatus);

export default router;
