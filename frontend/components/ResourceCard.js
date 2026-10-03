import { Clock, BookOpen, Video, FileText, GraduationCap, ExternalLink } from "lucide-react";

export function ResourceItem({ resource }) {
    const resourceConfig = {
        video: { icon: Video, label: "Video" },
        article: { icon: FileText, label: "Article" },
        book: { icon: BookOpen, label: "Book" },
        course: { icon: GraduationCap, label: "Course" },
    };

    const getTypeColor = (type) => {
        if (typeof type !== "string") return "bg-gray-100 text-gray-800";
        switch (type.toLowerCase()) {
            case "video": return "bg-red-100 text-red-800";
            case "article": return "bg-blue-100 text-blue-800";
            case "book": return "bg-green-100 text-green-800";
            case "course": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getDifficultyColor = (difficulty) => {
        if (typeof difficulty !== "string") return "bg-gray-100 text-gray-800";
        switch (difficulty.toLowerCase()) {
            case "beginner": return "bg-green-100 text-green-800";
            case "intermediate": return "bg-yellow-100 text-yellow-800";
            case "advanced": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const defaultConfig = { icon: FileText, label: "Unknown" };
    const config = resourceConfig[resource?.type?.toLowerCase()] || defaultConfig;
    const IconComponent = config.icon;
    const typeColorClass = getTypeColor(resource.type);
    const typeofdifficulty = getDifficultyColor(resource.difficulty);
    const hasTags = Array.isArray(resource.tags) && resource.tags.length > 0;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-[#339999]/60 hover:shadow-md sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">

                {/* Type icon */}
                <div className={`flex shrink-0 rounded-lg p-1.5 sm:p-2 ${typeColorClass}`}>
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0 flex-1 space-y-2">

                    {/* Title row */}
                    <div className="flex items-start gap-2">
                        <h3 className="mr-auto text-sm font-semibold leading-snug text-gray-900 sm:text-base">
                            {resource.title || "Untitled"}
                        </h3>

                        {resource.isOptional && (
                            <span className="shrink-0 rounded-md border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-700 sm:text-xs">
                                Optional
                            </span>
                        )}

                        <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium capitalize sm:text-xs ${typeColorClass}`}>
                            {resource.type || "Unknown"}
                        </span>
                    </div>

                    {/* Description */}
                    {resource.description && (
                        <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                            {resource.description}
                        </p>
                    )}

                    {/* Author, Duration, Difficulty */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 sm:text-sm">
                        {resource.author && <span>By {resource.author}</span>}
                        {resource.duration && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                {resource.duration}
                            </span>
                        )}
                        {resource.difficulty && (
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium capitalize sm:text-xs ${typeofdifficulty}`}>
                                {resource.difficulty}
                            </span>
                        )}
                    </div>

                    {/* Tags + Link */}
                    {(hasTags || resource.url) && (
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="flex flex-wrap gap-1.5">
                                {hasTags && resource.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600 sm:text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            {resource.url && (
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-[#339999] hover:text-[#267373] sm:text-sm"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    View Resource
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
