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
    subtitle: "Overlayer Jogger -01 — 100% Italian Cotton",
    image: "/product1.jpg",
  },
  {
    id: "-02",
    title: "Shooting -02 — Archive Studio",
    subtitle: "Edition -01 — Handcrafted in France",
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
      <AtelierAtmosphere mode="canopy-and-roses" inverted />

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        className="helmet-page-header"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div style={{ justifySelf: "start" }}>
          <Link
            href="/"
            className="helmet-zoom-link"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              whiteSpace: "nowrap",
              color: "#ffffff",
            }}
          >
            ← Back To Home
          </Link>
        </div>

        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <Link href="/">
            <LouisXVIFrame variant="title" inverted>
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(26px, 4.2vw, 44px)",
                  lineHeight: 1,
                  display: "block",
                  whiteSpace: "nowrap",
                  color: "#ffffff",
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
              color: "#ffffff",
            }}
          >
            <svg width="16" height="16" style={{ width: "16px", height: "16px", minWidth: "16px" }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>[{cartCount}]</span>
          </Link>
        </div>
      </motion.header>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "768px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "88px",
        }}
      >
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              className="helmet-image-frame"
              style={{
                aspectRatio: "4 / 5",
                width: "100%",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="helmet-zoom-img"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
              }}
            >
              <span
                className="font-cancellaresca"
                style={{ fontSize: "30px", letterSpacing: "0.05em", color: "#ffffff", textAlign: "center" }}
              >
                {item.title}
              </span>
              <span
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.68)",
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