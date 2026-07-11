"use client";

type CategorySliderProps = {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
};

export default function CategorySlider({
  categories,
  activeCategory,
  onChange,
}: CategorySliderProps) {
  const items = ["Semua", ...categories];

  return (
    <section id="kategori" className="border-y border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-1">
          {items.map((category) => {
            const active = category === activeCategory;

            return (
              <button
                key={category}
                onClick={() => onChange(category)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-extrabold transition ${
                  active
                    ? "bg-[#FF6A00] text-white shadow-[0_12px_28px_rgba(255,106,0,0.25)]"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-950 hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
