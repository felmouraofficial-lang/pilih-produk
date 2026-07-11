"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackBuyClick } from "@/lib/analytics/events";
import type { Product } from "@/types/product";

type TrackedBuyLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  product: Product;
  children: ReactNode;
};

export default function TrackedBuyLink({
  product,
  children,
  onClick,
  ...props
}: TrackedBuyLinkProps) {
  return (
    <a
      {...props}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={(event) => {
        trackBuyClick(product);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
