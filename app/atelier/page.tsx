"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import LouisXVIFrame from "../LouisXVIFrame";

/* Code PIN d'accès à ton registre d'atelier (modifiable à ta guise) */
const ATELIER_PIN = "0001";

interface OrderRecord {
  ref: string;
  date: string;
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  phonePrefix: string;
  phone: string;
  items: { name: string; size: string; quantity: number; price: number }[];
  total: number;
  method: string;
  status: string;
}

export default function AtelierOrdersPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("helmet_orders_archive") || "[]");
      if (Array.isArray(saved)) setOrders(saved);
    } catch {}
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ATELIER_PIN) {
      setUnlocked(true);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.ref.toLowerCase().includes(q) ||
      `${o.firstName} ${o.lastName}`.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q)
    );
  });

  if (!unlocked) {
    return (
      <div className="helmet-page-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form
          onSubmit={handleUnlock}
          style={{
            maxWidth: "380px",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.28)",
            padding: "32px 24px",
            backgroundColor: "#080808",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <h1 className="font-cancellaresca" style={{ fontSize: "38px", margin: 0 }}>
            Atelier Registry
          </h1>
          <p style={{ fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", margin: 0 }}>
            Private Order & Dispatch Log
          </p>
          <input
            type="password"
            inputMode="numeric"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="ENTER ATELIER PIN (0001)"
            className="helmet-input"
            style={{ textAlign: "center" }}
          />
          <button type="submit" className="helmet-btn-black">
            Access Registry
          </button>
          <Link href="/" style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
            ← Return To Site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="helmet-page-container">
      <header className="helmet-page-header no-print">
        <div style={{ justifySelf: "start" }}>
          <Link href="/" style={{ fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            ← Back To Menu
          </Link>
        </div>
        <div style={{ justifySelf: "center" }}>
          <LouisXVIFrame variant="title" inverted>
            <span className="font-cancellaresca" style={{ fontSize: "clamp(26px, 4vw, 42px)", color: "#ffffff" }}>
              Atelier Orders
            </span>
          </LouisXVIFrame>
        </div>
        <div style={{ justifySelf: "end" }}>
          <span style={{ fontSize: "12px", letterSpacing: "0.2em" }}>[{orders.length}]</span>
        </div>
      </header>

      <div style={{ maxWidth: "920px", margin: "0 auto" }}>
        <div className="no-print" style={{ marginBottom: "28px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH BY ORDER REFERENCE (HLM-...), CLIENT NAME OR CITY..."
            className="helmet-input"
          />
        </div>

        {filteredOrders.length === 0 ? (
          <p className="helmet-readable-text" style={{ textAlign: "center", padding: "40px 0" }}>
            No orders recorded yet. All completed checkouts and Stripe payments also appear in your Stripe Dashboard and Gmail.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filteredOrders.map((ord) => (
              <div
                key={ord.ref}
                className="helmet-receipt-box"
                style={{
                  border: "1px solid rgba(255,255,255,0.28)",
                  padding: "24px",
                  backgroundColor: "#080808",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
                    Order & Date
                  </span>
                  <p className="helmet-readable-text" style={{ margin: "6px 0 0 0" }}>
                    <strong>{ord.ref}</strong> — {ord.date}
                    <br />
                    Total : <strong>{ord.total} €</strong>
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: "11px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
                    Shipping Label
                  </span>
                  <p className="helmet-readable-text" style={{ margin: "6px 0 0 0", textTransform: "uppercase" }}>
                    {ord.firstName} {ord.lastName}
                    <br />
                    {ord.streetAddress}, {ord.postalCode} {ord.city}, {ord.country}
                    <br />
                    Tel : {ord.phonePrefix} {ord.phone}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
                      Garments
                    </span>
                    {ord.items.map((it, i) => (
                      <p key={i} className="helmet-readable-text" style={{ margin: "6px 0 0 0" }}>
                        {it.name} — Size {it.size} (x{it.quantity})
                      </p>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="no-print"
                    style={{
                      border: "1px solid #ffffff",
                      background: "transparent",
                      color: "#ffffff",
                      padding: "10px 14px",
                      fontSize: "11px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Print Shipping Slip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}