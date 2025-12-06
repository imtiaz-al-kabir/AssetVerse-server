import express from 'express';
import { admin, protect } from "../middleware/authMiddleware.js";
import { getMyTeam, getTeamForEmployee, removeEmployee } from "../controllers/employeeController.js";


const router = express.Router();

router.get('/my-team', protect, admin, getMyTeam);
router.get('/team-list', protect, getTeamForEmployee);
router.delete('/:id', protect, admin, removeEmployee);

export default router;
