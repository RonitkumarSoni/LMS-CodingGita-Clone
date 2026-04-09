import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const fallbackEvents = [
  {
    id: "diwali-vacation",
    title: "Diwali Vacation",
    startDate: "2025-10-18",
    endDate: "2025-10-26",
    status: "past",
  },
];

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

const toDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const normalizeStatus = (item, startDate, endDate) => {
  const explicitStatus = String(item?.status || "")
    .trim()
    .toLowerCase();

  if (
    explicitStatus === "ongoing" ||
    explicitStatus === "upcoming" ||
    explicitStatus === "past"
  ) {
    return explicitStatus;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (startDate && endDate) {
    if (endDate < today) return "past";
    if (startDate <= today && endDate >= today) return "ongoing";
    return "upcoming";
  }

  if (startDate) {
    return startDate < today ? "past" : "upcoming";
  }

  return "upcoming";
};

const normalizeEvent = (item, index) => {
  if (typeof item === "string") {
    return {
      id: `event-${index + 1}`,
      title: item,
      startDate: "",
      endDate: "",
      status: "upcoming",
    };
  }

  const startDateRaw = item?.startDate ?? item?.fromDate ?? item?.date ?? "";
  const endDateRaw = item?.endDate ?? item?.toDate ?? startDateRaw;

  const startDate = toDate(startDateRaw);
  const endDate = toDate(endDateRaw);

  return {
    id: item?.id ?? `event-${index + 1}`,
    title: item?.title ?? item?.name ?? `Event ${index + 1}`,
    startDate: startDateRaw,
    endDate: endDateRaw,
    status: normalizeStatus(item, startDate, endDate),
  };
};

const formatRange = (startDate, endDate) => {
  const start = toDate(startDate);
  const end = toDate(endDate);

  if (!start && !end) return "Date not available";
  if (start && end) return `${formatter.format(start)} - ${formatter.format(end)}`;
  if (start) return formatter.format(start);
  return formatter.format(end);
};

const EventsSection = ({ title, items, emptyMessage }) => (
  <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
    <header className="border-b border-neutral-800 p-4">
      <h2 className="text-white font-semibold">{title}</h2>
    </header>

    <div className="p-4">
      {items.length === 0 ? (
        <p className="text-sm text-neutral-400">{emptyMessage}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((event) => (
            <article
              key={event.id}
              className="rounded-lg border border-neutral-800 bg-neutral-950 p-4"
            >
              <h3 className="text-base font-semibold text-white">{event.title}</h3>
              <p className="mt-1 text-sm text-neutral-300">
                {formatRange(event.startDate, event.endDate)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default function Events() {
  const navigate = useNavigate();
  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  if (!user) return <div>No user</div>;

  const normalizedEvents = useMemo(() => {
    const source =
      Array.isArray(user?.events) && user.events.length > 0
        ? user.events
        : fallbackEvents;

    return source.map(normalizeEvent);
  }, [user]);

  const ongoingEvents = normalizedEvents.filter((event) => event.status === "ongoing");
  const upcomingEvents = normalizedEvents.filter((event) => event.status === "upcoming");
  const pastEvents = normalizedEvents.filter((event) => event.status === "past");

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Events</h1>

          <button
            type="button"
            onClick={() => navigate("/student")}
            className="text-sm text-neutral-200 transition-colors hover:text-white"
          >
            Back to dashboard
          </button>
        </div>

        <div className="space-y-6">
          <EventsSection
            title="Ongoing"
            items={ongoingEvents}
            emptyMessage="No ongoing events."
          />

          <EventsSection
            title="Upcoming"
            items={upcomingEvents}
            emptyMessage="No upcoming events."
          />

          <EventsSection title="Past" items={pastEvents} emptyMessage="No past events." />
        </div>
      </div>
    </div>
  );
}
