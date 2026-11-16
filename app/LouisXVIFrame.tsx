"use client";

import React from "react";

interface FrameProps {
  children: React.ReactNode;
  variant?: "menu" | "pill" | "title";
  className?: string;
}

export default function LouisXVIFrame({
  children,
  variant = "menu",
  className = "",
}: FrameProps) {
  const isPill = variant === "pill";
  const isTitle = variant === "title";

  return (
    <span
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 ${
        isPill
          ? "min-w-[110px] min-h-[50px] px-6 py-2"
          : isTitle
          ? "min-w-[340px] min-h-[120px] px-14 py-8"
          : "min-w-[190px] min-h-[70px] px-8 py-4"
      } ${className}`}
    >
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          <g id="louis-xvi-half">
            {/* LIGNES DE HACHURE (GRAVURE D'OMBRAGE LOUIS XVI) */}
            <g stroke="#111111" strokeWidth="0.6" opacity="0.75" strokeLinecap="round">
              {/* Hachures du fronton supérieur */}
              <path d="M 205,35 L 205,60 M 210,38 L 210,58 M 215,42 L 215,55 M 220,46 L 220,53 M 225,48 L 225,50" />
              <path d="M 230,28 L 230,35 M 235,26 L 235,38 M 240,24 L 240,40 M 245,23 L 245,38" />
              {/* Hachures des piliers latéraux */}
              <path d="M 360,75 L 360,140 M 365,80 L 365,135 M 370,85 L 370,130" />
              <path d="M 375,90 L 375,125 M 380,95 L 380,120 M 385,100 L 385,115" />
              {/* Hachures de la base */}
              <path d="M 210,165 L 210,185 M 215,168 L 215,182 M 220,170 L 220,180" />
              <path d="M 260,150 L 260,170 M 265,152 L 265,168 M 270,155 L 270,165" />
              <path d="M 310,145 L 310,165 M 315,148 L 315,162 M 320,150 L 320,160" />
            </g>

            {/* LE COURONNEMENT (Le bouton en haut au centre) */}
            <path d="M 200,10 C 208,10 212,14 212,20 C 212,26 208,30 200,30" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
            <circle cx="200" cy="20" r="3" fill="#ffffff" stroke="#111111" strokeWidth="1" />
            {/* Pied du couronnement */}
            <path d="M 200,30 L 215,30 L 212,38 L 200,38" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
            <path d="M 200,34 L 213,34" stroke="#111111" strokeWidth="1" />

            {/* FRONTON SUPÉRIEUR BAROQUE (Les grandes feuilles d'acanthe) */}
            <path 
              d="M 200,38 C 230,38 250,70 280,50 C 295,40 290,15 270,20 C 255,23 250,38 260,45" 
              fill="#ffffff" stroke="#111111" strokeWidth="1.75" strokeLinecap="round" 
            />
            {/* Pointe piquante de la feuille */}
            <path d="M 280,50 C 290,60 300,50 310,45 C 300,40 290,40 280,50" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
            
            {/* CORNICHE SUPÉRIEURE DROITE */}
            <path d="M 280,50 C 310,70 320,30 350,35 C 370,38 390,60 380,80" fill="#ffffff" stroke="#111111" strokeWidth="1.75" />

            {/* ROSETTE SCULPTÉE (La petite fleur en haut à droite) */}
            <circle cx="340" cy="55" r="10" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
            <circle cx="340" cy="55" r="4" fill="none" stroke="#111111" strokeWidth="1" />
            <path d="M 340,45 C 345,45 350,50 350,55 M 350,55 C 350,60 345,65 340,65 M 340,65 C 335,65 330,60 330,55 M 330,55 C 330,50 335,45 340,45" fill="none" stroke="#111111" strokeWidth="1" />

            {/* PILIER LATÉRAL DROIT ET VOLUTE INFÉRIEURE */}
            <path 
              d="M 380,80 C 360,110 360,130 380,150 C 395,165 375,190 350,175 C 340,165 350,150 360,155" 
              fill="#ffffff" stroke="#111111" strokeWidth="1.75" strokeLinecap="round" 
            />
            <path d="M 350,175 L 345,195 L 335,190 Z" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />

            {/* SOUBASSEMENT ET PIQUE INFÉRIEURE */}
            <path d="M 380,150 C 350,140 320,165 290,155 C 270,145 250,170 230,160 C 220,175 210,195 200,195" fill="#ffffff" stroke="#111111" strokeWidth="1.75" />
            <path d="M 230,160 C 235,150 245,150 250,160 C 245,170 235,170 230,160" fill="#ffffff" stroke="#111111" strokeWidth="1.25" />
            <path d="M 200,195 C 210,195 215,185 215,175 L 200,175" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />

            {/* CADRE INTÉRIEUR (DOUBLE FILET) */}
            <path 
              d="M 200,65 L 300,65 C 320,65 320,80 325,95 L 325,120 C 325,140 300,135 290,140 L 200,140" 
              fill="#ffffff" stroke="#111111" strokeWidth="2.5" 
            />
            <path 
              d="M 200,70 L 295,70 C 310,70 312,80 318,92 L 318,122 C 318,132 300,130 288,135 L 200,135" 
              fill="none" stroke="#111111" strokeWidth="1" 
            />

            {/* LA PAMPILLE (Le petit bijou/pendentif qui pend à l'intérieur à droite) */}
            <line x1="322" y1="95" x2="322" y2="115" stroke="#111111" strokeWidth="1.5" />
            <circle cx="322" cy="118" r="3" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
            <path d="M 322,121 L 325,127 L 322,132 L 319,127 Z" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
          </g>
        </defs>

        {/* AFFICHAGE SYMÉTRIQUE DU CADRE (Gauche et Droite parfaites) */}
        <use href="#louis-xvi-half" />
        <use href="#louis-xvi-half" transform="scale(-1, 1) translate(-400, 0)" />
      </svg>
      
      {/* TEXTE AU CENTRE DU CADRE */}
      <span className="relative z-10 font-bordeaux tracking-[0.25em] uppercase text-black leading-none flex items-center justify-center gap-2 whitespace-nowrap">
        {children}
      </span>
    </span>
  );
}