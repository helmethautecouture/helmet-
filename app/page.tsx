"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const AUDIO_PATHS = [
  "/ambiante.mp3",
  "/ambiance.mp3",
  "/ambient.mp3",
  "/ambiante.mp3.mp3",
  "/ambiance.mp3.mp3",
];

let introPlayedInMemory = false;

const HELMET_FAQ_SECTIONS = [
  {
    title: "SHIPPING POLICY",
    paragraphs: [
      "Please allow 2-3 weeks for your order to be shipped.",
      "We are happy to update you through the process or answer any questions about your order by emailing helmetcothes@gmail.com or through our Client Service.",
      "Helmet Haute Couture is an independent house run out of Paris, France. We have no corporate cosign or external funding. We are using specialized local printers and ateliers, everything is hand-packed in Paris, and we create all the content in-house. Thanks for supporting thoughtful and independent design.",
    ],
  },
  {
    title: "EXCHANGE / STORE CREDIT POLICY",
    paragraphs: [
      "Each product page will indicate whether an item is eligible for an exchange or store credit. All printable, screen-printed, and embroidery archive items from Edition -01 are final sale.",
      "To initiate an exchange or store credit, head to our Client Service Concierge within 7 days of receiving your order.",
      "If your item arrived damaged, faulty, or you received the wrong product, please start a request through our Client Service and indicate your return reason is due to a fulfillment error. Our Paris atelier will direct you from there.",
    ],
  },
  {
    title: "CHECKOUT+",
    paragraphs: [
      "Checkout+ is an optional add-on available at checkout that covers both your return shipping and your package while it is in transit.",
      "- Free Return Shipping: if you need to send something back for an exchange or store credit, your return shipping label is covered.",
      "- Package Protection: if your package is lost, stolen, or damaged in transit, you can submit a claim and, upon approval, receive a same-item replacement at no extra cost.",
      "Checkout+ cannot be cancelled or refunded after purchase and will not be included in store credit amounts. Coverage cannot be added to an order after it has been placed. If Checkout+ was not selected at checkout, you are responsible for the cost of return shipping, and we will not be able to assist with packages that are lost, stolen, or damaged in transit.",
      "To start a return or file a shipping claim, use our Client Service Concierge.",
    ],
  },
  {
    title: "INTERNATIONAL RETURNS",
    paragraphs: [
      "International customers may initiate a return request through our Client Service portal within 7 days of receiving your order. At the end of the flow you will be asked to arrange and purchase your own return shipping label (if applicable) to send the item back to our Paris Atelier. Approved returns will not include original orders taxes, duties, or shipping costs in the store credit.",
    ],
  },
  {
    title: "INTERNATIONAL SHIPPING POLICY",
    paragraphs: [
      "We do not cover taxes and duties associated with international shipments outside the European Union. Our international carrier will contact you directly regarding any applicable fees. Please make sure to provide a valid email address and telephone number at checkout.",
    ],
  },
  {
    title: "EU CUSTOMER RIGHT TO WITHDRAW",
    paragraphs: [
      "EU customers, you have the legal right to withdraw from your purchase within 14 days of receiving your order, subject to applicable consumer protection laws.",
      "In the event you exercise your right to withdraw, return shipping costs are your responsibility and will not be reimbursed.",
      "If your withdrawal request is approved, you will receive a refund in accordance with applicable EU consumer protection laws. Refunds will be issued using the original payment method unless otherwise agreed.",
      "If you have any questions regarding your right to withdraw, please contact us at helmetcothes@gmail.com.",
    ],
  },
  {
    title: "CARE",
    paragraphs: [
      "We always recommend hand washing all products in cold water or dry cleaning to extend the life of the garment.",
      "Please make sure to hang dry all products to maintain the quality of the print. Machine drying garments will distress a print over time.",
      "All of our vintage black garments use a unique pigment black dye that is designed to fade evenly over time. Crocking in the pigment is completely normal and expected for the first few cycles of wears and washes. We advise that you wash these garments alone or with like colors and hang to dry.",
    ],
  },
];

/* ============================================================================
   COMPOSANT 1 : DRAPEAU / RUBAN DE PARCHEMIN COURBÉ (_4d70a2.png)
   Avec rouleaux gravés, ombrages hachurés, petites étoiles et texte courbé
   ============================================================================ */
function CurvedRibbonBanner({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const pathId = `ribbon-curve-${id}`;
  const isLong = label.length > 10;

  return (
    <svg
      viewBox="0 0 260 76"
      className="helmet-ornament-svg"
      style={{ width: "100%", height: "100%" }}
      aria-label={label}
    >
      {/* Ombre de gravure sous les rouleaux gauche et droit */}
      <path
        d="M 16,47 C 8,49 7,61 18,64 C 28,66 39,60 44,51 L 34,37 Z"
        fill="#e5e5e5"
        stroke="#111111"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M 244,47 C 252,49 253,61 242,64 C 232,66 221,60 216,51 L 226,37 Z"
        fill="#e5e5e5"
        stroke="#111111"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Hachures de gravure dans les plis d'ombre */}
      <path
        d="M 28,50 L 38,54 M 31,45 L 40,49 M 232,50 L 222,54 M 229,45 L 220,49"
        stroke="#111111"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Petite étoile gravée gauche (style As Above So Below) */}
      <path
        d="M 43,23 L 45,28 L 50,26 L 46,30 L 49,34 L 44,32 L 41,36 L 42,31 L 37,29 L 42,28 Z"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <line x1="44" y1="33" x2="43" y2="39" stroke="#111111" strokeWidth="1.1" />

      {/* Petite étoile gravée droite */}
      <path
        d="M 217,21 L 219,26 L 224,24 L 220,28 L 223,32 L 218,30 L 215,34 L 216,29 L 211,27 L 216,26 Z"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <line x1="216" y1="31" x2="217" y2="37" stroke="#111111" strokeWidth="1.1" />

      {/* Corps principal du Drapeau / Parchemin Courbé */}
      <path
        d="M 28,42 C 82,11 178,11 232,42 L 220,60 C 172,33 88,33 40,60 Z"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />

      {/* Filet de gravure interne subtil le long des bords du parchemin */}
      <path
        d="M 33,43 C 84,14.5 176,14.5 227,43"
        fill="none"
        stroke="#111111"
        strokeWidth="0.6"
        strokeDasharray="3 2"
        opacity="0.55"
      />

      {/* Volute / Enroulement du parchemin à gauche */}
      <path
        d="M 28,42 C 19,36 11,42 14,52 C 16,59 26,63 34,58 C 39,55 40,48 35,45 C 31,43 27,47 29,51"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="1.45"
        strokeLinecap="round"
      />

      {/* Volute / Enroulement du parchemin à droite */}
      <path
        d="M 232,42 C 241,36 249,42 246,52 C 244,59 234,63 226,58 C 221,55 220,48 225,45 C 229,43 233,47 231,51"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="1.45"
        strokeLinecap="round"
      />

      {/* Courbe invisible sur laquelle le texte s'aligne */}
      <defs>
        <path
          id={pathId}
          d="M 36,52 C 86,24 174,24 224,52"
        />
      </defs>

      {/* Texte en police 1589 Humane Bordeaux suivant la courbe du drapeau */}
      <text
        fill="#000000"
        fontSize={isLong ? "12.5" : "14"}
        letterSpacing={isLong ? "2.2px" : "3.4px"}
        textAnchor="middle"
      >
        <textPath href={`#${pathId}`} startOffset="50%">
          {label.toUpperCase()}
        </textPath>
      </text>
    </svg>
  );
}

/* ============================================================================
   COMPOSANT 2 : MINI-CARTOUCHE RENAISSANCE À FLEURONS (_4d70e2.png)
   Pour les petits boutons Info (en haut au milieu) et Cart [0] (en haut à droite)
   ============================================================================ */
function RenaissanceCrestFrame({ children }: { children: React.ReactNode }) {
  return (
    <span className="helmet-crest-pill">
      <svg
        viewBox="0 0 140 44"
        className="helmet-ornament-svg"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* Fleurons gravés haut, bas, gauche, droite (style _4d70e2.png) */}
        <path
          d="M 70,2 L 74,7 L 70,10 L 66,7 Z M 70,42 L 74,37 L 70,34 L 66,37 Z"
          fill="#ffffff"
          stroke="#111111"
          strokeWidth="1.3"
        />
        <path
          d="M 3,22 L 10,17 L 13,22 L 10,27 Z M 137,22 L 130,17 L 127,22 L 130,27 Z"
          fill="#ffffff"
          stroke="#111111"
          strokeWidth="1.3"
        />
        {/* Cadre double filet à encoches baroques */}
        <path
          d="M 16,9 L 58,9 C 62,5 78,5 82,9 L 124,9 C 127,13 131,17 131,22 C 131,27 127,31 124,35 L 82,35 C 78,39 62,39 58,35 L 16,35 C 13,31 9,27 9,22 C 9,17 13,13 16,9 Z"
          fill="#ffffff"
          stroke="#111111"
          strokeWidth="1.45"
          strokeLinejoin="round"
        />
        <rect
          x="15"
          y="12"
          width="110"
          height="20"
          fill="none"
          stroke="#111111"
          strokeWidth="0.75"
        />
      </svg>
      <span
        style={{
          position: "relative",
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {children}
      </span>
    </span>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(!introPlayedInMemory);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isMutedByUserRef = useRef(false);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("helmet_cart") || localStorage.getItem("cart") || "[]";
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) {
        const total = saved.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0);
        setCartCount(total);
      }
    } catch {
      setCartCount(0);
    }

    let timer: NodeJS.Timeout;
    if (introPlayedInMemory) {
      setLoading(false);
    } else {
      timer = setTimeout(() => {
        introPlayedInMemory = true;
        setLoading(false);
      }, 2000);
    }

    let isMounted = true;

    const initWebAudio = async () => {
      if (isInitializedRef.current || !isMounted) return;
      isInitializedRef.current = true;

      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx: AudioContext = new AudioCtx();
        audioCtxRef.current = ctx;

        let arrayBuffer: ArrayBuffer | null = null;
        for (const path of AUDIO_PATHS) {
          try {
            const res = await fetch(path);
            if (res.ok) {
              arrayBuffer = await res.arrayBuffer();
              break;
            }
          } catch {}
        }

        if (!arrayBuffer || !isMounted) return;

        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        if (!isMounted) return;

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.7;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);

        if (ctx.state === "running" && !isMutedByUserRef.current) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      } catch {
        setIsPlaying(false);
      }
    };

    initWebAudio();

    const unlockOnInteraction = async () => {
      if (!audioCtxRef.current) {
        await initWebAudio();
      }
      if (
        audioCtxRef.current &&
        audioCtxRef.current.state === "suspended" &&
        !isMutedByUserRef.current
      ) {
        audioCtxRef.current
          .resume()
          .then(() => {
            if (isMounted) setIsPlaying(true);
          })
          .catch(() => {});
      }
    };

    window.addEventListener("click", unlockOnInteraction, { once: true });
    window.addEventListener("touchstart", unlockOnInteraction, { once: true });

    const handleVisibility = () => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (document.hidden || document.visibilityState === "hidden") {
        ctx.suspend().catch(() => {});
        setIsPlaying(false);
      } else if (!isMutedByUserRef.current) {
        ctx
          .resume()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      window.removeEventListener("click", unlockOnInteraction);
      window.removeEventListener("touchstart", unlockOnInteraction);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const toggleAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (isPlaying) {
      isMutedByUserRef.current = true;
      await ctx.suspend();
      setIsPlaying(false);
    } else {
      isMutedByUserRef.current = false;
      await ctx.resume();
      setIsPlaying(true);
    }
  };

  return (
    <main className="helmet-home-shell">
      {/* APERÇU PHOTO NET AU SURVOL */}
      <AnimatePresence>
        {hoveredItem && !infoOpen && (
          <motion.div
            key={hoveredItem}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.22, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={hoveredItem}
              alt=""
              style={{
                width: "clamp(260px, 28vw, 380px)",
                height: "clamp(340px, 36vw, 480px)",
                objectFit: "cover",
                filter: "grayscale(100%) contrast(1.08)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FENÊTRE INFO / FAQ */}
      <AnimatePresence>
        {infoOpen && (
          <motion.div
            key="faq-overlay"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="helmet-faq-overlay"
          >
            <div style={{ maxWidth: "780px", margin: "0 auto" }}>
              <header className="helmet-page-header">
                <div style={{ justifySelf: "start" }}>
                  <button
                    type="button"
                    onClick={() => setInfoOpen(false)}
                    className="helmet-zoom-link"
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.24em",
                      padding: 0,
                      color: "#000000",
                    }}
                  >
                    ← Back To Menu
                  </button>
                </div>

                <div style={{ justifySelf: "center", textAlign: "center" }}>
                  <span
                    className="font-cancellaresca helmet-title-frame"
                    style={{
                      fontSize: "clamp(30px, 4.5vw, 48px)",
                      lineHeight: 1,
                    }}
                  >
                    Helmet Info
                  </span>
                </div>

                <div style={{ justifySelf: "end" }}>
                  <button
                    type="button"
                    onClick={() => setInfoOpen(false)}
                    className="helmet-zoom-link"
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.24em",
                      padding: 0,
                      color: "#000000",
                    }}
                  >
                    Close [X]
                  </button>
                </div>
              </header>

              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.35em",
                    color: "#737373",
                    marginBottom: "8px",
                  }}
                >
                  Paris — Atelier / Edition -01
                </p>
                <h1
                  style={{
                    fontSize: "16px",
                    textTransform: "uppercase",
                    letterSpacing: "0.42em",
                    margin: 0,
                  }}
                >
                  FAQ & POLICIES
                </h1>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "38px" }}>
                {HELMET_FAQ_SECTIONS.map((sec, idx) => (
                  <section
                    key={idx}
                    style={{
                      borderBottom: "1px solid #e5e5e5",
                      paddingBottom: "30px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "13px",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "#000000",
                        marginBottom: "14px",
                      }}
                    >
                      {sec.title}
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          style={{
                            fontSize: "13.5px",
                            lineHeight: 1.8,
                            letterSpacing: "0.06em",
                            color: "#262626",
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
                <Link
                  href="/service"
                  className="helmet-btn-black"
                  style={{ maxWidth: "340px" }}
                >
                  Contact Client Service
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTRO CINÉMATOGRAPHIQUE */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              padding: "0 16px",
            }}
          >
            <motion.div
              initial={{ scale: 1.22, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(84px, 16vw, 240px)",
                  letterSpacing: "0.03em",
                  color: "#000000",
                  display: "block",
                  lineHeight: 1.15,
                  padding: "12px 0",
                  whiteSpace: "nowrap",
                }}
              >
                Helmet
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "13px",
                  letterSpacing: "0.48em",
                  color: "#171717",
                  marginTop: "8px",
                  textTransform: "uppercase",
                }}
              >
                Haute Couture
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER HAUT : Paris — Atelier | Info (Cartouche Renaissance) | Cart [0] (Cartouche Renaissance) */}
      <header className="helmet-home-topbar">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontSize: "11px",
            letterSpacing: "0.28em",
            color: "#171717",
            textTransform: "uppercase",
            justifySelf: "start",
          }}
        >
          <span>Paris — Atelier</span>
          <span style={{ fontSize: "10px", letterSpacing: "0.24em", color: "#525252" }}>
            Edition -01
          </span>
        </div>

        {/* INFO ENCADRÉ AU MILIEU EN HAUT */}
        <div style={{ justifySelf: "center" }}>
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              fontSize: "11px",
              letterSpacing: "0.32em",
              color: "#000000",
              textTransform: "uppercase",
            }}
          >
            <RenaissanceCrestFrame>Info</RenaissanceCrestFrame>
          </button>
        </div>

        {/* PANIER ENCADRÉ EN HAUT À DROITE */}
        <div style={{ justifySelf: "end" }}>
          <Link
            href="/cart"
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "#000000",
              textTransform: "uppercase",
            }}
          >
            <RenaissanceCrestFrame>
              <svg
                width="14"
                height="14"
                style={{ width: "14px", height: "14px", minWidth: "14px", color: "#000000" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l1 12H5L6 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <span>[{cartCount}]</span>
            </RenaissanceCrestFrame>
          </Link>
        </div>
      </header>

      {/* MENU CENTRAL : Les 4 Rubans de Parchemin Courbés autour du Logo Helmet */}
      <div className="helmet-sketch-stage">
        <nav className="helmet-sketch-nav">
          {/* GAUCHE : Shop & Helmet Gallery en Rubans Courbés */}
          <div className="helmet-sketch-left">
            <Link
              href="/shop"
              onMouseEnter={() => setHoveredItem("/product1.jpg")}
              onMouseLeave={() => setHoveredItem(null)}
              className="helmet-ribbon-btn"
            >
              <CurvedRibbonBanner id="shop" label="Shop" />
            </Link>

            <Link
              href="/helmet"
              onMouseEnter={() => setHoveredItem("/product2.jpg")}
              onMouseLeave={() => setHoveredItem(null)}
              className="helmet-ribbon-btn"
            >
              <CurvedRibbonBanner id="gallery" label="Helmet Gallery" />
            </Link>
          </div>

          {/* CENTRE : Logo Helmet Haute Couture */}
          <div className="helmet-sketch-center">
            <Link href="/helmet" className="helmet-logo-zoom">
              <span
                className="font-cancellaresca"
                style={{
                  fontSize: "clamp(66px, 10vw, 142px)",
                  color: "#000000",
                  display: "block",
                  lineHeight: 1.06,
                  whiteSpace: "nowrap",
                }}
              >
                Helmet
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(11px, 1.05vw, 13.5px)",
                  letterSpacing: "0.46em",
                  color: "#171717",
                  marginTop: "6px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Haute Couture
              </span>
            </Link>
          </div>

          {/* DROITE : Client Service & Cart en Rubans Courbés */}
          <div className="helmet-sketch-right">
            <Link href="/service" className="helmet-ribbon-btn">
              <CurvedRibbonBanner id="service" label="Client Service" />
            </Link>

            <Link href="/cart" className="helmet-ribbon-btn">
              <CurvedRibbonBanner id="cart" label={`Cart [${cartCount}]`} />
            </Link>
          </div>
        </nav>
      </div>

      {/* FOOTER BAS */}
      <footer className="helmet-home-footer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "11px",
            letterSpacing: "0.26em",
            color: "#171717",
            justifySelf: "start",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <a
            href="https://www.instagram.com/helmet.hautecouture/"
            target="_blank"
            rel="noreferrer"
            className="helmet-zoom-link"
          >
            Instagram
          </a>
          <span style={{ color: "#a3a3a3" }}>/</span>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noreferrer"
            className="helmet-zoom-link"
          >
            YouTube
          </a>
        </div>

        <div style={{ justifySelf: "center" }}>
          <button
            type="button"
            onClick={toggleAudio}
            className="helmet-zoom-link"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#171717",
            }}
            title={isPlaying ? "Sound On (70%)" : "Sound Off"}
          >
            <svg
              width="26"
              height="26"
              style={{ width: "26px", height: "26px", minWidth: "26px" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 15v-3a8 8 0 0 1 16 0v3" />
              <rect x="2.5" y="13.5" width="3.5" height="6.5" rx="1.5" fill="currentColor" />
              <rect x="18" y="13.5" width="3.5" height="6.5" rx="1.5" fill="currentColor" />
            </svg>
            {!isPlaying && (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "1.5px",
                    backgroundColor: "#dc2626",
                    transform: "rotate(45deg)",
                    display: "block",
                  }}
                />
              </span>
            )}
          </button>
        </div>

        <div
          style={{
            textAlign: "right",
            fontSize: "11px",
            letterSpacing: "0.26em",
            color: "#171717",
            justifySelf: "end",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <span className="hidden sm:inline">© Helmet All Rights Reserved</span>
          <span className="sm:hidden">© Helmet</span>
        </div>
      </footer>
    </main>
  );
}