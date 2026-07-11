"use client";

type ToastProps = {
  message: string;
  tone?: "success" | "error";
  onClose: () => void;
};

export default function Toast({ message, tone = "success", onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-[8px] bg-white p-4 text-sm font-bold shadow-2xl">
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 size-2 rounded-full ${
            tone === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}
        />
        <p className="text-neutral-800">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-neutral-400 transition hover:text-neutral-950"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
