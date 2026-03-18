import React from "react";

export default function TopCard({ title, value }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 w-full">
      <div className="p-4">
        <p className="text-neutral-400 text-sm">{title}</p>

        <p className="text-2xl font-semibold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
