import { prisma } from "@/lib/prisma";

const placeholderImage = "/uploads/product-placeholder.svg";

const groups = [
  {
    category: "Skincare Anak",
    links: [
      "https://s.shopee.co.id/9KgKCDECb6",
      "https://s.shopee.co.id/7prWPUVtLo",
      "https://s.shopee.co.id/9fJAatspkl",
      "https://s.shopee.co.id/2qSqSN0RNf",
      "https://s.shopee.co.id/2Vq03mNIv4",
      "https://s.shopee.co.id/7VEg1Cc4ga",
      "https://s.shopee.co.id/7KvFoucvJs",
    ],
  },
  {
    category: "Fashion Wanita",
    links: [
      "https://s.shopee.co.id/6pyzEv08w4",
      "https://s.shopee.co.id/W4vhI5q26",
      "https://s.shopee.co.id/2Vq04z1o8o",
      "https://s.shopee.co.id/4Vb4SfTwRB",
      "https://s.shopee.co.id/4qDurIByZT",
      "https://s.shopee.co.id/1qaJHnUlEZ",
      "https://s.shopee.co.id/qhm5yK0CP",
      "https://s.shopee.co.id/4AyE47BJAm",
      "https://s.shopee.co.id/4LHeGQqGTx",
      "https://s.shopee.co.id/9KgKDeIBxz",
      "https://s.shopee.co.id/9fJAcHhwt0",
      "https://s.shopee.co.id/60PsFYzUUV",
      "https://s.shopee.co.id/9zw10vMxzm",
      "https://s.shopee.co.id/7AbpdjJbFo",
      "https://s.shopee.co.id/9KgKDjBlyO",
      "https://s.shopee.co.id/9KgKDjokei",
      "https://s.shopee.co.id/qhm67lzQK",
      "https://s.shopee.co.id/5VTbejB87f",
    ],
  },
  {
    category: "Makanan",
    links: [
      "https://s.shopee.co.id/2g9QG1YwQX",
      "https://s.shopee.co.id/1qaJI0owfw",
      "https://s.shopee.co.id/6pyzFDjOSH",
      "https://s.shopee.co.id/6L2ieJOtXW",
      "https://s.shopee.co.id/60PsFiDSDb",
      "https://s.shopee.co.id/4LHeGf4owy",
      "https://s.shopee.co.id/5q6S3QhWLi",
      "https://s.shopee.co.id/4LHeGgeEWg",
      "https://s.shopee.co.id/4Vb4T0lzhy",
      "https://s.shopee.co.id/80AwdSTFQ2",
      "https://s.shopee.co.id/1VxStWnfd5",
      "https://s.shopee.co.id/1VxStY9GU5",
    ],
  },
  {
    category: "Peralatan Rumah Tangga",
    links: [
      "https://s.shopee.co.id/2qSqSTOLXU",
      "https://s.shopee.co.id/3B5gr80cjB",
      "https://s.shopee.co.id/6pyzDspyO7",
      "https://s.shopee.co.id/AAFRCA1tzt",
      "https://s.shopee.co.id/5q6S2GjaTK",
      "https://s.shopee.co.id/4fuUeBwAuM",
      "https://s.shopee.co.id/4AyE3Opcd4",
      "https://s.shopee.co.id/2BD9flS3FB",
      "https://s.shopee.co.id/70IPRvCwAr",
      "https://s.shopee.co.id/4Vb4TM7cci",
    ],
  },
  {
    category: "Alat Makan",
    links: [
      "https://s.shopee.co.id/2qSqSTOLXU",
      "https://s.shopee.co.id/8V7DCxnckQ",
      "https://s.shopee.co.id/7KvFoucvJs",
      "https://s.shopee.co.id/5VTbduFZlg",
      "https://s.shopee.co.id/3ViXGFUcgw",
    ],
  },
  { category: "Baju Anak", links: ["https://s.shopee.co.id/6ffZ1cgSUV", "https://s.shopee.co.id/40enqkGbYI", "https://s.shopee.co.id/5LABRCgwhJ"] },
  {
    category: "Peralatan Sekolah",
    links: [
      "https://s.shopee.co.id/6AjIQp2Dj6",
      "https://s.shopee.co.id/6AjIQrkIsw",
      "https://s.shopee.co.id/5q6S2GjaTK",
      "https://s.shopee.co.id/9UzkPJp2Uy",
      "https://s.shopee.co.id/W4vgnSbVZ",
      "https://s.shopee.co.id/BS5ICbr7L",
      "https://s.shopee.co.id/2g9QGoZ9WK",
    ],
  },
  {
    category: "Skincare Dewasa",
    links: [
      "https://s.shopee.co.id/AAFRCcOLUC",
      "https://s.shopee.co.id/2Vq04Xvb3V",
      "https://s.shopee.co.id/LlVUZhmnA",
      "https://s.shopee.co.id/40enrKbT0B",
      "https://s.shopee.co.id/5fn1qPrTN4",
      "https://s.shopee.co.id/8AUMp1TSU4",
      "https://s.shopee.co.id/8AUMp2SzBv",
      "https://s.shopee.co.id/7VEg1pDWNv",
      "https://s.shopee.co.id/5LABRrPu48",
    ],
  },
  {
    category: "Handphone",
    links: [
      "https://s.shopee.co.id/AAFRCmga2T",
      "https://s.shopee.co.id/9KgKDGR89i",
      "https://s.shopee.co.id/50XL3KdAxe",
      "https://s.shopee.co.id/AUsHbTYtLM",
      "https://s.shopee.co.id/6AjIRWp7ac",
      "https://s.shopee.co.id/903ToldFiw",
    ],
  },
  {
    category: "Baju Dinas",
    links: [
      "https://s.shopee.co.id/5fn1rF64M2",
      "https://s.shopee.co.id/9KgKDzVhwI",
      "https://s.shopee.co.id/1VxStcTIuI",
      "https://s.shopee.co.id/AUsHcAcpiX",
      "https://s.shopee.co.id/1BKcV3FxKL",
      "https://s.shopee.co.id/30mGgRRcBc",
      "https://s.shopee.co.id/7fY6F4pfjk",
      "https://s.shopee.co.id/4qDurpaSJ7",
      "https://s.shopee.co.id/3LP7566A0X",
    ],
  },
  {
    category: "Hobi Mancing",
    links: [
      "https://s.shopee.co.id/5LABSvIhHf",
      "https://s.shopee.co.id/2LWZtQIv9n",
      "https://s.shopee.co.id/5LABSxC7AS",
      "https://s.shopee.co.id/9fJAcwGnen",
      "https://s.shopee.co.id/2Vq05oyKgN",
    ],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function productSlug(category: string, link: string, index: number) {
  const code = link.split("/").pop();
  return slugify(`${category} produk baru ${index + 1} ${code}`);
}

const globalSeedState = globalThis as unknown as {
  affiliateSeedPromise?: Promise<void>;
};

export async function ensureAffiliateProductsSeeded() {
  if (!globalSeedState.affiliateSeedPromise) {
    globalSeedState.affiliateSeedPromise = seedIfEmpty();
  }

  await globalSeedState.affiliateSeedPromise;
}

async function seedIfEmpty() {
  const existingProducts = await prisma.product.count();
  if (existingProducts > 0) return;

  for (const group of groups) {
    const category = await prisma.category.upsert({
      where: { name: group.category },
      update: {},
      create: { name: group.category },
    });

    for (const [index, link] of group.links.entries()) {
      const existing = await prisma.product.findFirst({
        where: { affiliateUrl: link, categoryId: category.id },
      });
      if (existing) continue;

      await prisma.product.create({
        data: {
          slug: productSlug(group.category, link, index),
          title: "Produk Baru",
          description: "Silakan edit deskripsi produk.",
          image: placeholderImage,
          imageAlt: "Produk Baru",
          price: 0,
          originalPrice: 0,
          badge: "Baru",
          discount: "",
          rating: 4.8,
          sold: 0,
          affiliateUrl: link,
          tagsJson: JSON.stringify([group.category]),
          isPromo: false,
          isFlashSale: false,
          isBestSeller: false,
          published: true,
          categoryId: category.id,
        },
      });
    }
  }
}
