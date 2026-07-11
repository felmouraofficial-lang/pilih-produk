export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

type PixelMethod = "init" | "track" | "trackCustom";

declare global {
  interface Window {
    fbq?: (method: PixelMethod, eventName: string, params?: Record<string, unknown>) => void;
  }
}

const standardEvents = new Set(["PageView", "ViewContent", "Search"]);

export function trackPixelEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq(standardEvents.has(eventName) ? "track" : "trackCustom", eventName, params);
}

export function trackViewContent(params: Record<string, unknown> = {}) {
  trackPixelEvent("ViewContent", params);
}

export function trackSearch(params: Record<string, unknown> = {}) {
  trackPixelEvent("Search", params);
}

export function trackPurchaseIntent(params: Record<string, unknown> = {}) {
  trackPixelEvent("ViewContent", params);
}

export function trackCategory(params: Record<string, unknown> = {}) {
  trackPixelEvent("ViewCategory", params);
}

export function trackShare(params: Record<string, unknown> = {}) {
  trackPixelEvent("Share", params);
}

export function trackBannerClick(params: Record<string, unknown> = {}) {
  trackPixelEvent("ViewPromotion", params);
}
