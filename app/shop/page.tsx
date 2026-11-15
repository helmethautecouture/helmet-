"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const SINGLE_PRODUCT = {
  id: "-01",
  name: "Article -01 — Helmet",
  edition: "Paris Atelier — Edition -01",
  price: 180,
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
      <header className="helmet-page-header">
        <div style={{ justifySelf: "start" }}>
          <Link
            href="/"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              whiteSpace: "nowrap",
            }}
          >
            ← Back To Home
          </Link>
        </div>

        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <Link
            href="/"
            className="font-cancellaresca"
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              lineHeight: 1,
              display: "block",
            }}
          >
            Helmet
          </Link>
        </div>

        <div style={{ justifySelf: "end" }}>
          <Link
            href="/cart"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <svg width="16" height="16" style={{ width: "16px", height: "16px", minWidth: "16px" }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span style={{ fontWeight: 600 }}>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.3em", color: "#a3a3a3", fontWeight: 600 }}>
          Paris Atelier — Edition -01
        </p>
      </div>

      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        <Link href="/shop/-01" style={{ display: "block" }}>
          <div
            style={{
              aspectRatio: "3 / 4",
              width: "100%",
              backgroundColor: "#f5f5f5",
              border: "1px solid #e5e5e5",
              overflow: "hidden",
              marginBottom: "18px",
            }}
          >
            <img
              src={SINGLE_PRODUCT.image}
              alt={SINGLE_PRODUCT.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
              className="hover:scale-105"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
            <h2 className="font-cancellaresca" style={{ fontSize: "28px", margin: 0 }}>
              {SINGLE_PRODUCT.name}
            </h2>
            <span style={{ fontSize: "13px", letterSpacing: "0.2em", color: "#525252", fontWeight: 600 }}>
              ${SINGLE_PRODUCT.price}
            </span>
          </div>
        </Link>
      </div>

      {/* CASQUE AUDIO EN BAS À GAUCHE */}
      <div style={{ position: "absolute", bottom: "24px", left: "24px", zIndex: 30 }}>
        <a href="/" style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#737373" }}>
          ← Sound / Home
        </a>
      </div>
    </div>
  );
}