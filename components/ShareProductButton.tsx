"use client";

import { useState } from "react";

type ShareProductButtonProps = {
  slug: string;
  title: string;
  className?: string;
};

export default function ShareProductButton({ slug, title, className }: ShareProductButtonProps) {
  const [copied, setCopied] = useState(false);

  async function shareProduct() {
    const url = `${window.location.origin}/product/${slug}`;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        setCopied(false);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={shareProduct}
      className={className || "rounded-full bg-[#FFF3EA] px-4 py-2 text-sm font-extrabold text-[#D95700] transition hover:bg-[#FF6A00] hover:text-white"}
    >
      {copied ? "Link tersalin" : "Share"}
    </button>
  );
}
