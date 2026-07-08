'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();

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
    
    <Card 
    onClick={handleStartLearning}
    className="h-full flex flex-col rounded-xl border hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
  
  {/* HEADER */}
  <CardHeader className="pb-2 space-y-2">
    <div className="flex items-start justify-between gap-2">
      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
        {icon}
      </div>

      <Badge
        className={`${getDifficultyColor(difficulty)} whitespace-nowrap`}
      >
        {difficulty || "Unknown"}
      </Badge>
    </div>

    <CardTitle className="text-lg font-semibold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
      {title || "Untitled"}
    </CardTitle>

    <CardDescription className="text-sm text-muted-foreground line-clamp-2">
      {description || "No description available."}
    </CardDescription>
  </CardHeader>

  {/* CONTENT */}
  <CardContent className="flex flex-col flex-1 px-4 pb-4 pt-0">
    
    {/* META */}
    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        <span>{duration || "N/A"}</span>
      </div>

      <div className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        <span>{(learners?.toLocaleString?.() ?? 0)} learners</span>
      </div>
    </div>

    {/* SKILLS */}
    <div className="flex flex-wrap gap-2 mb-4">
      {(skills || []).slice(0, 3).map((skill) => (
        <Badge
          key={skill}
          variant="secondary"
          className="text-xs bg-gray-200 border border-gray-300 rounded-full px-2 py-0.5"
        >
          {skill}
        </Badge>
      ))}

      {(skills?.length || 0) > 3 && (
        <Badge
          variant="secondary"
          className="text-xs bg-gray-200 border border-gray-300 rounded-full px-2 py-0.5"
        >
          +{skills.length - 3} more
        </Badge>
      )}
    </div>

    {/* BUTTON — PINNED TO BOTTOM */}
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleStartLearning();
      }}
      className="mt-auto w-full flex items-center justify-center gap-2 text-white px-3 py-3 my-2 rounded-md text-sm transition-all hover:opacity-90"
      style={{ backgroundColor: "#030213" }}
    >
      Start Learning
      <ArrowRight className="w-4 h-4" />
    </button>
  </CardContent>
</Card>

  );
}
