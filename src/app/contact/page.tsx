import type { Metadata } from "next";
import { phone, phoneHref, email, emailHref, locationLine } from "@/data/firm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call or write to T.R. Fox Contracting. New York, NY, by appointment.",
  openGraph: {
    title: "Contact, T.R. Fox Contracting",
    description:
      "Call or write to T.R. Fox Contracting. New York, NY, by appointment.",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
      <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
        <h1 className="font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">
          Contact
        </h1>
        <div className="max-w-[48ch] space-y-6 text-lg">
          <p>
            If you&rsquo;re working on something and want to know whether it&rsquo;s a fit, the
            fastest way to find out is a call. If you&rsquo;d rather write, send the drawings or a
            description of the space and the rough timeline you&rsquo;re working against.
          </p>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-line pt-10 font-display text-2xl font-medium md:text-3xl">
        <a href={phoneHref} className="tap-target w-fit" style={{ color: "var(--color-accent)" }}>
          {phone}
        </a>
        <a href={emailHref} className="tap-target w-fit" style={{ color: "var(--color-accent)" }}>
          {email}
        </a>
        <p className="text-lg font-normal text-ink-soft md:text-xl">{locationLine}</p>
      </div>
    </div>
  );
}
