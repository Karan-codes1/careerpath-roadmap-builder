export default function AboutPage() {
    return (
        <div className="bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-5xl mx-auto">

                {/* Hero */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        About CareerPath
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                        CareerPath helps learners stop guessing what to learn next by
                        providing structured roadmaps, curated resources, and
                        AI-generated project ideas.
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Problem */}
                    <div className="bg-white border rounded-xl p-6">
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
                    <div className="bg-white border rounded-xl p-6">
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
                    <div className="bg-white border rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900">
                            What CareerPath Offers
                        </h2>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Structured career roadmaps with milestones</li>
                            <li>• Curated learning resources mapped to each step</li>
                            <li>• Short quizzes to assess understanding</li>
                            <li>• Quiz-based resource recommendations for weak areas</li>
                            <li>• AI-generated, real-world project ideas</li>
                            <li>• Difficulty-based progression</li>
                            <li>• Clean, distraction-free UI</li>
                        </ul>
                    </div>

                    {/* Tech */}
                    <div className="bg-white border rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900">
                            Built With
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            CareerPath is built using modern, scalable technologies focused on
                            performance and developer experience.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-3 py-1 bg-gray-100 border rounded-full">Next.js</span>
                            <span className="px-3 py-1 bg-gray-100 border rounded-full">Node.js</span>
                            <span className="px-3 py-1 bg-gray-100 border rounded-full">MongoDB</span>
                            <span className="px-3 py-1 bg-gray-100 border rounded-full">Tailwind CSS</span>
                            <span className="px-3 py-1 bg-gray-100 border rounded-full">NextAuth</span>
                            <span className="px-3 py-1 bg-gray-100 border rounded-full">AI APIs</span>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center text-sm text-gray-500">
                    CareerPath is an evolving project focused on clarity, structure, and
                    practical learning.
                </div>
            </div>
        </div>
    );
}
