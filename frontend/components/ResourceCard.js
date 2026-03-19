import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
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

    return (
        <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row items-start gap-3">

                {/* Icon (hidden on phones) - Now correctly uses the IconComponent and typeColorClass */}
                <div className={`hidden sm:flex p-2 rounded-md w-fit ${typeColorClass}`}>
                    <IconComponent className="w-5 h-5 text-inherit" />
                </div>

                <div className="flex-1 space-y-2 sm:space-y-3">

                    {/* NEW STRUCTURE: Icon, Optional Badge, Title & Type Badge - all aligned */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        
                        {/* Resource Type Icon (Visible ONLY on small screens) */}
                        <div className={`sm:hidden p-1 rounded-md ${typeColorClass}`}>
                            <IconComponent className="w-4 h-4 text-inherit" />
                        </div>
                        
                        {/* Optional Badge - Placed before the title */}
                        {resource.isOptional && (
                            <Badge variant="outline" className="text-[10px] sm:text-xs text-yellow-700 border-yellow-300 bg-yellow-50">
                                Optional
                            </Badge>
                        )}

                        {/* Title - Uses mr-auto to push the Type Badge to the right */}
                        <h3 className="font-medium leading-tight text-sm sm:text-base mr-auto">
                            {resource.title || "Untitled"}
                        </h3>

                        {/* Type Badge - Placed at the end of the line */}
                        <Badge className={`text-[10px] sm:text-xs rounded-md w-fit flex-shrink-0 ${typeColorClass}`}>
                            {resource.type || "Unknown"}
                        </Badge>
                    </div>

                    {/* Description */}
                    {resource.description && (
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                            {resource.description}
                        </p>
                    )}

                    {/* Author, Duration, Difficulty */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-sm text-muted-foreground">
                        <span>By {resource.author}</span>
                        {resource.duration && (
                            <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span>{resource.duration}</span>
                                </div>
                            </>
                        )}
                        {resource.difficulty && (
                            <>
                                <span>•</span>
                                <Badge className={`text-[10px] sm:text-xs rounded-md w-fit ${typeofdifficulty}`}>
                                    {resource.difficulty}
                                </Badge>
                            </>
                        )}
                    </div>

                    {/* Tags + Link */}
                    {(Array.isArray(resource.tags) && resource.tags.length > 0) || resource.url ? (
                        <div className="space-y-1">
                            {Array.isArray(resource.tags) && resource.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {resource.tags.map((tag, index) => (
                                        <Badge key={index} className="text-[9px] sm:text-xs border border-gray-250">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            {resource.url && (
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center px-1 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-sm font-medium border rounded-md border-gray-300 hover:bg-gray-100 transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3 sm:w-5 sm:h-4 mr-1 sm:mr-2" />
                                    View Resource
                                </a>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </Card>
    );
}