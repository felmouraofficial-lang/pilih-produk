import type { Product } from "@/types/product";

type PromoBannerProps = {
  product?: Product;
};

export default function PromoBanner({ product }: PromoBannerProps) {
  if (!product) return null;

  return (
    <section id="promo" className="bg-neutral-950 py-12 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase text-[#FF6A00]">Promo Hari Ini</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
            Diskon sampai {product.discount} untuk {product.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-300">
            Cek voucher dan stok terbaru langsung di Shopee sebelum promo berubah.
          </p>
        </div>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="flex h-12 items-center justify-center rounded-full bg-[#FF6A00] px-7 text-sm font-black text-white transition hover:bg-white hover:text-neutral-950"
        >
          Ambil Promo
        </a>
      </div>
    </section>
  );
}
