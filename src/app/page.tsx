import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProjectEntry from "@/components/ProjectEntry";
import { projects } from "@/data/projects";
import { press } from "@/data/press";
import { phone, phoneHref, email, emailHref, foundingYear } from "@/data/firm";

const siteUrl = "https://trfoxcontracting.com";

export const metadata: Metadata = {
  title: "T.R. Fox Contracting",
  description:
    "Full-service general contracting and construction management for high-end residential interiors in Manhattan.",
  openGraph: {
    title: "T.R. Fox Contracting",
    description:
      "Full-service general contracting and construction management for high-end residential interiors in Manhattan.",
    url: siteUrl,
    type: "website",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "T.R. Fox Contracting",
  telephone: phone,
  email,
  areaServed: "New York, NY",
  foundingDate: String(foundingYear),
  url: siteUrl,
};

const selectedIds = [
  "lincoln-square",
  "union-square-west",
  "midtown",
  "central-park-west",
  "garment-district",
  "67th-street",
];

const selectedWork = selectedIds
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      {/* Hero. The photo keeps a fixed, sane crop (h-[70vh] mobile, full
          viewport on desktop) no matter how much text there is -- it never
          stretches or zooms in to chase the text block's height. Image and
          text are stacked in the same CSS grid cell rather than overlaid
          with an absolute position or a negative margin: a grid track
          sizes to the tallest item in it, so the section's real height is
          always correct (a negative-margin version of this collapsed to
          the text's height whenever the photo was taller, e.g. a short
          headline against a full-viewport desktop photo, which let the
          next section's opaque background paint over the still-taller
          photo). On a narrow phone where the text needs more room than
          the photo, it now correctly continues past it onto the plain
          canvas instead of overflowing into the next section. */}
      <section id="hero" className="relative -mt-20 grid">
        <div className="relative col-start-1 row-start-1 h-[70vh] md:h-screen">
          <picture>
            <source media="(min-width: 768px)" srcSet="/hero-desktop.jpg" />
            <Image
              src="/hero-mobile.jpg"
              alt="A trowel finishing a plaster wall mid-renovation"
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </picture>
        </div>
        <div className="relative col-start-1 row-start-1 self-start">
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:px-10 md:pb-20 md:pt-16">
            <h1 className="max-w-[20ch] font-display text-4xl font-medium tracking-[-0.03em] text-ink md:text-6xl">
              T.R. Fox Contracting
            </h1>
            <p className="mt-6 max-w-[48ch] text-lg text-ink md:text-xl">
              We work with architects and designers across Manhattan, most of them more than once,
              and we&rsquo;re on site for the whole thing ourselves.
            </p>
            <Link
              href="/contact"
              className="tap-target mt-8 inline-block border-b border-accent font-display text-sm"
              style={{ color: "var(--color-accent)" }}
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </section>

      {/* How the work runs */}
      <section className="border-t border-line bg-canvas-deep">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 md:grid-cols-[1fr_2fr] md:px-10 md:py-24">
          <h2 className="font-display text-2xl font-medium tracking-[-0.03em] md:text-3xl">
            How the work runs
          </h2>
          <div className="max-w-[62ch] space-y-6 text-lg">
            <p>
              We want to be in the room before the drawings are final. Preconstruction is where a
              project&rsquo;s budget and its schedule get decided, and showing up after those are
              set means managing consequences instead of choices.
            </p>
            <p>
              Todd Fox runs the site himself, day to day, with a small crew and a subcontractor
              network we&rsquo;ve worked with for years. Weekly meetings, daily calls, one person
              who has the whole project in his head.
            </p>
            <p>
              When a project is finished we don&rsquo;t disappear. Doors move, finishes settle,
              buildings shift. We come back.
            </p>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-medium tracking-[-0.03em] md:text-3xl">
                Selected work
              </h2>
              <p className="mt-3 max-w-[48ch] text-ink-soft">
                Twenty-three years of interiors, most of them within a few blocks of each other.
              </p>
            </div>
            <Link href="/projects" className="tap-target font-display text-sm" style={{ color: "var(--color-accent)" }}>
              All projects
            </Link>
          </div>

          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
            {selectedWork.map((project) => (
              <ProjectEntry key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Published */}
      <section className="border-t border-line bg-canvas-deep">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <h2 className="font-display text-2xl font-medium tracking-[-0.03em] md:text-3xl">
            Published
          </h2>
          <ul className="mt-8 divide-y divide-line border-t border-line">
            {press.map((entry) => (
              <li key={entry.publication} className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:justify-between">
                <span className="font-display text-base font-medium">{entry.publication}</span>
                <span className="text-ink-soft md:text-right">
                  {entry.date ? `${entry.date}. ` : ""}
                  {entry.citation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <h2 className="max-w-[20ch] font-display text-2xl font-medium tracking-[-0.03em] md:text-3xl">
            Get in touch
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg text-ink-soft">
            If you&rsquo;re an architect or a designer with something coming together, or a
            homeowner whose designer sent you here, reach out directly. We&rsquo;re glad to talk
            through what you have in mind before anything is set in stone.
          </p>
          <div className="mt-8 flex flex-col gap-2 font-display text-lg">
            <a href={phoneHref} className="tap-target" style={{ color: "var(--color-accent)" }}>
              {phone}
            </a>
            <a href={emailHref} className="tap-target" style={{ color: "var(--color-accent)" }}>
              {email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
