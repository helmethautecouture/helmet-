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

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

function CartContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay" | "paypal">("card");

  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  const parsePrice = (p: number | string): number => {
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

  const handleRealCheckout = async (e: React.FormEvent) => {
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
  };

  return (
    <div className="helmet-page-container">
      <header className="helmet-page-header">
        <div style={{ justifySelf: "start" }}>
          <Link
            href="/shop"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              whiteSpace: "nowrap",
            }}
          >
            ← Back To Shop
          </Link>
        </div>

        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <Link
            href="/"
            className="font-cancellaresca"
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              lineHeight: 1,
              display: "block",
            }}
          >
            Helmet
          </Link>
        </div>

        <div style={{ justifySelf: "end" }}>
          <span
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
            <span style={{ fontWeight: 600 }}>[{totalCount}]</span>
          </span>
        </div>
      </header>

      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
        {isSuccess ? (
          <div
            style={{
              maxWidth: "520px",
              margin: "48px auto",
              border: "1px solid #000000",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3em", color: "#a3a3a3" }}>
              Paris Atelier — Edition -01
            </p>
            <h1 className="font-cancellaresca" style={{ fontSize: "36px", margin: "16px 0" }}>
              Order Confirmed
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "#525252",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                lineHeight: 1.7,
                marginBottom: "28px",
              }}
            >
              Thank you for your acquisition. Your payment has been verified and a confirmation receipt has been sent to your email.
            </p>
            <Link href="/shop" className="helmet-btn-black">
              Return to Shop
            </Link>
          </div>
        ) : (
          <>
            {isCanceled && (
              <div
                style={{
                  marginBottom: "32px",
                  padding: "16px",
                  border: "1px solid #dc2626",
                  color: "#dc2626",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  textAlign: "center",
                }}
              >
                Payment was canceled. Your order has not been charged.
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  marginBottom: "32px",
                  padding: "16px",
                  border: "1px solid #dc2626",
                  color: "#dc2626",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  textAlign: "center",
                }}
              >
                {errorMsg}
              </div>
            )}

            {cart.length === 0 ? (
              <div style={{ padding: "88px 20px", textAlign: "center", border: "1px solid #e5e5e5" }}>
                <p
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.25em",
                    color: "#a3a3a3",
                    marginBottom: "32px",
                  }}
                >
                  Your shopping bag is currently empty.
                </p>
                <Link
                  href="/shop"
                  className="helmet-btn-black"
                  style={{ width: "auto", padding: "16px 40px", display: "inline-block" }}
                >
                  Explore Edition -01
                </Link>
              </div>
            ) : (
              <form onSubmit={handleRealCheckout} className="helmet-cart-grid">
                <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
                  <div>
                    <h2
                      className="font-cancellaresca"
                      style={{
                        fontSize: "28px",
                        marginBottom: "16px",
                        borderBottom: "1px solid #e5e5e5",
                        paddingBottom: "12px",
                      }}
                    >
                      Selected Pieces
                    </h2>
                    <div>
                      {cart.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "20px 0",
                            borderBottom: "1px solid #e5e5e5",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <img
                              src={item.image || "/product1.jpg"}
                              alt="HELMET"
                              style={{
                                width: "64px",
                                height: "84px",
                                objectFit: "cover",
                                border: "1px solid #e5e5e5",
                                flexShrink: 0,
                              }}
                            />
                            <div>
                              <h3 className="font-cancellaresca" style={{ fontSize: "24px", margin: "0 0 4px 0" }}>
                                Article -01 — Helmet
                              </h3>
                              <p
                                style={{
                                  fontSize: "11px",
                                  color: "#737373",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.15em",
                                  margin: "0 0 6px 0",
                                }}
                              >
                                Size: {item.size || "2"}
                              </p>
                              <button
                                type="button"
                                onClick={() => removeItem(idx)}
                                style={{
                                  fontSize: "10px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.15em",
                                  color: "#a3a3a3",
                                  textDecoration: "underline",
                                  background: "transparent",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", border: "1px solid #d4d4d4" }}>
                              <button
                                type="button"
                                onClick={() => updateQuantity(idx, -1)}
                                style={{
                                  padding: "6px 10px",
                                  fontSize: "12px",
                                  background: "#ffffff",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                -
                              </button>
                              <span style={{ padding: "6px 10px", fontSize: "12px" }}>{item.quantity || 1}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(idx, 1)}
                                style={{
                                  padding: "6px 10px",
                                  fontSize: "12px",
                                  background: "#ffffff",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                +
                              </button>
                            </div>
                            <p
                              style={{
                                fontSize: "12px",
                                letterSpacing: "0.15em",
                                fontWeight: 600,
                                minWidth: "60px",
                                textAlign: "right",
                                margin: 0,
                              }}
                            >
                              ${parsePrice(item.price) * (Number(item.quantity) || 1)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2
                      className="font-cancellaresca"
                      style={{
                        fontSize: "28px",
                        marginBottom: "16px",
                        borderBottom: "1px solid #e5e5e5",
                        paddingBottom: "12px",
                      }}
                    >
                      Shipping Information
                    </h2>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "14px",
                      }}
                    >
                      <input
                        type="text"
                        required
                        placeholder="FIRST NAME *"
                        value={customer.firstName}
                        onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                        className="helmet-input"
                      />
                      <input
                        type="text"
                        required
                        placeholder="LAST NAME *"
                        value={customer.lastName}
                        onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                        className="helmet-input"
                      />
                      <input
                        type="email"
                        required
                        placeholder="EMAIL ADDRESS *"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="helmet-input"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="PHONE NUMBER *"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="helmet-input"
                      />
                      <input
                        type="text"
                        required
                        placeholder="STREET ADDRESS *"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        className="helmet-input"
                        style={{ gridColumn: "1 / -1" }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="POSTAL CODE *"
                        value={customer.postalCode}
                        onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                        className="helmet-input"
                      />
                      <input
                        type="text"
                        required
                        placeholder="CITY *"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        className="helmet-input"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ border: "1px solid #e5e5e5", padding: "28px" }}>
                  <h2
                    className="font-cancellaresca"
                    style={{
                      fontSize: "28px",
                      borderBottom: "1px solid #e5e5e5",
                      paddingBottom: "12px",
                      marginBottom: "24px",
                    }}
                  >
                    Payment Method
                  </h2>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      style={{
                        padding: "12px 8px",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        cursor: "pointer",
                        border: paymentMethod === "card" ? "1px solid #000000" : "1px solid #d4d4d4",
                        backgroundColor: paymentMethod === "card" ? "#000000" : "#ffffff",
                        color: paymentMethod === "card" ? "#ffffff" : "#525252",
                      }}
                    >
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("apple_pay")}
                      style={{
                        padding: "12px 8px",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        cursor: "pointer",
                        border: paymentMethod === "apple_pay" ? "1px solid #000000" : "1px solid #d4d4d4",
                        backgroundColor: paymentMethod === "apple_pay" ? "#000000" : "#ffffff",
                        color: paymentMethod === "apple_pay" ? "#ffffff" : "#525252",
                      }}
                    >
                      Apple Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      style={{
                        padding: "12px 8px",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        cursor: "pointer",
                        border: paymentMethod === "paypal" ? "1px solid #000000" : "1px solid #d4d4d4",
                        backgroundColor: paymentMethod === "paypal" ? "#000000" : "#ffffff",
                        color: paymentMethod === "paypal" ? "#ffffff" : "#525252",
                      }}
                    >
                      PayPal
                    </button>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #e5e5e5",
                      paddingTop: "16px",
                      marginBottom: "24px",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#737373", marginBottom: "12px" }}>
                      <span>Subtotal</span>
                      <span>${subtotal}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#737373", marginBottom: "16px" }}>
                      <span>Shipping</span>
                      <span>Complimentary</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        fontWeight: 600,
                        paddingTop: "16px",
                        borderTop: "1px solid #e5e5e5",
                      }}
                    >
                      <span>Total</span>
                      <span>${subtotal}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="helmet-btn-black">
                    {loading ? "Redirecting..." : `Checkout — $${subtotal}`}
                  </button>
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
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }} />}>
      <CartContent />
    </Suspense>
  );
}