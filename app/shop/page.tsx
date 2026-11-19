"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LouisXVIFrame from "../LouisXVIFrame";
import AtelierAtmosphere from "../AtelierAtmosphere";

const SINGLE_PRODUCT = {
  id: "-01",
  name: "Overlayer Jogger -01 — Helmet",
  edition: "Paris Atelier — Edition -01",
  price: 150,
  image: "/product1.jpg",
};

export default function Shop() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("cart") || localStorage.getItem("helmet_cart");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCartCount(parsed.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0));
        }
      } catch {}
    }
  }, []);

  return (
    <div className="helmet-page-container">
      <AtelierAtmosphere mode="petals-only" inverted />

      {/* HEADER SHOP : CADRAN HELMET SHOP À GAUCHE (RETOUR MENU) + PETIT LOGO PANIER À DROITE */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        className="helmet-shop-header"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div>
          <Link href="/" title="Return To Menu">
            <LouisXVIFrame variant="title" inverted>
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(26px, 4vw, 42px)",
                  lineHeight: 1,
                  display: "block",
                  color: "#ffffff",
                }}
              >
                Helmet Shop
              </span>
            </LouisXVIFrame>
          </Link>
        </div>

        <div>
          <Link
            href="/cart"
            className="helmet-zoom-link"
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.24em",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              color: "#ffffff",
              padding: "8px 4px",
            }}
          >
            <svg
              width="17"
              height="17"
              style={{ width: "17px", height: "17px", minWidth: "17px" }}
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
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: "40px" }}
      >
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.68)" }}>
          Paris Atelier — Edition -01
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 10, maxWidth: "440px", margin: "0 auto" }}
      >
        <Link href="/shop/-01" style={{ display: "block" }}>
          <div
            className="helmet-image-frame"
            style={{
              aspectRatio: "3 / 4",
              width: "100%",
              marginBottom: "18px",
            }}
          >
            <img
              src={SINGLE_PRODUCT.image}
              alt={SINGLE_PRODUCT.name}
              className="helmet-zoom-img"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
            <h2 className="font-cancellaresca" style={{ fontSize: "28px", margin: 0, color: "#ffffff" }}>
              {SINGLE_PRODUCT.name}
            </h2>
            <span style={{ fontSize: "13px", letterSpacing: "0.18em", color: "#ffffff", whiteSpace: "nowrap" }}>
              150 €
            </span>
          </div>

          <p
            style={{
              fontSize: "10.5px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.65)",
              marginTop: "6px",
            }}
          >
            100% Italian Cotton — Handcrafted in France — Unique Piece
          </p>
        </Link>
      </motion.div>
    </div>
  );
}