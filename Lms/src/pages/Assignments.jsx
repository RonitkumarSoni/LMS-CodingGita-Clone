import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const normalizeStatus = (status) =>
  String(status || "pending").trim().toLowerCase();

export default function Assignments() {
  const navigate = useNavigate();
  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("deadline");
  const [sortOrder, setSortOrder] = useState("Asc");

  if (!user) return <div>No user</div>;

  const assignments = useMemo(() => {
    if (Array.isArray(user?.assignmentItems)) return user.assignmentItems;
    if (Array.isArray(user?.assignments)) return user.assignments;
    return [];
  }, [user]);

  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((assignment) => {
        const status = normalizeStatus(assignment?.status);
        const title = String(assignment?.title || "");

        if (filterStatus !== "All" && status !== normalizeStatus(filterStatus)) {
          return false;
        }

        if (
          searchQuery &&
          !title.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let compareValue = 0;

        if (sortBy === "deadline") {
          const first = new Date(a?.deadline || 0).getTime();
          const second = new Date(b?.deadline || 0).getTime();
          compareValue = first - second;
        } else {
          compareValue = String(a?.title || "").localeCompare(
            String(b?.title || ""),
          );
        }

        return sortOrder === "Asc" ? compareValue : -compareValue;
      });
  }, [assignments, filterStatus, searchQuery, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Assignments
            </h1>
            <p className="mt-2 text-sm text-neutral-400 sm:text-base">
              Search, filter and sort your assignments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/student")}
            className="text-sm text-neutral-300 underline transition-colors hover:text-white"
          >
            &larr; Back to Dashboard
          </button>
        </div>

        <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_110px]">
            <input
              type="text"
              placeholder="Search by heading"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 rounded-lg border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none placeholder:text-neutral-500 transition-colors focus:border-blue-500"
            />

            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className="h-11 rounded-lg border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition-colors focus:border-blue-500"
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-11 rounded-lg border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition-colors focus:border-blue-500"
            >
              <option value="deadline">Sort by deadline</option>
              <option value="title">Sort by title</option>
            </select>

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="h-11 rounded-lg border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition-colors focus:border-blue-500"
            >
              <option value="Asc">Asc</option>
              <option value="Desc">Desc</option>
            </select>
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <header className="border-b border-neutral-800 p-4">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              All Assignments
            </h2>
          </header>

          <div className="p-4">
            {filteredAssignments.length === 0 ? (
              <p className="text-sm text-neutral-400">No assignments found.</p>
            ) : (
              <div className="space-y-3">
                {filteredAssignments.map((assignment, index) => (
                  <article
                    key={assignment?.id ?? `${assignment?.title}-${index}`}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {assignment?.title || "Untitled Assignment"}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-400">
                          Due: {assignment?.deadline
                            ? new Date(assignment.deadline).toLocaleDateString()
                            : "TBD"}
                        </p>
                      </div>

                      <span className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800/70 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
                        {normalizeStatus(assignment?.status)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
