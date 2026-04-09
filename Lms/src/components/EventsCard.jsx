import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventsCard({ events }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 mb-6">
      {/* HEADER */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="text-white font-semibold">Upcoming Events</div>

          <div className="flex items-center gap-3 text-sm text-neutral-400">
            <span>{events.length} shown</span>

            <span
              onClick={() => navigate("/student/events")}
              className="text-xs underline hover:text-white cursor-pointer"
            >
              View all
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        {events.length === 0 ? (
          <div className="text-neutral-400 text-sm">No upcoming events.</div>
        ) : (
          <div className="space-y-2">
            {events.map((e, i) => (
              <div key={i} className="text-neutral-200 text-sm">
                {e}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
