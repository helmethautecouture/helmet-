"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const AUDIO_PATHS = [
  "/ambiante.mp3",
  "/ambiance.mp3",
  "/ambient.mp3",
  "/ambiante.mp3.mp3",
  "/ambiance.mp3.mp3",
];

export default function GlobalAudio() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isMutedByUserRef = useRef(false);
  const isInitializedRef = useRef(false);

  useEffect(() => {
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

    window.addEventListener("click", unlockOnInteraction);
    window.addEventListener("touchstart", unlockOnInteraction);

    // Coupe uniquement si on verrouille l'iPhone ou change d'onglet navigateur
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
    window.addEventListener("pagehide", handleVisibility);

    return () => {
      isMounted = false;
      window.removeEventListener("click", unlockOnInteraction);
      window.removeEventListener("touchstart", unlockOnInteraction);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("pagehide", handleVisibility);
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

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: isHome ? "50%" : "24px",
        transform: isHome ? "translateX(-50%)" : "none",
        zIndex: 45,
        transition: "left 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
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
  );
}