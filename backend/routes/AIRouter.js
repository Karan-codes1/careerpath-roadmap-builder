import express from 'express'
import ensureAuthenticated from '../Middlewares/Auth.js'
import { generateAIExplanation, generateProjectIdeas, generateRecommendations } from '../controller/AIController.js';

const router = express.Router();


router.post('/projects',ensureAuthenticated,generateProjectIdeas)
router.post('/explanation',ensureAuthenticated,generateAIExplanation)
router.post('/recommendations',ensureAuthenticated,generateRecommendations)

export default router