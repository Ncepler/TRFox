import Link from "next/link";
import { phone, phoneHref, email, emailHref, locationLine } from "@/data/firm";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 md:flex-row md:items-start md:justify-between md:px-10">
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
              <Link href="/work" className="tap-target">
                Work
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
    </footer>
  );
}
