import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../models/db.js";
import Resource from "../models/Resource.js";
import Quiz from "../models/Quiz.js";
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

    
//. Validating the output
// 1) The output should be a valid JSON array of objects.
// 2) Each object must have the required fields: title, difficulty, duration, description, requiredSkills, keyFeatures.
// 3) The size of the array must be exactly 3.
// 4) Is there any age restrictive content? If yes, return an error message instead of the array.



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
    const { questionId, selectedAnswer } = req.body;

    if (!questionId) {
      return res.status(400).json({ error: "questionId is required" });
    }

    // Question subdocument _ids are globally unique ObjectIds, so we can find
    // the owning quiz directly by matching inside the questions array.
    const quiz = await Quiz.findOne({ "questions._id": questionId });
    const question = quiz?.questions.id(questionId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Trust ONLY the database for correctness — selectedAnswer is just an index,
    // the client never gets to say what "correct" means.
    const hasAnswer =
      typeof selectedAnswer === "number" && question.options[selectedAnswer] !== undefined;

    const correctAnswerText = question.options[question.correctIndex];
    const selectedAnswerText = hasAnswer ? question.options[selectedAnswer] : "Not Answered";
    const isCorrect = hasAnswer && selectedAnswer === question.correctIndex;

    const prompt = `
You are an AI tutor. Explain the following programming multiple-choice question in plain text only.
Do not use Markdown, bold, italics, or special characters.
Keep the explanation clear, concise, and beginner-friendly.

Rules:
- If the user's answer is correct, explain why it is correct.
- If the user's answer is wrong, explain why it is wrong and why the correct answer is right.
- Keep explanations short: 2–5 sentences or simple bullet points.
- Focus only on programming concepts.

Question: ${question.question}
User's Answer: ${selectedAnswerText}
Correct Answer: ${correctAnswerText}

`;

// output validation
// 1) The response is in valid JSON or not
// 2) Does the max length is of 300 characters or not.


    console.log("AI explanation request started...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const explanation = response.choices[0]?.message?.content?.trim();

    if (!explanation) {
      return res.status(500).json({ error: "Empty response from AI" });
    }

    res.json({ isCorrect, explanation });
  } catch (error) {
    console.error("Error in generateAIExplanation:", error);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
};


// Text block the AI sees: an ID + enough context to judge relevance, but NO url.
// The AI can only ever refer to a resource by an ID from this list.
const describeCandidatesForAI = (resources) =>
  resources.map(r => `ID: ${r._id}, Title: ${r.title}, Type: ${r.type}`).join("\n");

// Turns the AI's raw text into trusted resource objects.
// Any ID the AI didn't get in `candidates` is discarded — the AI selects, it never authors data.
const resolveRecommendedIds = (aiRawText, candidates) => {
  let raw = (aiRawText || "").trim();
  raw = raw.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();

  if (raw.indexOf("[") !== -1 && raw.lastIndexOf("]") !== -1) {
    raw = raw.substring(raw.indexOf("["), raw.lastIndexOf("]") + 1);
  }

  let ids;
  try {
    ids = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse AI JSON:", err);
    console.error("Cleaned AI output:", raw);
    return [];
  }

  if (!Array.isArray(ids)) return [];

  const candidatesById = new Map(candidates.map(r => [r._id.toString(), r]));

  return ids
    .filter(id => typeof id === "string" && candidatesById.has(id))
    .map(id => {
      const r = candidatesById.get(id);
      return { title: r.title, url: r.url, type: r.type };
    });
};

// Concepts come from the AI, so they may contain regex metacharacters ("C++", "f(x)").
// Escaping them keeps the MongoDB $regex search from breaking.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// STEP 1 of the weak-topic flow.
// Instead of keyword-matching the raw question text, ask the AI what the user
// actually misunderstood. Returns [] if the call fails, so the caller can fall
// back to the original topic-text behaviour.
const identifyWeakConcepts = async (weakResults, quizTitle) => {
  const mistakes = weakResults
    .map((r, i) => {
      const lines = [`${i + 1}. Question: ${r.question || r.topic || "(not provided)"}`];
      if (r.userAnswer) lines.push(`   User's answer: ${r.userAnswer}`);
      if (r.correctAnswer) lines.push(`   Correct answer: ${r.correctAnswer}`);
      if (r.topic && r.question) lines.push(`   Topic: ${r.topic}`);
      if (r.score !== undefined && r.total !== undefined) {
        lines.push(`   Score: ${r.score}/${r.total}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");

  const prompt = `
You are a programming tutor reviewing a student's quiz mistakes${quizTitle ? ` on "${quizTitle}"` : ""}.

Here is what the student got wrong:
${mistakes}

Identify the underlying concepts or misconceptions the student needs to improve.
Focus on the concept behind the mistake, not the wording of the question.
Example: "confused about virtual functions and runtime polymorphism".

Return ONLY a valid JSON array of 1-5 short concept phrases, in this format:
["runtime polymorphism", "virtual functions"]
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2, // analysis, not creativity — keep it consistent
    });

    let raw = (response.choices[0]?.message?.content || "").trim();
    raw = raw.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();

    if (raw.indexOf("[") !== -1 && raw.lastIndexOf("]") !== -1) {
      raw = raw.substring(raw.indexOf("["), raw.lastIndexOf("]") + 1);
    }

    const concepts = JSON.parse(raw);
    if (!Array.isArray(concepts)) return [];

    return concepts.filter(c => typeof c === "string" && c.trim());
  } catch (err) {
    console.error("Failed to identify weak concepts:", err);
    return [];
  }
};

export const generateRecommendations = async (req, res) => {
  try {
    const { quizResults } = req.body; // [{ questionId, userSelectedAnswer }]

    if (!quizResults || !Array.isArray(quizResults)) {
      return res.status(400).json({ error: "quizResults must be provided as an array" });
    }

    console.log("Received quizResults:", quizResults);

    await connectDB();
    console.log("DB connected");

    // Ignore anything that isn't a usable ObjectId so a bad id can't throw a CastError
    const questionIds = quizResults
      .map(r => r.questionId)
      .filter(id => mongoose.Types.ObjectId.isValid(id));

    if (questionIds.length === 0) {
      return res.status(400).json({ error: "A valid questionId is required for each result" });
    }

    // Question subdocument _ids are globally unique, so one query fetches every
    // quiz that owns any of these questions.
    const quizzes = await Quiz.find({ "questions._id": { $in: questionIds } });

    const questionsById = new Map();
    for (const quiz of quizzes) {
      for (const q of quiz.questions) {
        questionsById.set(q._id.toString(), { question: q, quizTitle: quiz.title });
      }
    }

    // Grade on the backend. correctIndex comes from MongoDB — the client only
    // told us which option it picked, never what the right answer is.
    const graded = [];
    for (const result of quizResults) {
      const entry = questionsById.get(String(result.questionId));
      if (!entry) continue; // unknown question id — skip it

      const { question, quizTitle } = entry;
      const selected = result.userSelectedAnswer;
      const hasAnswer =
        typeof selected === "number" && question.options[selected] !== undefined;

      graded.push({
        question: question.question,
        topic: quizTitle,
        correctAnswer: question.options[question.correctIndex],
        userAnswer: hasAnswer ? question.options[selected] : "Not Answered",
        isCorrect: hasAnswer && selected === question.correctIndex,
      });
    }

    if (graded.length === 0) {
      return res.status(404).json({ error: "No matching questions found" });
    }

    const total = graded.length;
    const score = graded.filter(g => g.isCorrect).length;
    const wrongAnswers = graded.filter(g => !g.isCorrect);
    console.log(`Backend-calculated score: ${score}/${total}`);

    // 🟢 CASE 1: User got everything correct — nothing to recommend,
    // so no resource lookup and no OpenAI call at all.
    if (wrongAnswers.length === 0) {
      return res.json({
        message:
          "🎉 Excellent! You got everything right. You have mastered this topic. Move ahead to the next milestone!",
        score,
        total,
        recommendations: [],
      });
    }

    // 🟡 CASE 2: User has weak areas
    // STEP 1 (AI): work out WHAT the user actually misunderstood
    const quizTitle = graded[0].topic;
    const concepts = await identifyWeakConcepts(wrongAnswers, quizTitle);
    console.log("AI-identified concepts:", concepts);

    // If the analysis step failed, fall back to the question text itself
    const searchTerms =
      concepts.length > 0
        ? concepts
        : wrongAnswers.map(r => r.question || r.topic).filter(Boolean);

    // STEP 2 (DB): same keyword search as before, now driven by the concepts
    const keywords = [...new Set(searchTerms)]
      .map(t =>
        t
          .replace(/[?]/g, "")
          .split(" ")
          .filter(w => w.length > 3)
          .slice(0, 3)
          .map(escapeRegex)
          .join("|")
      )
      .filter(Boolean)
      .join("|");

    console.log("Search keywords:", keywords);

    if (!keywords) {
      return res.json({ recommendations: [] });
    }

    // Fetch matching resources
    const allResources = await Resource.find({
      $or: [
        { title: { $regex: keywords, $options: "i" } },
        { description: { $regex: keywords, $options: "i" } },
      ],
    });

    console.log("Found resources:", allResources.length);

    if (allResources.length === 0) {
      return res.json({ recommendations: [] });
    }

    // STEP 3 (AI): unchanged — select the best candidates, by ID only
    const prompt = `
You are an AI assistant in a career roadmap app.
The user needs to improve on these concepts:
${searchTerms.join("\n")}

You have access to the following learning resources:
${describeCandidatesForAI(allResources)}

Select the IDs of the **7 most relevant** resources that will help the user improve on these concepts.

Return ONLY a valid JSON array of the selected resource IDs, in this format:
["<id1>", "<id2>", "<id3>"]
`;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const recommendations = resolveRecommendedIds(
      response.choices[0]?.message?.content,
      allResources
    );

    res.json({ recommendations });

  } catch (err) {
    console.error("Error generating recommendations:", err);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};
