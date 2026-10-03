"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { ResourceItem } from "@/components/ResourceCard";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Filter,
  VideoIcon,
  BookIcon,
  FileTextIcon,
  GraduationCapIcon,
} from "lucide-react";

export default function ViewAllResources() {
  const { id } = useParams();
  const router = useRouter();

  const { status } = useAuth();
  const isLoggedIn = status === "authenticated";

  const [resources, setResources] = useState([]);
  const [milestone, setMilestone] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const difficultyFilters = ["all", "beginner", "intermediate", "advanced"];

  const [clickedResourceId, setClickedResourceId] = useState(null);

  useEffect(() => {
    // 🔐 Redirect if not logged in
    if (status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${encodeURIComponent(`/resource/milestone/${id}`)}`);
      return;
    }

    if (status !== "authenticated") return;

    const fetchResources = async () => {
      try {
        const res = await api.get(`/resource/milestone/${id}`);
        setMilestone(res.data.milestone);
        setResources(res.data.resources);
      } catch (error) {
        console.error("Error fetching full resource list:", error);
      }
      setLoading(false);
    };

    fetchResources();
  }, [id, status, router]);

  // ⏳ Prevent UI flicker
  if (status === "loading") return null;
  if (!isLoggedIn) return null;

  const filteredResources = resources.filter((res) => {
    const matchesType =
      filterType === "all" || filterType === "" ? true : res.type === filterType;

    const matchesDifficulty =
      difficultyFilter === "all" || difficultyFilter === ""
        ? true
        : res.difficulty === difficultyFilter;

    return matchesType && matchesDifficulty;
  });

  const typeCounts = resources.reduce(
    (acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    },
    { video: 0, article: 0, book: 0, course: 0 }
  );

  const typeFilters = [
    { value: "all", label: "All Types", icon: Filter },
    { value: "video", label: "Videos", icon: VideoIcon },
    { value: "article", label: "Articles", icon: FileTextIcon },
    { value: "book", label: "Books", icon: BookIcon },
    { value: "course", label: "Courses", icon: GraduationCapIcon },
  ];

  const hasActiveFilters =
    Boolean(searchQuery) || filterType !== "all" || difficultyFilter !== "all";

  const roadmapId = milestone?.roadmap?._id || milestone?.roadmap;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {roadmapId && typeof roadmapId === "string" && (
          <Link
            href={`/roadmap/${roadmapId}`}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-[#267373]"
          >
            <ArrowLeft className="h-4 w-4" />
            {milestone?.roadmap?.title ? `Back to ${milestone.roadmap.title}` : "Back to roadmap"}
          </Link>
        )}

        {/* Milestone Header */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#339999] mb-2">
          {milestone?.order && (
            <span className="text-[#339999] font-bold">
              Milestone {milestone.order}:{" "}
            </span>
          )}
          {milestone?.title || "Milestone Resources"}
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">{milestone?.description}</p>

        {/* Filters Row */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-2">
          {/* Resource Type Buttons */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {typeFilters
              .filter((f) => f.value !== "all")
              .map((filter) => {
                const Icon = filter.icon;
                const isActive = filterType === filter.value;
                const count = typeCounts[filter.value] || 0;

                return (
                  <button
                    key={filter.value}
                    onClick={() => setFilterType(isActive ? "all" : filter.value)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl border text-left transition-all ${
                      isActive
                        ? "border-[#0c0c1d] bg-[#0c0c1d] text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-white" : "text-gray-600"
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium leading-tight">{filter.label}</div>
                      <div className="text-xs opacity-70">
                        {count} {count === 1 ? "item" : "items"}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Difficulty Filter */}
          <div className="w-full sm:w-44">
            <Select
              value={difficultyFilter}
              onValueChange={(val) => setDifficultyFilter(val)}
            >
              <SelectTrigger className="bg-white border-gray-200 w-full data-[size=default]:h-10">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border border-gray-200">
                {difficultyFilters.map((filter) => (
                  <SelectItem key={filter} value={filter}>
                    {filter === "all"
                      ? "All Levels"
                      : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex min-h-[3.5rem] items-center justify-between py-3">
          <p className="text-sm text-gray-500">
            Showing {filteredResources.length} of {resources.length} resources
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setDifficultyFilter("all");
              }}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Resource List with Skeleton */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-24 sm:h-28 w-full bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center text-gray-500">
            No matching resources found.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredResources.map((res) => (
              <div
                key={res._id}
                className={`rounded-xl cursor-pointer transition-shadow ${
                  clickedResourceId === res._id
                    ? "ring-2 ring-[#339999]/50"
                    : ""
                }`}
                onClick={() => {
                  setClickedResourceId(
                    clickedResourceId === res._id ? null : res._id
                  );
                  if (res.url) window.open(res.url, "_blank");
                  setTimeout(() => setClickedResourceId(null), 2000);
                }}
              >
                <ResourceItem
                  resource={{
                    id: res._id,
                    title: res.title,
                    description: res.description,
                    author: res.author,
                    url: res.url,
                    type: res.type,
                    tags: res.tags || [],
                    duration: res.duration || "",
                    difficulty: res.difficulty || undefined,
                    step: res.step || 0,
                    isOptional: res.isOptional || false,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
