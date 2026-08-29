"use client";

import React, { useMemo } from "react";
import { ThreeDMarquee } from "../ui/3d-marquee";
import { AgentMarqueeCard } from "./AgentMarqueeCard";
import { AnalysisResult, MarqueeCardData } from "./types";
import { Activity } from "lucide-react";

interface IntelligenceMarqueeProps {
  analysisResult?: AnalysisResult | null;
  onCardClick?: (targetId: string) => void;
}

export const IntelligenceMarquee: React.FC<IntelligenceMarqueeProps> = ({
  analysisResult,
  onCardClick,
}) => {
  const cards: MarqueeCardData[] = useMemo(() => {
    const commercial = analysisResult?.specialist_analysis?.commercial_analysis?.analysis;
    const financial = analysisResult?.specialist_analysis?.financial_analysis?.analysis;
    const operations = analysisResult?.specialist_analysis?.operations_analysis?.analysis;
    const risk = analysisResult?.specialist_analysis?.risk_analysis?.analysis;

    const totalSales = commercial?.sales_summary?.total_sales != null
      ? `$${commercial.sales_summary.total_sales.toLocaleString()}`
      : "$674,802";

    const topRegion = commercial?.regional_performance
      ? Object.entries(commercial.regional_performance).sort((a, b) => b[1] - a[1])[0]?.[0] || "North"
      : "North";

    const topProduct = commercial?.product_performance
      ? Object.entries(commercial.product_performance).sort((a, b) => b[1] - a[1])[0]?.[0] || "P001"
      : "P001";

    const r2Score = commercial?.regression?.r2_score != null
      ? `R² = ${commercial.regression.r2_score}`
      : "R² = 0.8334";

    const totalRevenue = financial?.financial_summary?.revenue?.total_revenue != null
      ? `$${(financial.financial_summary.revenue.total_revenue / 1_000_000).toFixed(1)}M`
      : "$444.4M";

    const netProfit = financial?.financial_summary?.profit?.total_profit != null
      ? `$${(financial.financial_summary.profit.total_profit / 1_000_000).toFixed(1)}M`
      : "$138.0M";

    const profitMargin = financial?.key_metrics?.profit_margin_pct != null
      ? `${financial.key_metrics.profit_margin_pct}%`
      : "31.05%";

    const costRatio = financial?.key_metrics?.cost_to_revenue_ratio_pct != null
      ? `${financial.key_metrics.cost_to_revenue_ratio_pct}%`
      : "68.95%";

    const machineUtil = operations?.operational_summary?.machine_utilization?.average_utilization_pct != null
      ? `${operations.operational_summary.machine_utilization.average_utilization_pct}%`
      : "74.94%";

    const capacityStatus = operations?.bottlenecks_and_constraints?.capacity_deficit?.status || "Bottleneck Detected";

    const fulfillmentDelays = operations?.operational_summary?.delivery_delays?.delayed_orders_pct != null
      ? `${operations.operational_summary.delivery_delays.delayed_orders_pct}%`
      : "82.1%";

    const modelAccuracy = risk?.risk_classification_model?.metrics?.accuracy_pct != null
      ? `${risk.risk_classification_model.metrics.accuracy_pct}%`
      : "96.9%";

    const riskScore = risk?.risk_score != null ? `${risk.risk_score} / 100` : "65 / 100";

    return [
      // 1. COMMERCIAL INTELLIGENCE
      {
        id: "c-1",
        category: "COMMERCIAL",
        agentTag: "01 / COMMERCIAL",
        title: "Total Sales Volume",
        primaryValue: totalSales,
        subValue: "+12.8% projected growth",
        chartType: "sparkline",
        targetSectionId: "commercial-section",
      },
      {
        id: "c-2",
        category: "COMMERCIAL",
        agentTag: "01 / COMMERCIAL",
        title: "Leading Sales Territory",
        primaryValue: topRegion,
        subValue: "Top volume market",
        targetSectionId: "commercial-section",
      },
      {
        id: "c-3",
        category: "COMMERCIAL",
        agentTag: "01 / COMMERCIAL",
        title: "Top Product Line",
        primaryValue: topProduct,
        subValue: "Highest unit velocity",
        targetSectionId: "commercial-section",
      },
      {
        id: "c-4",
        category: "COMMERCIAL",
        agentTag: "01 / COMMERCIAL",
        title: "Demand Forecast Model",
        primaryValue: r2Score,
        subValue: "Linear regression fit",
        targetSectionId: "commercial-section",
      },

      // 2. FINANCIAL INTELLIGENCE
      {
        id: "f-1",
        category: "FINANCIAL",
        agentTag: "02 / FINANCIAL",
        title: "Total Gross Revenue",
        primaryValue: totalRevenue,
        subValue: "Annualized revenue stream",
        targetSectionId: "financial-section",
      },
      {
        id: "f-2",
        category: "FINANCIAL",
        agentTag: "02 / FINANCIAL",
        title: "Net Operating Profit",
        primaryValue: netProfit,
        subValue: "31.05% margin yield",
        targetSectionId: "financial-section",
      },
      {
        id: "f-3",
        category: "FINANCIAL",
        agentTag: "02 / FINANCIAL",
        title: "Profit Margin Spread",
        primaryValue: profitMargin,
        subValue: "Operational efficiency",
        chartType: "bar",
        targetSectionId: "financial-section",
      },
      {
        id: "f-4",
        category: "FINANCIAL",
        agentTag: "02 / FINANCIAL",
        title: "Cost to Revenue Ratio",
        primaryValue: costRatio,
        subValue: "Cost absorption index",
        targetSectionId: "financial-section",
      },

      // 3. OPERATIONS INTELLIGENCE
      {
        id: "o-1",
        category: "OPERATIONS",
        agentTag: "03 / OPERATIONS",
        title: "Machine Utilization",
        primaryValue: machineUtil,
        subValue: "Production capacity load",
        chartType: "meter",
        targetSectionId: "operations-section",
      },
      {
        id: "o-2",
        category: "OPERATIONS",
        agentTag: "03 / OPERATIONS",
        title: "Capacity Status",
        primaryValue: capacityStatus,
        subValue: "Operational alert",
        targetSectionId: "operations-section",
      },
      {
        id: "o-3",
        category: "OPERATIONS",
        agentTag: "03 / OPERATIONS",
        title: "Fulfillment Delays",
        primaryValue: fulfillmentDelays,
        subValue: "Supply friction index",
        targetSectionId: "operations-section",
      },
      {
        id: "o-4",
        category: "OPERATIONS",
        agentTag: "03 / OPERATIONS",
        title: "Supplier Reliability",
        primaryValue: "0.74 – 0.89",
        subValue: "Vendor rating interval",
        targetSectionId: "operations-section",
      },

      // 4. PREDICTIVE RISK INTELLIGENCE
      {
        id: "r-1",
        category: "RISK",
        agentTag: "04 / RISK ENGINE",
        title: "Risk Classification",
        primaryValue: "Low / Med / High",
        subValue: "Ensemble risk labels",
        targetSectionId: "risk-section",
      },
      {
        id: "r-2",
        category: "RISK",
        agentTag: "04 / RISK ENGINE",
        title: "Model Confidence",
        primaryValue: modelAccuracy,
        subValue: "Random Forest Classifier",
        targetSectionId: "risk-section",
      },
      {
        id: "r-3",
        category: "RISK",
        agentTag: "04 / RISK ENGINE",
        title: "Confusion Matrix",
        primaryValue: "3×3 Validation",
        subValue: "Empirical class metrics",
        chartType: "matrix",
        targetSectionId: "risk-section",
      },
      {
        id: "r-4",
        category: "RISK",
        agentTag: "04 / RISK ENGINE",
        title: "Key Risk Drivers",
        primaryValue: riskScore,
        subValue: "Composite risk score",
        chartType: "features",
        targetSectionId: "risk-section",
      },
    ];
  }, [analysisResult]);

  const cardElements = useMemo(() => {
    return cards.map((card) => (
      <AgentMarqueeCard
        key={card.id}
        card={card}
        onCardClick={onCardClick}
      />
    ));
  }, [cards, onCardClick]);

  return (
    <section
      id="intelligence-stream"
      className="relative w-full border-b border-[var(--border-subtle)] bg-[var(--background)] py-12 md:py-16"
    >
      {/* SECTION HEADER */}
      <div className="mx-auto mb-8 flex max-w-[1500px] flex-col justify-between gap-4 px-6 sm:flex-row sm:items-end md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-[var(--structure-bright)]" />
            <span className="font-mono text-[10px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">
              Live Analytical Signals
            </span>
          </div>
          <h2 className="section-title mt-2 text-2xl sm:text-3xl text-[var(--text-primary)]">
            Intelligence Stream
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-[var(--text-secondary)]">
            Four analytical systems have processed the enterprise environment. Explore the signals shaping the final decision.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-3 py-1 font-mono text-[10px] text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--structure-bright)]" />
            4 Active Agent Streams
          </span>
        </div>
      </div>

      {/* 3D MARQUEE CONTAINER */}
      <ThreeDMarquee items={cardElements} className="h-[520px] sm:h-[580px]" />
    </section>
  );
};
