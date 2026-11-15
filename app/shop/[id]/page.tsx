"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

function ProductContent() {
  const params = useParams();
  const id = params?.id || "01";

  const [openDetails, setOpenDetails] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);
  const [selectedSize, setSelectedSize] = useState("2");
  const [added, setAdded] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("helmet_cart") || "[]");
      const totalQty = existingCart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  }, []);

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("helmet_cart") || "[]");
    const newItem = { 
      id, 
      size: selectedSize, 
      name: `Article ${id} — Helmet`, 
      price: "$0",
      image: `/product${id === "02" ? "2" : "1"}.jpg`,
      quantity: 1
    };
    
    const existingIndex = existingCart.findIndex((i: any) => i.id === id && i.size === selectedSize);
    if (existingIndex > -1) {
      existingCart[existingIndex].name = `Article ${id} — Helmet`;
      existingCart[existingIndex].quantity = (existingCart[existingIndex].quantity || 1) + 1;
    } else {
      existingCart.push(newItem);
    }

    localStorage.setItem("helmet_cart", JSON.stringify(existingCart));
    const totalQty = existingCart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
    setCartCount(totalQty);

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-20 font-sans pt-6">
      
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md flex justify-between items-center py-6 mb-12 border-b border-neutral-200">
        <Link href="/shop" className="text-xs tracking-[0.25em] text-neutral-600 hover:text-black transition-colors w-40">
          ← Back To Shop
        </Link>
        <Link href="/" className="font-cancellaresca text-4xl md:text-5xl tracking-[0.08em] text-center text-black">
          Helmet
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

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start py-8">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 border border-neutral-200">
          <img
            src={`/product${id === "02" ? "2" : "1"}.jpg`}
            alt={`Article ${id} — Helmet`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-6 md:pl-8 sticky top-28">
          <div>
            <h1 className="font-cancellaresca text-3xl md:text-4xl tracking-[0.08em]">
              Article {id} — Helmet
            </h1>
            <p className="text-sm text-neutral-500 mt-2 tracking-widest">$0</p>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-xs tracking-widest text-neutral-500">Size</label>
            <div className="flex gap-3">
              {["1", "2", "3"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2 text-xs tracking-widest border transition-colors cursor-pointer ${
                    selectedSize === size
                      ? "border-black bg-black text-white font-bold"
                      : "border-neutral-300 text-neutral-600 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white font-bold text-xs tracking-[0.25em] py-4 mt-4 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {added ? `Added To Cart — Size ${selectedSize} ✓` : "Add To Cart"}
          </button>

          <div className="mt-8 border-t border-neutral-200 divide-y divide-neutral-200">
            <div className="py-4">
              <button
                onClick={() => setOpenDetails(!openDetails)}
                className="w-full flex justify-between items-center text-xs tracking-[0.2em] text-neutral-800 hover:text-black cursor-pointer"
              >
                <span>Product Details</span>
                <span>{openDetails ? "−" : "+"}</span>
              </button>
              {openDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 text-xs text-neutral-600 space-y-1 tracking-wider"
                >
                  <p>• Color: Black</p>
                  <p>• Made In Paris</p>
                  <p>• Material: 100% Heavy Cotton</p>
                </motion.div>
              )}
            </div>

            <div className="py-4">
              <button
                onClick={() => setOpenShipping(!openShipping)}
                className="w-full flex justify-between items-center text-xs tracking-[0.2em] text-neutral-800 hover:text-black cursor-pointer"
              >
                <span>Shipping & Returns</span>
                <span>{openShipping ? "−" : "+"}</span>
              </button>
              {openShipping && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 text-xs text-neutral-600 space-y-1 tracking-wider"
                >
                  <p>Worldwide Express Shipping.</p>
                  <p>Dispatched Within 48 Hours.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white text-black flex items-center justify-center text-xs tracking-widest">Loading...</div>}>
      <ProductContent />
    </Suspense>
  );
}