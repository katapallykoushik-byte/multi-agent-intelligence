"use client";

import React from "react";
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Truck,
  Shield,
  FileText,
  Settings,
} from "lucide-react";

interface PostAnalysisSidebarProps {
  activeTerritory: number;
  onNavigate?: (territoryIndex: number) => void;
}

interface NavItem {
  id: string;
  name: string;
  shortName: string;
  index: number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export const PostAnalysisSidebar: React.FC<PostAnalysisSidebarProps> = ({
  activeTerritory,
  onNavigate,
}) => {
  const navItems: NavItem[] = [
    {
      id: "intelligence-stream",
      name: "Overview",
      shortName: "Overview",
      index: 0,
      icon: LayoutDashboard,
    },
    {
      id: "commercial-territory",
      name: "Commercial",
      shortName: "Commercial",
      index: 1,
      icon: TrendingUp,
    },
    {
      id: "financial-territory",
      name: "Financial",
      shortName: "Financial",
      index: 2,
      icon: DollarSign,
    },
    {
      id: "operations-territory",
      name: "Operations",
      shortName: "Operations",
      index: 3,
      icon: Truck,
    },
    {
      id: "risk-territory",
      name: "Risk Engine",
      shortName: "Risk",
      index: 4,
      icon: Shield,
    },
    {
      id: "executive-brief",
      name: "Executive Brief",
      shortName: "Brief",
      index: 5,
      icon: FileText,
    },
  ];

  const handleScrollTo = (id: string, index: number) => {
    if (onNavigate) {
      onNavigate(index);
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          DESKTOP FIXED VERTICAL SIDEBAR (LG+)
          ───────────────────────────────────────────────────────────── */}
      <aside
        aria-label="Post-analysis Navigation"
        className="hidden lg:flex fixed left-4 top-20 bottom-6 z-40 w-20 flex-col items-center justify-between rounded-3xl border border-[rgba(180,210,255,0.18)] bg-[rgba(8,14,40,0.82)] py-5 px-2 backdrop-blur-2xl shadow-[0_20px_50px_rgba(3,6,20,0.7)] transition-all"
      >
        {/* TOP: MONOGRAM AVATAR */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(180,210,255,0.30)] bg-gradient-to-b from-[rgba(40,91,255,0.35)] to-[rgba(14,24,70,0.7)] text-white font-mono text-sm font-bold shadow-md">
            N
          </div>
          <div className="h-px w-8 bg-[rgba(180,210,255,0.15)] my-1" />
        </div>

        {/* CENTER: VERTICALLY STACKED NAVIGATION TABS */}
        <nav className="flex flex-col items-center gap-2 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTerritory === item.index;

            return (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id, item.index)}
                title={`${item.name} (Territory 0${item.index})`}
                className={`group relative flex w-full flex-col items-center justify-center rounded-2xl py-2.5 px-1.5 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[rgba(40,91,255,0.28)] border border-[rgba(125,184,255,0.55)] text-white shadow-[0_0_18px_rgba(40,91,255,0.35)]"
                    : "border border-transparent text-[#94A3B8] hover:bg-[rgba(20,45,130,0.35)] hover:border-[rgba(180,210,255,0.18)] hover:text-white"
                }`}
              >
                {/* ACTIVE INDICATOR GLOW */}
                {isActive && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                )}

                <Icon
                  strokeWidth={1.5}
                  className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${
                    isActive ? "text-[#7DB8FF]" : "text-[#94A3B8] group-hover:text-white"
                  }`}
                />

                <span
                  className={`mt-1 font-sans text-[10px] font-medium tracking-tight text-center leading-tight transition-colors ${
                    isActive ? "text-white font-semibold" : "text-[#94A3B8] group-hover:text-white"
                  }`}
                >
                  {item.shortName}
                </span>
              </button>
            );
          })}
        </nav>

        {/* BOTTOM: SETTINGS ICON & STATUS DOT */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-8 bg-[rgba(180,210,255,0.15)] my-1" />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#94A3B8] hover:text-white hover:bg-[rgba(20,45,130,0.4)] border border-transparent hover:border-[rgba(180,210,255,0.2)] transition-all cursor-pointer"
            title="Analysis Configuration & Settings"
          >
            <Settings strokeWidth={1.5} className="h-4.5 w-4.5" />
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE / TABLET FLOATING BOTTOM DOCK (< LG)
          ───────────────────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[94vw] w-auto">
        <nav className="flex items-center gap-1 rounded-full border border-[rgba(180,210,255,0.25)] bg-[rgba(8,14,40,0.92)] px-3 py-2 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTerritory === item.index;

            return (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id, item.index)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-sans transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#285BFF] text-white font-bold shadow-[0_0_15px_rgba(40,91,255,0.5)]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[rgba(20,45,130,0.4)]"
                }`}
              >
                <Icon strokeWidth={1.5} className="h-3.5 w-3.5" />
                <span className={isActive ? "inline" : "hidden sm:inline"}>
                  {item.shortName}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
