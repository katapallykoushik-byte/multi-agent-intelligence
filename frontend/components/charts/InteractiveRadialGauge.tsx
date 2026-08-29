"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

interface InteractiveRadialGaugeProps {
  value: number; // 0 to 100
  secondaryValue?: number;
  label: string;
  subLabel?: string;
  size?: number;
  territoryIndex?: number;
}

export const InteractiveRadialGauge: React.FC<InteractiveRadialGaugeProps> = ({
  value,
  secondaryValue,
  label,
  subLabel,
  size = 180,
  territoryIndex,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillPct = Math.max(0, Math.min(100, value));
  const strokeDashoffset = circumference - (fillPct / 100) * circumference;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (territoryIndex !== undefined && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("territory-focus", {
          detail: { territory: territoryIndex, intensity: 1.6 },
        })
      );
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (territoryIndex !== undefined && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("territory-focus", {
          detail: { territory: territoryIndex, intensity: 1.0 },
        })
      );
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
        isHovered
          ? "bg-[rgba(40,91,255,0.25)] border border-[rgba(180,210,255,0.45)] shadow-xl"
          : "bg-[rgba(10,24,70,0.35)] border border-[rgba(180,210,255,0.15)] hover:border-[rgba(180,210,255,0.30)]"
      }`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg] overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#285BFF" />
              <stop offset="60%" stopColor="#7DB8FF" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />

          {/* Secondary Peak Marker Track (Optional) */}
          {secondaryValue !== undefined && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="rgba(125, 184, 255, 0.25)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (Math.min(100, secondaryValue) / 100) * circumference}
              strokeLinecap="round"
            />
          )}

          {/* Main Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: false }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            strokeLinecap="round"
            filter={isHovered ? "url(#gaugeGlow)" : undefined}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            {value.toFixed(1)}%
          </span>
          <span className="font-sans text-[11px] font-semibold text-[#A8B4CC] mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {subLabel && (
        <span className="mt-3 font-mono text-[11px] text-[#7DB8FF]">
          {subLabel}
        </span>
      )}
    </div>
  );
};
