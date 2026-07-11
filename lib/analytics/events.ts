import { trackClarityEvent } from "@/lib/analytics/clarity";
import { trackGAEvent } from "@/lib/analytics/ga";
import { pushDataLayer } from "@/lib/analytics/gtm";
import {
  trackBannerClick,
  trackCategory,
  trackPurchaseIntent,
  trackSearch,
  trackShare,
  trackViewContent,
} from "@/lib/analytics/pixel";

type ProductTrackingData = {
  id?: string;
  slug?: string;
  title?: string;
  category?: string;
  price?: number;
  affiliateUrl?: string;
};

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );
}

function productParams(product: ProductTrackingData) {
  return cleanParams({
    content_ids: product.id ? [product.id] : undefined,
    content_name: product.title,
    content_category: product.category,
    item_id: product.slug || product.id,
    item_name: product.title,
    item_category: product.category,
    value: product.price,
    currency: "IDR",
    affiliate_url: product.affiliateUrl,
  });
}

function trackEverywhere(event: string, params: Record<string, unknown>) {
  trackGAEvent(event, params);
  pushDataLayer({ event, ...params });
  trackClarityEvent(event);
}

export function trackBuyClick(product: ProductTrackingData) {
  const params = productParams(product);

  trackEverywhere("click_buy", params);
  trackPurchaseIntent(params);
  trackViewContent(params);
}

export function trackProductShare(product: ProductTrackingData) {
  const params = productParams(product);

  trackEverywhere("share_product", params);
  trackShare(params);
}

export function trackProductSearch(searchTerm: string) {
  const term = searchTerm.trim();
  if (!term) return;

  const params = { search_term: term };

  trackEverywhere("search", params);
  trackSearch(params);
}

export function trackCategorySelect(category: string) {
  const params = { item_category: category };

  trackEverywhere("select_category", params);
  trackCategory(params);
}

export function trackPromotionSelect(product: ProductTrackingData) {
  const params = cleanParams({
    ...productParams(product),
    promotion_name: product.title,
  });

  trackEverywhere("select_promotion", params);
  trackBannerClick(params);
}
