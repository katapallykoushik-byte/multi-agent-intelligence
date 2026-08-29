"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

export interface FeatureItem {
  rank?: string;
  feature: string;
  importance_pct: number;
  role?: string;
}

interface InteractiveFeatureImportanceProps {
  features: FeatureItem[];
  title?: string;
  territoryIndex?: number;
}

export const InteractiveFeatureImportance: React.FC<InteractiveFeatureImportanceProps> = ({
  features,
  title = "Feature Importance",
  territoryIndex = 4,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!features || features.length === 0) return null;

  const maxImp = Math.max(...features.map((f) => f.importance_pct)) || 1;

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
      <div className="flex items-center justify-between pb-2 border-b border-[rgba(180,210,255,0.22)] font-mono text-xs">
        <span className="uppercase text-[#A8B4CC] font-bold tracking-wider">
          {title}
        </span>
        <span className="text-[#7DB8FF] font-bold">
          Normalized Gini
        </span>
      </div>

      <div className="space-y-2.5">
        {features.slice(0, 5).map((f, i) => {
          const isHovered = hoveredIdx === i;
          const isAnyHovered = hoveredIdx !== null;
          const barWidth = Math.max(10, (f.importance_pct / maxImp) * 100);

          return (
            <div
              key={i}
              onMouseEnter={() => handleMouseEnter(i)}
              className={`rounded-xl p-2.5 transition-all duration-200 cursor-pointer ${
                isHovered
                  ? "bg-[rgba(40,91,255,0.30)] border border-[rgba(180,210,255,0.45)] shadow-lg"
                  : isAnyHovered
                  ? "opacity-50 border border-transparent"
                  : "bg-[rgba(10,24,70,0.30)] border border-[rgba(180,210,255,0.12)] hover:border-[rgba(180,210,255,0.25)]"
              }`}
            >
              <div className="flex justify-between font-mono text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#7DB8FF]">#{f.rank || i + 1}</span>
                  <span className="font-sans font-semibold text-[#FFFFFF]">{f.feature}</span>
                </div>
                <span className={`font-bold transition-colors ${isHovered ? "text-[#7DB8FF]" : "text-[#DDEBFF]"}`}>
                  {f.importance_pct.toFixed(1)}%
                </span>
              </div>

              <div className="h-2 w-full bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden border border-[rgba(180,210,255,0.15)]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${barWidth}%` }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                  className={`h-full rounded-full transition-all duration-200 ${
                    isHovered
                      ? "bg-gradient-to-r from-[#285BFF] via-[#7DB8FF] to-[#FFFFFF] shadow-[0_0_12px_rgba(125,184,255,0.8)]"
                      : "bg-gradient-to-r from-[#102A83] to-[#285BFF]"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
