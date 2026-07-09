import Roadmap from "../models/Roadmap.js";
import Progress from "../models/Progress.js";

export const createMultipleRoadmaps = async (req, res) => {
  try {
    const roadmaps = req.body;

    if (!Array.isArray(roadmaps) || roadmaps.length === 0) {
      return res.status(400).json({ message: "Invalid input. Expected an array of roadmaps." });
    }

    // Attach user ID to each roadmap if available
    const userId = req.user?._id;
    const roadmapsWithUser = roadmaps.map((roadmap) => ({
      ...roadmap,
      createdBy: userId || null,
    }));

    const createdRoadmaps = await Roadmap.insertMany(roadmapsWithUser);
    return res.status(201).json({
      message: `${createdRoadmaps.length} roadmaps created successfully`,
      roadmaps: createdRoadmaps,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// CREATE Roadmap
export const createRoadmap = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      icon,
      duration,
      difficulty,
      learners,
      skills,
    } = req.body;

    const newRoadmap = new Roadmap({
      title,
      description,
      category,
      icon,
      duration,
      difficulty,
      learners: learners || 0,
      skills: skills || [],
      createdBy: req.user._id,
    });

    await newRoadmap.save();
    return res.status(201).json({ message: "Roadmap created", roadmap: newRoadmap });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// GET All Roadmaps
export const getAllRoadmaps = async (req, res) => {
  try {
    const allroadmaps = await Roadmap.find()
      .sort({ displayOrder: 1 })
      .select(
        "title description category icon duration difficulty learners skills"
    );
    return res.status(200).json({ allroadmaps });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getRoadmapWithUserProgress = async (req, res) => {

  const userId = req.user._id;   // Assuming you have user from auth middleware
  const { roadmapId } = req.params;

  try {
    // Fetch roadmap with milestones
    const roadmap = await Roadmap.findById(roadmapId).populate('milestones')

    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

    // Fetch user's progress for this roadmap
    const progress = await Progress.findOne({ user: userId, roadmap: roadmapId });

    // Map milestones and attach status from user's progress
    const milestonesWithStatus = roadmap.milestones.map(milestone => {
      const progressEntry = progress?.milestonesStatus?.find(ms => ms.milestone.toString() === milestone._id.toString());

      return {
        ...milestone.toObject(),
        status: progressEntry ? progressEntry.status : "not_started",
      };
    });

    return res.status(200).json({ roadmap, milestones: milestonesWithStatus });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getRoadmapProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roadmapId } = req.params;

    const roadmap = await Roadmap.findById(roadmapId).populate('milestones');
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    const totalMilestones = roadmap.milestones.length;

    const progress = await Progress.findOne({
      user: userId,
      roadmap: roadmapId,
    });

    if (!progress) {
      return res.status(200).json({
        totalMilestones,
        remainingMilestones: totalMilestones,
        completedMilestones: 0,
        progressPercentage: 0,
      });
    }


    const completedMilestones = progress.milestonesStatus.filter(
      (milestone) => milestone.status === "completed"
    );

    const completedCount = completedMilestones.length;

    const progressPercentage =
      totalMilestones > 0
        ? Math.round((completedCount / totalMilestones) * 100)
        : 0;

    const remainingMilestones = totalMilestones - completedCount;

    return res.status(200).json({
      totalMilestones,
      remainingMilestones,
      completedMilestones: completedCount,
      progressPercentage,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const putMultipleMilestonesIfCompleted = async (req, res) => {
  const userId = req.user._id;
  const { roadmapId } = req.params;
  const { milestoneId, status } = req.body; // expects an array of milestone ObjectIds

  if (!milestoneId) {
    return res.status(400).json({ error: "milestoneId is required" });
  }
  try {
    let progress = await Progress.findOne({ user: userId, roadmap: roadmapId });

    if (!progress) {
      // If no progress yet, create new with all milestoneIds
      progress = new Progress({
        user: userId,
        roadmap: roadmapId,
        milestonesStatus: [{
          milestone: milestoneId,
          status: status || "not_started",
          updatedAt: new Date(),
        }]
      });
    } else {
      // Find existing milestone status in array
      const normalizeStatus = (status) => {
        if (status === 'pending') return 'not_started'
        if (status === 'not started') return 'not_started'
        return status
      }


      const existing = progress.milestonesStatus.find(doc => doc.milestone.toString() === milestoneId)
      if (existing) {
        existing.status = normalizeStatus(status)  || existing.status;
      } else {
        // Add new milestone status
        progress.milestonesStatus.push({
          milestone: milestoneId,
          status: status || "not_started",
        })
      }
    }

    await progress.save();
    res.status(200).json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

export const deleteMilestonefromProgress = async (req, res) => {
  try {
    const userid = req.user._id;
    const { roadmapid } = req.params;
    const { milestoneid } = req.body;

    const roadmap = await Roadmap.findById(roadmapid).populate('milestones');
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }



    // Roadmap exists so remove document
    const progress = await Progress.findOne({ user: userid, roadmap: roadmapid })
    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const milestoneStatusObj = progress.milestonesStatus.find(doc => doc.milestone.toString() === milestoneid)

    if (milestoneStatusObj) {
      milestoneStatusObj.status = "not_started";
    }


    // Save updated progress document
    await progress.save();
    return res.status(200).json({ message: "Milestone status reset to not_started" });

  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
}