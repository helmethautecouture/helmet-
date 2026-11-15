"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface CartItem {
  id: string;
  size: string;
  name: string;
  price: string;
  image?: string;
  quantity: number;
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "paypal">("card");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("helmet_cart");
      const savedCart: CartItem[] = raw ? JSON.parse(raw) : [];
      const formattedCart = savedCart.map((item) => ({
        id: item.id || "01",
        size: item.size || "2",
        name: toTitleCase(item.name || `Article ${item.id || "01"} — Helmet`),
        price: item.price || "$0",
        image: item.image || `/product${item.id === "02" ? "2" : "1"}.jpg`,
        quantity: item.quantity || 1,
      }));
      setCartItems(formattedCart);
      localStorage.setItem("helmet_cart", JSON.stringify(formattedCart));
    } catch {
      setCartItems([]);
    }
  }, []);

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cartItems];
    const newQty = (updated[index].quantity || 1) + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setCartItems(updated);
    localStorage.setItem("helmet_cart", JSON.stringify(updated));
  };

  const removeItem = (index: number) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("helmet_cart", JSON.stringify(updated));
  };

  const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const randomNum = "Hlm-" + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomNum);
    localStorage.removeItem("helmet_cart");
    setCartItems([]);
    setStep("success");
  };

  if (!mounted) {
    return <div className="min-h-screen bg-white text-black" />;
  }

  const total = cartItems.reduce((acc, item) => {
    const priceNum = parseFloat(String(item.price || "0").replace("$", "")) || 0;
    return acc + priceNum * (item.quantity || 1);
  }, 0);

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-20 font-sans pt-6">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md flex justify-between items-center py-6 mb-14 border-b border-neutral-200">
        <Link href="/" className="text-xs tracking-[0.25em] text-neutral-600 hover:text-black transition-colors w-40">
          ← Back To Home
        </Link>
        <Link href="/" className="font-cancellaresca text-4xl md:text-5xl tracking-[0.08em] text-center text-black">
          Helmet Cart
        </Link>
        <div className="w-40 flex justify-end">
          <span className="text-sm tracking-widest text-black flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="font-semibold">[{cartCount}]</span>
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto pb-24">
        {step === "cart" && (
          <div>
            <div className="flex justify-between items-end mb-10">
              <h1 className="font-cancellaresca text-3xl md:text-4xl tracking-[0.08em]">Your Cart</h1>
              <Link href="/shop" className="text-xs tracking-[0.2em] text-neutral-500 hover:text-black border-b border-neutral-400 pb-1">
                Continue Shopping
              </Link>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center gap-6 border border-neutral-200">
                <p className="text-xs tracking-[0.25em] text-neutral-500">Your Cart Is Currently Empty</p>
                <Link
                  href="/shop"
                  className="inline-block bg-black text-white text-xs tracking-[0.25em] px-8 py-4 font-bold hover:bg-neutral-800 transition-colors"
                >
                  Explore Shop
                </Link>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-12 pb-4 border-b border-neutral-200 text-[11px] tracking-[0.2em] text-neutral-400">
                  <span className="col-span-6">Product</span>
                  <span className="col-span-4 text-center">Quantity</span>
                  <span className="col-span-2 text-right">Total</span>
                </div>

                <div className="divide-y divide-neutral-200">
                  {cartItems.map((item, index) => {
                    const itemPrice = parseFloat(String(item.price || "0").replace("$", "")) || 0;
                    const imgSrc = item.image || `/product${item.id === "02" ? "2" : "1"}.jpg`;
                    return (
                      <div key={index} className="grid grid-cols-12 py-6 items-center">
                        <div className="col-span-6 flex items-center gap-5">
                          <div className="w-20 h-24 bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0">
                            <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] tracking-[0.2em] text-neutral-400">Helmet Haute Couture</span>
                            <h3 className="font-cancellaresca text-2xl tracking-[0.08em] text-black">{toTitleCase(item.name)}</h3>
                            <p className="text-xs text-neutral-500 tracking-widest">${itemPrice}</p>
                            <p className="text-[11px] text-neutral-500 tracking-widest mt-1">Size: {item.size}</p>
                          </div>
                        </div>

                        <div className="col-span-4 flex items-center justify-center gap-4">
                          <div className="flex items-center border border-neutral-300 text-xs">
                            <button type="button" onClick={() => updateQuantity(index, -1)} className="px-3 py-1.5 hover:bg-neutral-100 cursor-pointer">−</button>
                            <span className="px-4 py-1.5 font-semibold">{item.quantity || 1}</span>
                            <button type="button" onClick={() => updateQuantity(index, 1)} className="px-3 py-1.5 hover:bg-neutral-100 cursor-pointer">+</button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-[11px] tracking-widest text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="col-span-2 text-right text-xs font-bold tracking-widest">
                          ${itemPrice * (item.quantity || 1)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 pt-8 border-t border-neutral-200 flex flex-col items-end gap-4">
                  <div className="w-full max-w-sm flex flex-col gap-3">
                    <div className="flex justify-between text-xs tracking-[0.15em] text-neutral-500">
                      <span>Shipping</span>
                      <span>Complimentary</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold tracking-[0.15em] pt-2 border-t border-neutral-200">
                      <span>Estimated Total</span>
                      <span>${total} Usd</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("checkout")}
                      className="w-full bg-black text-white font-bold text-xs tracking-[0.25em] py-4 mt-4 hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Proceed To Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === "checkout" && (
          <div className="max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setStep("cart")}
              className="text-xs tracking-[0.2em] text-neutral-500 hover:text-black mb-8 inline-block cursor-pointer"
            >
              ← Back To Cart
            </button>

            <h1 className="font-cancellaresca text-3xl md:text-4xl tracking-[0.08em] mb-8">Checkout</h1>

            <form onSubmit={handlePlaceOrder} className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-bold tracking-[0.2em] border-b border-neutral-200 pb-2">
                  1. Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" required className="border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none" />
                  <input type="text" placeholder="Last Name" required className="border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none" />
                </div>
                <input type="email" placeholder="Email Address (For Order Confirmation)" required className="border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none" />
                <input type="text" placeholder="Shipping Address" required className="border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="City" required className="border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none" />
                  <input type="text" placeholder="Postal Code" required className="border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none" />
                  <input type="text" placeholder="Country" required className="border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-bold tracking-[0.2em] border-b border-neutral-200 pb-2">
                  2. Payment Method
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3.5 text-xs tracking-wider border text-center cursor-pointer transition-colors ${
                      paymentMethod === "card" ? "border-black bg-black text-white font-bold" : "border-neutral-300 text-neutral-600 hover:border-black"
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("apple")}
                    className={`p-3.5 text-xs tracking-wider border text-center cursor-pointer transition-colors ${
                      paymentMethod === "apple" ? "border-black bg-black text-white font-bold" : "border-neutral-300 text-neutral-600 hover:border-black"
                    }`}
                  >
                    Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-3.5 text-xs tracking-wider border text-center cursor-pointer transition-colors ${
                      paymentMethod === "paypal" ? "border-black bg-black text-white font-bold" : "border-neutral-300 text-neutral-600 hover:border-black"
                    }`}
                  >
                    PayPal
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="flex flex-col gap-4 mt-2 p-4 bg-neutral-50 border border-neutral-200">
                    <input type="text" placeholder="Card Number (0000 0000 0000 0000)" required className="bg-white border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Mm / Yy" required className="bg-white border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none" />
                      <input type="text" placeholder="Cvc" required className="bg-white border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none" />
                    </div>
                  </div>
                )}

                {paymentMethod === "apple" && (
                  <div className="p-6 bg-neutral-50 border border-neutral-200 text-center text-xs tracking-wider text-neutral-600">
                    You Will Confirm Your Payment With Touch Id / Face Id Upon Clicking Place Order.
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="p-6 bg-neutral-50 border border-neutral-200 text-center text-xs tracking-wider text-neutral-600">
                    You Will Be Redirected To PayPal To Complete Your Purchase Securely.
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-200 pt-6 flex flex-col gap-3">
                <div className="flex justify-between text-xs tracking-wider text-neutral-500">
                  <span>Items ({cartCount})</span>
                  <span>${total} Usd</span>
                </div>
                <div className="flex justify-between text-xs tracking-wider text-neutral-500">
                  <span>Express Couture Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold tracking-wider pt-2 border-t border-neutral-200">
                  <span>Total To Pay</span>
                  <span>${total} Usd</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold text-xs tracking-[0.25em] py-4 mt-4 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Place Order — ${total} Usd
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="max-w-xl mx-auto py-20 px-8 border border-neutral-200 bg-neutral-50 text-center flex flex-col items-center gap-5">
            <span className="font-cancellaresca text-4xl text-black">Thank You</span>
            <p className="text-xs font-bold tracking-[0.25em]">Order Confirmed — #{orderNumber}</p>
            <p className="text-xs text-neutral-500 tracking-wider leading-relaxed max-w-md">
              Your Helmet Haute Couture Order Has Been Registered. A Confirmation Email With Your Private Tracking Link Will Be Sent Shortly.
            </p>
            <Link
              href="/shop"
              className="mt-4 bg-black text-white text-xs tracking-[0.25em] px-8 py-4 font-bold hover:bg-neutral-800 transition-colors"
            >
              Return To Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}