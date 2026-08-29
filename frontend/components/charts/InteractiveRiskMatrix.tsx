"use client";

import React, { useState } from "react";

interface InteractiveRiskMatrixProps {
  classes: string[];
  matrix: number[][];
  targetVariable?: string;
  territoryIndex?: number;
}

export const InteractiveRiskMatrix: React.FC<InteractiveRiskMatrixProps> = ({
  classes,
  matrix,
  targetVariable = "Risk Tier",
  territoryIndex = 4,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  if (!matrix || matrix.length === 0 || !classes || classes.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-xs text-[#A8B4CC]">
        No confusion matrix available
      </div>
    );
  }

  const totalSamples = matrix.reduce(
    (sum, row) => sum + row.reduce((rSum, val) => rSum + val, 0),
    0
  ) || 1;

  const handleCellEnter = (r: number, c: number) => {
    setHoveredCell({ r, c });
    if (territoryIndex !== undefined && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("territory-focus", {
          detail: { territory: territoryIndex, intensity: 1.6 },
        })
      );
    }
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
    if (territoryIndex !== undefined && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("territory-focus", {
          detail: { territory: territoryIndex, intensity: 1.0 },
        })
      );
    }
  };

  return (
    <div className="w-full space-y-3 select-none" onMouseLeave={handleCellLeave}>
      <div className="flex items-center justify-between pb-2 border-b border-[rgba(180,210,255,0.22)] font-mono text-xs">
        <span className="uppercase text-[#A8B4CC] font-bold tracking-wider">
          3×3 Empirical Confusion Matrix
        </span>
        <span className="text-[#7DB8FF] font-bold">
          {targetVariable}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[rgba(180,210,255,0.18)] bg-[rgba(10,24,70,0.35)] p-3 backdrop-blur-md">
        <table className="w-full font-mono text-xs text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-[#A8B4CC] border-b border-[rgba(180,210,255,0.12)]">
              <th className="py-2.5 px-3">ACTUAL \ PRED</th>
              {classes.map((cls, i) => (
                <th key={i} className="py-2.5 px-3 text-right font-bold text-[#FFFFFF]">
                  {cls}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(180,210,255,0.08)]">
            {matrix.map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="py-3 px-3 font-semibold text-[#D7DCE7]">
                  {classes[rIdx] || `Class ${rIdx}`}
                </td>
                {row.map((val, cIdx) => {
                  const isDiag = rIdx === cIdx;
                  const isHovered = hoveredCell?.r === rIdx && hoveredCell?.c === cIdx;
                  const pct = ((val / totalSamples) * 100).toFixed(1);

                  return (
                    <td
                      key={cIdx}
                      onMouseEnter={() => handleCellEnter(rIdx, cIdx)}
                      className={`py-3 px-3 text-right font-bold transition-all duration-150 cursor-pointer ${
                        isHovered
                          ? "bg-[rgba(125,184,255,0.40)] text-[#FFFFFF] shadow-[0_0_15px_rgba(125,184,255,0.8)] scale-105 rounded-lg"
                          : isDiag
                          ? "bg-[rgba(40,91,255,0.35)] text-[#FFFFFF] rounded-md"
                          : "text-[#A8B4CC] hover:bg-[rgba(255,255,255,0.06)]"
                      }`}
                    >
                      <div className="flex flex-col items-end">
                        <span className="text-sm">{val}</span>
                        <span className="text-[9px] font-normal text-[#A8B4CC] opacity-80">{pct}%</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ACTIVE CELL DETAILS */}
        {hoveredCell && (
          <div className="mt-3 pt-2.5 border-t border-[rgba(180,210,255,0.15)] flex items-center justify-between font-mono text-[11px] text-[#7DB8FF] animate-fadeIn">
            <span>
              Actual: <b className="text-white">{classes[hoveredCell.r]}</b> → Predicted: <b className="text-white">{classes[hoveredCell.c]}</b>
            </span>
            <span className="font-bold text-white">
              {matrix[hoveredCell.r][hoveredCell.c]} Records ({(((matrix[hoveredCell.r][hoveredCell.c]) / totalSamples) * 100).toFixed(1)}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
