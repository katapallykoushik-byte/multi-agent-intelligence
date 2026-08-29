"use client";

import React from "react";

export const GlobalBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--background)] select-none"
    >
      {/* 1. SOFT AMBIENT DEPTH LAYERS (SUBTLE NAVY/SLATE DEPTH) */}
      <div
        className="absolute -top-[15%] right-[-5%] h-[60vw] w-[60vw] max-w-[1000px] rounded-full opacity-20 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(12, 30, 91, 0.4) 0%, rgba(6, 8, 38, 0.1) 60%, transparent 80%)",
        }}
      />
      <div
        className="absolute top-[50%] left-[-10%] h-[50vw] w-[50vw] max-w-[800px] rounded-full opacity-15 blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 42, 131, 0.3) 0%, transparent 75%)",
        }}
      />

      {/* 2. FAINT ARCHITECTURAL STRUCTURAL GRID */}
      <div className="absolute inset-0 opacity-[0.025]">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="faint-grid"
              width="96"
              height="96"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 96 0 L 0 0 0 96"
                fill="none"
                stroke="rgba(148, 163, 184, 0.6)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#faint-grid)" />
        </svg>
      </div>

      {/* 3. SUBTLE VERTICAL AXIS GUIDES */}
      <div className="mx-auto flex h-full max-w-[1600px] justify-between px-6 md:px-8 opacity-[0.025]">
        <div className="h-full w-px bg-[var(--text-secondary)]" />
        <div className="hidden h-full w-px bg-[var(--text-secondary)] sm:block" />
        <div className="hidden h-full w-px bg-[var(--text-secondary)] lg:block" />
        <div className="h-full w-px bg-[var(--text-secondary)]" />
      </div>

      {/* 4. SOFT VIGNETTE TO RETAIN FOCUS IN CENTER */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, transparent 50%, rgba(6, 8, 38, 0.4) 85%, rgba(6, 8, 38, 0.9) 100%)",
        }}
      />
    </div>
  );
};
