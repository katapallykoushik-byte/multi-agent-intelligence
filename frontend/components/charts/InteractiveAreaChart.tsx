"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { formatMetricValue, formatExactValue } from "@/lib/formatters";

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  formattedValue?: string;
}

interface InteractiveAreaChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  territoryIndex?: number;
}

export const InteractiveAreaChart: React.FC<InteractiveAreaChartProps> = ({
  data,
  title,
  height = 200,
  valuePrefix = "$",
  valueSuffix = "",
  territoryIndex,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-xs text-[#A8B4CC]">
        No trend data available
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  // Chart dimensions & padding
  const padding = { top: 20, right: 16, bottom: 28, left: 16 };
  const chartWidth = 500;
  const chartHeight = height;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Coordinates calculation
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * innerWidth;
    const y = padding.top + innerHeight - ((d.value - minVal) / range) * innerHeight;
    return { x, y, ...d };
  });

  // SVG Path generation (smooth curve)
  const linePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, "");

  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const areaPath = `${linePath} L ${lastPt.x} ${padding.top + innerHeight} L ${firstPt.x} ${padding.top + innerHeight} Z`;

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  // Notify 3D environment of hover
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
    <div className="relative w-full select-none" onMouseLeave={handleMouseLeave}>
      {title && (
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-mono font-bold uppercase tracking-wider text-[#A8B4CC]">
            {title}
          </span>
          {activePoint && (
            <span className="font-mono text-xs font-bold text-[#7DB8FF] animate-pulse">
              {activePoint.label}:{" "}
              {activePoint.formattedValue ||
                (valuePrefix === "$"
                  ? formatMetricValue(activePoint.value, "currency")
                  : `${formatMetricValue(activePoint.value, "compact")}${valueSuffix}`)}{" "}
              <span className="text-[10px] text-[#A8B4CC]">
                ({formatExactValue(activePoint.value, valuePrefix === "$" ? "currency" : "compact")})
              </span>
            </span>
          )}
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-[rgba(180,210,255,0.18)] bg-[rgba(10,24,70,0.40)] p-2 backdrop-blur-md">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-auto w-full overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#285BFF" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#7DB8FF" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#285BFF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#285BFF" />
              <stop offset="50%" stopColor="#7DB8FF" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={chartWidth - padding.right}
            y2={padding.top}
            stroke="rgba(180,210,255,0.10)"
            strokeDasharray="4 4"
          />
          <line
            x1={padding.left}
            y1={padding.top + innerHeight / 2}
            x2={chartWidth - padding.right}
            y2={padding.top + innerHeight / 2}
            stroke="rgba(180,210,255,0.10)"
            strokeDasharray="4 4"
          />
          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={chartWidth - padding.right}
            y2={padding.top + innerHeight}
            stroke="rgba(180,210,255,0.18)"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Stroke Line with Glow */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            filter="url(#glow)"
          />
          <path
            d={linePath}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g key={idx} className="cursor-pointer">
                {/* Hit target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="14"
                  fill="transparent"
                  onMouseEnter={() => handleMouseEnter(idx)}
                />
                {/* Visual Point */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? "#FFFFFF" : "#7DB8FF"}
                  stroke="#102A83"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    fill="none"
                    stroke="#7DB8FF"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}
                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fill={isHovered ? "#FFFFFF" : "#A8B4CC"}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
