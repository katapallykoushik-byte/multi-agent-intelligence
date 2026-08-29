"use client";

import React from "react";

interface MinimalNavProps {
  isAnalyzing?: boolean;
  hasResults?: boolean;
}

export const MinimalNav: React.FC<MinimalNavProps> = ({
  isAnalyzing = false,
  hasResults = false,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--background)]/85 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4 md:px-8">
        {/* LEFT: SYSTEM LOGO / IDENTITY */}
        <div className="flex items-center gap-3">
          <div className="flex h-5 w-5 items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--background-elevated)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--structure-bright)]" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-sans text-xs font-semibold tracking-wider text-[var(--text-primary)]">
              MULTI-AGENT INTELLIGENCE
            </span>
            <span className="hidden font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] sm:inline">
              EDS Core
            </span>
          </div>
        </div>

        {/* CENTER: ANCHOR NAVIGATION (VISIBLE ON RESULTS) */}
        {hasResults && (
          <div className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollToSection("workspace-section")}
              className="font-sans text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] cursor-pointer"
            >
              Workspace
            </button>
            <button
              onClick={() => scrollToSection("commercial-territory")}
              className="font-sans text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] cursor-pointer"
            >
              Commercial
            </button>
            <button
              onClick={() => scrollToSection("financial-territory")}
              className="font-sans text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] cursor-pointer"
            >
              Financial
            </button>
            <button
              onClick={() => scrollToSection("operations-territory")}
              className="font-sans text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] cursor-pointer"
            >
              Operations
            </button>
            <button
              onClick={() => scrollToSection("risk-territory")}
              className="font-sans text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] cursor-pointer"
            >
              Risk Engine
            </button>
            <button
              onClick={() => scrollToSection("executive-brief")}
              className="font-sans text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] cursor-pointer"
            >
              Executive Brief
            </button>
          </div>
        )}

        {/* RIGHT: QUIET SYSTEM TELEMETRY */}
        <div className="flex items-center gap-4 font-mono text-[10px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isAnalyzing
                  ? "bg-[var(--highlight-ice)] animate-pulse"
                  : "bg-[var(--structure-bright)]"
              }`}
            />
            <span className="tracking-wider uppercase text-[var(--text-secondary)]">
              {isAnalyzing ? "Synthesizing" : "System Ready"}
            </span>
          </div>
          <span className="hidden text-[var(--border-subtle)] sm:inline">|</span>
          <span className="hidden tracking-wider text-[var(--text-muted)] uppercase sm:inline">
            4 Specialists Active
          </span>
        </div>
      </div>
    </nav>
  );
};
