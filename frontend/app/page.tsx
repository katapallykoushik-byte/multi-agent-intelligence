"use client";

import React, { useState, useEffect } from "react";
import { MinimalNav } from "@/components/navigation/MinimalNav";
import { PostAnalysisSidebar } from "@/components/navigation/PostAnalysisSidebar";
import { GlobalBackground } from "@/components/environment/GlobalBackground";
import { IntelligenceEnvironment } from "@/components/environment/IntelligenceEnvironment";
import { IntelligenceHero } from "@/components/intelligence/IntelligenceHero";
import { IntelligenceStory } from "@/components/intelligence/IntelligenceStory";
import { AnalysisResult } from "@/components/intelligence/types";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [businessProblem, setBusinessProblem] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [detectedColumns, setDetectedColumns] = useState<number>(31);
  const [activeTerritory, setActiveTerritory] = useState<number>(0);
  const [error, setError] = useState("");

  // DISCRETE TERRITORY STATE LISTENER (ONLY UPDATES ON SECTION BOUNDARY CROSSINGS)
  useEffect(() => {
    if (!analysisResult) {
      setActiveTerritory(0);
      return;
    }

    let currentTerritory = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

      let nextTerritory = 0;
      if (progress < 0.15) nextTerritory = 0;
      else if (progress < 0.35) nextTerritory = 1;
      else if (progress < 0.55) nextTerritory = 2;
      else if (progress < 0.72) nextTerritory = 3;
      else if (progress < 0.88) nextTerritory = 4;
      else nextTerritory = 5;

      if (nextTerritory !== currentTerritory) {
        currentTerritory = nextTerritory;
        setActiveTerritory(nextTerritory);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [analysisResult]);

  // FILE HANDLING & DYNAMIC COLUMN COUNTING
  const handleFile = (file: File | undefined) => {
    if (!file) return;

    const validExtensions = [".csv", ".xlsx", ".xls"];
    const isValid = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isValid) {
      setError("Unsupported file format. Please upload CSV or Excel (.csv, .xlsx, .xls).");
      return;
    }

    setError("");
    setSelectedFile(file);
    setAnalysisResult(null); // Clear previous analysis immediately on new file select

    // Dynamically extract column count from CSV header
    if (file.name.toLowerCase().endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          const firstLine = text.split(/[\r\n]+/)[0];
          if (firstLine) {
            const cols = firstLine.split(",").length;
            if (cols > 0) {
              setDetectedColumns(cols);
            }
          }
        }
      };
      reader.readAsText(file.slice(0, 4096));
    }
  };

  // ANALYSIS TRIGGER
  const handleAnalyze = async () => {
    setError("");

    if (!selectedFile) {
      setError("An enterprise dataset is required before analysis can begin.");
      return;
    }

    if (!businessProblem.trim()) {
      setError("Please define the business problem or strategic decision directive.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisResult(null); // Complete state reset

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("business_problem", businessProblem);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("The analysis server returned an error.");
      }

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.message || "Analysis failed.");
      }

      setAnalysisResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred during synthesis."
      );
      setIsAnalyzing(false);
    }
  };

  // ON ANALYSIS SEQUENCE COMPLETE (TRANSITION TO IMMERSIVE STORY STREAM)
  const handleSequenceComplete = () => {
    setIsAnalyzing(false);

    setTimeout(() => {
      const streamEl = document.getElementById("intelligence-stream");
      if (streamEl) {
        streamEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 250);
  };

  // RESET HANDLER
  const handleReset = () => {
    setAnalysisResult(null);
    setSelectedFile(null);
    setBusinessProblem("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans selection:bg-[var(--structure-primary)] selection:text-white">
      {/* PERSISTENT GLOBAL AMBIENT LAYER */}
      <GlobalBackground />

      {/* 3D DATA LANDSCAPE: ONLY APPEARS AFTER ANALYSIS INITIALIZATION / ON RESULTS */}
      {(isAnalyzing || !!analysisResult) && (
        <IntelligenceEnvironment
          analysisResult={analysisResult}
          activeTerritory={activeTerritory}
        />
      )}

      {/* TOP MINIMAL NAVIGATION */}
      <MinimalNav isAnalyzing={isAnalyzing} hasResults={!!analysisResult} />

      <main className="relative z-10">
        {/* 1. EDITORIAL HERO & DUAL-SOURCE WORKSPACE */}
        <IntelligenceHero
          selectedFile={selectedFile}
          businessProblem={businessProblem}
          isDragging={isDragging}
          isAnalyzing={isAnalyzing}
          error={error}
          analysisResult={analysisResult}
          detectedColumns={detectedColumns}
          onFileSelect={handleFile}
          onProblemChange={setBusinessProblem}
          onAnalyze={handleAnalyze}
          onSequenceComplete={handleSequenceComplete}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
        />

        {/* 2. IMMERSIVE SCROLL-DRIVEN 3D STORYTELLING ENVIRONMENT (POST-ANALYSIS) */}
        {analysisResult && !isAnalyzing && (
          <>
            {/* DEDICATED SLIM VERTICAL NAVIGATION SIDEBAR */}
            <PostAnalysisSidebar
              activeTerritory={activeTerritory}
              onNavigate={(idx) => setActiveTerritory(idx)}
            />

            <IntelligenceStory
              key={`${analysisResult.business_problem}-${analysisResult.analysis?.dataset_overview?.rows ?? 0}`}
              analysisResult={analysisResult}
              onReset={handleReset}
            />
          </>
        )}
      </main>

      {/* INTEGRATED EDITORIAL FOOTER */}
      <footer className="relative z-10 border-t border-[var(--border-subtle)] bg-[var(--background-elevated)]/75 py-10 text-[var(--text-secondary)] font-sans text-xs">
        <div className="mx-auto flex max-w-[1500px] flex-col sm:flex-row items-center justify-between gap-4 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--structure-bright)]" />
            <span className="font-semibold text-[var(--text-primary)]">EDS / Multi-Agent AI</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-muted)]">Autonomous Enterprise Decision Intelligence</span>
          </div>
          <div className="font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
            Coordinated Multi-Agent Synthesis • Random Forest Validated
          </div>
        </div>
      </footer>
    </div>
  );
}