"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const SINGLE_PRODUCT = {
  id: "-01",
  name: "Article -01 — Helmet",
  edition: "Paris Atelier — Edition -01",
  price: 180,
  image: "/article1.jpg", // Garde le nom de ton image dans public/
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
    <div className="min-h-screen bg-white text-black px-6 md:px-20 font-sans pt-6 pb-20">
      {/* HEADER */}
      <header className="flex justify-between items-center border-b border-neutral-200 pb-6 mb-12">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.2em] hover:opacity-60 transition"
        >
          ← Back To Home
        </Link>

        <Link
          href="/"
          style={{ fontFamily: "'1610-cancellaresca-lim', var(--font-couture), serif" }}
          className="text-4xl md:text-5xl tracking-normal font-normal select-none"
        >
          Helmet
        </Link>

        <Link
          href="/cart"
          className="text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-60 transition"
        >
          <span>🛍</span>
          <span>[{cartCount}]</span>
        </Link>
      </header>

      {/* SOUS-TITRE EDITION -01 */}
      <div className="text-center mb-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
          Paris Atelier — Edition -01
        </p>
      </div>

      {/* UN SEUL ARTICLE CENTRÉ */}
      <div className="max-w-md mx-auto">
        <Link href="/shop/-01" className="group block">
          <div className="aspect-[3/4] w-full bg-neutral-100 border border-neutral-200 overflow-hidden mb-5 flex items-center justify-center">
            <img
              src={SINGLE_PRODUCT.image}
              alt={SINGLE_PRODUCT.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="flex justify-between items-baseline">
            <h2
              style={{ fontFamily: "'1610-cancellaresca-lim', var(--font-couture), serif" }}
              className="text-3xl font-normal"
            >
              {SINGLE_PRODUCT.name}
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-600">
              ${SINGLE_PRODUCT.price}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}