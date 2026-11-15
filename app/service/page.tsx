"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

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
    formData.append("_subject", "Nouveau message Client Service — HELMET -01");
    formData.append("_captcha", "false");
    formData.append("_template", "table");

    try {
      const response = await fetch("https://formsubmit.co/ajax/helmetcothes@gmail.com", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
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
          `[HELMET -01] ${topic}` )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${msg}`)}`;
        setStatus("success");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-20 pt-5 md:pt-6 pb-20 font-sans">
      {/* HEADER 3 COLONNES IDENTIQUE PC & IPHONE */}
      <header className="grid grid-cols-3 items-center border-b border-neutral-200 pb-4 md:pb-6 mb-10 md:mb-16">
        <div className="justify-self-start">
          <Link
            href="/"
            className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:opacity-60 transition whitespace-nowrap"
          >
            ← Back To Home
          </Link>
        </div>

        <div className="justify-self-center text-center">
          <Link
            href="/"
            className="font-helmet text-3xl sm:text-4xl md:text-5xl tracking-normal font-normal select-none leading-none block"
          >
            Helmet
          </Link>
        </div>

        <div className="justify-self-end">
          <Link
            href="/cart"
            className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] flex items-center gap-1.5 hover:opacity-60 transition whitespace-nowrap"
          >
            <span>🛍</span>
            <span>[{cartCount}]</span>
          </Link>
        </div>
      </header>

      {/* CONTENU CLIENT SERVICE */}
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 md:mb-12 text-left">
          <h1 className="font-helmet text-3xl sm:text-4xl md:text-5xl font-normal mb-3">
            Client Service — Edition -01
          </h1>
          <p className="text-[10px] md:text-[11px] text-neutral-500 uppercase tracking-[0.18em] md:tracking-[0.2em] leading-relaxed">
            Paris Atelier — Edition -01. For any inquiries regarding your order, sizing, or garment specifications. All sales are final.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-neutral-500">
                Full Name *
              </label>
              <input
                type="text"
                name="Client_Name"
                required
                placeholder="Full Name"
                className="w-full bg-white border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-neutral-500">
                Email Address *
              </label>
              <input
                type="email"
                name="Client_Email"
                required
                placeholder="Email Address"
                className="w-full bg-white border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-neutral-500">
                Order Reference (Optional)
              </label>
              <input
                type="text"
                name="Order_Reference"
                placeholder="Order #-01"
                className="w-full bg-white border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-neutral-500">
                Topic *
              </label>
              <select
                name="Subject"
                required
                className="w-full bg-white border border-neutral-300 p-3.5 text-xs uppercase tracking-wider focus:border-black outline-none transition"
              >
                <option value="Order Status & Shipping">Order Status & Shipping</option>
                <option value="Sizing & Garment Specifications">Sizing & Garment Specifications</option>
                <option value="Payment & Billing">Payment & Billing</option>
                <option value="Press & Archive">Press & Archive</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-neutral-500">
              Message *
            </label>
            <textarea
              name="Message"
              rows={6}
              required
              placeholder="Write your message..."
              className="w-full bg-white border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Submit Inquiry"}
          </button>

          {status === "success" && (
            <div className="p-4 border border-black bg-neutral-50 text-[11px] uppercase tracking-[0.2em] text-center">
              Thank you. Your inquiry has been sent to Helmet Client Service.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}