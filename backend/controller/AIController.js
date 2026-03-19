import dotenv from "dotenv";
import { connectDB } from "../models/db.js";
import Resource from "../models/Resource.js";
dotenv.config();

import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY?.trim() });

export const generateProjectIdeas = async (req, res) => {



  try {
    const { roadmapName, difficulty } = req.body;


    let difficultyText;
    if (difficulty && difficulty !== "Mixed") {
      difficultyText = `All ideas should be of ${difficulty} difficulty.`;
    } else {
      difficultyText = `Include 1 Beginner, 1 Intermediate, and 1 Advanced idea.`;
    }


    if (!roadmapName || typeof roadmapName !== "string") {
      return res.status(400).json({ error: "roadmapName is required" });
    }

    const prompt = `You are to return ONLY a JSON array — no explanations, no markdown formatting, no code fences.
Suggest exactly 3 unique project ideas for someone who completed the "${roadmapName}" roadmap.
${difficultyText}

Each object must have:
- title
- difficulty ("Beginner", "Intermediate", "Advanced")
- duration (e.g. "4-6 weeks")
- description
- requiredSkills (array of strings)
- keyFeatures (array of 3-5 strings)

Example:
[
  {
    "title": "Social Media Dashboard",
    "difficulty": "Advanced",
    "duration": "6-8 weeks",
    "description": "Build a social media management platform...",
    "requiredSkills": ["React", "Node.js", "Express", "MongoDB"],
    "keyFeatures": [
      "Multi-platform scheduling",
      "Real-time analytics",
      "User authentication"
    ]
  }
]`;


    console.log("AI request started...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let aiText = response.choices[0]?.message?.content?.trim();

    if (!aiText) {
      return res.status(500).json({ error: "Empty response from AI" });
    }

    // Remove ```json or ``` if present
    aiText = aiText.replace(/```json\s*|\s*```/g, "").trim();

    let projects;

    try {
      projects = JSON.parse(aiText);
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", parseError);
      console.error("Raw AI output:", aiText);
      return res.status(500).json({ error: "Invalid JSON from AI" });
    }


    res.json({ projects });
  } catch (error) {
    console.error("Error in generateProjectIdeas:", error);
    res.status(500).json({ error: "Failed to generate projects" });
  }
};




export const generateAIExplanation = async (req, res) => {
  try {
    const { question, correctAnswer, selectedAnswer } = req.body;

    if (!question || !correctAnswer) {
      return res.status(400).json({ error: "question and correctAnswer are required" });
    }

    const prompt = `
You are an AI tutor. Explain the following programming multiple-choice question in plain text only. 
Do not use Markdown, bold, italics, or special characters. 
Keep the explanation clear, concise, and beginner-friendly.

Rules:
- First explain why the correct answer is correct (step by step if needed).
- Then briefly explain why the other options are incorrect (only if provided).
- Keep explanations short: 2–5 sentences or simple bullet points.
- Focus only on programming concepts.

Question: ${question}
User's Answer: ${selectedAnswer ? selectedAnswer : "Not provided"}
Correct Answer: ${correctAnswer}

`;

    console.log("AI explanation request started...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const explanation = response.choices[0]?.message?.content?.trim();

    if (!explanation) {
      return res.status(500).json({ error: "Empty response from AI" });
    }

    res.json({ explanation });
  } catch (error) {
    console.error("Error in generateAIExplanation:", error);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
};


// -------------------------
// -------------------------
export const generateRecommendations = async (req, res) => {
  try {
    const { quizResults, quizTitle } = req.body; // optional quizTitle for context

    if (!quizResults || !Array.isArray(quizResults)) {
      return res.status(400).json({ error: "quizResults must be provided as an array" });
    }

    console.log("Received quizResults:", quizResults);

    await connectDB();
    console.log("DB connected");

    // Identify weak topics
    const weakTopics = quizResults
      .filter(q => q.score / q.total < 0.6)
      .map(q => q.topic);

    const uniqueWeakTopics = [...new Set(weakTopics)];
    console.log("Weak topics:", uniqueWeakTopics);

    // 🟢 CASE 1: User got all correct (no weak topics)
    if (uniqueWeakTopics.length === 0) {
      console.log("User got all answers correct — generating advanced recommendations.");

      // Try fetching some general or advanced-level resources
      const advancedResources = await Resource.aggregate([{ $sample: { size: 10 } }]); // limit sample for AI

      const prompt = `
You are an AI assistant in a career roadmap app.
The user got **all quiz answers correct**, showing strong understanding of this topic${quizTitle ? `: ${quizTitle}` : ""}.
From the following list of available resources, suggest 5 **advanced, high-quality, and reliable** materials that help the user go deeper or master advanced concepts.
Only include links that are working and trustworthy.

Available resources:
${advancedResources.map(r => `Title: ${r.title}, Type: ${r.type}, URL: ${r.url}`).join("\n")}

Return ONLY a valid JSON array in this format:
[
  { "title": "", "url": "", "type": "" }
]
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      let raw = response.choices[0].message.content.trim();
      raw = raw.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();

      if (raw.indexOf("[") !== -1 && raw.lastIndexOf("]") !== -1) {
        raw = raw.substring(raw.indexOf("["), raw.lastIndexOf("]") + 1);
      }

      let data;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.error("Failed to parse AI JSON:", err);
        console.error("Cleaned AI output:", raw);
        return res.json({
          message: "🎉 Perfect score! No weak areas detected.",
          recommendations: [],
        });
      }

      return res.json({
        message: "🎉 Excellent work! Here are some advanced resources to continue improving:",
        recommendations: data,
      });
    }

    // 🟡 CASE 2: User has weak topics
    // Extract core keywords from question text
    const keywords = uniqueWeakTopics
      .map(t =>
        t
          .replace(/[?]/g, "")
          .split(" ")
          .filter(w => w.length > 3)
          .slice(0, 3)
          .join("|")
      )
      .join("|");

    console.log("Search keywords:", keywords);

    // Fetch matching resources
    const allResources = await Resource.find({
      $or: [
        { title: { $regex: keywords, $options: "i" } },
        { type: { $regex: keywords, $options: "i" } },
      ],
    });

    console.log("Found resources:", allResources.length);

    // Construct AI prompt
    const prompt = `
You are an AI assistant in a career roadmap app.
The user struggled with these questions or topics:
${uniqueWeakTopics.join("\n")}

You have access to the following learning resources:
${allResources.map(r => `Title: ${r.title}, Type: ${r.type}, URL: ${r.url}`).join("\n")}

Select **only the 7 most reliable, verified, and currently working** resources that will help the user improve on these weak areas.
Ensure all selected links are real, working, and high-quality learning materials.

Return ONLY a valid JSON array in this format:
[
  { "title": "", "url": "", "type": "" }
]
`;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Clean AI output
    let raw = response.choices[0].message.content.trim();
    raw = raw.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();

    if (raw.indexOf("[") !== -1 && raw.lastIndexOf("]") !== -1) {
      raw = raw.substring(raw.indexOf("["), raw.lastIndexOf("]") + 1);
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse AI JSON:", err);
      console.error("Cleaned AI output:", raw);
      return res.json({ recommendations: [] });
    }

    res.json({ recommendations: data });

  } catch (err) {
    console.error("Error generating recommendations:", err);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};
