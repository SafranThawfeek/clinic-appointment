import React from "react";
import { getApiBase } from "../utils/env";

// Simple avatar component: show image if provided, otherwise show initials with colored background
export default function Avatar({ src, name = "", size = 40, className = "" }) {
  const initials = (name || "").split(" ").map((s) => s[0] || "").join("").slice(0, 2).toUpperCase();

  // deterministic color based on name
  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];
  let color = colors[0];
  if (name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    color = colors[Math.abs(h) % colors.length];
  }

  // If the src points to backend uploads (starts with /uploads), prefix it with the API base.
  let resolvedSrc = src;
  try {
    if (src && typeof src === "string" && src.startsWith("/uploads")) {
      resolvedSrc = `${getApiBase()}${src}`;
    }
  } catch (e) {
    // ignore
  }

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={name}
        className={`${className} rounded-full object-cover border`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full text-white font-semibold flex items-center justify-center`}
      style={{ backgroundColor: color, width: size, height: size }}
      aria-hidden
    >
      <span style={{ fontSize: Math.max(12, size / 2.5) }}>{initials || "?"}</span>
    </div>
  );
}
