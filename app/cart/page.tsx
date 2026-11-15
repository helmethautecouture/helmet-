"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  id?: string;
  name: string;
  price: number;
  size?: string;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart") || localStorage.getItem("helmet_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
          return;
        }
      } catch {}
    }
    // Article par défaut Collection 001 si le panier local utilise un autre format
    setCart([
      {
        id: "helmet-001",
        name: "HELMET COLLECTION 001 — FULL SET",
        price: 180,
        size: "M",
        quantity: 1,
      },
    ]);
  }, []);

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity = Math.max(1, (updated[index].quantity || 1) + delta);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

  async function handleCheckout() {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout Error: " + data.error);
        setLoading(false);
      }
    } catch {
      alert("Network error during checkout.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-20 py-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-neutral-200 pb-4">
          <Link href="/shop" className="text-xs uppercase tracking-[0.25em] hover:opacity-60 transition">
            ← Continue Shopping
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
            Shopping Bag ({cart.length})
          </span>
        </div>

        <h1 className="text-2xl uppercase tracking-[0.25em] mb-10 font-light">
          Your Selection
        </h1>

        {cart.length === 0 ? (
          <div className="py-20 text-center border border-neutral-200">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6">
              Your shopping bag is currently empty.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em]"
            >
              Explore Collection 001
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
              {cart.map((item, idx) => (
                <div key={idx} className="py-6 flex justify-between items-center">
                  <div className="space-y-1">
                    <h2 className="text-sm uppercase tracking-[0.15em] font-medium">
                      {item.name}
                    </h2>
                    {item.size && (
                      <p className="text-xs text-neutral-500 uppercase tracking-widest">
                        Size: {item.size}
                      </p>
                    )}
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-[10px] uppercase tracking-widest text-neutral-400 underline pt-2 block hover:text-black"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center border border-neutral-300">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="px-3 py-1 text-xs hover:bg-neutral-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="px-3 py-1 text-xs hover:bg-neutral-100"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm tracking-wider w-20 text-right">
                      {Number(item.price) * (item.quantity || 1)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-neutral-500">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between text-base uppercase tracking-[0.2em] font-medium pt-2 border-t border-neutral-200">
                <span>Total</span>
                <span>{total} €</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {loading ? "Redirecting to Secure Checkout..." : "Proceed to Checkout (Card / Apple Pay / PayPal)"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}