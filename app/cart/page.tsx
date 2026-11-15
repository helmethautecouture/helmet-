"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

  useEffect(() => {
    // Cherche toutes les clés possibles que ton Shop utilise pour stocker le panier
    const possibleKeys = ["cart", "helmet_cart", "helmetCart", "shopping-cart", "bag"];
    let found: CartItem[] = [];

    for (const key of possibleKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            found = parsed;
            break;
          }
        } catch {}
      }
    }

    setCart(found);

    // Si retour après un VRAI paiement Stripe validé, on envoie le bordereau de commande par mail et on vide le panier
    if (isSuccess && found.length > 0) {
      const savedCustomer = localStorage.getItem("helmet_pending_customer");
      const customerData = savedCustomer ? JSON.parse(savedCustomer) : {};

      fetch("https://formsubmit.co/ajax/helmetcothes@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "NOUVELLE COMMANDE PAYÉE — HELMET HAUTE COUTURE",
          _template: "table",
          Statut: "PAIEMENT VALIDÉ PAR STRIPE",
          Client: `${customerData.firstName || ""} ${customerData.lastName || ""}`,
          Email: customerData.email || "Voir compte Stripe",
          Telephone: customerData.phone || "Voir compte Stripe",
          Adresse_Livraison: `${customerData.address || ""}, ${customerData.postalCode || ""} ${customerData.city || ""}, ${customerData.country || ""}`,
          Articles: found
            .map((i) => `${i.name || i.title} (Taille: ${i.size || "TU"}) x${i.quantity || 1} - ${i.price}€`)
            .join(" | "),
        }),
      }).catch(() => {});

      possibleKeys.forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem("helmet_pending_customer");
      setCart([]);
    }
  }, [isSuccess]);

  const parsePrice = (p: number | string) => {
    if (typeof p === "number") return p;
    const cleaned = String(p).replace(/[^0-9.]/g, "");
    return Number(cleaned) || 0;
  };

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
        // Redirection OBLIGATOIRE vers la vraie page bancaire Stripe (CB / Apple Pay / PayPal)
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white text-black px-6 md:px-20 py-24 font-sans flex items-center justify-center">
        <div className="max-w-lg w-full border border-black p-10 text-center space-y-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Helmet Haute Couture — Paris
          </p>
          <h1 className="text-2xl uppercase tracking-[0.25em] font-light">
            Payment & Order Confirmed
          </h1>
          <p className="text-xs text-neutral-600 uppercase tracking-widest leading-relaxed">
            Thank you for your acquisition. Your payment has been verified and a confirmation receipt has been sent to your email address.
          </p>
          <Link
            href="/shop"
            className="inline-block w-full bg-black text-white py-4 text-xs uppercase tracking-[0.25em] hover:bg-neutral-800 transition"
          >
            Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-20 py-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-neutral-200 pb-5">
          <Link href="/shop" className="text-xs uppercase tracking-[0.25em] hover:opacity-50 transition">
            ← Continue Shopping
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
            Bag ({cart.reduce((s, i) => s + (Number(i.quantity) || 1), 0)})
          </span>
        </div>

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
          <div className="py-28 text-center border border-neutral-200">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 mb-8">
              Your shopping bag is currently empty.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-10 py-4 text-xs uppercase tracking-[0.25em]"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRealCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Colonne Gauche : Articles + Infos Livraison */}
            <div className="lg:col-span-7 space-y-12">
              <div>
                <h2 className="text-sm uppercase tracking-[0.25em] mb-6 border-b border-neutral-200 pb-3">
                  1. Selected Pieces
                </h2>
                <div className="divide-y divide-neutral-200">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-6 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name || "HELMET"}
                            className="w-16 h-20 object-cover border border-neutral-200"
                          />
                        )}
                        <div className="space-y-1">
                          <h3 className="text-xs uppercase tracking-[0.2em] font-medium">
                            {item.name || item.title || "HELMET GARMENT"}
                          </h3>
                          {item.size && (
                            <p className="text-[11px] text-neutral-500 uppercase tracking-widest">
                              Size: {item.size}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-[10px] uppercase tracking-widest text-neutral-400 underline pt-1 block hover:text-black"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-neutral-300">
                          <button
                            type="button"
                            onClick={() => updateQuantity(idx, -1)}
                            className="px-3 py-1.5 text-xs hover:bg-neutral-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1.5 text-xs">{item.quantity || 1}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(idx, 1)}
                            className="px-3 py-1.5 text-xs hover:bg-neutral-100"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-xs tracking-widest font-medium w-20 text-right">
                          {parsePrice(item.price) * (Number(item.quantity) || 1)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infos Client pour le bordereau de livraison */}
              <div>
                <h2 className="text-sm uppercase tracking-[0.25em] mb-6 border-b border-neutral-200 pb-3">
                  2. Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="FIRST NAME *"
                    value={customer.firstName}
                    onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                    className="border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    required
                    placeholder="LAST NAME *"
                    value={customer.lastName}
                    onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                    className="border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                  />
                  <input
                    type="email"
                    required
                    placeholder="EMAIL ADDRESS *"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="PHONE NUMBER *"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    required
                    placeholder="STREET ADDRESS *"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="md:col-span-2 border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    required
                    placeholder="POSTAL CODE *"
                    value={customer.postalCode}
                    onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                    className="border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    required
                    placeholder="CITY *"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="border border-neutral-300 p-3.5 text-xs tracking-widest outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Colonne Droite : Choix du Paiement + Vrai Checkout Stripe */}
            <div className="lg:col-span-5">
              <div className="border border-neutral-200 p-8 space-y-8 sticky top-8">
                <h2 className="text-sm uppercase tracking-[0.25em] border-b border-neutral-200 pb-4">
                  3. Payment Method
                </h2>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-3 px-2 border text-[10px] uppercase tracking-widest transition ${
                      paymentMethod === "card"
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 text-neutral-600 hover:border-black"
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
                        : "border-neutral-300 text-neutral-600 hover:border-black"
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
                        : "border-neutral-300 text-neutral-600 hover:border-black"
                    }`}
                  >
                    PayPal
                  </button>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-200 text-xs uppercase tracking-[0.2em]">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span>{subtotal} €</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Shipping</span>
                    <span>Complimentary</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium pt-4 border-t border-neutral-200">
                    <span>Total Due</span>
                    <span>{subtotal} €</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {loading
                    ? "Connecting to Secure Bank..."
                    : `Pay ${subtotal} € with ${
                        paymentMethod === "apple_pay"
                          ? "Apple Pay"
                          : paymentMethod === "paypal"
                          ? "PayPal"
                          : "Card"
                      }`}
                </button>

                <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center leading-relaxed">
                  Encrypted transaction powered by Stripe. Orders are only confirmed once payment is authorized.
                </p>
              </div>
            </div>
          </form>
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