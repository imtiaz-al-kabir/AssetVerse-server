import express from 'express';
import { protect, verifyHR } from "../middleware/authMiddleware.js";
import { getMyTeam, getTeamForEmployee, removeEmployee } from "../controllers/employeeController.js";


const router = express.Router();

router.get('/my-team', protect, verifyHR, getMyTeam);
router.get('/team-list', protect, getTeamForEmployee);
router.delete('/:id', protect, verifyHR, removeEmployee);

export default router;
