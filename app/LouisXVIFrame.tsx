"use client";

import React from "react";

interface FrameProps {
  children: React.ReactNode;
  variant?: "menu" | "title";
  inverted?: boolean;
  className?: string;
}

function WoodcutRose({
  x,
  y,
  scale = 1,
  rotate = 0,
  strokeColor = "#000000",
  fillColor = "#ffffff",
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  strokeColor?: string;
  fillColor?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
      <path
        d="M -19,-5 L -16,-16 L -5,-22 L 8,-21 L 19,-14 L 22,-2 L 17,12 L 6,20 L -7,21 L -17,13 L -21,2 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M -16,-7 C -13,-16 -2,-19 9,-16 C 16,-13 19,-4 16,5 M -17,3 C -14,14 -3,18 8,14 C 15,11 19,2 15,-6"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M -12,-3 L -7,-12 L 4,-13 L 12,-7 L 11,4 L 3,11 L -8,9 L -13,1 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M -9,-8 L -2,-11 L 5,-9 L 2,-6 Z M 7,-3 L 11,2 L 5,8 L 4,3 Z M -10,2 L -5,8 L 1,7 L -4,3 Z"
        fill={strokeColor}
      />
      <path
        d="M -6,-1 L -2,-6 L 5,-5 L 7,1 L 2,5 L -4,4 L -5,0 L 0,-2 L 3,0 L 0,2"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function JaggedLeaf({
  x,
  y,
  scale = 1,
  rotate = 0,
  strokeColor = "#000000",
  fillColor = "#ffffff",
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  strokeColor?: string;
  fillColor?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
      <path
        d="M 0,0 L 4,-5 L 6,-3 L 11,-8 L 13,-5 L 19,-7 L 26,0 L 19,7 L 13,5 L 11,8 L 6,3 L 4,5 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M 1,0 L 23,0 M 6,0 L 10,-4 M 12,0 L 16,-4 M 17,0 L 20,-3 M 6,0 L 10,4 M 12,0 L 16,4 M 17,0 L 20,3"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );
}

function HookThorn({
  x,
  y,
  rotate = 0,
  scale = 1,
  color = "#000000",
}: {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
  color?: string;
}) {
  return (
    <path
      transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
      d="M -4,0 C -1,-3 2,-8 6,-13 C 4,-6 3,-2 5,1 Z"
      fill={color}
      stroke={color}
      strokeWidth="0.6"
      strokeLinejoin="round"
    />
  );
}

export default function LouisXVIFrame({
  children,
  variant = "menu",
  inverted = false,
  className = "",
}: FrameProps) {
  const isTitle = variant === "title";

  /* En mode inversé (sur la vidéo du menu) : traits blancs purs et intérieur des roses sombre */
  const strokeColor = inverted ? "#ffffff" : "#000000";
  const fillColor = inverted ? "rgba(8, 8, 8, 0.72)" : "#ffffff";

  const containerStyle: React.CSSProperties = isTitle
    ? {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "clamp(280px, 35vw, 400px)",
        minHeight: "clamp(92px, 10vw, 122px)",
        padding: "24px 62px 20px 68px",
        cursor: "pointer",
        verticalAlign: "middle",
      }
    : {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "clamp(190px, 17.5vw, 242px)",
        height: "clamp(70px, 6.4vw, 84px)",
        padding: "15px 38px 13px 44px",
        cursor: "pointer",
        verticalAlign: "middle",
      };

  return (
    <span className={`helmet-thorn-wrapper ${className}`} style={containerStyle}>
      <svg
        viewBox="0 0 440 180"
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
          filter: inverted ? "drop-shadow(0 2px 10px rgba(0,0,0,0.65))" : "none",
        }}
      >
        <g fill="none" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M 48,94 L 44,74 L 53,54 L 72,38 L 104,25 L 146,18 L 196,16 L 248,18 L 298,23 L 344,33 L 378,49 L 398,70 L 403,92 L 395,115 L 374,134 L 336,149 L 284,158 L 222,160 L 158,156 L 106,145 L 68,128 L 52,110 Z"
            strokeWidth="3"
          />
          <path
            d="M 56,80 L 66,55 L 94,35 L 138,24 L 192,23 L 252,27 L 312,26 L 362,38 L 392,58 L 406,84 L 398,108 L 378,126 L 342,142 L 292,150 L 234,151 L 172,161 L 116,152 L 76,136 L 54,114 L 50,95 Z"
            strokeWidth="2.3"
          />
          <path
            d="M 68,102 L 65,78 L 78,56 L 112,38 L 164,29 L 226,28 L 286,32 L 338,44 L 370,64 L 380,88 L 372,114 L 346,133 L 298,144 L 238,146 L 176,144 L 122,136 L 84,121 Z"
            strokeWidth="1.8"
          />
          <path d="M 104,35 L 74,27 L 48,25 L 24,29 L 8,37 L 14,46" strokeWidth="2.2" />
          <path d="M 344,33 L 316,42 L 290,54 L 266,68 L 252,67 L 246,62" strokeWidth="2" />
          <path d="M 314,43 L 296,58 L 282,72" strokeWidth="1.6" />
          <path d="M 352,142 L 362,116 L 360,88 L 348,64 L 332,48" strokeWidth="2.1" />
          <path d="M 116,145 L 154,134 L 204,132 L 258,138 L 308,152 L 338,162" strokeWidth="2" />
          <path d="M 82,134 L 106,154 L 136,164 M 228,151 L 202,164 L 178,168" strokeWidth="1.7" />
          <path d="M 84,98 L 106,108 L 122,104 L 120,96 M 92,122 L 116,118 L 132,126" strokeWidth="1.7" />
        </g>

        <HookThorn x={118} y={22} rotate={-15} scale={1.15} color={strokeColor} />
        <HookThorn x={136} y={26} rotate={165} scale={0.95} color={strokeColor} />
        <HookThorn x={156} y={18} rotate={10} scale={1.2} color={strokeColor} />
        <HookThorn x={176} y={28} rotate={195} scale={1} color={strokeColor} />
        <HookThorn x={232} y={18} rotate={-20} scale={1.1} color={strokeColor} />
        <HookThorn x={278} y={21} rotate={15} scale={1.25} color={strokeColor} />
        <HookThorn x={296} y={29} rotate={190} scale={1} color={strokeColor} />
        <HookThorn x={322} y={28} rotate={25} scale={1.2} color={strokeColor} />
        <HookThorn x={348} y={34} rotate={35} scale={1.15} color={strokeColor} />
        <HookThorn x={368} y={42} rotate={45} scale={1.2} color={strokeColor} />

        <HookThorn x={302} y={47} rotate={145} scale={0.95} color={strokeColor} />
        <HookThorn x={282} y={58} rotate={-45} scale={0.95} color={strokeColor} />
        <HookThorn x={264} y={66} rotate={135} scale={0.9} color={strokeColor} />
        <HookThorn x={292} y={62} rotate={120} scale={0.85} color={strokeColor} />

        <HookThorn x={392} y={58} rotate={65} scale={1.2} color={strokeColor} />
        <HookThorn x={402} y={76} rotate={85} scale={1.25} color={strokeColor} />
        <HookThorn x={404} y={96} rotate={100} scale={1.2} color={strokeColor} />
        <HookThorn x={396} y={114} rotate={115} scale={1.15} color={strokeColor} />
        <HookThorn x={378} y={74} rotate={-95} scale={1} color={strokeColor} />
        <HookThorn x={376} y={98} rotate={-80} scale={1.05} color={strokeColor} />
        <HookThorn x={358} y={78} rotate={-110} scale={0.95} color={strokeColor} />
        <HookThorn x={360} y={106} rotate={75} scale={0.95} color={strokeColor} />

        <HookThorn x={380} y={130} rotate={135} scale={1.2} color={strokeColor} />
        <HookThorn x={356} y={142} rotate={150} scale={1.15} color={strokeColor} />
        <HookThorn x={324} y={152} rotate={165} scale={1.2} color={strokeColor} />
        <HookThorn x={294} y={144} rotate={-15} scale={1} color={strokeColor} />
        <HookThorn x={272} y={158} rotate={175} scale={1.25} color={strokeColor} />
        <HookThorn x={244} y={146} rotate={10} scale={1} color={strokeColor} />
        <HookThorn x={212} y={160} rotate={185} scale={1.2} color={strokeColor} />
        <HookThorn x={182} y={144} rotate={-10} scale={1.05} color={strokeColor} />
        <HookThorn x={158} y={158} rotate={195} scale={1.2} color={strokeColor} />
        <HookThorn x={126} y={152} rotate={205} scale={1.15} color={strokeColor} />
        <HookThorn x={96} y={142} rotate={215} scale={1.15} color={strokeColor} />

        <HookThorn x={68} y={128} rotate={230} scale={1.2} color={strokeColor} />
        <HookThorn x={52} y={108} rotate={255} scale={1.2} color={strokeColor} />
        <HookThorn x={46} y={84} rotate={275} scale={1.15} color={strokeColor} />
        <HookThorn x={56} y={50} rotate={305} scale={1.15} color={strokeColor} />
        <HookThorn x={68} y={26} rotate={-15} scale={1} color={strokeColor} />
        <HookThorn x={42} y={26} rotate={-25} scale={1.05} color={strokeColor} />
        <HookThorn x={22} y={30} rotate={155} scale={0.95} color={strokeColor} />

        <JaggedLeaf x={8} y={38} scale={0.82} rotate={135} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={32} y={28} scale={0.72} rotate={115} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={82} y={24} scale={0.88} rotate={-155} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={98} y={22} scale={0.76} rotate={-125} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={110} y={76} scale={0.82} rotate={28} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={114} y={112} scale={0.85} rotate={-58} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={304} y={54} scale={0.75} rotate={148} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={346} y={102} scale={0.76} rotate={-138} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={136} y={154} scale={0.92} rotate={112} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={152} y={152} scale={0.8} rotate={62} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={218} y={140} scale={0.82} rotate={-72} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={230} y={150} scale={0.78} rotate={38} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={302} y={154} scale={0.88} rotate={118} strokeColor={strokeColor} fillColor={fillColor} />
        <JaggedLeaf x={316} y={150} scale={0.86} rotate={42} strokeColor={strokeColor} fillColor={fillColor} />

        <WoodcutRose x={202} y={22} scale={0.96} rotate={-10} strokeColor={strokeColor} fillColor={fillColor} />
        <WoodcutRose x={248} y={36} scale={0.9} rotate={16} strokeColor={strokeColor} fillColor={fillColor} />
        <WoodcutRose x={76} y={60} scale={0.94} rotate={-20} strokeColor={strokeColor} fillColor={fillColor} />
        <WoodcutRose x={56} y={88} scale={0.88} rotate={14} strokeColor={strokeColor} fillColor={fillColor} />
        <WoodcutRose x={84} y={86} scale={0.8} rotate={-8} strokeColor={strokeColor} fillColor={fillColor} />
      </svg>

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
          color: strokeColor,
          textShadow: inverted ? "0 2px 10px rgba(0,0,0,0.85)" : "none",
        }}
      >
        {children}
      </span>
    </span>
  );
}