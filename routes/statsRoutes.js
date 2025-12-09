import express from 'express';
import { getHrStats } from '../controllers/statsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/hr', protect, admin, getHrStats);

export default router;
