"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminToolbar from "@/components/admin/AdminToolbar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ProductForm from "@/components/admin/ProductForm";
import ProductList from "@/components/admin/ProductList";
import SiteForm from "@/components/admin/SiteForm";
import Toast from "@/components/admin/Toast";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import type { Product, ProductInput, SiteContent } from "@/types/product";

type AdminTab = "dashboard" | "products" | "add" | "banner" | "settings";

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [site, setSite] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({
    message: "",
    tone: "success",
  });
  const adminProducts = useAdminProducts(authenticated);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3500);

    fetch("/api/admin/session", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: { authenticated: boolean }) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => {
        window.clearTimeout(timeout);
        setCheckingSession(false);
      });

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/admin/site", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { site: SiteContent }) => setSite(data.site))
      .catch(() => setToast({ message: "Gagal mengambil pengaturan website.", tone: "error" }));
  }, [authenticated]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setToast({ message: "", tone: "success" });

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setSaving(false);

    if (!response.ok) {
      setToast({ message: "Username atau password salah.", tone: "error" });
      return;
    }

    setPassword("");
    setAuthenticated(true);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setEditingProduct(null);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as { url?: string; message?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.message || "Foto belum bisa diupload.");
      }

      setToast({ message: "Foto berhasil diupload.", tone: "success" });
      return data.url;
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Foto belum bisa diupload.",
        tone: "error",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  }

  async function saveProduct(product: ProductInput, editingId?: string) {
    setSaving(true);
    try {
      await adminProducts.saveProduct(product, editingId);
      setToast({
        message: editingId ? "Produk berhasil diupdate." : "Produk berhasil dibuat.",
        tone: "success",
      });
      setEditingProduct(null);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Produk belum bisa disimpan.",
        tone: "error",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function saveSite(input: Partial<SiteContent>) {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await response.json()) as { site?: SiteContent; message?: string };
      if (!response.ok || !data.site) throw new Error(data.message || "Pengaturan gagal disimpan.");
      setSite(data.site);
      setToast({ message: "Pengaturan berhasil disimpan.", tone: "success" });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Pengaturan gagal disimpan.", tone: "error" });
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setSaving(true);
    try {
      await adminProducts.deleteProduct(deleteTarget.id);
      setToast({ message: "Produk berhasil dihapus.", tone: "success" });
      setDeleteTarget(null);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Produk belum bisa dihapus.",
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(product: Product, published: boolean) {
    setSaving(true);
    try {
      await adminProducts.toggleProduct(product, published);
      setToast({ message: published ? "Produk dipublish." : "Produk dijadikan draft.", tone: "success" });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Status produk gagal diubah.", tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F6F6F6] px-4 text-neutral-950">
        <p className="text-sm font-black uppercase text-[#FF6A00]">Memuat admin...</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F6F6F6] px-4 text-neutral-950">
        <form onSubmit={login} className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-xl">
          <p className="text-sm font-black uppercase text-[#FF6A00]">Area admin</p>
          <h1 className="mt-3 text-3xl font-black">Login CMS Produk</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Masuk untuk mengelola produk yang tampil di homepage, search,
            kategori, promo, dan halaman detail produk.
          </p>
          <label className="mt-6 block">
            <span className="text-xs font-black uppercase text-neutral-500">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 h-12 w-full rounded-[8px] border border-black/10 px-3 text-sm outline-none focus:border-[#FF6A00]"
              placeholder="admin"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-black uppercase text-neutral-500">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="mt-2 h-12 w-full rounded-[8px] border border-black/10 px-3 text-sm outline-none focus:border-[#FF6A00]"
              placeholder="Masukkan password admin"
            />
          </label>
          <button
            disabled={saving}
            className="mt-5 w-full rounded-full bg-[#FF6A00] px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-950 disabled:opacity-60"
          >
            {saving ? "Memeriksa..." : "Masuk Admin"}
          </button>
        </form>
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast({ message: "", tone: "success" })}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F6F6] px-4 py-6 text-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <header className="flex flex-col justify-between gap-4 border-b border-black/10 pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-[#FF6A00]">CMS Produk</p>
            <h1 className="mt-2 text-4xl font-black">Dashboard Admin</h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Semua data produk disimpan di SQLite lewat Prisma dan langsung
              dipakai homepage, search, kategori, promo, dan detail produk.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["dashboard", "Dashboard"],
              ["products", "Produk"],
              ["add", "Tambah Produk"],
              ["banner", "Banner"],
              ["settings", "Pengaturan Website"],
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab as AdminTab)}
                className={`rounded-full px-4 py-3 text-sm font-black transition ${
                  activeTab === tab ? "bg-[#FF6A00] text-white" : "bg-white hover:bg-neutral-950 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
            <Link
              href="/"
              className="rounded-full bg-white px-4 py-3 text-sm font-black shadow-sm transition hover:bg-neutral-950 hover:text-white"
            >
              Lihat Website
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-neutral-950 px-4 py-3 text-sm font-black text-white transition hover:bg-[#FF6A00]"
            >
              Keluar
            </button>
          </div>
        </header>

        {activeTab === "dashboard" && <AdminDashboard dashboard={adminProducts.dashboard} />}

        {(activeTab === "products" || activeTab === "add") && <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="xl:sticky xl:top-6 xl:h-fit">
            <ProductForm
              key={editingProduct?.id || "new-product"}
              categories={adminProducts.categories}
              editingProduct={editingProduct}
              saving={saving}
              uploading={uploading}
              onUpload={uploadImage}
              onSave={saveProduct}
              onCancelEdit={() => setEditingProduct(null)}
            />
          </div>

          {activeTab === "products" && <div className="grid gap-4">
            <AdminToolbar
              filters={adminProducts.filters}
              categories={adminProducts.categories}
              loading={adminProducts.loading}
              onChange={adminProducts.setFilters}
            />
            <ProductList
              products={adminProducts.products}
              pagination={adminProducts.pagination}
              filters={adminProducts.filters}
              onFilterChange={adminProducts.setFilters}
              onEdit={(product) => {
                setEditingProduct(product);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDelete={setDeleteTarget}
              onTogglePublish={togglePublish}
            />
          </div>}
        </section>}

        {(activeTab === "banner" || activeTab === "settings") && site && (
          <SiteForm
            key={activeTab}
            site={site}
            mode={activeTab === "banner" ? "banner" : "settings"}
            saving={saving}
            uploading={uploading}
            onUpload={uploadImage}
            onSave={saveSite}
          />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Yakin ingin menghapus produk?"
        description={deleteTarget ? `Produk "${deleteTarget.title}" akan dihapus dari database.` : ""}
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <Toast
        message={toast.message}
        tone={toast.tone}
        onClose={() => setToast({ message: "", tone: "success" })}
      />
    </main>
  );
}
