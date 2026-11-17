"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AtmosphereProps {
  /**
   * "canopy-and-roses" : Roncier tombant complet (image_0f6ea8) + Grosses têtes de roses entières qui tombent aléatoirement (Menu & Helmet Gallery)
   * "petals-only"      : Sans le roncier du haut, uniquement des pétales dessinés au trait fin qui tombent aléatoirement (Shop & Service)
   */
  mode?: "canopy-and-roses" | "petals-only";
}

interface FallingElement {
  id: number;
  startX: number;
  startY: number;
  driftX1: number;
  driftX2: number;
  driftX3: number;
  duration: number;
  scale: number;
  startRotate: number;
  endRotate: number;
  variant: 0 | 1 | 2 | 3;
}

/* ============================================================================
   1. DESSINS AU TRAIT FIN DE TÊTES DE ROSES ENTIÈRES (Style image_0f6ea8.jpg)
   4 variantes dessinées au crayon/encre fine avec pétales ouverts et sépales
   ============================================================================ */
function SketchRoseHead({
  variant = 0,
  scale = 1,
}: {
  variant?: 0 | 1 | 2 | 3;
  scale?: number;
}) {
  return (
    <svg
      viewBox="-32 -32 64 64"
      className="helmet-ornament-svg"
      style={{
        width: `${52 * scale}px`,
        height: `${52 * scale}px`,
        overflow: "visible",
        display: "block",
      }}
    >
      <g
        fill="#ffffff"
        stroke="#1c1c1c"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {variant === 0 && (
          <>
            {/* Pétales extérieurs souples et froissés (comme les grosses roses du roncier) */}
            <path
              d="M -22,-6 C -26,-18 -12,-27 1,-25 C 14,-27 26,-17 24,-3 C 26,11 15,24 1,23 C -14,25 -25,13 -22,-6 Z"
              strokeWidth="1.15"
            />
            <path
              d="M -18,-10 C -12,-21 6,-22 16,-12 C 22,-4 19,12 8,17 C -4,21 -18,15 -19,1"
              fill="none"
              strokeWidth="0.95"
            />
            {/* Pétales intermédiaires en coupe */}
            <path
              d="M -14,-2 C -15,-12 -4,-17 6,-14 C 15,-11 16,2 9,9 C 1,15 -11,12 -14,2 Z"
              strokeWidth="1.05"
            />
            <path
              d="M -10,-6 C -4,-13 7,-11 11,-3 M -11,4 C -5,11 6,10 10,2"
              fill="none"
              strokeWidth="0.8"
            />
            {/* Cœur spiralé fin */}
            <path
              d="M -7,-1 C -7,-7 1,-10 6,-5 C 10,0 6,7 0,7 C -5,7 -8,2 -4,-3 C -1,-5 3,-3 2,1 C 1,3 -2,2 -1,0"
              fill="none"
              strokeWidth="1"
            />
            {/* Hachures fines de crayon au creux des pétales */}
            <path
              d="M -16,-4 L -12,-2 M -15,-1 L -11,1 M 12,-8 L 16,-6 M 13,-4 L 17,-2 M -4,14 L -2,18 M 1,14 L 3,18"
              fill="none"
              strokeWidth="0.65"
              opacity="0.7"
            />
            {/* Petites feuilles/sépales attachés sous la rose */}
            <path
              d="M -8,21 C -14,26 -18,29 -12,24 M 7,21 C 13,25 16,28 11,22 M 0,23 L -1,29"
              fill="none"
              strokeWidth="0.95"
            />
          </>
        )}

        {variant === 1 && (
          <>
            {/* Rose vue de trois-quarts tombante (comme celles au bout des lianes) */}
            <path
              d="M -24,-2 C -22,-16 -8,-23 6,-21 C 20,-19 26,-6 21,7 C 17,19 3,24 -10,20 C -21,17 -26,7 -24,-2 Z"
              strokeWidth="1.15"
            />
            <path
              d="M -19,-4 C -15,-14 -1,-17 11,-12 C 19,-7 18,6 10,12 C 0,18 -14,14 -18,3"
              fill="none"
              strokeWidth="0.95"
            />
            <path
              d="M -11,0 C -10,-9 0,-12 8,-7 C 13,-2 11,7 3,10 C -5,12 -12,7 -11,0 Z"
              strokeWidth="1"
            />
            <path
              d="M -5,0 C -4,-5 3,-6 5,-1 C 7,3 2,6 -2,5 C -5,4 -5,-1 -1,-2"
              fill="none"
              strokeWidth="0.95"
            />
            {/* Calice et bout de tige cassée en haut */}
            <path
              d="M 2,-21 L 4,-29 M 2,-21 L -3,-26 M 3,-21 L 9,-25"
              fill="none"
              strokeWidth="1"
            />
          </>
        )}

        {variant === 2 && (
          <>
            {/* Rose épanouie large à multiples plis fins */}
            <path
              d="M -25,0 C -26,-14 -14,-25 0,-24 C 15,-25 26,-13 25,1 C 24,15 12,25 -2,24 C -16,24 -25,13 -25,0 Z"
              strokeWidth="1.1"
            />
            <path
              d="M -20,-8 C -10,-19 10,-19 19,-7 M -21,5 C -12,19 10,19 20,6 M -14,-14 C -2,-22 14,-14 16,0"
              fill="none"
              strokeWidth="0.9"
            />
            <path
              d="M -13,1 C -13,-9 -3,-15 7,-11 C 14,-8 15,3 8,9 C 1,14 -11,11 -13,1 Z"
              strokeWidth="1.05"
            />
            <path
              d="M -6,0 C -6,-6 2,-8 6,-3 C 8,1 4,6 -1,6 C -5,5 -6,1 -2,-2 C 0,-3 3,-1 1,1"
              fill="none"
              strokeWidth="0.95"
            />
            <path
              d="M -18,12 L -23,18 L -14,16 M 17,12 L 22,18 L 13,16"
              fill="none"
              strokeWidth="0.9"
            />
          </>
        )}

        {variant === 3 && (
          <>
            {/* Bouton de rose semi-ouvert avec deux petites feuilles */}
            <path
              d="M -16,2 C -18,-11 -8,-21 2,-20 C 12,-20 19,-9 17,3 C 15,15 4,21 -6,19 C -14,17 -16,9 -16,2 Z"
              strokeWidth="1.15"
            />
            <path
              d="M -11,0 C -11,-9 -2,-14 6,-10 C 12,-6 11,5 4,10 C -3,14 -11,9 -11,0 Z"
              strokeWidth="1"
            />
            <path
              d="M -5,-1 C -4,-6 3,-7 5,-2 C 6,2 2,6 -2,4 C -4,3 -4,-1 0,-2"
              fill="none"
              strokeWidth="0.95"
            />
            {/* Deux petites feuilles fines sur le côté du bouton */}
            <path
              d="M -15,-6 C -23,-10 -28,-7 -22,0 C -18,3 -16,0 -15,-6 Z"
              strokeWidth="0.95"
            />
            <path d="M -24,-6 L -16,-3" fill="none" strokeWidth="0.7" />
          </>
        )}
      </g>
    </svg>
  );
}

/* ============================================================================
   2. DESSINS AU TRAIT FIN DE PÉTALES DE ROSES ISOLÉS (Pour Shop & Service)
   Même coup de crayon noir et blanc que les roses de image_0f6ea8.jpg
   ============================================================================ */
function SketchRosePetal({
  variant = 0,
  scale = 1,
}: {
  variant?: 0 | 1 | 2 | 3;
  scale?: number;
}) {
  return (
    <svg
      viewBox="-20 -20 40 40"
      className="helmet-ornament-svg"
      style={{
        width: `${28 * scale}px`,
        height: `${28 * scale}px`,
        overflow: "visible",
        display: "block",
      }}
    >
      <g
        fill="#ffffff"
        stroke="#1c1c1c"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {variant === 0 && (
          <>
            <path
              d="M 0,-14 C 10,-15 16,-5 12,6 C 9,14 2,16 -4,13 C -12,9 -15,-2 -9,-10 C -6,-13 -3,-14 0,-14 Z"
              strokeWidth="1.1"
            />
            {/* Pli d'ourlet du pétale et nervures fines */}
            <path
              d="M -7,-10 C -1,-7 6,-8 11,-3 M 0,13 C 1,4 -1,-3 -4,-8 M 3,10 C 5,4 5,-1 3,-5"
              fill="none"
              strokeWidth="0.7"
              opacity="0.75"
            />
          </>
        )}
        {variant === 1 && (
          <>
            <path
              d="M -12,-4 C -8,-14 5,-16 13,-8 C 17,-2 13,9 4,13 C -5,16 -15,7 -12,-4 Z"
              strokeWidth="1.1"
            />
            <path
              d="M -9,2 C -2,0 5,2 10,7 M -4,-10 C -1,-3 2,4 2,11"
              fill="none"
              strokeWidth="0.7"
              opacity="0.75"
            />
          </>
        )}
        {variant === 2 && (
          <>
            <path
              d="M -2,-15 C 8,-13 15,-3 10,8 C 6,15 -4,15 -9,9 C -14,2 -11,-12 -2,-15 Z"
              strokeWidth="1.1"
            />
            <path
              d="M -6,-11 C 0,-8 6,-9 9,-4 M -2,12 C -1,4 0,-3 -2,-9"
              fill="none"
              strokeWidth="0.7"
              opacity="0.75"
            />
          </>
        )}
        {variant === 3 && (
          <>
            <path
              d="M -10,-8 C -2,-16 11,-12 14,-1 C 16,8 7,15 -2,13 C -11,11 -15,-1 -10,-8 Z"
              strokeWidth="1.1"
            />
            <path
              d="M -8,-6 C -2,-3 6,-4 11,1 M -1,12 C 1,5 0,-2 -3,-7"
              fill="none"
              strokeWidth="0.7"
              opacity="0.75"
            />
          </>
        )}
      </g>
    </svg>
  );
}

/* ============================================================================
   3. GRANDE CANOPÉE DE ROSIERS GRIMPANTS & LIANES TOMBANTES (image_0f6ea8.jpg)
   Arche centrale + grappes de roses + 4 longues tiges pendantes asymétriques
   ============================================================================ */
function HangingRoseCanopy() {
  /* Positions des roses dans la guirlande supérieure et le long des lianes tombantes */
  const canopyRoses: {
    x: number;
    y: number;
    s: number;
    v: 0 | 1 | 2 | 3;
  }[] = [
    /* Grappe haute gauche */
    { x: 145, y: 18, s: 1.05, v: 0 },
    { x: 205, y: 42, s: 0.82, v: 2 },
    { x: 270, y: 16, s: 0.95, v: 1 },
    { x: 315, y: 46, s: 0.78, v: 3 },
    { x: 215, y: 112, s: 0.75, v: 1 },
    { x: 262, y: 118, s: 0.92, v: 0 },
    { x: 242, y: 182, s: 0.68, v: 3 },
    { x: 282, y: 214, s: 0.58, v: 1 },
    { x: 318, y: 228, s: 0.62, v: 2 },

    /* Liane tombante centre-gauche */
    { x: 392, y: 86, s: 1.02, v: 0 },
    { x: 368, y: 138, s: 0.76, v: 2 },
    { x: 358, y: 196, s: 0.74, v: 1 },
    { x: 458, y: 94, s: 0.98, v: 2 },
    { x: 448, y: 152, s: 0.78, v: 0 },
    { x: 476, y: 192, s: 0.82, v: 1 },
    { x: 454, y: 242, s: 0.68, v: 3 },
    { x: 494, y: 262, s: 0.58, v: 2 },
    { x: 518, y: 318, s: 0.66, v: 1 },

    /* Cœur dense de l'arche centrale */
    { x: 548, y: 62, s: 1.04, v: 0 },
    { x: 528, y: 112, s: 0.76, v: 3 },
    { x: 568, y: 138, s: 0.94, v: 2 },
    { x: 612, y: 58, s: 0.96, v: 1 },
    { x: 618, y: 108, s: 0.88, v: 0 },
    { x: 668, y: 48, s: 0.92, v: 2 },
    { x: 676, y: 114, s: 0.78, v: 1 },

    /* Longue liane principale centre-droit (celle qui descend le plus bas sur la photo) */
    { x: 742, y: 42, s: 1.02, v: 0 },
    { x: 732, y: 124, s: 0.74, v: 3 },
    { x: 652, y: 274, s: 0.82, v: 1 },
    { x: 718, y: 314, s: 0.88, v: 2 },
    { x: 712, y: 386, s: 0.95, v: 0 },

    /* Liane tombante droite */
    { x: 786, y: 96, s: 0.76, v: 2 },
    { x: 838, y: 74, s: 1.04, v: 0 },
    { x: 836, y: 162, s: 0.82, v: 1 },
    { x: 778, y: 218, s: 0.84, v: 2 },
    { x: 826, y: 248, s: 0.65, v: 3 },
    { x: 804, y: 304, s: 0.78, v: 1 },
    { x: 866, y: 214, s: 0.68, v: 0 },

    /* Extrémité haute droite */
    { x: 922, y: 66, s: 0.98, v: 2 },
    { x: 948, y: 124, s: 0.76, v: 1 },
    { x: 954, y: 184, s: 0.74, v: 0 },
  ];

  return (
    <motion.div
      animate={{ rotate: [-0.25, 0.25, -0.25], y: [0, 2, 0] }}
      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(100vw, 1180px)",
        height: "clamp(230px, 38vh, 410px)",
        opacity: 0.26,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 1100 440"
        preserveAspectRatio="xMidYMin meet"
        className="helmet-ornament-svg"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        {/* 1. Lianes fines et tiges grimpantes (exactement la structure de image_0f6ea8.jpg) */}
        <g
          fill="none"
          stroke="#1c1c1c"
          strokeWidth="1.15"
          strokeLinecap="round"
        >
          {/* Guirlande arquée principale du haut */}
          <path d="M 110,5 C 260,95 450,120 580,110 C 730,100 880,65 1010,8" />
          <path d="M 160,12 C 310,75 490,92 640,82 C 790,72 910,45 980,15" />

          {/* Rameau tombant 1 (Gauche) */}
          <path d="M 210,42 C 225,95 215,145 245,190 C 265,215 295,222 320,232" />
          <path d="M 262,118 C 295,145 335,175 358,198" />

          {/* Rameau tombant 2 (Centre-Gauche, descend jusqu'à y=325) */}
          <path d="M 395,85 C 405,145 425,210 455,248 C 482,282 505,295 518,322" />
          <path d="M 458,94 C 462,145 478,195 494,262" />

          {/* Rameau tombant 3 (Grand drapé Centre-Droit, descend jusqu'à y=395) */}
          <path d="M 738,118 C 712,175 685,225 654,274" />
          <path d="M 744,122 C 742,195 724,265 715,320 C 708,355 712,375 714,392" />

          {/* Rameau tombant 4 (Droite, descend jusqu'à y=310) */}
          <path d="M 838,82 C 835,155 822,225 804,304" />
          <path d="M 836,162 C 852,188 864,202 868,218" />

          {/* Rameau tombant 5 (Extrême Droite) */}
          <path d="M 928,68 C 945,115 952,152 954,188" />
        </g>

        {/* 2. Petites feuilles fines le long des lianes */}
        <g fill="#ffffff" stroke="#1c1c1c" strokeWidth="0.95">
          {[
            [180, 62, -35],
            [232, 78, 25],
            [305, 86, -40],
            [342, 65, 15],
            [425, 62, -25],
            [412, 165, 45],
            [495, 168, -35],
            [502, 292, 30],
            [698, 185, -45],
            [682, 232, 35],
            [728, 225, -25],
            [702, 355, 40],
            [815, 132, -30],
            [888, 128, 35],
            [915, 148, -25],
            [972, 92, 20],
          ].map(([lx, ly, rot], idx) => (
            <g
              key={idx}
              transform={`translate(${lx}, ${ly}) rotate(${rot})`}
            >
              <path d="M 0,0 C 5,-5 13,-5 18,0 C 13,5 5,5 0,0 Z" />
              <line x1="1" y1="0" x2="16" y2="0" strokeWidth="0.6" />
            </g>
          ))}
        </g>

        {/* 3. Toutes les roses dessinées au trait fin sur le roncier */}
        {canopyRoses.map((r, i) => (
          <g key={i} transform={`translate(${r.x}, ${r.y})`}>
            <foreignObject
              x={-32 * r.s}
              y={-32 * r.s}
              width={64 * r.s}
              height={64 * r.s}
              style={{ overflow: "visible" }}
            >
              <SketchRoseHead variant={r.v} scale={r.s} />
            </foreignObject>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

/* ============================================================================
   COMPOSANT PRINCIPAL : MOTEUR ALÉATOIRE NON RÉPÉTITIF
   ============================================================================ */
export default function AtelierAtmosphere({
  mode = "canopy-and-roses",
}: AtmosphereProps) {
  const [fallingItems, setFallingItems] = useState<FallingElement[]>([]);
  const nextIdRef = useRef(1);

  const isCanopyMode = mode === "canopy-and-roses";

  /* Points d'ancrage variés sur le roncier (gauche, centre-gauche, milieu, droite, haut, bas) */
  const CANOPY_SPAWN_ZONES = [
    { xMin: 12, xMax: 24, yMin: 4, yMax: 16 },   // Haut gauche
    { xMin: 25, xMax: 38, yMin: 12, yMax: 24 },  // Mi-hauteur gauche
    { xMin: 40, xMax: 52, yMin: 18, yMax: 30 },  // Bas de la liane centre-gauche
    { xMin: 48, xMax: 60, yMin: 6, yMax: 15 },   // Milieu haut de l'arche
    { xMin: 60, xMax: 70, yMin: 22, yMax: 34 },  // Bas de la longue liane centrale
    { xMin: 72, xMax: 84, yMin: 10, yMax: 25 },  // Liane droite
    { xMin: 84, xMax: 92, yMin: 5, yMax: 16 },   // Extrémité haute droite
  ];

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const spawnOneItem = () => {
      if (!isMounted) return;

      const id = nextIdRef.current++;
      const variant = (Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3);

      let startX = 10 + Math.random() * 80;
      let startY = -6;

      if (isCanopyMode) {
        /* Choisit aléatoirement une zone du roncier (à gauche, au milieu, à droite, plus haut ou plus bas) */
        const zone =
          CANOPY_SPAWN_ZONES[
            Math.floor(Math.random() * CANOPY_SPAWN_ZONES.length)
          ];
        startX = zone.xMin + Math.random() * (zone.xMax - zone.xMin);
        startY = zone.yMin + Math.random() * (zone.yMax - zone.yMin);
      } else {
        /* Pour Shop & Service : départ aléatoire sur toute la largeur (gauche, centre, droite) */
        startX = 6 + Math.random() * 88;
        startY = -4 + Math.random() * 14;
      }

      const duration = isCanopyMode
        ? 11 + Math.random() * 7
        : 12 + Math.random() * 8;

      const newElement: FallingElement = {
        id,
        startX,
        startY,
        driftX1: (Math.random() - 0.5) * 75,
        driftX2: (Math.random() - 0.5) * 95,
        driftX3: (Math.random() - 0.5) * 110,
        duration,
        scale: isCanopyMode
          ? 0.72 + Math.random() * 0.42
          : 0.75 + Math.random() * 0.45,
        startRotate: (Math.random() - 0.5) * 50,
        endRotate: (Math.random() > 0.5 ? 1 : -1) * (140 + Math.random() * 180),
        variant,
      };

      setFallingItems((prev) => [...prev.slice(-7), newElement]);

      /* Supprime l'élément une fois sa chute terminée */
      setTimeout(() => {
        if (!isMounted) return;
        setFallingItems((prev) => prev.filter((item) => item.id !== id));
      }, duration * 1000);

      /* Intervalle irrégulier pour que l'animation ne fasse jamais "boucle robotique" */
      const nextDelay = isCanopyMode
        ? 2200 + Math.random() * 3400
        : 1800 + Math.random() * 2800;
      timeoutId = setTimeout(spawnOneItem, nextDelay);
    };

    /* Lance 2 premiers éléments au démarrage avec un léger décalage */
    const init1 = setTimeout(spawnOneItem, 400);
    const init2 = setTimeout(spawnOneItem, 1900);

    return () => {
      isMounted = false;
      clearTimeout(init1);
      clearTimeout(init2);
      clearTimeout(timeoutId);
    };
  }, [isCanopyMode]);

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
      {/* 1. LE RONCIER DE ROSES EN DRAPÉ (Uniquement dans le Menu et dans Helmet Gallery) */}
      {isCanopyMode && <HangingRoseCanopy />}

      {/* 2. CHUTE ALÉATOIRE : ROSES ENTIÈRES (Menu/Gallery) OU PÉTALES FINS (Shop/Service) */}
      <AnimatePresence>
        {fallingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              top: `${item.startY}vh`,
              left: `${item.startX}vw`,
              x: 0,
              opacity: 0,
              rotate: item.startRotate,
              scale: item.scale * 0.85,
            }}
            animate={{
              top: "106vh",
              x: [0, item.driftX1, item.driftX2, item.driftX3],
              opacity: [0, 0.42, 0.38, 0],
              rotate: item.endRotate,
              scale: item.scale,
            }}
            transition={{
              duration: item.duration,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              willChange: "transform, top, opacity",
            }}
          >
            {isCanopyMode ? (
              <SketchRoseHead variant={item.variant} scale={item.scale} />
            ) : (
              <SketchRosePetal variant={item.variant} scale={item.scale} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}