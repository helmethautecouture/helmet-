"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LouisXVIFrame from "./LouisXVIFrame";

const AUDIO_PATHS = [
  "/ambiante.mp3",
  "/ambiance.mp3",
  "/ambient.mp3",
  "/ambiante.mp3.mp3",
  "/ambiance.mp3.mp3",
];

let introPlayedInMemory = false;

const HELMET_FAQ_SECTIONS = [
  {
    title: "ATELIER & PRODUCTION",
    paragraphs: [
      "Helmet Haute Couture is an independent label founded and directed in Paris, France. We have no corporate cosign, external investors, or third-party retailers.",
      "Every garment is handcrafted in-house in France using premium Italian-woven 100% cotton fabrics. Because each piece is produced manually with strict attention to detail, please allow 2–3 weeks for your order to be prepared and shipped.",
      "We are happy to update you personally throughout the process or answer any questions about your piece via our Client Service or by emailing helmetcothes@gmail.com.",
    ],
  },
  {
    title: "UNIQUE PIECES & ARCHIVE POLICY",
    paragraphs: [
      "All pieces from Edition -01 are handcrafted in strictly limited quantities as unique atelier creations. Unless an item arrives with a fulfillment error or defect, all archive pieces are final sale.",
      "If there is any issue with your order upon reception, please contact our Client Service within 7 days of receiving your parcel with your order reference so we can assist you directly.",
    ],
  },
  {
    title: "SHIPPING & TRACKING",
    paragraphs: [
      "All orders are hand-packed in Paris and shipped with tracked delivery. You will receive your tracking link by email as soon as your piece leaves our studio.",
      "Orders shipped within France and the European Union include applicable taxes. For international shipments outside the EU, local customs duties or import taxes may be requested by the carrier upon delivery.",
    ],
  },
  {
    title: "EU CUSTOMER RIGHT TO WITHDRAW",
    paragraphs: [
      "In accordance with European Union consumer protection laws, EU clients have a 14-day legal right to withdraw from a standard order after reception, provided the piece is strictly unworn, unwashed, and returned in its original packaging with all tags intact.",
      "Return shipping costs to Paris remain the responsibility of the buyer. To contact us regarding an order, reach out via Client Service or at helmetcothes@gmail.com.",
    ],
  },
  {
    title: "GARMENT CARE",
    paragraphs: [
      "To preserve the structure of our 100% Italian cotton and handcrafted construction, we strongly recommend hand washing in cold water (inside out) or professional dry cleaning.",
      "Always hang dry away from direct heat. Never machine dry, as high heat will alter the cotton fibers and distress the finish over time.",
      "Wash dark black garments separately or with similar black pieces during the first cycles.",
    ],
  },
];

/* ============================================================================
   SOUS-COMPOSANTS DE L'INTRO : ROSES GRAVÉES, FEUILLES DENTELÉES & PICS BARBELÉS
   (100% identiques aux cadrans du menu, animés à l'encre noire sur fond blanc)
   ============================================================================ */
function AnimatedEngravedRose({
  x,
  y,
  scale = 1,
  rotate = 0,
  delay = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  delay?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
      <motion.path
        d="M -19,-5 L -16,-16 L -5,-22 L 8,-21 L 19,-14 L 22,-2 L 17,12 L 6,20 L -7,21 L -17,13 L -21,2 Z"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2.4"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M -16,-7 C -13,-16 -2,-19 9,-16 C 16,-13 19,-4 16,5 M -17,3 C -14,14 -3,18 8,14 C 15,11 19,2 15,-6"
        fill="none"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: delay + 0.2, ease: "easeInOut" }}
      />
      <motion.path
        d="M -12,-3 L -7,-12 L 4,-13 L 12,-7 L 11,4 L 3,11 L -8,9 L -13,1 Z"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.3, delay: delay + 0.35, ease: "easeInOut" }}
      />
      <motion.path
        d="M -9,-8 L -2,-11 L 5,-9 L 2,-6 Z M 7,-3 L 11,2 L 5,8 L 4,3 Z M -10,2 L -5,8 L 1,7 L -4,3 Z"
        fill="#000000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.65 }}
      />
      <motion.path
        d="M -6,-1 L -2,-6 L 5,-5 L 7,1 L 2,5 L -4,4 L -5,0 L 0,-2 L 3,0 L 0,2"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: delay + 0.5, ease: "easeOut" }}
      />
    </g>
  );
}

function AnimatedJaggedLeaf({
  x,
  y,
  scale = 1,
  rotate = 0,
  delay = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  delay?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
      <motion.g
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        <path
          d="M 0,0 L 4,-5 L 6,-3 L 11,-8 L 13,-5 L 19,-7 L 26,0 L 19,7 L 13,5 L 11,8 L 6,3 L 4,5 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        <path
          d="M 1,0 L 23,0 M 6,0 L 10,-4 M 12,0 L 16,-4 M 17,0 L 20,-3 M 6,0 L 10,4 M 12,0 L 16,4 M 17,0 L 20,3"
          fill="none"
          stroke="#000000"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </motion.g>
    </g>
  );
}

function AnimatedHookThorn({
  x,
  y,
  rotate = 0,
  scale = 1,
  delay = 0,
}: {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
  delay?: number;
}) {
  /* Positionnement strict dans un <g> parent pour que tous les pics s'affichent au bon endroit */
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
      <motion.path
        d="M -4,0 C -1,-3 2,-8 6,-13 C 4,-6 3,-2 5,1 Z"
        fill="#000000"
        stroke="#000000"
        strokeWidth="0.7"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay, ease: "easeOut" }}
      />
    </g>
  );
}

/* ============================================================================
   INTRODUCTION CINÉMATOGRAPHIQUE SUR FOND BLANC PUR (ZÉRO GRAIN, ZÉRO GRILLE)
   ============================================================================ */
function HelmetCinemaIntro({ onComplete }: { onComplete: () => void }) {
  /*
    Phase 0 (0.0s -> 1.8s) : "Paris — Atelier" au centre sur fond blanc pur
    Phase 1 (1.8s -> 7.0s) : Floraison de la couronne complète (ronces, 42 pics, feuilles, 5 roses) + Helmet
    Phase 3 (7.0s -> 8.9s) : Ouverture fluide des deux volets blancs vers la gauche et la droite
  */
  const [phase, setPhase] = useState<0 | 1 | 3>(0);
  const [counter, setCounter] = useState<number>(0);
  const completedRef = useRef(false);

  const finishIntro = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    const duration = 6600;
    const startTime = performance.now();
    let raf: number;

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 2.3);
      setCounter(Math.floor(eased * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(updateCounter);
      } else {
        setCounter(100);
      }
    };

    raf = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1750);
    const t2 = setTimeout(() => setPhase(3), 7000);
    const t3 = setTimeout(() => finishIntro(), 8850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const formattedCounter = String(counter).padStart(3, "0");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        pointerEvents: phase === 3 ? "none" : "auto",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* VOLET BLANC GAUCHE (S'ouvre à la fin) */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: phase === 3 ? "-102%" : "0%" }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "50.2%",
          backgroundColor: "#ffffff",
        }}
      />

      {/* VOLET BLANC DROIT (S'ouvre à la fin) */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: phase === 3 ? "102%" : "0%" }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "50.2%",
          backgroundColor: "#ffffff",
        }}
      />

      {/* EN-TÊTE HAUT CENTRÉ : UNIQUEMENT "EDITION -01" AU MILIEU EN HAUT */}
      <motion.div
        animate={{ opacity: phase === 3 ? 0 : 1 }}
        transition={{ duration: 0.45 }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{
            position: "absolute",
            top: "clamp(26px, 4vw, 44px)",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#000000",
            fontSize: "11px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          Edition -01
        </motion.div>

        {/* Compteur de Floraison en bas à gauche */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          style={{
            position: "absolute",
            bottom: "clamp(24px, 4vw, 44px)",
            left: "clamp(24px, 4.2vw, 52px)",
            color: "#000000",
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "clamp(18px, 2.2vw, 26px)",
              letterSpacing: "0.18em",
            }}
          >
            [{formattedCounter}]
          </span>
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#525252",
            }}
          >
            {phase === 0 ? "Paris — Atelier" : "Floraison des Ronces"}
          </span>
        </motion.div>
      </motion.div>

      {/* SCÈNE CENTRALE : "PARIS — ATELIER" PUIS COURONNE DE RONCES COMPLÈTE AVEC TOUS LES PICS */}
      <motion.div
        animate={{
          opacity: phase === 3 ? 0 : 1,
          scale: phase === 3 ? 1.06 : 1,
        }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          pointerEvents: "none",
        }}
      >
        {/* Début de l'animation : uniquement "Paris — Atelier" */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="paris-atelier-intro"
              initial={{ opacity: 0, letterSpacing: "0.6em", y: 8 }}
              animate={{ opacity: 1, letterSpacing: "0.42em", y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                color: "#000000",
                fontSize: "clamp(12px, 1.4vw, 15px)",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Paris — Atelier
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floraison de la Couronne de Ronces Barbelées (Exactement comme les cadrans du menu) */}
        {phase >= 1 && (
          <div
            style={{
              position: "relative",
              width: "min(92vw, 760px)",
              height: "clamp(250px, 42vw, 360px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 440 180"
              preserveAspectRatio="xMidYMid meet"
              className="helmet-ornament-svg"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                maxWidth: "none",
                maxHeight: "none",
                overflow: "visible",
              }}
            >
              {/* 1. Sarments de ronces noueux et brisés */}
              <g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M 48,94 L 44,74 L 53,54 L 72,38 L 104,25 L 146,18 L 196,16 L 248,18 L 298,23 L 344,33 L 378,49 L 398,70 L 403,92 L 395,115 L 374,134 L 336,149 L 284,158 L 222,160 L 158,156 L 106,145 L 68,128 L 52,110 Z"
                  strokeWidth="3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
                />

                <motion.path
                  d="M 56,80 L 66,55 L 94,35 L 138,24 L 192,23 L 252,27 L 312,26 L 362,38 L 392,58 L 406,84 L 398,108 L 378,126 L 342,142 L 292,150 L 234,151 L 172,161 L 116,152 L 76,136 L 54,114 L 50,95 Z"
                  strokeWidth="2.3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 3.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                />

                <motion.path
                  d="M 68,102 L 65,78 L 78,56 L 112,38 L 164,29 L 226,28 L 286,32 L 338,44 L 370,64 L 380,88 L 372,114 L 346,133 L 298,144 L 238,146 L 176,144 L 122,136 L 84,121 Z"
                  strokeWidth="1.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2.8, delay: 0.4, ease: "easeInOut" }}
                />

                {/* Rameaux sauvages et griffes intérieures */}
                <motion.path
                  d="M 104,35 L 74,27 L 48,25 L 24,29 L 8,37 L 14,46"
                  strokeWidth="2.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.9 }}
                />
                <motion.path
                  d="M 344,33 L 316,42 L 290,54 L 266,68 L 252,67 L 246,62"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 1.05 }}
                />
                <motion.path
                  d="M 314,43 L 296,58 L 282,72"
                  strokeWidth="1.6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 1.2 }}
                />
                <motion.path
                  d="M 352,142 L 362,116 L 360,88 L 348,64 L 332,48"
                  strokeWidth="2.1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.1 }}
                />
                <motion.path
                  d="M 116,145 L 154,134 L 204,132 L 258,138 L 308,152 L 338,162"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.25 }}
                />
                <motion.path
                  d="M 82,134 L 106,154 L 136,164 M 228,151 L 202,164 L 178,168"
                  strokeWidth="1.7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3, delay: 1.35 }}
                />
                <motion.path
                  d="M 84,98 L 106,108 L 122,104 L 120,96 M 92,122 L 116,118 L 132,126"
                  strokeWidth="1.7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3, delay: 1.4 }}
                />
              </g>

              {/* 2. LES 42 PICS ACÉRÉS / BARBELÉS ORGANIQUES (Tous visibles autour des ronces) */}
              {/* Épines supérieures */}
              <AnimatedHookThorn x={118} y={22} rotate={-15} scale={1.15} delay={0.7} />
              <AnimatedHookThorn x={136} y={26} rotate={165} scale={0.95} delay={0.75} />
              <AnimatedHookThorn x={156} y={18} rotate={10} scale={1.2} delay={0.8} />
              <AnimatedHookThorn x={176} y={28} rotate={195} scale={1} delay={0.85} />
              <AnimatedHookThorn x={232} y={18} rotate={-20} scale={1.1} delay={0.9} />
              <AnimatedHookThorn x={278} y={21} rotate={15} scale={1.25} delay={0.95} />
              <AnimatedHookThorn x={296} y={29} rotate={190} scale={1} delay={1.0} />
              <AnimatedHookThorn x={322} y={28} rotate={25} scale={1.2} delay={1.05} />
              <AnimatedHookThorn x={348} y={34} rotate={35} scale={1.15} delay={1.1} />
              <AnimatedHookThorn x={368} y={42} rotate={45} scale={1.2} delay={1.15} />

              {/* Épines sur les branches plongeantes intérieures */}
              <AnimatedHookThorn x={302} y={47} rotate={145} scale={0.95} delay={1.2} />
              <AnimatedHookThorn x={282} y={58} rotate={-45} scale={0.95} delay={1.25} />
              <AnimatedHookThorn x={264} y={66} rotate={135} scale={0.9} delay={1.3} />
              <AnimatedHookThorn x={292} y={62} rotate={120} scale={0.85} delay={1.35} />

              {/* Épines du flanc droit */}
              <AnimatedHookThorn x={392} y={58} rotate={65} scale={1.2} delay={1.4} />
              <AnimatedHookThorn x={402} y={76} rotate={85} scale={1.25} delay={1.45} />
              <AnimatedHookThorn x={404} y={96} rotate={100} scale={1.2} delay={1.5} />
              <AnimatedHookThorn x={396} y={114} rotate={115} scale={1.15} delay={1.55} />
              <AnimatedHookThorn x={378} y={74} rotate={-95} scale={1} delay={1.6} />
              <AnimatedHookThorn x={376} y={98} rotate={-80} scale={1.05} delay={1.65} />
              <AnimatedHookThorn x={358} y={78} rotate={-110} scale={0.95} delay={1.7} />
              <AnimatedHookThorn x={360} y={106} rotate={75} scale={0.95} delay={1.75} />

              {/* Épines inférieures */}
              <AnimatedHookThorn x={380} y={130} rotate={135} scale={1.2} delay={1.8} />
              <AnimatedHookThorn x={356} y={142} rotate={150} scale={1.15} delay={1.85} />
              <AnimatedHookThorn x={324} y={152} rotate={165} scale={1.2} delay={1.9} />
              <AnimatedHookThorn x={294} y={144} rotate={-15} scale={1} delay={1.95} />
              <AnimatedHookThorn x={272} y={158} rotate={175} scale={1.25} delay={2.0} />
              <AnimatedHookThorn x={244} y={146} rotate={10} scale={1} delay={2.05} />
              <AnimatedHookThorn x={212} y={160} rotate={185} scale={1.2} delay={2.1} />
              <AnimatedHookThorn x={182} y={144} rotate={-10} scale={1.05} delay={2.15} />
              <AnimatedHookThorn x={158} y={158} rotate={195} scale={1.2} delay={2.2} />
              <AnimatedHookThorn x={126} y={152} rotate={205} scale={1.15} delay={2.25} />
              <AnimatedHookThorn x={96} y={142} rotate={215} scale={1.15} delay={2.3} />

              {/* Épines du flanc gauche et du rameau libre */}
              <AnimatedHookThorn x={68} y={128} rotate={230} scale={1.2} delay={2.35} />
              <AnimatedHookThorn x={52} y={108} rotate={255} scale={1.2} delay={2.4} />
              <AnimatedHookThorn x={46} y={84} rotate={275} scale={1.15} delay={2.45} />
              <AnimatedHookThorn x={56} y={50} rotate={305} scale={1.15} delay={2.5} />
              <AnimatedHookThorn x={68} y={26} rotate={-15} scale={1} delay={2.55} />
              <AnimatedHookThorn x={42} y={26} rotate={-25} scale={1.05} delay={2.6} />
              <AnimatedHookThorn x={22} y={30} rotate={155} scale={0.95} delay={2.65} />

              {/* 3. Feuillages dentelés et nervurés */}
              <AnimatedJaggedLeaf x={8} y={38} scale={0.82} rotate={135} delay={1.3} />
              <AnimatedJaggedLeaf x={32} y={28} scale={0.72} rotate={115} delay={1.4} />
              <AnimatedJaggedLeaf x={82} y={24} scale={0.88} rotate={-155} delay={1.5} />
              <AnimatedJaggedLeaf x={98} y={22} scale={0.76} rotate={-125} delay={1.6} />
              <AnimatedJaggedLeaf x={110} y={76} scale={0.82} rotate={28} delay={1.7} />
              <AnimatedJaggedLeaf x={114} y={112} scale={0.85} rotate={-58} delay={1.8} />
              <AnimatedJaggedLeaf x={304} y={54} scale={0.75} rotate={148} delay={1.9} />
              <AnimatedJaggedLeaf x={346} y={102} scale={0.76} rotate={-138} delay={2.0} />
              <AnimatedJaggedLeaf x={136} y={154} scale={0.92} rotate={112} delay={2.1} />
              <AnimatedJaggedLeaf x={152} y={152} scale={0.8} rotate={62} delay={2.2} />
              <AnimatedJaggedLeaf x={218} y={140} scale={0.82} rotate={-72} delay={2.3} />
              <AnimatedJaggedLeaf x={230} y={150} scale={0.78} rotate={38} delay={2.4} />
              <AnimatedJaggedLeaf x={302} y={154} scale={0.88} rotate={118} delay={2.5} />
              <AnimatedJaggedLeaf x={316} y={150} scale={0.86} rotate={42} delay={2.6} />

              {/* 4. Éclosion des 5 Roses Gravées */}
              <AnimatedEngravedRose x={202} y={22} scale={0.96} rotate={-10} delay={1.0} />
              <AnimatedEngravedRose x={248} y={36} scale={0.9} rotate={16} delay={1.3} />
              <AnimatedEngravedRose x={76} y={60} scale={0.94} rotate={-20} delay={1.6} />
              <AnimatedEngravedRose x={56} y={88} scale={0.88} rotate={14} delay={1.85} />
              <AnimatedEngravedRose x={84} y={86} scale={0.8} rotate={-8} delay={2.1} />
            </svg>

            {/* Logo Calligraphique Central 1610 Cancellaresca */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "relative",
                zIndex: 10,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(72px, 14vw, 185px)",
                  color: "#000000",
                  lineHeight: 1.04,
                  display: "block",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.03em",
                }}
              >
                Helmet
              </span>

              <motion.span
                initial={{ opacity: 0, letterSpacing: "0.85em" }}
                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                transition={{ duration: 1.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "block",
                  fontSize: "clamp(10px, 1.15vw, 13px)",
                  color: "#171717",
                  marginTop: "8px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Haute Couture
              </motion.span>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* BOUTON "ENTER ATELIER" EN BAS À DROITE */}
      {phase < 3 && (
        <motion.button
          type="button"
          onClick={finishIntro}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.04 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            bottom: "clamp(24px, 4vw, 44px)",
            right: "clamp(24px, 4.2vw, 52px)",
            zIndex: 30,
            background: "#ffffff",
            border: "1px solid #000000",
            color: "#000000",
            padding: "8px 16px",
            fontSize: "10px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Enter Atelier →
        </motion.button>
      )}
    </div>
  );
}

/* ============================================================================
   PAGE D'ACCUEIL PRINCIPALE
   ============================================================================ */
export default function Home() {
  const [showIntro, setShowIntro] = useState(!introPlayedInMemory);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isMutedByUserRef = useRef(false);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("helmet_cart") || localStorage.getItem("cart") || "[]";
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) {
        const total = saved.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0);
        setCartCount(total);
      }
    } catch {
      setCartCount(0);
    }

    let isMounted = true;

    const initWebAudio = async () => {
      if (isInitializedRef.current || !isMounted) return;
      isInitializedRef.current = true;

      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx: AudioContext = new AudioCtx();
        audioCtxRef.current = ctx;

        let arrayBuffer: ArrayBuffer | null = null;
        for (const path of AUDIO_PATHS) {
          try {
            const res = await fetch(path);
            if (res.ok) {
              arrayBuffer = await res.arrayBuffer();
              break;
            }
          } catch {}
        }

        if (!arrayBuffer || !isMounted) return;

        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        if (!isMounted) return;

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.7;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);

        if (ctx.state === "running" && !isMutedByUserRef.current) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      } catch {
        setIsPlaying(false);
      }
    };

    initWebAudio();

    const unlockOnInteraction = async () => {
      if (!audioCtxRef.current) {
        await initWebAudio();
      }
      if (
        audioCtxRef.current &&
        audioCtxRef.current.state === "suspended" &&
        !isMutedByUserRef.current
      ) {
        audioCtxRef.current
          .resume()
          .then(() => {
            if (isMounted) setIsPlaying(true);
          })
          .catch(() => {});
      }
    };

    window.addEventListener("click", unlockOnInteraction, { once: true });
    window.addEventListener("touchstart", unlockOnInteraction, { once: true });

    const handleVisibility = () => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (document.hidden || document.visibilityState === "hidden") {
        ctx.suspend().catch(() => {});
        setIsPlaying(false);
      } else if (!isMutedByUserRef.current) {
        ctx
          .resume()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isMounted = false;
      window.removeEventListener("click", unlockOnInteraction);
      window.removeEventListener("touchstart", unlockOnInteraction);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const toggleAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (isPlaying) {
      isMutedByUserRef.current = true;
      await ctx.suspend();
      setIsPlaying(false);
    } else {
      isMutedByUserRef.current = false;
      await ctx.resume();
      setIsPlaying(true);
    }
  };

  const handleIntroComplete = () => {
    introPlayedInMemory = true;
    setShowIntro(false);
  };

  return (
    <main className="helmet-home-shell">
      {showIntro && <HelmetCinemaIntro onComplete={handleIntroComplete} />}

      <AnimatePresence>
        {hoveredItem && !infoOpen && (
          <motion.div
            key={hoveredItem}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.22, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={hoveredItem}
              alt=""
              style={{
                width: "clamp(260px, 28vw, 380px)",
                height: "clamp(340px, 36vw, 480px)",
                objectFit: "cover",
                filter: "grayscale(100%) contrast(1.08)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {infoOpen && (
          <motion.div
            key="faq-overlay"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="helmet-faq-overlay"
          >
            <div style={{ maxWidth: "780px", margin: "0 auto" }}>
              <header className="helmet-page-header">
                <div style={{ justifySelf: "start" }}>
                  <button
                    type="button"
                    onClick={() => setInfoOpen(false)}
                    className="helmet-zoom-link"
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.24em",
                      padding: 0,
                      color: "#000000",
                    }}
                  >
                    ← Back To Menu
                  </button>
                </div>

                <div style={{ justifySelf: "center", textAlign: "center" }}>
                  <span
                    className="font-cancellaresca"
                    style={{
                      fontSize: "clamp(34px, 4.8vw, 52px)",
                      lineHeight: 1,
                      display: "block",
                    }}
                  >
                    Helmet
                  </span>
                </div>

                <div style={{ justifySelf: "end" }}>
                  <button
                    type="button"
                    onClick={() => setInfoOpen(false)}
                    className="helmet-zoom-link"
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.24em",
                      padding: 0,
                      color: "#000000",
                    }}
                  >
                    Close [X]
                  </button>
                </div>
              </header>

              <div style={{ textAlign: "center", marginBottom: "48px", marginTop: "16px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.35em",
                    color: "#737373",
                    marginBottom: "8px",
                  }}
                >
                  Paris — Atelier / Edition -01
                </p>
                <h1
                  style={{
                    fontSize: "16px",
                    textTransform: "uppercase",
                    letterSpacing: "0.42em",
                    margin: 0,
                  }}
                >
                  INFO & FAQ
                </h1>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "38px" }}>
                {HELMET_FAQ_SECTIONS.map((sec, idx) => (
                  <section
                    key={idx}
                    style={{
                      borderBottom: "1px solid #e5e5e5",
                      paddingBottom: "30px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "13px",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "#000000",
                        marginBottom: "14px",
                      }}
                    >
                      {sec.title}
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          style={{
                            fontSize: "13.5px",
                            lineHeight: 1.8,
                            letterSpacing: "0.06em",
                            color: "#262626",
                            margin: 0,
                          }}
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div style={{ marginTop: "48px", textAlign: "center" }}>
                <Link
                  href="/service"
                  className="helmet-btn-black"
                  style={{ maxWidth: "340px" }}
                >
                  Contact Client Service
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="helmet-home-topbar">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontSize: "11px",
            letterSpacing: "0.28em",
            color: "#171717",
            textTransform: "uppercase",
            justifySelf: "start",
          }}
        >
          <span>Paris — Atelier</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "0.24em", color: "#525252" }}>
              Edition -01
            </span>
            <button
              type="button"
              onClick={() => setShowIntro(true)}
              className="helmet-zoom-link"
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                fontSize: "9px",
                letterSpacing: "0.22em",
                color: "#8a8a8a",
                textTransform: "uppercase",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              title="Rejouer l'animation d'ouverture"
            >
              [Intro]
            </button>
          </div>
        </div>

        <div style={{ justifySelf: "center" }}>
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            className="helmet-zoom-link"
            style={{
              background: "transparent",
              border: "none",
              padding: "6px 12px",
              fontSize: "12px",
              letterSpacing: "0.34em",
              color: "#000000",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Info
          </button>
        </div>

        <div style={{ justifySelf: "end" }}>
          <Link
            href="/cart"
            className="helmet-zoom-link"
            style={{
              fontSize: "12px",
              letterSpacing: "0.24em",
              color: "#000000",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              textTransform: "uppercase",
              padding: "6px 4px",
            }}
          >
            <svg
              width="16"
              height="16"
              style={{ width: "16px", height: "16px", minWidth: "16px", color: "#000000" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l1 12H5L6 8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      <div className="helmet-sketch-stage">
        <nav className="helmet-sketch-nav">
          <div className="helmet-sketch-left">
            <Link
              href="/shop"
              onMouseEnter={() => setHoveredItem("/product1.jpg")}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                fontSize: "clamp(11.5px, 1.15vw, 13.5px)",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "#000000",
              }}
            >
              <LouisXVIFrame variant="menu">Shop</LouisXVIFrame>
            </Link>

            <Link
              href="/helmet"
              onMouseEnter={() => setHoveredItem("/product2.jpg")}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                fontSize: "clamp(11.5px, 1.15vw, 13.5px)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#000000",
              }}
            >
              <LouisXVIFrame variant="menu">Helmet Gallery</LouisXVIFrame>
            </Link>
          </div>

          <div className="helmet-sketch-center">
            <Link href="/helmet" className="helmet-logo-zoom">
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(66px, 10vw, 142px)",
                  color: "#000000",
                  display: "block",
                  lineHeight: 1.06,
                  whiteSpace: "nowrap",
                }}
              >
                Helmet
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(11px, 1.05vw, 13.5px)",
                  letterSpacing: "0.46em",
                  color: "#171717",
                  marginTop: "6px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Haute Couture
              </span>
            </Link>
          </div>

          <div className="helmet-sketch-right">
            <Link
              href="/service"
              style={{
                fontSize: "clamp(11.5px, 1.15vw, 13.5px)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#000000",
              }}
            >
              <LouisXVIFrame variant="menu">Client Service</LouisXVIFrame>
            </Link>

            <Link
              href="/cart"
              style={{
                fontSize: "clamp(11.5px, 1.15vw, 13.5px)",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "#000000",
              }}
            >
              <LouisXVIFrame variant="menu">
                <span>Cart</span>
                <span>[{cartCount}]</span>
              </LouisXVIFrame>
            </Link>
          </div>
        </nav>
      </div>

      <footer className="helmet-home-footer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "11px",
            letterSpacing: "0.26em",
            color: "#171717",
            justifySelf: "start",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <a
            href="https://www.instagram.com/helmet.hautecouture/"
            target="_blank"
            rel="noreferrer"
            className="helmet-zoom-link"
          >
            Instagram
          </a>
          <span style={{ color: "#a3a3a3" }}>/</span>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noreferrer"
            className="helmet-zoom-link"
          >
            YouTube
          </a>
        </div>

        <div style={{ justifySelf: "center" }}>
          <button
            type="button"
            onClick={toggleAudio}
            className="helmet-zoom-link"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#171717",
            }}
            title={isPlaying ? "Sound On (70%)" : "Sound Off"}
          >
            <svg
              width="26"
              height="26"
              style={{ width: "26px", height: "26px", minWidth: "26px" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 15v-3a8 8 0 0 1 16 0v3" />
              <rect x="2.5" y="13.5" width="3.5" height="6.5" rx="1.5" fill="currentColor" />
              <rect x="18" y="13.5" width="3.5" height="6.5" rx="1.5" fill="currentColor" />
            </svg>
            {!isPlaying && (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "1.5px",
                    backgroundColor: "#dc2626",
                    transform: "rotate(45deg)",
                    display: "block",
                  }}
                />
              </span>
            )}
          </button>
        </div>

        <div
          style={{
            textAlign: "right",
            fontSize: "11px",
            letterSpacing: "0.26em",
            color: "#171717",
            justifySelf: "end",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <span className="hidden sm:inline">© Helmet All Rights Reserved</span>
          <span className="sm:hidden">© Helmet</span>
        </div>
      </footer>
    </main>
  );
}