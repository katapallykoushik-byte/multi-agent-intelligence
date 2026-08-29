"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface IntelligenceLandscapeProps {
  revealProgress: number; // 0 to 1
  className?: string;
}

export const IntelligenceLandscape: React.FC<IntelligenceLandscapeProps> = ({
  revealProgress,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    terrainMesh: THREE.LineSegments;
    pointsMesh: THREE.Points;
    gridGeometry: THREE.PlaneGeometry;
    clock: THREE.Clock;
    targetProgress: number;
    currentProgress: number;
    mouseX: number;
    mouseY: number;
    targetMouseX: number;
    targetMouseY: number;
    animationFrameId: number;
  } | null>(null);

  // Keep targetProgress updated
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.targetProgress = revealProgress;
    }
  }, [revealProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE, CAMERA, RENDERER
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060826, 0.015);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 18, 42);
    camera.lookAt(0, -2, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // TERRAIN GEOMETRY & WIREFRAME
    const gridWidth = 90;
    const gridDepth = 90;
    const segmentsX = 54;
    const segmentsY = 54;
    const gridGeometry = new THREE.PlaneGeometry(gridWidth, gridDepth, segmentsX, segmentsY);
    gridGeometry.rotateX(-Math.PI / 2);

    // Store original flat positions
    const originalPositions = new Float32Array(gridGeometry.attributes.position.array);

    // Create wireframe segments
    const wireframeGeometry = new THREE.WireframeGeometry(gridGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const terrainMesh = new THREE.LineSegments(wireframeGeometry, lineMaterial);
    scene.add(terrainMesh);

    // Create subtle vertex points
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.35,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const pointsMesh = new THREE.Points(gridGeometry, pointsMaterial);
    scene.add(pointsMesh);

    // 4 REGIONAL CLUSTER CENTERS FOR SPECIALIST DOMAINS
    const clusters = [
      { x: -18, z: -12, freq: 0.12, amp: 5.5 }, // Commercial
      { x: 18, z: -12, freq: 0.14, amp: 4.8 },  // Financial
      { x: -14, z: 14, freq: 0.15, amp: 5.2 },  // Operations
      { x: 16, z: 14, freq: 0.11, amp: 6.0 },   // Risk
    ];

    const clock = new THREE.Clock();

    const sceneData = {
      renderer,
      scene,
      camera,
      terrainMesh,
      pointsMesh,
      gridGeometry,
      clock,
      targetProgress: revealProgress,
      currentProgress: revealProgress,
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      animationFrameId: 0,
    };
    sceneRef.current = sceneData;

    // MOUSE MOVE HANDLER
    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      sceneData.targetMouseX = (e.clientX - windowHalfX) * 0.0008;
      sceneData.targetMouseY = (e.clientY - windowHalfY) * 0.0008;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // ANIMATION LOOP
    const animate = () => {
      sceneData.animationFrameId = requestAnimationFrame(animate);

      // Smooth progress interpolation
      sceneData.currentProgress +=
        (sceneData.targetProgress - sceneData.currentProgress) * 0.05;

      const progress = sceneData.currentProgress;

      // Mouse smoothing
      sceneData.mouseX += (sceneData.targetMouseX - sceneData.mouseX) * 0.05;
      sceneData.mouseY += (sceneData.targetMouseY - sceneData.mouseY) * 0.05;

      camera.position.x = sceneData.mouseX * 12;
      camera.position.y = 18 - sceneData.mouseY * 8;
      camera.lookAt(0, -2 + sceneData.mouseY * 4, 0);

      const elapsedTime = clock.getElapsedTime();

      // Update terrain heights based on progress & clusters
      const posAttr = gridGeometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      if (progress > 0.01) {
        for (let i = 0; i < posArray.length; i += 3) {
          const x = originalPositions[i];
          const z = originalPositions[i + 2];

          // Base wave motion
          let elevation =
            Math.sin(x * 0.08 + elapsedTime * 0.7) *
            Math.cos(z * 0.08 + elapsedTime * 0.6) *
            1.8;

          // Cluster influence
          for (const c of clusters) {
            const dist = Math.hypot(x - c.x, z - c.z);
            const influence = Math.max(0, 1 - dist / 22);
            elevation += Math.sin(dist * c.freq - elapsedTime * 1.1) * c.amp * influence * influence;
          }

          // Apply reveal progress
          posArray[i + 1] = elevation * progress;
        }

        posAttr.needsUpdate = true;

        // Recompute wireframe
        wireframeGeometry.dispose();
        terrainMesh.geometry = new THREE.WireframeGeometry(gridGeometry);
      }

      // Material opacities & colors
      const lineOpacity = Math.min(0.38, progress * 0.45);
      const pointsOpacity = Math.min(0.65, progress * 0.85);

      lineMaterial.opacity = lineOpacity;
      pointsMaterial.opacity = pointsOpacity;

      // Gentle landscape rotation
      terrainMesh.rotation.y = elapsedTime * 0.03 * (0.3 + progress * 0.7);
      pointsMesh.rotation.y = terrainMesh.rotation.y;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(sceneData.animationFrameId);

      gridGeometry.dispose();
      wireframeGeometry.dispose();
      lineMaterial.dispose();
      pointsMaterial.dispose();
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
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-opacity duration-1000 ${revealProgress > 0 ? "opacity-100" : "opacity-0"
        } ${className}`}
      style={{
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 45%, black 40%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 45%, black 40%, transparent 80%)",
      }}
    />
  );
};
