/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require("better-sqlite3");
const path = require("node:path");
const crypto = require("node:crypto");

const databasePath = path.join(process.cwd(), "prisma", "dev.db");
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
  {
    category: "Baju Anak",
    links: [
      "https://s.shopee.co.id/6ffZ1cgSUV",
      "https://s.shopee.co.id/40enqkGbYI",
      "https://s.shopee.co.id/5LABRCgwhJ",
    ],
  },
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

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function idFrom(value) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 24);
}

function productSlug(category, link, index) {
  const code = link.split("/").pop();
  return slugify(`${category} produk baru ${index + 1} ${code}`);
}

const db = new Database(databasePath);
db.pragma("foreign_keys = ON");

const now = new Date().toISOString();

db.exec(`
  CREATE TABLE IF NOT EXISTS Category (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Product (
    id TEXT NOT NULL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    imageAlt TEXT NOT NULL,
    price INTEGER NOT NULL,
    originalPrice INTEGER NOT NULL,
    badge TEXT NOT NULL,
    discount TEXT NOT NULL,
    rating REAL NOT NULL,
    sold INTEGER NOT NULL,
    affiliateUrl TEXT NOT NULL,
    tagsJson TEXT NOT NULL DEFAULT '[]',
    isPromo INTEGER NOT NULL DEFAULT 0,
    isFlashSale INTEGER NOT NULL DEFAULT 0,
    isBestSeller INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 0,
    categoryId TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL,
    CONSTRAINT Product_categoryId_fkey FOREIGN KEY (categoryId)
      REFERENCES Category (id) ON DELETE RESTRICT ON UPDATE CASCADE
  );

  CREATE INDEX IF NOT EXISTS Product_published_idx ON Product(published);
  CREATE INDEX IF NOT EXISTS Product_categoryId_idx ON Product(categoryId);
  CREATE INDEX IF NOT EXISTS Product_createdAt_idx ON Product(createdAt);
  CREATE INDEX IF NOT EXISTS Product_rating_idx ON Product(rating);
  CREATE INDEX IF NOT EXISTS Product_sold_idx ON Product(sold);
`);

const upsertCategory = db.prepare(`
  INSERT INTO Category (id, name, createdAt, updatedAt)
  VALUES (@id, @name, @createdAt, @updatedAt)
  ON CONFLICT(name) DO UPDATE SET updatedAt = excluded.updatedAt
`);
const getCategory = db.prepare("SELECT id FROM Category WHERE name = ?");
const findProduct = db.prepare(`
  SELECT id FROM Product
  WHERE affiliateUrl = ? AND categoryId = ? AND title = 'Produk Baru'
  LIMIT 1
`);
const insertProduct = db.prepare(`
  INSERT INTO Product (
    id, slug, title, description, image, imageAlt, price, originalPrice, badge,
    discount, rating, sold, affiliateUrl, tagsJson, isPromo, isFlashSale,
    isBestSeller, published, categoryId, createdAt, updatedAt
  )
  VALUES (
    @id, @slug, @title, @description, @image, @imageAlt, @price, @originalPrice,
    @badge, @discount, @rating, @sold, @affiliateUrl, @tagsJson, @isPromo,
    @isFlashSale, @isBestSeller, @published, @categoryId, @createdAt, @updatedAt
  )
`);

const importProducts = db.transaction(() => {
  let inserted = 0;
  let skipped = 0;
  const categoryCounts = [];

  for (const group of groups) {
    const categoryId = `category-${slugify(group.category)}`;
    upsertCategory.run({
      id: categoryId,
      name: group.category,
      createdAt: now,
      updatedAt: now,
    });
    const category = getCategory.get(group.category);
    let groupInserted = 0;

    group.links.forEach((link, index) => {
      if (findProduct.get(link, category.id)) {
        skipped += 1;
        return;
      }

      insertProduct.run({
        id: `affiliate-${idFrom(`${group.category}|${link}|${index}`)}`,
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
        isPromo: 0,
        isFlashSale: 0,
        isBestSeller: 0,
        published: 1,
        categoryId: category.id,
        createdAt: now,
        updatedAt: now,
      });
      inserted += 1;
      groupInserted += 1;
    });

    categoryCounts.push({
      category: group.category,
      expected: group.links.length,
      inserted: groupInserted,
    });
  }

  return { inserted, skipped, categoryCounts };
});

const result = importProducts();
const totalRequested = groups.reduce((total, group) => total + group.links.length, 0);
const dbCounts = db
  .prepare(
    `SELECT Category.name AS category, COUNT(Product.id) AS total
     FROM Product
     JOIN Category ON Category.id = Product.categoryId
     WHERE Product.title = 'Produk Baru'
     GROUP BY Category.name
     ORDER BY Category.name`,
  )
  .all();

db.close();

console.log(`Requested links: ${totalRequested}`);
console.log(`Inserted products: ${result.inserted}`);
console.log(`Skipped existing placeholders: ${result.skipped}`);
console.log("Requested by category:");
for (const count of result.categoryCounts) {
  console.log(`- ${count.category}: ${count.expected} requested, ${count.inserted} inserted this run`);
}
console.log("Current Produk Baru in database by category:");
for (const count of dbCounts) {
  console.log(`- ${count.category}: ${count.total}`);
}
