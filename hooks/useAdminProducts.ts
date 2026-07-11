"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminDashboard, Product, ProductInput } from "@/types/product";

export type AdminFilters = {
  query: string;
  status: string;
  category: string;
  sort: string;
  page: number;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const defaultDashboard: AdminDashboard = {
  totalProducts: 0,
  publishedProducts: 0,
  draftProducts: 0,
  totalCategories: 0,
  latestProducts: [],
  bestSellerProducts: [],
  discountedProducts: [],
};

export const defaultAdminFilters: AdminFilters = {
  query: "",
  status: "all",
  category: "Semua",
  sort: "newest",
  page: 1,
};

export function useAdminProducts(authenticated: boolean) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dashboard, setDashboard] = useState<AdminDashboard>(defaultDashboard);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<AdminFilters>(defaultAdminFilters);
  const [loading, setLoading] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      query: filters.query,
      status: filters.status,
      category: filters.category,
      sort: filters.sort,
      page: String(filters.page),
      pageSize: "20",
    });

    return params.toString();
  }, [filters]);

  const loadProducts = useCallback(async () => {
    if (!authenticated) return;

    setLoading(true);
    const response = await fetch(`/api/admin/products?${queryString}`, {
      cache: "no-store",
    }).catch(() => null);
    setLoading(false);

    if (!response || response.status === 401) return;

    const data = (await response.json()) as {
      products: Product[];
      categories: string[];
      dashboard: AdminDashboard;
      pagination: Pagination;
    };

    setProducts(data.products);
    setCategories(data.categories);
    setDashboard(data.dashboard);
    setPagination(data.pagination);
  }, [authenticated, queryString]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadProducts(), 0);
    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  async function saveProduct(product: ProductInput, editingId?: string) {
    const response = await fetch(
      editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      },
    );
    const data = (await response.json().catch(() => ({}))) as { message?: string };

    if (!response.ok) {
      throw new Error(data.message || "Produk belum bisa disimpan.");
    }

    await loadProducts();
  }

  async function deleteProduct(productId: string) {
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string };

    if (!response.ok) {
      throw new Error(data.message || "Produk belum bisa dihapus.");
    }

    await loadProducts();
  }

  async function toggleProduct(product: Product, published: boolean) {
    await saveProduct({ ...product, published }, product.id);
  }

  return {
    products,
    categories,
    dashboard,
    pagination,
    filters,
    loading,
    setFilters,
    loadProducts,
    saveProduct,
    deleteProduct,
    toggleProduct,
  };
}
