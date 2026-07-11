import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatSold } from "@/lib/format";
import ShareProductButton from "@/components/ShareProductButton";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[8px] bg-white shadow-[0_1px_0_rgba(0,0,0,0.08),0_14px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-neutral-100">
        <Image
          src={product.image}
          alt={product.imageAlt || product.title}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-[#FF6A00] px-3 py-1 text-xs font-extrabold text-white shadow-lg">
          -{product.discount}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-neutral-800 shadow-sm">
          {product.category}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3 text-xs font-bold text-neutral-500">
          <span className="rounded-full bg-[#FFF3EA] px-3 py-1 text-[#D95700]">
            {product.badge}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[#FF6A00]">★</span>
            {product.rating.toFixed(1)}
          </span>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-3 line-clamp-2 min-h-12 text-base font-extrabold leading-snug text-neutral-950 transition hover:text-[#D95700]">
            {product.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-neutral-500">
          {product.description}
        </p>

        <div className="mt-4">
          <p className="text-sm font-semibold text-neutral-400 line-through">
            {formatCurrency(product.originalPrice)}
          </p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-xl font-black text-neutral-950">
              {formatCurrency(product.price)}
            </p>
            <p className="shrink-0 text-xs font-bold text-neutral-500">
              {formatSold(product.sold)} terjual
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <ShareProductButton
            slug={product.slug}
            title={product.title}
            className="flex h-11 items-center justify-center rounded-full bg-[#FFF3EA] px-3 text-sm font-extrabold text-[#D95700] transition hover:bg-[#FF6A00] hover:text-white"
          />
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="flex h-11 items-center justify-center rounded-full bg-neutral-950 px-3 text-sm font-extrabold text-white transition hover:bg-[#FF6A00] focus:outline-none focus:ring-4 focus:ring-[#FF6A00]/20"
          >
            Beli
          </a>
        </div>
      </div>
    </article>
  );
}
