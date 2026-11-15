"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const AUDIO_PATHS = [
  "/ambiante.mp3",
  "/ambiance.mp3",
  "/ambient.mp3",
  "/ambiante.mp3.mp3",
  "/ambiance.mp3.mp3",
];

let introPlayedInMemory = false;

export default function Home() {
  const [loading, setLoading] = useState(!introPlayedInMemory);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

    let timer: NodeJS.Timeout;
    if (introPlayedInMemory) {
      setLoading(false);
    } else {
      timer = setTimeout(() => {
        introPlayedInMemory = true;
        setLoading(false);
      }, 2000);
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
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended" && !isMutedByUserRef.current) {
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

    const forceSuspend = () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend().catch(() => {});
        setIsPlaying(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", forceSuspend);
    window.addEventListener("blur", forceSuspend);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      window.removeEventListener("click", unlockOnInteraction);
      window.removeEventListener("touchstart", unlockOnInteraction);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", forceSuspend);
      window.removeEventListener("blur", forceSuspend);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
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
    <main className="helmet-home-shell" style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}>
      {/* APERÇU FANTÔME AVEC ZOOM FLUIDE EN ARRIÈRE-PLAN */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            key={hoveredItem}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.12, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
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
                width: "380px",
                height: "480px",
                objectFit: "cover",
                filter: "grayscale(100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTRO CINÉMATOGRAPHIQUE */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              padding: "0 16px",
            }}
          >
            <motion.div
              initial={{ scale: 1.22, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(84px, 16vw, 240px)",
                  letterSpacing: "0.03em",
                  color: "#000000",
                  display: "block",
                  lineHeight: 1.15,
                  padding: "12px 0",
                  whiteSpace: "nowrap",
                }}
              >
                Helmet
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  letterSpacing: "0.5em",
                  color: "#404040",
                  marginTop: "8px",
                  textTransform: "uppercase",
                }}
              >
                Haute Couture
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER HAUT : COIN GAUCHE ET COIN DROIT */}
      <header
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "28px 24px 0 24px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "#262626",
            textTransform: "uppercase",
          }}
        >
          <span>Paris — Atelier</span>
          <span style={{ fontSize: "9px", letterSpacing: "0.25em", color: "#525252" }}>
            Edition -01
          </span>
        </div>

        <div
          style={{
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "#262626",
            textTransform: "uppercase",
          }}
        >
          <span>Info</span>
        </div>
      </header>

      {/* CORPS DE PAGE : ORGANISATION EXACTE DE TON DESSIN (LIENS À GAUCHE & DROITE DU LOGO CENTRAL) */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* LIENS DE GAUCHE : Shop & Helmet Gallery */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              justifySelf: "start",
            }}
          >
            <Link
              href="/shop"
              onMouseEnter={() => setHoveredItem("/product1.jpg")}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                fontSize: "13px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#171717",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
              className="hover:opacity-60 hover:translate-x-1"
            >
              Shop
            </Link>

            <Link
              href="/helmet"
              onMouseEnter={() => setHoveredItem("/product2.jpg")}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                fontSize: "13px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#171717",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
              className="hover:opacity-60 hover:translate-x-1"
            >
              Helmet Gallery
            </Link>
          </div>

          {/* LOGO CENTRAL : Helmet Haute Couture (Police Calligraphique inchangée) */}
          <div style={{ textAlign: "center", justifySelf: "center" }}>
            <Link href="/helmet" style={{ display: "inline-block", textDecoration: "none" }}>
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(64px, 11vw, 150px)",
                  letterSpacing: "0.04em",
                  color: "#000000",
                  display: "block",
                  lineHeight: 1.1,
                }}
              >
                Helmet
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  letterSpacing: "0.45em",
                  color: "#404040",
                  marginTop: "6px",
                  textTransform: "uppercase",
                }}
              >
                Haute Couture
              </span>
            </Link>
          </div>

          {/* LIENS DE DROITE : Client Service & Cart */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              justifySelf: "end",
              alignItems: "flex-end",
            }}
          >
            <Link
              href="/service"
              style={{
                fontSize: "13px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#171717",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
              className="hover:opacity-60 hover:-translate-x-1"
            >
              Client Service
            </Link>

            <Link
              href="/cart"
              style={{
                fontSize: "13px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#171717",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
              className="hover:opacity-60 hover:-translate-x-1"
            >
              <span>Cart</span>
              <svg
                width="16"
                height="16"
                style={{ width: "16px", height: "16px", minWidth: "16px", color: "#000000" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span style={{ fontWeight: 600 }}>[{cartCount}]</span>
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER BAS : Instagram/YouTube à gauche, Casque audio au centre, Copyright à droite */}
      <footer
        style={{
          position: "relative",
          zIndex: 20,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "20px 24px 28px 24px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "11px",
            letterSpacing: "0.28em",
            color: "#404040",
            justifySelf: "start",
            textTransform: "uppercase",
          }}
        >
          <a href="https://www.instagram.com/helmet.hautecouture/" target="_blank" rel="noreferrer" className="hover:text-black">
            Instagram
          </a>
          <span style={{ color: "#a3a3a3" }}>/</span>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="hover:text-black">
            YouTube
          </a>
        </div>

        {/* CASQUE AUDIO FIXE AU CENTRE */}
        <div style={{ justifySelf: "center" }}>
          <button
            type="button"
            onClick={toggleAudio}
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
            letterSpacing: "0.28em",
            color: "#404040",
            justifySelf: "end",
            textTransform: "uppercase",
          }}
        >
          <span>© Helmet All Rights Reserved</span>
        </div>
      </footer>
    </main>
  );
}