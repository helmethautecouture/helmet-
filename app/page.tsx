"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LouisXVIFrame from "./LouisXVIFrame";
import AtelierAtmosphere from "./AtelierAtmosphere";

const AUDIO_PATHS = [
  "/ambiante.mp3",
  "/ambiance.mp3",
  "/ambient.mp3",
  "/ambiante.mp3.mp3",
  "/ambiance.mp3.mp3",
];

const VIDEO_PATHS = [
  "/menu-bg.mp4",
  "/video.mp4",
  "/bg.mp4",
  "/menu.mp4",
  "/background.mp4",
  "/intro.mp4",
];

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@HELMETPRODUCTION-s8c";

let introPlayedInMemory = false;

const HELMET_FAQ_SECTIONS = [
  {
    title: "ATELIER & PRODUCTION",
    paragraphs: [
      "Helmet Haute Couture is an independent label founded and directed in Paris, France. We have no corporate cosign, external investors, or third-party retailers.",
      "Every garment is handcrafted in-house in France using premium Italian-woven 100% cotton fabrics. Because each piece is produced manually with strict attention to detail, please allow 2–3 weeks for your order to be prepared and shipped.",
      "We are happy to update you personally throughout the process or answer any questions about your piece via our Client Service.",
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
      "Return shipping costs to Paris remain the responsibility of the buyer. To contact us regarding an order, reach out directly through our Client Service.",
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
        fill="#050505"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M -16,-7 C -13,-16 -2,-19 9,-16 C 16,-13 19,-4 16,5 M -17,3 C -14,14 -3,18 8,14 C 15,11 19,2 15,-6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: delay + 0.2, ease: "easeInOut" }}
      />
      <motion.path
        d="M -12,-3 L -7,-12 L 4,-13 L 12,-7 L 11,4 L 3,11 L -8,9 L -13,1 Z"
        fill="#050505"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.3, delay: delay + 0.35, ease: "easeInOut" }}
      />
      <motion.path
        d="M -9,-8 L -2,-11 L 5,-9 L 2,-6 Z M 7,-3 L 11,2 L 5,8 L 4,3 Z M -10,2 L -5,8 L 1,7 L -4,3 Z"
        fill="#ffffff"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.65 }}
      />
      <motion.path
        d="M -6,-1 L -2,-6 L 5,-5 L 7,1 L 2,5 L -4,4 L -5,0 L 0,-2 L 3,0 L 0,2"
        fill="none"
        stroke="#ffffff"
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
          fill="#050505"
          stroke="#ffffff"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        <path
          d="M 1,0 L 23,0 M 6,0 L 10,-4 M 12,0 L 16,-4 M 17,0 L 20,-3 M 6,0 L 10,4 M 12,0 L 16,4 M 17,0 L 20,3"
          fill="none"
          stroke="#ffffff"
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
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
      <motion.path
        d="M -4,0 C -1,-3 2,-8 6,-13 C 4,-6 3,-2 5,1 Z"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="0.7"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay, ease: "easeOut" }}
      />
    </g>
  );
}

function HelmetCinemaIntro({ onComplete }: { onComplete: () => void }) {
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
          backgroundColor: "#050505",
        }}
      />

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
          backgroundColor: "#050505",
        }}
      />

      <motion.div
        animate={{ opacity: phase === 3 ? 0 : 1 }}
        transition={{ duration: 0.45 }}
        style={{
          position: "absolute",
          top: "clamp(24px, 4vw, 44px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          color: "#ffffff",
          fontSize: "12px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        Edition -01
      </motion.div>

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
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="paris-atelier-intro"
              initial={{ opacity: 0, letterSpacing: "0.5em", y: 8 }}
              animate={{ opacity: 1, letterSpacing: "0.34em", y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                color: "#ffffff",
                fontSize: "clamp(13px, 1.5vw, 16px)",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Paris — Atelier
            </motion.div>
          )}
        </AnimatePresence>

        {phase >= 1 && (
          <div
            style={{
              position: "relative",
              width: "min(92vw, 760px)",
              height: "clamp(230px, 42vw, 360px)",
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
              <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round">
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
                <motion.path d="M 104,35 L 74,27 L 48,25 L 24,29 L 8,37 L 14,46" strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.9 }} />
                <motion.path d="M 344,33 L 316,42 L 290,54 L 266,68 L 252,67 L 246,62" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 1.05 }} />
                <motion.path d="M 314,43 L 296,58 L 282,72" strokeWidth="1.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 1.2 }} />
                <motion.path d="M 352,142 L 362,116 L 360,88 L 348,64 L 332,48" strokeWidth="2.1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.1 }} />
                <motion.path d="M 116,145 L 154,134 L 204,132 L 258,138 L 308,152 L 338,162" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.25 }} />
                <motion.path d="M 82,134 L 106,154 L 136,164 M 228,151 L 202,164 L 178,168" strokeWidth="1.7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, delay: 1.35 }} />
                <motion.path d="M 84,98 L 106,108 L 122,104 L 120,96 M 92,122 L 116,118 L 132,126" strokeWidth="1.7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, delay: 1.4 }} />
              </g>

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
              <AnimatedHookThorn x={302} y={47} rotate={145} scale={0.95} delay={1.2} />
              <AnimatedHookThorn x={282} y={58} rotate={-45} scale={0.95} delay={1.25} />
              <AnimatedHookThorn x={264} y={66} rotate={135} scale={0.9} delay={1.3} />
              <AnimatedHookThorn x={292} y={62} rotate={120} scale={0.85} delay={1.35} />
              <AnimatedHookThorn x={392} y={58} rotate={65} scale={1.2} delay={1.4} />
              <AnimatedHookThorn x={402} y={76} rotate={85} scale={1.25} delay={1.45} />
              <AnimatedHookThorn x={404} y={96} rotate={100} scale={1.2} delay={1.5} />
              <AnimatedHookThorn x={396} y={114} rotate={115} scale={1.15} delay={1.55} />
              <AnimatedHookThorn x={378} y={74} rotate={-95} scale={1} delay={1.6} />
              <AnimatedHookThorn x={376} y={98} rotate={-80} scale={1.05} delay={1.65} />
              <AnimatedHookThorn x={358} y={78} rotate={-110} scale={0.95} delay={1.7} />
              <AnimatedHookThorn x={360} y={106} rotate={75} scale={0.95} delay={1.75} />
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
              <AnimatedHookThorn x={68} y={128} rotate={230} scale={1.2} delay={2.35} />
              <AnimatedHookThorn x={52} y={108} rotate={255} scale={1.2} delay={2.4} />
              <AnimatedHookThorn x={46} y={84} rotate={275} scale={1.15} delay={2.45} />
              <AnimatedHookThorn x={56} y={50} rotate={305} scale={1.15} delay={2.5} />
              <AnimatedHookThorn x={68} y={26} rotate={-15} scale={1} delay={2.55} />
              <AnimatedHookThorn x={42} y={26} rotate={-25} scale={1.05} delay={2.6} />
              <AnimatedHookThorn x={22} y={30} rotate={155} scale={0.95} delay={2.65} />

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

              <AnimatedEngravedRose x={202} y={22} scale={0.96} rotate={-10} delay={1.0} />
              <AnimatedEngravedRose x={248} y={36} scale={0.9} rotate={16} delay={1.3} />
              <AnimatedEngravedRose x={76} y={60} scale={0.94} rotate={-20} delay={1.6} />
              <AnimatedEngravedRose x={56} y={88} scale={0.88} rotate={14} delay={1.85} />
              <AnimatedEngravedRose x={84} y={86} scale={0.8} rotate={-8} delay={2.1} />
            </svg>

            {/* LOGO HELMET HAUTE COUTURE CALIBRÉ POUR TENIR PILE AU MILIEU DU CADRAN */}
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
                justifyContent: "center",
                padding: "0 18%",
              }}
            >
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(42px, 7.6vw, 98px)",
                  color: "#ffffff",
                  lineHeight: 0.98,
                  display: "block",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.03em",
                }}
              >
                Helmet
              </span>

              <motion.span
                initial={{ opacity: 0, letterSpacing: "0.55em" }}
                animate={{ opacity: 1, letterSpacing: "0.34em" }}
                transition={{ duration: 1.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "block",
                  fontSize: "clamp(8.5px, 0.95vw, 11.5px)",
                  color: "#ffffff",
                  marginTop: "4px",
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

      {phase < 3 && (
        <motion.div
          animate={{ opacity: phase === 3 ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            bottom: "clamp(16px, 3.8vw, 44px)",
            left: 0,
            right: 0,
            padding: "0 clamp(14px, 4vw, 52px)",
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div
            style={{
              color: "#ffffff",
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              pointerEvents: "none",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <span style={{ fontSize: "clamp(14px, 2.2vw, 24px)", letterSpacing: "0.1em", flexShrink: 0 }}>
              [{formattedCounter}]
            </span>
            <span
              style={{
                fontSize: "clamp(9.5px, 2.2vw, 11px)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.85)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {phase === 0 ? "Paris — Atelier" : "Floraison des Ronces"}
            </span>
          </div>

          <motion.button
            type="button"
            onClick={finishIntro}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            whileHover={{ opacity: 1, scale: 1.04 }}
            transition={{ duration: 0.4 }}
            style={{
              background: "rgba(5, 5, 5, 0.85)",
              border: "1px solid #ffffff",
              color: "#ffffff",
              padding: "6px 10px",
              fontSize: "9.5px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Enter Atelier →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(!introPlayedInMemory);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [videoIdx, setVideoIdx] = useState(0);
  const [audioIdx, setAudioIdx] = useState(0);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMutedByUserRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const swipeTrackRef = useRef<HTMLDivElement | null>(null);

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

    const startBgVideo = () => {
      const vid = videoRef.current;
      if (!vid) return;
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;
      vid.setAttribute("playsinline", "");
      vid.setAttribute("webkit-playsinline", "");
      vid.play().catch(() => {});
    };
    startBgVideo();

    const tryPlayAudio = () => {
      const aud = audioRef.current;
      if (!aud || isMutedByUserRef.current) return;
      aud.volume = 0.7;
      aud.loop = true;
      if (aud.paused) {
        aud
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };
    tryPlayAudio();

    const unlockOnGesture = () => {
      startBgVideo();
      tryPlayAudio();
    };

    window.addEventListener("touchstart", unlockOnGesture, { passive: true });
    window.addEventListener("touchend", unlockOnGesture, { passive: true });
    window.addEventListener("click", unlockOnGesture);
    window.addEventListener("pointerdown", unlockOnGesture);

    const handleVisibility = () => {
      const aud = audioRef.current;
      if (!aud) return;
      if (document.hidden || document.visibilityState === "hidden") {
        aud.pause();
        setIsPlaying(false);
      } else {
        startBgVideo();
        if (!isMutedByUserRef.current) {
          aud
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("touchstart", unlockOnGesture);
      window.removeEventListener("touchend", unlockOnGesture);
      window.removeEventListener("click", unlockOnGesture);
      window.removeEventListener("pointerdown", unlockOnGesture);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const aud = audioRef.current;
    if (!aud) return;

    if (!aud.paused && isPlaying) {
      isMutedByUserRef.current = true;
      aud.pause();
      setIsPlaying(false);
    } else {
      isMutedByUserRef.current = false;
      aud.volume = 0.7;
      aud
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleIntroComplete = () => {
    introPlayedInMemory = true;
    setShowIntro(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoError = () => {
    if (videoIdx < VIDEO_PATHS.length - 1) {
      setVideoIdx((prev) => prev + 1);
    }
  };

  const handleAudioError = () => {
    if (audioIdx < AUDIO_PATHS.length - 1) {
      setAudioIdx((prev) => prev + 1);
    }
  };

  const handleMobileScroll = () => {
    const el = swipeTrackRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== mobileSlideIndex) {
      setMobileSlideIndex(idx);
    }
  };

  const scrollToMobileSlide = (idx: number) => {
    const el = swipeTrackRef.current;
    if (!el) return;
    el.scrollTo({
      left: idx * el.clientWidth,
      behavior: "smooth",
    });
    setMobileSlideIndex(idx);
  };

  const mobileNavSlides = [
    { href: "/shop", label: "Shop", isShop: true },
    { href: "/helmet", label: "Helmet Gallery", isShop: false },
    { href: "/service", label: "Client Service", isShop: false },
    { href: "/cart", label: `Cart [${cartCount}]`, isShop: false },
  ];

  return (
    <main
      className="helmet-home-shell"
      style={{
        backgroundColor: "#050505",
        color: "#ffffff",
      }}
    >
      <audio
        ref={audioRef}
        key={AUDIO_PATHS[audioIdx]}
        src={AUDIO_PATHS[audioIdx]}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleAudioError}
        style={{ display: "none" }}
      />

      {showIntro && <HelmetCinemaIntro onComplete={handleIntroComplete} />}

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          backgroundColor: "#050505",
          pointerEvents: "none",
        }}
      >
        <video
          ref={videoRef}
          key={VIDEO_PATHS[videoIdx]}
          src={VIDEO_PATHS[videoIdx]}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          onLoadedData={() => videoRef.current?.play().catch(() => {})}
          onError={handleVideoError}
          className="helmet-bg-video"
          style={{
            width: "100vw",
            height: "100dvh",
            objectFit: "cover",
            display: "block",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.24)",
            pointerEvents: "none",
          }}
        />
      </div>

      <AtelierAtmosphere mode="canopy-and-roses" inverted />

      <AnimatePresence>
        {infoOpen && (
          <motion.div
            key="faq-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="helmet-faq-overlay"
          >
            <div style={{ maxWidth: "820px", margin: "0 auto", position: "relative", zIndex: 10 }}>
              <motion.header
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="helmet-page-header"
              >
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
                      letterSpacing: "0.18em",
                      padding: 0,
                      color: "#ffffff",
                    }}
                  >
                    ← Back To Menu
                  </button>
                </div>

                <div style={{ justifySelf: "center", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => setInfoOpen(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "#ffffff",
                    }}
                    title="Return To Menu"
                  >
                    <LouisXVIFrame variant="title" inverted>
                      <span
                        className="font-cancellaresca"
                        style={{
                          fontSize: "clamp(28px, 4.2vw, 46px)",
                          lineHeight: 1,
                          display: "block",
                          color: "#ffffff",
                        }}
                      >
                        Helmet Info
                      </span>
                    </LouisXVIFrame>
                  </button>
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
                      letterSpacing: "0.18em",
                      padding: 0,
                      color: "#ffffff",
                    }}
                  >
                    Close [X]
                  </button>
                </div>
              </motion.header>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ textAlign: "center", marginBottom: "48px", marginTop: "16px" }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.24em",
                    color: "rgba(255,255,255,0.75)",
                    marginBottom: "8px",
                  }}
                >
                  Paris — Atelier / Edition -01
                </p>
                <h1
                  style={{
                    fontSize: "19px",
                    textTransform: "uppercase",
                    letterSpacing: "0.28em",
                    margin: 0,
                    color: "#ffffff",
                  }}
                >
                  INFO & FAQ
                </h1>
              </motion.div>

              <div style={{ display: "flex", flexDirection: "column", gap: "38px" }}>
                {HELMET_FAQ_SECTIONS.map((sec, idx) => (
                  <motion.section
                    key={idx}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.38,
                      delay: 0.14 + idx * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                      paddingBottom: "30px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "16px",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#ffffff",
                        marginBottom: "14px",
                      }}
                    >
                      {sec.title}
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="helmet-readable-text" style={{ margin: 0 }}>
                          {p}
                        </p>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.42 }}
                style={{ marginTop: "48px", textAlign: "center" }}
              >
                <Link
                  href="/service"
                  className="helmet-btn-black"
                  style={{ maxWidth: "340px" }}
                >
                  Contact Client Service
                </Link>
              </motion.div>
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
            fontSize: "clamp(11px, 1.15vw, 12.5px)",
            letterSpacing: "0.2em",
            color: "#ffffff",
            textTransform: "uppercase",
            justifySelf: "start",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          <span>Paris — Atelier</span>
          <span style={{ fontSize: "10.5px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.85)" }}>
            Edition -01
          </span>
          <button
            type="button"
            onClick={() => setShowIntro(true)}
            className="helmet-zoom-link"
            style={{
              background: "transparent",
              border: "none",
              padding: "2px 0",
              fontSize: "10px",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.72)",
              textTransform: "uppercase",
              textDecoration: "underline",
              cursor: "pointer",
              justifyContent: "flex-start",
              width: "fit-content",
            }}
            title="Rejouer l'animation d'ouverture"
          >
            [Intro]
          </button>
        </div>

        <div style={{ justifySelf: "center" }}>
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            className="helmet-zoom-link"
            style={{
              background: "transparent",
              border: "none",
              padding: "8px 16px",
              fontSize: "13px",
              letterSpacing: "0.28em",
              color: "#ffffff",
              textTransform: "uppercase",
              cursor: "pointer",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
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
              fontSize: "13px",
              letterSpacing: "0.2em",
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              textTransform: "uppercase",
              padding: "6px 4px",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            <svg
              width="17"
              height="17"
              style={{ width: "17px", height: "17px", minWidth: "17px", color: "#ffffff" }}
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
        <nav className="helmet-desktop-nav">
          <div className="helmet-sketch-left">
            <Link
              href="/shop"
              style={{
                fontSize: "clamp(15px, 1.5vw, 19px)",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              <LouisXVIFrame variant="menu" inverted>
                Shop
              </LouisXVIFrame>
            </Link>

            <Link
              href="/helmet"
              style={{
                fontSize: "clamp(12px, 1.2vw, 14.5px)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              <LouisXVIFrame variant="menu" inverted>
                Helmet Gallery
              </LouisXVIFrame>
            </Link>
          </div>

          <div className="helmet-sketch-center">
            <Link href="/helmet" className="helmet-logo-zoom">
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(64px, 10vw, 144px)",
                  color: "#ffffff",
                  display: "block",
                  lineHeight: 1.06,
                  whiteSpace: "nowrap",
                  textShadow: "0 4px 20px rgba(0,0,0,0.75)",
                }}
              >
                Helmet
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(11px, 1.05vw, 13.5px)",
                  letterSpacing: "0.42em",
                  color: "#ffffff",
                  marginTop: "6px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  textShadow: "0 2px 12px rgba(0,0,0,0.85)",
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
                fontSize: "clamp(12px, 1.2vw, 14.5px)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              <LouisXVIFrame variant="menu" inverted>
                Client Service
              </LouisXVIFrame>
            </Link>

            <Link
              href="/cart"
              style={{
                fontSize: "clamp(12.5px, 1.25vw, 15px)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              <LouisXVIFrame variant="menu" inverted>
                <span>Cart</span>
                <span>[{cartCount}]</span>
              </LouisXVIFrame>
            </Link>
          </div>
        </nav>

        <div className="helmet-mobile-nav">
          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <Link href="/helmet" className="helmet-logo-zoom">
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(88px, 23vw, 136px)",
                  color: "#ffffff",
                  display: "block",
                  lineHeight: 1.02,
                  whiteSpace: "nowrap",
                  textShadow: "0 4px 24px rgba(0,0,0,0.85)",
                }}
              >
                Helmet
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(12px, 3.2vw, 15px)",
                  letterSpacing: "0.44em",
                  color: "#ffffff",
                  marginTop: "8px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  textShadow: "0 2px 12px rgba(0,0,0,0.9)",
                }}
              >
                Haute Couture
              </span>
            </Link>
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div
              ref={swipeTrackRef}
              onScroll={handleMobileScroll}
              className="helmet-mobile-swipe-track"
            >
              {mobileNavSlides.map((slide, idx) => (
                <div key={idx} className="helmet-mobile-swipe-slide">
                  <Link
                    href={slide.href}
                    style={{
                      fontSize: slide.isShop ? "22px" : "16px",
                      letterSpacing: slide.isShop ? "0.3em" : "0.2em",
                      textTransform: "uppercase",
                      color: "#ffffff",
                    }}
                  >
                    <LouisXVIFrame variant="menu" inverted>
                      {slide.label}
                    </LouisXVIFrame>
                  </Link>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {mobileNavSlides.map((slide, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToMobileSlide(idx)}
                  aria-label={slide.label}
                  style={{
                    width: mobileSlideIndex === idx ? "22px" : "6px",
                    height: "3px",
                    padding: 0,
                    border: "none",
                    backgroundColor:
                      mobileSlideIndex === idx
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.35)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="helmet-home-footer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "clamp(10px, 2.3vw, 11.5px)",
            letterSpacing: "0.14em",
            color: "#ffffff",
            justifySelf: "start",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
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
          <span style={{ color: "rgba(255,255,255,0.6)" }}>/</span>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="helmet-zoom-link"
          >
            YouTube
          </a>
        </div>

        <div style={{ justifySelf: "center", display: "flex", justifyContent: "center" }}>
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
              color: "#ffffff",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))",
            }}
            title={isPlaying ? "Sound On (70%)" : "Sound Off"}
          >
            <svg
              width="24"
              height="24"
              style={{ width: "24px", height: "24px", minWidth: "24px" }}
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
                    width: "26px",
                    height: "1.5px",
                    backgroundColor: "#ffffff",
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
            fontSize: "clamp(9.5px, 2.1vw, 11.5px)",
            letterSpacing: "0.14em",
            color: "#ffffff",
            justifySelf: "end",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "4px",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            style={{ width: "12px", height: "12px", minWidth: "12px" }}
          >
            <circle cx="12" cy="12" r="9.5" />
            <path strokeLinecap="round" d="M14.8 9.2a4.2 4.2 0 1 0 0 5.6" />
          </svg>
          <span className="hidden sm:inline">Helmet Haute Couture All Rights Reserved</span>
          <span className="sm:hidden">Helmet Haute Couture</span>
        </div>
      </footer>
    </main>
  );
}