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
      {/* ROSES BLANCHES QUI TOMBENT PAR VAGUES ALÉATOIRES (MAX 4) */}
      <AtelierAtmosphere mode="petals-only" inverted />

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
                  color: "#ffffff",
                }}
              >
                Helmet Shop
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
            <svg
              width="16"
              height="16"
              style={{ width: "16px", height: "16px", minWidth: "16px" }}
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