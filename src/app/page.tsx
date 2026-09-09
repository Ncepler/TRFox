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
    "High-end residential interiors in Manhattan. Two or three projects a year, run by Todd Fox himself.",
  openGraph: {
    title: "T.R. Fox Contracting",
    description:
      "High-end residential interiors in Manhattan. Two or three projects a year, run by Todd Fox himself.",
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
      {/* Hero */}
      <section className="relative">
        <picture>
          <source media="(min-width: 768px)" srcSet="/hero-desktop.jpg" />
          <Image
            src="/hero-mobile.jpg"
            alt="A prewar Manhattan interior mid-renovation"
            width={1080}
            height={1350}
            priority
            className="h-[70vh] w-full object-cover md:h-[85vh]"
          />
        </picture>
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:px-10">
          <h1 className="max-w-[16ch] font-display text-4xl font-medium tracking-[-0.03em] md:text-6xl">
            Two or three projects a year.
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg text-ink-soft md:text-xl">
            T.R. Fox Contracting builds high-end residential interiors in Manhattan. Todd Fox is
            on site every day of every one of them.
          </p>
          <Link
            href="/contact"
            className="tap-target mt-8 inline-block border-b border-accent font-display text-sm"
            style={{ color: "var(--color-accent)" }}
          >
            Start a conversation
          </Link>
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
              project&rsquo;s budget and its schedule are actually decided, and a firm that shows
              up after those are set is managing consequences instead of choices.
            </p>
            <p>
              Todd runs the site himself. Weekly meetings, daily calls, and one person who has the
              whole project in his head. There is no account manager between you and the person
              swinging the decisions.
            </p>
            <p>
              When a project is finished we do not disappear. Doors move, finishes settle,
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
            <Link href="/work" className="tap-target font-display text-sm" style={{ color: "var(--color-accent)" }}>
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
            Three or four inquiries become a project each year.
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg text-ink-soft">
            If you are an architect or a designer with something coming up, or a homeowner whose
            designer sent you here, call Todd directly.
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
