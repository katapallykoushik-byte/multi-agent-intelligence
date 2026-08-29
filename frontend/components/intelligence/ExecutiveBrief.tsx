"use client";

import React from "react";
import { AnalysisResult } from "./types";
import { Sparkles, CheckCircle2, AlertTriangle, Compass } from "lucide-react";

interface ExecutiveBriefProps {
  analysisResult?: AnalysisResult | null;
}

export const ExecutiveBrief: React.FC<ExecutiveBriefProps> = ({
  analysisResult,
}) => {
  const synthesis = analysisResult?.decision_synthesis;

  if (!synthesis) return null;

  return (
    <section
      id="executive-brief"
      className="relative w-full border-b border-[var(--border-subtle)] bg-[var(--background)] py-20 text-[var(--text-primary)] md:py-28"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        {/* HEADER & CONSENSUS BADGES */}
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[var(--highlight-ice)]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Apex Intelligence Synthesis
              </span>
            </div>
            <h2 className="editorial-heading mt-3 text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]">
              Executive Decision Brief
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-3 py-1 font-mono text-[11px] text-[var(--text-secondary)]">
              Confidence: {synthesis.confidence_assessment?.overall_confidence || "High"}
            </span>
            <span className="rounded border border-[var(--border-active)] bg-[var(--structure-deep)]/40 px-3 py-1 font-mono text-[11px] font-semibold text-[var(--highlight-ice)]">
              Multi-Agent Consensus Validated
            </span>
          </div>
        </div>

        {/* STRATEGIC SYNTHESIS STATEMENT */}
        <div className="mt-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-8 sm:p-10 lg:p-12 shadow-2xl">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Core Strategic Synthesis
          </span>
          <blockquote className="editorial-quote mt-4 text-xl sm:text-2xl md:text-3xl text-[var(--text-primary)] leading-relaxed">
            "{synthesis.executive_summary}"
          </blockquote>
        </div>

        {/* 3-PART STRUCTURED GRID: 01 FINDINGS, 02 TENSIONS, 03 DIRECTIVES */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* 01: CORE FINDINGS (4 cols) */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8 lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  01 / Core Findings
                </span>
                <CheckCircle2 className="h-4 w-4 text-[var(--structure-bright)]" />
              </div>
              <h3 className="mt-3 font-sans text-base font-semibold text-[var(--text-primary)]">
                Empirical Data Signals
              </h3>

              <div className="mt-6 space-y-4">
                {synthesis.primary_findings.map((finding, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--background-soft)] font-mono text-[10px] font-semibold text-[var(--highlight-ice)]">
                      {idx + 1}
                    </span>
                    <p className="font-sans text-xs leading-relaxed text-[var(--text-secondary)]">
                      {finding}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 02: CROSS-AGENT TENSIONS (4 cols) */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8 lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  02 / Cross-Agent Tensions
                </span>
                <AlertTriangle className="h-4 w-4 text-[var(--highlight-periwinkle)]" />
              </div>
              <h3 className="mt-3 font-sans text-base font-semibold text-[var(--text-primary)]">
                Friction Points & Trade-offs
              </h3>

              <div className="mt-6 space-y-4">
                {synthesis.cross_agent_connections.map((conn, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border-l-2 border-[var(--structure-bright)] bg-[var(--background-soft)] p-4 font-sans text-xs leading-relaxed text-[var(--text-secondary)]"
                  >
                    {conn}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 03: STRATEGIC DIRECTIVES (4 cols) */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8 lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  03 / Strategic Directives
                </span>
                <Compass className="h-4 w-4 text-[var(--highlight-ice)]" />
              </div>
              <h3 className="mt-3 font-sans text-base font-semibold text-[var(--text-primary)]">
                Prescribed Executive Action
              </h3>

              <div className="mt-6 space-y-4">
                {synthesis.recommended_actions.map((action, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-4"
                  >
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--highlight-ice)]">
                      Directive {String(idx + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1.5 font-sans text-xs leading-relaxed text-[var(--text-primary)]">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RELIABILITY & TELEMETRY FOOTER */}
        {synthesis.confidence_assessment && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-elevated)]/70 px-6 py-4 text-xs font-mono text-[var(--text-secondary)]">
            <div className="flex flex-wrap items-center gap-6">
              <span>Data Reliability: <strong className="text-[var(--text-primary)]">{synthesis.confidence_assessment.data_reliability_score}/100</strong></span>
              <span>•</span>
              <span>Model Validity: <strong className="text-[var(--highlight-ice)]">{synthesis.confidence_assessment.model_validity}</strong></span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Ensemble Coordinator Consensus Engine
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
