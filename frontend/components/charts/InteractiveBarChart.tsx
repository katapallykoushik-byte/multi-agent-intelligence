"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Info, X } from "lucide-react";
import { formatMetricValue, formatExactValue } from "@/lib/formatters";

export interface BarDataPoint {
  category: string;
  value: number;
  formattedValue?: string;
  percentage?: number;
  insight?: string;
}

interface InteractiveBarChartProps {
  data: BarDataPoint[];
  title?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  territoryIndex?: number;
}

export const InteractiveBarChart: React.FC<InteractiveBarChartProps> = ({
  data,
  title,
  valuePrefix = "$",
  valueSuffix = "",
  territoryIndex,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-xs text-[#A8B4CC]">
        No category data available from this dataset
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value)) || 1;
  const totalVal = data.reduce((acc, d) => acc + d.value, 0) || 1;

  const handleMouseEnter = (idx: number) => {
    if (selectedIdx === null) {
      setHoveredIdx(idx);
      if (territoryIndex !== undefined && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("territory-focus", {
            detail: { territory: territoryIndex, intensity: 1.6 },
          })
        );
      }
    }
  };

  const handleMouseLeave = () => {
    if (selectedIdx === null) {
      setHoveredIdx(null);
      if (territoryIndex !== undefined && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("territory-focus", {
            detail: { territory: territoryIndex, intensity: 1.0 },
          })
        );
      }
    }
  };

  const handleClick = (idx: number) => {
    if (selectedIdx === idx) {
      setSelectedIdx(null);
      setHoveredIdx(null);
      if (territoryIndex !== undefined && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("territory-focus", {
            detail: { territory: territoryIndex, intensity: 1.0 },
          })
        );
      }
    } else {
      setSelectedIdx(idx);
      setHoveredIdx(idx);
      if (territoryIndex !== undefined && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("territory-focus", {
            detail: { territory: territoryIndex, intensity: 2.2 },
          })
        );
      }
    }
  };

  const activeIdx = selectedIdx !== null ? selectedIdx : hoveredIdx;
  const selectedItem = activeIdx !== null ? data[activeIdx] : null;

  return (
    <div className="w-full space-y-3 select-none" onMouseLeave={handleMouseLeave}>
      {title && (
        <div className="flex items-center justify-between text-xs pb-1">
          <span className="font-mono font-bold uppercase tracking-wider text-[#A8B4CC]">
            {title}
          </span>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#7DB8FF]">
            <span>{selectedIdx !== null ? "Selection Locked" : "Click bar to inspect"}</span>
            {selectedIdx !== null && (
              <button
                onClick={() => setSelectedIdx(null)}
                className="hover:text-white p-0.5 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {data.map((item, idx) => {
          const isSelected = selectedIdx === idx;
          const isHovered = hoveredIdx === idx || isSelected;
          const isDimmed = activeIdx !== null && activeIdx !== idx;
          const pct = item.percentage ?? ((item.value / totalVal) * 100);
          const barWidth = Math.max(8, (item.value / maxVal) * 100);

          const displayVal =
            item.formattedValue ||
            (valuePrefix === "$"
              ? formatMetricValue(item.value, "currency")
              : `${formatMetricValue(item.value, "compact")}${valueSuffix}`);
          const exactVal =
            valuePrefix === "$"
              ? formatExactValue(item.value, "currency")
              : `${item.value.toLocaleString()}${valueSuffix}`;

          return (
            <div
              key={idx}
              onMouseEnter={() => handleMouseEnter(idx)}
              onClick={() => handleClick(idx)}
              title={`${item.category}: ${exactVal} (${pct.toFixed(1)}%)`}
              className={`group cursor-pointer rounded-xl p-2.5 transition-all duration-200 ${
                isSelected
                  ? "bg-[rgba(40,91,255,0.40)] border border-[rgba(220,235,255,0.65)] shadow-[0_0_20px_rgba(40,91,255,0.5)] scale-[1.01]"
                  : isHovered
                  ? "bg-[rgba(40,91,255,0.25)] border border-[rgba(180,210,255,0.45)] shadow-lg"
                  : isDimmed
                  ? "opacity-40 border border-transparent"
                  : "bg-[rgba(10,24,70,0.30)] border border-[rgba(180,210,255,0.12)] hover:border-[rgba(180,210,255,0.25)]"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs mb-1.5 gap-2 min-w-0">
                <span className="truncate text-[#D7DCE7] group-hover:text-white font-medium">
                  {item.category}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-[#FFFFFF]">{displayVal}</span>
                  <span className="text-[10px] text-[#7DB8FF]">{pct.toFixed(1)}%</span>
                </div>
              </div>

              {/* Bar track */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${barWidth}%` }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                  className={`h-full rounded-full transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-[#285BFF] via-[#7DB8FF] to-[#FFFFFF] shadow-[0_0_12px_rgba(125,184,255,0.8)]"
                      : isHovered
                      ? "bg-gradient-to-r from-[#285BFF] to-[#7DB8FF]"
                      : "bg-gradient-to-r from-[#102A83] to-[#285BFF]"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected insight drawer */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-[rgba(180,210,255,0.25)] bg-[rgba(16,42,131,0.50)] p-3 backdrop-blur-md">
              <div className="flex items-start gap-2 text-xs">
                <Info className="h-4 w-4 shrink-0 text-[#7DB8FF] mt-0.5" />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-white truncate">{selectedItem.category}</span>
                    <span className="text-[#7DB8FF] shrink-0">
                      {valuePrefix === "$"
                        ? formatExactValue(selectedItem.value, "currency")
                        : `${selectedItem.value.toLocaleString()}${valueSuffix}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D7DCE7] leading-relaxed">
                    {selectedItem.insight ||
                      `Accounts for ${(
                        selectedItem.percentage ??
                        (selectedItem.value / totalVal) * 100
                      ).toFixed(1)}% of total volume across profiled records.`}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
