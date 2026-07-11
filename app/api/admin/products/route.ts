import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createProduct, listAdminProducts } from "@/lib/product-store";
import type { ProductInput } from "@/types/product";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 401 });
}

function cleanProductInput(body: Partial<ProductInput>) {
  const category = String(body.category || "").trim();
  const affiliateUrl = String(body.affiliateUrl || "").trim();
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const image = String(body.image || "").trim();
  const imageAlt = String(body.imageAlt || title).trim();
  const badge = String(body.badge || "").trim();
  const discount = String(body.discount || "").trim();
  const price = Number(body.price);
  const originalPrice = Number(body.originalPrice);
  const rating = Number(body.rating);
  const sold = Number(body.sold);

  if (!title) return { error: "Judul wajib diisi." };
  if (!image) return { error: "Foto wajib diupload." };
  if (!category) return { error: "Kategori wajib diisi." };
  if (!affiliateUrl) return { error: "Link affiliate wajib diisi." };

  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Harga wajib diisi dengan benar." };
  }

  if (!affiliateUrl.startsWith("https://")) {
    return { error: "Link produk harus diawali https://." };
  }

  return {
    product: {
      category,
      affiliateUrl,
      title,
      description: description || title,
      image,
      imageAlt,
      price,
      originalPrice: Number.isFinite(originalPrice) ? originalPrice : price,
      badge,
      discount,
      rating: Number.isFinite(rating) ? Math.min(Math.max(rating, 0), 5) : 4.8,
      sold: Number.isFinite(sold) ? Math.max(0, sold) : 0,
      tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
      isPromo: Boolean(body.isPromo),
      isFlashSale: Boolean(body.isFlashSale),
      isBestSeller: Boolean(body.isBestSeller),
      published: Boolean(body.published),
    },
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const searchParams = request.nextUrl.searchParams;
  const data = await listAdminProducts({
    query: searchParams.get("query") || "",
    status: searchParams.get("status") || "all",
    category: searchParams.get("category") || "Semua",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page") || 1),
    pageSize: Number(searchParams.get("pageSize") || 20),
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const body = (await request.json().catch(() => null)) as Partial<ProductInput> | null;
  const result = cleanProductInput(body || {});

  if ("error" in result) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const product = await createProduct(result.product);
  return NextResponse.json({ product }, { status: 201 });
}
