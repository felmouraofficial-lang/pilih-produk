"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
};

export default function SearchBar({ value, onChange, compact = false }: SearchBarProps) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">Cari produk</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m21 21-4.3-4.3" />
        <circle cx="11" cy="11" r="8" />
      </svg>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari skincare, fashion, elektronik..."
        className={`w-full rounded-full border border-black/10 bg-white/90 pl-12 pr-4 text-sm font-medium text-neutral-900 shadow-sm outline-none transition focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/10 ${
          compact ? "h-11" : "h-14"
        }`}
      />
    </label>
  );
}
