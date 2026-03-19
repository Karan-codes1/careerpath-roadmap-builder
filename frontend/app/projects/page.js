'use client';

// 1. Import Suspense from react
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/utils/api";
import ProjectCard from "@/components/ProjectCard";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";



function ProjectSkeletonCard() {
  return (
    <div className="h-full bg-white border rounded-xl p-4 md:p-6 animate-pulse">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          {/* Title */}
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          {/* Description */}
          <div className="h-4 bg-gray-200 rounded w-full mb-1" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        {/* Difficulty Badge */}
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>

      {/* Meta row (duration / popularity) */}
      <div className="flex gap-4 mb-6">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>

      {/* Required Skills */}
      <div className="mb-6">
        <div className="h-4 w-28 bg-gray-200 rounded mb-3" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-14 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Key Features */}
      <div>
        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-11/12" />
          <div className="h-3 bg-gray-200 rounded w-10/12" />
        </div>
      </div>

    </div>
  );
}


// 2. Rename the component containing the useSearchParams hook
function ProjectsContent() {
  const searchParams = useSearchParams(); // Now safely nested
  const roadmapName = searchParams.get("roadmapName") || "";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("Mixed");

  const difficultyOptions = ["Mixed", "Beginner", "Intermediate", "Advanced"];

  const fetchProjects = async () => {
    if (!roadmapName) {
      setError("Roadmap name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Fetching projects for roadmap:", roadmapName);
      const res = await api.post("/ai/projects", {
        roadmapName,
        difficulty: difficulty !== "Mixed" ? difficulty : undefined
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error fetching AI projects:", err);
      setError("Failed to generate project ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects =
    difficulty === "Mixed"
      ? projects
      : projects.filter((p) => p.difficulty === difficulty);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 p-6 bg-gray-800 text-white rounded-xl shadow-lg max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{roadmapName || "Roadmap"}</h1>
        <p className="text-base sm:text-lg opacity-90">
          Explore carefully crafted project ideas to reinforce the skills from this roadmap.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">Difficulty: {difficulty}</span>
          {/* <span className="bg-white/20 px-3 py-1 rounded-full">{filteredProjects.length} Project Ideas</span> */}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 max-w-5xl mx-auto">
        {/* Difficulty Selector */}
        <div className="w-full sm:w-60">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger
              className="bg-gray-800 text-white w-full rounded-lg border border-gray-300 h-14 flex items-center px-4"
            >
              <SelectValue placeholder="Set Difficulty (Mixed)" />
            </SelectTrigger>

            <SelectContent className="bg-gray-800 text-white rounded-md shadow-lg border border-gray-900">
              {difficultyOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="cursor-pointer rounded-md px-4 py-2 hover:bg-gray-900 focus:bg-gray-900"
                >
                  {option === "Mixed" ? "Set Difficulty (Mixed)" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <button
          onClick={fetchProjects}
          disabled={loading}
          className="text-white px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? "Generating..." : "Generate Project Ideas"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      {/* Empty State */}
      {!loading && projects.length === 0 && !error && (
        <div className="max-w-5xl mx-auto mt-8 bg-gray-50 border border-gray-200 rounded-xl px-6 py-10 ">
          <div className="flex flex-col items-center text-center">

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Generate project ideas for this roadmap 🚀
            </h3>

            <p className="text-gray-600 text-sm max-w-md mb-6">
              Get real-world, resume-ready project ideas tailored to your selected
              roadmap and difficulty level.
            </p>

            {/* Promise bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700 mb-8">
              <div className="bg-white rounded-lg border px-4 py-3">
                Real-world projects
              </div>
              <div className="bg-white rounded-lg border px-4 py-3">
                Difficulty-based progression
              </div>
              <div className="bg-white rounded-lg border px-4 py-3">
                Skills mapped to roadmap
              </div>
            </div>

            {/* Illustration */}
            <img
              src="/undraw_chat-with-ai_ir62.svg"
              alt="Project ideas preview"
              className="w-40 opacity-90 mb-4"
            />

            <p className="text-sm text-gray-500">
              Click <span className="font-medium text-gray-700">Generate Project Ideas</span> to begin
            </p>
          </div>
        </div>
      )}



      {/* Projects Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
            <ProjectSkeletonCard key={idx} />
          ))
          : filteredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              requiredSkills={project.requiredSkills}
              keyFeatures={project.keyFeatures}
              difficulty={project.difficulty}
              duration={project.duration}
            />
          ))}
      </div>

    </div>
  );
}

// 3. Export the wrapper component
export default function RoadmapProjects() {
  return (
    <Suspense fallback={<div>Loading project generator...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}