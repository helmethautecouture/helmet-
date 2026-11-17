"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AtmosphereProps {
  intensity?: "subtle" | "gallery";
}

interface EphemeralEvent {
  id: number;
  type: "thorn-branch" | "manuscript-note" | "baroque-vine";
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "mid-left" | "mid-right";
  text?: string;
  crossedText?: string;
  accentCrimson?: boolean;
}

interface FallingPetal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  sway: number;
  rotate: number;
  isCrimson: boolean;
}

const ATELIER_MANUSCRIPTS = [
  { crossed: "première coupe trop lâche", final: "ajustement taille — pièce unique" },
  { crossed: "encre noire diluée", final: "coton italien 100% — fait main à Paris" },
  { crossed: "archive test n°00", final: "édition -01 — atelier helmet haute couture" },
  { crossed: "série industrielle", final: "strictement confectionné à la main" },
  { crossed: "la mia vita sta galleggiando", final: "aucun compromis sur la coupe" },
  { crossed: "échantillon refusé", final: "validé — teinture noire profonde & bordeaux" },
];

export default function AtelierAtmosphere({ intensity = "subtle" }: AtmosphereProps) {
  const [events, setEvents] = useState<EphemeralEvent[]>([]);
  const [petals, setPetals] = useState<FallingPetal[]>([]);

  const isGallery = intensity === "gallery";

  useEffect(() => {
    const petalCount = isGallery ? 9 : 4;
    const generatedPetals: FallingPetal[] = Array.from({ length: petalCount }).map((_, idx) => ({
      id: idx,
      left: 6 + Math.random() * 88,
      delay: Math.random() * 12,
      duration: 15 + Math.random() * 12,
      size: 9 + Math.random() * 7,
      sway: (Math.random() - 0.5) * 90,
      rotate: Math.random() * 360,
      isCrimson: idx % 3 !== 0,
    }));
    setPetals(generatedPetals);

    const spawnRandomArtifact = () => {
      const types: EphemeralEvent["type"][] = [
        "thorn-branch",
        "manuscript-note",
        "baroque-vine",
      ];
      const corners: EphemeralEvent["corner"][] = isGallery
        ? ["top-left", "top-right", "bottom-left", "bottom-right", "mid-left", "mid-right"]
        : ["top-left", "bottom-right", "mid-left", "mid-right"];

      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomCorner = corners[Math.floor(Math.random() * corners.length)];
      const randomNote =
        ATELIER_MANUSCRIPTS[Math.floor(Math.random() * ATELIER_MANUSCRIPTS.length)];

      const newEvent: EphemeralEvent = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: randomType,
        corner: randomCorner,
        crossedText: randomNote.crossed,
        text: randomNote.final,
        accentCrimson: Math.random() > 0.45,
      };

      setEvents((prev) => [...prev.slice(isGallery ? -2 : -1), newEvent]);
    };

    const initialTimer = setTimeout(spawnRandomArtifact, 900);
    const interval = setInterval(spawnRandomArtifact, isGallery ? 5200 : 8500);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isGallery]);

  const getPositionStyle = (corner: EphemeralEvent["corner"]): React.CSSProperties => {
    switch (corner) {
      case "top-left":
        return { top: "14%", left: "3%" };
      case "top-right":
        return { top: "15%", right: "3%" };
      case "bottom-left":
        return { bottom: "14%", left: "4%" };
      case "bottom-right":
        return { bottom: "14%", right: "4%" };
      case "mid-left":
        return { top: "48%", left: "2.5%" };
      case "mid-right":
        return { top: "52%", right: "2.5%" };
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {/* 1. PÉTALES DE ROSE EN ROUGE BORDEAUX ROYAL & ENCRE NOIRE */}
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -30, x: 0, opacity: 0, rotate: p.rotate }}
          animate={{
            y: ["0vh", "104vh"],
            x: [0, p.sway, -p.sway * 0.5, p.sway * 0.3],
            opacity: [0, isGallery ? 0.55 : 0.38, isGallery ? 0.5 : 0.32, 0],
            rotate: [p.rotate, p.rotate + 240],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: "-20px",
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.25}px`,
          }}
        >
          <svg
            viewBox="0 0 24 30"
            className="helmet-ornament-svg"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            <path
              d="M 12,2 C 19,5 23,14 19,23 C 15,29 7,28 4,21 C 1,13 5,4 12,2 Z"
              fill={p.isCrimson ? "#6B0F1A" : "#171717"}
              stroke="#000000"
              strokeWidth="0.8"
            />
            <path
              d="M 11,6 C 13,13 12,19 9,24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.6"
              opacity="0.45"
            />
          </svg>
        </motion.div>
      ))}

      {/* 2. APPARITIONS ALÉATOIRES DANS LES MARGES (ÉPINES, NOTES MANUSCRITES, RINCEAUX) */}
      <AnimatePresence>
        {events.map((ev) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              position: "absolute",
              ...getPositionStyle(ev.corner),
              maxWidth: "240px",
            }}
          >
            {/* A. RAMEAU D'ÉPINES ACÉRÉES (Inspiré de image_0feb06.png) */}
            {ev.type === "thorn-branch" && (
              <svg
                viewBox="0 0 220 150"
                className="helmet-ornament-svg"
                style={{
                  width: isGallery ? "185px" : "145px",
                  height: isGallery ? "125px" : "98px",
                  opacity: isGallery ? 0.28 : 0.17,
                  transform: ev.corner.includes("right") ? "scaleX(-1)" : "none",
                }}
              >
                <motion.path
                  d="M 12,136 L 38,128 L 62,118 L 88,104 L 114,84 L 138,56 L 164,34 L 194,14"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Pics agressifs le long de la branche */}
                <motion.g
                  fill={ev.accentCrimson ? "#6B0F1A" : "#000000"}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                >
                  <polygon points="36,128 31,106 44,124" />
                  <polygon points="52,123 62,140 46,126" />
                  <polygon points="78,109 73,86 86,104" />
                  <polygon points="96,98 112,114 90,103" />
                  <polygon points="112,85 95,72 118,79" />
                  <polygon points="128,68 144,82 122,74" />
                  <polygon points="142,52 134,32 149,46" />
                  <polygon points="162,36 182,46 156,42" />
                  <polygon points="182,22 175,6 190,17" />
                </motion.g>
              </svg>
            )}

            {/* B. NOTE MANUSCRITE D'ATELIER RATURÉE QUI S'ÉCRIT ET S'EFFACE (image_0fea2b & 0fea24) */}
            {ev.type === "manuscript-note" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  opacity: isGallery ? 0.55 : 0.36,
                  transform: "rotate(-2.5deg)",
                }}
              >
                <div style={{ position: "relative", display: "inline-block" }}>
                  <motion.span
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="font-cancellaresca"
                    style={{
                      fontSize: isGallery ? "22px" : "19px",
                      color: "#262626",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ev.crossedText}
                  </motion.span>
                  {/* Trait de rature nerveux à la plume */}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.55, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      left: "-4px",
                      right: "-6px",
                      top: "52%",
                      height: "2px",
                      backgroundColor: ev.accentCrimson ? "#6B0F1A" : "#000000",
                      transformOrigin: "left center",
                      transform: "rotate(-1.5deg)",
                      display: "block",
                    }}
                  />
                </div>

                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 1.85 }}
                  style={{
                    fontSize: "9.5px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: ev.accentCrimson ? "#6B0F1A" : "#404040",
                    whiteSpace: "nowrap",
                  }}
                >
                  — {ev.text}
                </motion.span>
              </div>
            )}

            {/* C. RINCEAU FLORAL BAROQUE GRAVÉ (Inspiré de image_103c9d.png) */}
            {ev.type === "baroque-vine" && (
              <svg
                viewBox="0 0 240 130"
                className="helmet-ornament-svg"
                style={{
                  width: isGallery ? "190px" : "150px",
                  height: isGallery ? "105px" : "84px",
                  opacity: isGallery ? 0.26 : 0.16,
                }}
              >
                <motion.path
                  d="M 14,98 C 48,108 86,88 118,52 C 148,18 196,16 218,48 C 232,70 212,104 184,96 C 162,90 158,64 178,56"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.path
                  d="M 42,96 C 28,74 36,42 64,38 C 88,34 102,58 84,74 C 70,86 52,74 60,58"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.4, delay: 0.4, ease: "easeOut" }}
                />
                {/* Fleurons & Calices en Rouge Bordeaux */}
                <motion.path
                  d="M 60,58 L 52,46 L 66,48 L 72,38 L 76,52 Z M 178,56 L 168,46 L 182,44 L 188,34 L 192,50 Z"
                  fill={ev.accentCrimson ? "#6B0F1A" : "#000000"}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                />
              </svg>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}