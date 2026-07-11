import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import ShareProductButton from "@/components/ShareProductButton";
import { formatCurrency, formatSold } from "@/lib/format";
import { getProductBySlug, getPublicProducts } from "@/lib/product-store";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function descriptionLines(description: string) {
  const manualLines = description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (manualLines.length > 1) return manualLines;

  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (sentences.length > 1) return sentences;

  const words = description.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > 72 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produk tidak ditemukan" };
  }

  return {
    title: `${product.title} | Etalase Pilihan`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, products] = await Promise.all([
    getProductBySlug(slug),
    getPublicProducts(),
  ]);

  if (!product) notFound();

  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);
  const description = descriptionLines(product.description);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: product.price,
      url: product.affiliateUrl,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.sold,
    },
  };

  return (
    <main className="min-h-screen bg-[#F6F6F6] text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-10">
        <div className="rounded-[8px] bg-white p-3 shadow-sm sm:p-4">
          <div className="relative aspect-square overflow-hidden rounded-[8px] bg-neutral-50">
          <Image
            src={product.image}
            alt={product.imageAlt || product.title}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-contain p-2"
          />
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center rounded-[8px] bg-white p-5 shadow-sm sm:p-7 lg:p-8">
          <Link href="/" className="text-sm font-black text-[#D95700]">
            Kembali ke katalog
          </Link>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#FFF3EA] px-3 py-1 text-xs font-black text-[#D95700]">
              {product.category}
            </span>
            {product.badge && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-neutral-600">
                {product.badge}
              </span>
            )}
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            {product.title}
          </h1>
          <div className="mt-5 max-w-3xl rounded-[8px] border border-black/5 bg-neutral-50 p-4">
            <h2 className="text-sm font-black uppercase text-neutral-500">
              Deskripsi Produk
            </h2>
            <div className="mt-3 space-y-2 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              {description.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-[8px] bg-neutral-50 p-4">
            {product.originalPrice > 0 && (
              <p className="text-sm font-semibold text-neutral-400 line-through sm:text-base">
                {formatCurrency(product.originalPrice)}
              </p>
            )}
            <p className="mt-1 text-3xl font-black text-neutral-950 sm:text-4xl">
              {formatCurrency(product.price)}
            </p>
            <p className="mt-2 text-sm font-bold text-neutral-500">
              Rating {product.rating.toFixed(1)} / {formatSold(product.sold)} terjual
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,220px)_minmax(0,160px)]">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="flex h-[52px] items-center justify-center rounded-full bg-[#FF6A00] px-6 text-sm font-black text-white transition hover:bg-neutral-950"
            >
              Beli Produk
            </a>
            <ShareProductButton
              slug={product.slug}
              title={product.title}
              className="flex h-[52px] items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 shadow-sm ring-1 ring-black/10 transition hover:bg-neutral-950 hover:text-white"
            />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <ProductGrid
            products={related}
            eyebrow="Produk sejenis"
            title="Rekomendasi kategori ini"
          />
        </section>
      )}
    </main>
  );
}
