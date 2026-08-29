"use client";

import React from "react";
import { MarqueeCardData } from "./types";

interface AgentMarqueeCardProps {
  card: MarqueeCardData;
  onCardClick?: (targetId: string) => void;
}

export const AgentMarqueeCard: React.FC<AgentMarqueeCardProps> = ({
  card,
  onCardClick,
}) => {
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(card.targetSectionId);
    } else {
      const el = document.getElementById(card.targetSectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const getAgentTheme = (cat: MarqueeCardData["category"]) => {
    switch (cat) {
      case "COMMERCIAL":
        return {
          dot: "bg-[var(--highlight-periwinkle)]",
          badge: "text-[var(--highlight-ice)] bg-[var(--background-soft)] border-[var(--border-subtle)]",
          chart: "bg-[var(--highlight-periwinkle)]",
        };
      case "FINANCIAL":
        return {
          dot: "bg-[var(--structure-bright)]",
          badge: "text-[var(--highlight-ice)] bg-[var(--background-soft)] border-[var(--border-subtle)]",
          chart: "bg-[var(--structure-bright)]",
        };
      case "OPERATIONS":
        return {
          dot: "bg-[var(--structure-electric)]",
          badge: "text-[var(--text-primary)] bg-[var(--background-soft)] border-[var(--border-subtle)]",
          chart: "bg-[var(--structure-electric)]",
        };
      case "RISK":
        return {
          dot: "bg-[var(--highlight-ice)]",
          badge: "text-[var(--highlight-ice)] bg-[var(--background-soft)] border-[var(--border-subtle)]",
          chart: "bg-[var(--highlight-ice)]",
        };
    }
  };

  const theme = getAgentTheme(card.category);

  return (
    <div
      onClick={handleClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
      className="group flex aspect-[970/700] w-full max-w-[340px] cursor-pointer flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]/90 p-5 text-left select-none backdrop-blur-md transition-all duration-300 hover:border-[var(--border-active)] hover:bg-[var(--background-elevated)] hover:shadow-xl hover:shadow-[var(--structure-deep)]/25 focus:outline-none focus:ring-1 focus:ring-[var(--structure-bright)]"
    >
      {/* TOP HEADER */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            {card.agentTag}
          </span>
        </div>
        <span
          className={`rounded border px-2 py-0.5 font-mono text-[8px] font-medium uppercase tracking-wider ${theme.badge}`}
        >
          {card.category}
        </span>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="my-auto py-2">
        <p className="font-sans text-xs font-medium text-[var(--text-secondary)]">
          {card.title}
        </p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          {card.primaryValue}
        </p>

        {/* VISUALIZATIONS */}
        {card.chartType === "sparkline" && (
          <div className="mt-3 flex items-end gap-1 h-6 w-full border-b border-[var(--border-subtle)] pb-1">
            {[45, 60, 50, 75, 68, 88, 80, 96].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-t-xs opacity-70 group-hover:opacity-100 transition-opacity ${theme.chart}`}
              />
            ))}
          </div>
        )}

        {card.chartType === "bar" && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between font-mono text-[9px] text-[var(--text-muted)]">
              <span>MARGIN YIELD</span>
              <span className="font-semibold text-[var(--highlight-ice)]">31.05%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--background-soft)] border border-[var(--border-subtle)]">
              <div className={`h-full w-[31%] rounded-full ${theme.chart}`} />
            </div>
          </div>
        )}

        {card.chartType === "meter" && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between font-mono text-[9px] text-[var(--text-muted)]">
              <span>UTILIZATION LOAD</span>
              <span className="font-semibold text-[var(--highlight-ice)]">74.94%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--background-soft)] border border-[var(--border-subtle)]">
              <div className={`h-full w-[75%] rounded-full ${theme.chart}`} />
            </div>
          </div>
        )}

        {card.chartType === "matrix" && (
          <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-md bg-[var(--background-soft)] p-1.5 border border-[var(--border-subtle)]">
            <div className="rounded bg-[var(--structure-deep)] p-1 text-center font-mono text-[8px] font-bold text-[var(--highlight-ice)] border border-[var(--border-active)]">
              94%
            </div>
            <div className="rounded bg-[var(--background-elevated)] p-1 text-center font-mono text-[8px] text-[var(--text-muted)]">
              4%
            </div>
            <div className="rounded bg-[var(--background-elevated)] p-1 text-center font-mono text-[8px] text-[var(--text-muted)]">
              2%
            </div>
            <div className="rounded bg-[var(--background-elevated)] p-1 text-center font-mono text-[8px] text-[var(--text-muted)]">
              3%
            </div>
            <div className="rounded bg-[var(--structure-deep)] p-1 text-center font-mono text-[8px] font-bold text-[var(--highlight-ice)] border border-[var(--border-active)]">
              96%
            </div>
            <div className="rounded bg-[var(--background-elevated)] p-1 text-center font-mono text-[8px] text-[var(--text-muted)]">
              1%
            </div>
            <div className="rounded bg-[var(--background-elevated)] p-1 text-center font-mono text-[8px] text-[var(--text-muted)]">
              1%
            </div>
            <div className="rounded bg-[var(--background-elevated)] p-1 text-center font-mono text-[8px] text-[var(--text-muted)]">
              2%
            </div>
            <div className="rounded bg-[var(--structure-deep)] p-1 text-center font-mono text-[8px] font-bold text-[var(--highlight-ice)] border border-[var(--border-active)]">
              97%
            </div>
          </div>
        )}

        {card.chartType === "features" && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between font-mono text-[8px] text-[var(--text-secondary)]">
              <span className="truncate max-w-[130px]">Supplier Reliability</span>
              <span className="font-semibold text-[var(--highlight-ice)]">32.4%</span>
            </div>
            <div className="h-1 w-full bg-[var(--background-soft)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div className={`h-full w-[65%] rounded-full ${theme.chart}`} />
            </div>
            <div className="flex items-center justify-between font-mono text-[8px] text-[var(--text-secondary)]">
              <span className="truncate max-w-[130px]">Fulfillment Delay</span>
              <span className="font-semibold text-[var(--highlight-ice)]">24.1%</span>
            </div>
            <div className="h-1 w-full bg-[var(--background-soft)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div className={`h-full w-[48%] rounded-full ${theme.chart}`} />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER METADATA */}
      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
        <p className="font-mono text-[9px] text-[var(--text-muted)]">
          {card.subValue || "Analytical Signal"}
        </p>
        <span className="font-sans text-[10px] font-medium text-[var(--highlight-ice)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Inspect →
        </span>
      </div>
    </div>
  );
};
