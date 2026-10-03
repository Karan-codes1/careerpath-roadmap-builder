import express from 'express'
import ensureAuthenticated from '../Middlewares/Auth.js'
import { generateAIExplanation, generateProjectIdeas, generateRecommendations } from '../controller/AIController.js';
import { aiHourlyLimiter, aiDailyLimiter } from '../Middlewares/RateLimit.js';

const router = express.Router();


// Every AI route: logged in, then within the per-user hourly and daily limits.
// The three routes share the same counters.
router.use(ensureAuthenticated, aiHourlyLimiter, aiDailyLimiter)

router.post('/projects',generateProjectIdeas)
router.post('/explanation',generateAIExplanation)
router.post('/recommendations',generateRecommendations)

export default router