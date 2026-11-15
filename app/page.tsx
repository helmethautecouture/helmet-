"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const AUDIO_PATHS = ["/ambiante.mp3", "/ambiance.mp3", "/ambient.mp3", "/ambiante.mp3.mp3", "/ambiance.mp3.mp3"];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [audioIndex, setAudioIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userMutedRef = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("helmet_cart") || "[]");
      const total = saved.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const startAudio = async () => {
      const audio = audioRef.current;
      if (!audio || userMutedRef.current) return;
      audio.volume = 0.7;
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        const unlockAudio = () => {
          if (audioRef.current && !userMutedRef.current) {
            audioRef.current.volume = 0.7;
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
          window.removeEventListener("click", unlockAudio);
          window.removeEventListener("keydown", unlockAudio);
        };
        window.addEventListener("click", unlockAudio);
        window.addEventListener("keydown", unlockAudio);
      }
    };

    startAudio();

    return () => clearTimeout(timer);
  }, []);

  const toggleAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused && isPlaying) {
      userMutedRef.current = true;
      audio.pause();
      setIsPlaying(false);
    } else {
      userMutedRef.current = false;
      try {
        audio.volume = 0.7;
        await audio.play();
        setIsPlaying(true);
      } catch {
        if (audioIndex < AUDIO_PATHS.length - 1) {
          const nextIdx = audioIndex + 1;
          setAudioIndex(nextIdx);
          audio.src = AUDIO_PATHS[nextIdx];
          audio.load();
          audio.volume = 0.7;
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
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
    <main className="relative h-screen w-full overflow-hidden bg-white text-black font-sans select-none flex flex-col justify-between">
      
      <audio 
        ref={audioRef} 
        src={AUDIO_PATHS[audioIndex]} 
        loop 
        autoPlay
        preload="auto"
        onError={() => {
          if (audioIndex < AUDIO_PATHS.length - 1) {
            setAudioIndex(audioIndex + 1);
          }
        }}
      />

      {/* APERÇU FANTÔME EN ARRIÈRE-PLAN AU SURVOL DU MENU */}
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
              className="w-[420px] h-[540px] object-cover grayscale"
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
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center pointer-events-none px-4"
          >
            <motion.div
              initial={{ scale: 1.35, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center"
            >
              <span className="font-cancellaresca text-[140px] md:text-[240px] tracking-[0.03em] text-black block leading-[1.15] py-4">
                Helmet
              </span>
              <span className="block text-xs md:text-sm tracking-[0.5em] text-neutral-700 mt-2 font-normal font-sans">
                Haute Couture
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER ARCHITECTURAL */}
      <header className="relative z-20 flex items-start justify-between px-6 pt-10 md:px-14 md:pt-14 bg-transparent">
        {/* Coin Haut Gauche : Plus foncé (text-neutral-800 / text-neutral-600) */}
        <div className="w-48 pt-3 hidden md:flex flex-col gap-1.5 text-[11px] tracking-[0.35em] text-neutral-800 font-normal">
          <span>Paris — Atelier</span>
          <span className="text-[10px] tracking-[0.3em] text-neutral-600">Edition 01</span>
        </div>
        <div className="w-20 md:hidden" />

        {/* Logo Central */}
        <div className="flex flex-col items-center">
          <Link href="/helmet" className="group text-center flex flex-col items-center">
            <span className="font-cancellaresca text-7xl md:text-[115px] tracking-[0.04em] text-black block leading-[1.15] pt-1 transition-transform duration-500 group-hover:scale-[1.03]">
              Helmet
            </span>
            <span className="block text-[11px] md:text-xs tracking-[0.5em] text-neutral-700 mt-1 font-normal font-sans">
              Haute Couture
            </span>
          </Link>
        </div>

        {/* Coin Haut Droit : Panier plus contrasté */}
        <div className="flex items-center justify-end w-20 md:w-48 pt-3">
          <Link 
            href="/cart" 
            className="text-[11px] md:text-xs tracking-[0.35em] text-neutral-800 hover:text-black transition-colors font-normal flex items-center gap-2.5 group"
          >
            <span className="hidden sm:inline">Cart</span>
            <svg className="w-4 h-4 text-neutral-900 group-hover:text-black transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-black font-semibold">[{cartCount}]</span>
          </Link>
        </div>
      </header>

      {/* MENU : SOMMAIRE D'ATELIER ÉDITORIAL (Traits et textes assombris) */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-14">
        <motion.nav 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: "easeOut" }}
          className="w-full max-w-xl"
        >
          {/* En-tête : "Summary" et trait plus foncés */}
          <div className="flex justify-start items-center pb-3 border-b border-neutral-300 text-[10px] tracking-[0.45em] text-neutral-600 font-normal">
            <span>Summary</span>
          </div>

          {/* Lignes du menu avec traits neutral-300 */}
          <div className="divide-y divide-neutral-300 border-b border-neutral-300">
            {menuLinks.map((item) => (
              <Link
                key={item.index}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.preview)}
                onMouseLeave={() => setHoveredItem(null)}
                className="group relative flex items-center justify-between py-5 md:py-6 transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-black transition-all duration-500 ease-out group-hover:w-full" />

                <div className="flex items-baseline gap-6 md:gap-10">
                  <span className="text-[10px] tracking-[0.35em] text-neutral-600 font-normal group-hover:text-black transition-colors duration-300">
                    {item.index}
                  </span>
                  <span className="text-xs md:text-sm tracking-[0.45em] text-neutral-900 group-hover:text-black group-hover:translate-x-2 transition-all duration-300 font-normal">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline text-[10px] tracking-[0.35em] text-neutral-600 group-hover:text-black transition-colors duration-300 font-normal">
                    {item.subtitle}
                  </span>
                  <span className="text-xs text-neutral-700 group-hover:text-black group-hover:translate-x-1 transition-all duration-300 font-normal">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.nav>
      </div>

      {/* FOOTER PLUS CONTRASTÉ */}
      <footer className="relative z-20 flex items-end justify-between px-6 py-6 md:px-14 text-[11px] tracking-[0.3em] text-neutral-700 font-normal bg-transparent">
        <div className="flex items-center gap-4">
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

        {/* ICÔNE CASQUE AUDIO */}
        <div>
          <button 
            onClick={toggleAudio}
            className="relative flex items-center justify-center p-2 text-neutral-900 hover:text-black hover:scale-105 transition-all group cursor-pointer"
            title={isPlaying ? "Sound On (70%)" : "Sound Off"}
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 15v-3a8 8 0 0 1 16 0v3" />
              <rect x="2.5" y="13.5" width="3.5" height="6.5" rx="1.5" fill="currentColor" />
              <rect x="18" y="13.5" width="3.5" height="6.5" rx="1.5" fill="currentColor" />
            </svg>
            {!isPlaying && (
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-8 h-[1.5px] bg-red-600 rotate-45 transform" />
              </span>
            )}
          </button>
        </div>

        <div className="text-right">
          <span>© Helmet All Rights Reserved</span>
        </div>
      </footer>

    </main>
  );
}