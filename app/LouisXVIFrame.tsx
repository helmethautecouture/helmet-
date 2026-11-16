"use client";

import React from "react";

interface FrameProps {
  children: React.ReactNode;
  variant?: "menu" | "pill" | "title";
  className?: string;
}

/* ============================================================================
   SOUS-COMPOSANT : ROSE GRAVÉE À L'ENCRE NOIRE (Style gravure sur bois)
   Reproduit les pétales enroulés noirs et blancs de l'image d'inspiration
   ============================================================================ */
function EngravedRose({
  x,
  y,
  scale = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
      {/* Silhouette extérieure irrégulière de la rose */}
      <path
        d="M -18,-6 C -20,-16 -10,-22 0,-21 C 11,-22 20,-15 21,-4 C 22,7 15,18 3,20 C -9,21 -19,14 -20,2 Z"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Pétales extérieurs gravés */}
      <path
        d="M -14,-8 C -8,-17 6,-18 14,-10 M 15,-8 C 19,0 15,12 5,15 M 2,16 C -8,17 -16,10 -16,-1"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Pétales intermédiaires en coupole */}
      <path
        d="M -10,-3 C -11,-11 -2,-14 6,-11 C 13,-8 14,2 8,8 C 2,13 -8,11 -11,3"
        fill="none"
        stroke="#000000"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      {/* Ombres épaisses entre les pétales (style woodcut) */}
      <path
        d="M -7,-8 C -2,-12 6,-10 9,-4 M -9,4 C -4,10 5,9 9,3 M -13,-2 C -12,6 -6,12 1,12"
        fill="none"
        stroke="#000000"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Cœur enroulé de la rose */}
      <path
        d="M -5,-1 C -5,-6 1,-8 5,-4 C 8,0 5,5 0,5 C -4,5 -6,1 -3,-2 C -1,-4 2,-2 1,1"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="0" cy="0" r="1.8" fill="#000000" />
    </g>
  );
}

/* ============================================================================
   SOUS-COMPOSANT : FEUILLE DE ROSIER NERVURÉE & DENTELÉE
   ============================================================================ */
function ThornLeaf({
  x,
  y,
  scale = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
      <path
        d="M 0,0 C 6,-7 16,-9 24,0 C 16,9 6,7 0,0 Z"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Nervure centrale et hachures */}
      <path
        d="M 1,0 L 21,0 M 6,0 L 10,-4 M 11,0 L 15,-4 M 16,0 L 19,-3 M 6,0 L 10,4 M 11,0 L 15,4 M 16,0 L 19,3"
        fill="none"
        stroke="#000000"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );
}

export default function LouisXVIFrame({
  children,
  variant = "menu",
  className = "",
}: FrameProps) {
  const isPill = variant === "pill";
  const isTitle = variant === "title";

  /* Dimensions et espacements calibrés pour que le cadre entoure parfaitement chaque mot */
  const containerStyle: React.CSSProperties = isPill
    ? {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "126px",
        height: "54px",
        padding: "10px 26px 8px 30px",
        cursor: "pointer",
        verticalAlign: "middle",
      }
    : isTitle
    ? {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "clamp(270px, 34vw, 390px)",
        minHeight: "clamp(88px, 10vw, 118px)",
        padding: "22px 58px 18px 64px",
        cursor: "pointer",
        verticalAlign: "middle",
      }
    : {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "clamp(185px, 17vw, 235px)",
        height: "clamp(68px, 6.2vw, 82px)",
        padding: "14px 36px 12px 42px",
        cursor: "pointer",
        verticalAlign: "middle",
      };

  return (
    <span className={`helmet-thorn-wrapper ${className}`} style={containerStyle}>
      <svg
        viewBox="0 0 420 170"
        preserveAspectRatio="none"
        className="helmet-ornament-svg"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          maxWidth: "none",
          maxHeight: "none",
          pointerEvents: "none",
          overflow: "visible",
          display: "block",
          zIndex: 1,
        }}
      >
        {/* ====================================================================
            1. TIGES DE RONCES ENTRELACÉES (Effet barbelé organique de la photo)
            ==================================================================== */}
        <g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round">
          {/* Branche maîtresse extérieure */}
          <path
            d="M 46,88 C 38,42 108,16 208,18 C 314,20 388,44 392,86 C 396,128 322,154 212,152 C 104,150 52,126 46,88 Z"
            strokeWidth="2.8"
          />

          {/* Deuxième ronce croisée (effet barbelé tressé) */}
          <path
            d="M 56,74 C 74,30 162,24 254,28 C 344,32 402,58 384,102 C 366,142 272,158 176,146 C 86,136 42,110 56,74 Z"
            strokeWidth="2.3"
          />

          {/* Troisième ronce interne asymétrique avec vrilles libres */}
          <path
            d="M 68,96 C 64,52 136,32 228,32 C 312,32 372,56 368,90 C 364,124 298,142 206,140 C 122,138 72,118 68,96"
            strokeWidth="1.9"
          />

          {/* Rameau sauvage qui dépasse en haut à gauche (comme sur la photo) */}
          <path
            d="M 96,36 C 68,26 42,24 14,34 C 8,36 4,42 8,47"
            strokeWidth="2.1"
          />

          {/* Rameau épineux qui plonge vers l'intérieur en haut à droite (détail signature de la photo) */}
          <path
            d="M 334,36 C 304,44 278,56 254,68 M 288,52 C 272,54 256,52 244,48"
            strokeWidth="1.8"
          />

          {/* Rameau épineux interne à droite qui remonte (détail de la photo) */}
          <path
            d="M 342,132 C 354,106 350,76 326,54"
            strokeWidth="1.9"
          />

          {/* Rameaux croisés en bas */}
          <path
            d="M 118,142 C 164,128 238,128 298,148 M 156,148 C 212,158 278,154 328,132"
            strokeWidth="2"
          />
        </g>

        {/* ====================================================================
            2. ÉPINES ACÉRÉES / PICOTS FAÇON BARBELÉ LE LONG DES TIGES
            ==================================================================== */}
        <g fill="#000000" stroke="#000000" strokeWidth="0.8" strokeLinejoin="round">
          {/* Épines du haut */}
          <polygon points="118,24 123,14 127,23" />
          <polygon points="148,20 154,11 157,20" />
          <polygon points="172,28 168,36 176,30" />
          <polygon points="272,22 278,12 281,23" />
          <polygon points="304,26 312,17 313,28" />
          <polygon points="324,38 318,46 329,41" />
          <polygon points="354,38 363,30 361,42" />

          {/* Épines du flanc droit */}
          <polygon points="386,62 396,57 390,68" />
          <polygon points="392,82 403,80 393,89" />
          <polygon points="386,106 396,111 384,114" />
          <polygon points="370,74 361,70 368,80" />
          <polygon points="366,102 357,105 366,110" />
          <polygon points="348,84 340,81 347,90" />

          {/* Épines du bas */}
          <polygon points="342,136 350,145 337,141" />
          <polygon points="306,146 312,156 300,149" />
          <polygon points="266,152 270,162 260,153" />
          <polygon points="228,140 224,131 233,139" />
          <polygon points="192,152 188,162 198,153" />
          <polygon points="146,146 140,155 152,149" />
          <polygon points="104,136 96,144 109,140" />

          {/* Épines du flanc gauche et de la branche libre */}
          <polygon points="62,118 52,123 65,124" />
          <polygon points="48,96 37,98 48,103" />
          <polygon points="52,62 42,57 55,56" />
          <polygon points="42,28 38,19 47,27" />
          <polygon points="68,30 65,21 73,29" />

          {/* Épines sur la branche plongeante intérieure */}
          <polygon points="292,48 287,40 297,46" />
          <polygon points="268,60 263,53 273,57" />
        </g>

        {/* ====================================================================
            3. FEUILLES DE ROSIER GRAVÉES (Placées comme sur l'image)
            ==================================================================== */}
        {/* Feuilles sur la branche libre en haut à gauche */}
        <ThornLeaf x={10} y={36} scale={0.78} rotate={145} />
        <ThornLeaf x={34} y={32} scale={0.68} rotate={120} />
        <ThornLeaf x={82} y={24} scale={0.85} rotate={-155} />
        <ThornLeaf x={98} y={22} scale={0.75} rotate={-130} />

        {/* Feuilles intérieures gauche et droite */}
        <ThornLeaf x={108} y={76} scale={0.78} rotate={25} />
        <ThornLeaf x={106} y={114} scale={0.82} rotate={-55} />
        <ThornLeaf x={296} y={54} scale={0.72} rotate={150} />
        <ThornLeaf x={338} y={100} scale={0.72} rotate={-135} />

        {/* Bouquets de feuilles en bas */}
        <ThornLeaf x={136} y={150} scale={0.88} rotate={110} />
        <ThornLeaf x={152} y={148} scale={0.78} rotate={65} />
        <ThornLeaf x={212} y={136} scale={0.78} rotate={-75} />
        <ThornLeaf x={224} y={146} scale={0.75} rotate={35} />
        <ThornLeaf x={294} y={150} scale={0.85} rotate={115} />
        <ThornLeaf x={306} y={148} scale={0.85} rotate={45} />

        {/* ====================================================================
            4. LES 4 ROSES GRAVÉES (Positionnées exactement comme sur ta photo)
            ==================================================================== */}
        {/* Rose 1 : Sommet Centre-Gauche */}
        <EngravedRose x={198} y={22} scale={0.95} rotate={-8} />
        {/* Rose 2 : Sommet Centre-Droite (légèrement plus basse, comme sur la photo) */}
        <EngravedRose x={242} y={36} scale={0.88} rotate={14} />
        {/* Rose 3 : Flanc Gauche Haut */}
        <EngravedRose x={74} y={58} scale={0.92} rotate={-18} />
        {/* Rose 4 : Flanc Gauche Bas (en grappe sous la 3e) */}
        <EngravedRose x={54} y={86} scale={0.88} rotate={12} />
        <EngravedRose x={82} y={84} scale={0.78} rotate={-6} />
      </svg>

      {/* TEXTE PARFAITEMENT CENTRÉ À L'INTÉRIEUR DE LA COURONNE DE RONCES */}
      <span
        style={{
          position: "relative",
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          whiteSpace: "nowrap",
          lineHeight: 1,
          color: "#000000",
        }}
      >
        {children}
      </span>
    </span>
  );
}