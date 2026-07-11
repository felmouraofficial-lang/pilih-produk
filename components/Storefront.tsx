"use client";

import { useMemo, useState } from "react";
import CategorySlider from "@/components/CategorySlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import FilterSidebar from "@/components/FilterSidebar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import PromoBanner from "@/components/PromoBanner";
import type { Product, ProductFilter } from "@/types/product";
import type { SiteContent } from "@/types/product";

type StorefrontProps = {
  products: Product[];
  categories: string[];
  site: SiteContent;
};

const blankFilters: ProductFilter = {
  query: "",
  category: "Semua",
  priceRange: "all",
  minRating: "all",
  promoOnly: false,
  newestOnly: false,
  sort: "recommended",
};

function matchesPrice(product: Product, range: string) {
  if (range === "under-50") return product.price < 50000;
  if (range === "50-100") return product.price >= 50000 && product.price <= 100000;
  if (range === "100-200") return product.price > 100000 && product.price <= 200000;
  if (range === "above-200") return product.price > 200000;
  return true;
}

function newestCutoff() {
  const date = new Date();
  date.setDate(date.getDate() - 14);
  return Number(date);
}

export default function Storefront({ products, categories, site }: StorefrontProps) {
  const [filters, setFilters] = useState<ProductFilter>(blankFilters);

  const filteredProducts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const minRating = filters.minRating === "all" ? 0 : Number(filters.minRating);
    const cutoff = newestCutoff();

    return products
      .filter((product) => {
        const searchable = `${product.title} ${product.category} ${product.description} ${product.tags.join(" ")}`.toLowerCase();
        const matchesQuery = !query || searchable.includes(query);
        const matchesCategory =
          filters.category === "Semua" || product.category === filters.category;
        const matchesPromo = !filters.promoOnly || product.isPromo;
        const matchesNewest =
          !filters.newestOnly || Number(new Date(product.createdAt)) >= cutoff;

        return (
          matchesQuery &&
          matchesCategory &&
          matchesPrice(product, filters.priceRange) &&
          product.rating >= minRating &&
          matchesPromo &&
          matchesNewest
        );
      })
      .sort((a, b) => {
        if (filters.sort === "newest") {
          return Number(new Date(b.createdAt)) - Number(new Date(a.createdAt));
        }
        if (filters.sort === "price-low") return a.price - b.price;
        if (filters.sort === "rating") return b.rating - a.rating;
        if (filters.sort === "sold") return b.sold - a.sold;
        return Number(b.isBestSeller) - Number(a.isBestSeller) || b.rating - a.rating;
      });
  }, [filters, products]);

  const bestSellers = useMemo(
    () => products.filter((product) => product.isBestSeller).sort((a, b) => b.sold - a.sold),
    [products],
  );
  const promos = useMemo(() => products.filter((product) => product.isPromo), [products]);
  const flashSale = useMemo(
    () => products.filter((product) => product.isFlashSale),
    [products],
  );
  const recommended = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating),
    [products],
  );

  return (
    <main className="min-h-screen bg-[#F6F6F6] text-neutral-950">
      <Navbar
        site={site}
        query={filters.query}
        onQueryChange={(query) => setFilters((current) => ({ ...current, query }))}
      />
      <Hero
        site={site}
        products={recommended}
        query={filters.query}
        onQueryChange={(query) => setFilters((current) => ({ ...current, query }))}
      />
      <CategorySlider
        categories={categories}
        activeCategory={filters.category}
        onChange={(category) => setFilters((current) => ({ ...current, category }))}
      />
      <PromoBanner product={promos[0]} />

      <FeaturedProducts
        id="terlaris"
        eyebrow="Produk Terlaris"
        title="Paling Banyak Dibeli"
        products={bestSellers}
      />
      <FeaturedProducts
        id="flash-sale"
        eyebrow="Flash Sale"
        title="Diskon Cepat Hari Ini"
        products={flashSale}
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <FilterSidebar
          filters={filters}
          categories={categories}
          onChange={setFilters}
          onReset={() => setFilters(blankFilters)}
        />
        <ProductGrid
          products={filteredProducts}
          eyebrow="Rekomendasi Untuk Kamu"
          title="Produk Pilihan"
        />
      </section>

      <FeaturedProducts
        id="rekomendasi"
        eyebrow="Kurasi Premium"
        title="Rekomendasi Untuk Kamu"
        products={recommended}
      />
      <Footer site={site} />
    </main>
  );
}
