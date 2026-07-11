import type { Metadata, Viewport } from "next";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import { getBaseUrl, getSiteContent } from "@/services/site-service";
import "./globals.css";

export const dynamic = "force-dynamic";

const keywords = [
  "etalase pilihan",
  "produk affiliate",
  "rekomendasi produk",
  "promo produk",
  "produk pilihan",
  "belanja online",
];

export const viewport: Viewport = {
  themeColor: "#FF6A00",
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  const baseUrl = getBaseUrl(site);
  const ogImage = site.openGraphImage || "/opengraph-image";

  return {
    metadataBase: new URL(baseUrl),
    title: site.metaTitle,
    description: site.metaDescription,
    keywords,
    applicationName: site.websiteName,
    authors: [{ name: site.websiteName }],
    creator: site.websiteName,
    publisher: site.websiteName,
    verification: site.googleSearchConsoleVerification
      ? { google: site.googleSearchConsoleVerification }
      : undefined,
    alternates: {
      canonical: site.canonicalUrl || baseUrl,
    },
    openGraph: {
      title: site.metaTitle,
      description: site.metaDescription,
      type: "website",
      locale: "id_ID",
      url: baseUrl,
      siteName: site.websiteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: site.websiteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: site.metaTitle,
      description: site.metaDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: site.favicon ? { icon: site.favicon } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}
