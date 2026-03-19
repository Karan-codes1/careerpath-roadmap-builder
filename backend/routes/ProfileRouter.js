import express from 'express'
import ensureAuthenticated from '../Middlewares/Auth.js'
const router = express.Router()

router.get('/',ensureAuthenticated,(req,res)=>{
    console.log(req.user) 
    return res.status(200).json({
        success:true,
        message : 'User profile loaded',
        user:req.user
    })
})

export default router