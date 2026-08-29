"use client";

import React from "react";
import { AnalysisResult } from "./types";
import { Database, ShieldCheck, Layers, RotateCcw } from "lucide-react";

interface DataProfileProps {
  analysisResult?: AnalysisResult | null;
  onReset?: () => void;
}

export const DataProfile: React.FC<DataProfileProps> = ({
  analysisResult,
  onReset,
}) => {
  if (!analysisResult) return null;

  const overview = analysisResult.analysis.dataset_overview;
  const quality = analysisResult.analysis.data_quality;
  const classification = analysisResult.analysis.column_classification;
  const coordinator = analysisResult.coordinator;
  const recommendations =
    analysisResult.analysis.preprocessing_recommendations ||
    analysisResult.analysis.data_quality?.preprocessing_recommendations ||
    [];

  const totalMissing = Object.values(quality.missing_values || {}).reduce(
    (total, item) => total + item.missing_count,
    0
  );

  const totalOutliers = Object.values(quality.potential_outliers || {}).reduce(
    (total, item) => total + item.outlier_count,
    0
  );

  const agents = [
    {
      number: "01",
      name: "Data Intelligence",
      description: "Profiles structure, quality, variables, and semantic business concepts.",
      status: "Complete",
    },
    {
      number: "02",
      name: "Commercial Analysis",
      description: "Examines sales velocity, product demand, and regional variation.",
      status: analysisResult.specialist_analysis?.commercial_analysis ? "Complete" : "Not Activated",
    },
    {
      number: "03",
      name: "Financial Analysis",
      description: "Evaluates revenue, cost structures, and margin efficiency.",
      status: analysisResult.specialist_analysis?.financial_analysis ? "Complete" : "Not Activated",
    },
    {
      number: "04",
      name: "Operations Analysis",
      description: "Monitors inventory, equipment utilization, and supplier lead times.",
      status: analysisResult.specialist_analysis?.operations_analysis ? "Complete" : "Not Activated",
    },
    {
      number: "05",
      name: "Risk Engine",
      description: "Evaluates multiclass risk models, confusion matrix, and threat signals.",
      status: analysisResult.specialist_analysis?.risk_analysis ? "Complete" : "Not Activated",
    },
  ];

  return (
    <section className="relative w-full border-b border-[var(--border-subtle)] bg-[var(--background)] py-20 text-[var(--text-primary)] md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[var(--structure-bright)]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Dataset Profiling & Topology
              </span>
            </div>
            <h2 className="editorial-heading mt-3 text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]">
              Data Profile & Quality Integrity
            </h2>
          </div>
          <p className="max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            Semantic concept discovery, data quality integrity metrics, and collaborative agent orchestration logs.
          </p>
        </div>

        {/* DATA QUALITY SCORECARD */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Records Profiled
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {overview.rows.toLocaleString()}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Total dataset rows processed</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Variables Discovered
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {overview.columns}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Structured data features</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Data Quality Score
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--highlight-ice)]">
              {quality.quality_score} <span className="text-sm font-normal text-[var(--text-muted)]">/ 100</span>
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Composite integrity index</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Active Specialists
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {coordinator?.activated_agents?.length || 0}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Collaborating specialist agents</p>
          </div>
        </div>

        {/* QUALITY INTEGRITY DETAILS */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6">
            <span className="font-mono text-[10px] font-medium uppercase text-[var(--text-muted)]">
              Missing Values Isolated
            </span>
            <p className="mt-2 font-mono text-2xl font-bold text-[var(--text-primary)]">
              {totalMissing}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Across all feature columns</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6">
            <span className="font-mono text-[10px] font-medium uppercase text-[var(--text-muted)]">
              Duplicate Rows
            </span>
            <p className="mt-2 font-mono text-2xl font-bold text-[var(--text-primary)]">
              {quality.duplicate_rows}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Redundant records isolated</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6">
            <span className="font-mono text-[10px] font-medium uppercase text-[var(--text-muted)]">
              Potential Outliers
            </span>
            <p className="mt-2 font-mono text-2xl font-bold text-[var(--status-warning)]">
              {totalOutliers}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">3-sigma anomaly threshold</p>
          </div>
        </div>

        {/* COLUMN CLASSIFICATION */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6">
            <div className="border-b border-[var(--border-subtle)] pb-3">
              <span className="font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                Numerical Variables ({classification.numerical.length})
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {classification.numerical.slice(0, 10).map((col) => (
                <span
                  key={col}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--background-soft)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-primary)]"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6">
            <div className="border-b border-[var(--border-subtle)] pb-3">
              <span className="font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                Categorical Variables ({classification.categorical.length})
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {classification.categorical.slice(0, 10).map((col) => (
                <span
                  key={col}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--background-soft)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-primary)]"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6">
            <div className="border-b border-[var(--border-subtle)] pb-3">
              <span className="font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                Datetime Variables ({classification.datetime.length})
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {classification.datetime.slice(0, 10).map((col) => (
                <span
                  key={col}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--background-soft)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-primary)]"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AGENT ORCHESTRATION NETWORK */}
        <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
          <div className="border-b border-[var(--border-subtle)] pb-3">
            <span className="font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
              Multi-Agent Network
            </span>
            <h3 className="font-sans text-sm font-semibold text-[var(--text-primary)] mt-1">
              Specialist Agent Orchestration Status
            </h3>
          </div>

          <div className="mt-6 divide-y divide-[var(--border-subtle)]">
            {agents.map((agent) => (
              <div key={agent.number} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-semibold text-[var(--highlight-ice)]">
                    {agent.number}
                  </span>
                  <div>
                    <h4 className="font-sans text-xs font-semibold text-[var(--text-primary)]">{agent.name}</h4>
                    <p className="font-sans text-[11px] text-[var(--text-secondary)]">{agent.description}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 self-start sm:self-auto rounded px-2.5 py-1 font-mono text-[9px] font-semibold uppercase ${
                    agent.status === "Complete"
                      ? "bg-[var(--structure-deep)] text-[var(--highlight-ice)] border border-[var(--border-active)]"
                      : "bg-[var(--background-soft)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${agent.status === "Complete" ? "bg-[var(--highlight-ice)]" : "bg-[var(--text-muted)]"}`} />
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PREPROCESSING NEXT ACTIONS */}
        {recommendations.length > 0 && (
          <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--highlight-ice)]">
              Data Quality Engine
            </span>
            <h3 className="font-sans text-sm font-semibold text-[var(--text-primary)] mt-1">
              Automated Data Cleaning Recommendations
            </h3>

            <div className="mt-5 space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 border-t border-[var(--border-subtle)] pt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                  <span className="font-mono font-semibold text-[var(--highlight-ice)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="font-sans">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* START NEW ANALYSIS CTA */}
        {onReset && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={onReset}
              className="btn-secondary"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Initialize New Enterprise Directive</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
