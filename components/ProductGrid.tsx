import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

type ProductGridProps = {
  products: Product[];
  title: string;
  eyebrow?: string;
  emptyTitle?: string;
};

export default function ProductGrid({
  products,
  title,
  eyebrow,
  emptyTitle = "Produk belum ditemukan",
}: ProductGridProps) {
  return (
    <section id="produk">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          {eyebrow && (
            <p className="text-sm font-black uppercase text-[#FF6A00]">{eyebrow}</p>
          )}
          <h2 className="mt-2 text-3xl font-black text-neutral-950 sm:text-4xl">
            {title}
          </h2>
        </div>
        <p className="text-sm font-bold text-neutral-500">
          {products.length} produk tampil
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      ) : (
        <div className="rounded-[8px] bg-white p-10 text-center shadow-sm">
          <p className="text-xl font-black text-neutral-950">{emptyTitle}</p>
          <p className="mt-2 text-sm font-medium text-neutral-500">
            Coba kata kunci lain atau reset filter.
          </p>
        </div>
      )}
    </section>
  );
}
