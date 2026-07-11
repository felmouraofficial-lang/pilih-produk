import { NextResponse } from "next/server";
import { getPublicProducts } from "@/lib/product-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getPublicProducts();
  return NextResponse.json({ products });
}
