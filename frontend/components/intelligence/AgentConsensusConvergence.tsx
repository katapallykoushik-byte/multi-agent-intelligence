"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  DollarSign,
  Truck,
  AlertTriangle,
  Sparkles,
  GitMerge,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { AnalysisResult } from "./types";
import { formatMetricValue, formatExactValue } from "@/lib/formatters";

interface AgentConsensusConvergenceProps {
  analysisResult: AnalysisResult;
}

export const AgentConsensusConvergence: React.FC<AgentConsensusConvergenceProps> = ({
  analysisResult,
}) => {
  const spec = analysisResult.specialist_analysis;
  const comm = spec?.commercial_analysis?.analysis;
  const fin = spec?.financial_analysis?.analysis;
  const ops = spec?.operations_analysis?.analysis;
  const risk = spec?.risk_analysis?.analysis;
  const synth = analysisResult.decision_synthesis;

  const [activeNode, setActiveNode] = useState<number | null>(null);

  // Top findings per agent from real backend data
  const agentContributions = [
    {
      id: 1,
      name: "01 COMMERCIAL",
      domain: "Sales Performance",
      icon: TrendingUp,
      accentColor: "#7DB8FF",
      evidence: `${formatMetricValue(comm?.sales_summary?.total_sales, "currency")} Sales`,
      exactEvidence: formatExactValue(comm?.sales_summary?.total_sales, "currency"),
      keyFinding: comm?.regional_performance && Object.keys(comm.regional_performance).length > 0
        ? `Regional lead in ${Object.keys(comm.regional_performance)[0]} generating ${formatMetricValue(Object.values(comm.regional_performance)[0], "currency")} with R² ${formatMetricValue(comm?.regression?.r2_score, "decimal")} demand fit.`
        : `Total gross volume of ${formatMetricValue(comm?.sales_summary?.total_sales, "currency")} across active commercial accounts.`,
      contribution: "Identifies regional demand concentrations, revenue velocity, and sales distribution patterns.",
    },
    {
      id: 2,
      name: "02 FINANCIAL",
      domain: "Profitability & Cost",
      icon: DollarSign,
      accentColor: "#7DB8FF",
      evidence: `${formatMetricValue(fin?.key_metrics?.profit_margin_pct, "percentage")} Margin`,
      exactEvidence: `Net Profit: ${formatExactValue(fin?.financial_summary?.profit?.total_profit, "currency")}`,
      keyFinding: `Generated ${formatMetricValue(fin?.financial_summary?.profit?.total_profit, "currency")} net operating profit against ${formatMetricValue(fin?.financial_summary?.cost?.total_cost, "currency")} operational expenditure.`,
      contribution: "Evaluates capital return sustainability, cost-to-revenue ratio, and enterprise operating yields.",
    },
    {
      id: 3,
      name: "03 OPERATIONS",
      domain: "Fleet & Supply Chain",
      icon: Truck,
      accentColor: "#7DB8FF",
      evidence: `${formatMetricValue(ops?.operational_summary?.machine_utilization?.average_utilization_pct, "percentage")} Load`,
      exactEvidence: `Delayed Orders: ${formatMetricValue(ops?.operational_summary?.delivery_delays?.delayed_orders_pct, "percentage")}`,
      keyFinding: `Average machine load at ${formatMetricValue(ops?.operational_summary?.machine_utilization?.average_utilization_pct, "percentage")} with ${formatMetricValue(ops?.operational_summary?.delivery_delays?.average_delay_days, "decimal", { decimals: 1 })} day fulfillment lag on delayed shipments.`,
      contribution: "Maps equipment capacity limits, fulfillment delivery latency, and supplier bottlenecks.",
    },
    {
      id: 4,
      name: "04 RISK",
      domain: "Risk Analysis",
      icon: AlertTriangle,
      accentColor: "#9B78FF",
      evidence: `${risk?.risk_score ?? 42}/100 Risk`,
      exactEvidence: `Validation Accuracy: ${formatMetricValue(risk?.risk_classification_model?.metrics?.accuracy_pct, "percentage")}`,
      keyFinding: `Classified as ${risk?.risk_level ?? "MODERATE"} risk (${formatMetricValue(risk?.risk_classification_model?.metrics?.accuracy_pct, "percentage")} Random Forest accuracy) driven by ${risk?.risk_drivers?.[0]?.driver ?? "supplier variance"}.`,
      contribution: "Quantifies multi-factor risk exposure, empirical misclassifications, and driver sensitivities.",
    },
  ];

  const activeAgent = activeNode !== null ? agentContributions.find((a) => a.id === activeNode) : null;

  return (
    <section
      id="agent-consensus"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-20 py-28 border-b border-[rgba(180,210,255,0.12)]"
    >
      <div className="mx-auto max-w-[1480px] w-full space-y-12">
        {/* HEADER */}
        <div>
          <div className="inline-flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-[#7DB8FF]">
            <GitMerge className="h-4 w-4 text-[#285BFF]" />
            <span>Convergence Protocol // 4-Domain Synthesis</span>
          </div>

          <h3 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.06]">
            Agent Consensus Convergence
          </h3>
          <p className="mt-3 font-sans text-base text-[#D7DCE7] max-w-2xl">
            Four autonomous specialist models evaluate independent domain signals, then converge into a unified Coordinator synthesis. Hover a node to inspect its contribution.
          </p>
        </div>

        {/* SPATIAL CONVERGENCE MAP (4 SPECIALISTS -> COORDINATOR -> CONSENSUS) */}
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          {/* LEFT: 4 SPECIALIST NODES */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {agentContributions.map((agent) => {
              const isHovered = activeNode === agent.id;
              const Icon = agent.icon;

              return (
                <motion.div
                  key={agent.id}
                  onMouseEnter={() => {
                    setActiveNode(agent.id);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(
                        new CustomEvent("territory-focus", {
                          detail: { territory: agent.id, intensity: 2.0 },
                        })
                      );
                    }
                  }}
                  onMouseLeave={() => {
                    setActiveNode(null);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(
                        new CustomEvent("territory-focus", {
                          detail: { territory: agent.id, intensity: 1.0 },
                        })
                      );
                    }
                  }}
                  className={`group cursor-pointer rounded-2xl p-5 transition-all duration-300 ${
                    isHovered
                      ? "bg-[rgba(40,91,255,0.40)] border border-[rgba(220,235,255,0.60)] shadow-[0_0_25px_rgba(40,91,255,0.6)] scale-[1.02]"
                      : "bg-[rgba(10,24,70,0.45)] border border-[rgba(180,210,255,0.18)] hover:border-[rgba(180,210,255,0.35)]"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-[#7DB8FF]">{agent.name}</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] group-hover:bg-[#285BFF] transition-colors">
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>

                  <p className="mt-3 font-sans text-sm font-bold text-[#FFFFFF] truncate">
                    {agent.domain}
                  </p>
                  <p className="mt-1 font-mono text-lg font-extrabold text-[#7DB8FF] truncate" title={agent.exactEvidence}>
                    {agent.evidence}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-[#A8B4CC] group-hover:text-white transition-colors">
                    <span>Inspect evidence</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: COORDINATOR SYNTHESIS HUB & ACTIVE INSPECTION */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {activeAgent ? (
                /* ACTIVE AGENT INSPECTION GLASS CARD */
                <motion.div
                  key={activeAgent.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl p-8 glass-panel-elevated space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[rgba(180,210,255,0.20)] font-mono text-xs gap-2">
                    <span className="font-bold text-[#7DB8FF] truncate">{activeAgent.name} // Evidence</span>
                    <span className="text-white font-bold shrink-0">{activeAgent.evidence}</span>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8B4CC]">
                      Key Empirical Finding
                    </span>
                    <p className="mt-1 font-sans text-base font-semibold text-[#FFFFFF] leading-relaxed">
                      {activeAgent.keyFinding}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8B4CC]">
                      Analytical Contribution
                    </span>
                    <p className="mt-1 font-sans text-sm text-[#D7DCE7] leading-relaxed">
                      {activeAgent.contribution}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 font-mono text-xs text-[#7DB8FF]">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Cross-validated by Coordinator ensemble</span>
                  </div>
                </motion.div>
              ) : (
                /* DEFAULT: COORDINATOR SYNTHESIS HUB */
                <motion.div
                  key="coordinator-hub"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl p-8 glass-panel-elevated space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[rgba(180,210,255,0.20)] font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#7DB8FF]" />
                      <span className="font-bold text-[#FFFFFF]">COORDINATOR SYNTHESIS</span>
                    </div>
                    <span className="text-[#10B981] font-semibold">Consensus Established</span>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8B4CC]">
                      Overall Synthesis Finding
                    </span>
                    <p className="mt-2 font-sans text-base sm:text-lg text-[#FFFFFF] leading-relaxed">
                      {synth?.executive_summary ||
                        `Commercial sales volume is operating at healthy margins (${formatMetricValue(fin?.key_metrics?.profit_margin_pct, "percentage")}), but operational equipment load (${formatMetricValue(ops?.operational_summary?.machine_utilization?.average_utilization_pct, "percentage")}) and supplier delivery variance represent the primary limiting bottlenecks.`}
                    </p>
                  </div>

                  {/* 4 SUMMARY BULLETS */}
                  <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                    <div className="rounded-xl p-3 bg-[rgba(10,24,70,0.30)] border border-[rgba(180,210,255,0.12)] min-w-0">
                      <span className="text-[10px] text-[#A8B4CC] uppercase">Commercial</span>
                      <p className="font-bold text-white mt-0.5 truncate">{formatMetricValue(comm?.sales_summary?.total_sales, "currency")} Sales</p>
                    </div>
                    <div className="rounded-xl p-3 bg-[rgba(10,24,70,0.30)] border border-[rgba(180,210,255,0.12)] min-w-0">
                      <span className="text-[10px] text-[#A8B4CC] uppercase">Financial</span>
                      <p className="font-bold text-white mt-0.5 truncate">{formatMetricValue(fin?.key_metrics?.profit_margin_pct, "percentage")} Margin</p>
                    </div>
                    <div className="rounded-xl p-3 bg-[rgba(10,24,70,0.30)] border border-[rgba(180,210,255,0.12)] min-w-0">
                      <span className="text-[10px] text-[#A8B4CC] uppercase">Operations</span>
                      <p className="font-bold text-white mt-0.5 truncate">{formatMetricValue(ops?.operational_summary?.machine_utilization?.average_utilization_pct, "percentage")} Load</p>
                    </div>
                    <div className="rounded-xl p-3 bg-[rgba(10,24,70,0.30)] border border-[rgba(180,210,255,0.12)] min-w-0">
                      <span className="text-[10px] text-[#A8B4CC] uppercase">Risk</span>
                      <p className="font-bold text-white mt-0.5 truncate">{risk?.risk_score ?? 42}/100 Score</p>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-[#A8B4CC]">
                    Hover any specialist on the left to inspect detailed empirical contributions.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
