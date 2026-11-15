"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function ClientServicePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formsubmit.co/ajax/contact@helmethautecouture.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          _subject: "Nouveau message Client Service — HELMET",
          _template: "table",
        }),
      });

      if (response.ok) {
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
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-neutral-200 pb-4">
          <Link href="/" className="text-xs uppercase tracking-[0.25em] hover:opacity-60 transition">
            ← Back to Helmet
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
            Client Service
          </span>
        </div>

        <h1 className="text-2xl uppercase tracking-[0.25em] mb-4 font-light">
          Client Service
        </h1>
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-10 leading-relaxed">
          For any inquiries regarding your order, sizing, or general information, please fill out the form below. All sales are final.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2 text-neutral-600">
              Full Name
            </label>
            <input
              type="text"
              name="Name"
              required
              placeholder="ENTER YOUR NAME"
              className="w-full bg-transparent border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none transition"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2 text-neutral-600">
              Email Address
            </label>
            <input
              type="email"
              name="Email"
              required
              placeholder="ENTER YOUR EMAIL"
              className="w-full bg-transparent border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none transition"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2 text-neutral-600">
              Order Number (Optional)
            </label>
            <input
              type="text"
              name="Order_Number"
              placeholder="#HELMET-001"
              className="w-full bg-transparent border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none transition"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2 text-neutral-600">
              Subject
            </label>
            <select
              name="Subject"
              required
              className="w-full bg-white border border-neutral-300 p-3.5 text-xs uppercase tracking-wider focus:border-black outline-none transition"
            >
              <option value="Order Status & Shipping">Order Status & Shipping</option>
              <option value="Product & Sizing Inquiry">Product & Sizing Inquiry</option>
              <option value="Press & Archive Inquiry">Press & Archive Inquiry</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2 text-neutral-600">
              Message
            </label>
            <textarea
              name="Message"
              rows={5}
              required
              placeholder="HOW CAN WE ASSIST YOU?"
              className="w-full bg-transparent border border-neutral-300 p-3.5 text-xs tracking-wider focus:border-black outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <div className="p-4 border border-black bg-neutral-50 text-[11px] uppercase tracking-[0.15em] text-center">
              Your message has been sent to HELMET Client Service.
            </div>
          )}

          {status === "error" && (
            <div className="p-4 border border-red-600 text-red-600 text-[11px] uppercase tracking-[0.15em] text-center">
              Unable to send message. Please verify your email activation.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}