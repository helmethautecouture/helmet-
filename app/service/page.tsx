"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LouisXVIFrame from "../LouisXVIFrame";
import AtelierAtmosphere from "../AtelierAtmosphere";

export default function ClientServicePage() {
  const [cartCount, setCartCount] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [subject, setSubject] = useState("Order Inquiry");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

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
    if (!email.trim() || !message.trim()) return;

    setStatus("sending");

    const cleanRef = orderNumber.trim().toUpperCase();
    const fullSubject = `[CLIENT SERVICE${cleanRef ? ` — ${cleanRef}` : ""}] ${subject}`;

    try {
      const res = await fetch("https://formsubmit.co/ajax/helmetcothes@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: fullSubject,
          Full_Name: name,
          Email: email,
          Order_Reference: cleanRef || "N/A",
          Subject: subject,
          Message: message,
        }),
      });

      if (!res.ok) {
        throw new Error("FormSubmit activation required");
      }
    } catch {
      /* Ouverture directe de la messagerie pré-remplie vers helmetcothes@gmail.com si le serveur bloque */
      const bodyText = `Name: ${name}\nEmail: ${email}\nOrder Reference: ${cleanRef || "N/A"}\n\n${message}`;
      window.location.href = `mailto:helmetcothes@gmail.com?subject=${encodeURIComponent(
        fullSubject
      )}&body=${encodeURIComponent(bodyText)}`;
    }

    setStatus("sent");
    setName("");
    setEmail("");
    setOrderNumber("");
    setMessage("");
  };

  return (
    <div className="helmet-page-container">
      <AtelierAtmosphere mode="petals-only" inverted />

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        className="helmet-page-header"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div style={{ justifySelf: "start" }}>
          <Link
            href="/"
            className="helmet-zoom-link"
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              whiteSpace: "nowrap",
              color: "#ffffff",
            }}
          >
            ← Back To Home
          </Link>
        </div>

        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <Link href="/">
            <LouisXVIFrame variant="title" inverted>
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(28px, 4.2vw, 46px)",
                  lineHeight: 1,
                  display: "block",
                  whiteSpace: "nowrap",
                  color: "#ffffff",
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
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              color: "#ffffff",
            }}
          >
            <svg width="17" height="17" style={{ width: "17px", height: "17px", minWidth: "17px" }} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l1 12H5L6 8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span>[{cartCount}]</span>
          </Link>
        </div>
      </motion.header>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "620px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.08 }}
          style={{ textAlign: "center", marginBottom: "36px" }}
        >
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: "rgba(255,255,255,0.72)",
              margin: 0,
            }}
          >
            Paris — Atelier Concierge
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11.5px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
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
                fontSize: "11.5px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
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
                fontSize: "11.5px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                marginBottom: "8px",
              }}
            >
              Order Reference <span style={{ color: "rgba(255,255,255,0.55)" }}>(Optional)</span>
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="EX: HLM-123456 (OPTIONAL)"
              className="helmet-input"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "11.5px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
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
              <option value="Order Inquiry">ORDER INQUIRY</option>
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
                fontSize: "11.5px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
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
                fontSize: "12.5px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#ffffff",
                textAlign: "center",
                marginTop: "6px",
              }}
            >
              ✓ Your message has been transmitted to our Paris studio.
            </p>
          )}
        </motion.form>
      </div>
    </div>
  );
}