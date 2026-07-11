"use client";

import { trackCategorySelect } from "@/lib/analytics/events";
import type { ProductFilter } from "@/types/product";

type FilterSidebarProps = {
  filters: ProductFilter;
  categories: string[];
  onChange: (filters: ProductFilter) => void;
  onReset: () => void;
};

export default function FilterSidebar({
  filters,
  categories,
  onChange,
  onReset,
}: FilterSidebarProps) {
  function update<K extends keyof ProductFilter>(key: K, value: ProductFilter[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <aside className="h-fit rounded-[8px] bg-white p-5 shadow-sm lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-neutral-950">Filter</h2>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Temukan produk yang paling cocok dengan kebutuhanmu.
          </p>
        </div>
        <button
          onClick={onReset}
          className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-black text-neutral-700 transition hover:bg-neutral-950 hover:text-white"
        >
          Reset
        </button>
      </div>

      <label className="mt-6 block">
        <span className="text-xs font-black uppercase text-neutral-500">Kategori</span>
        <select
          value={filters.category}
          onChange={(event) => {
            trackCategorySelect(event.target.value);
            update("category", event.target.value);
          }}
          className="mt-2 h-11 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#FF6A00]"
        >
          {["Semua", ...categories].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-black uppercase text-neutral-500">Harga</span>
        <select
          value={filters.priceRange}
          onChange={(event) => update("priceRange", event.target.value)}
          className="mt-2 h-11 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#FF6A00]"
        >
          <option value="all">Semua harga</option>
          <option value="under-50">Di bawah Rp50rb</option>
          <option value="50-100">Rp50rb - Rp100rb</option>
          <option value="100-200">Rp100rb - Rp200rb</option>
          <option value="above-200">Di atas Rp200rb</option>
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-black uppercase text-neutral-500">Rating</span>
        <select
          value={filters.minRating}
          onChange={(event) => update("minRating", event.target.value)}
          className="mt-2 h-11 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#FF6A00]"
        >
          <option value="all">Semua rating</option>
          <option value="4.9">4.9 ke atas</option>
          <option value="4.8">4.8 ke atas</option>
          <option value="4.7">4.7 ke atas</option>
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-black uppercase text-neutral-500">Urutkan</span>
        <select
          value={filters.sort}
          onChange={(event) => update("sort", event.target.value)}
          className="mt-2 h-11 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm font-bold outline-none focus:border-[#FF6A00]"
        >
          <option value="recommended">Rekomendasi</option>
          <option value="newest">Terbaru</option>
          <option value="price-low">Harga terendah</option>
          <option value="rating">Rating tertinggi</option>
          <option value="sold">Terlaris</option>
        </select>
      </label>

      <div className="mt-5 grid gap-3">
        <label className="flex items-center gap-3 rounded-[8px] bg-neutral-50 px-3 py-3">
          <input
            checked={filters.promoOnly}
            onChange={(event) => update("promoOnly", event.target.checked)}
            type="checkbox"
            className="size-4 accent-[#FF6A00]"
          />
          <span className="text-sm font-bold text-neutral-800">Promo aktif</span>
        </label>
        <label className="flex items-center gap-3 rounded-[8px] bg-neutral-50 px-3 py-3">
          <input
            checked={filters.newestOnly}
            onChange={(event) => update("newestOnly", event.target.checked)}
            type="checkbox"
            className="size-4 accent-[#FF6A00]"
          />
          <span className="text-sm font-bold text-neutral-800">Produk terbaru</span>
        </label>
      </div>
    </aside>
  );
}
