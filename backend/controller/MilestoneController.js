import Milestone from "../models/Milestone.js";
import Roadmap from "../models/Roadmap.js";
import User from "../models/User.js";


export const createMultipleMilestones = async (req, res) => {
    try {
        const milestones = req.body;
        const { roadmapid } = req.params;

        if (!Array.isArray(milestones) || milestones.length === 0) {
            return res.status(400).json({ message: "Invalid input. Expected an array of milestones." });
        }

        const milestoneDocs = milestones.map((milestone) => ({
            ...milestone,
            roadmap: roadmapid,
        }));

        // Insert all milestones
        const createdMilestones = await Milestone.insertMany(milestoneDocs);

        // Collect milestone IDs
        const milestoneIds = createdMilestones.map((m) => m._id);

        // Update the roadmap with all milestone IDs
        await Roadmap.findByIdAndUpdate(roadmapid, {
            $push: { milestones: { $each: milestoneIds } },
        });

        res.status(201).json({
            message: `${createdMilestones.length} milestones created and linked to roadmap`,
            milestones: createdMilestones,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating milestones", error: error.message });
    }
};


export const createMilestone = async (req, res) => {
    try {
        const { title, description, order, resources } = req.body;
        const { roadmapid } = req.params;

        const milestone = new Milestone({
            title,
            description,
            order,
            roadmap: roadmapid,
            resources
        })
        await milestone.save();

        await Roadmap.findByIdAndUpdate(roadmapid, {
            $push: { milestones: milestone._id }
        })


        res.status(201).json({ message: 'Milestone created successfully', milestone }); // status 201 indicates resource has been created
    } catch (error) {
        res.status(500).json({ message: 'Error creating milestone', error: error.message });
    }
}

export const getMilestonesByRoadmap = async (req, res) => {
    try {
        const { roadmapid } = req.params;
        const milestones = await Milestone.find({ roadmap: roadmapid }).sort({ order: 1 })

        res.status(200).json(milestones);   // status 200 means OK. 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching milestones', error: error.message });
    }

}

export const getMilestoneById = async (req, res) => {
    try {
        const { id } = req.params;

        const milestone = await Milestone.findById(id).populate('resources');
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

        res.status(200).json(milestone);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching milestone', error: error.message });
    }
}

export const updateMilestone = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updateMilestone = await Milestone.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true
        })

        /*
         new: true           | Return the updated document instead of the old one                  
         runValidators: true | Ensures that validation rules from the schema are applied on update */


        res.status(200).json({ updateMilestone })
    } catch (error) {
        res.status(500).json({ message: 'Error updating milestone', error: error.message })
    }
}

export const deleteMilestone = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log("Attempting to delete milestone with ID:", id);

        const milestone = await Milestone.findByIdAndDelete(id);
        // console.log("Result from findByIdAndDelete:", milestone);

        if (!milestone) {
            console.log("Milestone not found or already deleted.");
            return res.status(404).json({ message: 'Milestone not found' });
        }
        // Step : Remove milestone ID from its parent roadmap
        await Roadmap.findByIdAndUpdate(
            milestone.roadmap, //  milestone has a field `roadmap` 
            { $pull: { milestones: id } } // remove the milestone ID from roadmap's milestones array
        );
           // findByIdAndUpdate and Delete saves a database call

           
        res.status(200).json({ message: 'Milestone deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting milestone', error: error.message });
    }
}




export const getRoadmapProgress = async (req, res) => {
    try {
        const userid = req.user._id;
        const user = await User.findById(userid)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }


        const milestones = await Milestone.find()// .find() finds all the milestones 
        const completedMilestones = []; // empty array (no completed milestone)

        const completedResourceIds = user.completedResources.map(id => id.toString());// Convert user.completedResources to string for safer comparison

        for (const milestone of milestones) {
            let isComplete = true;

            for (const resourceId of milestone.resources) {
                if (!completedResourceIds.includes(resourceId.toString())) {
                    isComplete = false;
                    break;
                }
            }

            if (isComplete) {
                completedMilestones.push(milestone._id) //Every document in MongoDB has a unique _id field (even if you don’t define it manually).
                //milestone._id uniquely identifies that milestone in the database.
            }

        }
        res.status(200).json({ completedMilestones })
    } catch (error) {
        res.status(500).json({ message: 'Milestone check error:' });
    }
}


export const getMilestoneProgress = async (req, res) => {
    try {

        const userid = req.user._id;
        const { milestoneId } = req.params;

        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const milestone = await Milestone.findById(milestoneId)
        if (!milestone) {
            return res.status(404).json({ message: 'Milestone not found' });
        }

        const total = milestone.resources.length;
        const completedResourceIds = user.completedResources.map((id) => id.toString())

        const completed = milestone.resources.filter((resId) => {
            return completedResourceIds.includes(resId.toString())
        }).length;

        const progressInMilestone = total === 0 ? 0 : Math.round((completed / total) * 100);

        res.status(200).json({ progressInMilestone, completed, total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}