export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

type DataLayerEvent = Record<string, unknown> & { event?: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function pushDataLayer(event: DataLayerEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}
