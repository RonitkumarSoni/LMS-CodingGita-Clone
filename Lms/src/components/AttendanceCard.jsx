import React from "react";

export default function AttendanceCard({ attendance }) {
  const { semester, present, total, bonus, percentLabel, startDate, endDate } =
    attendance;

  const percent = Math.round((present / total) * 100);

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 mb-6">
      {/* HEADER */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="text-white font-semibold">
            {semester} Attendance
            {/* BONUS */}
            <span className="ml-5">
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs bg-blue-600/20 border-blue-600/50 text-blue-400">
                +{bonus} Bonus
              </span>
            </span>
            {/* LABEL PERCENT */}
            <span className="ml-5">
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs bg-purple-600/20 border-purple-600/50 text-purple-400">
                {percentLabel} %
              </span>
            </span>
          </div>

          <div className="text-sm text-neutral-400">{percent}%</div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <div className="space-y-3">
          <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-3 bg-green-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-neutral-400">
            <span>
              Present {present} / {total} marked sessions
            </span>

            <span>
              {startDate} - {endDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
