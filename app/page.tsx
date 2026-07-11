import Storefront from "@/components/Storefront";
import { getCategories, getPublicProducts } from "@/lib/product-store";
import { getBaseUrl, getSiteContent } from "@/services/site-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getPublicProducts(),
    getCategories(),
  ]);
  const site = await getSiteContent();
  const baseUrl = getBaseUrl(site);
  const siteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    name: site.websiteName,
    description: site.websiteDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.websiteName,
    url: baseUrl,
    logo: site.logo ? `${baseUrl}${site.logo}` : undefined,
  };
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.slice(0, 12).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
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
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Storefront products={products} categories={categories} site={site} />
    </>
  );
}
