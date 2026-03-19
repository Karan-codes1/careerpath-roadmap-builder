import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ExternalLink, Star, Clock, Users } from "lucide-react";

export default function ProjectCard({  
  title,
  description,
  requiredSkills,
  keyFeatures,
  difficulty,
  duration,
  popularity // optional
}) {
  const getDifficultyColor = (level) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 p-4 md:p-6">
      <CardHeader className="p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="mb-2 font-semibold">{title}</CardTitle>
            <CardDescription className="text-muted-foreground text-gray-500">
              {description}
            </CardDescription>
          </div>
          <Badge variant="outline" className={getDifficultyColor(difficulty)}>
            {difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">{duration}</span>
          </div>
          {popularity !== undefined && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm">{popularity} builders</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-2 md:p-4">
        <div>
          <h4 className="mb-2 text-muted-foreground text-gray-500">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs border bg-gray-100 border-gray-300 rounded-full px-2 py-0.5">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-muted-foreground text-gray-500">Key Features</h4>
          <ul className="space-y-1">
            {keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Star className="w-3 h-3 mt-1 text-primary shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

      </CardContent>
    </Card>
  );
}
