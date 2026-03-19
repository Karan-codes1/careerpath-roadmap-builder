import express from 'express'
import ensureAuthenticated from '../Middlewares/Auth.js';
const router = express.Router();

router.get('/',ensureAuthenticated,(req,res)=>{
    res.status(200).json({
        message:'This is dashboard',
        success:true
    })
})

export default router