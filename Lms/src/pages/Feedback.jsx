import React from "react";
import { MessageSquare, Plus } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Feedback() {
  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  if (!user) return <div>No user</div>;

  const feedbackList = Array.isArray(user.feedback) ? user.feedback : [];
  const hasFeedback = feedbackList.length > 0;

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 py-5">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Feedback</h1>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            <Plus size={16} />
            Create Feedback
          </button>
        </div>

        {hasFeedback ? (
          <div className="space-y-3">
            {feedbackList.map((item, index) => (
              <article
                key={`${item?.id ?? index}`}
                className="rounded-lg border border-neutral-800 bg-neutral-900 p-4"
              >
                <h2 className="text-base font-semibold text-white">
                  {item?.title ?? `Feedback ${index + 1}`}
                </h2>
                <p className="mt-1 text-sm text-neutral-300">
                  {item?.message ?? item?.text ?? "No details available."}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-8">
            <div className="flex min-h-[42vh] flex-col items-center justify-center text-center">
              <div className="mb-5 rounded-full border border-neutral-800 bg-neutral-950 p-5">
                <MessageSquare
                  size={56}
                  className="text-neutral-500"
                  strokeWidth={1.5}
                />
              </div>

              <h2 className="text-2xl font-semibold text-neutral-300 sm:text-3xl">
                No feedback yet
              </h2>
              <p className="mt-2 text-base text-neutral-500">
                Share your thoughts and help us improve!
              </p>

              <button
                type="button"
                className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Submit Your First Feedback
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
