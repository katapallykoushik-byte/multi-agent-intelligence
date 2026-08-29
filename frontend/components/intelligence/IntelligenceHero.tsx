"use client";

import React, { useRef, useState } from "react";
import { AnalysisResult } from "./types";
import { AnalysisTransitionSequence } from "./AnalysisTransitionSequence";
import { LandingSculptureCanvas } from "../environment/LandingSculptureCanvas";
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  TrendingUp,
  DollarSign,
  Truck,
  Shield,
  CornerDownRight,
  Plus,
  ArrowDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IntelligenceHeroProps {
  selectedFile: File | null;
  businessProblem: string;
  isDragging: boolean;
  isAnalyzing: boolean;
  error: string;
  analysisResult?: AnalysisResult | null;
  detectedColumns?: number;
  onFileSelect: (file: File | undefined) => void;
  onProblemChange: (problem: string) => void;
  onAnalyze: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent) => void;
  onSequenceComplete?: () => void;
}

export const IntelligenceHero: React.FC<IntelligenceHeroProps> = ({
  selectedFile,
  businessProblem,
  isDragging,
  isAnalyzing,
  error,
  analysisResult,
  detectedColumns,
  onFileSelect,
  onProblemChange,
  onAnalyze,
  onDragOver,
  onDragLeave,
  onDrop,
  onSequenceComplete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDatasetHovered, setIsDatasetHovered] = useState(false);
  const [isDirectiveFocused, setIsDirectiveFocused] = useState(false);

  const columnCount =
    analysisResult?.analysis?.dataset_overview?.columns ?? detectedColumns ?? 31;
  const rowCount = analysisResult?.analysis?.dataset_overview?.rows;

  const hasDataset = !!selectedFile;
  const hasDirective = businessProblem.trim().length > 0;
  const isSystemReady = hasDataset && hasDirective;

  // Preset strategic questions for instant population
  const exampleQuestions = [
    "Why are sales declining?",
    "Which regions are underperforming?",
    "Where are operational bottlenecks?",
    "What factors are driving risk?",
  ];

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleScrollToWorkspace = () => {
    const el =
      document.getElementById("decision-workspace") ||
      document.getElementById("upload-workspace") ||
      document.getElementById("workspace-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleApplyPresetQuestion = (question: string) => {
    onProblemChange(question);
  };

  return (
    <div className="relative w-full">
      {/* ─────────────────────────────────────────────────────────────
          PAGE 1: MINIMALIST CREATIVE-TECH HERO (LIGHT WARM CANVAS)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100vh] w-full flex flex-col justify-between overflow-hidden bg-[#F6F6F3] text-[#0A0E1A] select-none px-6 sm:px-12 md:px-16 lg:px-24 pt-28 pb-14 border-b border-[#E8E6DF]">
        {/* SUBTLE ARCHITECTURAL LOW-CONTRAST VERTICAL GRID & ALIGNMENT MARKS */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 h-full w-full opacity-40"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full border-r border-[#E5E2DA] relative">
              {i % 3 === 0 && (
                <Plus className="absolute top-28 -right-1.5 h-3 w-3 text-[#CBD5E1]" />
              )}
              {i % 4 === 0 && (
                <Plus className="absolute bottom-32 -right-1.5 h-3 w-3 text-[#CBD5E1]" />
              )}
            </div>
          ))}
        </div>

        {/* HERO 3D SCULPTURAL CONVERGENCE OBJECT (4 SYSTEMS -> 1 DECISION) */}
        <LandingSculptureCanvas />

        {/* TOP STATUS BAR & STUDIO IDENTITY */}
        <div className="relative z-20 mx-auto max-w-[1520px] w-full flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#E2E8F0] bg-white/90 px-4 py-1.5 font-mono text-[10px] font-semibold tracking-widest text-[#2563EB] uppercase backdrop-blur-md shadow-xs"
          >
            <span className="h-2 w-2 rounded-full bg-[#2563EB] animate-pulse" />
            Autonomous Decision Intelligence
          </motion.div>

          <div className="hidden sm:flex items-center gap-2.5 font-mono text-[11px] text-[#64748B] tracking-wider uppercase">
            <span>Decision Studio</span>
            <span>•</span>
            <span className="text-[#0A0E1A] font-bold">EDS-01</span>
          </div>
        </div>

        {/* HERO EDITORIAL COMPOSITION (LEFT: HEADLINE + RIGHT: CARD) */}
        <div className="relative z-20 mx-auto max-w-[1520px] w-full my-auto py-8 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* LEFT: CONFIDENT EDITORIAL HEADLINE */}
          <div className="lg:col-span-8 space-y-6 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-black tracking-[-0.04em] leading-[0.94] text-[#0A0E1A]"
            >
              FOUR <br />
              ANALYTICAL <br />
              SYSTEMS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#4338CA] to-[#7C3AED]">
                ONE DECISION <br />
                LANDSCAPE.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
              className="font-sans text-base sm:text-lg md:text-xl font-normal leading-relaxed text-[#475569] max-w-lg"
            >
              Turn enterprise data into one coordinated view of what matters.
            </motion.p>
          </div>

          {/* RIGHT: COMPACT PHYSICAL/EDITORIAL INFORMATION CARD */}
          <div className="lg:col-span-4 flex lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.32, ease: "easeOut" }}
              className="rounded-3xl border border-[#E2E8F0] bg-white/90 p-6 backdrop-blur-xl shadow-lg w-full max-w-[290px] space-y-4"
            >
              <div className="font-mono border-b border-[#E2E8F0] pb-3">
                <span className="text-3xl font-black text-[#0A0E1A] block leading-none">04</span>
                <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold block mt-1">
                  ANALYTICAL SYSTEMS
                </span>
              </div>

              {/* 4 SYSTEM LABELS */}
              <div className="space-y-2 font-mono text-xs text-[#1E293B]">
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="flex items-center gap-2.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span className="font-medium">Commercial</span>
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">01</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="flex items-center gap-2.5">
                    <DollarSign className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span className="font-medium">Financial</span>
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">02</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="flex items-center gap-2.5">
                    <Truck className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span className="font-medium">Operations</span>
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">03</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-2.5">
                    <Shield className="h-3.5 w-3.5 text-[#7C3AED]" />
                    <span className="font-medium">Risk</span>
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">04</span>
                </div>
              </div>

              {/* DOTTED CONVERGENCE ARROW */}
              <div className="flex items-center justify-center pt-0.5 pb-0.5">
                <ArrowDown className="h-4 w-4 text-[#2563EB] animate-bounce" />
              </div>

              {/* 01 DECISION CORE */}
              <div className="rounded-2xl p-3 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-center font-mono shadow-md text-white">
                <span className="text-2xl font-black block leading-none">01</span>
                <span className="text-[10px] uppercase tracking-widest font-bold block mt-0.5">
                  DECISION
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM: START NOW BUTTON & PLAYFUL EDITORIAL NOTE */}
        <div className="relative z-20 mx-auto max-w-[1520px] w-full pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            {/* MONOGRAM AVATAR */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A0E1A] text-white font-mono text-sm font-bold shadow-md">
              N
            </div>

            <motion.button
              onClick={handleScrollToWorkspace}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="group inline-flex items-center gap-3 rounded-full bg-[#0A0E1A] hover:bg-[#1E293B] text-white px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_10px_25px_-5px_rgba(10,14,26,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 cursor-pointer"
            >
              <span>START NOW</span>
              <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </div>

          {/* QUIRKY PLAYFUL EDITORIAL ANNOTATION */}
          <div className="flex items-center gap-2 text-xs font-sans italic text-[#64748B] pl-2">
            <CornerDownRight className="h-4 w-4 text-[#2563EB] -rotate-12" />
            <span>make better decisions.</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PAGE 2: DECISION WORKSPACE (ARCHITECTURAL DUAL-INPUT INTERFACE)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="decision-workspace"
        className="relative w-full border-b border-[var(--border-subtle)] bg-[#05081A] pt-20 pb-24 md:pt-24 md:pb-32 text-white font-sans overflow-hidden"
      >
        {/* ANCHOR ALIASES FOR COMPATIBILITY */}
        <div id="upload-workspace" className="absolute -top-10" />
        <div id="workspace-section" className="absolute -top-10" />

        {/* SUBTLE DEEP-NAVY BACKGROUND GRID MESH */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(40,91,255,0.15),rgba(5,8,26,0))]"
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12">
          {/* WORKSPACE TOP HEADER */}
          <div className="max-w-3xl mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#7DB8FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7DB8FF]" />
              <span>STEP 01 & 02 // INPUT PARAMETERS</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight">
              Decision Workspace
            </h2>
            <p className="text-base text-[#A8B4CC] leading-relaxed">
              Give the system your data and the question you want answered.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              /* CINEMATIC ACTIVE ANALYSIS SEQUENCE */
              <motion.div
                key="analysis-active-sequence"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <AnalysisTransitionSequence
                  datasetName={selectedFile?.name || "Enterprise Dataset"}
                  variableCount={columnCount}
                  isAnalyzing={isAnalyzing}
                  analysisResult={analysisResult || null}
                  onSequenceComplete={onSequenceComplete}
                />
              </motion.div>
            ) : (
              /* ONE REFINED ARCHITECTURAL WORKSPACE CONTAINER */
              <motion.div
                key="workspace-input-mode"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-[rgba(180,210,255,0.22)] bg-[rgba(11,19,51,0.85)] p-7 sm:p-10 backdrop-blur-2xl shadow-[0_24px_50px_-12px_rgba(5,8,26,0.85)]"
              >
                {/* WORKSPACE TOP STATUS STRIP */}
                <div className="flex flex-col justify-between gap-3 border-b border-[rgba(180,210,255,0.15)] pb-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#285BFF] animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
                      Integrated Input Studio
                    </span>
                  </div>
                  <div className="flex items-center gap-5 text-xs font-mono text-[#A8B4CC]">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full transition-colors ${
                          hasDataset ? "bg-[#10B981]" : "bg-[#64748B]"
                        }`}
                      />
                      01 Dataset {hasDataset ? "Loaded" : "Required"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full transition-colors ${
                          hasDirective ? "bg-[#10B981]" : "bg-[#64748B]"
                        }`}
                      />
                      02 Question {hasDirective ? "Defined" : "Required"}
                    </span>
                  </div>
                </div>

                {/* DUAL INPUTS GRID: LEFT (DATASET) & RIGHT (STRATEGIC QUESTION) */}
                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                  {/* =========================================================
                      LEFT SIDE — 01 ENTERPRISE DATASET
                     ========================================================= */}
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-sm font-black text-[#7DB8FF]">01</span>
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">
                          ENTERPRISE DATASET
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#A8B4CC] uppercase">
                        CSV • XLSX
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={(e) => onFileSelect(e.target.files?.[0])}
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onMouseEnter={() => setIsDatasetHovered(true)}
                      onMouseLeave={() => setIsDatasetHovered(false)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          fileInputRef.current?.click();
                        }
                      }}
                      className={`group relative flex flex-1 min-h-[220px] cursor-pointer flex-col justify-between rounded-2xl border p-6 transition-all duration-200 ${
                        isDragging
                          ? "border-[#285BFF] bg-[rgba(40,91,255,0.25)] shadow-[0_0_30px_rgba(40,91,255,0.4)]"
                          : selectedFile
                          ? "border-[rgba(125,184,255,0.5)] bg-[rgba(20,45,130,0.45)]"
                          : "border-[rgba(180,210,255,0.25)] bg-[rgba(14,22,68,0.55)] hover:border-[rgba(125,184,255,0.45)] hover:bg-[rgba(20,45,130,0.35)] shadow-xs"
                      }`}
                    >
                      {/* FILE STATUS OR UPLOAD DROP-ZONE */}
                      {selectedFile ? (
                        <div className="my-auto space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 px-3 py-1 font-mono text-[10px] font-bold text-[#34D399]">
                              <CheckCircle2 className="h-3 w-3" />
                              DATASET LOADED
                            </span>
                            <span className="font-mono text-[10px] text-[#A8B4CC]">
                              Ready for Agent Ingestion
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-4 rounded-xl bg-[rgba(10,18,50,0.6)] p-4 border border-[rgba(180,210,255,0.18)]">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[rgba(125,184,255,0.35)] bg-[rgba(40,91,255,0.25)] text-[#7DB8FF]">
                                <FileSpreadsheet className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-sans text-sm font-bold text-[#FFFFFF]">
                                  {selectedFile.name}
                                </p>
                                <p className="mt-0.5 font-mono text-xs text-[#A8B4CC]">
                                  {(selectedFile.size / 1024).toFixed(1)} KB • Structured Tabular Dataset
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleClearFile}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[rgba(180,210,255,0.2)] bg-[rgba(20,45,130,0.6)] text-[#A8B4CC] hover:text-[#FFFFFF] hover:border-[#EF4444] hover:bg-[#EF4444]/20 transition-colors"
                              title="Remove file"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="my-auto flex flex-col items-center justify-center text-center space-y-3 py-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(180,210,255,0.28)] bg-[rgba(20,45,130,0.5)] text-[#7DB8FF] group-hover:scale-105 group-hover:border-[#7DB8FF] transition-all shadow-md">
                            <Upload className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-sans text-sm font-bold text-[#FFFFFF] tracking-wide">
                              UPLOAD DATASET
                            </p>
                            <p className="mt-1 font-sans text-xs text-[#A8B4CC]">
                              Drag & drop CSV or Excel, or <span className="text-[#7DB8FF] underline font-semibold">Browse files</span>
                            </p>
                          </div>
                        </div>
                      )}

                      {/* BOTTOM METADATA / ACTION FOOTER */}
                      <div className="flex items-center justify-between border-t border-[rgba(180,210,255,0.15)] pt-3 font-mono text-xs">
                        <span className="text-[#A8B4CC]">
                          {selectedFile ? "Schema verified" : "Max file size: 100MB"}
                        </span>
                        <span className="font-bold text-[#7DB8FF] group-hover:underline">
                          {selectedFile ? "Replace Dataset ↑" : "Select File →"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* =========================================================
                      RIGHT SIDE — 02 STRATEGIC QUESTION
                     ========================================================= */}
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-sm font-black text-[#7DB8FF]">02</span>
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">
                          STRATEGIC QUESTION
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#A8B4CC] uppercase">
                        Problem Statement
                      </span>
                    </div>

                    <div
                      className={`flex flex-1 min-h-[220px] flex-col justify-between rounded-2xl border p-6 transition-all duration-200 ${
                        isDirectiveFocused
                          ? "border-[#7DB8FF] bg-[rgba(20,45,130,0.45)] shadow-[0_0_25px_rgba(40,91,255,0.25)]"
                          : "border-[rgba(180,210,255,0.25)] bg-[rgba(14,22,68,0.55)] hover:border-[rgba(125,184,255,0.4)]"
                      }`}
                    >
                      {/* EDITORIAL PROMPT FIELD */}
                      <div className="space-y-3">
                        <textarea
                          value={businessProblem}
                          onChange={(e) => onProblemChange(e.target.value)}
                          onFocus={() => setIsDirectiveFocused(true)}
                          onBlur={() => setIsDirectiveFocused(false)}
                          placeholder="What do you want to understand?"
                          rows={3}
                          className="w-full resize-none bg-transparent font-sans text-sm sm:text-base leading-relaxed text-[#FFFFFF] placeholder-[#64748B] outline-none"
                        />

                        {/* CLICKABLE PRESET QUESTION CHIPS */}
                        <div className="space-y-1.5 pt-1 border-t border-[rgba(180,210,255,0.12)]">
                          <span className="font-mono text-[10px] font-semibold text-[#A8B4CC] uppercase tracking-wider block">
                            Suggested directives:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {exampleQuestions.map((q, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleApplyPresetQuestion(q)}
                                className={`rounded-full px-3 py-1 font-sans text-xs transition-all cursor-pointer ${
                                  businessProblem === q
                                    ? "bg-[#285BFF] text-white font-semibold border border-[#7DB8FF]"
                                    : "bg-[rgba(20,45,130,0.5)] border border-[rgba(180,210,255,0.2)] text-[#D7DCE7] hover:bg-[rgba(40,91,255,0.4)] hover:text-[#FFFFFF] hover:border-[rgba(125,184,255,0.5)]"
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM FOOTER */}
                      <div className="flex items-center justify-between border-t border-[rgba(180,210,255,0.15)] pt-3 font-mono text-xs text-[#A8B4CC]">
                        <span>Directs coordinator weighting</span>
                        <span>{businessProblem.length} chars</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VISUAL ARCHITECTURAL CONNECTOR: DATA \ → DECISION / QUESTION */}
                <div className="relative mt-6 flex flex-col items-center justify-center py-2">
                  <div className="flex items-center justify-center gap-6 font-mono text-[10px] uppercase tracking-widest text-[#7DB8FF] pb-1">
                    <span className={hasDataset ? "text-[#34D399] font-bold" : "text-[#64748B]"}>
                      DATA
                    </span>
                    <span className="text-[#A8B4CC]">\</span>
                    <span
                      className={
                        isSystemReady
                          ? "text-[#FFFFFF] bg-[rgba(40,91,255,0.5)] px-2.5 py-0.5 rounded-full border border-[#7DB8FF] font-bold shadow-xs"
                          : "text-[#64748B]"
                      }
                    >
                      → SYNTHESIS
                    </span>
                    <span className="text-[#A8B4CC]">/</span>
                    <span className={hasDirective ? "text-[#34D399] font-bold" : "text-[#64748B]"}>
                      QUESTION
                    </span>
                  </div>

                  <svg
                    className="w-full max-w-[680px] h-10 overflow-visible"
                    viewBox="0 0 680 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 170 0 L 170 20 L 340 20"
                      stroke={
                        hasDataset || isDatasetHovered
                          ? "rgba(125, 184, 255, 0.65)"
                          : "rgba(148, 163, 184, 0.2)"
                      }
                      strokeWidth="1.5"
                      strokeDasharray={hasDataset ? "4 2" : undefined}
                      className="transition-colors duration-200"
                    />
                    <path
                      d="M 510 0 L 510 20 L 340 20"
                      stroke={
                        hasDirective || isDirectiveFocused
                          ? "rgba(125, 184, 255, 0.65)"
                          : "rgba(148, 163, 184, 0.2)"
                      }
                      strokeWidth="1.5"
                      strokeDasharray={hasDirective ? "4 2" : undefined}
                      className="transition-colors duration-200"
                    />
                    <path
                      d="M 340 20 L 340 40"
                      stroke={
                        isSystemReady
                          ? "rgba(40, 91, 255, 0.95)"
                          : "rgba(148, 163, 184, 0.2)"
                      }
                      strokeWidth="2"
                      className="transition-colors duration-200"
                    />

                    {/* INTERACTION JUNCTIONS */}
                    <circle
                      cx="170"
                      cy="0"
                      r="3"
                      fill={hasDataset ? "#34D399" : "rgba(148, 163, 184, 0.4)"}
                    />
                    <circle
                      cx="510"
                      cy="0"
                      r="3"
                      fill={hasDirective ? "#34D399" : "rgba(148, 163, 184, 0.4)"}
                    />
                    <circle
                      cx="340"
                      cy="20"
                      r="4"
                      fill={isSystemReady ? "#7DB8FF" : "rgba(148, 163, 184, 0.3)"}
                    />
                  </svg>
                </div>

                {/* ERROR BANNER */}
                {error && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#EF4444]/40 bg-[#EF4444]/15 p-4 text-xs font-medium text-[#FFFFFF]">
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#EF4444]" />
                    <p className="flex-1">{error}</p>
                  </div>
                )}

                {/* BOTTOM OF WORKSPACE: STATUS STRIP & CTA */}
                <div className="mt-4 flex flex-col items-center justify-between gap-6 border-t border-[rgba(180,210,255,0.18)] pt-6 sm:flex-row">
                  {/* STATUS STRIP */}
                  <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-[#D7DCE7]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          hasDataset ? "text-[#34D399]" : "text-[#64748B]"
                        }`}
                      />
                      <span>Dataset ready</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          hasDirective ? "text-[#34D399]" : "text-[#64748B]"
                        }`}
                      />
                      <span>Question defined</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5 text-[#7DB8FF]">
                      <ShieldCheck className="h-4 w-4" />
                      <span>4 analytical systems ready</span>
                    </div>
                  </div>

                  {/* STRONG PROMINENT CTA */}
                  <div className="w-full sm:w-auto">
                    <button
                      onClick={onAnalyze}
                      disabled={isAnalyzing || !isSystemReady}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#285BFF] hover:bg-[#3B82F6] disabled:bg-[#151D42] text-white px-9 py-4 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_10px_30px_rgba(40,91,255,0.45)] hover:shadow-[0_12px_36px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none cursor-pointer"
                    >
                      <span>INITIALIZE DECISION ANALYSIS</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TELEMETRY FOOTER STRIP */}
          <div className="mt-12 grid grid-cols-2 divide-x divide-[rgba(180,210,255,0.15)] border-y border-[rgba(180,210,255,0.15)] py-4 text-xs sm:grid-cols-4">
            <div className="px-4">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#A8B4CC]">
                Core Architecture
              </span>
              <p className="mt-0.5 font-sans text-xs font-bold text-[#FFFFFF]">
                EDS-01 / Coordinated Multi-Agent
              </p>
            </div>

            <div className="px-4">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#A8B4CC]">
                Specialist Agents
              </span>
              <p className="mt-0.5 font-sans text-xs font-bold text-[#FFFFFF]">
                Commercial, Financial, Operations, Risk
              </p>
            </div>

            <div className="hidden px-4 sm:block">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#A8B4CC]">
                Variable Capacity
              </span>
              <p className="mt-0.5 font-sans text-xs font-bold text-[#FFFFFF]">
                {columnCount} features {rowCount ? `(${rowCount.toLocaleString()} rows)` : ""}
              </p>
            </div>

            <div className="px-4">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#A8B4CC]">
                Integrity Status
              </span>
              <p className="mt-0.5 flex items-center gap-1.5 font-sans text-xs font-bold text-[#FFFFFF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                Operational & Validated
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
