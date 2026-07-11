/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require("better-sqlite3");
const path = require("node:path");
const products = require("../data/products.json");
const categories = require("../data/categories.json");

const databasePath = path.join(process.cwd(), "prisma", "dev.db");
const db = new Database(databasePath);

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const now = new Date().toISOString();

db.pragma("foreign_keys = ON");

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
    CONSTRAINT Product_categoryId_fkey
      FOREIGN KEY (categoryId) REFERENCES Category (id)
      ON DELETE RESTRICT ON UPDATE CASCADE
  );

  CREATE INDEX IF NOT EXISTS Product_published_idx ON Product(published);
  CREATE INDEX IF NOT EXISTS Product_categoryId_idx ON Product(categoryId);
  CREATE INDEX IF NOT EXISTS Product_createdAt_idx ON Product(createdAt);
  CREATE INDEX IF NOT EXISTS Product_rating_idx ON Product(rating);
  CREATE INDEX IF NOT EXISTS Product_sold_idx ON Product(sold);
`);

const insertCategory = db.prepare(`
  INSERT INTO Category (id, name, createdAt, updatedAt)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(name) DO UPDATE SET updatedAt = excluded.updatedAt
`);

const getCategory = db.prepare("SELECT id FROM Category WHERE name = ?");

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
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    description = excluded.description,
    image = excluded.image,
    imageAlt = excluded.imageAlt,
    price = excluded.price,
    originalPrice = excluded.originalPrice,
    badge = excluded.badge,
    discount = excluded.discount,
    rating = excluded.rating,
    sold = excluded.sold,
    affiliateUrl = excluded.affiliateUrl,
    tagsJson = excluded.tagsJson,
    isPromo = excluded.isPromo,
    isFlashSale = excluded.isFlashSale,
    isBestSeller = excluded.isBestSeller,
    published = excluded.published,
    categoryId = excluded.categoryId,
    updatedAt = excluded.updatedAt
`);

const seed = db.transaction(() => {
  const categoryNames = Array.from(
    new Set([...categories, ...products.map((product) => product.category)]),
  );

  for (const name of categoryNames) {
    insertCategory.run(`category-${slugify(name)}`, name, now, now);
  }

  for (const product of products) {
    const category = getCategory.get(product.category);
    if (!category) continue;

    insertProduct.run({
      id: product.id,
      slug: slugify(product.title),
      title: product.title,
      description: product.description,
      image: product.image,
      imageAlt: product.imageAlt || product.title,
      price: Number(product.price),
      originalPrice: Number(product.originalPrice),
      badge: product.badge,
      discount: product.discount,
      rating: Number(product.rating),
      sold: Number(product.sold),
      affiliateUrl: product.affiliateUrl,
      tagsJson: JSON.stringify(product.tags || []),
      isPromo: product.isPromo ? 1 : 0,
      isFlashSale: product.isFlashSale ? 1 : 0,
      isBestSeller: product.isBestSeller ? 1 : 0,
      published: product.published ? 1 : 0,
      categoryId: category.id,
      createdAt: product.createdAt || now,
      updatedAt: product.updatedAt || now,
    });
  }
});

seed();
db.close();

console.log(`Seeded ${products.length} products into ${databasePath}`);
