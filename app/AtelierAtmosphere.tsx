"use client";

import React, { useEffect, useRef, useState } from "react";

interface AtmosphereProps {
  mode?: "canopy-and-roses" | "petals-only";
}

/* Liste complète des noms possibles pour ton image dans /public */
const IMAGE_SOURCES = [
  "/rose-canopy.jpg",
  "/roses-canopy.jpg",
  "/rose canopy.jpg",
  "/roses canopy.jpg",
  "/rose-canopy.png",
  "/roses-canopy.png",
  "/image_0f6ea8.jpg",
];

/* Zones de découpe des roses sur ton image originale */
const ROSE_CROPS = [
  { sx: 0.34, sy: 0.14, sw: 0.085, sh: 0.075 },
  { sx: 0.43, sy: 0.14, sw: 0.085, sh: 0.075 },
  { sx: 0.44, sy: 0.25, sw: 0.078, sh: 0.068 },
  { sx: 0.50, sy: 0.30, sw: 0.085, sh: 0.070 },
  { sx: 0.49, sy: 0.42, sw: 0.068, sh: 0.062 },
  { sx: 0.61, sy: 0.35, sw: 0.082, sh: 0.068 },
  { sx: 0.68, sy: 0.39, sw: 0.088, sh: 0.072 },
  { sx: 0.68, sy: 0.46, sw: 0.092, sh: 0.080 },
  { sx: 0.81, sy: 0.22, sw: 0.080, sh: 0.068 },
  { sx: 0.90, sy: 0.11, sw: 0.085, sh: 0.075 },
];

const SPAWN_POINTS_CANOPY = [
  { xMin: 0.14, xMax: 0.25, yStart: 0.12 },
  { xMin: 0.26, xMax: 0.38, yStart: 0.18 },
  { xMin: 0.39, xMax: 0.48, yStart: 0.24 },
  { xMin: 0.48, xMax: 0.56, yStart: 0.15 },
  { xMin: 0.58, xMax: 0.68, yStart: 0.28 },
  { xMin: 0.69, xMax: 0.80, yStart: 0.20 },
  { xMin: 0.81, xMax: 0.90, yStart: 0.13 },
];

interface FallingParticle {
  id: number;
  cropIndex: number;
  x: number;
  y: number;
  speedY: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  fadeStartRatio: number;
}

export default function AtelierAtmosphere({
  mode = "canopy-and-roses",
}: AtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const [resolvedSrc, setResolvedSrc] = useState<string>("/rose-canopy.jpg");
  const isCanopy = mode === "canopy-and-roses";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isMounted = true;
    let animId: number;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /* Teste automatiquement les différents noms possibles dans /public */
    const tryLoadImage = (index: number) => {
      if (index >= IMAGE_SOURCES.length || !isMounted) return;
      const img = new Image();
      img.onload = () => {
        if (!isMounted) return;
        loadedImgRef.current = img;
        setResolvedSrc(IMAGE_SOURCES[index]);
      };
      img.onerror = () => {
        tryLoadImage(index + 1);
      };
      img.src = IMAGE_SOURCES[index];
    };
    tryLoadImage(0);

    const particles: FallingParticle[] = [];
    let nextId = 1;
    let lastSpawnTime = performance.now();
    let nextSpawnDelay = 800;

    const spawnParticle = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cropIndex = Math.floor(Math.random() * ROSE_CROPS.length);

      let x = w * (0.08 + Math.random() * 0.84);
      let y = -40;

      if (isCanopy) {
        const zone =
          SPAWN_POINTS_CANOPY[
            Math.floor(Math.random() * SPAWN_POINTS_CANOPY.length)
          ];
        const canopyWidth = Math.min(w, 1080);
        const canopyLeft = (w - canopyWidth) / 2;
        const pctX = zone.xMin + Math.random() * (zone.xMax - zone.xMin);
        x = canopyLeft + canopyWidth * pctX;
        y = h * (zone.yStart + (Math.random() - 0.5) * 0.05);
      } else {
        x = w * (0.06 + Math.random() * 0.88);
        y = -30;
      }

      const size = isCanopy
        ? 46 + Math.random() * 26
        : 24 + Math.random() * 14;

      particles.push({
        id: nextId++,
        cropIndex,
        x,
        y,
        speedY: 0.9 + Math.random() * 0.65,
        size,
        opacity: 0,
        maxOpacity: isCanopy ? 0.88 : 0.72,
        fadeStartRatio: 0.72 + Math.random() * 0.16,
      });
    };

    spawnParticle();

    const renderLoop = (now: number) => {
      if (!isMounted) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (
        now - lastSpawnTime > nextSpawnDelay &&
        particles.length < (isCanopy ? 6 : 5)
      ) {
        spawnParticle();
        lastSpawnTime = now;
        nextSpawnDelay = isCanopy
          ? 1500 + Math.random() * 2400
          : 1800 + Math.random() * 2600;
      }

      const img = loadedImgRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.speedY;

        const progress = p.y / canvas.height;
        if (progress < 0.18) {
          p.opacity = Math.min(p.maxOpacity, p.opacity + 0.025);
        } else if (progress > p.fadeStartRatio) {
          p.opacity = Math.max(0, p.opacity - 0.018);
        } else {
          p.opacity = p.maxOpacity;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (img && img.complete && img.naturalWidth > 0) {
          const crop = ROSE_CROPS[p.cropIndex];
          const sx = crop.sx * img.naturalWidth;
          const sy = crop.sy * img.naturalHeight;
          const sw = crop.sw * img.naturalWidth;
          const sh = crop.sh * img.naturalHeight;

          ctx.drawImage(
            img,
            sx,
            sy,
            sw,
            sh,
            p.x - p.size / 2,
            p.y - p.size / 2,
            p.size,
            p.size * (sh / sw)
          );
        } else {
          ctx.strokeStyle = "#3a3a3a";
          ctx.lineWidth = 1;
          ctx.beginPath();
          const r = p.size * 0.36;
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.moveTo(p.x - r * 0.65, p.y - r * 0.2);
          ctx.quadraticCurveTo(
            p.x,
            p.y - r * 0.9,
            p.x + r * 0.65,
            p.y - r * 0.1
          );
          ctx.quadraticCurveTo(
            p.x + r * 0.2,
            p.y + r * 0.7,
            p.x - r * 0.5,
            p.y + r * 0.3
          );
          ctx.stroke();
        }

        ctx.restore();

        if (
          p.y > canvas.height + 60 ||
          (progress > p.fadeStartRatio && p.opacity <= 0.01)
        ) {
          particles.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isCanopy]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
        overflow: "hidden",
        mixBlendMode: "multiply",
      }}
      aria-hidden="true"
    >
      {isCanopy && (
        <div
          style={{
            position: "absolute",
            top: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(96vw, 1060px)",
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: 0.92,
          }}
        >
          <img
            src={resolvedSrc}
            alt=""
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "44vh",
              objectFit: "contain",
              objectPosition: "top center",
              display: "block",
            }}
          />
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}