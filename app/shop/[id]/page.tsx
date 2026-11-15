"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState("2");
  const [cartCount, setCartCount] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const product = {
    id: "article--01",
    name: "Article -01 — Helmet",
    price: 180,
    image: "/product1.jpg",
  };

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

  const handleAddToCart = () => {
    const raw = localStorage.getItem("cart") || localStorage.getItem("helmet_cart");
    let currentCart = [];
    if (raw) {
      try {
        currentCart = JSON.parse(raw);
        if (!Array.isArray(currentCart)) currentCart = [];
      } catch {
        currentCart = [];
      }
    }

    const existingIndex = currentCart.findIndex(
      (item: any) => item.id === product.id && item.size === selectedSize
    );

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity = (Number(currentCart[existingIndex].quantity) || 1) + 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        quantity: 1,
        image: product.image,
      });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    localStorage.setItem("helmet_cart", JSON.stringify(currentCart));
    setCartCount(currentCart.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0));
    window.location.href = "/cart";
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

      <div className="helmet-product-grid">
        <div
          style={{
            aspectRatio: "3 / 4",
            width: "100%",
            backgroundColor: "#f5f5f5",
            border: "1px solid #e5e5e5",
            overflow: "hidden",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes("article1.jpg")) {
                target.src = "/article1.jpg";
              }
            }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div>
            <h1 className="font-cancellaresca" style={{ fontSize: "clamp(34px, 4vw, 48px)", margin: "0 0 8px 0" }}>
              Article -01 — Helmet
            </h1>
            <p style={{ fontSize: "14px", letterSpacing: "0.18em", color: "#525252", margin: 0 }}>
              ${product.price}
            </p>
          </div>

          <div>
            <p style={{ fontSize: "12px", color: "#737373", marginBottom: "12px" }}>Size</p>
            <div style={{ display: "flex", gap: "12px" }}>
              {["1", "2", "3"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: "56px",
                    height: "40px",
                    fontSize: "12px",
                    cursor: "pointer",
                    border: selectedSize === size ? "1px solid #000000" : "1px solid #d4d4d4",
                    backgroundColor: selectedSize === size ? "#000000" : "#ffffff",
                    color: selectedSize === size ? "#ffffff" : "#000000",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button type="button" onClick={handleAddToCart} className="helmet-btn-black">
            Add To Cart
          </button>

          <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: "8px" }}>
            <div style={{ padding: "16px 0", borderBottom: "1px solid #e5e5e5" }}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "details" ? null : "details")}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  color: "#404040",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <span>Product Details</span>
                <span>{openSection === "details" ? "−" : "+"}</span>
              </button>
              {openSection === "details" && (
                <p style={{ fontSize: "12px", color: "#737373", marginTop: "12px", lineHeight: 1.6 }}>
                  Paris Atelier — Edition -01. Heavyweight luxury silhouette crafted with custom Helmet Haute Couture detailing.
                </p>
              )}
            </div>

            <div style={{ padding: "16px 0", borderBottom: "1px solid #e5e5e5" }}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  color: "#404040",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <span>Shipping & Policy</span>
                <span>{openSection === "shipping" ? "−" : "+"}</span>
              </button>
              {openSection === "shipping" && (
                <p style={{ fontSize: "12px", color: "#737373", marginTop: "12px", lineHeight: 1.6 }}>
                  Tracked worldwide delivery. All sales are final — no returns or exchanges.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}