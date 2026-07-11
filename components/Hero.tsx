"use client";

import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import { formatCurrency } from "@/lib/format";
import type { Product, SiteContent } from "@/types/product";

type HeroProps = {
  site: SiteContent;
  products: Product[];
  query: string;
  onQueryChange: (value: string) => void;
};

export default function Hero({ site, products, query, onQueryChange }: HeroProps) {
  const featured = products.slice(0, 4);

  return (
    <section className="overflow-hidden bg-[#FAFAFA]">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:px-8 lg:py-16">
        <div className="animate-fade-up">
          <p className="text-sm font-black uppercase text-[#FF6A00]">
            Affiliate Product Discovery
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] text-neutral-950 sm:text-6xl lg:text-7xl">
            {site.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            {site.heroSubtitle}
          </p>

          <div className="mt-8 max-w-2xl">
            <SearchBar value={query} onChange={onQueryChange} />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#produk"
              className="flex h-14 items-center justify-center rounded-full bg-[#FF6A00] px-7 text-sm font-black text-white shadow-[0_18px_40px_rgba(255,106,0,0.24)] transition hover:bg-neutral-950"
            >
              {site.heroCta || "Lihat Produk"}
            </a>
            <a
              href="#promo"
              className="flex h-14 items-center justify-center rounded-full border border-black/10 bg-white px-7 text-sm font-black text-neutral-950 transition hover:border-neutral-950"
            >
              Lihat Promo
            </a>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["120+", "Kurasi produk"],
              ["4.8", "Rata-rata rating"],
              ["24 Jam", "Promo dipantau"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[8px] bg-white p-4 shadow-sm">
                <p className="text-2xl font-black text-neutral-950">{value}</p>
                <p className="mt-1 text-xs font-bold text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-up lg:pl-8">
          {site.heroImage ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-neutral-100 shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
              <Image
                src={site.heroImage}
                alt={site.heroTitle}
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
          <div className="relative grid gap-4">
            {featured.map((product, index) => (
              <a
                key={product.id}
                href={product.affiliateUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className={`group grid grid-cols-[112px_1fr] items-center gap-4 rounded-[8px] bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.16)] ${
                  index % 2 === 1 ? "lg:translate-x-8" : ""
                }`}
              >
                <div className="relative aspect-square overflow-hidden rounded-[8px] bg-neutral-100">
                  <Image
                    src={product.image}
                    alt={product.imageAlt || product.title}
                    fill
                    priority={index === 0}
                    sizes="112px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#FFF3EA] px-2.5 py-1 text-[11px] font-black text-[#D95700]">
                      -{product.discount}
                    </span>
                    <span className="text-xs font-bold text-neutral-500">
                      ★ {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-black leading-snug text-neutral-950">
                    {product.title}
                  </p>
                  <p className="mt-1 text-sm font-black text-[#FF6A00]">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </a>
            ))}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
