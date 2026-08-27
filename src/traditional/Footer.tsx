import { profile } from "../data/profile";

export function Footer() {
  return (
    <footer className="border-t border-jos-border px-5 py-8 text-center">
      <p className="font-mono text-[11px] text-jos-text-dim">
        {profile.name} · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
