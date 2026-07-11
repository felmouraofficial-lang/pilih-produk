"use client";

import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import type { SiteContent } from "@/types/product";

type NavbarProps = {
  site: SiteContent;
  query: string;
  onQueryChange: (value: string) => void;
};

export default function Navbar({ site, query, onQueryChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex shrink-0 items-center gap-3">
          {site.logo ? (
            <Image
              src={site.logo}
              alt={site.websiteName}
              width={144}
              height={44}
              className="h-11 max-w-36 rounded-[8px] object-contain"
            />
          ) : null}
          <span>
            <span className="block text-base font-black leading-tight text-neutral-950">
              {site.websiteName}
            </span>
            <span className="hidden text-xs font-bold text-neutral-500 sm:block">
              Produk kurasi harian
            </span>
          </span>
        </a>

        <nav className="ml-4 hidden items-center gap-6 text-sm font-bold text-neutral-600 lg:flex">
          <a className="transition hover:text-[#FF6A00]" href="#">
            Beranda
          </a>
          <a className="transition hover:text-[#FF6A00]" href="#kategori">
            Kategori
          </a>
          <a className="transition hover:text-[#FF6A00]" href="#promo">
            Promo
          </a>
          <a className="transition hover:text-[#FF6A00]" href="#tentang">
            Tentang
          </a>
        </nav>

        <div className="ml-auto hidden w-full max-w-sm md:block">
          <SearchBar value={query} onChange={onQueryChange} compact />
        </div>

        <a
          href="#produk"
          className="hidden h-11 shrink-0 items-center rounded-full bg-neutral-950 px-5 text-sm font-extrabold text-white transition hover:bg-[#FF6A00] sm:flex"
        >
          Belanja Sekarang
        </a>
      </div>
    </header>
  );
}
