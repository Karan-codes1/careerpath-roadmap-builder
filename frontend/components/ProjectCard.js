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
      case "Beginner": return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
      case "Intermediate": return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "Advanced": return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
      default: return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-shadow duration-200 hover:shadow-lg md:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-gray-900 dark:text-gray-100 md:text-lg">{title}</h3>
        <span
          className={`shrink-0 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium ${getDifficultyColor(difficulty)}`}
        >
          {difficulty}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>

      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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

      <div className="mt-4 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {(requiredSkills || []).map((skill, index) => (
              <span
                key={index}
                className="rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Key Features</h4>
          <ul className="space-y-1.5">
            {(keyFeatures || []).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
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
