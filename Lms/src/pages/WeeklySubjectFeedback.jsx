import React from "react";
import { BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";

export default function WeeklySubjectFeedback() {
  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  if (!user) return <div>No user</div>;

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Weekly Subject Feedback
          </h1>
          <p className="mt-2 text-sm text-neutral-400 sm:text-base">
            Share your thoughts on this week&apos;s subjects
          </p>
        </div>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 sm:p-10">
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <BookOpen size={64} strokeWidth={1.5} className="text-neutral-500" />

            <h2 className="mt-6 text-2xl font-semibold text-neutral-200 sm:text-3xl">
              All Caught Up!
            </h2>

            <p className="mt-3 text-base text-neutral-400">
              No subjects available for feedback at this time.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
