"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LouisXVIFrame from "../LouisXVIFrame";
import AtelierAtmosphere from "../AtelierAtmosphere";

const galleryItems = [
  {
    id: "-01",
    title: "Shooting -01 — Paris Atelier",
    subtitle: "Overlayer Jogger -01 / 100% Italian Cotton",
    manuscriptCrossed: "étude de volume initiale",
    manuscriptFinal: "silhouette définitive — coupe superposée à la main",
    image: "/product1.jpg",
  },
  {
    id: "-02",
    title: "Shooting -02 — Archive Studio",
    subtitle: "Edition -01 / Pièce Unique Faite Main en France",
    manuscriptCrossed: "prototype atelier n°01",
    manuscriptFinal: "assemblage manuel — teinture noire & sceau bordeaux",
    image: "/product2.jpg",
  },
];

export default function HelmetGallery() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("helmet_cart") || localStorage.getItem("cart") || "[]";
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) {
        const totalQty = saved.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0);
        setCartCount(totalQty);
      }
    } catch {
      setCartCount(0);
    }
  }, []);

  return (
    <div className="helmet-page-container" style={{ overflow: "hidden" }}>
      {/* ATMOSPHÈRE VIVANTE PLUS PRÉSENTE DANS LA GALERIE */}
      <AtelierAtmosphere intensity="gallery" />

      <header className="helmet-page-header" style={{ position: "relative", zIndex: 10 }}>
        <div style={{ justifySelf: "start" }}>
          <Link
            href="/"
            className="helmet-zoom-link"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              whiteSpace: "nowrap",
            }}
          >
            ← Back To Home
          </Link>
        </div>

        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <Link href="/">
            <LouisXVIFrame variant="title">
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(28px, 4.2vw, 44px)",
                  lineHeight: 1,
                  display: "block",
                  whiteSpace: "nowrap",
                }}
              >
                Helmet Gallery
              </span>
            </LouisXVIFrame>
          </Link>
        </div>

        <div style={{ justifySelf: "end" }}>
          <Link
            href="/cart"
            className="helmet-zoom-link"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <svg width="16" height="16" style={{ width: "16px", height: "16px", minWidth: "16px" }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      {/* INTRODUCTION MANUSCRITE DE LA GALERIE */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          marginBottom: "56px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "#6B0F1A",
            margin: "0 0 8px 0",
          }}
        >
          Paris — Atelier / Visual Archive -01
        </p>
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#525252",
            margin: 0,
          }}
        >
          Helmet Haute Couture — Handcrafted Silhouette Study
        </p>
      </motion.div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "780px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "96px",
        }}
      >
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "18px", position: "relative" }}
          >
            {/* Numéro d'archive et note raturée au-dessus du visuel */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                flexWrap: "wrap",
                gap: "8px",
                borderBottom: "1px solid #e5e5e5",
                paddingBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#6B0F1A",
                }}
              >
                Archive Plate [{item.id}]
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  className="font-cancellaresca"
                  style={{
                    fontSize: "20px",
                    color: "#737373",
                    textDecoration: "line-through",
                    textDecorationColor: "#6B0F1A",
                  }}
                >
                  {item.manuscriptCrossed}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#171717",
                  }}
                >
                  → {item.manuscriptFinal}
                </span>
              </div>
            </div>

            {/* Cadre Photo avec sarment d'épines décoratif dans l'angle */}
            <div style={{ position: "relative" }}>
              <div
                className="helmet-image-frame"
                style={{
                  aspectRatio: "4 / 5",
                  width: "100%",
                  border: "1px solid #171717",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="helmet-zoom-img"
                />
              </div>

              {/* Rameau d'épines gravé qui enlace le coin du cadre photo */}
              <svg
                viewBox="0 0 180 90"
                className="helmet-ornament-svg"
                style={{
                  position: "absolute",
                  bottom: "-18px",
                  right: "-14px",
                  width: "150px",
                  height: "75px",
                  pointerEvents: "none",
                  zIndex: 4,
                }}
              >
                <path
                  d="M 10,72 L 48,66 L 88,54 L 128,36 L 164,12"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <polygon points="44,66 38,52 52,63" fill="#6B0F1A" />
                <polygon points="72,59 82,72 66,62" fill="#000000" />
                <polygon points="104,47 98,32 112,43" fill="#6B0F1A" />
                <polygon points="138,30 150,42 132,34" fill="#000000" />
              </svg>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                marginTop: "6px",
              }}
            >
              <span
                className="font-cancellaresca"
                style={{ fontSize: "32px", letterSpacing: "0.05em", color: "#000000", textAlign: "center" }}
              >
                {item.title}
              </span>
              <span
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#6B0F1A",
                  textAlign: "center",
                }}
              >
                {item.subtitle}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}