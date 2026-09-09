import type { Metadata } from "next";
import { email, mailingAddress } from "@/data/firm";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this site does and does not do with your information. It collects nothing beyond basic hosting analytics.",
  openGraph: {
    title: "Privacy — T.R. Fox Contracting",
    description:
      "What this site does and does not do with your information. It collects nothing beyond basic hosting analytics.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
      <h1 className="font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">
        Privacy
      </h1>

      <div className="mt-10 max-w-[62ch] space-y-10 text-lg">
        <p>
          This site does not have a database. It does not use cookies, and it does not run
          advertising or tracking scripts of any kind. There is no account to create and nothing
          to sign up for.
        </p>

        <div>
          <h2 className="font-display text-xl font-medium">Hosting</h2>
          <p className="mt-3 text-ink-soft">
            The site is hosted on Vercel. Vercel keeps basic, aggregated traffic logs, such as
            which pages were requested and roughly how often, so the site stays online and fast.
            We do not receive your name, your IP address, or any other identifying detail from
            this. It is the same kind of logging any web server keeps and is separate from
            advertising analytics, which this site does not run.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-medium">Calling or writing to us</h2>
          <p className="mt-3 text-ink-soft">
            The phone number and email address on this site open your own phone or mail
            application. Tapping either link does not send anything to us by itself and this
            site never sees the contents. If you go on to call or write, whatever you say is
            between you and Todd, kept only as long as an ordinary business conversation needs
            to be, and never sold or passed to anyone else.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-medium">Forms</h2>
          <p className="mt-3 text-ink-soft">
            There is no contact form on this site. Nothing you type here is stored, because
            there is nowhere on this site to type it.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-medium">Questions</h2>
          <p className="mt-3 text-ink-soft">
            Write to{" "}
            <a href={`mailto:${email}`} className="tap-target" style={{ color: "var(--color-accent)" }}>
              {email}
            </a>{" "}
            with any question about this policy. Our mailing address is {mailingAddress}.
          </p>
        </div>
      </div>
    </div>
  );
}
