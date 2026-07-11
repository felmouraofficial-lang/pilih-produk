"use client";

import type { AdminFilters } from "@/hooks/useAdminProducts";

type AdminToolbarProps = {
  filters: AdminFilters;
  categories: string[];
  loading: boolean;
  onChange: (filters: AdminFilters) => void;
};

export default function AdminToolbar({
  filters,
  categories,
  loading,
  onChange,
}: AdminToolbarProps) {
  function update(next: Partial<AdminFilters>) {
    onChange({ ...filters, ...next, page: next.page || 1 });
  }

  return (
    <section className="rounded-[8px] bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1fr_160px_180px_180px]">
        <input
          value={filters.query}
          onChange={(event) => update({ query: event.target.value })}
          placeholder="Cari nama produk, kategori, harga, status"
          className="h-11 rounded-[8px] border border-black/10 px-3 text-sm font-semibold outline-none focus:border-[#FF6A00]"
        />
        <select
          value={filters.status}
          onChange={(event) => update({ status: event.target.value })}
          className="h-11 rounded-[8px] border border-black/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#FF6A00]"
        >
          <option value="all">Semua</option>
          <option value="published">Publish</option>
          <option value="draft">Draft</option>
          <option value="discount">Diskon</option>
        </select>
        <select
          value={filters.sort}
          onChange={(event) => update({ sort: event.target.value })}
          className="h-11 rounded-[8px] border border-black/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#FF6A00]"
        >
          <option value="newest">Terbaru</option>
          <option value="rating">Rating tertinggi</option>
          <option value="sold">Terlaris</option>
          <option value="price-low">Harga termurah</option>
          <option value="price-high">Harga termahal</option>
        </select>
        <select
          value={filters.category}
          onChange={(event) => update({ category: event.target.value })}
          className="h-11 rounded-[8px] border border-black/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#FF6A00]"
        >
          <option value="Semua">Semua kategori</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {loading && <p className="mt-3 text-xs font-black text-[#FF6A00]">Memuat data...</p>}
    </section>
  );
}
