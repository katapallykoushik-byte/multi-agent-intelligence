"use client";

import React from "react";
import { AnalysisResult } from "./types";
import { DollarSign, PieChart, Wallet } from "lucide-react";

interface SpecialistFinancialProps {
  analysisResult?: AnalysisResult | null;
}

export const SpecialistFinancial: React.FC<SpecialistFinancialProps> = ({
  analysisResult,
}) => {
  const financial = analysisResult?.specialist_analysis?.financial_analysis;

  if (!financial) return null;

  const summary = financial.analysis.financial_summary;
  const metrics = financial.analysis.key_metrics;
  const variance = financial.analysis.variance_analysis;
  const regionalProfit = Object.entries(financial.analysis.profitability_analysis?.regional_profitability || {});
  const productProfit = Object.entries(financial.analysis.profitability_analysis?.product_profitability || {});

  const maxRegional = regionalProfit.length > 0 ? Math.max(...regionalProfit.map(([, v]) => Number(v))) : 1;
  const maxProduct = productProfit.length > 0 ? Math.max(...productProfit.map(([, v]) => Number(v))) : 1;

  return (
    <section
      id="financial-section"
      className="relative w-full border-b border-[var(--border-subtle)] bg-[var(--background)] py-20 text-[var(--text-primary)] md:py-28"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--structure-bright)]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                02 / Financial Specialist Agent
              </span>
            </div>
            <h2 className="editorial-heading mt-3 text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]">
              Financial Health & Margin Yield
            </h2>
          </div>
          <p className="max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            Revenue velocity, expense absorption rates, margin health indices, and segmental capital profitability.
          </p>
        </div>

        {/* FINANCIAL CORE KPIS */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Gross Revenue Pool
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {summary?.revenue?.total_revenue != null
                ? `$${summary.revenue.total_revenue.toLocaleString()}`
                : "—"}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Total fiscal inflows recorded</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Total Cost Base
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {summary?.cost?.total_cost != null
                ? `$${summary.cost.total_cost.toLocaleString()}`
                : "—"}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Operational & direct expenses</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Net Operating Profit
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--highlight-ice)]">
              {summary?.profit?.total_profit != null
                ? `$${summary.profit.total_profit.toLocaleString()}`
                : "—"}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Net bottom-line yield</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Profit Margin Spread
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--highlight-ice)]">
              {metrics?.profit_margin_pct != null ? `${metrics.profit_margin_pct}%` : "—"}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Margin capture rate on revenue</p>
          </div>
        </div>

        {/* FINANCIAL RATIO GAUGES */}
        {metrics && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6">
              <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">Profit Margin Rate</span>
              <p className="mt-2 font-mono text-2xl font-bold text-[var(--highlight-ice)]">{metrics.profit_margin_pct ?? 0}%</p>
              <div className="mt-4 h-2 w-full bg-[var(--background-soft)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="h-full bg-[var(--structure-bright)] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Number(metrics.profit_margin_pct || 0), 100)}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6">
              <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">Cost to Revenue Ratio</span>
              <p className="mt-2 font-mono text-2xl font-bold text-[var(--text-primary)]">{metrics.cost_to_revenue_ratio_pct ?? 0}%</p>
              <div className="mt-4 h-2 w-full bg-[var(--background-soft)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="h-full bg-[var(--highlight-periwinkle)] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Number(metrics.cost_to_revenue_ratio_pct || 0), 100)}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6">
              <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">Return on Cost (ROI)</span>
              <p className="mt-2 font-mono text-2xl font-bold text-[var(--highlight-ice)]">{metrics.return_on_cost_roi_pct ?? 0}%</p>
              <div className="mt-4 h-2 w-full bg-[var(--background-soft)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="h-full bg-[var(--structure-electric)] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Number(metrics.return_on_cost_roi_pct || 0), 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* FINANCIAL INSIGHTS */}
        <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Financial Agent Observations & Margin Efficiency
          </span>
          <div className="mt-5 space-y-3">
            {(financial.key_insights || []).map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 border-l-2 border-[var(--structure-bright)] pl-4 text-xs sm:text-sm leading-relaxed text-[var(--text-primary)]"
              >
                <span className="font-mono text-xs font-semibold text-[var(--highlight-ice)]">
                  [{String(idx + 1).padStart(2, "0")}]
                </span>
                <p className="font-sans text-[var(--text-secondary)]">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PROFITABILITY BREAKDOWNS */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {regionalProfit.length > 0 && (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <span className="font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                    Territorial Profit Contribution
                  </span>
                  <h3 className="mt-1 font-sans text-sm font-semibold text-[var(--text-primary)]">Regional Profitability</h3>
                </div>
                <PieChart className="h-4 w-4 text-[var(--structure-bright)]" />
              </div>

              <div className="mt-6 space-y-4">
                {regionalProfit.map(([reg, val]) => {
                  const numVal = Number(val);
                  const pct = maxRegional > 0 ? (numVal / maxRegional) * 100 : 0;
                  return (
                    <div key={reg} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[var(--text-primary)]">{reg}</span>
                        <span className="font-mono text-[var(--highlight-ice)] font-semibold">${numVal.toLocaleString()}</span>
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
          )}

          {productProfit.length > 0 && (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <span className="font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                    Product Profit Yield
                  </span>
                  <h3 className="mt-1 font-sans text-sm font-semibold text-[var(--text-primary)]">Product Profitability</h3>
                </div>
                <DollarSign className="h-4 w-4 text-[var(--highlight-ice)]" />
              </div>

              <div className="mt-6 space-y-4">
                {productProfit.map(([prod, val]) => {
                  const numVal = Number(val);
                  const pct = maxProduct > 0 ? (numVal / maxProduct) * 100 : 0;
                  return (
                    <div key={prod} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[var(--text-primary)]">{prod}</span>
                        <span className="font-mono text-[var(--highlight-ice)] font-semibold">${numVal.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--background-soft)] border border-[var(--border-subtle)]">
                        <div
                          className="h-full rounded-full bg-[var(--structure-electric)] transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* BUDGET VARIANCE IF DETECTED */}
        {variance?.total_budget != null && (
          <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
            <span className="font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
              Fiscal Governance
            </span>
            <h3 className="mt-1 font-sans text-base font-semibold text-[var(--text-primary)]">Budget Variance Analysis</h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-3 text-xs">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-4">
                <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">Allocated Budget</span>
                <p className="mt-1 font-mono text-lg font-bold text-[var(--text-primary)]">${variance.total_budget.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-4">
                <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">Utilization Rate</span>
                <p className="mt-1 font-mono text-lg font-bold text-[var(--text-primary)]">{variance.budget_utilization_pct}%</p>
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-4">
                <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">Variance Status</span>
                <p className="mt-1 font-mono text-lg font-bold text-[var(--highlight-ice)]">{variance.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
