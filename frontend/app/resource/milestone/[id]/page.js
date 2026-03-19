"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import { useSession } from "next-auth/react";
import { ResourceItem } from "@/components/ResourceCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  VideoIcon,
  BookIcon,
  FileTextIcon,
  GraduationCapIcon,
} from "lucide-react";

export default function ViewAllResources() {
  const { id } = useParams();
  const router = useRouter();

  // ✅ NextAuth
  const { data: session, status } = useSession();
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
      router.push("/");
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

  const currentIcon =
    typeFilters.find((f) => f.value === filterType)?.icon || Filter;
  const CurrentIcon = currentIcon;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Milestone Header */}
      <h1 className="text-2xl font-bold text-[#339999] mt-4 mb-2">
        {milestone?.order && (
          <span className="text-[#339999] bg-clip-text font-bold">
            Milestone {milestone.order}:
          </span>
        )}
        {milestone?.title || "Milestone Resources"}
      </h1>
      <p className="text-gray-600 mb-6">{milestone?.description}</p>

      {/* Filters Row */}
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-6">
        {/* Resource Type Buttons */}
        <div className="flex gap-3 flex-wrap">
          {typeFilters
            .filter((f) => f.value !== "all")
            .map((filter) => {
              const Icon = filter.icon;
              const isActive = filterType === filter.value;
              const count = typeCounts[filter.value] || 0;

              return (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-left transition-all ${
                    isActive
                      ? "bg-[#0c0c1d] text-white"
                      : " border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium">{filter.label}</div>
                    <div className="text-xs opacity-70">
                      {count} {count === 1 ? "item" : "items"}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        {/* Difficulty Filter */}
        <div className="w-40">
          <Select
            value={difficultyFilter}
            onValueChange={(val) => setDifficultyFilter(val)}
          >
            <SelectTrigger className="bg-gray-100 w-full">
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
      <div className="flex items-center justify-between py-5">
        <p className="text-sm text-muted-foreground">
          Showing {filteredResources.length} of {resources.length} resources
        </p>

        {(searchQuery || filterType !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setFilterType("all");
              setDifficultyFilter("all");
            }}
            className="hover:bg-gray-100"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Resource List with Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="h-20 sm:h-24 w-full bg-gray-100 rounded-lg animate-pulse p-4"
            />
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <p className="text-gray-500">No matching resources found.</p>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((res) => (
            <div
              key={res._id}
              className={`rounded-lg transition-colors cursor-pointer p-4 sm:p-6 ${
                clickedResourceId === res._id
                  ? "bg-gray-100"
                  : "bg-transparent"
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
  );
}
