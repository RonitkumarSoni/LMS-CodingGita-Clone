import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

const fallbackSemesters = [
  {
    id: "semester-1",
    title: "Semester 1",
    startDate: "2025-07-31",
    endDate: "2026-01-28",
    totalMarked: 272,
    presentCount: 253,
    absentCount: 19,
    leaveDays: 0,
    internLeaveDays: 0,
  },
  {
    id: "semester-2",
    title: "Semester 2",
    startDate: "2026-01-29",
    endDate: "2026-06-30",
    totalMarked: 210,
    presentCount: 184,
    absentCount: 26,
    leaveDays: 1,
    internLeaveDays: 0,
  },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

const clampPercent = (value) => Math.max(0, Math.min(100, value));

const getDurationDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const duration = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(duration, 0);
};

const normalizeSemester = (item, index) => {
  const presentCount = Number(item?.presentCount ?? item?.present ?? 0);
  const absentCount = Number(item?.absentCount ?? item?.absent ?? 0);
  const leaveDays = Number(item?.leaveDays ?? item?.leave ?? 0);
  const internLeaveDays = Number(item?.internLeaveDays ?? item?.internLeave ?? 0);

  const totalMarked = Number(
    item?.totalMarked ?? item?.total ?? presentCount + absentCount,
  );
  const percentage =
    totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

  const attendancePercent = clampPercent(
    Number(item?.attendancePercent ?? item?.attendance ?? percentage),
  );

  return {
    id: item?.id ?? `semester-${index + 1}`,
    title: item?.title ?? item?.name ?? `Semester ${index + 1}`,
    startDate: item?.startDate ?? fallbackSemesters[index]?.startDate,
    endDate: item?.endDate ?? fallbackSemesters[index]?.endDate,
    totalMarked,
    presentCount,
    absentCount,
    leaveDays,
    internLeaveDays,
    attendancePercent,
  };
};

const statCardStyles = {
  total: "text-white",
  present: "text-emerald-400",
  absent: "text-rose-400",
  attendance: "text-sky-400",
};

const breakdownBadgeStyles = {
  present: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  absent: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  leave: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  internLeave: "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

export default function SemesterAttendance() {
  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  if (!user) return <div>No user</div>;

  const semesters = useMemo(() => {
    const semesterData = Array.isArray(user?.semesterAttendance)
      ? user.semesterAttendance
      : fallbackSemesters;

    if (semesterData.length === 0) {
      return fallbackSemesters.map(normalizeSemester);
    }

    return semesterData.map(normalizeSemester);
  }, [user]);

  const [selectedSemesterId, setSelectedSemesterId] = useState(semesters[0]?.id);

  const selectedSemester =
    semesters.find((item) => item.id === selectedSemesterId) ?? semesters[0];

  const statusText =
    selectedSemester.attendancePercent >= 90
      ? "Your attendance is good. Keep up the consistent attendance!"
      : selectedSemester.attendancePercent >= 75
      ? "Attendance is average. Try to maintain a better streak."
      : "Attendance is low. Improve consistency to avoid shortage risk.";

  const statusTextColor =
    selectedSemester.attendancePercent >= 90
      ? "text-emerald-400"
      : selectedSemester.attendancePercent >= 75
      ? "text-amber-300"
      : "text-rose-300";

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Semester Attendance
          </h1>
          <p className="mt-2 text-sm text-neutral-400 sm:text-base">
            View your attendance statistics by semester
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <section className="h-fit rounded-xl border border-neutral-800 bg-neutral-900">
            <header className="border-b border-neutral-800 p-4">
              <h2 className="text-white font-semibold">Semesters</h2>
            </header>

            <div className="space-y-2 p-4">
              {semesters.map((semester) => {
                const isActive = selectedSemester.id === semester.id;

                return (
                  <button
                    key={semester.id}
                    type="button"
                    onClick={() => setSelectedSemesterId(semester.id)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "border-blue-500 bg-blue-950/55"
                        : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                    }`}
                  >
                    <div className="text-sm font-semibold text-white">
                      {semester.title}
                    </div>
                    <div className="mt-1 text-xs text-neutral-400">
                      {dateFormatter.format(new Date(semester.startDate))} -{" "}
                      {dateFormatter.format(new Date(semester.endDate))}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-neutral-800 bg-neutral-900">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-800 p-4">
              <div>
                <h2 className="text-white font-semibold">{selectedSemester.title}</h2>
                <p className="mt-1 text-sm text-neutral-400">
                  {dateFormatter.format(new Date(selectedSemester.startDate))} -{" "}
                  {dateFormatter.format(new Date(selectedSemester.endDate))}
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-semibold leading-none">
                  {selectedSemester.attendancePercent}%
                </div>
                <div className="mt-1 text-sm text-neutral-400">Attendance</div>
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-white font-medium">Overall Attendance</span>
                  <span className="text-white font-semibold">
                    {selectedSemester.attendancePercent}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${selectedSemester.attendancePercent}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <p className="text-neutral-400 text-sm">Total Marked</p>
                  <p className={`mt-1 text-2xl font-semibold ${statCardStyles.total}`}>
                    {selectedSemester.totalMarked}
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <p className="text-neutral-400 text-sm">Present Count</p>
                  <p className={`mt-1 text-2xl font-semibold ${statCardStyles.present}`}>
                    {selectedSemester.presentCount}
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <p className="text-neutral-400 text-sm">Absent Count</p>
                  <p className={`mt-1 text-2xl font-semibold ${statCardStyles.absent}`}>
                    {selectedSemester.absentCount}
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <p className="text-neutral-400 text-sm">Attendance %</p>
                  <p className={`mt-1 text-2xl font-semibold ${statCardStyles.attendance}`}>
                    {selectedSemester.attendancePercent}%
                  </p>
                </div>
              </div>

              <div className="grid gap-4 border-t border-neutral-800 pt-4 lg:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-white font-medium">Status Breakdown</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Present Count</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${breakdownBadgeStyles.present}`}
                      >
                        {selectedSemester.presentCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Absent Count</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${breakdownBadgeStyles.absent}`}
                      >
                        {selectedSemester.absentCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Leave Days</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${breakdownBadgeStyles.leave}`}
                      >
                        {selectedSemester.leaveDays}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Intern Leave Days</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${breakdownBadgeStyles.internLeave}`}
                      >
                        {selectedSemester.internLeaveDays}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-white font-medium">Period Information</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span>Start Date</span>
                      <span className="text-right text-white">
                        {dateFormatter.format(new Date(selectedSemester.startDate))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span>End Date</span>
                      <span className="text-right text-white">
                        {dateFormatter.format(new Date(selectedSemester.endDate))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span>Duration</span>
                      <span className="text-right text-white">
                        {getDurationDays(
                          selectedSemester.startDate,
                          selectedSemester.endDate,
                        )}{" "}
                        days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900">
          <header className="border-b border-neutral-800 p-4">
            <h2 className="text-white font-semibold">Attendance Status</h2>
          </header>

          <div className={`p-4 text-sm font-medium ${statusTextColor}`}>{statusText}</div>
        </section>
      </div>
    </div>
  );
}
