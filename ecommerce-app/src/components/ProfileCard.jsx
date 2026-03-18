import React from "react";

export default function ProfileCard({ user }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 lg:col-span-1">
      {/* HEADER */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <img
            src={user?.image || "https://i.pravatar.cc/100"}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <div className="flex items-center flex-wrap gap-2">
              <div className="text-white font-semibold">{user.name}</div>
            </div>

            <div className="text-neutral-400 text-xs">{user.email}</div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Mobile</span>

            <span className="text-neutral-200">{user.mobile}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">DOB</span>

            <span className="text-neutral-200">{user.dob || "N/A"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">University</span>

            <span className="text-neutral-200">{user.university}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
