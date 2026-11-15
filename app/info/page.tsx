"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function InfoFaqPage() {
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

  const sections = [
    {
      title: "SHIPPING POLICY",
      paragraphs: [
        "Please allow 2-3 weeks for your order to be prepared and shipped from our atelier.",
        "We are happy to update you through the process or answer any questions about your order by emailing helmetcothes@gmail.com or via our Client Service.",
        "Helmet Haute Couture is an independent house run out of Paris, France. We have no corporate cosign or external funding. We work with specialized ateliers, every piece is hand-inspected and hand-packed in Paris, and we direct all visual archive content in-house. Thank you for supporting independent design.",
      ],
    },
    {
      title: "EXCHANGE / STORE CREDIT POLICY",
      paragraphs: [
        "Each product page indicates whether an piece is eligible for an exchange or store credit. All limited edition, screen-printed, and custom embroidered pieces from Edition -01 are final sale.",
        "To initiate an eligible exchange or store credit request, please reach out to our Client Service Concierge within 7 days of receiving your order.",
        "If your piece arrived damaged, faulty, or you received the wrong item, please contact our Client Service immediately and indicate that your request is due to a fulfillment error. Our Paris team will assist you directly from there.",
      ],
    },
    {
      title: "ATELIER TRANSIT PROTECTION",
      paragraphs: [
        "Priority tracked shipping and transit protection are available at checkout to cover both your package while in transit and priority assistance:",
        "• Priority Handling & Return Coverage: If an exchange is approved by our atelier, your return shipping label is covered.",
        "• Package Protection: If your package is lost, stolen, or damaged in transit, you can submit a claim through our Client Service and, upon verification, receive a same-piece replacement (subject to archive availability) or full store credit.",
        "If standard unprotected shipping is selected, the customer remains responsible for return shipping costs and carrier transit claims.",
      ],
    },
    {
      title: "INTERNATIONAL RETURNS",
      paragraphs: [
        "International clients outside the European Union may initiate a return request through our Client Service portal within 7 days of receiving their order. Once approved, you will be asked to arrange and purchase your return shipping label with tracking to send the piece back to our Paris Atelier. Approved returns do not include original taxes, customs duties, or initial shipping costs.",
      ],
    },
    {
      title: "INTERNATIONAL SHIPPING POLICY",
      paragraphs: [
        "Orders shipped within France and the European Union include applicable VAT. For international shipments outside the EU, we do not cover import taxes and customs duties. Our international carrier will contact you directly regarding any applicable local fees. Please make sure to provide a valid email address and telephone number at checkout.",
      ],
    },
    {
      title: "EU CUSTOMER RIGHT TO WITHDRAW",
      paragraphs: [
        "European Union customers have the legal right to withdraw from a standard purchase within 14 days of receiving their order, subject to applicable EU consumer protection laws (excluding custom-made or unsealed archive pieces).",
        "In the event you exercise your right to withdraw, return shipping costs to our Paris Atelier are your responsibility and will not be reimbursed. The garment must be unworn, unwashed, and in its original packaging with all tags attached.",
        "If your withdrawal request is approved, you will receive a refund in accordance with applicable EU consumer protection laws using the original payment method. For any questions regarding your right to withdraw, please contact us at helmetcothes@gmail.com.",
      ],
    },
    {
      title: "GARMENT CARE",
      paragraphs: [
        "We always recommend hand washing all Helmet Haute Couture pieces in cold water (inside out) or professional dry cleaning to extend the life of the garment.",
        "Please make sure to hang dry all products away from direct heat to maintain the integrity of the textile and fine-line ink prints. Machine drying will distress the print and fibers over time.",
        "Our deep black garments use a heavy pigment dye designed to develop a subtle, natural patina over time. We advise washing these pieces alone or with like dark colors during the first few cycles and hanging them to dry.",
      ],
    },
  ];

  return (
    <div className="helmet-page-container">
      <header className="helmet-page-header">
        <div style={{ justifySelf: "start" }}>
          <Link
            href="/"
            className="helmet-zoom-link"
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
          <Link
            href="/"
            className="font-cancellaresca helmet-zoom-link"
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
            className="helmet-zoom-link"
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
            <span>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <p
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.35em",
              color: "#737373",
              marginBottom: "10px",
            }}
          >
            Paris — Atelier / Edition -01
          </p>
          <h1
            className="font-cancellaresca"
            style={{ fontSize: "clamp(38px, 5vw, 56px)", margin: 0, fontWeight: 400 }}
          >
            Information & FAQ
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {sections.map((sec, idx) => (
            <section
              key={idx}
              style={{
                borderBottom: "1px solid #e5e5e5",
                paddingBottom: "32px",
              }}
            >
              <h2
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#000000",
                  marginBottom: "16px",
                }}
              >
                {sec.title}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {sec.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.75,
                      letterSpacing: "0.06em",
                      color: "#404040",
                      margin: 0,
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <Link href="/service" className="helmet-btn-black" style={{ maxWidth: "320px" }}>
            Contact Client Service
          </Link>
        </div>
      </div>
    </div>
  );
}