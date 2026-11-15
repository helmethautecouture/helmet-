"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const products = [
  { id: "01", name: "Article 01 — Helmet", price: "$0", image: "/product1.jpg" },
  { id: "02", name: "Article 02 — Helmet", price: "$0", image: "/product2.jpg" },
];

export default function Shop() {
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
        <Link href="/" className="font-cancellaresca text-4xl md:text-5xl tracking-[0.06em] text-center text-black">
          Helmet Shop
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

      <div className="max-w-2xl mx-auto flex flex-col gap-28 pb-24">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="group cursor-pointer"
          >
            <Link href={`/shop/${product.id}`}>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 border border-neutral-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="flex justify-between items-center mt-6">
                <div>
                  <h2 className="text-sm font-bold tracking-[0.2em] text-black">{product.name}</h2>
                  <p className="text-xs text-neutral-500 mt-1 tracking-widest">{product.price}</p>
                </div>
                <span className="text-xs tracking-[0.2em] text-neutral-800 group-hover:text-black border-b border-black pb-1">
                  View Product
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}