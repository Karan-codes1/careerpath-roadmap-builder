import { Star, Clock, Users } from "lucide-react";

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
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-lg md:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-gray-900 md:text-lg">{title}</h3>
        <span
          className={`shrink-0 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium ${getDifficultyColor(difficulty)}`}
        >
          {difficulty}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>

      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        {popularity !== undefined && (
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{popularity} builders</span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {(requiredSkills || []).map((skill, index) => (
              <span
                key={index}
                className="rounded-full border border-gray-300 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Key Features</h4>
          <ul className="space-y-1.5">
            {(keyFeatures || []).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <Star className="mt-1 h-3 w-3 shrink-0 text-[#339999]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
