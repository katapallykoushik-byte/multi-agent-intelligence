"use client";

import React from "react";
import { motion } from "motion/react";

interface IntelligenceAnnotationProps {
  label: string;
  value: string | number;
  subValue?: string;
  coord?: string;
  direction?: "left" | "right" | "top";
  className?: string;
}

export const IntelligenceAnnotation: React.FC<IntelligenceAnnotationProps> = ({
  label,
  value,
  subValue,
  coord,
  direction = "right",
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`relative flex flex-col rounded-xl p-5 sm:p-6 glass-annotation transition-all duration-300 ${className}`}
    >
      {/* TOP: ANCHOR COORDINATE */}
      {coord && (
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.10)] pb-2">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            {coord}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--structure-bright)]" />
        </div>
      )}

      {/* EMBEDDED MASSIVE NUMERICAL VALUE */}
      <div className="mt-3">
        <span className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFFFFF]">
          {value}
        </span>
      </div>

      {/* METRIC LABEL & CONTEXTUAL SUBVALUE */}
      <div className="mt-2 flex flex-col">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--highlight-ice)]">
          {label}
        </span>
        {subValue && (
          <span className="mt-1 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
            {subValue}
          </span>
        )}
      </div>

      {/* ARCHITECTURAL ANCHOR CONNECTOR LINE */}
      <div className="mt-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--structure-bright)]" />
        <div className="h-[1px] w-full bg-gradient-to-r from-[var(--structure-bright)] via-[rgba(96,165,250,0.3)] to-transparent" />
      </div>
    </motion.div>
  );
};
