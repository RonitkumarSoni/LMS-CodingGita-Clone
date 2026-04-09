import React from "react";
import { Link } from "react-router-dom";

export default function SubjectsCard({ subjects }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 lg:col-span-2">
      {/* HEADER */}
      <div className="p-4 border-b border-neutral-800 flex justify-between">
        <div className="text-white font-semibold">Subjects</div>

        <Link
          to="/student/attendance"
          className="text-sm text-neutral-400 hover:text-neutral-200"
        >
          View attendance
        </Link>
      </div>

      {/* BODY */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((s, i) => (
            <div
              key={i}
              className="rounded-lg border border-neutral-800 bg-neutral-950 p-4"
            >
              <div className="text-sm text-neutral-300 truncate">{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
