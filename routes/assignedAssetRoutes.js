import express from 'express';
import { getMyAssets } from '../controllers/assignedAssetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyAssets);

export default router;
