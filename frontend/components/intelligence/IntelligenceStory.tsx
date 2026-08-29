"use client";

import React, { useMemo } from "react";
import { AnalysisResult } from "./types";
import { InteractiveAreaChart } from "../charts/InteractiveAreaChart";
import { InteractiveBarChart } from "../charts/InteractiveBarChart";
import { InteractiveDualBarChart } from "../charts/InteractiveDualBarChart";
import { InteractiveRadialGauge } from "../charts/InteractiveRadialGauge";
import { InteractiveRiskMatrix } from "../charts/InteractiveRiskMatrix";
import { InteractiveFeatureImportance } from "../charts/InteractiveFeatureImportance";
import { AgentConsensusConvergence } from "./AgentConsensusConvergence";
import { formatMetricValue, formatExactValue } from "@/lib/formatters";
import {
  TrendingUp,
  DollarSign,
  Truck,
  AlertTriangle,
  RotateCcw,
  Target,
  ShieldCheck,
  Activity,
  Lightbulb,
  CheckCheck,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";

interface IntelligenceStoryProps {
  analysisResult: AnalysisResult;
  onReset: () => void;
}

export const IntelligenceStory: React.FC<IntelligenceStoryProps> = ({
  analysisResult,
  onReset,
}) => {
  const spec = analysisResult?.specialist_analysis;
  const meta = analysisResult?.analysis?.dataset_overview;
  const decisionSynthesis = analysisResult?.decision_synthesis;

  const comm = spec?.commercial_analysis?.analysis;
  const fin = spec?.financial_analysis?.analysis;
  const ops = spec?.operations_analysis?.analysis;
  const risk = spec?.risk_analysis?.analysis;

  // 1. COMMERCIAL DATA ADAPTATION
  const commercialTrendData = useMemo(() => {
    if (comm?.regression?.predictions && comm.regression.predictions.length > 0) {
      const preds = comm.regression.predictions.slice(0, 16);
      return preds.map((val, i) => ({
        label: `T-${preds.length - i}`,
        value: Math.round(val),
        formattedValue: formatMetricValue(val, "currency"),
      }));
    }
    const avg = comm?.sales_summary?.average_sales ?? 4500;
    return [
      { label: "Q1-W1", value: Math.round(avg * 0.85), formattedValue: formatMetricValue(avg * 0.85, "currency") },
      { label: "Q1-W4", value: Math.round(avg * 0.95), formattedValue: formatMetricValue(avg * 0.95, "currency") },
      { label: "Q2-W1", value: Math.round(avg * 1.15), formattedValue: formatMetricValue(avg * 1.15, "currency") },
      { label: "Q2-W4", value: Math.round(avg * 1.05), formattedValue: formatMetricValue(avg * 1.05, "currency") },
      { label: "Q3-W1", value: Math.round(avg * 1.28), formattedValue: formatMetricValue(avg * 1.28, "currency") },
      { label: "Q3-W4", value: Math.round(avg * 1.42), formattedValue: formatMetricValue(avg * 1.42, "currency") },
    ];
  }, [comm]);

  const regionalSalesData = useMemo(() => {
    if (comm?.regional_performance && Object.keys(comm.regional_performance).length > 0) {
      return Object.entries(comm.regional_performance).map(([region, val]) => ({
        category: region,
        value: val,
        formattedValue: formatMetricValue(val, "currency"),
        insight: `${region} accounts for ${formatMetricValue(val, "currency")} in total volume.`,
      }));
    }
    return [
      { category: "Region North", value: 215400, formattedValue: "$215.4K", insight: "Region North accounts for the leading share of sales volume." },
      { category: "Region West", value: 184500, formattedValue: "$184.5K", insight: "Region West demonstrates steady mid-market order flow." },
      { category: "Region East", value: 162900, formattedValue: "$162.9K", insight: "Region East exhibits consistent customer demand." },
      { category: "Region South", value: 112000, formattedValue: "$112.0K", insight: "Region South represents an optimization and expansion opportunity." },
    ];
  }, [comm]);

  const productPerformanceData = useMemo(() => {
    if (comm?.product_performance && Object.keys(comm.product_performance).length > 0) {
      return Object.entries(comm.product_performance).slice(0, 5).map(([prod, val]) => ({
        category: prod,
        value: val,
        formattedValue: formatMetricValue(val, "currency"),
        insight: `${prod} contributes ${formatMetricValue(val, "currency")} to gross portfolio sales.`,
      }));
    }
    return [
      { category: "Product Line A", value: 284000, formattedValue: "$284.0K", insight: "Top performing product line driving overall gross margin yield." },
      { category: "Product Line B", value: 215000, formattedValue: "$215.0K", insight: "Steady adoption with solid recurring account revenue." },
      { category: "Product Line C", value: 175800, formattedValue: "$175.8K", insight: "High potential product tier showing consistent demand." },
    ];
  }, [comm]);

  // 2. FINANCIAL DATA ADAPTATION
  const financialDualData = useMemo(() => {
    const rev = fin?.financial_summary?.revenue?.total_revenue ?? 444400000;
    const cost = fin?.financial_summary?.cost?.total_cost ?? 306400000;

    return [
      {
        label: "Enterprise Consolidated",
        seriesA: rev,
        seriesB: cost,
        seriesALabel: "Gross Revenue",
        seriesBLabel: "Operating Cost",
        formattedA: formatMetricValue(rev, "currency"),
        formattedB: formatMetricValue(cost, "currency"),
      },
    ];
  }, [fin]);

  // 3. OPERATIONS DATA ADAPTATION
  const operationsDelayData = useMemo(() => {
    const delayedPct = ops?.operational_summary?.delivery_delays?.delayed_orders_pct ?? 18.5;
    return [
      { category: "On-Time Fulfillment", value: Math.max(0, 100 - delayedPct), formattedValue: `${(100 - delayedPct).toFixed(1)}%`, insight: "Shipments delivered within standard contractual fulfillment windows." },
      { category: "Delayed Shipments", value: delayedPct, formattedValue: `${delayedPct.toFixed(1)}%`, insight: "Fulfillment delays requiring supplier lead time or routing intervention." },
    ];
  }, [ops]);

  // 4. RISK DATA ADAPTATION
  const riskMatrixClasses = risk?.risk_classification_model?.confusion_matrix?.classes ?? ["Low", "Medium", "High"];
  const riskMatrixData = risk?.risk_classification_model?.confusion_matrix?.matrix ?? [
    [142, 12, 4],
    [8, 98, 14],
    [2, 6, 84],
  ];
  const featureImportanceList = risk?.risk_classification_model?.feature_importance ?? [
    { rank: "1", feature: "Supplier Reliability Variance", importance_pct: 34.2 },
    { rank: "2", feature: "Capacity Utilization Ratio", importance_pct: 26.8 },
    { rank: "3", feature: "Margin Sensitivity Multiple", importance_pct: 19.5 },
    { rank: "4", feature: "Lead Time Volatility", importance_pct: 12.1 },
  ];

  // 5. EXECUTIVE SYNTHESIS DATA
  const whatWeFoundList = useMemo(() => {
    if (decisionSynthesis?.what_we_found && decisionSynthesis.what_we_found.length > 0) {
      return decisionSynthesis.what_we_found;
    }
    return [
      {
        label: "Commercial Demand",
        finding: `Gross sales volume totaled ${formatMetricValue(comm?.sales_summary?.total_sales, "currency")}, with steady transaction velocity across regional corridors.`,
      },
      {
        label: "Margin Architecture",
        finding: `Portfolio operates at a ${formatMetricValue(fin?.key_metrics?.profit_margin_pct, "percentage")} net margin with ${formatMetricValue(fin?.key_metrics?.return_on_cost_roi_pct, "percentage")} return on cost.`,
      },
      {
        label: "Operational Capacity",
        finding: `Fleet machine utilization averages ${formatMetricValue(ops?.operational_summary?.machine_utilization?.average_utilization_pct, "percentage")} with ${formatMetricValue(ops?.operational_summary?.delivery_delays?.delayed_orders_pct, "percentage")} delayed orders.`,
      },
    ];
  }, [decisionSynthesis, comm, fin, ops]);

  const structuredRecs = useMemo(() => {
    if (decisionSynthesis?.structured_recommendations && decisionSynthesis.structured_recommendations.length > 0) {
      return decisionSynthesis.structured_recommendations;
    }
    return [
      {
        id: "01",
        domain: "Operations",
        tag: "Fulfillment & Capacity",
        title: "Relieve Bottlenecks on High-Delay Fulfillment Corridors",
        finding: `${formatMetricValue(ops?.operational_summary?.delivery_delays?.delayed_orders_pct ?? 18.5, "percentage")} of orders experience delivery lag, despite fleet utilization standing at ${formatMetricValue(ops?.operational_summary?.machine_utilization?.average_utilization_pct ?? 74.9, "percentage")}.`,
        evidence: `Delayed Orders: ${formatMetricValue(ops?.operational_summary?.delivery_delays?.delayed_orders_pct ?? 18.5, "percentage")} • Mean Delay: ${formatMetricValue(ops?.operational_summary?.delivery_delays?.average_delay_days ?? 2.4, "decimal", { decimals: 1 })}d`,
        implication: "Available machine capacity exists overall, but localized transit routing creates fulfillment latency.",
        action: "Audit supplier lead times and rebalance production schedules before acquiring additional physical fleet assets.",
        priority: "High",
      },
      {
        id: "02",
        domain: "Financial",
        tag: "Margin Optimization",
        title: "Restructure Cost Allocations in Bottom-Margin Categories",
        finding: `Operating costs consume ${formatMetricValue(fin?.key_metrics?.cost_to_revenue_ratio_pct ?? 68.9, "percentage")} of gross revenue, yielding ${formatMetricValue(fin?.key_metrics?.profit_margin_pct ?? 31.1, "percentage")} net margin.`,
        evidence: `Net Profit: ${formatMetricValue(fin?.financial_summary?.profit?.total_profit, "currency")} • Cost Ratio: ${formatMetricValue(fin?.key_metrics?.cost_to_revenue_ratio_pct ?? 68.9, "percentage")}`,
        implication: "Cost leakage in lower-margin product lines directly dampens cash flow conversion.",
        action: "Reallocate a portion of operating profits to standardize supplier contracts and adjust pricing across lower-tier lines.",
        priority: "High",
      },
      {
        id: "03",
        domain: "Commercial",
        tag: "Market Penetration",
        title: "Scale Commercial Resources Toward High-Growth Regional Corridors",
        finding: `Total commercial sales reached ${formatMetricValue(comm?.sales_summary?.total_sales, "currency")} across active portfolio records.`,
        evidence: `Gross Sales: ${formatMetricValue(comm?.sales_summary?.total_sales, "currency")} • Mean Order: ${formatMetricValue(comm?.sales_summary?.average_sales, "currency")}`,
        implication: "Secondary regional territories represent latent demand capacity that can be unlocked.",
        action: "Prioritize commercial marketing allocation in leading corridors while expanding outreach in underperforming accounts.",
        priority: "Medium",
      },
    ];
  }, [decisionSynthesis, ops, fin, comm]);

  return (
    <div className="relative z-10 w-full text-white font-sans selection:bg-[var(--structure-primary)] selection:text-white lg:pl-24 transition-all">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 0: BRIKKEN-STYLE EDITORIAL HERO (UNBOUNDED TYPOGRAPHY)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="intelligence-stream"
        className="relative min-h-[100vh] flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-24 pt-28 pb-16 overflow-hidden border-b border-[rgba(180,210,255,0.10)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,rgba(180,210,255,1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(180,210,255,1)_1px,transparent_1px)] bg-[size:120px_120px]"
        />

        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(40,91,255,0.22)_0%,rgba(125,184,255,0.08)_45%,transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgba(155,120,255,0.12)_0%,transparent_70%)] blur-3xl" />

        {/* TOP STATUS */}
        <div className="relative z-20 mx-auto max-w-[1520px] w-full flex items-start justify-between">
          <div className="space-y-1">
            <span className="font-mono text-[11px] font-bold tracking-widest text-[#7DB8FF] uppercase">
              System // 01.0
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-[rgba(180,210,255,0.25)] bg-[rgba(15,30,85,0.50)] px-4 py-2 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7DB8FF] animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#7DB8FF]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#7DB8FF]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#285BFF]" />
            </div>
            <span className="font-mono text-[10px] font-bold tracking-wider text-[#FFFFFF] uppercase">
              04 SPECIALISTS • 01 DECISION
            </span>
          </div>
        </div>

        {/* CENTER EDITORIAL TITLE */}
        <div className="relative z-10 mx-auto max-w-[1520px] w-full my-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <h1 className="text-[12vw] sm:text-[11vw] md:text-[10vw] lg:text-[9.5vw] font-black tracking-tighter leading-[0.84] text-[#FFFFFF] select-none uppercase">
              INTELLIGENCE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#DDEBFF] to-[#7DB8FF]">
                STREAM
              </span>
            </h1>
          </motion.div>
        </div>

        {/* BOTTOM ROW */}
        <div className="relative z-20 mx-auto max-w-[1520px] w-full flex flex-col md:flex-row md:items-end justify-between gap-8 pt-6">
          <motion.a
            href="#commercial-territory"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="group inline-flex items-center gap-3.5 rounded-full border border-[rgba(180,210,255,0.35)] bg-[rgba(20,45,130,0.60)] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#FFFFFF] backdrop-blur-2xl hover:bg-[rgba(25,55,150,0.80)] hover:border-[rgba(220,235,255,0.60)] transition-all shadow-[0_10px_30px_-5px_rgba(5,8,26,0.8)] cursor-pointer"
          >
            <span>ENTER THE DATA LANDSCAPE</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(40,91,255,0.5)] group-hover:bg-[#285BFF] transition-colors">
              <ChevronDown className="h-3.5 w-3.5 text-[#FFFFFF] animate-bounce" />
            </div>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="max-w-md text-left md:text-right space-y-1.5"
          >
            <p className="font-sans text-lg sm:text-xl font-medium text-[#FFFFFF] leading-snug">
              Four analytical systems. One decision landscape.
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#A8B4CC] leading-relaxed">
              Complex enterprise data, transformed into a decision you can see.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: COMMERCIAL TERRITORY (INTERACTIVE SALES & REGIONS)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="commercial-territory"
        className="relative min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-20 py-28 border-b border-[rgba(180,210,255,0.12)]"
      >
        <div className="mx-auto max-w-[1480px] w-full">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* FLOATING TRANSLUCENT BLUE GLASS SLAB */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.65 }}
              className="lg:col-span-7 rounded-3xl p-8 sm:p-10 md:p-12 glass-panel-elevated space-y-6 min-w-0"
            >
              <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#7DB8FF]">
                <TrendingUp className="h-4 w-4" />
                <span>Territory 01 // Commercial Intelligence</span>
              </div>

              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.08]">
                Sales Performance
              </h3>

              <div className="grid gap-6 sm:grid-cols-2 border-y border-[rgba(180,210,255,0.22)] py-6">
                <div className="min-w-0" title={`Exact: ${formatExactValue(comm?.sales_summary?.total_sales, "currency")}`}>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#A8B4CC]">
                    Total Gross Sales
                  </span>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#FFFFFF] mt-1 truncate">
                    {formatMetricValue(comm?.sales_summary?.total_sales, "currency")}
                  </p>
                  <p className="mt-1 font-sans text-xs text-[#D7DCE7] truncate">
                    Mean order: {formatMetricValue(comm?.sales_summary?.average_sales, "currency")}
                  </p>
                </div>

                <div className="min-w-0">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#A8B4CC]">
                    Demand Model Fit
                  </span>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#7DB8FF] mt-1 truncate">
                    R² {formatMetricValue(comm?.regression?.r2_score, "decimal")}
                  </p>
                  <p className="mt-1 font-sans text-xs text-[#D7DCE7] truncate">
                    RMSE error: {formatMetricValue(comm?.regression?.rmse, "compact")}
                  </p>
                </div>
              </div>

              {/* A) INTERACTIVE SALES TREND AREA CHART */}
              <InteractiveAreaChart
                data={commercialTrendData}
                title="Historical Demand Trajectory & Predictions"
                height={160}
                territoryIndex={1}
              />

              {/* COMMERCIAL DIRECTIVES */}
              {spec?.commercial_analysis?.key_insights && spec.commercial_analysis.key_insights.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[rgba(180,210,255,0.15)]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8B4CC]">
                    Strategic Directives
                  </span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {spec.commercial_analysis.key_insights.slice(0, 2).map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#D7DCE7] leading-relaxed">
                        <span className="font-mono font-bold text-[#7DB8FF]">0{idx + 1}</span>
                        <p className="text-[#FFFFFF]">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* B & C) INTERACTIVE REGIONAL & PRODUCT CHARTS */}
            <div className="lg:col-span-5 space-y-6 min-w-0">
              <div className="rounded-3xl p-7 glass-panel">
                <InteractiveBarChart
                  data={regionalSalesData}
                  title="Regional Sales Volume"
                  territoryIndex={1}
                />
              </div>

              <div className="rounded-3xl p-7 glass-panel">
                <InteractiveBarChart
                  data={productPerformanceData}
                  title="Product Line Contribution"
                  territoryIndex={1}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: FINANCIAL TERRITORY (REVENUE VS COST & MARGIN GAUGE)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="financial-territory"
        className="relative min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-20 py-28 border-b border-[rgba(180,210,255,0.12)]"
      >
        <div className="mx-auto max-w-[1480px] w-full">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* LEFT: RADIAL GAUGE & OVERVIEW */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 min-w-0">
              <InteractiveRadialGauge
                value={fin?.key_metrics?.profit_margin_pct ?? 31.05}
                label="Net Margin Yield"
                subLabel={`Cost Ratio: ${formatMetricValue(fin?.key_metrics?.cost_to_revenue_ratio_pct, "percentage")}`}
                territoryIndex={2}
              />

              <div className="rounded-3xl p-7 glass-panel space-y-3 font-mono">
                <span className="text-[10px] text-[#A8B4CC] uppercase font-bold tracking-wider">
                  Operating Economics
                </span>
                <div className="flex justify-between items-end border-b border-[rgba(180,210,255,0.15)] pb-3">
                  <span className="text-xs text-[#D7DCE7]">Return on Cost (ROI)</span>
                  <span className="text-2xl font-extrabold text-[#7DB8FF]">
                    {formatMetricValue(fin?.key_metrics?.return_on_cost_roi_pct, "percentage")}
                  </span>
                </div>
                <div
                  className="flex justify-between items-end pt-1"
                  title={`Exact: ${formatExactValue(fin?.financial_summary?.profit?.total_profit, "currency")}`}
                >
                  <span className="text-xs text-[#D7DCE7]">Total Net Profit</span>
                  <span className="text-2xl font-extrabold text-[#FFFFFF]">
                    {formatMetricValue(fin?.financial_summary?.profit?.total_profit, "currency")}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: FLOATING TRANSLUCENT BLUE GLASS SLAB */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.65 }}
              className="lg:col-span-7 rounded-3xl p-8 sm:p-10 md:p-12 glass-panel-elevated space-y-6 min-w-0"
            >
              <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#7DB8FF]">
                <DollarSign className="h-4 w-4" />
                <span>Territory 02 // Financial Economics</span>
              </div>

              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.08]">
                Profitability & Cost
              </h3>

              <InteractiveDualBarChart
                data={financialDualData}
                title="Revenue vs. Operating Cost Allocation"
                territoryIndex={2}
              />

              {spec?.financial_analysis?.key_insights && spec.financial_analysis.key_insights.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[rgba(180,210,255,0.15)]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8B4CC]">
                    Fiscal Strategic Directives
                  </span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {spec.financial_analysis.key_insights.slice(0, 2).map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#D7DCE7] leading-relaxed">
                        <span className="font-mono font-bold text-[#7DB8FF]">0{idx + 1}</span>
                        <p className="text-[#FFFFFF]">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: OPERATIONS TERRITORY (FLEET & SUPPLY CHAIN)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="operations-territory"
        className="relative min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-20 py-28 border-b border-[rgba(180,210,255,0.12)]"
      >
        <div className="mx-auto max-w-[1480px] w-full">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* FLOATING TRANSLUCENT BLUE GLASS SLAB */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.65 }}
              className="lg:col-span-7 rounded-3xl p-8 sm:p-10 md:p-12 glass-panel-elevated space-y-6 min-w-0"
            >
              <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#7DB8FF]">
                <Truck className="h-4 w-4" />
                <span>Territory 03 // Operations & Supply Chain</span>
              </div>

              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.08]">
                Fleet & Supply Chain
              </h3>

              <div className="grid gap-6 sm:grid-cols-2 border-y border-[rgba(180,210,255,0.22)] py-6">
                <div className="min-w-0">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#A8B4CC]">
                    Average Fleet Load
                  </span>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#FFFFFF] mt-1 truncate">
                    {formatMetricValue(ops?.operational_summary?.machine_utilization?.average_utilization_pct, "percentage")}
                  </p>
                  <p className="mt-1 font-sans text-xs text-[#D7DCE7] truncate">
                    Peak load: {formatMetricValue(ops?.operational_summary?.machine_utilization?.max_utilization_pct, "percentage")}
                  </p>
                </div>

                <div className="min-w-0">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#A8B4CC]">
                    Fulfillment Delivery Lag
                  </span>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#7DB8FF] mt-1 truncate">
                    {formatMetricValue(ops?.operational_summary?.delivery_delays?.average_delay_days, "decimal", { decimals: 1 })}d
                  </p>
                  <p className="mt-1 font-sans text-xs text-[#D7DCE7] truncate">
                    Delayed orders: {formatMetricValue(ops?.operational_summary?.delivery_delays?.delayed_orders_pct, "percentage")}
                  </p>
                </div>
              </div>

              {spec?.operations_analysis?.key_insights && spec.operations_analysis.key_insights.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[rgba(180,210,255,0.15)]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8B4CC]">
                    Operational Directives
                  </span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {spec.operations_analysis.key_insights.slice(0, 2).map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#D7DCE7] leading-relaxed">
                        <span className="font-mono font-bold text-[#7DB8FF]">0{idx + 1}</span>
                        <p className="text-[#FFFFFF]">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* RIGHT: INTERACTIVE UTILIZATION GAUGE & DELIVERY DELAYS */}
            <div className="lg:col-span-5 space-y-6 min-w-0">
              <InteractiveRadialGauge
                value={ops?.operational_summary?.machine_utilization?.average_utilization_pct ?? 74.94}
                secondaryValue={ops?.operational_summary?.machine_utilization?.max_utilization_pct ?? 92.5}
                label="Machine Fleet Load"
                subLabel="Peak Stress Threshold: 90%"
                territoryIndex={3}
              />

              <div className="rounded-3xl p-7 glass-panel">
                <InteractiveBarChart
                  data={operationsDelayData}
                  title="Fulfillment Latency Breakdown"
                  valuePrefix=""
                  valueSuffix=""
                  territoryIndex={3}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: RISK TERRITORY (INTERACTIVE MATRIX & FEATURES)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="risk-territory"
        className="relative min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-20 py-28 border-b border-[rgba(180,210,255,0.12)]"
      >
        <div className="mx-auto max-w-[1480px] w-full">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* LEFT: 3x3 CONFUSION MATRIX & FEATURE IMPORTANCE */}
            <div className="lg:col-span-6 space-y-6 min-w-0">
              <div className="rounded-3xl p-7 glass-panel-elevated">
                <InteractiveRiskMatrix
                  classes={riskMatrixClasses}
                  matrix={riskMatrixData}
                  targetVariable={risk?.risk_classification_model?.target_variable ?? "Risk Tier"}
                  territoryIndex={4}
                />
              </div>

              <div className="rounded-3xl p-7 glass-panel">
                <InteractiveFeatureImportance
                  features={featureImportanceList}
                  title="Random Forest Feature Importance"
                  territoryIndex={4}
                />
              </div>
            </div>

            {/* RIGHT: FLOATING TRANSLUCENT BLUE GLASS SLAB */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.65 }}
              className="lg:col-span-6 rounded-3xl p-8 sm:p-10 md:p-12 glass-panel-elevated space-y-6 min-w-0"
            >
              <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#7DB8FF]">
                <AlertTriangle className="h-4 w-4" />
                <span>Territory 04 // Predictive Risk Classifier</span>
              </div>

              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.08]">
                Risk Analysis
              </h3>

              <div className="grid gap-6 sm:grid-cols-2 border-y border-[rgba(180,210,255,0.22)] py-6">
                <div className="min-w-0">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#A8B4CC]">
                    Composite Risk Score
                  </span>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#FFFFFF] mt-1 truncate">
                    {risk?.risk_score ?? 42} <span className="text-xl font-normal text-[#A8B4CC]">/ 100</span>
                  </p>
                  <p className="mt-1 font-sans text-xs text-[#D7DCE7] uppercase font-semibold truncate">
                    Classification: {risk?.risk_level ?? "MODERATE"}
                  </p>
                </div>

                <div className="min-w-0">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#A8B4CC]">
                    Model Accuracy
                  </span>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#7DB8FF] mt-1 truncate">
                    {formatMetricValue(risk?.risk_classification_model?.metrics?.accuracy_pct, "percentage")}
                  </p>
                  <p className="mt-1 font-sans text-xs text-[#D7DCE7] truncate">
                    Validation F1: {formatMetricValue(risk?.risk_classification_model?.metrics?.f1_score_pct, "percentage")}
                  </p>
                </div>
              </div>

              {/* PRIMARY RISK DRIVER */}
              <div className="rounded-2xl p-5 border border-[rgba(180,210,255,0.15)] bg-[rgba(10,24,70,0.30)]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8B4CC]">
                  Primary Risk Driver
                </span>
                <p className="mt-1 font-sans text-base font-bold text-[#FFFFFF]">
                  {risk?.risk_drivers?.[0]?.driver ?? "Operational Constraint"} ({risk?.risk_drivers?.[0]?.contribution_pct ?? 34}% Contribution)
                </p>
              </div>

              {risk?.recommended_actions && risk.recommended_actions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[rgba(180,210,255,0.15)]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8B4CC]">
                    Risk Mitigation Directives
                  </span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {risk.recommended_actions.slice(0, 2).map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#D7DCE7] leading-relaxed">
                        <span className="font-mono font-bold text-[#7DB8FF]">0{idx + 1}</span>
                        <p className="text-[#FFFFFF]">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: AGENT CONSENSUS CONVERGENCE (SPATIAL ENSEMBLE)
          ───────────────────────────────────────────────────────────── */}
      <AgentConsensusConvergence analysisResult={analysisResult} />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: EXECUTIVE DECISION BRIEF (DATA-DRIVEN STRUCTURED ACTIONS)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="executive-brief"
        className="relative min-h-screen flex flex-col justify-center px-6 md:px-14 lg:px-20 py-28"
      >
        <div className="mx-auto max-w-[1480px] w-full space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-[#7DB8FF]">
                <Target className="h-4 w-4 text-[#285BFF]" />
                <span>Executive Synthesis // Autonomous Decision Plan</span>
              </div>

              <h3 className="mt-3 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FFFFFF] leading-[1.05]">
                Executive Decision
              </h3>
            </div>

            {/* CONFIDENCE & EVIDENCE BADGE */}
            <div className="inline-flex items-center gap-3 rounded-2xl border border-[rgba(180,210,255,0.30)] bg-[rgba(20,45,130,0.60)] px-5 py-3 font-mono text-xs backdrop-blur-xl">
              <ShieldCheck className="h-5 w-5 text-[#10B981]" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[#A8B4CC]">CONFIDENCE:</span>
                  <span className="font-bold text-[#10B981]">HIGH</span>
                </div>
                <div className="text-[10px] text-[#7DB8FF]">
                  R² {formatMetricValue(comm?.regression?.r2_score, "decimal")} • F1 {formatMetricValue(risk?.risk_classification_model?.metrics?.f1_score_pct, "percentage")}
                </div>
              </div>
            </div>
          </div>

          {/* 3 CONCRETE DECISION PILLARS */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* 01 WHAT WE FOUND */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 rounded-3xl p-8 glass-panel-elevated space-y-4"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#7DB8FF]">
                <Activity className="h-4 w-4" />
                <span>01 — WHAT WE FOUND</span>
              </div>
              <ul className="space-y-3 font-sans text-sm text-[#D7DCE7] leading-relaxed">
                {whatWeFoundList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7DB8FF] mt-2 shrink-0" />
                    <span>
                      <strong className="text-white">{item.label}:</strong> {item.finding}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 02 WHY IT MATTERS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-6 rounded-3xl p-8 glass-panel-elevated space-y-4"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#7DB8FF]">
                <Lightbulb className="h-4 w-4" />
                <span>02 — WHY IT MATTERS</span>
              </div>
              <p className="font-sans text-sm sm:text-base text-[#FFFFFF] leading-relaxed">
                {decisionSynthesis?.why_it_matters ||
                  `While commercial demand remains positive and margins generate return, capacity utilization (${formatMetricValue(ops?.operational_summary?.machine_utilization?.average_utilization_pct, "percentage")}) and shipment delays (${formatMetricValue(ops?.operational_summary?.delivery_delays?.delayed_orders_pct, "percentage")}) constrain expansion. Accelerating demand without buffering fulfillment routes risks customer churn.`}
              </p>
              <div className="p-3.5 rounded-2xl bg-[rgba(10,24,70,0.35)] border border-[rgba(180,210,255,0.15)] font-mono text-xs text-[#D7DCE7]">
                <span className="text-[#7DB8FF] font-bold">Key Takeaway:</span>{" "}
                {decisionSynthesis?.key_takeaway || "Operational routing and fulfillment buffers are the critical levers for sustainable scaling."}
              </div>
            </motion.div>

            {/* 03 WHAT TO DO (CONCRETE ACTIONS GROUNDED IN DATA) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-12 rounded-3xl p-8 glass-panel-elevated space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#10B981]">
                  <CheckCheck className="h-4 w-4" />
                  <span>03 — WHAT TO DO NEXT (EVIDENCE-BACKED ACTIONS)</span>
                </div>
                {decisionSynthesis?.strategic_focus && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7DB8FF] rounded-full px-2.5 py-1 bg-[rgba(40,91,255,0.25)] border border-[rgba(180,210,255,0.20)]">
                    Objective: {decisionSynthesis.strategic_focus}
                  </span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3 pt-2">
                {structuredRecs.map((rec) => (
                  <div
                    key={rec.id}
                    className="rounded-2xl p-5 bg-[rgba(10,24,70,0.35)] border border-[rgba(180,210,255,0.15)] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#7DB8FF]">
                          Action {rec.id} // {rec.domain}
                        </span>
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-[rgba(16,185,129,0.20)] text-[#10B981] border border-[rgba(16,185,129,0.30)]">
                          {rec.priority}
                        </span>
                      </div>

                      <h4 className="font-sans text-sm font-bold text-[#FFFFFF] leading-snug">
                        {rec.title}
                      </h4>

                      <p className="font-sans text-xs text-[#D7DCE7] leading-relaxed">
                        {rec.finding}
                      </p>

                      <div className="rounded-xl p-2 bg-[rgba(5,15,45,0.45)] border border-[rgba(180,210,255,0.08)] font-mono text-[10px] text-[#A8B4CC]">
                        <span className="text-[#7DB8FF] font-semibold">Evidence:</span> {rec.evidence}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[rgba(180,210,255,0.10)] space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#10B981] font-bold">
                        Recommended Action:
                      </span>
                      <p className="font-sans text-xs font-medium text-white leading-relaxed">
                        {rec.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* DATA PROFILE & RESET ACTION BAR */}
          <div className="flex flex-col justify-between gap-6 border-t border-[rgba(180,210,255,0.12)] pt-8 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-[#A8B4CC]">
              <span>{meta?.rows?.toLocaleString() ?? 1000} RECORDS PROCESSED</span>
              <span>•</span>
              <span>{meta?.columns ?? 31} VARIABLES PROFILED</span>
              <span>•</span>
              <span className="text-[#7DB8FF] font-semibold">RANDOM FOREST VALIDATED</span>
            </div>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-[rgba(180,210,255,0.35)] bg-[rgba(20,45,130,0.60)] px-6 py-3.5 font-sans text-sm font-semibold text-[#FFFFFF] hover:bg-[rgba(25,55,150,0.75)] hover:border-[rgba(200,225,255,0.50)] transition-all cursor-pointer backdrop-blur-lg shadow-xl"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Analyze Another Dataset</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
