import Link from "next/link";
import { phone, phoneHref, email, emailHref, locationLine } from "@/data/firm";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="font-display text-sm">
            <p>T.R. Fox Contracting</p>
            <p className="text-ink-soft">{locationLine}</p>
          </div>

          <div className="flex flex-col gap-1 font-display text-sm">
            <a href={phoneHref} className="tap-target">
              {phone}
            </a>
            <a href={emailHref} className="tap-target">
              {email}
            </a>
          </div>

          <nav aria-label="Footer" className="font-display text-sm">
            <ul className="flex gap-6">
              <li>
                <Link href="/projects" className="tap-target">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="tap-target">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="tap-target">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="tap-target">
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-8 text-xs text-ink-soft">
          Site by{" "}
          <a href="https://vilas.studio" className="tap-target underline underline-offset-2">
            vilas.studio
          </a>
        </p>
      </div>
    </footer>
  );
}
