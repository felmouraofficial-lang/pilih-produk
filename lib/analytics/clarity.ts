export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export function trackClarityEvent(eventName: string) {
  if (typeof window === "undefined" || !window.clarity) return;
  window.clarity("event", eventName);
}
