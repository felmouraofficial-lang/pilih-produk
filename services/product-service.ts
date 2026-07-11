import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { ensureAffiliateProductsSeeded } from "@/services/affiliate-seed";
import type {
  AdminDashboard,
  AdminProductFilter,
  Product,
  ProductFormInput,
} from "@/types/product";

const productInclude = {
  category: true,
};

type ProductRecord = Awaited<ReturnType<typeof prisma.product.findFirst>> & {
  category?: { name: string } | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseTags(value: string) {
  try {
    const tags = JSON.parse(value) as unknown;
    return Array.isArray(tags) ? tags.map(String) : [];
  } catch {
    return [];
  }
}

function toProduct(product: ProductRecord): Product {
  if (!product) {
    throw new Error("Product record is empty.");
  }

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    category: product.category?.name || "",
    image: product.image,
    imageAlt: product.imageAlt,
    price: product.price,
    originalPrice: product.originalPrice,
    badge: product.badge,
    discount: product.discount,
    rating: product.rating,
    sold: product.sold,
    affiliateUrl: product.affiliateUrl,
    tags: parseTags(product.tagsJson),
    isPromo: product.isPromo,
    isFlashSale: product.isFlashSale,
    isBestSeller: product.isBestSeller,
    published: product.published,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

async function ensureCategory(name: string) {
  return prisma.category.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function uniqueSlug(title: string, ignoredProductId?: string) {
  const base = slugify(title) || "produk";
  let slug = base;
  let index = 2;

  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoredProductId) return slug;
    slug = `${base}-${index}`;
    index += 1;
  }
}

function productData(input: ProductFormInput, categoryId: string, slug: string) {
  return {
    slug,
    title: input.title,
    description: input.description,
    image: input.image,
    imageAlt: input.imageAlt || input.title,
    price: input.price,
    originalPrice: input.originalPrice,
    badge: input.badge,
    discount: input.discount,
    rating: input.rating,
    sold: input.sold,
    affiliateUrl: input.affiliateUrl,
    tagsJson: JSON.stringify(input.tags || []),
    isPromo: input.isPromo,
    isFlashSale: input.isFlashSale,
    isBestSeller: input.isBestSeller,
    published: input.published,
    categoryId,
  };
}

export async function getCategories() {
  await ensureAffiliateProductsSeeded();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return categories.map((category) => category.name);
}

export async function getPublicProducts() {
  await ensureAffiliateProductsSeeded();

  const products = await prisma.product.findMany({
    where: { published: true },
    include: productInclude,
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
  });

  return products.map(toProduct);
}

export async function getProductBySlug(slug: string) {
  await ensureAffiliateProductsSeeded();

  const product = await prisma.product.findFirst({
    where: { slug, published: true },
    include: productInclude,
  });

  return product ? toProduct(product) : null;
}

export async function listAdminProducts(filters: AdminProductFilter = {}) {
  await ensureAffiliateProductsSeeded();

  const page = Math.max(1, Number(filters.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(filters.pageSize) || 20));
  const query = filters.query?.trim();
  const category = filters.category?.trim();
  const status = filters.status || "all";
  const sort = filters.sort || "newest";
  const numericQuery = query ? Number(query.replace(/[^0-9]/g, "")) : NaN;

  const where: Prisma.ProductWhereInput = {};
  const and: Prisma.ProductWhereInput[] = [];

  if (query) {
    and.push({
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { badge: { contains: query } },
        { affiliateUrl: { contains: query } },
        { category: { name: { contains: query } } },
        ...(Number.isFinite(numericQuery)
          ? [{ price: numericQuery }, { originalPrice: numericQuery }]
          : []),
      ],
    });
  }

  if (category && category !== "Semua") {
    and.push({ category: { name: category } });
  }

  if (status === "published") and.push({ published: true });
  if (status === "draft") and.push({ published: false });
  if (status === "discount") {
    and.push({ OR: [{ isPromo: true }, { discount: { not: "" } }] });
  }

  if (and.length > 0) where.AND = and;

  const orderBy =
    sort === "rating"
      ? [{ rating: "desc" as const }, { createdAt: "desc" as const }]
      : sort === "sold"
        ? [{ sold: "desc" as const }, { createdAt: "desc" as const }]
        : sort === "price-low"
          ? [{ price: "asc" as const }]
          : sort === "price-high"
            ? [{ price: "desc" as const }]
            : [{ createdAt: "desc" as const }];

  const [total, products, categories, dashboard] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    getCategories(),
    getAdminDashboard(),
  ]);

  return {
    products: products.map(toProduct),
    categories,
    dashboard,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  await ensureAffiliateProductsSeeded();

  const [
    totalProducts,
    publishedProducts,
    draftProducts,
    totalCategories,
    latestProducts,
    bestSellerProducts,
    discountedProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.product.count({ where: { published: false } }),
    prisma.category.count(),
    prisma.product.findMany({
      include: productInclude,
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      include: productInclude,
      orderBy: [{ sold: "desc" }, { rating: "desc" }],
      take: 5,
    }),
    prisma.product.findMany({
      where: { OR: [{ isPromo: true }, { discount: { not: "" } }] },
      include: productInclude,
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    totalProducts,
    publishedProducts,
    draftProducts,
    totalCategories,
    latestProducts: latestProducts.map(toProduct),
    bestSellerProducts: bestSellerProducts.map(toProduct),
    discountedProducts: discountedProducts.map(toProduct),
  };
}

export async function createProduct(input: ProductFormInput) {
  const category = await ensureCategory(input.category);
  const slug = await uniqueSlug(input.title);
  const product = await prisma.product.create({
    data: productData(input, category.id, slug),
    include: productInclude,
  });

  return toProduct(product);
}

export async function updateProduct(id: string, input: ProductFormInput) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return null;

  const category = await ensureCategory(input.category);
  const slug =
    input.title !== existing.title ? await uniqueSlug(input.title, id) : existing.slug;
  const product = await prisma.product.update({
    where: { id },
    data: productData(input, category.id, slug),
    include: productInclude,
  });

  return toProduct(product);
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return false;

  await prisma.product.delete({ where: { id } });
  return true;
}
