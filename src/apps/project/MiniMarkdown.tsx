import type { ReactNode } from "react";

/** Render minimo de markdown: headings, listas, negrita, enlaces, citas y bloques de codigo.
 * No es un parser completo — cubre lo que aparece en un README tipico. */
export function MiniMarkdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  function inline(text: string): (string | ReactNode)[] {
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
    return parts.map((part, idx) => {
      const bold = part.match(/^\*\*([^*]+)\*\*$/);
      if (bold) return <strong key={idx} className="text-jos-text">{bold[1]}</strong>;
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link)
        return (
          <a
            key={idx}
            href={link[2]}
            target="_blank"
            rel="noreferrer"
            className="text-jos-cyan underline underline-offset-2 hover:text-jos-amber"
          >
            {link[1]}
          </a>
        );
      return part;
    });
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre
          key={key++}
          className="my-2 overflow-x-auto rounded-lg border border-jos-border bg-jos-bg-deep p-3 font-mono text-[11px] leading-relaxed text-jos-text-dim"
        >
          {code.join("\n")}
        </pre>
      );
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s/, "");
      const cls =
        level === 1
          ? "mt-4 mb-2 font-mono text-[15px] text-jos-amber"
          : level === 2
            ? "mt-4 mb-1.5 font-mono text-[13px] text-jos-amber"
            : "mt-3 mb-1 font-mono text-[12px] text-jos-cyan";
      blocks.push(
        <p key={key++} className={cls}>
          {inline(text)}
        </p>
      );
      i += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push(
        <p
          key={key++}
          className="my-2 border-l-2 border-jos-amber-dim pl-3 text-[12px] italic text-jos-text-dim"
        >
          {inline(line.replace(/^>\s/, ""))}
        </p>
      );
      i += 1;
      continue;
    }

    if (/^-\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s/, ""));
        i += 1;
      }
      blocks.push(
        <ul key={key++} className="my-1.5 list-disc space-y-1 pl-5 text-[12px] text-jos-text">
          {items.map((it, idx) => (
            <li key={idx}>{inline(it)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    blocks.push(
      <p key={key++} className="my-1.5 text-[12px] leading-relaxed text-jos-text">
        {inline(line)}
      </p>
    );
    i += 1;
  }

  return <div>{blocks}</div>;
}
