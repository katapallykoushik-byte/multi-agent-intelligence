"use client";

import React from "react";
import { AnalysisResult } from "./types";
import { Truck, AlertOctagon, Layers, Clock } from "lucide-react";

interface SpecialistOperationsProps {
  analysisResult?: AnalysisResult | null;
}

export const SpecialistOperations: React.FC<SpecialistOperationsProps> = ({
  analysisResult,
}) => {
  const operations = analysisResult?.specialist_analysis?.operations_analysis;

  if (!operations) return null;

  const summary = operations.analysis.operational_summary;
  const bottlenecks = operations.analysis.bottlenecks_and_constraints;
  const suppliers = operations.analysis.supplier_performance || {};

  return (
    <section
      id="operations-section"
      className="relative w-full border-b border-[var(--border-subtle)] bg-[var(--background)] py-20 text-[var(--text-primary)] md:py-28"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--structure-electric)]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                03 / Operations Specialist Agent
              </span>
            </div>
            <h2 className="editorial-heading mt-3 text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]">
              Supply Chain & Operational Constraints
            </h2>
          </div>
          <p className="max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            Facility load factors, capacity bottleneck alerts, supplier lead time tracking, and fulfillment delay latency.
          </p>
        </div>

        {/* OPERATIONS CORE KPIS */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Inventory Buffer
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {summary?.inventory?.average_inventory != null
                ? summary.inventory.average_inventory.toLocaleString()
                : "—"}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Mean physical units on hand</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Machine Utilization
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--highlight-ice)]">
              {summary?.machine_utilization?.average_utilization_pct != null
                ? `${summary.machine_utilization.average_utilization_pct}%`
                : "—"}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Production capacity load factor</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Supplier Lead Time
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {summary?.lead_time?.average_lead_time_days != null
                ? `${summary.lead_time.average_lead_time_days} days`
                : "—"}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Average procurement cycle</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Fulfillment Delays
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--status-warning)]">
              {summary?.delivery_delays?.delayed_orders_pct != null
                ? `${summary.delivery_delays.delayed_orders_pct}%`
                : "—"}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Late customer orders ratio</p>
          </div>
        </div>

        {/* BOTTLENECK ALERT PANEL */}
        {bottlenecks && (
          <div className="mt-8 rounded-xl border border-[var(--border-active)] bg-[var(--background-elevated)] p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-[var(--highlight-ice)]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--highlight-ice)]">
                Capacity Monitoring & Constraint Alert
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-5">
                <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">Capacity Constraint Status</span>
                <p className="mt-1.5 font-sans text-base font-bold text-[var(--text-primary)]">
                  {bottlenecks.capacity_deficit?.status || "Capacity Alert Active"}
                </p>
                {bottlenecks.capacity_deficit?.constrained_cycles_pct ? (
                  <p className="mt-2 font-mono text-xs text-[var(--status-warning)]">
                    Breached in {bottlenecks.capacity_deficit.constrained_cycles_pct}% of operational cycles.
                  </p>
                ) : null}
              </div>

              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-5">
                <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">Equipment Health & Workforce</span>
                <p className="mt-1.5 font-sans text-base font-bold text-[var(--text-primary)]">
                  {summary?.workforce_availability?.average_availability_pct
                    ? `${summary.workforce_availability.average_availability_pct}% Availability`
                    : "Nominal Operating Thresholds"}
                </p>
                <p className="mt-2 font-sans text-xs text-[var(--text-secondary)]">
                  Staffing buffer and stress index monitoring.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUPPLIER SCORECARD TABLE */}
        {Object.keys(suppliers).length > 0 && (
          <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                  Vendor Scorecard
                </span>
                <h3 className="mt-1 font-sans text-sm font-semibold text-[var(--text-primary)]">
                  Supplier Reliability & Lead Time Matrix
                </h3>
              </div>
              <Truck className="h-4 w-4 text-[var(--structure-bright)]" />
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] font-mono text-[10px] uppercase text-[var(--text-muted)]">
                    <th className="pb-3 font-medium">Vendor</th>
                    <th className="pb-3 font-medium">Avg Lead Time</th>
                    <th className="pb-3 font-medium">Reliability Score</th>
                    <th className="pb-3 font-medium">Avg Delay</th>
                    <th className="pb-3 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {Object.entries(suppliers).map(([supplier, metrics]) => {
                    const rel = Number(metrics.avg_reliability_score || 0);
                    const isReliable = rel >= 0.8;
                    return (
                      <tr key={supplier} className="hover:bg-[var(--background-soft)] transition-colors">
                        <td className="py-3.5 font-medium text-[var(--text-primary)]">{supplier}</td>
                        <td className="py-3.5 font-mono text-[var(--text-secondary)]">{metrics.avg_lead_time_days ?? "—"} days</td>
                        <td className="py-3.5 font-mono font-semibold text-[var(--highlight-ice)]">{metrics.avg_reliability_score ?? "—"}</td>
                        <td className="py-3.5 font-mono text-[var(--text-secondary)]">{metrics.avg_delivery_delay_days ?? "—"} days</td>
                        <td className="py-3.5">
                          <span
                            className={`rounded px-2 py-0.5 font-mono text-[9px] font-semibold uppercase ${
                              isReliable
                                ? "bg-[var(--structure-deep)] text-[var(--highlight-ice)] border border-[var(--border-active)]"
                                : "bg-[var(--background-soft)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                            }`}
                          >
                            {isReliable ? "Optimal" : "Monitor"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OPERATIONS INSIGHTS */}
        <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Operations Agent Observations
          </span>
          <div className="mt-5 space-y-3">
            {(operations.key_insights || []).map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 border-l-2 border-[var(--structure-electric)] pl-4 text-xs sm:text-sm leading-relaxed text-[var(--text-primary)]"
              >
                <span className="font-mono text-xs font-semibold text-[var(--highlight-ice)]">
                  [{String(idx + 1).padStart(2, "0")}]
                </span>
                <p className="font-sans text-[var(--text-secondary)]">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
