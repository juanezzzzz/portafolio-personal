import { ChevronLeft, ChevronRight } from "lucide-react";

export function GalleryTab({
  projectName,
  screenshots,
  index,
  setIndex,
}: {
  projectName: string;
  screenshots: string[];
  index: number;
  setIndex: (fn: (i: number) => number) => void;
}) {
  if (!screenshots.length) {
    return <p className="p-4 font-mono text-[12px] text-jos-text-dim">Sin capturas todavía.</p>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-center justify-center bg-jos-bg-deep p-4">
        <img
          src={screenshots[index]}
          alt={`${projectName} screenshot ${index + 1}`}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full rounded-lg border border-jos-border object-contain"
        />
      </div>
      <div className="flex items-center justify-center gap-3 border-t border-jos-border p-2">
        <button
          onClick={() => setIndex((i) => (i - 1 + screenshots.length) % screenshots.length)}
          className="text-jos-text-dim hover:text-jos-amber"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-mono text-[11px] text-jos-text-dim">
          {index + 1} / {screenshots.length}
        </span>
        <button
          onClick={() => setIndex((i) => (i + 1) % screenshots.length)}
          className="text-jos-text-dim hover:text-jos-amber"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
