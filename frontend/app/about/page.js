import { Check } from "lucide-react";

export default function AboutPage() {
    const features = [
        "Structured career roadmaps with milestones",
        "Curated learning resources mapped to each step",
        "Short quizzes to assess understanding",
        "Quiz-based resource recommendations for weak areas",
        "AI-generated, real-world project ideas",
        "Difficulty-based progression",
        "Clean, distraction-free UI",
    ];

    const tech = ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "JWT Auth", "AI APIs"];

    return (
        <div className="bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="max-w-5xl mx-auto">

                {/* Hero */}
                <div className="text-center mb-10 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
                        About <span className="text-[#339999]">CareerPath</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        CareerPath helps learners stop guessing what to learn next by
                        providing structured roadmaps, curated resources, and
                        AI-generated project ideas.
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

                    {/* Problem */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-2 text-gray-900">
                            The Problem
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Learners often face information overload. Resources are scattered,
                            learning paths are unclear, and it’s difficult to know what to
                            learn, in what order, and why it matters for a specific career.
                        </p>
                    </div>

                    {/* Solution */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-2 text-gray-900">
                            The Solution
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            CareerPath provides clearly defined career roadmaps with milestones,
                            curated resources, and AI-powered project ideas that guide learners
                            step by step toward job-ready skills.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900">
                            What CareerPath Offers
                        </h2>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#339999]" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tech */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900">
                            Built With
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            CareerPath is built using modern, scalable technologies focused on
                            performance and developer experience.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {tech.map((item) => (
                                <span
                                    key={item}
                                    className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full font-medium text-gray-700"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-10 md:mt-12 text-center text-sm text-gray-500">
                    CareerPath is an evolving project focused on clarity, structure, and
                    practical learning.
                </div>
            </div>
        </div>
    );
}
