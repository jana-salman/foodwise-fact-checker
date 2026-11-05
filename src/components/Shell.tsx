import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Leaf, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
  { to: "/learn", label: "Learn" },
  { to: "/about", label: "About" },
] as const;

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 font-display text-xl font-semibold">
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl ${light ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary text-primary-foreground"}`}
      >
        <Leaf className="h-5 w-5" aria-hidden />
      </span>
      FoodWise
    </span>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Close the mobile menu when the page changes, and lock page scroll while it is open.
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link to="/" aria-label="FoodWise home" className="text-foreground">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {path !== "/analyze" && (
              <Link
                to="/analyze"
                className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-forest md:inline-flex"
              >
                Check an Answer <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-menu"
            className="fw-page absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] bg-background px-5 pb-8 pt-4 md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: true }}
                  className="rounded-2xl px-5 py-4 font-display text-2xl font-semibold text-foreground transition-colors hover:bg-secondary"
                  activeProps={{ className: "bg-secondary" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            {path !== "/analyze" && (
              <Link
                to="/analyze"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground"
              >
                Check an Answer <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            )}
          </div>
        )}
      </header>

      <main id="main" key={path} className="fw-page flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-muted/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="text-foreground">
              <Logo />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Think Before You Trust AI.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-foreground">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-border px-5 py-5 text-center text-xs text-muted-foreground">
          FoodWise is an educational screening tool. It is not medical advice and does not replace a
          doctor, dietitian, or the product label.
        </div>
      </footer>
    </div>
  );
}
