import React from "react";
import Navbar from "../components/Navbar";

const StudentProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <div className="text-white p-6">No user found</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">Profile</h1>
            <p className="text-sm text-zinc-400">
              View and update your personal information
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm rounded-md bg-blue-600 hover:bg-blue-500">
              Reset Password
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 hover:bg-zinc-700">
              Edit
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* LEFT CARD */}
          <div className="md:col-span-1 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 flex flex-col items-center gap-3">
            <img
              src={user.image}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border border-zinc-800"
            />

            <div className="text-center space-y-1">
              <h2 className="text-lg font-medium text-zinc-100">{user.name}</h2>
              <p className="text-sm text-zinc-400">Student</p>
              <p className="text-xs text-zinc-500">
                {user.university} • {user.uid}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 hover:bg-zinc-700">
                Edit Profile
              </button>
              <button className="px-3 py-1.5 text-sm rounded-md bg-blue-600 hover:bg-blue-500">
                Reset Password
              </button>
            </div>
          </div>

          {/* RIGHT GRID */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Enrollment Number" value="—" />
            <Field label="Course" value="—" />
            <Field label="Branch" value="—" />
            <Field label="Semester" value="—" />
            <Field label="Gender" value="—" />
            <FieldLink label="Alternate Email" value={user.email} />
            <Field label="Alternate Phone" value="—" />
            <Field label="Guardian" value="—" />
          </div>
        </div>

        {/* CONTACT */}
        <Section title="Contact & Links">
          <Field label="Mobile" value={user.mobile} highlight />
          <Field label="Parent Mobile" value="—" />
          <FieldLink label="University Email" value={user.email} />
          <FieldLink label="Current Email" value={user.email} />
          <Field label="Address" value="kalol, Gandhinagar" highlight />
          <Field label="Portfolio" value="—" />
          <Field label="Resume" value="—" />
          <FieldLink label="Github" value="https://github.com" />
          <FieldLink label="LinkedIn" value="https://linkedin.com" />
          <FieldLink label="Twitter" value="https://x.com" />
          <FieldLink label="YouTube" value="https://youtube.com" />
        </Section>

        {/* ACADEMICS */}
        <Section title="Academics">
          <Field label="University" value={user.university} highlight />
          <Field label="University UID" value={user.uid} highlight />
          <Field label="Date of Birth" value="—" />
          <Field label="Admission Year" value="—" />
          <Field label="Current Year" value="—" />
          <Field label="Section" value="—" />
<Field label="Subjects" value={user.subjects.join(", ")} highlight />
          <Field label="Mentors" value={user.mentors?.[0]?.name} highlight />
        </Section>
      </div>
    </div>
  );
};

export default StudentProfile;

/////////////////////////////////////////////////////
// 🔹 Reusable Components
/////////////////////////////////////////////////////

const Section = ({ title, children }) => (
  <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-4">
    <h2 className="text-lg font-medium text-zinc-100">{title}</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
  </div>
);

const Field = ({ label, value, highlight }) => (
  <div className="flex flex-col gap-1 p-3 rounded-md bg-zinc-900/40 border border-zinc-800">
    <span className="text-xs uppercase tracking-wide text-zinc-400">
      {label}
    </span>
    <span
      className={`text-sm ${
        highlight ? "text-zinc-100" : "text-zinc-500"
      } truncate`}
    >
      {value || "—"}
    </span>
  </div>
);

const FieldLink = ({ label, value }) => (
  <div className="flex flex-col gap-1 p-3 rounded-md bg-zinc-900/40 border border-zinc-800">
    <span className="text-xs uppercase tracking-wide text-zinc-400">
      {label}
    </span>
    {value ? (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-blue-400 hover:underline truncate"
      >
        {value}
      </a>
    ) : (
      <span className="text-sm text-zinc-500">—</span>
    )}
  </div>
);
