"use client";

import React from "react";
import { AnalysisResult } from "./types";
import { TrendingUp, BarChart3, Target } from "lucide-react";

interface SpecialistCommercialProps {
  analysisResult?: AnalysisResult | null;
}

export const SpecialistCommercial: React.FC<SpecialistCommercialProps> = ({
  analysisResult,
}) => {
  const commercial = analysisResult?.specialist_analysis?.commercial_analysis;

  if (!commercial) return null;

  const salesSummary = commercial.analysis.sales_summary;
  const regression = commercial.analysis.regression;
  const regionalEntries = Object.entries(commercial.analysis.regional_performance || {});
  const productEntries = Object.entries(commercial.analysis.product_performance || {});

  const maxRegional = regionalEntries.length > 0 ? Math.max(...regionalEntries.map(([, v]) => Number(v))) : 1;
  const maxProduct = productEntries.length > 0 ? Math.max(...productEntries.map(([, v]) => Number(v))) : 1;

  return (
    <section
      id="commercial-section"
      className="relative w-full border-b border-[var(--border-subtle)] bg-[var(--background)] py-20 text-[var(--text-primary)] md:py-28"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--highlight-periwinkle)]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                01 / Commercial Specialist Agent
              </span>
            </div>
            <h2 className="editorial-heading mt-3 text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]">
              Commercial Performance & Demand
            </h2>
          </div>
          <p className="max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            Sales velocity dynamics, territorial market distribution, product SKU concentration, and leakage-safe regression modeling.
          </p>
        </div>

        {/* PRIMARY SALES SUMMARY KPIS */}
        {salesSummary && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                Total Sales Volume
              </span>
              <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {salesSummary.total_sales != null ? `$${salesSummary.total_sales.toLocaleString()}` : "—"}
              </p>
              <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Cumulative gross commercial volume</p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                Average Transaction
              </span>
              <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {salesSummary.average_sales != null ? `$${salesSummary.average_sales.toLocaleString()}` : "—"}
              </p>
              <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Mean transaction ticket size</p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                Minimum Order
              </span>
              <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {salesSummary.minimum_sales != null ? `$${salesSummary.minimum_sales.toLocaleString()}` : "—"}
              </p>
              <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Floor recorded ticket value</p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                Peak Order Ceiling
              </span>
              <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--highlight-ice)]">
                {salesSummary.maximum_sales != null ? `$${salesSummary.maximum_sales.toLocaleString()}` : "—"}
              </p>
              <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Maximum single commercial order</p>
            </div>
          </div>
        )}

        {/* EDITORIAL INSIGHTS */}
        <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Commercial Agent Findings & Key Takeaways
          </span>
          <div className="mt-5 space-y-3">
            {(commercial.key_insights || []).map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 border-l-2 border-[var(--highlight-periwinkle)] pl-4 text-xs sm:text-sm leading-relaxed text-[var(--text-primary)]"
              >
                <span className="font-mono text-xs font-semibold text-[var(--highlight-ice)]">
                  [{String(idx + 1).padStart(2, "0")}]
                </span>
                <p className="font-sans text-[var(--text-secondary)]">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* REGIONAL & PRODUCT PERFORMANCE BREAKDOWNS */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* REGIONAL PERFORMANCE */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                  Territory Distribution
                </span>
                <h3 className="mt-1 font-sans text-sm font-semibold text-[var(--text-primary)]">
                  Regional Volume Share
                </h3>
              </div>
              <BarChart3 className="h-4 w-4 text-[var(--structure-bright)]" />
            </div>

            <div className="mt-6 space-y-4">
              {regionalEntries.map(([region, value]) => {
                const numVal = Number(value);
                const pct = maxRegional > 0 ? (numVal / maxRegional) * 100 : 0;
                return (
                  <div key={region} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--text-primary)]">{region}</span>
                      <span className="font-mono text-[var(--text-secondary)]">${numVal.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--background-soft)] border border-[var(--border-subtle)]">
                      <div
                        className="h-full rounded-full bg-[var(--highlight-periwinkle)] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PRODUCT PERFORMANCE */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                  Product Velocity
                </span>
                <h3 className="mt-1 font-sans text-sm font-semibold text-[var(--text-primary)]">
                  Product Line Performance
                </h3>
              </div>
              <TrendingUp className="h-4 w-4 text-[var(--highlight-ice)]" />
            </div>

            <div className="mt-6 space-y-4">
              {productEntries.map(([prod, value]) => {
                const numVal = Number(value);
                const pct = maxProduct > 0 ? (numVal / maxProduct) * 100 : 0;
                return (
                  <div key={prod} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--text-primary)]">{prod}</span>
                      <span className="font-mono text-[var(--text-secondary)]">${numVal.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--background-soft)] border border-[var(--border-subtle)]">
                      <div
                        className="h-full rounded-full bg-[var(--structure-bright)] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PREDICTIVE REGRESSION MODEL */}
        {regression && (
          <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-2 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--highlight-ice)]">
                  Predictive Modeling
                </span>
                <h3 className="mt-1 font-sans text-base font-semibold text-[var(--text-primary)]">
                  Commercial Demand Estimation (Target Leakage Prevented)
                </h3>
              </div>
              <span className="rounded border border-[var(--border-active)] bg-[var(--structure-deep)]/40 px-2.5 py-1 font-mono text-[10px] font-semibold text-[var(--highlight-ice)]">
                Leakage Checked
              </span>
            </div>

            {regression.message ? (
              <p className="mt-4 font-sans text-xs text-[var(--text-secondary)]">{regression.message}</p>
            ) : (
              <>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-4">
                    <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">MAE</span>
                    <p className="mt-1 font-mono text-xl font-bold text-[var(--text-primary)]">{regression.mae}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-4">
                    <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">MSE</span>
                    <p className="mt-1 font-mono text-xl font-bold text-[var(--text-primary)]">{regression.mse}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-4">
                    <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">RMSE</span>
                    <p className="mt-1 font-mono text-xl font-bold text-[var(--text-primary)]">{regression.rmse}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-4">
                    <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">R² SCORE</span>
                    <p className="mt-1 font-mono text-xl font-bold text-[var(--highlight-ice)]">{regression.r2_score}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-[var(--border-subtle)] pt-4 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Target:</span>
                    <span className="font-mono text-xs font-semibold text-[var(--highlight-ice)]">
                      {regression.target}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Independent Predictors:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(regression.features || []).map((feat) => (
                        <span
                          key={feat}
                          className="rounded border border-[var(--border-subtle)] bg-[var(--background-soft)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)]"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
