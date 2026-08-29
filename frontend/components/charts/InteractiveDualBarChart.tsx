"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { formatMetricValue, formatExactValue } from "@/lib/formatters";

export interface DualMetricPair {
  label: string;
  seriesA: number; // e.g. Revenue
  seriesB: number; // e.g. Cost
  seriesALabel?: string;
  seriesBLabel?: string;
  formattedA?: string;
  formattedB?: string;
}

interface InteractiveDualBarChartProps {
  data: DualMetricPair[];
  title?: string;
  territoryIndex?: number;
}

export const InteractiveDualBarChart: React.FC<InteractiveDualBarChartProps> = ({
  data,
  title,
  territoryIndex,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal =
    Math.max(...data.flatMap((d) => [d.seriesA, d.seriesB])) || 1;

  const handleMouseEnter = (idx: number) => {
    setHoveredIdx(idx);
    if (territoryIndex !== undefined && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("territory-focus", {
          detail: { territory: territoryIndex, intensity: 1.6 },
        })
      );
    }
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
    if (territoryIndex !== undefined && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("territory-focus", {
          detail: { territory: territoryIndex, intensity: 1.0 },
        })
      );
    }
  };

  return (
    <div className="w-full space-y-3 select-none" onMouseLeave={handleMouseLeave}>
      {title && (
        <div className="flex items-center justify-between text-xs pb-1">
          <span className="font-mono font-bold uppercase tracking-wider text-[#A8B4CC]">
            {title}
          </span>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FFFFFF]" />
              <span className="text-[#D7DCE7]">{data[0]?.seriesALabel || "Series A"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#285BFF]" />
              <span className="text-[#D7DCE7]">{data[0]?.seriesBLabel || "Series B"}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {data.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const pctA = Math.max(5, (item.seriesA / maxVal) * 100);
          const pctB = Math.max(5, (item.seriesB / maxVal) * 100);
          const diff = item.seriesA - item.seriesB;

          const displayA = item.formattedA || formatMetricValue(item.seriesA, "currency");
          const displayB = item.formattedB || formatMetricValue(item.seriesB, "currency");
          const exactA = formatExactValue(item.seriesA, "currency");
          const exactB = formatExactValue(item.seriesB, "currency");

          return (
            <div
              key={idx}
              onMouseEnter={() => handleMouseEnter(idx)}
              className={`rounded-2xl p-3.5 transition-all duration-200 cursor-pointer ${
                isHovered
                  ? "bg-[rgba(40,91,255,0.30)] border border-[rgba(180,210,255,0.45)] shadow-xl"
                  : "bg-[rgba(10,24,70,0.35)] border border-[rgba(180,210,255,0.14)] hover:border-[rgba(180,210,255,0.28)]"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className="font-semibold text-[#FFFFFF]">{item.label}</span>
                {isHovered && (
                  <span className="text-[11px] font-bold text-[#7DB8FF] animate-pulse">
                    Net Delta: {formatMetricValue(diff, "currency")} ({formatExactValue(diff, "currency")})
                  </span>
                )}
              </div>

              {/* BAR A */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-[#A8B4CC]" title={`${item.seriesALabel || "Series A"}: ${exactA}`}>
                  <span className="truncate pr-2">{item.seriesALabel || "Revenue"}</span>
                  <span className="font-bold text-[#FFFFFF] shrink-0">{displayA}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pctA}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#7DB8FF] to-[#FFFFFF]"
                  />
                </div>
              </div>

              {/* BAR B */}
              <div className="space-y-1 mt-2.5">
                <div className="flex justify-between font-mono text-[10px] text-[#A8B4CC]" title={`${item.seriesBLabel || "Series B"}: ${exactB}`}>
                  <span className="truncate pr-2">{item.seriesBLabel || "Cost"}</span>
                  <span className="font-bold text-[#7DB8FF] shrink-0">{displayB}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pctB}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#102A83] to-[#285BFF]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
