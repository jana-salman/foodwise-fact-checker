import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Learn" },
  { to: "/analyze", label: "Analyze" },
  { to: "/research", label: "Research" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <Leaf className="h-5 w-5 text-primary" /> FoodWise
          </Link>
          <nav className="flex gap-1 text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
                className="rounded-full px-3 py-1.5 text-muted-foreground hover:bg-secondary"
                activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8">{children}</main>
      <footer className="border-t py-6 px-4 text-center text-xs text-muted-foreground">
        FoodWise is an educational screening tool, not a medical or scientific certification service.
        <br />AGSC 205 · American University of Beirut
      </footer>
    </div>
  );
}
