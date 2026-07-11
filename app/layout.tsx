import type { Metadata } from "next";
import { getBaseUrl, getSiteContent } from "@/services/site-service";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  const baseUrl = getBaseUrl(site);
  const ogImage = site.openGraphImage || "/opengraph-image";

  return {
    metadataBase: new URL(baseUrl),
    title: site.metaTitle,
    description: site.metaDescription,
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
      siteName: site.websiteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: site.websiteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: site.metaTitle,
      description: site.metaDescription,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
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

async function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const site = await getSiteContent();

  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {site.googleAnalyticsId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.googleAnalyticsId}');`,
              }}
            />
          </>
        ) : null}
        {site.metaPixelId ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${site.metaPixelId}');fbq('track','PageView');`,
            }}
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
