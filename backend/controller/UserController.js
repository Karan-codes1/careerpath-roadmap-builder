import User from "../models/User.js";

export const toggleBookmark = async(req,res)=>{
    try {
        const userId = req.user._id // 
        const {resourceId} = req.params;

        const user = await User.findById(userId)
    
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        const isBookmarked = user.bookmarkedResources.map(id =>id.toString()).includes(resourceId);


        if(!isBookmarked){
            // Resource is not bookmarked so do it
            await User.findByIdAndUpdate(userId,{
                $push :{bookmarkedResources: resourceId}
            })
            return res.status(200).json({ message: "Resource bookmarked successfully" });
        }else{
            await User.findByIdAndUpdate(userId,{
                $pull:{bookmarkedResources:resourceId}
            })
            return res.status(200).json({ message: "Resource unbookmarked successfully" });
        }

    } catch (error) {
    res.status(500).json({
      message: "Unable to toggle bookmark",
      error: error.message
    });
  }
}


export const getBookmarkedResources = async(req,res)=>{
    try {
        console.log('Request cameeeeee') 
        const user_id = req.user._id;
        const user = await User.findById(user_id).populate('bookmarkedResources');
        if(!user){
            return res.status(404).json({message:'Could not get bookmarked resources'})
        }
        res.status(200).json({message:'Bookmarked resources fetched successfully',bookmarkedResources:user.bookmarkedResources}) 
    } catch (error) {                                                             // key:value
        res.status(500).json({message: 'Unable to fetch bookmarked resources',
      error: error.message,})
    }

}
