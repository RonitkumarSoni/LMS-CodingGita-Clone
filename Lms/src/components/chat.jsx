import React from "react";
import Navbar from "./Navbar";

export default function Chat() {
  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  if (!user) return <div>No user</div>;

  return (
    <div className="min-h-screen pt-20 bg-neutral-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Chat Groups
        </h1>

        <p className="mt-1 text-sm sm:text-base text-neutral-300">
          Groups assigned to you and universal groups.
        </p>

        <p className="mt-8 text-base sm:text-lg text-neutral-300">
          No groups assigned to you yet.
        </p>
      </div>
    </div>
  );
}
