import express from 'express'
import ensureAuthenticated from '../Middlewares/Auth.js'
import { getBookmarkedResources, toggleBookmark } from '../controller/UserController.js';


const router = express.Router()
router.post('/:resourceId',ensureAuthenticated,toggleBookmark)

router.get('/',ensureAuthenticated,getBookmarkedResources)

export default router; 