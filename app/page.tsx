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

  const menuLinks = [
    {
      index: "01",
      title: "Shop",
      subtitle: "Collection & Pieces",
      href: "/shop",
      preview: "/product1.jpg",
    },
    {
      index: "02",
      title: "Helmet Gallery",
      subtitle: "Visual Archive — Paris",
      href: "/helmet",
      preview: "/product2.jpg",
    },
    {
      index: "03",
      title: "Client Service",
      subtitle: "Private Concierge",
      href: "/service",
      preview: null,
    },
    {
      index: "04",
      title: "Cart",
      subtitle: `${cartCount} Selected ${cartCount <= 1 ? "Piece" : "Pieces"}`,
      href: "/cart",
      preview: null,
    },
  ];

  return (
    <main className="helmet-home-shell">
      {/* APERÇU FANTÔME AU SURVOL */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            key={hoveredItem}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.08, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
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
                width: "340px",
                height: "440px",
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
                }}
              >
                Haute Couture
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER ARCHITECTURAL 3 COLONNES */}
      <header className="helmet-header-home">
        <div
          style={{
            paddingTop: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "#262626",
            justifySelf: "start",
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>Paris — Atelier</span>
          <span style={{ fontSize: "9px", letterSpacing: "0.25em", color: "#525252", whiteSpace: "nowrap" }}>
            Edition -01
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifySelf: "center" }}>
          <Link
            href="/helmet"
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
                fontSize: "clamp(54px, 8vw, 115px)",
                letterSpacing: "0.04em",
                color: "#000000",
                display: "block",
                lineHeight: 1.12,
                whiteSpace: "nowrap",
              }}
            >
              Helmet
            </span>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                letterSpacing: "0.48em",
                color: "#404040",
                marginTop: "4px",
                whiteSpace: "nowrap",
              }}
            >
              Haute Couture
            </span>
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingTop: "8px", justifySelf: "end" }}>
          <Link
            href="/cart"
            style={{
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "#171717",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <span className="hidden sm:inline">Cart</span>
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
            <span style={{ fontWeight: 600, color: "#000000" }}>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      {/* MENU CENTRAL : SOMMAIRE D'ATELIER */}
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
        <nav className="helmet-summary-nav">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingBottom: "12px",
              borderBottom: "1px solid #d4d4d4",
              fontSize: "10px",
              letterSpacing: "0.45em",
              color: "#525252",
            }}
          >
            <span>Summary</span>
          </div>

          <div>
            {menuLinks.map((item) => (
              <Link
                key={item.index}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.preview)}
                onMouseLeave={() => setHoveredItem(null)}
                className="helmet-summary-row group"
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "28px" }}>
                  <span style={{ fontSize: "10px", letterSpacing: "0.35em", color: "#525252" }}>
                    {item.index}
                  </span>
                  <span style={{ fontSize: "13px", letterSpacing: "0.42em", color: "#171717" }}>
                    {item.title}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#525252" }}>
                    {item.subtitle}
                  </span>
                  <span style={{ fontSize: "12px", color: "#404040" }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* FOOTER SYMÉTRIQUE */}
      <footer className="helmet-footer-home">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "11px",
            letterSpacing: "0.28em",
            color: "#404040",
            justifySelf: "start",
            whiteSpace: "nowrap",
          }}
        >
          <a href="https://www.instagram.com/helmet.hautecouture/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <span style={{ color: "#a3a3a3" }}>/</span>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
            YouTube
          </a>
        </div>

        {/* ICÔNE CASQUE AUDIO AU CENTRE */}
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