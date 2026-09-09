"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Solid by default: only the home page's hero section can put the nav into
  // the transparent "over the hero" state, so every other route starts (and
  // stays) solid.
  const [overHero, setOverHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setOverHero(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOverHero(entry.isIntersecting);
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
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6 md:px-10">
        <Link href="/" className="tap-target">
          <Image
            src="/text-logo.png"
            alt="T.R. Fox Contracting"
            width={140}
            height={32}
            priority
          />
        </Link>

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
