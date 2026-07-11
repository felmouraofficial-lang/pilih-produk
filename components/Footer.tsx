import Image from "next/image";
import type { SiteContent } from "@/types/product";

export default function Footer({ site }: { site: SiteContent }) {
  return (
    <footer id="tentang" className="border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            {site.logo ? (
              <Image
                src={site.logo}
                alt={site.websiteName}
                width={120}
                height={40}
                className="h-10 max-w-32 rounded-[8px] object-contain"
              />
            ) : null}
            <p className="text-lg font-black text-neutral-950">{site.websiteName}</p>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500">
            {site.footerText || site.websiteDescription}
          </p>
        </div>

        <div className="grid gap-2 text-sm font-bold text-neutral-600 sm:grid-cols-2 sm:gap-x-8">
          <a href="#" className="transition hover:text-[#FF6A00]">
            Beranda
          </a>
          <a href="#kategori" className="transition hover:text-[#FF6A00]">
            Kategori
          </a>
          <a href="#promo" className="transition hover:text-[#FF6A00]">
            Promo
          </a>
          <a href="/admin" className="transition hover:text-[#FF6A00]">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
