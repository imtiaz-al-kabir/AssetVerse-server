import express from 'express';
import { getHrStats } from '../controllers/statsController.js';
import { protect, verifyHR } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/hr', protect, verifyHR, getHrStats);

export default router;
