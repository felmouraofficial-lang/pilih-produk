import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

type FeaturedProductsProps = {
  id: string;
  eyebrow: string;
  title: string;
  products: Product[];
};

export default function FeaturedProducts({
  id,
  eyebrow,
  title,
  products,
}: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-[#FF6A00]">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black text-neutral-950 sm:text-4xl">
              {title}
            </h2>
          </div>
          <a
            href="#produk"
            className="hidden rounded-full bg-white px-5 py-3 text-sm font-black text-neutral-800 shadow-sm transition hover:bg-neutral-950 hover:text-white sm:block"
          >
            Lihat semua
          </a>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
