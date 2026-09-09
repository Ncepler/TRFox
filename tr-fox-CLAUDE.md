# CLAUDE.md — T.R. Fox Contracting

Client site built by Vilas Studio. Next.js 15 App Router · TypeScript · Tailwind v4 · Vercel.
No database, no CMS, no auth. Content lives in typed files under `src/data/`.

---

# 1. Who this site is for

T.R. Fox Contracting is a boutique general contracting and construction management firm in
Manhattan, founded 2003 by **Todd Fox**. High-end residential interiors: gut renovations of
prewar apartments, penthouses, and lofts, typically $200k–$500k.

**The visitor is an architect or an interior designer**, not a homeowner searching Google. They
already know what a good GC is worth. They are checking whether Todd is real, whether the work
is at their level, and whether he is someone they can put in front of their client. A second
visitor is that client, sent by the designer.

Nobody arrives here by accident. The site is a credential, not a lead funnel. Never write
copy that tries to close a stranger.

---

# 2. The premise

**Two or three projects a year.**

That single fact is the whole site. It is why Todd is on site every day, why he takes calls
himself, why the preconstruction is real, and why he comes back years later to fix a door that
sticks. Scarcity as a method, not a boast.

Every section serves that idea. If a section does not, it does not belong on the page.

---

# 3. Voice

Restrained, precise, unhurried. A builder talking to an architect, as equals. Short declarative
sentences. Concrete nouns. No adjectives doing work that a fact could do.

**Never:** "passionate," "dedicated," "attention to detail," "your vision, our expertise,"
"unparalleled," "craftsmanship" as a standalone noun, "seamless," "elevate," "leverage,"
"solutions," "state-of-the-art," "we pride ourselves."

**Never** invent a number, a client name, a testimonial, or a rating. Every fact on this site
traces to §7 or to something Todd confirmed in writing.

**Never** use an em dash anywhere in shipped copy. Commas and periods.

**Never** the word "template" in anything a visitor or Todd can read. The word is "style."

Say "we" for the firm. Say "Todd" when the sentence is about the person, which it often is.

---

# 4. Design system

One direction, pulled from the material world of a prewar Manhattan interior mid-renovation:
**dry plaster, oiled oak, and the green of oxidized copper.** That last one is not decoration.
Copper cornices going green is the defining color of the buildings this firm works inside, and
Todd's rooftop-garden press feature literally sits among them.

## Tokens

```css
:root{
  --canvas:      #E9E7E2;  /* dry plaster. never #fff, never cream-yellow */
  --canvas-deep: #DEDBD4;  /* recessed bands, alternating sections */
  --ink:         #191714;  /* warm off-black. all body and display type */
  --ink-soft:    #55504A;  /* secondary text, captions, meta */
  --line:        #C9C4BB;  /* hairlines, dimension lines, borders */
  --accent:      #2E4A47;  /* oxidized copper. CTA, focus ring, dimension ticks */
  --accent-hover:#233A37;
}
```

`--accent` appears in **four places only**: the primary call to action, `:focus-visible` rings,
the tick marks on the dimension line, and the active nav item. An accent that is everywhere is
not an accent.

Contrast check that must hold: `--ink` on `--canvas` is roughly 13:1. `--ink-soft` on `--canvas`
is roughly 6.5:1. `--line` fails for interactive borders, so interactive borders use `--ink-soft`.

## Type

| Role | Face | Weights | Notes |
|---|---|---|---|
| Display | **Schibsted Grotesk** | 400, 500 | Tracking `-0.03em` at display sizes. Generous leading. |
| Body | **Newsreader** | 300, 400 | Optical-size variable. `line-height: 1.65`, measure capped at `62ch` on the text element itself, never on a container. |
| Small labels | **Schibsted Grotesk** 500 | | Sentence case. |

Both from Google Fonts via `next/font/google`, subset to the weights above, nothing more.

**No monospace anywhere.** **No all-caps labels anywhere.** **No tracked-out eyebrow above a
heading.** These three are the fastest tells that a page was generated, and they are banned on
this site regardless of how well they seem to fit.

## The signature: the dimension line

Every project on this site is defined by a square footage. In a drawing set, a dimension is
marked by a thin rule terminated at both ends by a 45-degree tick, with the measurement floating
above it. That is the one device this site owns.

Each project entry carries a `<DimensionLine>`: a 1px `--line` rule spanning the entry's column
width, terminated at both ends by 45-degree ticks in `--accent`, with the square footage set
above it in Schibsted Grotesk 500 at small size. On scroll into view, the rule draws itself from
the center outward over 700ms with `cubic-bezier(0.22, 1, 0.36, 1)`, then the ticks fade in.
`prefers-reduced-motion` shows the final state immediately with no animation.

This is where the entire boldness budget is spent. Everything else on the page stays quiet so it
reads. No card grids, no shadow, no hover lifts, no gradient anything.

## Layout

- Left-aligned throughout. Nothing centered except the nav on mobile.
- Projects are identified by **address**, set at display size. `68 East 86th Street` means
  something specific to this audience; "Luxury UES Renovation" means nothing to anyone.
- No two adjacent sections share a skeleton. If two neighbors both open heading-then-paragraph
  over the same grid, reshape one.
- Generous vertical rhythm. This firm does three projects a year; the page should not feel busy.

## Banned looks

Cream canvas with a high-contrast serif display and a terracotta accent. Near-black with acid
green. Broadsheet hairline brutalism with zero radius and dense columns. Identical rounded cards
with the same soft grey shadow. Any of these appearing in a build is a bug, not a style choice.

---

# 5. The photography problem, and the rule that follows from it

Todd has **no usable project photographs available**. His site's images are 2012 thumbnails and
his press is locked in PDFs.

**Therefore: the site must be complete and beautiful with zero project photographs.** The project
entries are typographic. The dimension line, the address, and the scope prose carry them. There
are no empty image frames, no grey placeholder boxes, and no "photo coming soon."

The one photographic element is the hero. Everything else is type and space.

When Todd's photo library arrives, `ProjectEntry` gains an optional `image` field and the entry
grows a photograph above the address. Nothing else changes. Build for that.

---

# 6. Structure

| Route | Purpose |
|---|---|
| `/` | Premise, method, selected work (6), press, contact |
| `/work` | Every project on record, grouped |
| `/about` | Todd, the firm, how a project actually runs |
| `/contact` | Phone, email, how an inquiry works |
| `/privacy` | Privacy policy. Required. |

**No contact form.** A firm taking two or three projects a year wants a phone call or a real
email from a named person, not a lead-capture widget. `/contact` gives a `tel:` link, a `mailto:`
link, and two sentences on what to send. This also means no backend, no spam handling, and no
Supabase.

Data lives in `src/data/projects.ts` and `src/data/press.ts`, both typed, both the single source
of truth. Never hardcode a project into a component.

---

# 7. Facts — the only things that may appear on this site

Everything below is verified. Anything not below does not go on the site.

- Founded **2003** by Todd Fox. Contracting is a fourth-generation trade in his family.
- Roughly **two to three projects a year**, so Todd is on site daily.
- He returns for maintenance visits years after a project is finished.
- Full-service general contracting **and** construction management. He wants to be involved from
  a project's inception; preconstruction is treated as seriously as construction.
- Staff is a small permanent crew of site supervisors and labor, plus a long-standing high-end
  subcontractor network.
- Work is Manhattan, with occasional Nassau County projects.
- **Interior Design**, December 2010 — Best of Year, Merit: Kitchen/Bath.
- **InStyle**, November 2004 — "The Cable Guy," by Robin Sayers.
- **New York Rooftop Gardens** — Midtown penthouse feature.
- **Franklin Report** — FR Rated.
- Insurer: Southwest Marine & General. Workers compensation: NYSIF.

## Projects

**Manhattan residences**
| Address / area | SF | Scope |
|---|---|---|
| Lincoln Square, Upper West Side | 2,000 | Complete interior renovation of a condominium. Marble slab bathrooms, custom finishes, millwork and flooring, central air conditioning |
| Union Square West, Flatiron | 2,800 | Duplex condominium. Spa room with steam shower, home automation, interior finishes |
| Midtown | 3,000 | Complete interior renovation of a penthouse, including structural work and exterior roof decks |
| Central Park West | 4,000 | Custom specialty paint finishes and audio/visual systems |
| Central Park West at 68th Street | 1,200 | Interior renovation |
| Garment District | 2,000 | Complete interior renovation of a loft |
| 79th Street | 2,000 | Interior finishes |
| 67th Street | 1,500 | Two apartments combined into a single residence |
| 15 Central Park West | — | Apartment renovation, 2008 |
| 9th Street | — | Penthouse renovation, 2011 |
| 16th Street | — | Penthouse renovation, 2006 |
| 42nd Street | — | Apartment finishes, 2010 |
| 99 Jane Street | — | Hallway renovation, 2007 |

**Nassau County residences**
| Great Neck | — | Home theater, 2012 |
| Old Westbury | — | Home theater, 2011 |
| Great Neck | — | Apartment renovation, 2006 |

**Commercial, showhouse and installation**
| 2010 Hamptons Designer Showhouse | — | |
| Woods, Witt, Dealy & Sons, 40th Street | — | Office renovation, 2012 |
| Blow, The New York Blow Dry Bar, 14th Street | — | 2011 |
| Design on a Dime, benefitting Housing Works | — | With Bradley Stephens Design, 2011 |
| Cooper Hewitt National Design Awards after-party set | — | With Bradley Stephens Design, 2005 |

## Contact

- Phone: **917-836-0248**
- Email: **info@trfoxcontracting.com**
- Location line: **New York, NY. By appointment.**
  Do not publish 19 Teakwood Ln anywhere except the privacy policy's required mailing address.

## ⚠️ License numbers — DO NOT PUBLISH

Public records conflict on whether the DCA and DOB license numbers are current, and the EPA
renovation license is listed inactive. Publishing a stale license number on a contractor's site
is a real liability.

Leave `LICENSE_STATUS_UNCONFIRMED` as a constant in `src/data/firm.ts` and render nothing where
license numbers would go until Todd confirms current status in writing. Do not write "licensed
and insured" either. "Insured" alone is safe and is verified.

---

# 8. Authored copy — ships verbatim

Wire these in exactly. Do not paraphrase, do not "improve," do not add a section that needs new
copy without asking.

## Hero

> **Two or three projects a year.**
>
> T.R. Fox Contracting builds high-end residential interiors in Manhattan. Todd Fox is on site
> every day of every one of them.

CTA: `Start a conversation` → `/contact`

## Home, method section — heading: `How the work runs`

> We want to be in the room before the drawings are final. Preconstruction is where a project's
> budget and its schedule are actually decided, and a firm that shows up after those are set
> is managing consequences instead of choices.
>
> Todd runs the site himself. Weekly meetings, daily calls, and one person who has the whole
> project in his head. There is no account manager between you and the person swinging the
> decisions.
>
> When a project is finished we do not disappear. Doors move, finishes settle, buildings shift.
> We come back.

## Home, work section — heading: `Selected work`

Intro line:
> Twenty-three years of interiors, most of them within a few blocks of each other.

Link: `All projects` → `/work`

## Home, press section — heading: `Published`

No intro copy. Three entries, publication and date and the citation line, set as a list.

## Home, closing section

> **Three or four inquiries become a project each year.**
>
> If you are an architect or a designer with something coming up, or a homeowner whose designer
> sent you here, call Todd directly.

CTA: `917-836-0248` as a `tel:` link, `info@trfoxcontracting.com` as a `mailto:` link.

## About page — heading: `T.R. Fox Contracting`

> Todd Fox is the fourth generation of his family to build for a living. He started
> T.R. Fox Contracting in 2003 and has run it the same way since: a small permanent crew, a
> subcontractor network he has worked with for years, and a deliberate ceiling of two or three
> projects at a time.
>
> The ceiling is the point. It is what makes it possible for one person to be on every site
> every day, to question a detail on a drawing before it becomes a problem in a wall, and to
> know a building well enough to come back to it years later.
>
> The work is high-end residential interiors, mostly gut renovations of prewar apartments,
> penthouses and lofts in Manhattan. Marble slab bathrooms, custom millwork, structural work,
> roof decks, home automation, specialty finishes. Complicated projects where the details are
> the design.
>
> Most of it comes through architects and interior designers who have used us before.

## About page, second section — heading: `Working with us`

> **Before the drawings are final.** We price and plan a project while it can still change
> cheaply. Bringing a contractor in at the end of design is how budgets get discovered rather
> than decided.
>
> **One person, on site.** Todd runs each job himself. You will not be handed to someone else
> after the contract is signed.
>
> **We question the drawing.** If a detail is going to fail, the time to say so is before it is
> built, even when it means a difficult conversation with a firm we respect.
>
> **We come back.** Maintenance visits years after handover are part of how we work, not a
> favor.

## Contact page — heading: `Contact`

> Todd answers his own phone.
>
> If you are working on something and want to know whether it is a fit, the fastest route is a
> call. If you would rather write, send the drawings or a description of the space and the rough
> timeline you are working against.

Then: phone, email, `New York, NY. By appointment.`

---

# 9. Quality floor

- Responsive from 375px up. Test at 375, 768, 1280, 1440.
- Real heading hierarchy. One `<h1>` per page.
- `<nav>`, `<main id="main" tabindex="-1">`, `<footer>`, skip link to `#main`.
- `:focus-visible` styled in `--accent`. Touch targets at least 44px under `(pointer: coarse)`.
- `prefers-reduced-motion` respected: the dimension line shows its final state, no drives run.
- Real `<title>` and meta description per route. `theme-color`. Inline SVG favicon.
- `LocalBusiness` JSON-LD on `/` with name, telephone, email, areaServed, and `foundingDate`.
  No `aggregateRating`, no `review`. We do not have permission to publish those.
- No layout shift from the hero image. Explicit dimensions, `priority`, and a `blurDataURL`.
- Zero console errors at every breakpoint.

---

# 10. Workflow rules

- Don't write tests unless asked.
- Don't update README or docs unless asked.
- Don't add a dependency without asking. `next/font` and Tailwind cover everything here.
- Run the build once at the end of a task batch, not per file.
- Match existing patterns. Don't introduce a second way of doing something already done once.
- If something is ambiguous, stop and ask. Don't guess and don't work around it.
- **When work is done, commit everything to the `main` branch. Never leave work staged.**
