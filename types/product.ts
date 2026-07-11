export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  price: number;
  originalPrice: number;
  badge: string;
  discount: string;
  rating: number;
  sold: number;
  affiliateUrl: string;
  tags: string[];
  isPromo: boolean;
  isFlashSale: boolean;
  isBestSeller: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">;

export type ProductFormInput = ProductInput;

export type AdminProductFilter = {
  query?: string;
  status?: string;
  category?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export type AdminDashboard = {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalCategories: number;
  latestProducts: Product[];
  bestSellerProducts: Product[];
  discountedProducts: Product[];
};

export type ProductFilter = {
  query: string;
  category: string;
  priceRange: string;
  minRating: string;
  promoOnly: boolean;
  newestOnly: boolean;
  sort: string;
};

export type SiteContent = {
  websiteName: string;
  websiteDescription: string;
  logo: string;
  favicon: string;
  footerText: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  openGraphImage: string;
  googleAnalyticsId: string;
  metaPixelId: string;
  googleSearchConsoleVerification: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroImage: string;
};
