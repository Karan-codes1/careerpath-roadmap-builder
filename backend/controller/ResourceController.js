import Milestone from "../models/Milestone.js";
import Resource from "../models/Resource.js";
import User from "../models/User.js";


export const createMultipleResources = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const resources = req.body; // expecting an array of {title, url, type}
    //Array.isArray checks if resources is even an array or not and resource.length ensures it is not empty
    if (!Array.isArray(resources) || resources.length === 0) {
      return res.status(400).json({ error: 'Resources must be a non-empty array' });
    }

    const newResources = await Resource.insertMany( // Even if milestone id is not given it will be attached to the document because of the following code
      resources.map((res) => ({
        ...res,
        milestone: milestoneId,
      }))
    );

    const resourceIds = newResources.map((res) => res._id); // Extract resource_ids of inserted resources documents

    await Milestone.findByIdAndUpdate(milestoneId, {
      $push: { resources: { $each: resourceIds } } // Add resource_ids to the milestone
    });

    res.status(201).json({ message: 'Resources created successfully', resources: newResources });

  } catch (error) {
    res.status(500).json({ error: 'Failed to create resources', message: error.message });
  }
};



export const getResourcesByMilestoneId = async (req, res) => {
  try {
    const { milestoneId } = req.params
    const milestone = await Milestone.findById(milestoneId).populate('resources').populate('roadmap');

    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    res.status(200).json({ milestone, resources: milestone.resources }); // ✅ wrap inside object

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources', message: error.message })
  }
}

export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resource', message: error.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Resource not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resource', message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    // Remove from milestone's resources array
    await Milestone.findByIdAndUpdate(resource.milestone, {
      $pull: { resources: resource._id },
    });

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resource', message: error.message });
  }
};


export const toggleCompleteResource = async (req, res) => {
  try {
    const userId = req.user._id;
    const { resourceId } = req.params
    console.log("resourceId:", resourceId);


    // Find user 
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Fallback in case completedResources is undefined
    if (!user.completedResources) user.completedResources = [];

    const index = user.completedResources.findIndex((id) => {
      return id.toString() === resourceId.toString();
    });


    if (index > -1) {
      // Already completed → uncomplete
      user.completedResources.splice(index, 1);
      //splice is used for removing elements  // index,num of elements
      await user.save();
      return res.status(200).json({
        message: "Resource marked as incomplete",
        completedResources: user.completedResources,
      });
    } else {
      // Not completed → mark as complete
      user.completedResources.push(resourceId);
      await user.save();
      return res.status(200).json({
        message: "Resource marked as completed",
        completedResources: user.completedResources,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not toggle resource", error: error.message });
  }
}

