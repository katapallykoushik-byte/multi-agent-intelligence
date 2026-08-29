"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { AnalysisResult } from "../intelligence/types";

interface IntelligenceEnvironmentProps {
  analysisResult: AnalysisResult | null;
  activeTerritory?: number;
}

export const IntelligenceEnvironment: React.FC<IntelligenceEnvironmentProps> = ({
  analysisResult,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    instancedMesh: THREE.InstancedMesh;
    travelingLight: THREE.PointLight;
    pointLights: THREE.PointLight[];
    instanceCount: number;
    startTime: number;
    targetProgress: number;
    currentProgress: number;
    targetCamPos: THREE.Vector3;
    currentCamPos: THREE.Vector3;
    targetCamLookAt: THREE.Vector3;
    currentCamLookAt: THREE.Vector3;
    mouseX: number;
    mouseY: number;
    targetMouseX: number;
    targetMouseY: number;
    animationFrameId: number;
    gridSize: number;
    spacing: number;
    baseHeights: Float32Array;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. LUMINOUS DEEP NAVY / ETHEREAL ATMOSPHERIC ENVIRONMENT
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070c2a);
    scene.fog = new THREE.FogExp2(0x070c2a, 0.011);

    // 2. ISOMETRIC-INSPIRED PERSPECTIVE CAMERA
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    const initialCamPos = new THREE.Vector3(25, 30, 35);
    const initialLookAt = new THREE.Vector3(0, 0, 0);
    camera.position.copy(initialCamPos);
    camera.lookAt(initialLookAt);

    // 3. HIGH-PERFORMANCE WEBGL RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.65;
    container.appendChild(renderer.domElement);

    // 4. COORDINATED LUMINOUS MULTI-LIGHT ARCHITECTURE
    // Ethereal Soft Ambient Base (Illuminates base terrain so shadows don't crush to black)
    const ambientLight = new THREE.AmbientLight(0x162c72, 3.6);
    scene.add(ambientLight);

    // Key Light: Overhead Directional Sunlight (Luminous White-Blue #DDEBFF)
    const keyLight = new THREE.DirectionalLight(0xddebff, 4.6);
    keyLight.position.set(22, 65, 22);
    scene.add(keyLight);

    // Fill Light: Vibrant Royal Blue (#285BFF)
    const fillLight = new THREE.DirectionalLight(0x285bff, 3.2);
    fillLight.position.set(-32, 25, -32);
    scene.add(fillLight);

    // Rim Light: Sky Blue (#7DB8FF)
    const rimLight = new THREE.DirectionalLight(0x7db8ff, 2.6);
    rimLight.position.set(32, 18, -25);
    scene.add(rimLight);

    // Soft Ground Bounce Light (Elevates deep recesses with soft sky-blue glow)
    const groundBounce = new THREE.DirectionalLight(0x1d4ed8, 2.0);
    groundBounce.position.set(0, -30, 0);
    scene.add(groundBounce);

    // Dynamic Ethereal Traveling Spotlight Pool
    const travelingLight = new THREE.PointLight(0x93c5fd, 5.5, 55, 1.4);
    travelingLight.position.set(0, 18, 0);
    scene.add(travelingLight);

    // 4 Localized Territory Accent Light Pools
    const lightCommercial = new THREE.PointLight(0x3b82f6, 4.8, 48, 1.6);
    lightCommercial.position.set(-18, 15, -18);
    scene.add(lightCommercial);

    const lightFinancial = new THREE.PointLight(0x7db8ff, 5.2, 48, 1.6);
    lightFinancial.position.set(18, 17, -18);
    scene.add(lightFinancial);

    const lightOperations = new THREE.PointLight(0x3b82f6, 4.8, 48, 1.6);
    lightOperations.position.set(-18, 15, 18);
    scene.add(lightOperations);

    const lightRisk = new THREE.PointLight(0x9b78ff, 5.4, 48, 1.6);
    lightRisk.position.set(18, 17, 18);
    scene.add(lightRisk);

    const pointLights = [lightCommercial, lightFinancial, lightOperations, lightRisk];

    // 5. DENSE PRECISION 3D DATA TERRAIN (104 x 104 = 10,816 ARCHITECTURAL PILLARS)
    const gridSize = 104;
    const instanceCount = gridSize * gridSize;
    const spacing = 0.46;
    const halfGrid = (gridSize * spacing) / 2;

    const columnGeometry = new THREE.BoxGeometry(0.38, 1.0, 0.38);
    columnGeometry.translate(0, 0.5, 0); // Origin at base for vertical scaling

    // VERTEX COLOR GRADIENT FOR EACH PILLAR:
    // Top face: Crisp luminous white (#FFFFFF / #DDEBFF)
    // Upper side edge: Bright Sky blue (#7DB8FF)
    // Lower side edge: Deep vibrant royal blue (#102A83)
    const posCount = columnGeometry.attributes.position.count;
    const positions = columnGeometry.attributes.position.array;
    const normals = columnGeometry.attributes.normal.array;
    const colors = new Float32Array(posCount * 3);

    for (let i = 0; i < posCount; i++) {
      const ny = normals[i * 3 + 1];
      const py = positions[i * 3 + 1];

      if (ny > 0.5) {
        // TOP CAP: Crisp near-white / luminous sky blue
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.99;
        colors[i * 3 + 2] = 1.0;
      } else {
        // VERTICAL SIDES: Smooth vertical gradient from base to top
        const heightRatio = Math.max(0, Math.min(1, py));
        const r = THREE.MathUtils.lerp(0.06, 0.32, heightRatio);
        const g = THREE.MathUtils.lerp(0.16, 0.62, heightRatio);
        const b = THREE.MathUtils.lerp(0.72, 1.0, heightRatio);

        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
      }
    }
    columnGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const columnMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.18,
      metalness: 0.78,
    });

    const instancedMesh = new THREE.InstancedMesh(columnGeometry, columnMaterial, instanceCount);

    const dummy = new THREE.Object3D();
    const tintColor = new THREE.Color();
    const baseHeights = new Float32Array(instanceCount);

    // EXTRACT REAL BACKEND METRICS FOR SHAPING
    const spec = analysisResult?.specialist_analysis;
    const commSales = spec?.commercial_analysis?.analysis?.sales_summary?.total_sales ?? 674802;
    const commScale = Math.min(1.5, commSales / 450000);

    const finMargin = spec?.financial_analysis?.analysis?.key_metrics?.profit_margin_pct ?? 31.05;
    const finScale = Math.min(1.7, finMargin / 22);

    const opsLoad = spec?.operations_analysis?.analysis?.operational_summary?.machine_utilization?.average_utilization_pct ?? 74.94;
    const opsScale = opsLoad / 55;

    const riskScore = spec?.risk_analysis?.analysis?.risk_score ?? 42;
    const riskScale = riskScore / 32;

    // PRECOMPUTE ALL 10,816 INSTANCES (COMPUTED ONCE DURING SETUP FOR 60FPS ZERO-STUTTER SCROLL)
    let idx = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const x = c * spacing - halfGrid;
        const z = r * spacing - halfGrid;

        const isCommercial = x <= 0 && z <= 0;
        const isFinancial = x > 0 && z <= 0;
        const isOperations = x <= 0 && z > 0;
        const isRisk = x > 0 && z > 0;

        let elevation = 0.35; // Base terrain floor (visible and luminous)
        const distFromCenter = Math.hypot(x, z);

        if (isCommercial) {
          // 01 COMMERCIAL: Stepped architectural building plateaus
          const inStep1 = x >= -20 && x <= -10 && z >= -20 && z <= -10;
          const inStep2 = x >= -18 && x <= -12 && z >= -18 && z <= -12;
          const inStep3 = x >= -16 && x <= -14 && z >= -16 && z <= -14;
          const wave = (Math.sin(x * 0.35) * Math.cos(z * 0.35) + 1.0) * 1.4;

          if (inStep3) elevation = 8.5 * commScale;
          else if (inStep2) elevation = 5.6 * commScale;
          else if (inStep1) elevation = 3.5 * commScale;
          else elevation = wave + 0.38;
        } else if (isFinancial) {
          // 02 FINANCIAL: Soaring skyscraper monoliths with sharp steps
          const inTower1 = x >= 10 && x <= 18 && z >= -22 && z <= -12;
          const inTower2 = x >= 12 && x <= 20 && z >= -10 && z <= -4;
          const inTower3 = x >= 6 && x <= 11 && z >= -18 && z <= -13;

          if (inTower1) elevation = 12.8 * finScale;
          else if (inTower2) elevation = 9.2 * finScale;
          else if (inTower3) elevation = 6.4 * finScale;
          else {
            const ridge = Math.max(0, Math.sin(x * 0.4) * 2.2);
            elevation = ridge + 0.38;
          }
        } else if (isOperations) {
          // 03 OPERATIONS: Logistics corridors, canyon grooves, stepped distribution blocks
          const inBlock1 = x >= -20 && x <= -12 && z >= 8 && z <= 18;
          const inBlock2 = x >= -10 && x <= -4 && z >= 12 && z <= 20;
          const canyon = Math.abs(Math.sin((x + z) * 0.45)) * 2.8;

          if (inBlock1) elevation = 7.5 * opsScale;
          else if (inBlock2) elevation = 5.2 * opsScale;
          else elevation = canyon + 0.35;
        } else if (isRisk) {
          // 04 RISK: Mountain spires and high-density risk clusters
          const inPeak = x >= 10 && x <= 18 && z >= 10 && z <= 18;
          const spikeDist = Math.hypot(x - 14, z - 14);
          const mountain = Math.max(0, 1 - spikeDist / 12) * 11.5;
          const microSpike = (Math.sin(x * 0.75) > 0.35 ? 2.8 : 0.2);

          if (inPeak) elevation = (mountain + microSpike) * riskScale;
          else elevation = (Math.max(0, 1 - spikeDist / 16) * 4.2 + 0.35);
        }

        // Center clearance for camera path
        const centerFalloff = Math.min(1.0, distFromCenter / 5.5);
        elevation = Math.max(0.18, elevation * centerFalloff);

        baseHeights[idx] = elevation;

        dummy.position.set(x, 0, z);
        dummy.scale.set(1, elevation, 1);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(idx, dummy.matrix);

        // Instance Color Tinting with Ethereal Brightness & Violet Highlights
        if (isCommercial) {
          tintColor.setHex(0x102878).lerp(new THREE.Color(0x285bff), Math.min(1, elevation / 7.5));
        } else if (isFinancial) {
          tintColor.setHex(0x0c1e60).lerp(new THREE.Color(0x7db8ff), Math.min(1, elevation / 11.0));
        } else if (isOperations) {
          tintColor.setHex(0x0e2468).lerp(new THREE.Color(0x3b82f6), Math.min(1, elevation / 6.5));
        } else {
          // Risk Territory with subtle luminous violet accent (#9B78FF)
          tintColor.setHex(0x163290).lerp(new THREE.Color(0x9b78ff), Math.min(1, elevation / 10.0));
        }

        if (elevation > 6.0) {
          tintColor.lerp(new THREE.Color(0xffffff), 0.40);
        }

        instancedMesh.setColorAt(idx, tintColor);
        idx++;
      }
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
    scene.add(instancedMesh);

    // 6. SHADER & PIPELINE WARMUP (PRE-COMPILE ALL GPU SHADERS BEFORE USER SCROLLS)
    renderer.compile(scene, camera);

    // 7. ANIMATION & CAMERA TRAJECTORY CONTROLLER (SMOOTH DIRECT-SCROLL POLLING)
    const startTime = performance.now();
    const state = {
      renderer,
      scene,
      camera,
      instancedMesh,
      travelingLight,
      pointLights,
      instanceCount,
      startTime,
      targetProgress: 0,
      currentProgress: 0,
      targetCamPos: new THREE.Vector3().copy(initialCamPos),
      currentCamPos: new THREE.Vector3().copy(initialCamPos),
      targetCamLookAt: new THREE.Vector3().copy(initialLookAt),
      currentCamLookAt: new THREE.Vector3().copy(initialLookAt),
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      animationFrameId: 0,
      gridSize,
      spacing,
      baseHeights,
    };
    stateRef.current = state;

    // Mouse parallax handler
    const handleMouseMove = (e: MouseEvent) => {
      const hw = window.innerWidth / 2;
      const hh = window.innerHeight / 2;
      state.targetMouseX = (e.clientX - hw) * 0.0004;
      state.targetMouseY = (e.clientY - hh) * 0.0004;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    // Hover focus state for interactive charts
    const hoverMultipliers = [1.0, 1.0, 1.0, 1.0];
    const targetHoverMultipliers = [1.0, 1.0, 1.0, 1.0];

    const handleTerritoryFocus = (e: Event) => {
      const customEvent = e as CustomEvent<{ territory: number; intensity: number }>;
      const tIdx = (customEvent.detail?.territory ?? 1) - 1;
      if (tIdx >= 0 && tIdx < 4) {
        targetHoverMultipliers[tIdx] = customEvent.detail.intensity || 1.6;
      }
    };
    window.addEventListener("territory-focus", handleTerritoryFocus);

    // 8. CONTINUOUS ZERO-LATENCY ANIMATION LOOP (SOLID 60FPS)
    const animate = () => {
      state.animationFrameId = requestAnimationFrame(animate);

      // Read window scroll directly inside rAF loop for zero-jank React bypass
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      const scrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      state.targetProgress = scrollProgress;

      // Ultra-smooth progress lerp damping (0.04 for seamless instantaneous glide)
      state.currentProgress += (state.targetProgress - state.currentProgress) * 0.04;
      const p = Math.max(0, Math.min(1, state.currentProgress));

      // Mouse smoothing
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.03;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.03;

      // Smooth hover multipliers
      for (let i = 0; i < 4; i++) {
        hoverMultipliers[i] += (targetHoverMultipliers[i] - hoverMultipliers[i]) * 0.08;
      }

      const time = (performance.now() - state.startTime) * 0.001;

      // ETHEREAL TRAVELING LIGHT POOL SWEEPS ACROSS THE SCENE
      travelingLight.position.x = Math.sin(time * 0.15) * 25;
      travelingLight.position.z = Math.cos(time * 0.12) * 25;
      travelingLight.position.y = 15 + Math.sin(time * 0.20) * 3.5;

      // ─────────────────────────────────────────────────────────────
      // CINEMATIC ISOMETRIC CAMERA TRAJECTORY BASED ON SCROLL
      // ─────────────────────────────────────────────────────────────
      if (p <= 0.15) {
        // OVERVIEW GENESIS: High isometric perspective
        const t = p / 0.15;
        state.targetCamPos.set(
          THREE.MathUtils.lerp(25, 17, t),
          THREE.MathUtils.lerp(30, 23, t),
          THREE.MathUtils.lerp(35, 27, t)
        );
        state.targetCamLookAt.set(
          THREE.MathUtils.lerp(0, -6, t),
          THREE.MathUtils.lerp(0, 2, t),
          THREE.MathUtils.lerp(0, -6, t)
        );
      } else if (p <= 0.35) {
        // 01 COMMERCIAL TERRITORY: Oblique zoom into the commercial stepped building
        const t = (p - 0.15) / 0.2;
        state.targetCamPos.set(
          THREE.MathUtils.lerp(17, 3, t),
          THREE.MathUtils.lerp(23, 15, t),
          THREE.MathUtils.lerp(27, 13, t)
        );
        state.targetCamLookAt.set(
          THREE.MathUtils.lerp(-6, -14, t),
          THREE.MathUtils.lerp(2, 4.5, t),
          THREE.MathUtils.lerp(-6, -14, t)
        );
      } else if (p <= 0.55) {
        // 02 FINANCIAL TERRITORY: Camera slides right over the towering skyscraper cluster
        const t = (p - 0.35) / 0.2;
        state.targetCamPos.set(
          THREE.MathUtils.lerp(3, 29, t),
          THREE.MathUtils.lerp(15, 19, t),
          THREE.MathUtils.lerp(13, 9, t)
        );
        state.targetCamLookAt.set(
          THREE.MathUtils.lerp(-14, 14, t),
          THREE.MathUtils.lerp(4.5, 6.0, t),
          THREE.MathUtils.lerp(-14, -14, t)
        );
      } else if (p <= 0.72) {
        // 03 OPERATIONS TERRITORY: Camera glides to logistics corridor & canyon
        const t = (p - 0.55) / 0.17;
        state.targetCamPos.set(
          THREE.MathUtils.lerp(29, 5, t),
          THREE.MathUtils.lerp(19, 15, t),
          THREE.MathUtils.lerp(9, 35, t)
        );
        state.targetCamLookAt.set(
          THREE.MathUtils.lerp(14, -12, t),
          THREE.MathUtils.lerp(6.0, 3.5, t),
          THREE.MathUtils.lerp(-14, 14, t)
        );
      } else if (p <= 0.88) {
        // 04 RISK & CLASSIFICATION TERRITORY: Focus on mountain spires & ML cluster
        const t = (p - 0.72) / 0.16;
        state.targetCamPos.set(
          THREE.MathUtils.lerp(5, 31, t),
          THREE.MathUtils.lerp(15, 17, t),
          THREE.MathUtils.lerp(35, 31, t)
        );
        state.targetCamLookAt.set(
          THREE.MathUtils.lerp(-12, 14, t),
          THREE.MathUtils.lerp(3.5, 5.0, t),
          THREE.MathUtils.lerp(14, 14, t)
        );
      } else {
        // 05 EXECUTIVE APEX OVERVIEW: Grand pullback overlooking all converged towers
        const t = (p - 0.88) / 0.12;
        state.targetCamPos.set(
          THREE.MathUtils.lerp(31, 26, t),
          THREE.MathUtils.lerp(17, 34, t),
          THREE.MathUtils.lerp(31, 38, t)
        );
        state.targetCamLookAt.set(
          THREE.MathUtils.lerp(14, 0, t),
          THREE.MathUtils.lerp(5.0, 0, t),
          THREE.MathUtils.lerp(14, 0, t)
        );
      }

      // Smooth camera interpolation
      state.currentCamPos.lerp(state.targetCamPos, 0.04);
      state.currentCamLookAt.lerp(state.targetCamLookAt, 0.04);

      camera.position.x = state.currentCamPos.x + state.mouseX * 4;
      camera.position.y = state.currentCamPos.y - state.mouseY * 3;
      camera.position.z = state.currentCamPos.z;
      camera.lookAt(state.currentCamLookAt);

      // Localized point light pool intensities modulated by chart hover focus
      pointLights[0].intensity = (p >= 0.12 && p <= 0.38 ? 5.5 : 1.8) * hoverMultipliers[0]; // Commercial
      pointLights[1].intensity = (p >= 0.32 && p <= 0.58 ? 6.0 : 1.8) * hoverMultipliers[1]; // Financial
      pointLights[2].intensity = (p >= 0.52 && p <= 0.75 ? 5.5 : 1.8) * hoverMultipliers[2]; // Operations
      pointLights[3].intensity = (p >= 0.68 && p <= 0.92 ? 6.2 : 1.8) * hoverMultipliers[3]; // Risk

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("territory-focus", handleTerritoryFocus);
      cancelAnimationFrame(state.animationFrameId);

      columnGeometry.dispose();
      columnMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden select-none"
    />
  );
};
