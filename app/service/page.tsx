"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function ServicePage() {
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-20 font-sans pt-6">
      
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md flex justify-between items-center py-6 mb-12 border-b border-neutral-200">
        <Link href="/" className="text-xs tracking-[0.25em] text-neutral-600 hover:text-black transition-colors w-40">
          ← Back To Home
        </Link>
        <Link href="/" className="font-cancellaresca text-4xl md:text-5xl tracking-[0.08em] text-center text-black hover:opacity-80 transition-opacity">
          Helmet Client Service
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

      <div className="max-w-3xl mx-auto py-6">
        <div className="font-cancellaresca text-2xl tracking-[0.08em] text-neutral-700 mb-8">
          Contact Online
        </div>

        {submitted ? (
          <div className="py-20 text-center text-xs tracking-[0.25em] text-neutral-700 border border-neutral-200 p-8 bg-neutral-50">
            Thank You. Your Message Has Been Sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="First Name"
                required
                className="bg-transparent border border-neutral-300 p-4 text-xs tracking-widest text-black placeholder-neutral-400 focus:border-black outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                className="bg-transparent border border-neutral-300 p-4 text-xs tracking-widest text-black placeholder-neutral-400 focus:border-black outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="email"
                placeholder="Your Email"
                required
                className="bg-transparent border border-neutral-300 p-4 text-xs tracking-widest text-black placeholder-neutral-400 focus:border-black outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Order Number"
                className="bg-transparent border border-neutral-300 p-4 text-xs tracking-widest text-black placeholder-neutral-400 focus:border-black outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <select 
                className="w-full bg-transparent border border-neutral-300 p-4 text-xs tracking-widest text-neutral-700 focus:border-black outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="status" className="bg-white text-black">Online Order Status Request</option>
                <option value="shipping" className="bg-white text-black">Shipping Inquiry</option>
                <option value="return" className="bg-white text-black">Returns & Exchanges</option>
                <option value="general" className="bg-white text-black">General Question</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">
                ▼
              </div>
            </div>

            <textarea
              placeholder="Message"
              rows={6}
              required
              className="bg-transparent border border-neutral-300 p-4 text-xs tracking-widest text-black placeholder-neutral-400 focus:border-black outline-none transition-colors resize-none"
            />

            <div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-[0.25em] px-8 py-3 transition-colors cursor-pointer"
              >
                Send
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}