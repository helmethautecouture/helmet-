"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const galleryItems = [
  { id: "-01", title: "Shooting -01 — Paris", image: "/product1.jpg" },
  { id: "-02", title: "Shooting -02 — Studio", image: "/product2.jpg" },
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
    <div className="helmet-page-container">
      <header className="helmet-page-header">
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
          <Link
            href="/"
            className="font-cancellaresca helmet-title-frame"
            style={{
              fontSize: "clamp(30px, 5vw, 52px)",
              lineHeight: 1,
              display: "block",
              whiteSpace: "nowrap",
            }}
          >Helmet Gallery</Link>
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

      <div style={{ maxWidth: "768px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "72px" }}>
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
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
            <span
              className="font-cancellaresca"
              style={{ fontSize: "28px", letterSpacing: "0.06em", color: "#171717", textAlign: "center" }}
            >
              {item.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}