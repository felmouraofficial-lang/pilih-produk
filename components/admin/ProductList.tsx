"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import type { AdminFilters } from "@/hooks/useAdminProducts";
import type { Product } from "@/types/product";

type ProductListProps = {
  products: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: AdminFilters;
  onFilterChange: (filters: AdminFilters) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onTogglePublish: (product: Product, published: boolean) => void;
};

export default function ProductList({
  products,
  pagination,
  filters,
  onFilterChange,
  onEdit,
  onDelete,
  onTogglePublish,
}: ProductListProps) {
  function goToPage(page: number) {
    onFilterChange({
      ...filters,
      page: Math.min(Math.max(1, page), pagination.totalPages),
    });
  }

  return (
    <section className="rounded-[8px] bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-2 border-b border-black/5 p-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-black text-neutral-950">Semua Produk</h2>
          <p className="mt-1 text-sm font-semibold text-neutral-500">
            {pagination.total.toLocaleString("id-ID")} produk ditemukan
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-black text-neutral-600">
          <button
            type="button"
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="rounded-full bg-neutral-100 px-3 py-2 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="rounded-full bg-neutral-100 px-3 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid gap-3 p-4">
        {products.length === 0 ? (
          <div className="rounded-[8px] bg-neutral-50 p-8 text-center">
            <p className="text-lg font-black text-neutral-950">Produk belum ditemukan</p>
            <p className="mt-2 text-sm font-semibold text-neutral-500">
              Coba ubah pencarian atau filter.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <article
              key={product.id}
              className="grid gap-4 rounded-[8px] border border-black/5 p-3 md:grid-cols-[112px_1fr_auto]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-neutral-100 md:aspect-square">
                <Image
                  src={product.image}
                  alt={product.imageAlt || product.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#FFF3EA] px-3 py-1 text-xs font-black text-[#D95700]">
                    {product.category}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-600">
                    {product.published ? "Publish" : "Draft"}
                  </span>
                  {product.discount && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                      {product.discount}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-black text-neutral-950">
                  {product.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  {product.description}
                </p>
                <div className="mt-3 grid gap-2 text-sm font-bold text-neutral-700 sm:grid-cols-2 xl:grid-cols-4">
                  <span>{formatCurrency(product.price)}</span>
                  <span className="text-neutral-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span>Rating {product.rating.toFixed(1)}</span>
                  <span>{product.badge || "Tanpa badge"}</span>
                </div>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="mt-2 block truncate text-xs font-bold text-[#D95700]"
                >
                  {product.affiliateUrl}
                </a>
              </div>

              <div className="flex flex-wrap items-start gap-2 md:justify-end">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-black text-white transition hover:bg-[#FF6A00]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onTogglePublish(product, !product.published)}
                  className="rounded-full bg-[#FFF3EA] px-4 py-2 text-sm font-black text-[#D95700] transition hover:bg-[#FF6A00] hover:text-white"
                >
                  {product.published ? "Draft" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
