import { prisma } from "@/lib/prisma";
import type { SiteContent } from "@/types/product";

const siteId = "site";

const defaults: SiteContent = {
  websiteName: "Etalase Pilihan",
  websiteDescription:
    "Website rekomendasi produk pilihan dengan kurasi promo dan link belanja terpercaya.",
  logo: "",
  favicon: "",
  footerText:
    "Harga, stok, voucher, dan promo mengikuti informasi terbaru di halaman marketplace tujuan.",
  metaTitle: "Etalase Pilihan | Rekomendasi Produk Terbaik dan Harga Terjangkau",
  metaDescription:
    "Landing page rekomendasi produk affiliate untuk menemukan produk pilihan, promo, rating, dan link belanja langsung.",
  canonicalUrl: "",
  openGraphImage: "",
  googleAnalyticsId: "",
  metaPixelId: "",
  googleSearchConsoleVerification: "",
  heroTitle: "Temukan Produk Pilihan dengan Harga Terbaik",
  heroSubtitle:
    "Kami memilih produk berkualitas dari seller terpercaya. Bandingkan promo, lihat rekomendasi, lalu checkout langsung lewat link affiliate.",
  heroCta: "Lihat Produk",
  heroImage: "",
};

function toSiteContent(content: SiteContent | null): SiteContent {
  return { ...defaults, ...(content || {}) };
}

type SiteContentRecord = SiteContent & {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

type PrismaWithOptionalSite = typeof prisma & {
  siteContent?: {
    upsert: (args: unknown) => Promise<SiteContentRecord>;
  };
};

const siteFields = Object.keys(defaults) as Array<keyof SiteContent>;

async function ensureSiteTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SiteContent (
      id TEXT PRIMARY KEY NOT NULL DEFAULT 'site',
      websiteName TEXT NOT NULL DEFAULT '',
      websiteDescription TEXT NOT NULL DEFAULT '',
      logo TEXT NOT NULL DEFAULT '',
      favicon TEXT NOT NULL DEFAULT '',
      footerText TEXT NOT NULL DEFAULT '',
      metaTitle TEXT NOT NULL DEFAULT '',
      metaDescription TEXT NOT NULL DEFAULT '',
      canonicalUrl TEXT NOT NULL DEFAULT '',
      openGraphImage TEXT NOT NULL DEFAULT '',
      googleAnalyticsId TEXT NOT NULL DEFAULT '',
      metaPixelId TEXT NOT NULL DEFAULT '',
      googleSearchConsoleVerification TEXT NOT NULL DEFAULT '',
      heroTitle TEXT NOT NULL DEFAULT '',
      heroSubtitle TEXT NOT NULL DEFAULT '',
      heroCta TEXT NOT NULL DEFAULT '',
      heroImage TEXT NOT NULL DEFAULT '',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getSiteContentRaw() {
  await ensureSiteTable();
  const existing = await prisma.$queryRawUnsafe<SiteContentRecord[]>(
    "SELECT * FROM SiteContent WHERE id = ? LIMIT 1",
    siteId,
  );

  if (existing[0]) return toSiteContent(existing[0]);

  const values = siteFields.map((field) => defaults[field]);
  await prisma.$executeRawUnsafe(
    `INSERT INTO SiteContent (id, ${siteFields.join(", ")}) VALUES (?, ${siteFields
      .map(() => "?")
      .join(", ")})`,
    siteId,
    ...values,
  );

  return defaults;
}

export async function getSiteContent() {
  const siteDelegate = (prisma as PrismaWithOptionalSite).siteContent;
  if (!siteDelegate) return getSiteContentRaw();

  const content = await siteDelegate.upsert({
    where: { id: siteId },
    update: {},
    create: { id: siteId, ...defaults },
  });

  return toSiteContent(content);
}

export async function updateSiteContent(input: Partial<SiteContent>) {
  const data = Object.fromEntries(
    Object.entries(input)
      .filter(([key]) => siteFields.includes(key as keyof SiteContent))
      .map(([key, value]) => [key, String(value ?? "").trim()]),
  ) as Partial<SiteContent>;

  const siteDelegate = (prisma as PrismaWithOptionalSite).siteContent;
  if (!siteDelegate) {
    await getSiteContentRaw();
    const entries = Object.entries(data);
    if (entries.length > 0) {
      await prisma.$executeRawUnsafe(
        `UPDATE SiteContent SET ${entries.map(([key]) => `${key} = ?`).join(", ")}, updatedAt = ? WHERE id = ?`,
        ...entries.map(([, value]) => value),
        new Date().toISOString(),
        siteId,
      );
    }
    return getSiteContentRaw();
  }

  const content = await siteDelegate.upsert({
    where: { id: siteId },
    update: data,
    create: { id: siteId, ...defaults, ...data },
  });

  return toSiteContent(content);
}

export function getBaseUrl(site: SiteContent) {
  return (
    site.canonicalUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL?.replace(/^/, "https://") ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
