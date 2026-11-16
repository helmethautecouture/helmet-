"use client";

import React from "react";

interface CartoucheProps {
  children: React.ReactNode;
  variant?: "menu" | "pill" | "title";
  className?: string;
}

export default function EngravedCartouche({
  children,
  variant = "menu",
  className = "",
}: CartoucheProps) {
  if (variant === "pill") {
    return (
      <span className={`helmet-cartouche-pill ${className}`}>
        <svg
          viewBox="0 0 180 56"
          className="helmet-ornament-svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Hachures de gravure dans les fleurons */}
          <g stroke="#111111" strokeWidth="0.65" opacity="0.65">
            <line x1="82" y1="6" x2="98" y2="6" />
            <line x1="80" y1="8.5" x2="100" y2="8.5" />
            <line x1="82" y1="50" x2="98" y2="50" />
            <line x1="80" y1="47.5" x2="100" y2="47.5" />
            <line x1="6" y1="25" x2="15" y2="25" />
            <line x1="5" y1="28" x2="16" y2="28" />
            <line x1="6" y1="31" x2="15" y2="31" />
            <line x1="165" y1="25" x2="174" y2="25" />
            <line x1="164" y1="28" x2="175" y2="28" />
            <line x1="165" y1="31" x2="174" y2="31" />
          </g>

          {/* Silhouette extérieure baroque à fleurons et festons de dentelle */}
          <path
            d="M 24,13
               C 29,8 35,9 39,13
               L 66,13
               C 70,8 76,7 81,11
               C 84,6 87,2 90,2
               C 93,2 96,6 99,11
               C 104,7 110,8 114,13
               L 141,13
               C 145,9 151,8 156,13
               C 161,13 164,17 164,21
               C 169,20 176,23 178,28
               C 176,33 169,36 164,35
               C 164,39 161,43 156,43
               C 151,48 145,47 141,43
               L 114,43
               C 110,48 104,49 99,45
               C 96,50 93,54 90,54
               C 87,54 84,50 81,45
               C 76,49 70,48 66,43
               L 39,43
               C 35,47 29,48 24,43
               C 19,43 16,39 16,35
               C 11,36 4,33 2,28
               C 4,23 11,20 16,21
               C 16,17 19,13 24,13 Z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />

          {/* Œillets ajourés (style gravure 4d0fdf & dentelle 4d619f) */}
          <circle cx="90" cy="8.5" r="1.7" fill="#ffffff" stroke="#000000" strokeWidth="1" />
          <circle cx="90" cy="47.5" r="1.7" fill="#ffffff" stroke="#000000" strokeWidth="1" />
          <circle cx="10.5" cy="28" r="1.6" fill="#ffffff" stroke="#000000" strokeWidth="1" />
          <circle cx="169.5" cy="28" r="1.6" fill="#ffffff" stroke="#000000" strokeWidth="1" />

          {/* Double filet rectangulaire interne (style 4d0f08 & 4d0fdf) */}
          <rect
            x="21"
            y="15.5"
            width="138"
            height="25"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.15"
          />
          <rect
            x="24"
            y="18"
            width="132"
            height="20"
            fill="none"
            stroke="#000000"
            strokeWidth="0.6"
          />
        </svg>
        <span className="helmet-cartouche-label">{children}</span>
      </span>
    );
  }

  const isTitle = variant === "title";

  return (
    <span
      className={`${
        isTitle ? "helmet-cartouche-title" : "helmet-cartouche-menu"
      } ${className}`}
    >
      <svg
        viewBox="0 0 320 92"
        className="helmet-ornament-svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* 1. Dentelle d'arabesques et rinceaux extérieurs (fusion 4d0f08 & 4d619f) */}
        <g
          fill="none"
          stroke="#000000"
          strokeWidth="1.05"
          strokeLinecap="round"
        >
          {/* Volutes supérieures */}
          <path d="M 56,22 C 62,14 74,14 80,22" />
          <path d="M 92,22 C 102,11 118,11 126,22" />
          <path d="M 194,22 C 202,11 218,11 228,22" />
          <path d="M 240,22 C 246,14 258,14 264,22" />
          {/* Volutes inférieures */}
          <path d="M 56,70 C 62,78 74,78 80,70" />
          <path d="M 92,70 C 102,81 118,81 126,70" />
          <path d="M 194,70 C 202,81 218,81 228,70" />
          <path d="M 240,70 C 246,78 258,78 264,70" />
          {/* Petits picots de dentelle (inspiration 4d619f) */}
          <circle cx="68" cy="15" r="1.1" fill="#000000" />
          <circle cx="109" cy="12.5" r="1.2" fill="#000000" />
          <circle cx="211" cy="12.5" r="1.2" fill="#000000" />
          <circle cx="252" cy="15" r="1.1" fill="#000000" />
          <circle cx="68" cy="77" r="1.1" fill="#000000" />
          <circle cx="109" cy="79.5" r="1.2" fill="#000000" />
          <circle cx="211" cy="79.5" r="1.2" fill="#000000" />
          <circle cx="252" cy="77" r="1.1" fill="#000000" />
        </g>

        {/* 2. Corps du Cartouche Gravé (inspiration directe 4d0fdf.png) */}
        <path
          d="M 38,22
             C 44,12 52,13 57,22
             L 124,22
             C 130,12 141,10 148,18
             C 152,9 156,3 160,3
             C 164,3 168,9 172,18
             C 179,10 190,12 196,22
             L 263,22
             C 268,13 276,12 282,22
             C 291,22 295,28 294,35
             C 303,32 314,38 317,46
             C 314,54 303,60 294,57
             C 295,64 291,70 282,70
             C 276,80 268,79 263,70
             L 196,70
             C 190,80 179,82 172,74
             C 168,83 164,89 160,89
             C 156,89 152,83 148,74
             C 141,82 130,80 124,70
             L 57,70
             C 52,79 44,80 38,70
             C 29,70 25,64 26,57
             C 17,60 6,54 3,46
             C 6,38 17,32 26,35
             C 25,28 29,22 38,22 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* 3. Hachures horizontales de gravure ancienne dans les fleurons & coins */}
        <g stroke="#000000" strokeWidth="0.7" opacity="0.72">
          {/* Fleuron Haut */}
          <line x1="154" y1="7.5" x2="166" y2="7.5" />
          <line x1="151" y1="10.5" x2="169" y2="10.5" />
          <line x1="134" y1="15" x2="147" y2="15" />
          <line x1="173" y1="15" x2="186" y2="15" />
          <line x1="131" y1="18" x2="189" y2="18" />
          {/* Fleuron Bas */}
          <line x1="154" y1="84.5" x2="166" y2="84.5" />
          <line x1="151" y1="81.5" x2="169" y2="81.5" />
          <line x1="134" y1="77" x2="147" y2="77" />
          <line x1="173" y1="77" x2="186" y2="77" />
          <line x1="131" y1="74" x2="189" y2="74" />
          {/* Fleuron Gauche */}
          <line x1="8" y1="42" x2="23" y2="42" />
          <line x1="6" y1="46" x2="25" y2="46" />
          <line x1="8" y1="50" x2="23" y2="50" />
          <line x1="28" y1="27" x2="36" y2="27" />
          <line x1="28" y1="65" x2="36" y2="65" />
          {/* Fleuron Droit */}
          <line x1="297" y1="42" x2="312" y2="42" />
          <line x1="295" y1="46" x2="314" y2="46" />
          <line x1="297" y1="50" x2="312" y2="50" />
          <line x1="284" y1="27" x2="292" y2="27" />
          <line x1="284" y1="65" x2="292" y2="65" />
          {/* Épaulements d'angles */}
          <line x1="42" y1="17" x2="53" y2="17" />
          <line x1="267" y1="17" x2="278" y2="17" />
          <line x1="42" y1="75" x2="53" y2="75" />
          <line x1="267" y1="75" x2="278" y2="75" />
        </g>

        {/* 4. Œillets ronds ajourés aux 4 fleurons cardinaux (détail signature 4d0fdf) */}
        <circle cx="160" cy="14" r="2.6" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
        <circle cx="160" cy="78" r="2.6" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
        <circle cx="16.5" cy="46" r="2.3" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
        <circle cx="303.5" cy="46" r="2.3" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />

        {/* Petites encoches en goutte dans les épaulements */}
        <polygon points="140,20 144,16 147,20" fill="#ffffff" stroke="#000000" strokeWidth="1" />
        <polygon points="173,20 176,16 180,20" fill="#ffffff" stroke="#000000" strokeWidth="1" />
        <polygon points="140,72 144,76 147,72" fill="#ffffff" stroke="#000000" strokeWidth="1" />
        <polygon points="173,72 176,76 180,72" fill="#ffffff" stroke="#000000" strokeWidth="1" />

        {/* 5. Cadre Rectangulaire Intérieur à Double Filet (style 4d0fdf & 4d0f08) */}
        <rect
          x="34"
          y="23.5"
          width="252"
          height="45"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1.45"
        />
        <rect
          x="38"
          y="27"
          width="244"
          height="38"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="0.75"
        />

        {/* Filet d'ombre gravée interne sur le bord supérieur et gauche du rectangle */}
        <line x1="39.5" y1="28.5" x2="280.5" y2="28.5" stroke="#000000" strokeWidth="0.45" opacity="0.45" />
        <line x1="39.5" y1="28.5" x2="39.5" y2="63.5" stroke="#000000" strokeWidth="0.45" opacity="0.45" />
      </svg>

      <span className="helmet-cartouche-label">{children}</span>
    </span>
  );
}