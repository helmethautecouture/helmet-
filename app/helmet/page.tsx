"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const galleryItems = [
  { id: "01", title: "Shooting 01 — Paris", image: "/product1.jpg" },
  { id: "02", title: "Shooting 02 — Studio", image: "/product2.jpg" },
];

export default function HelmetGallery() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("helmet_cart") || "[]");
      const totalQty = saved.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-20 font-sans pt-6">
      
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md flex justify-between items-center py-6 mb-16 border-b border-neutral-200">
        <Link href="/" className="text-xs tracking-[0.25em] text-neutral-600 hover:text-black transition-colors w-40">
          ← Back To Home
        </Link>
        <Link href="/" className="font-cancellaresca text-4xl md:text-5xl tracking-[0.08em] text-center text-black hover:opacity-80 transition-opacity">
          Helmet Gallery
        </Link>
        <div className="w-40 flex justify-end">
          <Link href="/cart" className="text-sm tracking-widest text-neutral-800 hover:text-black transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="font-semibold">[{cartCount}]</span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto flex flex-col gap-24 pb-24">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col gap-4"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 border border-neutral-200 rounded-sm">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover opacity-95 hover:scale-102 transition-transform duration-500"
              />
            </div>
            <span className="font-cancellaresca text-2xl tracking-[0.08em] text-neutral-800 text-center mt-2">
              {item.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}