"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const LandingSculptureCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE & PERSPECTIVE CAMERA
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      32,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.1, 10.8);

    // 2. RENDERER WITH ACES FILMIC TONE MAPPING & SOFT SHADOWS
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 3. PHOTOGRAPHIC STUDIO LIGHTING RIG
    // Soft warm ambient base
    const ambientLight = new THREE.AmbientLight(0xfaf8f5, 2.0);
    scene.add(ambientLight);

    // Key Studio Light (Upper Left, Soft Crisp Shadows)
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(6.5, 11, 7.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    scene.add(keyLight);

    // Cool Sky-Blue Fill Light (Grazing left curvature)
    const skyBlueLight = new THREE.DirectionalLight(0x60a5fa, 2.8);
    skyBlueLight.position.set(-8.5, 3.5, 5);
    scene.add(skyBlueLight);

    // Soft Violet / Lavender Rim Light (Edge definition on right bevels)
    const violetLight = new THREE.DirectionalLight(0xc084fc, 3.0);
    violetLight.position.set(8.5, -2, 5.5);
    scene.add(violetLight);

    // Underneath Royal Blue Bounce Light (Ground Reflection)
    const floorBounce = new THREE.PointLight(0x2563eb, 3.2, 12);
    floorBounce.position.set(0, -3.2, 1.8);
    scene.add(floorBounce);

    // 4. BESPOKE SCULPTURE MATERIALS
    // Procedural subtle micro-grain texture for realistic matte porcelain finish
    const createMicroTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#F5F4EE";
      ctx.fillRect(0, 0, 512, 512);

      const imgData = ctx.getImageData(0, 0, 512, 512);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 3);
      return tex;
    };

    const microTex = createMicroTexture();

    // Primary Satin Titanium / Pearl Porcelain Material for the 4 Architectural Arms
    const satinCeramicMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf5f3ec,
      roughness: 0.26,
      metalness: 0.18,
      clearcoat: 0.95,
      clearcoatRoughness: 0.12,
      reflectivity: 0.85,
      bumpMap: microTex,
      bumpScale: 0.006,
      sheen: 0.65,
      sheenColor: new THREE.Color(0xdbeafe),
      sheenRoughness: 0.25,
      ior: 1.5,
    });

    // Central Faceted Crystalline Decision Gem Material
    const crystalFacetMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf0f4ff,
      roughness: 0.06,
      metalness: 0.12,
      transmission: 0.75,
      ior: 1.68,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      sheen: 0.9,
      sheenColor: new THREE.Color(0xc4b5fd),
      flatShading: true, // Diamond-like individually reflective facets
    });

    // Inner Glowing Core Material
    const innerCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: false,
    });

    // Orbital Halo Ring Material (Electric Sapphire / Sky Blue)
    const haloRingMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.18,
      metalness: 0.75,
    });

    const haloRingMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      roughness: 0.22,
      metalness: 0.7,
    });

    // 5. 3D SCULPTURAL COMPOSITION (4 CONVERGING ARCHITECTURAL PETALS/ARMS + CENTRAL CRYSTAL)
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [
      satinCeramicMaterial,
      crystalFacetMaterial,
      innerCoreMaterial,
      haloRingMaterial,
      haloRingMaterial2,
    ];

    // BESPOKE 2D CONTOURED PETAL PROFILE WITH BEVELED EDGES
    // Creates a solid, clean, thick sculptural arm with architectural curvature
    const createPetalShape = () => {
      const shape = new THREE.Shape();
      shape.moveTo(-0.55, 0.45);
      shape.lineTo(-0.7, 1.85);
      shape.quadraticCurveTo(-0.72, 2.5, 0.0, 2.55);
      shape.quadraticCurveTo(0.72, 2.5, 0.7, 1.85);
      shape.lineTo(0.55, 0.45);
      shape.quadraticCurveTo(0.25, 0.25, 0.0, 0.2);
      shape.quadraticCurveTo(-0.25, 0.25, -0.55, 0.45);
      return shape;
    };

    const petalShape = createPetalShape();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 4,
      depth: 0.85,
      bevelEnabled: true,
      bevelThickness: 0.22,
      bevelSize: 0.2,
      bevelOffset: 0,
      bevelSegments: 8,
    };

    const petalGeo = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
    petalGeo.center();
    geometriesToDispose.push(petalGeo);

    // INSTANTIATE 4 SYMMETRICAL CONVERGING ARMS (0°, 90°, 180°, 270°)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const armMesh = new THREE.Mesh(petalGeo, satinCeramicMaterial);
      armMesh.castShadow = true;
      armMesh.receiveShadow = true;

      // Position each arm radially around the central core
      const radius = 1.35;
      armMesh.position.x = Math.cos(angle + Math.PI / 4) * radius;
      armMesh.position.y = Math.sin(angle + Math.PI / 4) * radius;
      armMesh.position.z = 0;

      // Rotate each arm to point outward from center with dynamic isometric tilt
      armMesh.rotation.z = angle + Math.PI / 4 - Math.PI / 2;
      armMesh.rotation.x = Math.PI / 9;
      armMesh.rotation.y = (i % 2 === 0 ? 1 : -1) * (Math.PI / 16);

      sculptureGroup.add(armMesh);
    }

    // CENTRAL FACETED CRYSTALLINE GEM (1 Coordinated Decision Core)
    const crystalGeo = new THREE.IcosahedronGeometry(0.78, 0);
    geometriesToDispose.push(crystalGeo);
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalFacetMaterial);
    crystalMesh.castShadow = true;
    crystalMesh.receiveShadow = true;
    sculptureGroup.add(crystalMesh);

    // Inner Glowing Core Jewel
    const innerGemGeo = new THREE.OctahedronGeometry(0.38, 0);
    geometriesToDispose.push(innerGemGeo);
    const innerGemMesh = new THREE.Mesh(innerGemGeo, innerCoreMaterial);
    sculptureGroup.add(innerGemMesh);

    // Internal Light Source for Refraction Effect
    const crystalInnerLight = new THREE.PointLight(0x818cf8, 4.5, 4.0);
    crystalInnerLight.position.set(0, 0, 0);
    sculptureGroup.add(crystalInnerLight);

    // ORBITAL HALO RINGS (Thin Electric Blue / Violet Luminous Rings)
    const haloGeo1 = new THREE.TorusGeometry(1.95, 0.016, 16, 128);
    geometriesToDispose.push(haloGeo1);
    const haloMesh1 = new THREE.Mesh(haloGeo1, haloRingMaterial);
    haloMesh1.rotation.x = Math.PI / 2.8;
    haloMesh1.rotation.y = Math.PI / 5;
    sculptureGroup.add(haloMesh1);

    const haloGeo2 = new THREE.TorusGeometry(2.2, 0.014, 16, 128);
    geometriesToDispose.push(haloGeo2);
    const haloMesh2 = new THREE.Mesh(haloGeo2, haloRingMaterial2);
    haloMesh2.rotation.x = -Math.PI / 3.4;
    haloMesh2.rotation.z = Math.PI / 4;
    sculptureGroup.add(haloMesh2);

    // OVERALL ISOMETRIC SCULPTURE ORIENTATION
    sculptureGroup.rotation.x = 0.18;
    sculptureGroup.rotation.y = -0.28;
    sculptureGroup.rotation.z = 0.05;
    sculptureGroup.position.set(0, -0.05, 0);

    // 6. REALISTIC SOFT CONTACT SHADOW ON WARM IVORY FLOOR
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const sCtx = shadowCanvas.getContext("2d")!;
    const gradient = sCtx.createRadialGradient(256, 256, 16, 256, 256, 240);
    gradient.addColorStop(0, "rgba(22, 28, 48, 0.32)");
    gradient.addColorStop(0.35, "rgba(35, 48, 80, 0.14)");
    gradient.addColorStop(0.7, "rgba(60, 80, 120, 0.03)");
    gradient.addColorStop(1, "rgba(247, 247, 244, 0)");
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 512, 512);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(9.0, 9.0);
    geometriesToDispose.push(shadowGeo);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.92,
    });
    materialsToDispose.push(shadowMat);

    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -3.1;
    scene.add(shadowMesh);

    // 7. PRE-COMPILE SHADERS
    renderer.compile(scene, camera);

    // 8. INTERACTIVE MOUSE PARALLAX & CONTINUOUS IDLE ANIMATION LOOP
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.18;
    let targetRotY = -0.28;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Slow, majestic continuous rotation + weighted mouse parallax
      targetRotY = -0.28 + elapsed * 0.08 + mouseX * 0.2;
      targetRotX = 0.18 + Math.sin(elapsed * 0.22) * 0.035 + mouseY * 0.14;

      sculptureGroup.rotation.y = THREE.MathUtils.lerp(
        sculptureGroup.rotation.y,
        targetRotY,
        0.035
      );
      sculptureGroup.rotation.x = THREE.MathUtils.lerp(
        sculptureGroup.rotation.x,
        targetRotX,
        0.035
      );

      // Subtle vertical floating breathing drift
      sculptureGroup.position.y = -0.05 + Math.sin(elapsed * 0.55) * 0.04;

      // Central Crystal slow counter-spin
      crystalMesh.rotation.y = -elapsed * 0.22;
      crystalMesh.rotation.x = Math.sin(elapsed * 0.3) * 0.14;
      innerGemMesh.rotation.y = elapsed * 0.4;
      innerGemMesh.rotation.z = -elapsed * 0.25;

      // Orbiting Halo rings rotation
      haloMesh1.rotation.z = elapsed * 0.12;
      haloMesh2.rotation.z = -elapsed * 0.15;

      // Reactive lighting glint
      keyLight.position.x = 6.5 + mouseX * 1.5;
      keyLight.position.y = 11 - mouseY * 1.2;

      renderer.render(scene, camera);
    };

    animate();

    // 9. RESIZE HANDLER (RESPONSIVE SCALING ACROSS ALL VIEWPORT SIZES)
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;

      if (width < 640) {
        camera.position.z = 13.5;
      } else if (width < 1024) {
        camera.position.z = 12.0;
      } else {
        camera.position.z = 10.8;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Complete GPU resource deallocation
      renderer.dispose();
      geometriesToDispose.forEach((geo) => geo.dispose());
      materialsToDispose.forEach((mat) => mat.dispose());
      shadowTex.dispose();
      microTex.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden"
      aria-hidden="true"
    />
  );
};
