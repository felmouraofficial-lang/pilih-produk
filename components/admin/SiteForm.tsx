"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import type { SiteContent } from "@/types/product";

type SiteFormProps = {
  site: SiteContent;
  mode: "banner" | "settings";
  saving: boolean;
  uploading: boolean;
  onUpload: (file: File) => Promise<string>;
  onSave: (site: Partial<SiteContent>) => Promise<void>;
};

const bannerFields: Array<keyof SiteContent> = [
  "heroTitle",
  "heroSubtitle",
  "heroCta",
  "heroImage",
];

const settingFields: Array<keyof SiteContent> = [
  "websiteName",
  "websiteDescription",
  "logo",
  "favicon",
  "footerText",
  "metaTitle",
  "metaDescription",
  "canonicalUrl",
  "openGraphImage",
  "googleAnalyticsId",
  "metaPixelId",
  "googleSearchConsoleVerification",
];

const labels: Record<keyof SiteContent, string> = {
  websiteName: "Website Name",
  websiteDescription: "Website Description",
  logo: "Logo",
  favicon: "Favicon",
  footerText: "Footer Text",
  metaTitle: "Meta Title",
  metaDescription: "Meta Description",
  canonicalUrl: "Canonical URL",
  openGraphImage: "Open Graph Image",
  googleAnalyticsId: "GA4 Measurement ID",
  metaPixelId: "Meta Pixel ID",
  googleSearchConsoleVerification: "Google Search Console Verification",
  heroTitle: "Hero Title",
  heroSubtitle: "Hero Subtitle",
  heroCta: "Button CTA",
  heroImage: "Hero Image",
};

export default function SiteForm({ site, mode, saving, uploading, onUpload, onSave }: SiteFormProps) {
  const fields = mode === "banner" ? bannerFields : settingFields;
  const [form, setForm] = useState<SiteContent>(site);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave(Object.fromEntries(fields.map((field) => [field, form[field]])));
  }

  async function upload(field: keyof SiteContent, file?: File) {
    if (!file) return;
    const url = await onUpload(file);
    setForm((current) => ({ ...current, [field]: url }));
  }

  return (
    <form onSubmit={submit} className="rounded-[8px] bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-[#FF6A00]">
        {mode === "banner" ? "Banner CMS" : "Pengaturan Website"}
      </p>
      <h2 className="mt-1 text-xl font-black text-neutral-950">
        {mode === "banner" ? "Edit Hero Homepage" : "Edit Identitas dan Tracking"}
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const isLong = field.includes("Description") || field === "footerText" || field === "heroSubtitle";
          const isImage = ["logo", "favicon", "openGraphImage", "heroImage"].includes(field);
          return (
            <label key={field} className={isLong ? "block md:col-span-2" : "block"}>
              <span className="text-xs font-black uppercase text-neutral-500">{labels[field]}</span>
              {isLong ? (
                <textarea
                  value={form[field]}
                  onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-[8px] border border-black/10 px-3 py-3 text-sm leading-6 outline-none focus:border-[#FF6A00]"
                />
              ) : (
                <input
                  value={form[field]}
                  onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-[8px] border border-black/10 px-3 text-sm outline-none focus:border-[#FF6A00]"
                />
              )}
              {isImage ? (
                <div className="mt-2 grid gap-2">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => void upload(field, event.target.files?.[0])}
                    className="text-sm font-semibold"
                  />
                  {form[field] ? (
                    <div className="relative h-28 overflow-hidden rounded-[8px] bg-neutral-100">
                      <Image src={form[field]} alt={labels[field]} fill sizes="240px" className="object-contain" />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </label>
          );
        })}
      </div>

      <button
        disabled={saving || uploading}
        className="mt-5 rounded-full bg-[#FF6A00] px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-950 disabled:opacity-60"
      >
        {saving ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
