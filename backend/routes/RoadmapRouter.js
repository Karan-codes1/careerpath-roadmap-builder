import express from "express"
import ensureAuthenticated from "../Middlewares/Auth.js";
import { createMultipleRoadmaps, createRoadmap,deleteMilestonefromProgress,getAllRoadmaps, getRoadmapProgress, getRoadmapWithUserProgress, putMultipleMilestonesIfCompleted} from "../controller/RoadmapController.js";


const router = express.Router();

router.post('/',ensureAuthenticated,createMultipleRoadmaps)// Only logged in users can createe new roadmap
router.get('/',getAllRoadmaps)
router.get('/:roadmapId', ensureAuthenticated,getRoadmapWithUserProgress); // get a single roadmap
router.get('/:roadmapId/progress',ensureAuthenticated,getRoadmapProgress)
router.put('/:roadmapId',ensureAuthenticated, putMultipleMilestonesIfCompleted)//PUT to update progress (add completed milestone)
router.delete('/:roadmapid',ensureAuthenticated,deleteMilestonefromProgress)

export default router;