"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function VaultPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === "helmet" || passcode === "0000") {
      setUnlocked(true);
    } else {
      alert("INVALID PASSCODE. ACCESS DENIED.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-20 font-sans pt-6">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md flex justify-between items-center py-6 mb-16 border-b border-neutral-200">
        <Link href="/" className="text-xs uppercase tracking-[0.3em] text-neutral-600 hover:text-black transition-colors">
          ← BACK TO HOME
        </Link>
        <span className="font-cancellaresca text-xl md:text-2xl tracking-[0.2em] uppercase text-center">
          HELMET VAULT [RESTRICTED]
        </span>
        <div className="w-16" />
      </header>

      <div className="max-w-xl mx-auto py-16 text-center">
        {!unlocked ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-neutral-200 p-12 bg-neutral-50 flex flex-col items-center gap-6"
          >
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase">PRIVATE ARCHIVE ACCESS</h2>
            <p className="text-[10px] text-neutral-500 tracking-widest max-w-sm">
              THIS SPACE IS RESERVED FOR PRIVATE MEMBERS. ENTER PASSCODE (TRY &quot;HELMET&quot;) TO UNLOCK THE SECRET CAPSULE.
            </p>
            <form onSubmit={handleUnlock} className="flex flex-col gap-4 w-full max-w-xs mt-4">
              <input
                type="password"
                placeholder="ENTER PASSCODE"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="bg-white border border-neutral-300 p-3 text-xs uppercase tracking-widest text-center text-black outline-none focus:border-black"
              />
              <button
                type="submit"
                className="bg-black text-white text-xs uppercase tracking-[0.3em] py-3 font-bold hover:bg-neutral-800 transition-colors"
              >
                UNLOCK VAULT
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden bg-neutral-100 border border-neutral-200">
              <img src="/product1.jpg" alt="Vault Item" className="h-full w-full object-cover" />
            </div>
            <h3 className="text-xs font-bold tracking-[0.3em] uppercase mt-2">LIMITED VAULT PIECE — 01/10</h3>
            <p className="text-[10px] text-neutral-500 tracking-widest">EXCLUSIVE ARCHIVE RELEASE. NOT AVAILABLE TO THE PUBLIC.</p>
            <Link
              href="/shop"
              className="mt-4 bg-black text-white text-xs uppercase tracking-[0.3em] px-8 py-4 font-bold hover:bg-neutral-800 transition-colors"
            >
              RETURN TO PUBLIC SHOP
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}