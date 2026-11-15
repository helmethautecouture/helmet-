"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function ClientServicePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formsubmit.co/ajax/helmetcothes@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
          _subject: `HELMET Client Service — ${payload.Subject || "New Inquiry"}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      const result = await response.json();
      if (response.ok && result.success !== "false") {
        setStatus("success");
        e.currentTarget.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-20 py-12 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-16 border-b border-neutral-200 pb-6">
          <Link href="/" className="text-xs uppercase tracking-[0.25em] hover:opacity-50 transition">
            ← Helmet Archive
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
            Client Service
          </span>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl uppercase tracking-[0.25em] mb-4 font-light">
            Client Service
          </h1>
          <p className="text-xs text-neutral-500 uppercase tracking-[0.18em] leading-relaxed">
            Our dedicated advisors are available for any inquiries regarding your order, sizing, or garment care. Please note that all sales are final — no returns or exchanges.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] mb-2.5 text-neutral-500">
                Full Name *
              </label>
              <input
                type="text"
                name="Client_Name"
                required
                placeholder="YOUR NAME"
                className="w-full bg-transparent border border-neutral-300 p-4 text-xs tracking-widest focus:border-black outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] mb-2.5 text-neutral-500">
                Email Address *
              </label>
              <input
                type="email"
                name="Client_Email"
                required
                placeholder="YOUR EMAIL"
                className="w-full bg-transparent border border-neutral-300 p-4 text-xs tracking-widest focus:border-black outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] mb-2.5 text-neutral-500">
                Order Reference (Optional)
              </label>
              <input
                type="text"
                name="Order_Reference"
                placeholder="#HLM-001"
                className="w-full bg-transparent border border-neutral-300 p-4 text-xs tracking-widest focus:border-black outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] mb-2.5 text-neutral-500">
                Topic *
              </label>
              <select
                name="Subject"
                required
                className="w-full bg-white border border-neutral-300 p-4 text-xs uppercase tracking-widest focus:border-black outline-none transition"
              >
                <option value="Order Status & Shipping">Order Status & Shipping</option>
                <option value="Sizing & Garment Specifications">Sizing & Garment Specifications</option>
                <option value="Payment & Billing">Payment & Billing</option>
                <option value="Press & Private Appointments">Press & Private Appointments</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.25em] mb-2.5 text-neutral-500">
              Message *
            </label>
            <textarea
              name="Message"
              rows={6}
              required
              placeholder="PLEASE DETAIL YOUR REQUEST..."
              className="w-full bg-transparent border border-neutral-300 p-4 text-xs tracking-widest focus:border-black outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {status === "loading" ? "Transmitting..." : "Submit Inquiry"}
          </button>

          {status === "success" && (
            <div className="p-5 border border-black bg-neutral-50 text-xs uppercase tracking-[0.2em] text-center">
              Your inquiry has been transmitted to HELMET Client Service.
            </div>
          )}

          {status === "error" && (
            <div className="p-5 border border-red-600 text-red-600 text-xs uppercase tracking-[0.2em] text-center">
              Transmission error. Check your email helmetcothes@gmail.com to click "Activate Form" on the first test.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}