import React from "react";
import Navbar from "../components/Navbar";

const todayAttendance = [
  { subject: "SU0202 - NodeJS", markedBy: "Reena", status: "present" },
  { subject: "SU0204 - OOPS(C++)", markedBy: "Reena", status: "present" },
  {
    subject: "SU0203 - NoSQL Database(MongoDB/Redis)",
    markedBy: "Reena",
    status: "present",
  },
  { subject: "SU0201 - ReactJS", markedBy: "Reena", status: "present" },
];

export default function StudentAttendance() {
  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  if (!user) return <div>No user</div>;

  const date = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen pt-20 bg-neutral-950 text-white">
      <Navbar />

      <div className="mx-auto pb-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          <div className="p-3 border-b border-neutral-800">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
              Overview
            </h2>
          </div>

          <div className="p-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
              <div className="p-3 border-b border-neutral-800">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight text-white">
                  Today's Attendance
                </h3>
                <p className="mt-1 text-[13px] font-medium text-neutral-400">
                  Date: {date}
                </p>
              </div>

              <div className="p-3 space-y-2">
                {todayAttendance.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-neutral-800 bg-black/70 px-4 py-2.5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-base sm:text-lg font-medium tracking-tight leading-snug text-white">
                        {item.subject}
                      </div>
                      <div className="mt-0.5 text-xs sm:text-sm text-neutral-400">
                        Marked by:{" "}
                        <span className="text-neutral-300">{item.markedBy}</span>
                      </div>
                    </div>

                    <span className="inline-flex items-center rounded-md border border-emerald-600/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium lowercase tracking-wide text-emerald-300">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
