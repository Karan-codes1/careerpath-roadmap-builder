'use client';

import { useEffect, useRef, Suspense } from 'react'; 
import Link from 'next/link';
import {
  Code,
  Palette,
  Database,
  Smartphone,
  Brain,
  TrendingUp,
  Shield,
  Cloud,
  Globe,
  Zap,
  Target,
  Briefcase,
  Layers,
  BarChart2,
} from "lucide-react";
import RoadmapCard from '@/components/RoadmapCard';
import { useSearchParams } from 'next/navigation';
import useRoadmapStore from '@/store/useRoadmapStore';

const iconMap = {
  code: Code,
  palette: Palette,
  database: Database,
  smartphone: Smartphone,
  brain: Brain,
  trendingup: TrendingUp,
  shield: Shield,
  cloud: Cloud,
  globe: Globe,
  zap: Zap,
  target: Target,
  briefcase: Briefcase,
  layers: Layers,
  barchart2: BarChart2,
};

function HomeContent() {
  const roadmapSectionRef = useRef(null);
  const searchParams = useSearchParams();
  const { roadmaps, loading, fetchRoadmaps } = useRoadmapStore();

  // Scroll to roadmap section if query message exists
  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "GetToRoadmaps" && roadmapSectionRef.current) {
      roadmapSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams]);

  // Fetch roadmaps once
  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  return (
    <>
      {/* HERO SECTION */}
      <section className="text-center py-8 md:py-10 bg-white">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 lg:mb-4 px-3">
          Your Journey to a <br className="hidden sm:block" /> Successful Career Starts Here
        </h1>
        <p className="text-gray-500 max-w-md md:max-w-lg lg:max-w-xl mx-auto mb-4 md:mb-5 px-4 text-sm md:text-base">
          Discover curated learning roadmaps designed by industry experts. Get step-by-step guidance to master in-demand skills and land your dream job.
        </p>

        <div className="flex justify-center gap-3 md:gap-4 mb-5 md:mb-6 flex-wrap">
          <button
            onClick={() => roadmapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#030213] hover:bg-black text-white px-4 md:px-5 py-2 rounded-md font-medium text-sm flex items-center gap-1"
          >
            Explore Roadmaps ⏷
          </button>
        </div>

        <div className="flex justify-center gap-6 md:gap-8 text-center text-gray-700 border-t pt-4 md:pt-5 max-w-xl mx-auto">
          <div>
            <p className="text-lg md:text-xl lg:text-2xl font-semibold">10+</p>
            <p className="text-xs md:text-sm">Career Roadmaps</p>
          </div>
          <div>
            <p className="text-lg md:text-xl lg:text-2xl font-semibold">500+</p>
            <p className="text-xs md:text-sm">Learning Resources</p>
          </div>
          <div>
            <p className="text-lg md:text-xl lg:text-2xl font-semibold">95%</p>
            <p className="text-xs md:text-sm">Success Rate</p>
          </div>
        </div>
      </section>

      {/* ROADMAPS SECTION */}
      <div className="bg-[#f4f7fa]">
        <div className="flex flex-col items-center px-4 py-4 md:py-6">
          <section className="text-center py-3 md:py-5 px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
              Choose Your Career Path
            </h2>
            <p
              ref={roadmapSectionRef}
              className="mt-2 md:mt-3 text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2"
            >
              Explore our comprehensive collection of career roadmaps. Each path is carefully crafted to take you from beginner to professional level.
            </p>
          </section>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl w-full mt-2 md:mt-3">
            {loading ? (
              // Skeleton Loader
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-md p-4 animate-pulse bg-white"
                >
                  <div className="h-6 w-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))
            ) : roadmaps.length > 0 ? (
              roadmaps.map((roadmap) => {
                const IconComponent = iconMap[roadmap.icon?.toLowerCase()] || Code;

                return (
                  <RoadmapCard
                    key={roadmap._id}
                    {...roadmap}
                    icon={<IconComponent className="w-6 h-6" />}
                  />
                );
              })
            ) : (
              <p className="text-gray-500 text-center col-span-full mt-4">
                No roadmaps available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <section className="bg-gray-50 py-8 md:py-10 text-center px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 md:mb-3 lg:mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-600 mb-5 md:mb-6 max-w-xl mx-auto text-sm md:text-base">
          Join thousands of learners who have successfully transitioned to their dream careers with our structured roadmaps and expert guidance.
        </p>
        <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
          <Link
            href="/login"
            className="bg-[#030213] hover:bg-black text-white px-5 md:px-6 py-2 rounded-md font-medium text-sm inline-block text-center"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </>
  );
}

export default function DashboardPageWrapper() {
  return (
    <Suspense fallback={<div>Loading homepage content...</div>}>
      <HomeContent />
    </Suspense>
  );
}
