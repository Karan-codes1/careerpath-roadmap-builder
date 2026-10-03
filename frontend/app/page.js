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
  ChevronDown,
  ArrowRight,
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
      <section className="bg-white px-4 pt-12 pb-10 text-center md:pt-16 md:pb-12">
        <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl lg:leading-tight">
          Your Journey to a <br className="hidden sm:block" /> Successful Career Starts Here
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500 md:max-w-lg md:text-base lg:max-w-xl">
          Discover curated learning roadmaps designed by industry experts. Get step-by-step guidance to master in-demand skills and land your dream job.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 md:gap-4">
          <button
            onClick={() => roadmapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1.5 rounded-lg bg-[#030213] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black"
          >
            Explore Roadmaps
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 divide-x divide-gray-200 border-t border-gray-200 pt-6 text-center text-gray-700">
          <div className="px-2">
            <p className="text-xl font-bold text-gray-900 md:text-2xl">10+</p>
            <p className="mt-0.5 text-xs md:text-sm">Career Roadmaps</p>
          </div>
          <div className="px-2">
            <p className="text-xl font-bold text-gray-900 md:text-2xl">500+</p>
            <p className="mt-0.5 text-xs md:text-sm">Learning Resources</p>
          </div>
          <div className="px-2">
            <p className="text-xl font-bold text-gray-900 md:text-2xl">95%</p>
            <p className="mt-0.5 text-xs md:text-sm">Success Rate</p>
          </div>
        </div>
      </section>

      {/* ROADMAPS SECTION */}
      <div ref={roadmapSectionRef} className="scroll-mt-16 bg-[#f4f7fa]">
        <div className="flex flex-col items-center px-4 py-10 md:py-14">
          <section className="px-4 text-center md:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
              Choose Your Career Path
            </h2>
            <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-relaxed text-gray-600 md:text-base">
              Explore our comprehensive collection of career roadmaps. Each path is carefully crafted to take you from beginner to professional level.
            </p>
          </section>

          {/* Grid */}
          <div className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {loading ? (
              // Skeleton Loader
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                    <div className="h-5 w-20 rounded-md bg-gray-200"></div>
                  </div>
                  <div className="mb-3 h-5 w-3/4 rounded bg-gray-200"></div>
                  <div className="mb-2 h-3 w-full rounded bg-gray-200"></div>
                  <div className="mb-5 h-3 w-2/3 rounded bg-gray-200"></div>
                  <div className="h-10 w-full rounded-lg bg-gray-200"></div>
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
      <section className="bg-gray-50 px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm md:py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">
            Join thousands of learners who have successfully transitioned to their dream careers with our structured roadmaps and expert guidance.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-[#030213] px-6 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-black"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function DashboardPageWrapper() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading homepage content...</div>}>
      <HomeContent />
    </Suspense>
  );
}
