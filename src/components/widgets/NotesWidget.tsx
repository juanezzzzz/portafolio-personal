import { useEffect, useState } from "react";

const KEY = "jos-quick-notes";

export function NotesWidget() {
  const [text, setText] = useState(() => localStorage.getItem(KEY) ?? "");

  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem(KEY, text), 300);
    return () => clearTimeout(id);
  }, [text]);

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="notas rapidas..."
      rows={4}
      className="w-full resize-none rounded-lg border border-jos-border bg-jos-bg-deep p-1.5 font-mono text-[11px] text-jos-text outline-none focus:border-jos-amber"
    />
  );
}
