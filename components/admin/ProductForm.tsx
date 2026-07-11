"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import type { Product, ProductInput } from "@/types/product";

const blankForm: ProductInput = {
  title: "",
  description: "",
  category: "",
  image: "",
  imageAlt: "",
  price: 0,
  originalPrice: 0,
  badge: "",
  discount: "",
  rating: 4.8,
  sold: 0,
  affiliateUrl: "",
  tags: [],
  isPromo: true,
  isFlashSale: false,
  isBestSeller: false,
  published: true,
};

type ProductFormProps = {
  categories: string[];
  editingProduct: Product | null;
  saving: boolean;
  uploading: boolean;
  onUpload: (file: File) => Promise<string>;
  onSave: (product: ProductInput, editingId?: string) => Promise<void>;
  onCancelEdit: () => void;
};

export default function ProductForm({
  categories,
  editingProduct,
  saving,
  uploading,
  onUpload,
  onSave,
  onCancelEdit,
}: ProductFormProps) {
  const initialForm = editingProduct
    ? {
        title: editingProduct.title,
        description: editingProduct.description,
        category: editingProduct.category,
        image: editingProduct.image,
        imageAlt: editingProduct.imageAlt,
        price: editingProduct.price,
        originalPrice: editingProduct.originalPrice,
        badge: editingProduct.badge,
        discount: editingProduct.discount,
        rating: editingProduct.rating,
        sold: editingProduct.sold,
        affiliateUrl: editingProduct.affiliateUrl,
        tags: editingProduct.tags,
        isPromo: editingProduct.isPromo,
        isFlashSale: editingProduct.isFlashSale,
        isBestSeller: editingProduct.isBestSeller,
        published: editingProduct.published,
      }
    : { ...blankForm, category: categories[0] || "" };
  const [form, setForm] = useState<ProductInput>(initialForm);
  const [tagText, setTagText] = useState(editingProduct?.tags.join(", ") || "");
  const [dragging, setDragging] = useState(false);

  async function handleFile(file?: File) {
    if (!file) return;
    const url = await onUpload(file);
    setForm((current) => ({
      ...current,
      image: url,
      imageAlt: current.imageAlt || current.title,
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave(
      {
        ...form,
        tags: tagText
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        rating: Number(form.rating),
        sold: Number(form.sold),
      },
      editingProduct?.id,
    );
    if (!editingProduct) {
      setForm({ ...blankForm, category: categories[0] || "" });
      setTagText("");
    }
  }

  return (
    <form onSubmit={submit} className="rounded-[8px] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-[#FF6A00]">Produk</p>
          <h2 className="mt-1 text-xl font-black text-neutral-950">
            {editingProduct ? "Edit produk" : "Tambah produk"}
          </h2>
        </div>
        {editingProduct && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-black"
          >
            Batal
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-4">
        <label
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void handleFile(event.dataTransfer.files[0]);
          }}
          className={`block rounded-[8px] border border-dashed p-4 ${
            dragging ? "border-[#FF6A00] bg-[#FFF3EA]" : "border-black/15 bg-neutral-50"
          }`}
        >
          <span className="text-xs font-black uppercase text-neutral-500">Foto</span>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => void handleFile(event.target.files?.[0])}
              className="w-full text-sm font-semibold"
            />
            {uploading && (
              <span className="shrink-0 text-xs font-black text-[#FF6A00]">
                Mengupload foto...
              </span>
            )}
          </div>
          <p className="mt-2 text-xs font-semibold text-neutral-500">
            Tarik foto ke area ini atau pilih file.
          </p>
          {form.image && (
            <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-[8px] bg-neutral-100">
              <Image
                src={form.image}
                alt={form.imageAlt || form.title || "Preview produk"}
                fill
                sizes="360px"
                className="object-cover"
              />
            </div>
          )}
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Judul" value={form.title} onChange={(title) => setForm((current) => ({ ...current, title }))} required />
          <Field label="Kategori" value={form.category} onChange={(category) => setForm((current) => ({ ...current, category }))} list="admin-categories" required />
        </div>
        <datalist id="admin-categories">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>

        <label className="block">
          <span className="text-xs font-black uppercase text-neutral-500">Deskripsi</span>
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            rows={3}
            className="mt-2 w-full resize-none rounded-[8px] border border-black/10 px-3 py-3 text-sm leading-6 outline-none focus:border-[#FF6A00]"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField label="Harga" value={form.price} onChange={(price) => setForm((current) => ({ ...current, price }))} required />
          <NumberField label="Harga coret" value={form.originalPrice} onChange={(originalPrice) => setForm((current) => ({ ...current, originalPrice }))} />
          <Field label="Diskon" value={form.discount} onChange={(discount) => setForm((current) => ({ ...current, discount }))} placeholder="47%" />
          <Field label="Badge" value={form.badge} onChange={(badge) => setForm((current) => ({ ...current, badge }))} />
          <NumberField label="Rating" value={form.rating} step="0.1" onChange={(rating) => setForm((current) => ({ ...current, rating }))} />
          <NumberField label="Terjual" value={form.sold} onChange={(sold) => setForm((current) => ({ ...current, sold }))} />
        </div>

        <Field label="Link Affiliate" value={form.affiliateUrl} onChange={(affiliateUrl) => setForm((current) => ({ ...current, affiliateUrl }))} placeholder="https://s.shopee.co.id/..." required />
        <Field label="Alt foto" value={form.imageAlt} onChange={(imageAlt) => setForm((current) => ({ ...current, imageAlt }))} />
        <Field label="Tags" value={tagText} onChange={setTagText} placeholder="promo, fashion, viral" />

        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["isPromo", "Diskon"],
            ["isFlashSale", "Flash Sale"],
            ["isBestSeller", "Terlaris"],
            ["published", "Publish"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 rounded-[8px] bg-neutral-50 px-3 py-3">
              <input
                checked={Boolean(form[key as keyof ProductInput])}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.checked }))}
                type="checkbox"
                className="size-4 accent-[#FF6A00]"
              />
              <span className="text-sm font-bold">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        disabled={saving || uploading}
        className="mt-5 w-full rounded-full bg-[#FF6A00] px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-950 disabled:opacity-60"
      >
        {saving ? "Menyimpan..." : editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  list,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  list?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        list={list}
        className="mt-2 h-11 w-full rounded-[8px] border border-black/10 px-3 text-sm outline-none focus:border-[#FF6A00]"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = "1",
  required = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-neutral-500">{label}</span>
      <input
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        step={step}
        required={required}
        className="mt-2 h-11 w-full rounded-[8px] border border-black/10 px-3 text-sm outline-none focus:border-[#FF6A00]"
      />
    </label>
  );
}
