"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("2");
  const [cartCount, setCartCount] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const product = {
    id: "article--01",
    name: "Article -01 — Helmet",
    price: 180,
    image: "/product1.jpg",
  };

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

  const handleAddToCart = () => {
    const raw = localStorage.getItem("cart") || localStorage.getItem("helmet_cart");
    let currentCart = [];
    if (raw) {
      try {
        currentCart = JSON.parse(raw);
        if (!Array.isArray(currentCart)) currentCart = [];
      } catch {
        currentCart = [];
      }
    }

    const existingIndex = currentCart.findIndex(
      (item: any) => item.id === product.id && item.size === selectedSize
    );

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity = (Number(currentCart[existingIndex].quantity) || 1) + 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        quantity: 1,
        image: product.image,
      });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    localStorage.setItem("helmet_cart", JSON.stringify(currentCart));
    setCartCount(currentCart.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0));
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-20 pt-5 md:pt-6 pb-20 font-sans">
      <header className="grid grid-cols-3 items-center border-b border-neutral-200 pb-4 md:pb-6 mb-8 md:mb-16">
        <div className="justify-self-start">
          <Link
            href="/shop"
            className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:opacity-60 transition whitespace-nowrap"
          >
            ← Back To Shop
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

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="aspect-[3/4] w-full bg-neutral-100 border border-neutral-200 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes("article1.jpg")) {
                target.src = "/article1.jpg";
              }
            }}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="pt-1 md:pt-2 space-y-6 md:space-y-8">
          <div>
            <h1 className="font-cancellaresca text-3xl sm:text-4xl md:text-5xl font-normal mb-2">
              Article -01 — Helmet
            </h1>
            <p className="text-sm tracking-widest text-neutral-600">
              ${product.price}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500 mb-3">Size</p>
            <div className="flex gap-3">
              {["1", "2", "3"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-10 border text-xs transition ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-neutral-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-4 text-xs tracking-[0.15em] font-medium hover:bg-neutral-800 transition"
          >
            Add To Cart
          </button>

          <div className="border-t border-neutral-200 pt-2 divide-y divide-neutral-200">
            <div className="py-4">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "details" ? null : "details")}
                className="w-full flex justify-between items-center text-xs tracking-wider text-neutral-700"
              >
                <span>Product Details</span>
                <span>{openSection === "details" ? "−" : "+"}</span>
              </button>
              {openSection === "details" && (
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                  Paris Atelier — Edition -01. Heavyweight luxury silhouette crafted with custom Helmet Haute Couture detailing.
                </p>
              )}
            </div>

            <div className="py-4">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
                className="w-full flex justify-between items-center text-xs tracking-wider text-neutral-700"
              >
                <span>Shipping & Policy</span>
                <span>{openSection === "shipping" ? "−" : "+"}</span>
              </button>
              {openSection === "shipping" && (
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                  Tracked worldwide delivery. All sales are final — no returns or exchanges.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}