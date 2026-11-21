"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LouisXVIFrame from "../LouisXVIFrame";

/* ============================================================================
   CONFIGURATION ENCAISSEMENT RÉEL (STRIPE PAYMENT LINK)
   Colle ton lien Stripe Checkout (ex: "https://buy.stripe.com/...") ci-dessous
   pour que le client soit redirigé vers Stripe et que l'argent arrive sur ton compte.
   ============================================================================ */
const STRIPE_PAYMENT_LINK: string = "";

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

  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "applepay" | "paypal">("card");

  /* Étape 1 : Coordonnées de livraison */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");

  /* Étape 2 : Détails Carte */
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  /* Étape 3 : Reçu & Bordereau d'expédition */
  const [orderReference, setOrderReference] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [purchasedTotal, setPurchasedTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const syncCart = (updated: CartItem[]) => {
    setItems(updated);
    const serialized = JSON.stringify(updated);
    localStorage.setItem("helmet_cart", serialized);
    localStorage.setItem("cart", serialized);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("helmet_cart") || localStorage.getItem("cart") || "[]";
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }

      /* Si le client revient depuis Stripe Checkout (?paid=1), on affiche automatiquement son reçu */
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("paid") === "1") {
          const savedOrder = localStorage.getItem("helmet_last_order");
          if (savedOrder) {
            const o = JSON.parse(savedOrder);
            setOrderReference(o.ref || "HLM-000001");
            setOrderDate(o.date || new Date().toLocaleDateString("fr-FR"));
            setFirstName(o.firstName || "");
            setLastName(o.lastName || "");
            setStreetAddress(o.streetAddress || "");
            setPostalCode(o.postalCode || "");
            setCity(o.city || "");
            setCountry(o.country || "");
            setPhone(o.phone || "");
            setPurchasedItems(o.items || []);
            setPurchasedTotal(o.total || 150);
            setPaymentMethod(o.method || "card");
            setCheckoutStep(3);
            syncCart([]);
          }
        }
      }
    } catch {
      setItems([]);
    }
  }, []);

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

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !customerEmail || !phone || !streetAddress || !postalCode || !city || !country) {
      return;
    }
    setCheckoutStep(2);
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);

    const generatedRef = `HLM-${Math.floor(100000 + Math.random() * 900000)}`;
    const todayStr = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const orderSummary = items
      .map((i) => `${i.name} (Size ${i.size}) x${i.quantity} — ${i.price * i.quantity} €`)
      .join("\n");

    const formattedAddress = `${firstName} ${lastName}\n${streetAddress}\n${postalCode} ${city}\n${country}\nTel: ${phone}`;

    /* Sauvegarde locale du reçu pour l'impression et le retour Stripe */
    localStorage.setItem(
      "helmet_last_order",
      JSON.stringify({
        ref: generatedRef,
        date: todayStr,
        firstName,
        lastName,
        streetAddress,
        postalCode,
        city,
        country,
        phone,
        items,
        total: subtotal,
        method: paymentMethod,
      })
    );

    /* Envoi immédiat de la commande complète + bordereau sur ta boîte helmetcothes@gmail.com */
    try {
      await fetch("https://formsubmit.co/ajax/helmetcothes@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `[NOUVELLE COMMANDE ${generatedRef} — HELMET HAUTE COUTURE] ${subtotal} €`,
          Numero_Commande: generatedRef,
          Date: todayStr,
          Client: `${firstName} ${lastName}`,
          Email_Client: customerEmail,
          Telephone: phone,
          Moyen_Paiement: paymentMethod.toUpperCase(),
          Adresse_Livraison: formattedAddress,
          Articles: orderSummary,
          Total_Paye: `${subtotal} €`,
        }),
      });
    } catch {}

    /* Si tu as renseigné ton lien Stripe en haut du fichier, redirige vers Stripe pour débiter le client */
    if (STRIPE_PAYMENT_LINK.trim().startsWith("http")) {
      const separator = STRIPE_PAYMENT_LINK.includes("?") ? "&" : "?";
      window.location.href = `${STRIPE_PAYMENT_LINK.trim()}${separator}prefilled_email=${encodeURIComponent(
        customerEmail
      )}&client_reference_id=${generatedRef}`;
      return;
    }

    setOrderReference(generatedRef);
    setOrderDate(todayStr);
    setPurchasedItems([...items]);
    setPurchasedTotal(subtotal);
    setSubmitting(false);
    setCheckoutStep(3);
    syncCart([]);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const totalCount = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  return (
    <div className="helmet-page-container">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        className="helmet-page-header no-print"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div style={{ justifySelf: "start" }}>
          <Link
            href="/shop"
            className="helmet-zoom-link"
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              whiteSpace: "nowrap",
              color: "#ffffff",
            }}
          >
            ← Continue Shopping
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
                Helmet Cart
              </span>
            </LouisXVIFrame>
          </Link>
        </div>

        <div style={{ justifySelf: "end" }}>
          <span
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#ffffff",
            }}
          >
            [{totalCount}]
          </span>
        </div>
      </motion.header>

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* ====================================================================
            ÉTAPE 3 : REÇU OFFICIEL & BORDEREAU D'EXPÉDITION IMPRIMABLE
            ==================================================================== */}
        {checkoutStep === 3 ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="helmet-receipt-box"
            style={{
              maxWidth: "660px",
              margin: "24px auto",
              border: "1px solid rgba(255,255,255,0.32)",
              backgroundColor: "#080808",
              padding: "38px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "26px",
            }}
          >
            <div style={{ textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "22px" }}>
              <p
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.7)",
                  margin: "0 0 8px 0",
                }}
              >
                Helmet Haute Couture — Paris Atelier
              </p>
              <h1
                className="font-cancellaresca"
                style={{ fontSize: "clamp(38px, 5vw, 52px)", margin: "0 0 12px 0", color: "#ffffff" }}
              >
                Thanks For Your Purchase
              </h1>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  flexWrap: "wrap",
                  fontSize: "13px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                }}
              >
                <span>Order : {orderReference}</span>
                <span>•</span>
                <span>Date : {orderDate}</span>
              </div>
            </div>

            <div className="helmet-readable-text" style={{ textAlign: "center" }}>
              <p style={{ margin: "0 0 14px 0" }}>
                Thank you, <strong>{firstName} {lastName}</strong>. Your handcrafted piece is now scheduled for
                preparation at our Paris studio (please allow 2–3 weeks for bespoke atelier crafting and dispatch).
              </p>
              <p style={{ margin: 0 }}>
                You will receive your shipping and tracking notification shortly. For any question or modification
                regarding your order, please contact our{" "}
                <Link
                  href="/service"
                  style={{ textDecoration: "underline", color: "#ffffff" }}
                >
                  Client Service
                </Link>{" "}
                with your reference <strong>{orderReference}</strong>.
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.2)",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                padding: "22px 0",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px",
              }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: "8px",
                  }}
                >
                  Delivery Destination
                </span>
                <p className="helmet-readable-text" style={{ margin: 0, textTransform: "uppercase" }}>
                  {firstName} {lastName}
                  <br />
                  {streetAddress}
                  <br />
                  {postalCode} {city}
                  <br />
                  {country}
                  <br />
                  Tel : {phone}
                </p>
              </div>

              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: "8px",
                  }}
                >
                  Order Summary
                </span>
                {purchasedItems.map((pi, i) => (
                  <p key={i} className="helmet-readable-text" style={{ margin: "0 0 8px 0" }}>
                    {pi.name} — Size {pi.size} (x{pi.quantity})
                  </p>
                ))}
                <p className="helmet-readable-text" style={{ margin: "12px 0 0 0", textTransform: "uppercase" }}>
                  Paid via {paymentMethod.toUpperCase()} : <strong>{purchasedTotal} €</strong>
                </p>
              </div>
            </div>

            <div
              className="no-print"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "12px",
                paddingTop: "4px",
              }}
            >
              <button
                type="button"
                onClick={handlePrintReceipt}
                style={{
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  border: "1px solid #ffffff",
                  padding: "15px 20px",
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Print Receipt / Slip
              </button>

              <Link href="/" className="helmet-btn-black">
                Return To Menu
              </Link>
            </div>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.08 }}
            style={{ maxWidth: "460px", margin: "60px auto", textAlign: "center" }}
          >
            <p
              style={{
                fontSize: "14px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                marginBottom: "28px",
              }}
            >
              Your Atelier Bag Is Empty
            </p>
            <Link href="/shop" className="helmet-btn-black" style={{ maxWidth: "260px" }}>
              Explore Edition -01
            </Link>
          </motion.div>
        ) : (
          <div className="helmet-cart-grid">
            {/* COLONNE GAUCHE : ARTICLES DANS LE PANIER */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.08 }}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {items.map((item, idx) => (
                <div
                  key={`${item.id}-${item.size}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "96px 1fr auto",
                    gap: "18px",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.18)",
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
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  />

                  <div>
                    <h3 className="font-cancellaresca" style={{ fontSize: "28px", margin: "0 0 6px 0", color: "#ffffff" }}>
                      {item.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.78)",
                        margin: "0 0 12px 0",
                      }}
                    >
                      Size {item.size} — Unique Piece
                    </p>

                    <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.35)" }}>
                      <button
                        type="button"
                        onClick={() => updateQty(idx, -1)}
                        style={{
                          padding: "6px 14px",
                          background: "transparent",
                          border: "none",
                          color: "#ffffff",
                          fontSize: "15px",
                          cursor: "pointer",
                        }}
                      >
                        -
                      </button>
                      <span style={{ padding: "0 14px", fontSize: "14px", color: "#ffffff" }}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(idx, 1)}
                        style={{
                          padding: "6px 14px",
                          background: "transparent",
                          border: "none",
                          color: "#ffffff",
                          fontSize: "15px",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", fontSize: "16px", letterSpacing: "0.12em", color: "#ffffff" }}>
                    {item.price * item.quantity} €
                  </div>
                </div>
              ))}
            </motion.div>

            {/* COLONNE DROITE : TUNNEL CHECKOUT & PAYMENT */}
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "28px 22px",
                backgroundColor: "#080808",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255,255,255,0.18)",
                  paddingBottom: "14px",
                  marginBottom: "22px",
                }}
              >
                <h2
                  style={{
                    fontSize: "14px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    margin: 0,
                    color: "#ffffff",
                  }}
                >
                  Checkout & Payment
                </h2>
                <span
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Step {checkoutStep} / 2
                </span>
              </div>

              <AnimatePresence mode="wait">
                {checkoutStep === 1 && (
                  <motion.form
                    key="step-1-shipping"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleProceedToPayment}
                    style={{ display: "flex", flexDirection: "column", gap: "14px" }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      1. Contact & Delivery Details
                    </span>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="FIRST NAME"
                        className="helmet-input"
                      />
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="LAST NAME"
                        className="helmet-input"
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="EMAIL ADDRESS"
                        className="helmet-input"
                      />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="PHONE NUMBER"
                        className="helmet-input"
                      />
                    </div>

                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="STREET ADDRESS & APARTMENT"
                      className="helmet-input"
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="POSTAL / ZIP CODE"
                        className="helmet-input"
                      />
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="CITY"
                        className="helmet-input"
                      />
                    </div>

                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="COUNTRY"
                      className="helmet-input"
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px solid rgba(255,255,255,0.18)",
                        paddingTop: "16px",
                        marginTop: "6px",
                        fontSize: "15px",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#ffffff",
                      }}
                    >
                      <span>Subtotal (Tax Incl.)</span>
                      <span>{subtotal} €</span>
                    </div>

                    <button type="submit" className="helmet-btn-black" style={{ marginTop: "6px" }}>
                      Next: Payment Method →
                    </button>
                  </motion.form>
                )}

                {checkoutStep === 2 && (
                  <motion.form
                    key="step-2-payment"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleCompletePayment}
                    style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.75)",
                        }}
                      >
                        2. Payment Method
                      </span>
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "11.5px",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          textDecoration: "underline",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        ← Edit Shipping
                      </button>
                    </div>

                    <div
                      style={{
                        padding: "12px 14px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        fontSize: "13px",
                        letterSpacing: "0.06em",
                        color: "rgba(255,255,255,0.88)",
                        lineHeight: 1.6,
                      }}
                    >
                      {firstName} {lastName} — {streetAddress}, {postalCode} {city}, {country}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                      {[
                        { id: "card", label: "Card (CB)" },
                        { id: "applepay", label: "Apple Pay" },
                        { id: "paypal", label: "PayPal" },
                      ].map((m) => {
                        const active = paymentMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPaymentMethod(m.id as any)}
                            style={{
                              padding: "13px 6px",
                              fontSize: "12px",
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              cursor: "pointer",
                              backgroundColor: active ? "#ffffff" : "#050505",
                              color: active ? "#000000" : "#ffffff",
                              border: "1px solid #ffffff",
                            }}
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>

                    {paymentMethod === "card" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="NAME ON CARD"
                          className="helmet-input"
                        />
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="CARD NUMBER (0000 0000 0000 0000)"
                          className="helmet-input"
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="EXPIRY (MM/YY)"
                            className="helmet-input"
                          />
                          <input
                            type="text"
                            required
                            inputMode="numeric"
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="CVC (123)"
                            className="helmet-input"
                          />
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px solid rgba(255,255,255,0.18)",
                        paddingTop: "16px",
                        fontSize: "15px",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#ffffff",
                      }}
                    >
                      <span>Total To Pay</span>
                      <span>{subtotal} €</span>
                    </div>

                    <button type="submit" disabled={submitting} className="helmet-btn-black">
                      {submitting ? "Processing Payment..." : `Confirm & Pay — ${subtotal} €`}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}