import React from "react";

export default function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase().trim();

  let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";
  let dotColor = "bg-gray-400";

  if (normalized === "processing") {
    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
    dotColor = "bg-amber-500 animate-pulse";
  } else if (normalized === "shipped") {
    badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
    dotColor = "bg-blue-500";
  } else if (normalized === "delivered") {
    badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
    dotColor = "bg-emerald-500";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badgeStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`}></span>
      {status || "Unknown"}
    </span>
  );
}
