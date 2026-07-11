import type { MetadataRoute } from "next";
import { getCategories, getPublicProducts } from "@/lib/product-store";
import { getBaseUrl, getSiteContent } from "@/services/site-service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, products, categories] = await Promise.all([
    getSiteContent(),
    getPublicProducts(),
    getCategories(),
  ]);
  const baseUrl = getBaseUrl(site);
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...categories.map((category) => ({
      url: `${baseUrl}/?category=${encodeURIComponent(category)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: product.image ? [product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`] : undefined,
    })),
  ];
}
