import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Plus,
  Send,
  Timer,
  User,
} from "lucide-react";
import Navbar from "../components/Navbar";

const fallbackLeaveRequests = [
  {
    id: "leave-1",
    title: "Hackathon participation",
    category: "Duty Leave",
    appliedOn: "2026-04-03",
    fromDate: "2026-04-03",
    toDate: "2026-04-05",
    leaveTime: "06:51",
    returnTime: "06:52",
    credits: 0,
    status: "approved",
    remark: "Representing the college in an inter-college hackathon.",
  },
  {
    id: "leave-2",
    title: "Personal reasons",
    category: "Personal Leave",
    appliedOn: "2026-02-10",
    fromDate: "2026-02-10",
    toDate: "2026-02-15",
    leaveTime: "09:00",
    returnTime: "18:00",
    credits: 0,
    status: "approved",
    remark: "Need to travel home for a family requirement.",
  },
  {
    id: "leave-3",
    title: "Medical consultation",
    category: "Sick Leave",
    appliedOn: "2026-01-12",
    fromDate: "2026-01-12",
    toDate: "2026-01-12",
    leaveTime: "10:00",
    returnTime: "14:00",
    credits: 0,
    status: "approved",
    remark: "Scheduled doctor consultation.",
  },
];

const defaultForm = {
  category: "",
  fromDate: "",
  toDate: "",
  leaveTime: "",
  returnTime: "",
  remarks: "",
};

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

const formatDate = (value) => {
  const parsed = toDate(value);
  return parsed ? formatter.format(parsed) : "-";
};

const getDurationDays = (fromDate, toDateValue) => {
  const from = toDate(fromDate);
  const to = toDate(toDateValue);

  if (!from || !to) return 0;

  const days = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(days, 1);
};

const normalizeRequest = (item, index) => ({
  id: item?.id ?? `leave-${index + 1}`,
  title: item?.title ?? item?.reason ?? "Leave request",
  category: item?.category ?? "General Leave",
  appliedOn: item?.appliedOn ?? item?.createdAt ?? "",
  fromDate: item?.fromDate ?? item?.startDate ?? "",
  toDate: item?.toDate ?? item?.endDate ?? "",
  leaveTime: item?.leaveTime ?? item?.startTime ?? "",
  returnTime: item?.returnTime ?? item?.endTime ?? "",
  credits: Number(item?.credits ?? 0),
  status: String(item?.status ?? "pending").toLowerCase(),
  remark: item?.remark ?? item?.remarks ?? "",
});

const getStatusBadgeClass = (status) => {
  if (status === "approved") {
    return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
  }

  if (status === "rejected") {
    return "border-rose-500/30 bg-rose-500/15 text-rose-300";
  }

  return "border-amber-500/30 bg-amber-500/15 text-amber-300";
};

const StatCard = ({ value, label, valueClass }) => (
  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
    <p className={`text-2xl font-semibold ${valueClass}`}>{value}</p>
    <p className="mt-1 text-sm text-neutral-400">{label}</p>
  </div>
);

export default function ApplyLeave() {
  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState("");
  const [requests, setRequests] = useState(() => {
    const fromUser = Array.isArray(user?.leaveRequests)
      ? user.leaveRequests
      : fallbackLeaveRequests;
    return fromUser.map(normalizeRequest);
  });

  if (!user) return <div>No user</div>;

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((item) => item.status === "pending").length;
    const approved = requests.filter((item) => item.status === "approved").length;
    const rejected = requests.filter((item) => item.status === "rejected").length;

    return { total, pending, approved, rejected };
  }, [requests]);

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const aDate = toDate(a.appliedOn)?.getTime() ?? 0;
      const bDate = toDate(b.appliedOn)?.getTime() ?? 0;
      return bDate - aDate;
    });
  }, [requests]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.category || !form.fromDate || !form.toDate) {
      setFormError("Please select category and both dates.");
      return;
    }

    if (toDate(form.toDate) < toDate(form.fromDate)) {
      setFormError("To Date cannot be before From Date.");
      return;
    }

    const newRequest = {
      id: `leave-${Date.now()}`,
      title: form.category,
      category: form.category,
      appliedOn: new Date().toISOString().split("T")[0],
      fromDate: form.fromDate,
      toDate: form.toDate,
      leaveTime: form.leaveTime,
      returnTime: form.returnTime,
      credits: 0,
      status: "pending",
      remark: form.remarks,
    };

    setRequests((prev) => [newRequest, ...prev]);
    setForm(defaultForm);
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Apply for Leave
          </h1>
          <p className="mt-2 text-sm text-neutral-400 sm:text-base">
            Submit your leave application and track your requests
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard value={stats.total} label="Total Applications" valueClass="text-white" />
          <StatCard value={stats.pending} label="Pending Review" valueClass="text-amber-300" />
          <StatCard value={stats.approved} label="Approved" valueClass="text-emerald-300" />
          <StatCard value={stats.rejected} label="Rejected" valueClass="text-rose-300" />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-full bg-neutral-800 p-2.5">
                <Plus className="text-neutral-300" size={18} />
              </div>

              <div>
                <h2 className="text-white font-semibold">New Leave Application</h2>
                <p className="text-sm text-neutral-400">
                  Fill out the form to submit your leave request
                </p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-100">
                  Leave Category
                </label>
                <select
                  value={form.category}
                  onChange={handleChange("category")}
                  className="h-11 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition-colors focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Duty Leave">Duty Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-100">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={form.fromDate}
                    onChange={handleChange("fromDate")}
                    className="h-11 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition-colors focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-100">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={form.toDate}
                    onChange={handleChange("toDate")}
                    className="h-11 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition-colors focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-100">
                    Leave Time
                  </label>
                  <input
                    type="time"
                    value={form.leaveTime}
                    onChange={handleChange("leaveTime")}
                    className="h-11 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition-colors focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-100">
                    Return Time
                  </label>
                  <input
                    type="time"
                    value={form.returnTime}
                    onChange={handleChange("returnTime")}
                    className="h-11 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition-colors focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-100">
                  Additional Remarks (Optional)
                </label>
                <textarea
                  value={form.remarks}
                  onChange={handleChange("remarks")}
                  placeholder="Any additional information for your mentor or admin"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-blue-500"
                />
              </div>

              {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                <Send size={16} />
                Submit Application
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-full bg-neutral-800 p-2.5">
                <User className="text-neutral-300" size={18} />
              </div>

              <div>
                <h2 className="text-white font-semibold">My Leave Requests</h2>
                <p className="text-sm text-neutral-400">
                  Track the status of your applications
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sortedRequests.map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-neutral-800 bg-neutral-950 p-4"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-neutral-800 p-2.5">
                        <FileText className="text-neutral-400" size={16} />
                      </div>

                      <div>
                        <h3 className="text-white font-semibold">{item.title}</h3>
                        <p className="text-sm text-neutral-400">
                          Applied on {formatDate(item.appliedOn)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                        item.status,
                      )}`}
                    >
                      <Check size={12} className="mr-1" />
                      {item.status}
                    </span>
                  </div>

                  <div className="grid gap-2 text-sm text-neutral-200 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-neutral-500" />
                      <span>
                        {formatDate(item.fromDate)} - {formatDate(item.toDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={14} className="text-neutral-500" />
                      <span>
                        {item.leaveTime || "--:--"} - {item.returnTime || "--:--"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Timer size={14} className="text-neutral-500" />
                      <span>{getDurationDays(item.fromDate, item.toDate)} days</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-neutral-500" />
                      <span>{item.credits} credits</span>
                    </div>
                  </div>

                  {item.remark ? (
                    <div className="mt-3 rounded-md border border-neutral-800 bg-neutral-800/70 p-3">
                      <p className="text-sm text-neutral-400">
                        <span className="font-semibold text-neutral-300">Remark:</span>{" "}
                        {item.remark}
                      </p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
