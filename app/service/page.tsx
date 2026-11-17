"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import LouisXVIFrame from "../LouisXVIFrame";
import AtelierAtmosphere from "../AtelierAtmosphere";

export default function ClientServicePage() {
  const [cartCount, setCartCount] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Order Inquiry — Overlayer Jogger -01");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("helmet_cart") || localStorage.getItem("cart") || "[]";
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setCartCount(parsed.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0));
      }
    } catch {
      setCartCount(0);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setStatus("sending");

    try {
      const response = await fetch("https://formsubmit.co/ajax/helmetcothes@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `[HELMET HAUTE COUTURE] ${subject}`,
          Name: name || "Client Atelier",
          Email: email,
          Subject: subject,
          Message: message,
        }),
      });

      if (response.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        window.location.href = `mailto:helmetcothes@gmail.com?subject=${encodeURIComponent(
          `[HELMET HAUTE COUTURE] ${subject}`
        )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        setStatus("sent");
      }
    } catch {
      window.location.href = `mailto:helmetcothes@gmail.com?subject=${encodeURIComponent(
        `[HELMET HAUTE COUTURE] ${subject}`
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      setStatus("sent");
    }
  };

  return (
    <div className="helmet-page-container">
      {/* PÉTALES AU TRAIT FIN QUI TOMBENT ALÉATOIREMENT */}
      <AtelierAtmosphere mode="petals-only" />

      <header className="helmet-page-header" style={{ position: "relative", zIndex: 10 }}>
        <div style={{ justifySelf: "start" }}>
          <Link
            href="/"
            className="helmet-zoom-link"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              whiteSpace: "nowrap",
            }}
          >
            ← Back To Home
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
                Helmet Service
              </span>
            </LouisXVIFrame>
          </Link>
        </div>

        <div style={{ justifySelf: "end" }}>
          <Link
            href="/cart"
            className="helmet-zoom-link"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <svg width="16" height="16" style={{ width: "16px", height: "16px", minWidth: "16px" }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "620px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.34em",
              color: "#737373",
              margin: 0,
            }}
          >
            Paris — Atelier Concierge
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "10.5px",
                textTransform: "uppercase",
                letterSpacing: "0.26em",
                marginBottom: "8px",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="YOUR NAME"
              className="helmet-input"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "10.5px",
                textTransform: "uppercase",
                letterSpacing: "0.26em",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR@EMAIL.COM"
              className="helmet-input"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "10.5px",
                textTransform: "uppercase",
                letterSpacing: "0.26em",
                marginBottom: "8px",
              }}
            >
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="helmet-input"
            >
              <option value="Order Inquiry — Overlayer Jogger -01">
                ORDER INQUIRY — OVERLAYER JOGGER -01
              </option>
              <option value="Sizing & Measurements (Size 1 / 2 / 3)">
                SIZING & MEASUREMENTS (SIZE 1 / 2 / 3)
              </option>
              <option value="Private Appointment / Press">
                PRIVATE APPOINTMENT / PRESS
              </option>
              <option value="Other Atelier Request">OTHER ATELIER REQUEST</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "10.5px",
                textTransform: "uppercase",
                letterSpacing: "0.26em",
                marginBottom: "8px",
              }}
            >
              Message
            </label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="WRITE YOUR MESSAGE TO OUR PARIS ATELIER..."
              className="helmet-input"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="helmet-btn-black"
          >
            {status === "sending"
              ? "Transmitting To Paris Atelier..."
              : status === "sent"
              ? "Message Transmitted — Thank You"
              : "Send Message To Atelier"}
          </button>

          {status === "sent" && (
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#000000",
                textAlign: "center",
                marginTop: "6px",
              }}
            >
              ✓ Your message has been transmitted.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}