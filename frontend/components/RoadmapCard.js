'use client';

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Clock, Users, ArrowRight } from "lucide-react";

export default function RoadmapCard({
  _id,
  title,
  description,
  icon,
  duration,
  difficulty,
  learners,
  skills,
}) {
  const router = useRouter();
  const { status } = useAuth();

  const getDifficultyColor = (level) => {
    if (typeof level !== "string") return "bg-gray-100 text-gray-800";
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStartLearning = () => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(`/roadmap/${_id}`)}`
      );
      return;
    }

    router.push(`/roadmap/${_id}`);
  };

  return (
    <div
      onClick={handleStartLearning}
      className="group flex h-full cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#339999]/60 hover:shadow-lg"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-2">
        <div className="shrink-0 rounded-lg bg-[#339999]/10 p-2.5 text-[#267373]">
          {icon}
        </div>

        <span
          className={`${getDifficultyColor(difficulty)} whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium`}
        >
          {difficulty || "Unknown"}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-gray-900 line-clamp-1 transition-colors group-hover:text-[#267373]">
        {title || "Untitled"}
      </h3>

      <p className="mt-1.5 text-sm leading-relaxed text-gray-600 line-clamp-2">
        {description || "No description available."}
      </p>

      {/* META */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{duration || "N/A"}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{(learners?.toLocaleString?.() ?? 0)} learners</span>
        </div>
      </div>

      {/* SKILLS */}
      <div className="mt-4 mb-5 flex flex-wrap gap-2">
        {(skills || []).slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
          >
            {skill}
          </span>
        ))}

        {(skills?.length || 0) > 3 && (
          <span className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            +{skills.length - 3} more
          </span>
        )}
      </div>

      {/* BUTTON — PINNED TO BOTTOM */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleStartLearning();
        }}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-[#030213] px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
      >
        Start Learning
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
