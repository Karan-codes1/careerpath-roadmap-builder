import express from 'express'
import ensureAuthenticated, { requireAdmin } from '../Middlewares/Auth.js';
import { createMultipleResources, deleteResource, getResourceById, getResourcesByMilestoneId, toggleCompleteResource, updateResource } from '../controller/ResourceController.js';

const router = express.Router();

router.post('/:milestoneId', ensureAuthenticated, requireAdmin, createMultipleResources); // Create resources for a milestone (admin only)
router.get('/milestone/:milestoneId', getResourcesByMilestoneId); // Get all resources of a milestone
router.get('/:id',ensureAuthenticated, getResourceById); // Get single resource by ID
router.put('/:id',ensureAuthenticated, requireAdmin, updateResource); // Update a resource (admin only)
router.delete('/:id',ensureAuthenticated, requireAdmin, deleteResource); // Delete a resource (admin only)
router.post('/:resourceId/toggle-complete',ensureAuthenticated,toggleCompleteResource)


export default router
