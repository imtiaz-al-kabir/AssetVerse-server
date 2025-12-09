import express from 'express';
import { createRequest, getMyRequests, getAllRequests, updateRequestStatus } from '../controllers/requestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createRequest)
    .get(protect, admin, getAllRequests);

router.route('/myrequests').get(protect, getMyRequests);

router.route('/:id').put(protect, admin, updateRequestStatus);

export default router;
