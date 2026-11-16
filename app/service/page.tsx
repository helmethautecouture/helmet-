"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import EngravedCartouche from "../EngravedCartouche";

export default function ClientServicePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [cartCount, setCartCount] = useState(0);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("_subject", "Nouveau message Client Service - HELMET -01");
    formData.append("_captcha", "false");
    formData.append("_template", "table");

    try {
      const response = await fetch("https://formsubmit.co/ajax/helmetcothes@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        const name = formData.get("Client_Name");
        const email = formData.get("Client_Email");
        const topic = formData.get("Subject");
        const msg = formData.get("Message");
        window.location.href = `mailto:helmetcothes@gmail.com?subject=${encodeURIComponent(
          `[HELMET -01] ${topic}`
        )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${msg}`)}`;
        setStatus("success");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="helmet-page-container">
      <header className="helmet-page-header">
        <div style={{ justifySelf: "start" }}>
          <Link
            href="/"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              whiteSpace: "nowrap",
            }}
          >
            ← Back To Home
          </Link>
        </div>

        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <Link href="/"><EngravedCartouche variant="title"><span className="font-cancellaresca" style={{ fontSize: "clamp(28px, 4.2vw, 44px)", lineHeight: 1 }}>Helmet Service</span></EngravedCartouche></Link>
        </div>

        <div style={{ justifySelf: "end" }}>
          <Link
            href="/cart"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <svg
              width="16"
              height="16"
              style={{ width: "16px", height: "16px", minWidth: "16px" }}
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
            <span style={{ fontWeight: 600 }}>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "672px", margin: "0 auto" }}>
        <div style={{ marginBottom: "36px" }}>
          <h1 className="font-cancellaresca" style={{ fontSize: "clamp(34px, 4vw, 48px)", margin: "0 0 12px 0" }}>
            Client Service — Edition -01
          </h1>
          <p
            style={{
              fontSize: "11px",
              color: "#737373",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Paris Atelier — Edition -01. For any inquiries regarding your order, sizing, or garment specifications. All sales are final.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "8px", color: "#737373" }}>
                Full Name *
              </label>
              <input type="text" name="Client_Name" required placeholder="Full Name" className="helmet-input" />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "8px", color: "#737373" }}>
                Email Address *
              </label>
              <input type="email" name="Client_Email" required placeholder="Email Address" className="helmet-input" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "8px", color: "#737373" }}>
                Order Reference (Optional)
              </label>
              <input type="text" name="Order_Reference" placeholder="Order #-01" className="helmet-input" />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "8px", color: "#737373" }}>
                Topic *
              </label>
              <select name="Subject" required className="helmet-input">
                <option value="Order Status & Shipping">Order Status & Shipping</option>
                <option value="Sizing & Garment Specifications">Sizing & Garment Specifications</option>
                <option value="Payment & Billing">Payment & Billing</option>
                <option value="Press & Archive">Press & Archive</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "8px", color: "#737373" }}>
              Message *
            </label>
            <textarea name="Message" rows={6} required placeholder="Write your message..." className="helmet-input" />
          </div>

          <button type="submit" disabled={status === "loading"} className="helmet-btn-black">
            {status === "loading" ? "Sending..." : "Submit Inquiry"}
          </button>

          {status === "success" && (
            <div
              style={{
                padding: "16px",
                border: "1px solid #000000",
                backgroundColor: "#fafafa",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                textAlign: "center",
              }}
            >
              Thank you. Your inquiry has been sent to Helmet Client Service.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}