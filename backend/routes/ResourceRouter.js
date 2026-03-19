import express from 'express'
import ensureAuthenticated from '../Middlewares/Auth.js';
import { createMultipleResources, deleteResource, getResourceById, getResourcesByMilestoneId, toggleCompleteResource, updateResource } from '../controller/ResourceController.js';

const router = express.Router();

router.post('/:milestoneId', createMultipleResources); // Create a new resource for a milestone
router.get('/milestone/:milestoneId', getResourcesByMilestoneId); // Get all resources of a milestone
router.get('/:id',ensureAuthenticated, getResourceById); // Get single resource by ID
router.put('/:id',ensureAuthenticated, updateResource); // Update a resource
router.delete('/:id',ensureAuthenticated, deleteResource); // Delete a resource
router.post('/:resourceId/toggle-complete',ensureAuthenticated,toggleCompleteResource)


export default router
