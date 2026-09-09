import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Todd Fox started T.R. Fox Contracting in 2003. Fourth-generation builder, small permanent crew, a deliberate ceiling of two or three projects at a time.",
  openGraph: {
    title: "About, T.R. Fox Contracting",
    description:
      "Todd Fox started T.R. Fox Contracting in 2003. Fourth-generation builder, small permanent crew, a deliberate ceiling of two or three projects at a time.",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
      <section>
        <h1 className="max-w-[16ch] font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">
          T.R. Fox Contracting
        </h1>
        <div className="mt-10 max-w-[62ch] space-y-6 text-lg">
          <p>
            Todd Fox is the fourth generation of his family to build for a living. He started
            T.R. Fox Contracting in 2003 and has run it the same way since: a small permanent
            crew, a subcontractor network he has worked with for years, and a deliberate ceiling
            of two or three projects at a time.
          </p>
          <p>
            The ceiling is the point. It is what makes it possible for one person to be on every
            site every day, to question a detail on a drawing before it becomes a problem in a
            wall, and to know a building well enough to come back to it years later.
          </p>
          <p>
            The work is high-end residential interiors, mostly gut renovations of prewar
            apartments, penthouses and lofts in Manhattan. Marble slab bathrooms, custom millwork,
            structural work, roof decks, home automation, specialty finishes. Complicated projects
            where the details are the design.
          </p>
          <p>Most of it comes through architects and interior designers who have used us before.</p>
        </div>
      </section>

      <section className="mt-20 border-t border-line pt-16 md:mt-28 md:pt-24">
        <h2 className="font-display text-2xl font-medium tracking-[-0.03em] md:text-3xl">
          Working with us
        </h2>
        <dl className="mt-10 grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
          <div>
            <dt className="font-display text-lg font-medium">Before the drawings are final.</dt>
            <dd className="mt-2 max-w-[48ch] text-ink-soft">
              We price and plan a project while it can still change cheaply. Bringing a contractor
              in at the end of design is how budgets get discovered rather than decided.
            </dd>
          </div>
          <div>
            <dt className="font-display text-lg font-medium">One person, on site.</dt>
            <dd className="mt-2 max-w-[48ch] text-ink-soft">
              Todd runs each job himself. You will not be handed to someone else after the
              contract is signed.
            </dd>
          </div>
          <div>
            <dt className="font-display text-lg font-medium">We question the drawing.</dt>
            <dd className="mt-2 max-w-[48ch] text-ink-soft">
              If a detail is going to fail, the time to say so is before it is built, even when it
              means a difficult conversation with a firm we respect.
            </dd>
          </div>
          <div>
            <dt className="font-display text-lg font-medium">We come back.</dt>
            <dd className="mt-2 max-w-[48ch] text-ink-soft">
              Maintenance visits years after handover are part of how we work, not a favor.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
