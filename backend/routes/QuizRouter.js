import express from 'express'
import { createQuiz, getquizforRoadmap } from '../controller/QuizController.js';
import ensureAuthenticated, { requireAdmin } from '../Middlewares/Auth.js';

const router = express.Router();
router.post('/',ensureAuthenticated,requireAdmin,createQuiz) // create a quiz for a roadmap (admin only)
router.get('/:roadmapId',ensureAuthenticated,getquizforRoadmap);

export default router