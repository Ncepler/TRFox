"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Runs before paint so the header never shows a frame in the wrong state.
// React warns if useLayoutEffect is called during SSR, so fall back to
// useEffect on the server, where a layout effect would be a no-op anyway.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Only the home page has a hero to sit over, and it's always at the very
  // top of that page, so we know the correct state before the
  // IntersectionObserver below ever runs. Seeding it here (rather than
  // starting false and waiting for the observer's first callback) means the
  // server-rendered HTML itself already has the mobile logo hidden, instead
  // of it flashing visible for a moment on every load. This initializer only
  // runs on first mount though; the layout effect below is what keeps it
  // right across client-side navigation, since Nav lives in the layout and
  // never remounts.
  const [overHero, setOverHero] = useState(pathname === "/");

  useIsomorphicLayoutEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setOverHero(false);
      return;
    }

    // Measure the hero directly, before paint. Navigating back to the home
    // page does not remount Nav, so the useState initializer above does not
    // re-run and overHero is still stale-false from the previous route. The
    // observer can't rescue it either, because its one synchronous first
    // callback is deliberately skipped below, which left the header solid and
    // the mobile logo sitting on the hero headline until the next scroll.
    const rect = hero.getBoundingClientRect();
    setOverHero(rect.bottom > 0 && rect.top < window.innerHeight);

    // The observer's own first callback fires synchronously on observe(),
    // reporting intersection at that exact instant. On some mobile browsers
    // the address bar is still collapsing/expanding at that point, so the
    // viewport used for that first measurement can be momentarily wrong,
    // flipping overHero to false right after load even though we already
    // know (from pathname, seeded above) that we start over the hero. Skip
    // that first, redundant callback and only act on real changes from here.
    let skippedFirstCallback = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!skippedFirstCallback) {
          skippedFirstCallback = true;
          return;
        }
        // Belt and suspenders: never let a not-intersecting reading reveal
        // the logo while we're still genuinely near the top of the page.
        // Only a real scroll away from the hero should do that.
        setOverHero(entry.isIntersecting || window.scrollY < 50);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-200 ${
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line bg-canvas"
      }`}
    >
      {/* Pinned to the header's true left edge, independent of the centered
          max-w-5xl container below, so its position doesn't drift with the
          container's own auto-centering margin at in-between viewport widths.
          On mobile, hidden while over the hero: at that width it sits right
          on top of the hero headline, so it waits until the nav goes solid. */}
      <Link
        href="/"
        className={`tap-target absolute left-3 top-1/2 -translate-y-1/2 ${
          overHero ? "hidden md:block" : "block"
        }`}
      >
        <Image
          src="/text-logo.png"
          alt="T.R. Fox Contracting"
          width={140}
          height={32}
          priority
        />
      </Link>

      <div className="mx-auto flex h-full max-w-5xl items-center justify-end px-6 md:px-10">
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex gap-8 font-display text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="tap-target"
                    style={active ? { color: "var(--color-accent)" } : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="tap-target font-display text-sm md:hidden"
          style={overHero ? { filter: "drop-shadow(0 1px 3px var(--color-ink))" } : undefined}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="absolute inset-x-0 top-full border-b border-line bg-canvas md:hidden"
        >
          <ul className="flex flex-col gap-1 px-6 pb-5 font-display text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="tap-target block py-2"
                    style={active ? { color: "var(--color-accent)" } : undefined}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
