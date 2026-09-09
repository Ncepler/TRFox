import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Full-service general contracting and construction management, tailored to each project's goals.",
  openGraph: {
    title: "About, T.R. Fox Contracting",
    description:
      "Full-service general contracting and construction management, tailored to each project's goals.",
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
            T.R. Fox Contracting, Inc. is a full service general contracting and construction
            management firm, dedicated to tailoring our capabilities and practice to your
            specific project goals. With over 10 years of experience in the industry, and a
            strong focus on personal relationships with our clients, we pride ourselves on being
            able to execute the most complicated of projects, without sacrificing the finest of
            details, which are the distinction of every design.
          </p>
          <p>
            We find great value in becoming involved at the inception of a project. Over the
            years we have worked with some of the most exceptional architects and designers in
            the city, consistently satisfying their expectations. Repeat business has allowed us
            the opportunity to collaborate with architects, designers, and/ or clients, in order
            to streamline the delivery of a project while providing comprehensive construction
            management services. We firmly believe that the preconstruction process is just as
            critical as the construction phase, as there is no substitute for proper planning.
          </p>
        </div>
      </section>
    </div>
  );
}
