"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnalysisResult } from "./types";
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Truck,
  AlertTriangle,
  Cpu,
  Layers,
} from "lucide-react";

interface AnalysisTransitionSequenceProps {
  datasetName: string;
  variableCount: number;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  onSequenceComplete?: () => void;
}

export type AgentNodeStatus = "STANDBY" | "ANALYZING" | "SIGNALS DETECTED" | "COMPLETE";

export const AnalysisTransitionSequence: React.FC<AnalysisTransitionSequenceProps> = ({
  datasetName,
  variableCount,
  isAnalyzing,
  analysisResult,
  onSequenceComplete,
}) => {
  // PROGRESSIVE STEPS (0 to 6)
  // 0: DATASET VERIFIED
  // 1: [N] VARIABLES MAPPED
  // 2: INITIALIZING SPECIALIST AGENTS
  // 3: COMMERCIAL & FINANCIAL ACTIVATION
  // 4: OPERATIONS & RISK ACTIVATION
  // 5: CROSS-AGENT SYNTHESIS IN PROGRESS
  // 6: SYNTHESIS COMPLETE -> TRANSITION
  const [step, setStep] = useState(0);

  // Specialist Agent Node States
  const [commercialState, setCommercialState] = useState<AgentNodeStatus>("STANDBY");
  const [financialState, setFinancialState] = useState<AgentNodeStatus>("STANDBY");
  const [operationsState, setOperationsState] = useState<AgentNodeStatus>("STANDBY");
  const [riskState, setRiskState] = useState<AgentNodeStatus>("STANDBY");

  useEffect(() => {
    if (!isAnalyzing && !analysisResult) {
      setStep(0);
      setCommercialState("STANDBY");
      setFinancialState("STANDBY");
      setOperationsState("STANDBY");
      setRiskState("STANDBY");
      return;
    }

    // SEQUENCE TIMERS FOR NATURAL CINEMATIC PACING
    const timers: NodeJS.Timeout[] = [];

    // Step 0: DATASET VERIFIED (immediately)
    setStep(0);

    // Step 1: VARIABLES MAPPED (at 600ms)
    timers.push(
      setTimeout(() => {
        setStep(1);
      }, 700)
    );

    // Step 2: INITIALIZING SPECIALIST AGENTS (at 1400ms)
    timers.push(
      setTimeout(() => {
        setStep(2);
        setCommercialState("ANALYZING");
        setFinancialState("ANALYZING");
      }, 1500)
    );

    // Step 3: COMMERCIAL & FINANCIAL ACTIVE (at 2300ms)
    timers.push(
      setTimeout(() => {
        setStep(3);
        setOperationsState("ANALYZING");
        setRiskState("ANALYZING");
        setCommercialState("SIGNALS DETECTED");
        setFinancialState("SIGNALS DETECTED");
      }, 2400)
    );

    // Step 4: OPERATIONS & RISK ACTIVE (at 3200ms)
    timers.push(
      setTimeout(() => {
        setStep(4);
        setOperationsState("SIGNALS DETECTED");
        setRiskState("SIGNALS DETECTED");
      }, 3300)
    );

    // Step 5: CROSS-AGENT SYNTHESIS (at 4100ms)
    timers.push(
      setTimeout(() => {
        setStep(5);
      }, 4200)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isAnalyzing, analysisResult]);

  // WHEN REAL BACKEND RESULTS ARRIVE: MARK ALL COMPLETE & TRANSITION
  useEffect(() => {
    if (analysisResult && step >= 2) {
      setCommercialState("COMPLETE");
      setFinancialState("COMPLETE");
      setOperationsState("COMPLETE");
      setRiskState("COMPLETE");
      setStep(6);

      const completeTimer = setTimeout(() => {
        onSequenceComplete?.();
      }, 1200);

      return () => clearTimeout(completeTimer);
    }
  }, [analysisResult, step, onSequenceComplete]);

  return (
    <div className="relative w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]/85 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
      {/* 1. STATUS TELEMETRY BANNER */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-5 w-5 items-center justify-center rounded border border-[var(--border-active)] bg-[var(--structure-deep)]">
            <Cpu className="h-3 w-3 text-[var(--structure-bright)] animate-pulse" />
          </div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            Cinematic Intelligence Synthesis Engine
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
          {step === 6 ? "Consensus Reached" : "Analysis In Progress"}
        </span>
      </div>

      {/* 2. CENTRAL INTELLIGENCE PROGRESSION SEQUENCE */}
      <div className="my-8 flex min-h-[130px] flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="space-y-1.5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--background-soft)] px-3 py-1 font-mono text-[10px] text-[var(--text-secondary)]">
                <ShieldCheck className="h-3 w-3 text-[var(--structure-bright)]" />
                <span>DATASET INGESTION</span>
              </div>
              <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                Dataset Verified: <span className="text-[var(--highlight-ice)]">{datasetName}</span>
              </h3>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                Validating schema structure and semantic data integrity
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="space-y-1.5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--background-soft)] px-3 py-1 font-mono text-[10px] text-[var(--text-secondary)]">
                <Layers className="h-3 w-3 text-[var(--structure-bright)]" />
                <span>TOPOLOGICAL FEATURE MAPPING</span>
              </div>
              <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                {variableCount} Structured Variables Mapped
              </h3>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                Categorical, continuous numeric, and target-construction vectors isolated
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="space-y-1.5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-active)] bg-[var(--structure-deep)]/40 px-3 py-1 font-mono text-[10px] text-[var(--highlight-ice)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--structure-bright)] animate-ping" />
                <span>AGENT DISPATCH</span>
              </div>
              <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                Initializing Specialist Agents
              </h3>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                Deploying Commercial, Financial, Operations, and Risk algorithms
              </p>
            </motion.div>
          )}

          {(step === 3 || step === 4) && (
            <motion.div
              key="step-3-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="space-y-1.5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-active)] bg-[var(--structure-deep)]/50 px-3 py-1 font-mono text-[10px] text-[var(--highlight-ice)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--structure-bright)] animate-pulse" />
                <span>DOMAIN EXTRACTION</span>
              </div>
              <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                Extracting Specialist Signals & Predictive Models
              </h3>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                Fitting regression surfaces & training Random Forest risk classifier
              </p>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="space-y-1.5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-active)] bg-[var(--structure-deep)] px-3 py-1 font-mono text-[10px] text-[var(--highlight-ice)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--structure-bright)] animate-pulse" />
                <span>APEX CONSENSUS</span>
              </div>
              <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                Cross-Agent Synthesis In Progress
              </h3>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                Resolving friction trade-offs and formulating executive decision consensus
              </p>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="space-y-1.5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-active)] bg-[var(--structure-deep)] px-3 py-1 font-mono text-[10px] text-[var(--highlight-ice)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-success)]" />
                <span>SYNTHESIS COMPLETE</span>
              </div>
              <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                Intelligence Environment Constructed
              </h3>
              <p className="font-mono text-xs text-[var(--highlight-ice)]">
                Transitioning to live intelligence stream...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. FOUR ARCHITECTURAL DOMAIN MARKERS / NODES */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* NODE 01: COMMERCIAL */}
        <DomainNode
          number="01"
          name="COMMERCIAL"
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          status={commercialState}
          detail="Demand & Sales Velocity"
        />

        {/* NODE 02: FINANCIAL */}
        <DomainNode
          number="02"
          name="FINANCIAL"
          icon={<DollarSign className="h-3.5 w-3.5" />}
          status={financialState}
          detail="Margins & Fiscal Yield"
        />

        {/* NODE 03: OPERATIONS */}
        <DomainNode
          number="03"
          name="OPERATIONS"
          icon={<Truck className="h-3.5 w-3.5" />}
          status={operationsState}
          detail="Throughput & Bottlenecks"
        />

        {/* NODE 04: RISK */}
        <DomainNode
          number="04"
          name="RISK ENGINE"
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          status={riskState}
          detail="Random Forest Classifier"
        />
      </div>

      {/* 4. FOOTER PROGRESS BAR */}
      <div className="mt-8 border-t border-[var(--border-subtle)] pt-4">
        <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
          <span>COORDINATION PIPELINE</span>
          <span className="text-[var(--text-secondary)] font-semibold">
            {step === 0 && "15% / INGEST"}
            {step === 1 && "35% / MAP"}
            {step === 2 && "55% / DISPATCH"}
            {step === 3 && "75% / ANALYZE"}
            {step === 4 && "88% / MODEL"}
            {step === 5 && "96% / SYNTHESIZE"}
            {step === 6 && "100% / READY"}
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--background-soft)] border border-[var(--border-subtle)]">
          <motion.div
            className="h-full bg-[var(--structure-bright)] rounded-full"
            initial={{ width: "10%" }}
            animate={{
              width:
                step === 0
                  ? "15%"
                  : step === 1
                  ? "35%"
                  : step === 2
                  ? "55%"
                  : step === 3
                  ? "75%"
                  : step === 4
                  ? "88%"
                  : step === 5
                  ? "96%"
                  : "100%",
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

interface DomainNodeProps {
  number: string;
  name: string;
  icon: React.ReactNode;
  status: AgentNodeStatus;
  detail: string;
}

const DomainNode: React.FC<DomainNodeProps> = ({
  number,
  name,
  icon,
  status,
  detail,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "STANDBY":
        return "text-[var(--text-muted)] border-[var(--border-subtle)] bg-[var(--background-soft)]/50";
      case "ANALYZING":
        return "text-[var(--highlight-ice)] border-[var(--border-active)] bg-[var(--structure-deep)]/40";
      case "SIGNALS DETECTED":
        return "text-[var(--structure-bright)] border-[var(--border-active)] bg-[var(--structure-deep)]/60";
      case "COMPLETE":
        return "text-[var(--status-success)] border-[var(--status-success)]/30 bg-[var(--status-success)]/10";
    }
  };

  const getDotClass = () => {
    switch (status) {
      case "STANDBY":
        return "bg-[var(--text-muted)]";
      case "ANALYZING":
        return "bg-[var(--structure-bright)] animate-ping";
      case "SIGNALS DETECTED":
        return "bg-[var(--highlight-ice)] animate-pulse";
      case "COMPLETE":
        return "bg-[var(--status-success)]";
    }
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-lg border p-4 transition-all duration-300 ${getStatusColor()}`}
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] font-semibold text-[var(--text-muted)]">
            {number}
          </span>
          <span className="font-sans text-xs font-semibold text-[var(--text-primary)]">
            {name}
          </span>
        </div>
        <div className="text-[var(--structure-bright)]">{icon}</div>
      </div>

      <div className="my-3 font-sans text-[11px] text-[var(--text-secondary)]">
        {detail}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 font-mono text-[9px]">
        <span className="text-[var(--text-muted)] uppercase">Status</span>
        <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider">
          <span className={`h-1.5 w-1.5 rounded-full ${getDotClass()}`} />
          {status}
        </span>
      </div>
    </div>
  );
};
