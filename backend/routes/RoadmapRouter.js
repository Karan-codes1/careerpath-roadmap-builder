import express from "express"
import ensureAuthenticated, { requireAdmin } from "../Middlewares/Auth.js";
import { createMultipleRoadmaps, createRoadmap,deleteMilestonefromProgress,getAllRoadmaps, getRoadmapProgress, getRoadmapWithUserProgress, putMultipleMilestonesIfCompleted} from "../controller/RoadmapController.js";


const router = express.Router();

router.post('/',ensureAuthenticated,requireAdmin,createMultipleRoadmaps)// Only admins can create new roadmaps
router.get('/',getAllRoadmaps)
router.get('/:roadmapId', ensureAuthenticated,getRoadmapWithUserProgress); // get a single roadmap
router.get('/:roadmapId/progress',ensureAuthenticated,getRoadmapProgress)
router.put('/:roadmapId',ensureAuthenticated, putMultipleMilestonesIfCompleted)//PUT to update progress (add completed milestone)
router.delete('/:roadmapid',ensureAuthenticated,deleteMilestonefromProgress)

// :roadmapId is a dynamic route parameter/endpoint in Express.
// The value from the URL is accessible using req.params.roadmapId.

export default router;