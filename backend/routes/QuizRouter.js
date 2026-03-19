import express from 'express'
import { createQuiz, getquizforRoadmap } from '../controller/QuizController.js';
import ensureAuthenticated from '../Middlewares/Auth.js';

const router = express.Router();
router.post('/',ensureAuthenticated,createQuiz) // create a quiz for a roadmap
router.get('/:roadmapId',ensureAuthenticated,getquizforRoadmap);

export default router