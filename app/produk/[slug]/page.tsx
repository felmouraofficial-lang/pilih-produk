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
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.92fr_1fr] lg:px-8 lg:py-14">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-neutral-100 shadow-sm">
          <Image
            src={product.image}
            alt={product.imageAlt || product.title}
            fill
            priority
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
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
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            {product.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            {product.description}
          </p>
          <div className="mt-6">
            <p className="text-base font-semibold text-neutral-400 line-through">
              {formatCurrency(product.originalPrice)}
            </p>
            <p className="mt-1 text-4xl font-black text-neutral-950">
              {formatCurrency(product.price)}
            </p>
            <p className="mt-2 text-sm font-bold text-neutral-500">
              Rating {product.rating.toFixed(1)} / {formatSold(product.sold)} terjual
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#FF6A00] px-6 text-sm font-black text-white transition hover:bg-neutral-950 sm:w-fit"
            >
              Lihat Produk
            </a>
            <ShareProductButton
              slug={product.slug}
              title={product.title}
              className="flex h-14 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 shadow-sm transition hover:bg-neutral-950 hover:text-white sm:w-fit"
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
