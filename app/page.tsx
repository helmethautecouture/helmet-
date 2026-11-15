"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

let introPlayedInMemory = false;

export default function Home() {
  const [loading, setLoading] = useState(!introPlayedInMemory);
  const [cartCount, setCartCount] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <main className="helmet-home-shell">
      {/* APERÇU FANTÔME AVEC ZOOM FLUIDE EN ARRIÈRE-PLAN */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            key={hoveredItem}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.11, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
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
                width: "360px",
                height: "460px",
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

      {/* HEADER HAUT : Paris — Atelier à gauche | INFO au milieu en haut | Panier en haut à droite */}
      <header
        style={{
          position: "relative",
          zIndex: 20,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
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
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "#262626",
            textTransform: "uppercase",
            justifySelf: "start",
          }}
        >
          <span>Paris — Atelier</span>
          <span style={{ fontSize: "10px", letterSpacing: "0.25em", color: "#525252" }}>
            Edition -01
          </span>
        </div>

        {/* BOUTON INFO CLIQUABLE AU MILIEU TOUT EN HAUT */}
        <div style={{ justifySelf: "center" }}>
          <Link
            href="/info"
            className="helmet-zoom-link"
            style={{
              fontSize: "11px",
              letterSpacing: "0.35em",
              color: "#171717",
              textTransform: "uppercase",
              padding: "4px 10px",
            }}
          >
            Info
          </Link>
        </div>

        {/* PETIT LOGO PANIER EN HAUT À DROITE */}
        <div style={{ justifySelf: "end" }}>
          <Link
            href="/cart"
            className="helmet-zoom-link"
            style={{
              fontSize: "11px",
              letterSpacing: "0.25em",
              color: "#171717",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              textTransform: "uppercase",
            }}
          >
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
            <span>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      {/* MENU HORIZONTAL ARCHITECTURAL COMME SUR TON DESSIN */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1180px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(20px, 5vw, 72px)",
          }}
        >
          {/* GAUCHE DU LOGO : Shop & Helmet Gallery */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(18px, 4vw, 52px)",
            }}
          >
            <Link
              href="/shop"
              onMouseEnter={() => setHoveredItem("/product1.jpg")}
              onMouseLeave={() => setHoveredItem(null)}
              className="helmet-zoom-link"
              style={{
                fontSize: "clamp(12px, 1.3vw, 15px)",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#171717",
                whiteSpace: "nowrap",
              }}
            >
              Shop
            </Link>

            <Link
              href="/helmet"
              onMouseEnter={() => setHoveredItem("/product2.jpg")}
              onMouseLeave={() => setHoveredItem(null)}
              className="helmet-zoom-link"
              style={{
                fontSize: "clamp(12px, 1.3vw, 15px)",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#171717",
                whiteSpace: "nowrap",
              }}
            >
              Helmet Gallery
            </Link>
          </div>

          {/* CENTRE : LOGO TEXTE HELMET HAUTE COUTURE (1610-cancellaresca-lim) */}
          <div style={{ textAlign: "center", padding: "0 8px" }}>
            <Link
              href="/helmet"
              className="helmet-zoom-link"
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(64px, 10.5vw, 145px)",
                  letterSpacing: "0.04em",
                  color: "#000000",
                  display: "block",
                  lineHeight: 1.08,
                  whiteSpace: "nowrap",
                }}
              >
                Helmet
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(10px, 1vw, 12px)",
                  letterSpacing: "0.48em",
                  color: "#404040",
                  marginTop: "6px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Haute Couture
              </span>
            </Link>
          </div>

          {/* DROITE DU LOGO : Client Service & Cart */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(18px, 4vw, 52px)",
            }}
          >
            <Link
              href="/service"
              className="helmet-zoom-link"
              style={{
                fontSize: "clamp(12px, 1.3vw, 15px)",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#171717",
                whiteSpace: "nowrap",
              }}
            >
              Client Service
            </Link>

            <Link
              href="/cart"
              className="helmet-zoom-link"
              style={{
                fontSize: "clamp(12px, 1.3vw, 15px)",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#171717",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
              }}
            >
              <span>Cart</span>
              <span>[{cartCount}]</span>
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER BAS : Instagram / YouTube à gauche, Copyright à droite (Le casque est géré au centre par GlobalAudio) */}
      <footer
        style={{
          position: "relative",
          zIndex: 20,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "20px 24px 26px 24px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "11px",
            letterSpacing: "0.28em",
            color: "#404040",
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

        {/* Espace réservé au casque audio centré */}
        <div style={{ width: "44px", height: "36px", justifySelf: "center" }} />

        <div
          style={{
            textAlign: "right",
            fontSize: "11px",
            letterSpacing: "0.28em",
            color: "#404040",
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