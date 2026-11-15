"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const SINGLE_PRODUCT = {
  id: "-01",
  name: "Article -01 — Helmet",
  edition: "Paris Atelier — Edition -01",
  price: 180,
  image: "/article1.jpg",
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
    <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-20 font-sans pt-5 md:pt-6 pb-20">
      {/* HEADER 3 COLONNES IDENTIQUE PC & IPHONE */}
      <header className="grid grid-cols-3 items-center border-b border-neutral-200 pb-4 md:pb-6 mb-10 md:mb-12">
        <div className="justify-self-start">
          <Link
            href="/"
            className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:opacity-60 transition whitespace-nowrap"
          >
            ← Back To Home
          </Link>
        </div>

        <div className="justify-self-center text-center">
          <Link
            href="/"
            className="font-helmet text-3xl sm:text-4xl md:text-5xl tracking-normal font-normal select-none leading-none block"
          >
            Helmet
          </Link>
        </div>

        <div className="justify-self-end">
          <Link
            href="/cart"
            className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] flex items-center gap-1.5 hover:opacity-60 transition whitespace-nowrap"
          >
            <span>🛍</span>
            <span>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      {/* SOUS-TITRE EDITION -01 */}
      <div className="text-center mb-8 md:mb-12">
        <p className="text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-neutral-400">
          Paris Atelier — Edition -01
        </p>
      </div>

      {/* ARTICLE UNIQUE CENTRÉ PC & MOBILE */}
      <div className="max-w-sm md:max-w-md mx-auto">
        <Link href="/shop/-01" className="group block">
          <div className="aspect-[3/4] w-full bg-neutral-100 border border-neutral-200 overflow-hidden mb-4 md:mb-5 flex items-center justify-center">
            <img
              src={SINGLE_PRODUCT.image}
              alt={SINGLE_PRODUCT.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="flex justify-between items-baseline gap-2">
            <h2 className="font-helmet text-2xl sm:text-3xl font-normal">
              {SINGLE_PRODUCT.name}
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-600 shrink-0">
              ${SINGLE_PRODUCT.price}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}