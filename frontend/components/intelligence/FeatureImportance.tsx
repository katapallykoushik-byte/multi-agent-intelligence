"use client";

import React from "react";

interface FeatureImportanceProps {
  model?: {
    feature_importance?: Array<{
      rank: string;
      feature: string;
      raw_feature?: string;
      importance_pct: number;
      role?: string;
    }>;
    methodology?: {
      description: string;
      tags: string[];
    };
  };
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({ model }) => {
  if (!model) return null;

  const drivers = model.feature_importance || [];
  const methodology = model.methodology;

  return (
    <div className="mt-10 space-y-6">
      {/* FEATURE IMPORTANCE SECTION */}
      {drivers.length > 0 && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-soft)] p-6 sm:p-8">
          <div className="border-b border-[var(--border-subtle)] pb-3">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Feature Importance Distribution
            </span>
            <h4 className="font-sans text-sm font-semibold text-[var(--text-primary)] mt-1">
              Key Empirical Drivers of Predicted Risk
            </h4>
            <p className="mt-1.5 font-sans text-xs leading-relaxed text-[var(--text-secondary)]">
              Gini importance scores derived from trained Random Forest ensemble. Variables marked as{" "}
              <span className="font-medium text-[var(--highlight-ice)]">Target-Construction Variable</span> define labels via thresholding while model ingests continuous raw values only.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {drivers.map((driver) => {
              const isTC = driver.role?.includes("Target-Construction");
              return (
                <div
                  key={driver.rank}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4 transition-all duration-200 hover:border-[var(--border-active)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold text-[var(--highlight-ice)]">
                        {driver.rank}
                      </span>
                      <div>
                        <span className="font-medium text-[var(--text-primary)]">{driver.feature}</span>
                        {driver.role && (
                          <span
                            className={`ml-2.5 inline-block rounded px-2 py-0.5 font-mono text-[8px] font-medium uppercase tracking-wider ${
                              isTC
                                ? "border border-[var(--status-warning)]/30 bg-[var(--status-warning)]/10 text-[var(--status-warning)]"
                                : "border border-[var(--border-active)] bg-[var(--structure-deep)]/40 text-[var(--highlight-ice)]"
                            }`}
                          >
                            {isTC ? "TC VAR" : "INDEPENDENT"}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                      {driver.importance_pct}%
                    </span>
                  </div>

                  {/* IMPORTANCE BAR */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--background-soft)] border border-[var(--border-subtle)]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isTC ? "bg-[var(--status-warning)]" : "bg-[var(--structure-bright)]"
                      }`}
                      style={{ width: `${Math.min(driver.importance_pct * 2.5, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* LEGEND */}
          <div className="mt-6 flex flex-wrap gap-4 border-t border-[var(--border-subtle)] pt-3 text-xs font-mono text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-3 rounded bg-[var(--status-warning)]" />
              <span>TC VAR — continuous value of target-construction variable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-3 rounded bg-[var(--structure-bright)]" />
              <span>INDEPENDENT — purely external predictive signal</span>
            </div>
          </div>
        </div>
      )}

      {/* METHODOLOGY & INDEPENDENT VALIDATION STATEMENT */}
      {methodology && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-soft)] p-6 sm:p-8">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Methodology & Validation Framework
          </span>

          <div className="mt-4 space-y-2.5 font-sans text-xs leading-relaxed text-[var(--text-secondary)]">
            {methodology.description.split("\n\n").map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(methodology.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
