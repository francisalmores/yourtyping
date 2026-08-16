"use client";

import { useEffect } from "react";

export default function AdSlot({ slot, format = "auto", className = "" }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, [client]);

  if (!client) {
    return (
      <div
        className={`border border-dashed rounded-md flex items-center justify-center text-[10px] uppercase tracking-widest py-6 ${className}`}
        style={{ borderColor: "var(--border-light)", color: "var(--text-faint)" }}
      >
        Ad slot — connect AdSense in .env.local
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
