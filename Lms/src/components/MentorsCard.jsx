import React from "react";

export default function MentorsCard({ mentors }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 mb-6">
      {/* HEADER */}
      <div className="p-4 border-b border-neutral-800">
        <div className="text-white font-semibold">Mentors</div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((m, i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-800 bg-neutral-950 p-4"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
                  {m.name?.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium leading-tight">
                        {m.name}
                      </div>

                      <div className="text-neutral-400 text-xs">{m.batch}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
