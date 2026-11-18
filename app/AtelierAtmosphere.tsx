"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AtmosphereProps {
  mode?: "canopy-and-roses" | "petals-only";
  intensity?: "subtle" | "gallery";
  inverted?: boolean;
}

interface FallingRoseInstance {
  id: number;
  archetype: 0 | 1 | 2 | 3;
  startX: number;
  startY: number;
  driftX: number;
  swayAmplitude: number;
  baseAngle: number;
  swayAngle: number;
  scale: number;
  duration: number;
  flipX: boolean;
}

function BotanicalRoseA({ inverted = true }: { inverted?: boolean }) {
  const stroke = inverted ? "#ffffff" : "#141414";
  const fill = inverted ? "rgba(255, 255, 255, 0.08)" : "#ffffff";

  return (
    <svg
      viewBox="0 0 220 290"
      className="helmet-ornament-svg"
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "none",
        maxHeight: "none",
        overflow: "visible",
        display: "block",
        filter: inverted ? "drop-shadow(0 2px 8px rgba(0,0,0,0.7))" : "none",
      }}
    >
      <g fill={fill} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M 88,104 C 102,126 112,154 122,188 C 132,222 142,252 150,278" fill="none" strokeWidth="2.2" />
        <path d="M 92,106 C 105,128 115,156 125,188 C 135,220 144,250 153,276" fill="none" strokeWidth="1.1" />
        <path d="M 103,124 L 95,129 L 106,130 Z" fill={stroke} />
        <path d="M 118,168 L 127,164 L 120,174 Z" fill={stroke} />
        <path d="M 124,196 L 115,200 L 126,202 Z" fill={stroke} />
        <path d="M 134,222 L 143,219 L 136,228 Z" fill={stroke} />
        <path d="M 142,248 L 152,242 L 145,254 Z" fill={stroke} />
        <path d="M 112,132 C 128,112 144,92 162,72" fill="none" strokeWidth="1.5" />
        <path d="M 148,86 C 142,76 152,66 154,54 C 156,42 164,34 174,26 C 184,18 194,16 202,12 C 204,20 210,24 208,34 C 212,42 208,52 204,60 C 198,70 186,76 174,80 C 164,84 156,90 148,86 Z" strokeWidth="1.4" />
        <path d="M 150,84 C 166,68 182,48 196,28 M 166,68 L 182,66 M 176,54 L 194,50 M 168,64 L 164,48" fill="none" strokeWidth="1" />
        <path d="M 138,108 C 154,104 170,112 178,128 C 184,142 182,160 174,172 C 166,162 154,166 144,154 C 134,144 132,122 138,108 Z" strokeWidth="1.35" />
        <path d="M 140,110 C 154,126 160,146 164,166 M 152,126 L 168,132 M 156,142 L 172,148" fill="none" strokeWidth="0.95" />
        <path d="M 110,144 C 92,138 74,140 62,148 C 70,158 84,164 102,158 Z" strokeWidth="1.3" />
        <path d="M 114,146 C 132,142 148,148 154,162 C 146,172 130,170 116,158 Z" strokeWidth="1.3" />
        <path d="M 106,150 C 90,158 76,174 68,194 C 66,204 72,210 82,206 C 96,202 110,192 114,174 C 116,164 112,154 106,150 Z" strokeWidth="1.45" />
        <path d="M 106,152 C 94,170 84,188 74,202 M 94,170 L 82,174 M 88,182 L 98,190" fill="none" strokeWidth="1" />
        <path d="M 60,112 C 54,124 48,136 46,144 C 54,134 62,124 68,114 Z" strokeWidth="1.3" />
        <path d="M 94,72 C 104,66 112,62 118,56 C 110,64 102,70 96,76 Z" strokeWidth="1.3" />
        <path d="M 36,56 C 34,38 52,26 70,28 C 78,30 80,38 76,44 C 60,40 44,46 36,56 Z" strokeWidth="1.5" />
        <path d="M 36,56 C 24,62 22,82 26,96 C 20,106 20,114 32,116 C 44,118 52,124 64,118 C 48,108 38,84 36,56 Z" strokeWidth="1.55" />
        <path d="M 74,38 C 88,36 98,52 102,68 C 108,78 106,92 96,102 C 88,112 78,118 64,118 C 78,106 88,88 86,66 C 84,52 80,44 74,38 Z" strokeWidth="1.55" />
        <path d="M 36,64 C 34,46 54,38 72,44 C 86,50 90,72 82,92 C 74,108 54,114 42,102 C 32,92 34,76 36,64 Z" strokeWidth="1.5" />
        <path d="M 44,68 C 44,54 58,46 70,52 C 80,58 82,76 74,88 C 66,98 50,98 44,86 Z" strokeWidth="1.45" />
        <path d="M 48,70 C 50,58 62,54 70,60 C 76,66 74,78 66,84 C 58,88 48,82 48,70 Z" strokeWidth="1.4" />
        <path d="M 53,68 C 55,61 63,60 67,65 C 70,70 65,76 59,75 C 54,74 53,68 58,66 C 61,65 64,68 61,71" fill="none" strokeWidth="1.5" />
        <path d="M 55,66 C 59,63 64,65 65,70 L 58,72 Z" fill={stroke} />
        <g fill="none" stroke={stroke} strokeWidth="0.85" opacity="0.8">
          <path d="M 46,38 L 49,35 M 52,36 L 55,33 M 58,35 L 61,32 M 64,36 L 66,33" />
          <path d="M 28,84 L 32,82 M 27,90 L 32,88 M 28,96 L 33,94 M 30,102 L 35,100" />
          <path d="M 46,92 L 52,96 M 50,95 L 56,99 M 55,97 L 62,100 M 60,98 L 67,99" />
          <path d="M 76,58 L 81,56 M 78,64 L 83,62 M 79,70 L 84,68 M 78,76 L 83,75" />
          <path d="M 88,82 L 94,80 M 86,88 L 92,86 M 83,94 L 89,92" />
          <path d="M 48,54 L 53,51 M 53,52 L 58,49 M 58,51 L 63,49" />
        </g>
      </g>
    </svg>
  );
}

function BotanicalRoseB({ inverted = true }: { inverted?: boolean }) {
  const stroke = inverted ? "#ffffff" : "#141414";
  const fill = inverted ? "rgba(255, 255, 255, 0.08)" : "#ffffff";

  return (
    <svg
      viewBox="0 0 180 280"
      className="helmet-ornament-svg"
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "none",
        maxHeight: "none",
        overflow: "visible",
        display: "block",
        filter: inverted ? "drop-shadow(0 2px 8px rgba(0,0,0,0.7))" : "none",
      }}
    >
      <g fill={fill} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M 82,78 C 102,102 110,136 108,176 C 106,214 112,244 126,268" fill="none" strokeWidth="2.1" />
        <path d="M 94,96 L 86,90 L 97,101" fill="none" strokeWidth="1.3" />
        <path d="M 107,212 L 100,202 L 107,218" fill="none" strokeWidth="1.3" />
        <path d="M 106,138 C 110,126 114,116 118,108" fill="none" strokeWidth="1.4" />
        <path d="M 114,118 C 106,104 110,90 124,78 C 128,92 128,108 114,118 Z" strokeWidth="1.4" />
        <path d="M 114,116 L 122,84 M 116,106 L 111,98 M 118,98 L 124,94 M 116,108 L 124,104" fill="none" strokeWidth="0.9" />
        <path d="M 108,158 C 96,144 84,132 72,126 C 80,140 90,152 108,158 Z" strokeWidth="1.4" />
        <path d="M 106,156 L 76,129 M 94,146 L 86,146 M 88,140 L 80,140" fill="none" strokeWidth="0.9" />
        <path d="M 107,198 L 120,180" fill="none" strokeWidth="1.4" />
        <path d="M 118,182 C 114,166 120,152 134,144 C 136,160 132,174 118,182 Z" strokeWidth="1.4" />
        <path d="M 118,182 C 130,174 144,174 156,182 C 142,188 128,188 118,182 Z" strokeWidth="1.4" />
        <path d="M 119,180 L 131,149 M 123,168 L 118,160 M 126,162 L 132,158 M 120,182 L 150,181" fill="none" strokeWidth="0.9" />
        <path d="M 74,70 C 62,74 54,80 48,82 C 58,74 66,68 74,64 Z" fill={stroke} />
        <path d="M 82,72 C 92,68 102,66 110,68 C 98,64 88,64 80,68 Z" fill={stroke} />
        <path d="M 72,66 L 84,78 L 88,68 Z" fill={stroke} />
        <path d="M 38,52 C 34,42 36,30 44,26 C 48,36 54,48 60,60 C 48,60 36,58 38,52 Z" strokeWidth="1.5" />
        <path d="M 42,28 C 46,16 58,10 74,10 C 80,10 82,16 78,24 C 66,22 52,24 42,28 Z" strokeWidth="1.5" />
        <path d="M 76,14 C 86,12 94,18 94,32 C 96,44 92,56 84,66 C 76,54 76,34 76,14 Z" strokeWidth="1.5" />
        <path d="M 42,32 C 54,30 68,32 76,26 C 82,38 80,54 72,66 C 60,66 48,56 42,32 Z" strokeWidth="1.55" />
        <path d="M 48,26 C 52,18 64,16 72,22 C 66,28 54,28 48,26 Z" strokeWidth="1.4" />
        <path d="M 54,24 C 58,19 66,19 69,24 M 58,25 C 61,22 65,22 66,25" fill="none" strokeWidth="1.2" />
        <path d="M 48,35 L 52,40 M 53,35 L 57,41 M 58,35 L 61,40 M 63,34 L 66,39 M 68,33 L 70,38 M 62,56 L 66,63 M 66,54 L 70,62" fill="none" strokeWidth="0.85" opacity="0.75" />
      </g>
    </svg>
  );
}

function BotanicalRoseC({ inverted = true }: { inverted?: boolean }) {
  const stroke = inverted ? "#ffffff" : "#141414";
  const fill = inverted ? "rgba(255, 255, 255, 0.08)" : "#ffffff";

  return (
    <svg
      viewBox="0 0 260 190"
      className="helmet-ornament-svg"
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "none",
        maxHeight: "none",
        overflow: "visible",
        display: "block",
        filter: inverted ? "drop-shadow(0 2px 8px rgba(0,0,0,0.7))" : "none",
      }}
    >
      <g fill={fill} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M 96,52 C 138,48 178,56 208,78 C 228,94 242,116 252,138 L 244,142 C 234,120 220,98 200,84 C 172,64 134,56 96,58 Z" strokeWidth="1.8" />
        <path d="M 164,44 C 154,68 160,96 184,104 C 204,110 220,98 224,88" fill="none" strokeWidth="2.4" />
        <path d="M 208,92 C 212,126 196,158 162,166 C 134,172 108,168 88,158" fill="none" strokeWidth="2.5" />
        <path d="M 142,50 L 140,40 L 148,50 Z" fill={stroke} />
        <path d="M 168,100 L 162,108 L 173,103 Z" fill={stroke} />
        <path d="M 226,78 L 232,68 L 231,82 Z" fill={stroke} />
        <path d="M 180,162 L 184,172 L 174,164 Z" fill={stroke} />
        <path d="M 138,168 L 134,178 L 144,169 Z" fill={stroke} />
        <path d="M 88,58 C 78,42 80,24 90,12 C 104,22 112,38 106,56 C 102,62 94,62 88,58 Z" strokeWidth="1.6" />
        <path d="M 90,16 L 98,56 M 92,26 L 84,32 M 94,36 L 84,42 M 96,46 L 86,52 M 93,26 L 104,30 M 95,36 L 106,40" fill="none" strokeWidth="0.9" />
        <path d="M 118,68 C 132,62 150,72 162,90 C 144,96 124,96 114,84 C 110,78 112,72 118,68 Z" strokeWidth="1.6" />
        <path d="M 116,76 L 158,89 M 126,79 L 134,70 M 136,82 L 144,74 M 126,80 L 130,90 M 136,83 L 140,92" fill="none" strokeWidth="0.9" />
        <path d="M 182,58 C 176,46 184,32 200,34 C 212,36 220,48 214,62 C 204,54 192,54 182,58 Z" strokeWidth="1.6" />
        <path d="M 186,54 C 196,44 206,42 214,56 M 194,46 L 190,38 M 202,46 L 200,36" fill="none" strokeWidth="0.9" />
        <path d="M 52,66 C 42,50 48,36 68,36 C 84,36 96,48 94,68 C 96,84 88,96 74,94 C 60,92 56,78 52,66 Z" strokeWidth="1.65" />
        <path d="M 56,68 C 38,66 20,76 12,68 C 6,82 10,104 22,114 C 18,128 28,142 46,138 C 60,136 66,118 64,98 C 62,82 60,72 56,68 Z" strokeWidth="1.65" />
        <path d="M 64,94 C 72,112 86,116 98,104 C 92,122 78,134 62,130 C 58,120 60,106 64,94 Z" strokeWidth="1.6" />
        <path d="M 24,94 C 32,82 48,82 54,96 C 58,108 50,124 36,122 C 24,120 20,106 24,94 Z" strokeWidth="1.4" />
        <path d="M 32,102 C 36,94 46,96 48,104 C 48,112 40,116 34,112 C 30,108 32,102 38,102" fill="none" strokeWidth="1.3" />
        <g fill="none" stroke={stroke} strokeWidth="0.85" opacity="0.8">
          <path d="M 58,46 C 66,44 74,48 78,56 M 68,78 C 76,82 84,82 88,76" />
          <path d="M 66,108 L 74,116 M 70,106 L 78,114 M 74,104 L 82,111" />
          <path d="M 18,82 L 26,80 M 16,88 L 24,86 M 16,94 L 23,92" />
        </g>
      </g>
    </svg>
  );
}

function BotanicalRoseD({ inverted = true }: { inverted?: boolean }) {
  const stroke = inverted ? "#ffffff" : "#1c1c1c";
  const fill = inverted ? "rgba(255, 255, 255, 0.08)" : "#ffffff";

  return (
    <svg
      viewBox="0 0 210 310"
      className="helmet-ornament-svg"
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "none",
        maxHeight: "none",
        overflow: "visible",
        display: "block",
        filter: inverted ? "drop-shadow(0 2px 8px rgba(0,0,0,0.7))" : "none",
      }}
    >
      <g fill={fill} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M 102,58 C 84,72 86,98 106,116 C 126,134 128,168 112,196 C 102,214 92,226 84,234" fill="none" strokeWidth="2" />
        <path d="M 92,98 C 94,116 84,132 72,128 C 64,126 66,116 74,116" fill="none" strokeWidth="1.5" />
        <path d="M 118,128 C 126,108 148,108 152,128 C 154,142 142,152 134,144 C 128,138 132,128 138,128" fill="none" strokeWidth="1.5" />
        <path d="M 120,162 C 106,146 84,152 84,170 C 84,182 98,186 102,176" fill="none" strokeWidth="1.5" />
        <path d="M 108,124 L 102,130 L 112,130 Z" fill={stroke} />
        <path d="M 124,164 L 132,166 L 123,172 Z" fill={stroke} />
        <path d="M 108,202 L 100,204 L 105,210 Z" fill={stroke} />
        <path d="M 88,92 C 74,90 62,82 56,72 C 70,74 82,80 88,92 Z" strokeWidth="1.3" />
        <path d="M 84,166 C 72,162 60,166 52,180 C 66,180 78,176 84,166 Z" strokeWidth="1.3" />
        <path d="M 148,138 C 156,144 158,156 156,168 C 146,162 142,150 148,138 Z" strokeWidth="1.3" />
        <path d="M 104,48 C 110,36 126,32 146,36 C 150,42 152,50 148,56 C 132,66 114,64 104,48 Z" strokeWidth="1.5" />
        <path d="M 106,46 C 120,44 134,46 146,38 M 138,36 L 142,50" fill="none" strokeWidth="1.1" />
        <path d="M 104,48 C 96,42 88,40 82,42 C 90,46 96,50 102,54 Z" strokeWidth="1.3" />
        <path d="M 104,54 C 98,60 94,68 94,74 C 102,68 108,62 108,56 Z" strokeWidth="1.3" />
        <path d="M 68,248 C 48,248 34,262 26,276 C 46,282 66,278 78,266 Z" strokeWidth="1.4" />
        <path d="M 70,256 L 32,273 M 54,264 L 46,256 M 50,266 L 56,274" fill="none" strokeWidth="0.9" />
        <path d="M 126,248 C 146,252 162,248 176,238 C 168,258 150,270 124,266 Z" strokeWidth="1.4" />
        <path d="M 126,258 L 168,243 M 144,252 L 138,246 M 148,251 L 152,260" fill="none" strokeWidth="0.9" />
        <path d="M 66,244 L 78,216 L 102,222 L 122,216 L 134,242 L 120,274 L 96,276 L 72,272 Z" strokeWidth="1.55" />
        <path d="M 74,248 L 84,226 L 114,226 L 126,248 L 112,268 L 82,268 Z" strokeWidth="1.45" />
        <path d="M 84,246 L 96,230 L 114,242 L 106,260 L 88,258 Z" strokeWidth="1.4" />
        <path d="M 92,246 C 94,238 104,238 106,246 C 106,252 96,254 92,246 Z" strokeWidth="1.35" />
        <path d="M 78,262 L 82,267 M 84,262 L 87,267 M 106,262 L 110,267 M 112,260 L 116,266" fill="none" strokeWidth="0.85" opacity="0.75" />
      </g>
    </svg>
  );
}

/* ============================================================================
   MOTEUR DE SPAWN PAR VAGUES DÉCALÉES ALÉATOIRES (1 À 4 ROSES MAX PAR FRAME)
   ============================================================================ */
export default function AtelierAtmosphere({
  mode = "canopy-and-roses",
  inverted = true,
}: AtmosphereProps) {
  const [roses, setRoses] = useState<FallingRoseInstance[]>([]);
  const nextIdRef = useRef(1);
  const lastZoneRef = useRef<number>(-1);

  useEffect(() => {
    let isMounted = true;
    const timeouts: NodeJS.Timeout[] = [];

    const ZONES = [
      { min: 3, max: 18 },
      { min: 20, max: 36 },
      { min: 39, max: 58 },
      { min: 61, max: 77 },
      { min: 80, max: 94 },
    ];

    const createOneRose = (forcedZoneIdx?: number) => {
      if (!isMounted) return;

      let zoneIdx =
        forcedZoneIdx !== undefined
          ? forcedZoneIdx
          : Math.floor(Math.random() * ZONES.length);

      if (zoneIdx === lastZoneRef.current) {
        zoneIdx = (zoneIdx + 1 + Math.floor(Math.random() * (ZONES.length - 1))) % ZONES.length;
      }
      lastZoneRef.current = zoneIdx;

      const zone = ZONES[zoneIdx];
      const startX = zone.min + Math.random() * (zone.max - zone.min);
      const startY = -14 + Math.random() * 22;

      const direction = startX > 80 ? -1 : startX < 20 ? 1 : Math.random() > 0.5 ? 1 : -1;
      const driftX = direction * (40 + Math.random() * 80);
      const swayAmplitude = (Math.random() > 0.5 ? 1 : -1) * (16 + Math.random() * 24);

      const baseAngle = (Math.random() - 0.5) * 36;
      const swayAngle = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 20);

      const duration = 12 + Math.random() * 5.5;
      const archetype = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3;
      const id = nextIdRef.current++;

      const newRose: FallingRoseInstance = {
        id,
        archetype,
        startX,
        startY,
        driftX,
        swayAmplitude,
        baseAngle,
        swayAngle,
        scale: 0.74 + Math.random() * 0.34,
        duration,
        flipX: Math.random() > 0.5,
      };

      /* Plafond strict à 4 fleurs maximum simultanément sur l'écran */
      setRoses((prev) => {
        if (prev.length >= 4) {
          return [...prev.slice(-(3)), newRose];
        }
        return [...prev, newRose];
      });

      const removeTimer = setTimeout(() => {
        if (!isMounted) return;
        setRoses((prev) => prev.filter((r) => r.id !== id));
      }, duration * 1000);
      timeouts.push(removeTimer);
    };

    /* Planifie des vagues organiques : parfois 1 seule, parfois 2 ou 3 décalées de 350ms à 1400ms */
    const scheduleNextWave = () => {
      if (!isMounted) return;

      const r = Math.random();
      const waveCount = r < 0.25 ? 1 : r < 0.7 ? 2 : 3;

      /* Mélange les zones pour que les roses d'une même vague apparaissent dans des coins opposés */
      const availableZones = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);

      let cumulativeStagger = 0;
      for (let i = 0; i < waveCount; i++) {
        if (i > 0) {
          cumulativeStagger += 350 + Math.random() * 1150;
        }
        const z = availableZones[i % availableZones.length];
        const t = setTimeout(() => {
          createOneRose(z);
        }, cumulativeStagger);
        timeouts.push(t);
      }

      const nextWaveDelay = 3400 + Math.random() * 3400;
      const nextTimer = setTimeout(scheduleNextWave, nextWaveDelay);
      timeouts.push(nextTimer);
    };

    /* Lancement initial dès l'arrivée sur la page */
    createOneRose(0);
    const initStagger = setTimeout(() => createOneRose(3), 520);
    const waveStarter = setTimeout(scheduleNextWave, 2800);
    timeouts.push(initStagger, waveStarter);

    return () => {
      isMounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, [mode]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 8,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <AnimatePresence>
        {roses.map((rose) => (
          <motion.div
            key={rose.id}
            initial={{
              top: `${rose.startY}vh`,
              left: `${rose.startX}vw`,
              x: 0,
              opacity: 0,
              rotate: rose.baseAngle,
            }}
            animate={{
              top: "108vh",
              x: [
                0,
                rose.driftX * 0.35 + rose.swayAmplitude,
                rose.driftX * 0.7 - rose.swayAmplitude * 0.6,
                rose.driftX,
              ],
              opacity: [0, inverted ? 0.86 : 0.78, inverted ? 0.8 : 0.72, 0],
              rotate: [
                rose.baseAngle,
                rose.baseAngle + rose.swayAngle * 0.6,
                rose.baseAngle - rose.swayAngle * 0.4,
                rose.baseAngle + rose.swayAngle,
              ],
            }}
            transition={{
              duration: rose.duration,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: `${102 * rose.scale}px`,
              height: `${144 * rose.scale}px`,
              transform: rose.flipX ? "scaleX(-1)" : undefined,
              willChange: "transform, top, opacity",
            }}
          >
            {rose.archetype === 0 && <BotanicalRoseA inverted={inverted} />}
            {rose.archetype === 1 && <BotanicalRoseB inverted={inverted} />}
            {rose.archetype === 2 && <BotanicalRoseC inverted={inverted} />}
            {rose.archetype === 3 && <BotanicalRoseD inverted={inverted} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}