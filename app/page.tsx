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

let globalIntroShown = false;

export default function Home() {
  const [loading, setLoading] = useState(!globalIntroShown);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isMutedByUserRef = useRef(false);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // 1. Lecture synchro du panier
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

    // 2. Intro uniquement au tout premier lancement (retour au menu instantane)
    let timer: NodeJS.Timeout;
    if (globalIntroShown || sessionStorage.getItem("helmet_intro_done") === "true") {
      globalIntroShown = true;
      setLoading(false);
    } else {
      timer = setTimeout(() => {
        globalIntroShown = true;
        sessionStorage.setItem("helmet_intro_done", "true");
        setLoading(false);
      }, 1800);
    }

    // 3. WEB AUDIO API : Ne declenche JAMAIS le lecteur Spotify/Lockscreen sur iPhone !
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
        gainNodeRef.current = gainNode;

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
        audioCtxRef.current.resume().then(() => {
          if (isMounted) setIsPlaying(true);
        }).catch(() => {});
      }
    };

    window.addEventListener("click", unlockOnInteraction, { once: true });
    window.addEventListener("touchstart", unlockOnInteraction, { once: true });

    // 4. Coupe instantanement le son des qu'on verrouille l'iPhone ou qu'on ferme l'onglet
    const handleVisibility = () => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (document.hidden || document.visibilityState === "hidden") {
        ctx.suspend().catch(() => {});
        setIsPlaying(false);
      } else if (!isMutedByUserRef.current) {
        ctx.resume().then(() => setIsPlaying(true)).catch(() => {});
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
    <main className="relative h-[100dvh] w-full overflow-hidden bg-white text-black font-sans select-none flex flex-col justify-between">
      {/* APERCU FANTOME EN ARRIERE-PLAN AU SURVOL DU MENU */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            key={hoveredItem}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.08, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center"
          >
            <img
              src={hoveredItem}
              alt=""
              className="w-[260px] h-[340px] md:w-[420px] md:h-[540px] object-cover grayscale"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTRO CINEMATOGRAPHIQUE (Bien cadree sur iPhone, 240px sur PC) */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center pointer-events-none px-4"
          >
            <motion.div
              initial={{ scale: 1.08, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center max-w-full"
            >
              <span className="font-cancellaresca text-[64px] sm:text-[130px] md:text-[240px] tracking-[0.03em] text-black block leading-[1.15] py-4 whitespace-nowrap">
                Helmet
              </span>
              <span className="block text-[9px] sm:text-xs md:text-sm tracking-[0.45em] md:tracking-[0.5em] text-neutral-700 mt-1 md:mt-2 font-normal font-sans uppercase">
                Haute Couture
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER ARCHITECTURAL (3 colonnes symetriques pour un centrage parfait sur iPhone & PC) */}
      <header className="relative z-20 grid grid-cols-3 items-start px-5 pt-6 sm:px-8 md:px-14 md:pt-14 bg-transparent">
        <div className="pt-2 md:pt-3 flex flex-col gap-1 text-[8px] sm:text-[10px] md:text-[11px] tracking-[0.18em] md:tracking-[0.35em] text-neutral-800 font-normal justify-self-start">
          <span className="whitespace-nowrap">Paris — Atelier</span>
          <span className="text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.16em] md:tracking-[0.3em] text-neutral-600 whitespace-nowrap">
            Edition -01
          </span>
        </div>

        <div className="flex flex-col items-center justify-self-center">
          <Link href="/helmet" className="group text-center flex flex-col items-center">
            <span className="font-cancellaresca text-5xl sm:text-7xl md:text-[115px] tracking-[0.04em] text-black block leading-[1.1] pt-1 transition-transform duration-500 group-hover:scale-[1.03] whitespace-nowrap">
              Helmet
            </span>
            <span className="block text-[8px] sm:text-[11px] md:text-xs tracking-[0.35em] md:tracking-[0.5em] text-neutral-700 mt-1 font-normal font-sans whitespace-nowrap uppercase">
              Haute Couture
            </span>
          </Link>
        </div>

        <div className="flex items-center justify-end pt-2 md:pt-3 justify-self-end">
          <Link
            href="/cart"
            className="text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.35em] text-neutral-800 hover:text-black transition-colors font-normal flex items-center gap-1.5 md:gap-2.5 group whitespace-nowrap"
          >
            <span className="hidden sm:inline">Cart</span>
            <svg
              className="w-4 h-4 text-neutral-900 group-hover:text-black transition-colors shrink-0"
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
            <span className="text-black font-semibold">[{cartCount}]</span>
          </Link>
        </div>
      </header>

      {/* MENU : SOMMAIRE D'ATELIER EDITORIAL (Toujours visible, ne disparait jamais au retour) */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-14">
        <nav className="w-full max-w-xl mx-auto">
          <div className="flex justify-between items-center pb-2.5 md:pb-3 border-b border-neutral-300 text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.45em] text-neutral-600 font-normal">
            <span>Summary</span>
            <span className="md:hidden text-neutral-400">Edition -01</span>
          </div>

          <div className="divide-y divide-neutral-300 border-b border-neutral-300">
            {menuLinks.map((item) => (
              <Link
                key={item.index}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.preview)}
                onMouseLeave={() => setHoveredItem(null)}
                className="group relative flex items-center justify-between py-4 sm:py-5 md:py-6 transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-black transition-all duration-500 ease-out group-hover:w-full" />

                <div className="flex items-baseline gap-4 sm:gap-6 md:gap-10">
                  <span className="text-[10px] tracking-[0.3em] md:tracking-[0.35em] text-neutral-600 font-normal group-hover:text-black transition-colors duration-300">
                    {item.index}
                  </span>
                  <span className="text-xs md:text-sm tracking-[0.32em] sm:tracking-[0.45em] text-neutral-900 group-hover:text-black group-hover:translate-x-2 transition-all duration-300 font-normal">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-4">
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.35em] text-neutral-500 sm:text-neutral-600 group-hover:text-black transition-colors duration-300 font-normal">
                    {item.subtitle}
                  </span>
                  <span className="text-xs text-neutral-700 group-hover:text-black group-hover:translate-x-1 transition-all duration-300 font-normal">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* FOOTER SYMETRIQUE */}
      <footer className="relative z-20 grid grid-cols-3 items-center px-5 py-5 sm:px-8 md:px-14 md:py-6 text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.18em] md:tracking-[0.3em] text-neutral-700 font-normal bg-transparent">
        <div className="flex items-center gap-2 sm:gap-4 justify-self-start whitespace-nowrap">
          <a
            href="https://www.instagram.com/helmet.hautecouture/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-black transition-colors"
          >
            Instagram
          </a>
          <span className="text-neutral-400">/</span>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-black transition-colors"
          >
            YouTube
          </a>
        </div>

        {/* ICONE CASQUE AUDIO AU CENTRE */}
        <div className="justify-self-center">
          <button
            type="button"
            onClick={toggleAudio}
            className="relative flex items-center justify-center p-2 text-neutral-900 hover:text-black hover:scale-105 transition-all group cursor-pointer"
            title={isPlaying ? "Sound On (70%)" : "Sound Off"}
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7"
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
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-7 md:w-8 h-[1.5px] bg-red-600 rotate-45 transform" />
              </span>
            )}
          </button>
        </div>

        <div className="text-right justify-self-end whitespace-nowrap">
          <span className="hidden sm:inline">© Helmet All Rights Reserved</span>
          <span className="sm:hidden">© Helmet</span>
        </div>
      </footer>
    </main>
  );
}