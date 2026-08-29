"use client";

import React, { useState } from "react";
import { AnalysisResult } from "./types";
import { FeatureImportance } from "./FeatureImportance";
import { ShieldAlert, Cpu, Activity } from "lucide-react";

interface RiskMatrixProps {
  analysisResult?: AnalysisResult | null;
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({ analysisResult }) => {
  const risk = analysisResult?.specialist_analysis?.risk_analysis;
  const [hoveredCell, setHoveredCell] = useState<{
    actual: string;
    predicted: string;
    count: number;
    pct: number;
    isDiagonal: boolean;
  } | null>(null);

  if (!risk) return null;

  const model = risk.analysis.risk_classification_model;
  const matrixObj = model?.confusion_matrix;
  const classMetrics = model?.class_metrics;

  return (
    <section
      id="risk-section"
      className="relative w-full border-b border-[var(--border-subtle)] bg-[var(--background)] py-20 text-[var(--text-primary)] md:py-28"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--highlight-ice)]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                04 / Predictive Risk Engine & ML Lab
              </span>
            </div>
            <h2 className="editorial-heading mt-3 text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]">
              Predictive Risk Classification & Validation
            </h2>
          </div>
          <p className="max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            Multiclass Random Forest classification, empirical 3×3 confusion matrix validation, and cross-agent threat signals.
          </p>
        </div>

        {/* RISK HEADER METRICS */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Composite Risk Index
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--highlight-ice)]">
              {risk.analysis.risk_score} <span className="text-sm font-normal text-[var(--text-muted)]">/ 100</span>
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Holistic enterprise risk exposure</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Overall Risk Level
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
              {risk.analysis.risk_level}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Threshold classification</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Data Quality Risk Factor
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {risk.analysis.risk_matrix?.data_risk ?? 0}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Quality anomaly factor</p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 shadow-md">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Operational Threat Risk
            </span>
            <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {risk.analysis.risk_matrix?.operational_risk ?? 0}
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Supply friction risk index</p>
          </div>
        </div>

        {/* CROSS-AGENT THREAT SIGNALS */}
        {risk.analysis.cross_agent_signals && risk.analysis.cross_agent_signals.length > 0 && (
          <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[var(--highlight-ice)]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--highlight-ice)]">
                Cross-Agent Threat Signals
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {risk.analysis.cross_agent_signals.map((sig, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border-l-2 border-[var(--structure-bright)] bg-[var(--background-soft)] p-4 font-sans text-xs sm:text-sm leading-relaxed text-[var(--text-primary)]"
                >
                  {sig}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            ML LABORATORY: PREDICTIVE RISK CLASSIFICATION & MATRIX
           ========================================================= */}
        {model && model.status === "success" && (
          <div className="mt-12 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6 sm:p-10 shadow-2xl">
            {/* CONTAINER HEADER */}
            <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  Machine Learning Laboratory
                </span>
                <h3 className="editorial-heading mt-2 text-2xl sm:text-3xl text-[var(--text-primary)]">
                  Multiclass Predictive Risk Classification
                </h3>
              </div>
              <span className="rounded border border-[var(--border-active)] bg-[var(--structure-deep)]/40 px-3 py-1 font-mono text-xs font-semibold text-[var(--highlight-ice)]">
                Random Forest Classifier
              </span>
            </div>

            {/* 4 MODEL ACCURACY METRICS */}
            {model.metrics && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-5">
                  <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">Model Accuracy</span>
                  <p className="mt-2 font-mono text-3xl font-bold text-[var(--highlight-ice)]">
                    {model.metrics.accuracy_pct}%
                  </p>
                  <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Validation accuracy score</p>
                </div>

                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-5">
                  <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">Precision Rate</span>
                  <p className="mt-2 font-mono text-3xl font-bold text-[var(--text-primary)]">
                    {model.metrics.precision_pct}%
                  </p>
                  <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Prediction purity metric</p>
                </div>

                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-5">
                  <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">Recall Sensitivity</span>
                  <p className="mt-2 font-mono text-3xl font-bold text-[var(--text-primary)]">
                    {model.metrics.recall_pct}%
                  </p>
                  <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Threat detection rate</p>
                </div>

                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-soft)] p-5">
                  <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">F1 Balanced Score</span>
                  <p className="mt-2 font-mono text-3xl font-bold text-[var(--highlight-ice)]">
                    {model.metrics.f1_score_pct}%
                  </p>
                  <p className="mt-1 font-sans text-xs text-[var(--text-secondary)]">Harmonic balanced mean</p>
                </div>
              </div>
            )}

            {/* CONFUSION MATRIX & CLASS SENSITIVITY BREAKDOWN */}
            <div className="mt-10 grid gap-8 lg:grid-cols-12">
              {/* LEFT: 3X3 CONFUSION MATRIX (7 COLS) */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-soft)] p-6 sm:p-8 lg:col-span-7">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Empirical Validation
                    </span>
                    <h4 className="font-sans text-sm font-semibold text-[var(--text-primary)]">
                      Actual vs. Predicted Confusion Matrix
                    </h4>
                  </div>
                  <span className="rounded border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-2.5 py-0.5 font-mono text-[9px] text-[var(--text-secondary)]">
                    3×3 Multiclass
                  </span>
                </div>

                {matrixObj && (
                  <div className="mt-6">
                    <div className="overflow-x-auto">
                      <div className="min-w-[380px]">
                        {/* TOP AXIS: PREDICTED RISK LEVEL */}
                        <div className="text-center">
                          <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                            PREDICTED RISK LEVEL →
                          </span>
                        </div>

                        {/* HEADER LABELS */}
                        <div className="mt-3 grid grid-cols-[80px_repeat(3,1fr)] gap-2.5 text-center font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          <div className="text-left italic">ACTUAL ↓</div>
                          <div className="rounded bg-[var(--background-elevated)] py-1 border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                            Low
                          </div>
                          <div className="rounded bg-[var(--background-elevated)] py-1 border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                            Medium
                          </div>
                          <div className="rounded bg-[var(--background-elevated)] py-1 border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                            High
                          </div>
                        </div>

                        {/* MATRIX ROWS */}
                        {matrixObj.classes.map((actualClass, rowIdx) => {
                          const matrix = matrixObj.matrix || [];
                          const rowValues = matrix[rowIdx] || [0, 0, 0];
                          const rowTotal = rowValues.reduce((a: number, b: number) => a + b, 0);

                          return (
                            <div
                              key={actualClass}
                              className="mt-2.5 grid grid-cols-[80px_repeat(3,1fr)] items-center gap-2.5"
                            >
                              {/* Actual class label */}
                              <div className="rounded bg-[var(--background-elevated)] py-3 text-center font-mono text-[10px] font-semibold uppercase text-[var(--text-primary)] border border-[var(--border-subtle)]">
                                {actualClass}
                              </div>

                              {/* 3 Cells for Predicted LOW, MEDIUM, HIGH */}
                              {rowValues.map((val: number, colIdx: number) => {
                                const isDiagonal = rowIdx === colIdx;
                                const pct = rowTotal > 0 ? (val / rowTotal) * 100 : 0;
                                const predClass = matrixObj.classes[colIdx];

                                return (
                                  <div
                                    key={colIdx}
                                    onMouseEnter={() =>
                                      setHoveredCell({
                                        actual: actualClass,
                                        predicted: predClass,
                                        count: val,
                                        pct,
                                        isDiagonal,
                                      })
                                    }
                                    onMouseLeave={() => setHoveredCell(null)}
                                    className={`group flex h-18 cursor-pointer flex-col items-center justify-center rounded-lg border transition-all duration-150 ${
                                      isDiagonal
                                        ? val > 0
                                          ? "border-[var(--border-active)] bg-[var(--structure-deep)] text-[var(--highlight-ice)] hover:border-[var(--highlight-ice)] hover:shadow-lg"
                                          : "border-[var(--border-subtle)] bg-[var(--background-elevated)] text-[var(--text-muted)]"
                                        : val > 0
                                        ? "border-[var(--border-subtle)] bg-[var(--background-elevated)]/60 text-[var(--text-secondary)] hover:border-[var(--border-active)]"
                                        : "border-[var(--border-subtle)] bg-[var(--background-elevated)]/30 text-[var(--text-muted)]"
                                    }`}
                                  >
                                    <span className="font-mono text-xl font-bold">
                                      {val}
                                    </span>
                                    <span className="font-mono text-[9px] opacity-75">
                                      {pct.toFixed(0)}%
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* INTERACTIVE HOVER DETAIL BANNER */}
                    <div className="mt-5 min-h-[44px] rounded-lg border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-4 py-2.5 font-mono text-xs text-[var(--text-primary)]">
                      {hoveredCell ? (
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <strong>Actual:</strong> {hoveredCell.actual} → <strong>Predicted:</strong> {hoveredCell.predicted}
                          </div>
                          <div className="flex items-center gap-4">
                            <span>Records: <strong>{hoveredCell.count}</strong></span>
                            <span>Share: <strong>{hoveredCell.pct.toFixed(1)}%</strong></span>
                            <span className="rounded bg-[var(--background-soft)] px-2 py-0.5 text-[10px] text-[var(--highlight-ice)]">
                              {hoveredCell.isDiagonal ? "Correct Classification" : "Prediction Variance"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[var(--text-muted)] text-[11px]">
                          Hover over any matrix cell to view actual vs. predicted distribution details.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: CLASS SENSITIVITY (5 COLS) */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-soft)] p-6 sm:p-8 lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="border-b border-[var(--border-subtle)] pb-4">
                    <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Per-Class Sensitivity
                    </span>
                    <h4 className="font-sans text-sm font-semibold text-[var(--text-primary)]">
                      Precision & Recall Distribution
                    </h4>
                  </div>

                  {classMetrics && (
                    <div className="mt-6 space-y-4">
                      {(["LOW", "MEDIUM", "HIGH"] as const).map((cls) => {
                        const m = classMetrics[cls];
                        if (!m) return null;

                        return (
                          <div
                            key={cls}
                            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
                          >
                            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                                {cls} RISK
                              </span>
                              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                                {m.support} records
                              </span>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                              <div className="rounded bg-[var(--background-soft)] p-2">
                                <span className="font-mono text-[9px] uppercase text-[var(--text-muted)]">Precision</span>
                                <p className="mt-1 font-mono text-xs font-bold text-[var(--text-primary)]">{m.precision_pct}%</p>
                              </div>
                              <div className="rounded bg-[var(--background-soft)] p-2">
                                <span className="font-mono text-[9px] uppercase text-[var(--text-muted)]">Recall</span>
                                <p className="mt-1 font-mono text-xs font-bold text-[var(--text-primary)]">{m.recall_pct}%</p>
                              </div>
                              <div className="rounded bg-[var(--background-soft)] p-2">
                                <span className="font-mono text-[9px] uppercase text-[var(--text-muted)]">F1 Score</span>
                                <p className="mt-1 font-mono text-xs font-bold text-[var(--highlight-ice)]">{m.f1_score_pct}%</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FEATURE IMPORTANCE & METHODOLOGY */}
            <FeatureImportance model={model} />
          </div>
        )}
      </div>
    </section>
  );
};
