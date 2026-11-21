"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LouisXVIFrame from "../LouisXVIFrame";

/* ============================================================================
   CONFIGURATION DE TES ENCAISSEMENTS RÉELS (À RENSEIGNER QUAND TU ES PRÊT)
   1. STRIPE_PAYMENT_LINK : Colle ici ton lien Stripe (ex: "https://buy.stripe.com/...")
      -> Encaisse Carte Bancaire + Apple Pay + 3D Secure directement sur ton IBAN.
   2. PAYPAL_ME_LINK      : Colle ici ton lien PayPal.me (ex: "https://paypal.me/tonpseudo")
      -> Redirige directement vers PayPal avec le montant exact de la commande.
   ============================================================================ */
const STRIPE_PAYMENT_LINK: string = "https://buy.stripe.com/cNi6oG44y2Zw32B167co000";
const PAYPAL_ME_LINK: string = "";

const COUNTRY_CODES = [
  { code: "+33", label: "FR (+33)", country: "France" },
  { code: "+1", label: "US/CA (+1)", country: "United States" },
  { code: "+44", label: "UK (+44)", country: "United Kingdom" },
  { code: "+32", label: "BE (+32)", country: "Belgium" },
  { code: "+41", label: "CH (+41)", country: "Switzerland" },
  { code: "+352", label: "LU (+352)", country: "Luxembourg" },
  { code: "+39", label: "IT (+39)", country: "Italy" },
  { code: "+34", label: "ES (+34)", country: "Spain" },
  { code: "+49", label: "DE (+49)", country: "Germany" },
  { code: "+31", label: "NL (+31)", country: "Netherlands" },
  { code: "+351", label: "PT (+351)", country: "Portugal" },
  { code: "+81", label: "JP (+81)", country: "Japan" },
  { code: "+82", label: "KR (+82)", country: "South Korea" },
  { code: "+971", label: "AE (+971)", country: "United Arab Emirates" },
  { code: "+212", label: "MA (+212)", country: "Morocco" },
  { code: "+213", label: "DZ (+213)", country: "Algeria" },
  { code: "+216", label: "TN (+216)", country: "Tunisia" },
  { code: "+221", label: "SN (+221)", country: "Senegal" },
  { code: "+225", label: "CI (+225)", country: "Côte d'Ivoire" },
];

interface AddressSuggestion {
  id: string;
  label: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

/* ============================================================================
   FONCTIONS DE VALIDATION STRICTES (EMPÊCHE LES FAUSSES INFOS / FAUSSES CARTES)
   ============================================================================ */
function isValidHumanName(val: string): boolean {
  const clean = val.trim();
  if (clean.length < 2) return false;
  if (/\d/.test(clean)) return false;
  if (/(.)\1{3,}/i.test(clean)) return false;
  return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(clean);
}

function isValidEmailAddress(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

function isValidPhoneDigits(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 && !/^(\d)\1+$/.test(digits);
}

/* Algorithme officiel de Luhn utilisé par Visa / Mastercard / Amex */
function isValidCardLuhn(cardNum: string): boolean {
  const digits = cardNum.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function isValidExpiry(exp: string): boolean {
  const match = exp.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear || year > currentYear + 15) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "applepay" | "paypal">("card");
  const [formError, setFormError] = useState<string>("");

  /* Étape 1 : Livraison & Indicatif Téléphonique */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+33");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");

  /* Autocomplétion d'adresse en direct */
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* Étape 2 : Détails Carte */
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  /* Étape 3 : Bordereau d'expédition & Reçu officiel */
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
            setPhonePrefix(o.phonePrefix || "+33");
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

  /* Recherche automatique d'adresses réelles (France & International) pendant la frappe */
  const handleStreetInput = (value: string) => {
    setStreetAddress(value);
    setFormError("");

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length < 4) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results: AddressSuggestion[] = [];

        /* 1. API Nationale Française (ultra-rapide et précise pour toutes les rues de France) */
        const frRes = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=4`
        );
        if (frRes.ok) {
          const frData = await frRes.json();
          if (Array.isArray(frData.features)) {
            for (const f of frData.features) {
              const props = f.properties || {};
              if (props.name && props.postcode && props.city) {
                results.push({
                  id: `fr-${props.id || Math.random()}`,
                  label: `${props.name}, ${props.postcode} ${props.city}, France`,
                  street: props.name,
                  postalCode: props.postcode,
                  city: props.city,
                  country: "France",
                });
              }
            }
          }
        }

        /* 2. API Internationale Photon (OpenStreetMap) pour l'étranger */
        if (results.length < 3) {
          const intlRes = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=4`
          );
          if (intlRes.ok) {
            const intlData = await intlRes.json();
            if (Array.isArray(intlData.features)) {
              for (const f of intlData.features) {
                const p = f.properties || {};
                const streetLine = [p.housenumber, p.street || p.name].filter(Boolean).join(" ");
                const cityVal = p.city || p.town || p.village || "";
                const postVal = p.postcode || "";
                const countryVal = p.country || "";
                if (streetLine && cityVal && countryVal && countryVal !== "France") {
                  results.push({
                    id: `intl-${p.osm_id || Math.random()}`,
                    label: `${streetLine}, ${postVal} ${cityVal}, ${countryVal}`,
                    street: streetLine,
                    postalCode: postVal,
                    city: cityVal,
                    country: countryVal,
                  });
                }
              }
            }
          }
        }

        setAddressSuggestions(results.slice(0, 5));
        setShowSuggestions(results.length > 0);
      } catch {}
    }, 300);
  };

  const selectAddressSuggestion = (s: AddressSuggestion) => {
    setStreetAddress(s.street);
    setPostalCode(s.postalCode);
    setCity(s.city);
    setCountry(s.country);
    setShowSuggestions(false);
    setAddressSuggestions([]);
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

  /* Validation rigoureuse de l'Étape 1 avant de passer au paiement */
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!isValidHumanName(firstName) || !isValidHumanName(lastName)) {
      setFormError("Please enter a valid First Name and Last Name (letters only).");
      return;
    }
    if (!isValidEmailAddress(customerEmail)) {
      setFormError("Please enter a valid email address (example@domain.com).");
      return;
    }
    if (!isValidPhoneDigits(phone)) {
      setFormError("Please enter a valid phone number (digits only).");
      return;
    }
    if (streetAddress.trim().length < 5 || !/\d/.test(streetAddress)) {
      setFormError("Please enter a complete street address including street number.");
      return;
    }
    if (postalCode.trim().length < 3 || city.trim().length < 2 || country.trim().length < 2) {
      setFormError("Please complete your Postal Code, City and Country.");
      return;
    }

    setCheckoutStep(2);
  };

  /* Formatage automatique du numéro de carte (0000 0000 0000 0000) */
  const handleCardNumberChange = (val: string) => {
    setFormError("");
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  /* Formatage automatique de la date d'expiration (MM/YY) */
  const handleCardExpiryChange = (val: string) => {
    setFormError("");
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setCardExpiry(digits);
    }
  };

  /* Validation rigoureuse de l'Étape 2 + Encaissement + Génération du bordereau */
  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (items.length === 0) return;

    if (paymentMethod === "card") {
      if (!isValidHumanName(cardName)) {
        setFormError("Please enter the full Cardholder Name as printed on your card.");
        return;
      }
      if (!isValidCardLuhn(cardNumber)) {
        setFormError("Invalid Card Number. Please verify the 16 digits of your card.");
        return;
      }
      if (!isValidExpiry(cardExpiry)) {
        setFormError("Invalid or expired card date. Use MM/YY format.");
        return;
      }
      const cleanCvc = cardCvc.replace(/\D/g, "");
      if (cleanCvc.length < 3 || cleanCvc.length > 4) {
        setFormError("Invalid Security Code (CVC must be 3 or 4 digits).");
        return;
      }
    }

    setSubmitting(true);

    const generatedRef = `HLM-${Math.floor(100000 + Math.random() * 900000)}`;
    const todayStr = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const fullPhone = `${phonePrefix} ${phone.trim()}`;
    const orderSummary = items
      .map((i) => `${i.name} (Size ${i.size}) x${i.quantity} — ${i.price * i.quantity} €`)
      .join("\n");

    const formattedAddress = `${firstName} ${lastName}\n${streetAddress}\n${postalCode} ${city}\n${country}\nTel: ${fullPhone}`;

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
        phonePrefix,
        phone,
        items,
        total: subtotal,
        method: paymentMethod,
      })
    );

    /* Envoi du bordereau complet sur helmetcothes@gmail.com */
    try {
      await fetch("https://formsubmit.co/ajax/helmetcothes@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `[COMMANDE ${generatedRef} — HELMET HAUTE COUTURE] ${subtotal} € (${paymentMethod.toUpperCase()})`,
          Numero_Commande: generatedRef,
          Date: todayStr,
          Client: `${firstName} ${lastName}`,
          Email_Client: customerEmail,
          Telephone: fullPhone,
          Moyen_Paiement: paymentMethod.toUpperCase(),
          Adresse_Livraison: formattedAddress,
          Articles: orderSummary,
          Total_Paye: `${subtotal} €`,
        }),
      });
    } catch {}

    /* Redirection vers PayPal si PAYPAL_ME_LINK est renseigné */
    if (paymentMethod === "paypal" && PAYPAL_ME_LINK.trim().startsWith("http")) {
      const cleanPaypal = PAYPAL_ME_LINK.trim().replace(/\/$/, "");
      window.location.href = `${cleanPaypal}/${subtotal}EUR`;
      return;
    }

    /* Redirection vers Stripe (Carte Bancaire / Apple Pay) si STRIPE_PAYMENT_LINK est renseigné */
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
              maxWidth: "680px",
              margin: "20px auto",
              border: "1px solid rgba(255,255,255,0.34)",
              backgroundColor: "#080808",
              padding: "36px 26px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div style={{ textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "22px" }}>
              <p
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.72)",
                  margin: "0 0 8px 0",
                }}
              >
                Helmet Haute Couture — Paris Atelier
              </p>
              <h1
                className="font-cancellaresca"
                style={{ fontSize: "clamp(36px, 5vw, 52px)", margin: "0 0 12px 0", color: "#ffffff" }}
              >
                Thanks For Your Purchase
              </h1>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
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
                You will receive your shipping and tracking notification soon. If you have any question or issue
                with your order, contact our{" "}
                <Link
                  href="/service"
                  style={{ textDecoration: "underline", color: "#ffffff" }}
                >
                  Client Service
                </Link>{" "}
                with your reference <strong>{orderReference}</strong>.
              </p>
            </div>

            {/* Étiquette / Bordereau de Livraison & Résumé */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.2)",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                padding: "22px 0",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: "24px",
              }}
            >
              <div
                style={{
                  border: "1px dashed rgba(255,255,255,0.3)",
                  padding: "16px",
                }}
              >
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
                  Shipping Label — Destination
                </span>
                <p className="helmet-readable-text" style={{ margin: 0, textTransform: "uppercase" }}>
                  <strong>{firstName} {lastName}</strong>
                  <br />
                  {streetAddress}
                  <br />
                  {postalCode} {city}
                  <br />
                  {country}
                  <br />
                  Tel : {phonePrefix} {phone}
                </p>
              </div>

              <div style={{ padding: "16px 4px" }}>
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
                <p
                  style={{
                    margin: "12px 0 0 0",
                    fontSize: "11px",
                    letterSpacing: "0.24em",
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                  }}
                >
                  Sender : Helmet Haute Couture — Paris, France
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
                Print Receipt / Shipping Slip
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

              {formError && (
                <div
                  style={{
                    border: "1px solid #ffffff",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    padding: "12px 14px",
                    marginBottom: "18px",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    color: "#ffffff",
                  }}
                >
                  ! {formError}
                </div>
              )}

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
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setFormError("");
                        }}
                        placeholder="FIRST NAME"
                        className="helmet-input"
                      />
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          setFormError("");
                        }}
                        placeholder="LAST NAME"
                        className="helmet-input"
                      />
                    </div>

                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        setFormError("");
                      }}
                      placeholder="EMAIL ADDRESS (EX: CLIENT@DOMAIN.COM)"
                      className="helmet-input"
                    />

                    {/* INDICATIF INTERNATIONAL (+33, +1, +44...) + NUMÉRO DE TÉLÉPHONE */}
                    <div style={{ display: "grid", gridTemplateColumns: "124px 1fr", gap: "10px" }}>
                      <select
                        value={phonePrefix}
                        onChange={(e) => {
                          const selected = COUNTRY_CODES.find((c) => c.code === e.target.value);
                          setPhonePrefix(e.target.value);
                          if (selected) setCountry(selected.country);
                        }}
                        className="helmet-input"
                        style={{ padding: "14px 8px" }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/[^\d\s]/g, "");
                          setPhone(digitsOnly);
                          setFormError("");
                        }}
                        placeholder="PHONE NUMBER (DIGITS ONLY)"
                        className="helmet-input"
                      />
                    </div>

                    {/* RUE AVEC SUGGESTIONS D'ADRESSES RÉELLES EN DIRECT */}
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        value={streetAddress}
                        onChange={(e) => handleStreetInput(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 220)}
                        placeholder="STREET ADDRESS (EX: 18 RUE DES CHEMINOTS)"
                        className="helmet-input"
                      />

                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            zIndex: 50,
                            backgroundColor: "#111111",
                            border: "1px solid #ffffff",
                            borderTop: "none",
                            maxHeight: "210px",
                            overflowY: "auto",
                          }}
                        >
                          {addressSuggestions.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onMouseDown={() => selectAddressSuggestion(s)}
                              style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "12px 14px",
                                backgroundColor: "transparent",
                                color: "#ffffff",
                                border: "none",
                                borderBottom: "1px solid rgba(255,255,255,0.14)",
                                fontSize: "13px",
                                cursor: "pointer",
                              }}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => {
                          setPostalCode(e.target.value);
                          setFormError("");
                        }}
                        placeholder="POSTAL / ZIP CODE"
                        className="helmet-input"
                      />
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          setFormError("");
                        }}
                        placeholder="CITY"
                        className="helmet-input"
                      />
                    </div>

                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setFormError("");
                      }}
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
                        onClick={() => {
                          setCheckoutStep(1);
                          setFormError("");
                        }}
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
                        fontSize: "13.5px",
                        letterSpacing: "0.04em",
                        color: "rgba(255,255,255,0.9)",
                        lineHeight: 1.6,
                      }}
                    >
                      {firstName} {lastName} — {streetAddress}, {postalCode} {city}, {country} ({phonePrefix} {phone})
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
                            onClick={() => {
                              setPaymentMethod(m.id as any);
                              setFormError("");
                            }}
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
                          onChange={(e) => {
                            setCardName(e.target.value);
                            setFormError("");
                          }}
                          placeholder="NAME ON CARD"
                          className="helmet-input"
                        />
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="CARD NUMBER (0000 0000 0000 0000)"
                          className="helmet-input"
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <input
                            type="text"
                            required
                            inputMode="numeric"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => handleCardExpiryChange(e.target.value)}
                            placeholder="EXPIRY (MM/YY)"
                            className="helmet-input"
                          />
                          <input
                            type="text"
                            required
                            inputMode="numeric"
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => {
                              setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4));
                              setFormError("");
                            }}
                            placeholder="CVC (123)"
                            className="helmet-input"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "applepay" && (
                      <p className="helmet-readable-text" style={{ margin: 0, textAlign: "center", padding: "8px 0" }}>
                        You will be redirected to Apple Pay / Express Checkout to authenticate with Face ID or Touch ID.
                      </p>
                    )}

                    {paymentMethod === "paypal" && (
                      <p className="helmet-readable-text" style={{ margin: 0, textAlign: "center", padding: "8px 0" }}>
                        You will be redirected to PayPal to finalize your {subtotal} € payment securely.
                      </p>
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
                      {submitting
                        ? "Verifying & Redirecting..."
                        : paymentMethod === "paypal"
                        ? `Continue With PayPal — ${subtotal} €`
                        : paymentMethod === "applepay"
                        ? `Pay With Apple Pay — ${subtotal} €`
                        : `Confirm & Pay — ${subtotal} €`}
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