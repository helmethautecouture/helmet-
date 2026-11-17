"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import LouisXVIFrame from "../LouisXVIFrame";
import AtelierAtmosphere from "../AtelierAtmosphere";

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "applepay" | "paypal">("card");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("helmet_cart") || localStorage.getItem("cart") || "[]";
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      setItems([]);
    }
  }, []);

  const syncCart = (updated: CartItem[]) => {
    setItems(updated);
    const serialized = JSON.stringify(updated);
    localStorage.setItem("helmet_cart", serialized);
    localStorage.setItem("cart", serialized);
  };

  const updateQty = (index: number, delta: number) => {
    const copy = [...items];
    const nextQty = (Number(copy[index].quantity) || 1) + delta;
    if (nextQty <= 0) {
      copy.splice(index, 1);
    } else {
      copy[index].quantity = nextQty;
    }
    syncCart(copy);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + (Number(item.price) || 150) * (Number(item.quantity) || 1),
    0
  );

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !customerEmail || !shippingAddress) return;

    setSubmitting(true);

    const orderSummary = items
      .map((i) => `${i.name} (Size ${i.size}) x${i.quantity} — ${i.price * i.quantity} €`)
      .join("\n");

    try {
      await fetch("https://formsubmit.co/ajax/helmetcothes@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `[NEW ORDER — HELMET HAUTE COUTURE] ${subtotal} € (${paymentMethod.toUpperCase()})`,
          Customer_Email: customerEmail,
          Payment_Method: paymentMethod.toUpperCase(),
          Shipping_Address: shippingAddress,
          Items: orderSummary,
          Total: `${subtotal} €`,
        }),
      });
    } catch {}

    setSubmitting(false);
    setOrderConfirmed(true);
    syncCart([]);
  };

  const totalCount = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  return (
    <div className="helmet-page-container">
      <AtelierAtmosphere intensity="subtle" />

      <header className="helmet-page-header" style={{ position: "relative", zIndex: 10 }}>
        <div style={{ justifySelf: "start" }}>
          <Link
            href="/shop"
            className="helmet-zoom-link"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              whiteSpace: "nowrap",
            }}
          >
            ← Continue Shopping
          </Link>
        </div>

        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <Link href="/">
            <LouisXVIFrame variant="title">
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(28px, 4.2vw, 44px)",
                  lineHeight: 1,
                  display: "block",
                  whiteSpace: "nowrap",
                }}
              >
                Helmet Cart
              </span>
            </LouisXVIFrame>
          </Link>
        </div>

        <div style={{ justifySelf: "end" }}>
          <span
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
            }}
          >
            [{totalCount}]
          </span>
        </div>
      </header>

      <div style={{ position: "relative", zIndex: 10 }}>
        {orderConfirmed ? (
          <div style={{ maxWidth: "540px", margin: "60px auto", textAlign: "center" }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: "#6B0F1A",
                marginBottom: "12px",
              }}
            >
              Paris — Atelier Order Registered
            </p>
            <h2 className="font-cancellaresca" style={{ fontSize: "42px", margin: "0 0 16px 0" }}>
              Thank You
            </h2>
            <p style={{ fontSize: "13px", lineHeight: 1.8, color: "#262626", marginBottom: "32px" }}>
              Your order request has been transmitted to our Paris studio. You will receive your secure{" "}
              <strong>{paymentMethod.toUpperCase()}</strong> payment link and tracking details at{" "}
              <strong>{customerEmail}</strong>.
            </p>
            <Link href="/" className="helmet-btn-black" style={{ maxWidth: "280px" }}>
              Return To Home
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div style={{ maxWidth: "460px", margin: "60px auto", textAlign: "center" }}>
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#737373",
                marginBottom: "28px",
              }}
            >
              Your Atelier Bag Is Empty
            </p>
            <Link href="/shop" className="helmet-btn-black" style={{ maxWidth: "260px" }}>
              Explore Edition -01
            </Link>
          </div>
        ) : (
          <div className="helmet-cart-grid">
            {/* LISTE DES ARTICLES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {items.map((item, idx) => (
                <div
                  key={`${item.id}-${item.size}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "96px 1fr auto",
                    gap: "20px",
                    alignItems: "center",
                    borderBottom: "1px solid #e5e5e5",
                    paddingBottom: "24px",
                  }}
                >
                  <img
                    src={item.image || "/product1.jpg"}
                    alt={item.name}
                    style={{
                      width: "96px",
                      aspectRatio: "3 / 4",
                      objectFit: "cover",
                      border: "1px solid #e5e5e5",
                    }}
                  />

                  <div>
                    <h3 className="font-cancellaresca" style={{ fontSize: "26px", margin: "0 0 6px 0" }}>
                      {item.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "#6B0F1A",
                        margin: "0 0 12px 0",
                      }}
                    >
                      Size {item.size} — Unique Piece
                    </p>

                    <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #d4d4d4" }}>
                      <button
                        type="button"
                        onClick={() => updateQty(idx, -1)}
                        style={{
                          padding: "6px 12px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        -
                      </button>
                      <span style={{ padding: "0 12px", fontSize: "12px" }}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(idx, 1)}
                        style={{
                          padding: "6px 12px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", fontSize: "14px", letterSpacing: "0.18em" }}>
                    {item.price * item.quantity} €
                  </div>
                </div>
              ))}
            </div>

            {/* MOYENS DE PAIEMENT & CHECKOUT */}
            <form
              onSubmit={handleCheckout}
              style={{
                border: "1px solid #171717",
                padding: "28px 24px",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  margin: 0,
                  borderBottom: "1px solid #e5e5e5",
                  paddingBottom: "14px",
                }}
              >
                Atelier Checkout & Payment
              </h2>

              {/* SÉLECTEUR DE MOYEN DE PAIEMENT */}
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "10px",
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                    color: "#525252",
                  }}
                >
                  Select Payment Method
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {[
                    { id: "card", label: "Card (CB)" },
                    { id: "applepay", label: "Apple Pay" },
                    { id: "paypal", label: "PayPal" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      style={{
                        padding: "12px 6px",
                        fontSize: "10.5px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        backgroundColor: paymentMethod === m.id ? "#000000" : "#ffffff",
                        color: paymentMethod === m.id ? "#ffffff" : "#000000",
                        border: "1px solid #000000",
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Client Email
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="YOUR@EMAIL.COM"
                  className="helmet-input"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Full Shipping Address
                </label>
                <textarea
                  rows={3}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="STREET, POSTAL CODE, CITY, COUNTRY"
                  className="helmet-input"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #e5e5e5",
                  paddingTop: "16px",
                  fontSize: "13px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                <span>Total (Tax Incl.)</span>
                <span style={{ color: "#6B0F1A" }}>{subtotal} €</span>
              </div>

              <button type="submit" disabled={submitting} className="helmet-btn-black">
                {submitting ? "Processing Order..." : `Confirm Order — ${subtotal} €`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}