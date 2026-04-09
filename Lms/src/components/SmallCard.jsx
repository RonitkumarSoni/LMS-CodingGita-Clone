import React from "react";

export default function SmallCard({ title, text, link = false }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900">
      <div className="p-4">
        {/* TITLE */}
        <div className="text-neutral-400 text-sm">{title}</div>

        {/* TEXT */}
        {link ? (
          <div className="text-white text-base mt-1 hover:underline cursor-pointer">
            {text}
          </div>
        ) : (
          <div className="text-white text-base mt-1">{text}</div>
        )}
      </div>
    </div>
  );
}
