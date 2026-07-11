"use client";

import { formatCurrency } from "@/lib/format";
import type { AdminDashboard as AdminDashboardType } from "@/types/product";

type AdminDashboardProps = {
  dashboard: AdminDashboardType;
};

export default function AdminDashboard({ dashboard }: AdminDashboardProps) {
  const stats = [
    ["Total Produk", dashboard.totalProducts],
    ["Publish", dashboard.publishedProducts],
    ["Draft", dashboard.draftProducts],
    ["Kategori", dashboard.totalCategories],
  ];

  return (
    <section className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-[8px] bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase text-neutral-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-neutral-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardList
          title="Produk Terbaru"
          products={dashboard.latestProducts}
          value={(product) => product.category}
        />
        <DashboardList
          title="Produk Terlaris"
          products={dashboard.bestSellerProducts}
          value={(product) => `${product.sold.toLocaleString("id-ID")} terjual`}
        />
        <DashboardList
          title="Produk Diskon"
          products={dashboard.discountedProducts}
          value={(product) => `${product.discount || "Promo"} - ${formatCurrency(product.price)}`}
        />
      </div>
    </section>
  );
}

function DashboardList({
  title,
  products,
  value,
}: {
  title: string;
  products: AdminDashboardType["latestProducts"];
  value: (product: AdminDashboardType["latestProducts"][number]) => string;
}) {
  return (
    <div className="rounded-[8px] bg-white p-4 shadow-sm">
      <h2 className="text-base font-black text-neutral-950">{title}</h2>
      <div className="mt-3 grid gap-3">
        {products.length === 0 ? (
          <p className="text-sm font-semibold text-neutral-500">Belum ada produk.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="min-w-0 border-t border-black/5 pt-3">
              <p className="truncate text-sm font-black text-neutral-900">
                {product.title}
              </p>
              <p className="mt-1 text-xs font-bold text-neutral-500">{value(product)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
