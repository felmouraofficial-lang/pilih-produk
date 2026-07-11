import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#111111",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        <div style={{ color: "#FF6A00", fontSize: 28, fontWeight: 800 }}>
          Affiliate Shopee Discovery
        </div>
        <div style={{ marginTop: 24, maxWidth: 880, fontSize: 78, fontWeight: 900, lineHeight: 0.96 }}>
          Shopee Pilihan
        </div>
        <div style={{ marginTop: 24, maxWidth: 760, fontSize: 30, lineHeight: 1.35, color: "#d4d4d4" }}>
          Rekomendasi produk premium, promo harian, dan link affiliate Shopee dalam satu landing page.
        </div>
      </div>
    ),
    size,
  );
}
