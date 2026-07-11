import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { deleteProduct, updateProduct } from "@/lib/product-store";
import type { ProductInput } from "@/types/product";

function unauthorized() {
  return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 401 });
}

function cleanProductInput(body: Partial<ProductInput>) {
  const input: ProductInput = {
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    category: String(body.category || "").trim(),
    image: String(body.image || "").trim(),
    imageAlt: String(body.imageAlt || body.title || "").trim(),
    price: Number(body.price),
    originalPrice: Number(body.originalPrice),
    badge: String(body.badge || "").trim(),
    discount: String(body.discount || "").trim(),
    rating: Number(body.rating),
    sold: Number(body.sold),
    affiliateUrl: String(body.affiliateUrl || "").trim(),
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    isPromo: Boolean(body.isPromo),
    isFlashSale: Boolean(body.isFlashSale),
    isBestSeller: Boolean(body.isBestSeller),
    published: Boolean(body.published),
  };

  if (!input.title) return { error: "Judul wajib diisi." };
  if (!input.image) return { error: "Foto wajib diupload." };
  if (!input.category) return { error: "Kategori wajib diisi." };
  if (!input.affiliateUrl) return { error: "Link affiliate wajib diisi." };
  if (!Number.isFinite(input.price) || input.price <= 0) {
    return { error: "Harga wajib diisi dengan benar." };
  }

  if (!input.affiliateUrl.startsWith("https://")) {
    return { error: "Link produk harus diawali https://." };
  }

  input.originalPrice = Number.isFinite(input.originalPrice)
    ? input.originalPrice
    : input.price;
  input.rating = Number.isFinite(input.rating)
    ? Math.min(Math.max(input.rating, 0), 5)
    : 4.8;
  input.sold = Number.isFinite(input.sold) ? Math.max(0, input.sold) : 0;

  return { input };
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!isAdminRequest(request)) return unauthorized();

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Partial<ProductInput> | null;
  const result = cleanProductInput(body || {});

  if ("error" in result) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const product = await updateProduct(id, result.input);

  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!isAdminRequest(request)) return unauthorized();

  const { id } = await context.params;
  const deleted = await deleteProduct(id);

  if (!deleted) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
