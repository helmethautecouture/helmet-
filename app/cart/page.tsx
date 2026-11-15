"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

interface CartItem {
  id?: string | number;
  name?: string;
  title?: string;
  price: number | string;
  size?: string;
  quantity: number;
  image?: string;
}

function CartContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay" | "paypal">("card");

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  const parsePrice = (p: number | string) => {
    const num = typeof p === "number" ? p : Number(String(p).replace(/[^0-9.]/g, ""));
    return num > 0 ? num : 180;
  };

  useEffect(() => {
    const possibleKeys = ["cart", "helmet_cart", "helmetCart", "shopping-cart", "bag"];
    let found: CartItem[] = [];

    for (const key of possibleKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            found = parsed.map((item: CartItem) => ({
              ...item,
              name: "Article -01 — Helmet",
              price: parsePrice(item.price),
              image: "/product1.jpg",
            }));
            break;
          }
        } catch {}
      }
    }

    setCart(found);

    if (isSuccess && found.length > 0) {
      const savedCustomer = localStorage.getItem("helmet_pending_customer");
      const customerData = savedCustomer ? JSON.parse(savedCustomer) : {};

      fetch("https://formsubmit.co/ajax/helmetcothes@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "NOUVELLE COMMANDE PAYEE - HELMET -01",
          _template: "table",
          Statut: "PAIEMENT VALIDE PAR STRIPE",
          Client: `${customerData.firstName || ""} ${customerData.lastName || ""}`,
          Email: customerData.email || "Voir compte Stripe",
          Telephone: customerData.phone || "Voir compte Stripe",
          Adresse_Livraison: `${customerData.address || ""}, ${customerData.postalCode || ""} ${customerData.city || ""}, ${customerData.country || ""}`,
          Articles: found
            .map((i) => `${i.name || i.title} (Size: ${i.size || "2"}) x${i.quantity || 1} - $${parsePrice(i.price)}`)
            .join(" | "),
        }),
      }).catch(() => {});

      possibleKeys.forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem("helmet_pending_customer");
      setCart([]);
    }
  }, [isSuccess]);

  const syncStorage = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    localStorage.setItem("helmet_cart", JSON.stringify(updated));
  };

  const updateQuantity = (idx: number, delta: number) => {
    const updated = [...cart];
    updated[idx].quantity = Math.max(1, (Number(updated[idx].quantity) || 1) + delta);
    syncStorage(updated);
  };

  const removeItem = (idx: number) => {
    const updated = cart.filter((_, i) => i !== idx);
    syncStorage(updated);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * (Number(item.quantity) || 1),
    0
  );

  const totalCount = cart.reduce((s, i) => s + (Number(i.quantity) || 1), 0);

  async function handleRealCheckout(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (cart.length === 0) {
      setErrorMsg("Your shopping bag is empty.");
      return;
    }

    setLoading(true);
    localStorage.setItem("helmet_pending_customer", JSON.stringify(customer));

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customer,
          preferredMethod: paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg(data.error || "Payment initialization failed.");
        setLoading(false);
      }
    } catch {
      setErrorMsg("Unable to connect to payment server.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-20 pt-5 md:pt-6 pb-20 font-sans">
      <header className="grid grid-cols-3 items-center border-b border-neutral-200 pb-4 md:pb-6 mb-10 md:mb-14">
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
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] flex items-center gap-1.5 whitespace-nowrap">
            <svg
              width="16"
              height="16"
              style={{ width: "16px", height: "16px", minWidth: "16px" }}
              className="w-4 h-4 text-black shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="font-semibold">[{totalCount}]</span>
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        {isSuccess ? (
          <div className="max-w-lg mx-auto border border-black p-8 md:p-10 text-center space-y-6 my-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
              Paris Atelier — Edition -01
            </p>
            <h1 className="font-cancellaresca text-3xl md:text-4xl font-normal">
              Order Confirmed
            </h1>
            <p className="text-xs text-neutral-600 uppercase tracking-widest leading-relaxed">
              Thank you for your acquisition. Your payment has been verified and a confirmation receipt has been sent to your email.
            </p>
            <Link
              href="/shop"
              className="inline-block w-full bg-black text-white py-4 text-xs uppercase tracking-[0.25em] hover:bg-neutral-800 transition"
            >
              Return to Shop
            </Link>
          </div>
        ) : (
          <>
            {isCanceled && (
              <div className="mb-8 p-4 border border-red-600 text-red-600 text-xs uppercase tracking-[0.2em] text-center">
                Payment was canceled. Your order has not been charged.
              </div>
            )}

            {errorMsg && (
              <div className="mb-8 p-4 border border-red-600 text-red-600 text-xs uppercase tracking-[0.2em] text-center">
                {errorMsg}
              </div>
            )}

            {cart.length === 0 ? (
              <div className="py-20 md:py-28 text-center border border-neutral-200">
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 mb-8">
                  Your shopping bag is currently empty.
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-black text-white px-10 py-4 text-xs uppercase tracking-[0.25em]"
                >
                  Explore Edition -01
                </Link>
              </div>
            ) : (
              <form onSubmit={handleRealCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
                <div className="lg:col-span-7 space-y-10 md:space-y-12">
                  <div>
                    <h2 className="font-cancellaresca text-2xl md:text-3xl mb-4 border-b border-neutral-200 pb-3">
                      Selected Pieces
                    </h2>
                    <div className="divide-y divide-neutral-200">
                      {cart.map((item, idx) => (
                        <div key={idx} className="py-5 flex justify-between items-center gap-3">
                          <div className="flex items-center gap-3 md:gap-4">
                            <img
                              src={item.image || "/product1.jpg"}
                              alt={item.name || "HELMET"}
                              className="w-14 h-20 md:w-16 md:h-20 object-cover border border-neutral-200 shrink-0"
                            />
                            <div className="space-y-1">
                              <h3 className="font-cancellaresca text-xl md:text-2xl font-normal">
                                Article -01 — Helmet
                              </h3>
                              {item.size && (
                                <p className="text-[11px] text-neutral-500 uppercase tracking-widest">
                                  Size: {item.size}
                                </p>
                              )}
                              <button
                                type="button"
                                onClick={() => removeItem(idx)}
                                className="text-[10px] uppercase tracking-widest text-neutral-400 underline pt-1 block hover:text-black bg-transparent border-0 p-0"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 md:gap-6 shrink-0">
                            <div className="flex items-center border border-neutral-300">
                              <button
                                type="button"
                                onClick={() => updateQuantity(idx, -1)}
                                className="px-2.5 py-1 text-xs hover:bg-neutral-100 bg-white border-0"
                              >
                                -
                              </button>
                              <span className="px-2.5 py-1 text-xs">{item.quantity || 1}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(idx, 1)}
                                className="px-2.5 py-1 text-xs hover:bg-neutral-100 bg-white border-0"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-xs tracking-widest font-medium w-14 md:w-20 text-right">
                              ${parsePrice(item.price) * (Number(item.quantity) || 1)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="font-cancellaresca text-2xl md:text-3xl mb-4 border-b border-neutral-200 pb-3">
                      Shipping Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        placeholder="FIRST NAME *"
                        value={customer.firstName}
                        onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                        className="bg-white border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        required
                        placeholder="LAST NAME *"
                        value={customer.lastName}
                        onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                        className="bg-white border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                      />
                      <input
                        type="email"
                        required
                        placeholder="EMAIL ADDRESS *"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="bg-white border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="PHONE NUMBER *"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="bg-white border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        required
                        placeholder="STREET ADDRESS *"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        className="md:col-span-2 bg-white border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        required
                        placeholder="POSTAL CODE *"
                        value={customer.postalCode}
                        onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                        className="bg-white border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        required
                        placeholder="CITY *"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        className="bg-white border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="border border-neutral-200 p-6 md:p-8 space-y-6 md:space-y-8 lg:sticky lg:top-8">
                    <h2 className="font-cancellaresca text-2xl md:text-3xl border-b border-neutral-200 pb-3">
                      Payment Method
                    </h2>

                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`py-3 px-2 border text-[10px] uppercase tracking-widest transition ${
                          paymentMethod === "card"
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 bg-white text-neutral-600 hover:border-black"
                        }`}
                      >
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("apple_pay")}
                        className={`py-3 px-2 border text-[10px] uppercase tracking-widest transition ${
                          paymentMethod === "apple_pay"
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 bg-white text-neutral-600 hover:border-black"
                        }`}
                      >
                        Apple Pay
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("paypal")}
                        className={`py-3 px-2 border text-[10px] uppercase tracking-widest transition ${
                          paymentMethod === "paypal"
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 bg-white text-neutral-600 hover:border-black"
                        }`}
                      >
                        PayPal
                      </button>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-neutral-200 text-xs uppercase tracking-[0.2em]">
                      <div className="flex justify-between text-neutral-500">
                        <span>Subtotal</span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Shipping</span>
                        <span>Complimentary</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium pt-4 border-t border-neutral-200">
                        <span>Total</span>
                        <span>${subtotal}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-neutral-800 transition disabled:opacity-50"
                    >
                      {loading ? "Redirecting..." : `Checkout — $${subtotal}`}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CartContent />
    </Suspense>
  );
}