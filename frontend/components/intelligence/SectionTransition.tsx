"use client";

import React from "react";

interface SectionTransitionProps {
  title?: string;
  subtitle?: string;
  category?: string;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  title = "Empirical Specialist Dossiers",
  subtitle = "Explore the underlying signals, predictive models, and operational risk metrics shaping the executive recommendation.",
  category = "SPECIALIST INTELLIGENCE",
}) => {
  return (
    <div className="w-full border-b border-[var(--border-subtle)] bg-[var(--background-elevated)]/40 py-16 md:py-24 text-[var(--text-primary)]">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start px-5 md:px-8">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          {category}
        </span>

        <h2 className="editorial-heading mt-3 text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--text-primary)]">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base font-light leading-relaxed text-[var(--text-secondary)]">
          {subtitle}
        </p>

        <div className="mt-8 h-px w-24 bg-[var(--structure-bright)]" />
      </div>
    </div>
  );
};
