"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import LouisXVIFrame from "../../LouisXVIFrame";

const PRODUCT = {
  id: "-01",
  name: "Overlayer Jogger -01 — Helmet",
  price: 150,
  currency: "€",
  images: ["/product1.jpg", "/product2.jpg"],
  sizes: ["1", "2", "3"],
  specs: [
    "100% Cotton — Premium fabric woven in Italy",
    "Handcrafted in France — Made manually in-house at our atelier",
    "Unique Piece — Multi-layered architectural construction (Edition -01)",
    "Sizing: Size 1 (S/M) — Size 2 (M/L) — Size 3 (L/XL)",
  ],
};

export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState<string>("1");
  const [activeImage, setActiveImage] = useState<string>(PRODUCT.images[0]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [addedMessage, setAddedMessage] = useState<boolean>(false);

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

  const handleAddToCart = () => {
    try {
      const raw = localStorage.getItem("helmet_cart") || localStorage.getItem("cart") || "[]";
      const currentCart = JSON.parse(raw);
      const cartArray = Array.isArray(currentCart) ? currentCart : [];

      const existingIndex = cartArray.findIndex(
        (item: any) => item.id === PRODUCT.id && item.size === selectedSize
      );

      if (existingIndex > -1) {
        cartArray[existingIndex].quantity = (Number(cartArray[existingIndex].quantity) || 1) + 1;
        cartArray[existingIndex].price = PRODUCT.price;
        cartArray[existingIndex].name = PRODUCT.name;
      } else {
        cartArray.push({
          id: PRODUCT.id,
          name: PRODUCT.name,
          price: PRODUCT.price,
          size: selectedSize,
          quantity: 1,
          image: PRODUCT.images[0],
        });
      }

      const serialized = JSON.stringify(cartArray);
      localStorage.setItem("helmet_cart", serialized);
      localStorage.setItem("cart", serialized);

      const newTotal = cartArray.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0);
      setCartCount(newTotal);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 2200);
    } catch {}
  };

  return (
    <div className="helmet-page-container">
      <header className="helmet-page-header">
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
            ← Back To Shop
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
                }}
              >
                Helmet Shop
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
            <span>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      <div className="helmet-product-grid">
        {/* COLONNE GAUCHE : VISUELS PRODUIT */}
        <div>
          <div
            className="helmet-image-frame"
            style={{
              aspectRatio: "3 / 4",
              width: "100%",
              marginBottom: "14px",
            }}
          >
            <img
              src={activeImage}
              alt={PRODUCT.name}
              className="helmet-zoom-img"
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {PRODUCT.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                style={{
                  width: "76px",
                  aspectRatio: "3 / 4",
                  padding: 0,
                  border: activeImage === img ? "1.5px solid #000000" : "1px solid #e5e5e5",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <img
                  src={img}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE : INFOS, TAILLES 1/2/3 & AJOUT PANIER */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: "22px" }}>
            <p
              style={{
                fontSize: "10.5px",
                textTransform: "uppercase",
                letterSpacing: "0.32em",
                color: "#737373",
                margin: "0 0 10px 0",
              }}
            >
              Paris Atelier — Edition -01 / Unique Piece
            </p>
            <h1
              className="font-cancellaresca"
              style={{
                fontSize: "clamp(34px, 4.5vw, 48px)",
                margin: "0 0 12px 0",
                lineHeight: 1.08,
              }}
            >
              {PRODUCT.name}
            </h1>
            <p
              style={{
                fontSize: "16px",
                letterSpacing: "0.2em",
                color: "#000000",
                margin: 0,
              }}
            >
              {PRODUCT.price} {PRODUCT.currency}
            </p>
          </div>

          {/* SÉLECTEUR DE TAILLE : SIZE 1 / 2 / 3 */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.26em",
              }}
            >
              <span>Select Size</span>
              <span style={{ color: "#525252" }}>Size {selectedSize}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {PRODUCT.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: "14px 0",
                      fontSize: "12px",
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#000000" : "#ffffff",
                      color: isSelected ? "#ffffff" : "#000000",
                      border: "1px solid #000000",
                      transition: "all 0.25s ease",
                    }}
                  >
                    Size {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOUTON AJOUTER AU PANIER */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              type="button"
              onClick={handleAddToCart}
              className="helmet-btn-black"
            >
              {addedMessage ? "Added To Cart — View Bag" : `Add To Cart — ${PRODUCT.price} €`}
            </button>

            {addedMessage && (
              <Link
                href="/cart"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  padding: "12px",
                  border: "1px solid #000000",
                  display: "block",
                }}
              >
                Proceed To Checkout →
              </Link>
            )}
          </div>

          {/* FICHE TECHNIQUE & SAVOIR-FAIRE */}
          <div
            style={{
              borderTop: "1px solid #e5e5e5",
              paddingTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: "0 0 4px 0",
              }}
            >
              Atelier Specifications
            </h2>
            {PRODUCT.specs.map((spec, i) => (
              <p
                key={i}
                style={{
                  fontSize: "13px",
                  lineHeight: 1.7,
                  letterSpacing: "0.06em",
                  color: "#262626",
                  margin: 0,
                }}
              >
                — {spec}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}