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
    <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-20 font-sans pt-5 md:pt-6 pb-20">
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
            className="font-cancellaresca text-3xl sm:text-4xl md:text-5xl tracking-normal font-normal select-none leading-none block"
          >
            Helmet
          </Link>
        </div>

        <div className="justify-self-end">
          <Link
            href="/cart"
            className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] flex items-center gap-1.5 hover:opacity-60 transition whitespace-nowrap"
          >
            <svg className="w-4 h-4 text-black shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="font-semibold">[{cartCount}]</span>
          </Link>
        </div>
      </header>

      <div className="text-center mb-8 md:mb-12">
        <p className="text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-neutral-400">
          Paris Atelier — Edition -01
        </p>
      </div>

      <div className="max-w-sm md:max-w-md mx-auto">
        <Link href="/shop/-01" className="group block">
          <div className="aspect-[3/4] w-full bg-neutral-100 border border-neutral-200 overflow-hidden mb-4 md:mb-5 flex items-center justify-center">
            <img
              src={SINGLE_PRODUCT.image}
              alt={SINGLE_PRODUCT.name}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("article1.jpg")) {
                  target.src = "/article1.jpg";
                }
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="flex justify-between items-baseline gap-2">
            <h2 className="font-cancellaresca text-2xl sm:text-3xl font-normal">
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