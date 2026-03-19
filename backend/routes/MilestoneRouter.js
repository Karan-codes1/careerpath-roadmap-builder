import express from 'express'
import ensureAuthenticated from '../Middlewares/Auth.js'
import {deleteMilestone, getMilestoneById, updateMilestone,getMilestonesByRoadmap, getMilestoneProgress, createMultipleMilestones } from '../controller/MilestoneController.js';



const router = express.Router()
router.post('/:roadmapid',ensureAuthenticated,createMultipleMilestones)
// router.post('/:roadmapid',ensureAuthenticated,createMilestone) //  Create milestone for a specific roadmap

router.get('/:roadmapid',getMilestonesByRoadmap);// get all milestones of a roadmap

router.get('/:id',getMilestoneById)//get one milestone

router.put('/:id',ensureAuthenticated,updateMilestone) // update milestone

router.delete('/:id',ensureAuthenticated,deleteMilestone) // delete milestone

router.get('/progress/:milestoneId',ensureAuthenticated,getMilestoneProgress)
export default router

