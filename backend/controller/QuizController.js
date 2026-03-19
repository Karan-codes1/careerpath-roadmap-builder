// controllers/quizController.js
import Quiz from "../models/Quiz.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, roadmapId, milestoneId, questions } = req.body; //For creating a quiz → put roadmapId in the body.
// For fetching a quiz → pass roadmapId in the URL parameters.

    // Basic validation
    if (!title || !roadmapId || !questions || !questions.length) {
      return res.status(400).json({
        success: false,
        message: "Title, roadmapId, and at least one question are required."
      });
    }

    // Create the quiz
    const quiz = new Quiz({
      title,
      roadmap: roadmapId,
      milestone: milestoneId || null, // Optional
      questions
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not create quiz."
    });
  }
};


// controllers/quizController.js

export const getquizforRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;

    if (!roadmapId) {
      return res.status(400).json({
        success: false,
        message: "roadmapId is required in params.",
      });
    }

    // Find all quizzes linked to this roadmap
    const quizzes = await Quiz.find({ roadmap: roadmapId })
      // .populate("milestone", "title description order") // populate milestone details (optional for now )
      .populate("roadmap", "title"); // populate roadmap info too

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quizzes found for this roadmap.",
      });
    }

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes for roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch quizzes.",
    });
  }
};
