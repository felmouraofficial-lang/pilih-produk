import type { MetadataRoute } from "next";
import { getBaseUrl, getSiteContent } from "@/services/site-service";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteContent();
  const baseUrl = getBaseUrl(site);

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
