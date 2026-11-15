"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const galleryItems = [
  { id: "-01", title: "Shooting -01 \u2014 Paris", image: "/product1.jpg" },
  { id: "-02", title: "Shooting -02 \u2014 Studio", image: "/product2.jpg" },
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
    <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-20 font-sans pt-5 md:pt-6 pb-20">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md grid grid-cols-3 items-center py-4 md:py-6 mb-10 md:mb-16 border-b border-neutral-200">
        <div className="justify-self-start">
          <Link
            href="/"
            className="text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.25em] text-neutral-600 hover:text-black transition-colors whitespace-nowrap"
          >
            {"\u2190 Back To Home"}
          </Link>
        </div>

        <div className="justify-self-center text-center">
          <Link
            href="/"
            className="font-cancellaresca text-2xl sm:text-4xl md:text-5xl tracking-[0.04em] text-black hover:opacity-80 transition-opacity whitespace-nowrap block leading-none"
          >
            Helmet Gallery
          </Link>
        </div>

        <div className="justify-self-end">
          <Link
            href="/cart"
            className="text-[10px] md:text-xs tracking-[0.15em] md:tracking-widest text-neutral-800 hover:text-black transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg style={{ width: "16px", height: "16px", minWidth: "16px" }}  width="16" height="16" className="w-4 h-4 md:w-5 md:h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="font-semibold">[{cartCount}]</span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto flex flex-col gap-16 md:gap-24 pb-16 md:pb-24">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col gap-4"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover opacity-95 hover:scale-102 transition-transform duration-500"
              />
            </div>
            <span className="font-cancellaresca text-2xl md:text-3xl tracking-[0.06em] text-neutral-800 text-center mt-1">
              {item.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}