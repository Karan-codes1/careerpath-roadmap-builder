'use client';

// 1. Import Suspense from react
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/utils/api";
import ProjectCard from "@/components/ProjectCard";
import { Sparkles, Check } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";



function ProjectSkeletonCard() {
  return (
    <div className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 md:p-6 animate-pulse">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          {/* Title */}
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          {/* Description */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>

        {/* Difficulty Badge */}
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>

      {/* Meta row (duration / popularity) */}
      <div className="flex gap-4 mb-6">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Required Skills */}
      <div className="mb-6">
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Key Features */}
      <div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-11/12" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10/12" />
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
      const res = await api.post("/ai/projects", {
        roadmapName,
        difficulty: difficulty !== "Mixed" ? difficulty : undefined
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error fetching AI projects:", err);
      setError(
        err?.response?.status === 429
          ? err.response.data?.message || "You've reached the limit for AI features. Please try again later."
          : "Failed to generate project ideas. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects =
    difficulty === "Mixed"
      ? projects
      : projects.filter((p) => p.difficulty === difficulty);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 lg:px-8 py-6 md:py-8 overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 p-6 md:p-8 bg-gray-800 dark:border dark:border-gray-700 text-white rounded-2xl shadow-lg max-w-5xl mx-auto">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/70">Project ideas</p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{roadmapName || "Roadmap"}</h1>
        <p className="text-sm sm:text-base text-white/90">
          Explore carefully crafted project ideas to reinforce the skills from this roadmap.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">Difficulty: {difficulty}</span>
          {/* <span className="bg-white/20 px-3 py-1 rounded-full">{filteredProjects.length} Project Ideas</span> */}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6 max-w-5xl mx-auto">
        {/* Difficulty Selector */}
        <div className="w-full sm:w-60">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger
              className="bg-gray-800 dark:bg-gray-700 text-white w-full rounded-lg border border-gray-700 data-[size=default]:h-11 flex items-center px-4"
            >
              <SelectValue placeholder="Set Difficulty (Mixed)" />
            </SelectTrigger>

            <SelectContent className="bg-gray-800 dark:bg-gray-700 text-white rounded-md shadow-lg border border-gray-900 dark:border-gray-600">
              {difficultyOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="cursor-pointer rounded-md px-4 py-2 hover:bg-gray-900 dark:hover:bg-gray-600 focus:bg-gray-900 dark:focus:bg-gray-600"
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
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gray-800 dark:bg-gray-700 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-900 dark:hover:bg-gray-600 disabled:opacity-50 sm:w-auto"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? "Generating..." : "Generate Project Ideas"}
        </button>
      </div>

      {error && (
        <p className="mx-auto mt-2 max-w-5xl rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && !error && (
        <div className="max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-10 shadow-sm">
          <div className="flex flex-col items-center text-center">

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Generate project ideas for this roadmap 🚀
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mb-6">
              Get real-world, resume-ready project ideas tailored to your selected
              roadmap and difficulty level.
            </p>

            {/* Promise bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700 dark:text-gray-300 mb-8">
              {["Real-world projects", "Difficulty-based progression", "Skills mapped to roadmap"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3"
                >
                  <Check className="h-4 w-4 shrink-0 text-[#339999]" />
                  {item}
                </div>
              ))}
            </div>

            {/* Illustration */}
            <img
              src="/undraw_chat-with-ai_ir62.svg"
              alt="Project ideas preview"
              className="w-40 opacity-90 mb-4"
            />

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click <span className="font-medium text-gray-700 dark:text-gray-300">Generate Project Ideas</span> to begin
            </p>
          </div>
        </div>
      )}



      {/* Projects Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-7xl mx-auto">
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
    <Suspense fallback={<div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading project generator...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
