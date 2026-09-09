# CLAUDE.md — T.R. Fox Contracting

Client site built by Vilas Studio. Next.js 15 App Router · TypeScript · Tailwind v4 · Vercel.
No database, no CMS, no auth. Content lives in typed files under `src/data/`.

This file replaces the first version. Read it in full before any task.

---

# 1. Who this site is for

T.R. Fox Contracting is a boutique general contracting and construction management firm in
Manhattan, founded 2003. High-end residential interiors: gut renovations of prewar apartments,
penthouses, and lofts, typically $200k–$500k.

The visitor is an architect or an interior designer, not a homeowner searching Google. A second
visitor is that client, sent by the designer. Nobody arrives here by accident. The site is a
credential, not a lead funnel. Never write copy that tries to close a stranger.

---

# 2. Voice

Restrained, precise, unhurried. Plain declarative sentences. The firm speaks as "we." Todd Fox
is named once, at most twice, on the whole site, in the place where a personal detail actually
earns its spot — never as a running refrain.

**Never:** "passionate," "dedicated," "attention to detail," "your vision, our expertise,"
"unparalleled," "craftsmanship" as a standalone noun, "seamless," "elevate," "leverage,"
"solutions," "state-of-the-art," "we pride ourselves," "testament," "showcase."

**Never** invent a number, a client name, a testimonial, a rating, or a frequency ("three or
four inquiries a year" — that was a mistake in the first draft and it does not belong on a real
client's site). Every fact traces to §7 or to something Todd confirmed in writing.

**Never** an em dash in shipped copy. Commas and periods.

**Never** the word "template" anywhere a visitor can read it. The word is "style."

**The About page copy is the client's own words, pasted exactly as given, unedited.** See §8.
Do not paraphrase it, trim it, or improve it. It is the one place on the site written in the
firm's own historical voice, and that is deliberate.

---

# 3. Design system

## Tokens (updated)

```css
:root{
  --canvas:      #F3F3F3;  /* page background */
  --canvas-deep: #E8E7E4;  /* recessed bands, alternating sections */
  --ink:         #191714;  /* warm off-black. all body and display type */
  --ink-soft:    #55504A;  /* secondary text, captions, meta */
  --line:        #C9C4BB;  /* hairlines, borders, gallery scrub track */
  --accent:      #2E4A47;  /* oxidized copper. CTA, focus ring, active scrub tick */
  --accent-hover:#233A37;
}
```

`--accent` appears in: the primary call to action, `:focus-visible` rings, the active tick in
the gallery scrubber, and the active nav item. Nowhere else.

Contrast: `--ink` on `--canvas` is roughly 15:1. `--ink-soft` on `--canvas` is roughly 7:1.

## The background texture

The flat `--canvas` field reads sterile on its own, so it carries one very faint fixed layer: a
low-frequency plaster-grain texture, an SVG `feTurbulence` filter at `baseFrequency` around
0.9, rendered as a full-viewport `position: fixed` layer behind all content, opacity 0.025,
`mix-blend-mode: multiply`. It should be close to invisible on a quick look and only readable as
"this isn't a flat color" on close inspection. It never animates. `aria-hidden="true"`.

## Type

| Role | Face | Weights | Notes |
|---|---|---|---|
| Display | **Schibsted Grotesk** | 400, 500 | Tracking `-0.03em` at display sizes. |
| Body | **Newsreader** | 300, 400 | `line-height: 1.65`, measure capped at `62ch` on the text element itself. |
| Small labels | **Schibsted Grotesk** 500 | | Sentence case. Never all caps. |

No monospace anywhere. No tracked-out eyebrow above a heading.

## The signature: the dimension line, relocated

**The dimension line no longer decorates the project listing cards.** It didn't earn its place
there — a rule sitting under a square footage number with nothing to do reads as a rendering
bug, not a design choice, and that's a fair note from the client. Project entries on `/` and
`/projects` now show only the address, the scope prose, and the square footage as a plain small
label in `--ink-soft`. No line under it.

**The motif moves to the photo gallery, where it has a real job.** See §5. Spending the one
signature device on something functional beats spending it on something decorative that people
notice for the wrong reason.

## Layout

- Left-aligned. Nothing centered except the nav on mobile.
- Projects identified by address, not a marketing name.
- No two adjacent sections share a layout skeleton.

## Banned looks

Cream canvas with a serif and a terracotta accent. Near-black with acid green. Broadsheet
hairline brutalism. Identical rounded cards with soft grey shadow.

---

# 4. Navigation

**Two states, driven by scroll position, not a fixed pixel value.**

**State 1 — over the hero.** No background, no border, no shadow. The logo and nav links sit
directly on the hero image, in `--ink` (the hero is dark-polarity: dark type on a bright image,
so this reads clean with no scrim needed). `position: fixed`, `top: 0`.

**State 2 — past the hero.** Once the hero section has scrolled fully out of view (use an
`IntersectionObserver` on the hero section itself, not a scroll-Y pixel threshold, so it holds
correctly across viewport sizes), the nav gets a `--canvas` background, a 1px `--line`
bottom border, and a soft shadow becomes a hairline, not a card shadow. It stays `position:
fixed` and stays visible from here on, including while scrolling back up past the hero, at
which point it reverts to State 1.

The transition between states is a 200ms opacity and background-color tween, not a snap.

On mobile, State 1's transparent nav still needs a mobile disclosure toggle that's readable
against a bright image; give the toggle icon a subtle `--ink`-colored drop shadow so it doesn't
disappear on a light patch of the photo, rather than adding a scrim behind the whole nav.

---

# 5. The gallery — the site's one interactive moment

Every project that has real photographs gets a **"View project"** text trigger under its scope
prose (where the removed dimension line used to sit). Clicking it opens a fullscreen lightbox.

**Lightbox anatomy, top to bottom:**
1. The current photograph, centered, `object-fit: contain`, on a near-black scrim
   (`rgba(25,23,20,0.96)`) so the photo reads as the only thing in the room.
2. Below it: the project address and the scope line, in `--canvas`-on-scrim, small.
3. At the very bottom: **the dimension line, doing a real job.** A 1px `--line` rule spanning
   the lightbox width, with one tick per photograph. The tick for the current photo is filled
   solid `--accent`; every other tick is a hollow `--line` outline. Clicking any tick jumps
   straight to that photo. The rule does not animate on open — the draw-in animation from the
   old card usage is retired along with that usage; this version is a static, functional index,
   not a decorative reveal.

**Interaction:** left/right arrow keys, a swipe gesture on touch, and click zones on the left and
right thirds of the photo all move to the previous/next image. `Escape` and a click on the scrim
outside the photo close it. Focus moves into the lightbox on open and returns to the trigger that
opened it on close, standard dialog behavior. `role="dialog"`, `aria-modal="true"`.

**Reduced motion:** the open/close transition is a straight opacity fade, no scale or slide,
under `prefers-reduced-motion: reduce`.

---

# 6. Photography — sourced from the original site

Todd has no new photo library to hand over, but the firm's actual project photographs already
exist, live, on the old site. Pull them in rather than waiting.

**Base URL pattern:** `http://trfoxcontracting.com/images/projectNN/projNN_XX.jpg`, two-digit
zero-padded on both `NN` (project number) and `XX` (image number within that project, starting
at `01`).

**The full map — verified by fetching every project subpage on the old site:**

| Our project (by address) | Old site folder | Image count | Filenames |
|---|---|---|---|
| Garment District | `project01` | 6 | `proj01_01.jpg` … `proj01_06.jpg` |
| 67th Street | `project02` | 8 | `proj02_01.jpg` … `proj02_08.jpg` |
| 79th Street | `project03` | 4 | `proj03_01.jpg` … `proj03_04.jpg` |
| Central Park West at 68th Street | `project04` | 6 | `proj04_01.jpg` … `proj04_06.jpg` |
| Central Park West | `project05` | 10 | `proj05_01.jpg` … `proj05_10.jpg` |
| Midtown | `project06` | 19 | `proj06_01.jpg` … `proj06_19.jpg` |
| 2010 Hamptons Designer Showhouse | `project07` | 6 | `proj07_01.jpg` … `proj07_06.jpg` |
| Union Square West, Flatiron | `project08` | 9 | `proj08_01.jpg` … `proj08_09.jpg` |
| Lincoln Square, Upper West Side | `project09` | 10 | `proj09_01.jpg` … `proj09_10.jpg` |

78 images total. Every other project in `projects.ts` (the office renovation, the home theaters,
the Blow Dry Bar, Design on a Dime, the older penthouses) has no photo folder on the old site and
gets no gallery trigger. That's correct, not a gap to fill.

Download target: `/public/projects/<slug>/01.jpg` through the count above, re-encoded to a
sensible web size (these are 2007–2012 files, several will be large or oddly compressed; a
single clean re-compression pass on the way in is fine, upscaling is not).

`Project` gains `photoCount: number` (0 for entries with none) and the gallery trigger renders
only when `photoCount > 0`.

---

# 7. Facts

- Founded **2003**. Full-service general contracting and construction management.
- Work is Manhattan, with occasional Nassau County projects.
- **Interior Design**, December 2010 — Best of Year, Merit: Kitchen/Bath.
- **InStyle**, November 2004 — "The Cable Guy," by Robin Sayers.
- **New York Rooftop Gardens** — Midtown penthouse feature.
- **Franklin Report** — FR Rated.
- Insurer: Southwest Marine & General. Workers compensation: NYSIF.

## Projects

**Manhattan residences**
| Address | SF | Scope | Photo folder |
|---|---|---|---|
| Lincoln Square, Upper West Side | 2,000 | Complete interior renovation of a condominium. Marble slab bathrooms, custom finishes, millwork and flooring, central air conditioning | project09 |
| Union Square West, Flatiron | 2,800 | Duplex condominium. Spa room with steam shower, home automation, interior finishes | project08 |
| Midtown | 3,000 | Complete interior renovation of a penthouse, including structural work and exterior roof decks | project06 |
| Central Park West | 4,000 | Custom specialty paint finishes and audio/visual systems | project05 |
| Central Park West at 68th Street | 1,200 | Interior renovation | project04 |
| Garment District | 2,000 | Complete interior renovation of a loft | project01 |
| 79th Street | 2,000 | Interior finishes | project03 |
| 67th Street | 1,500 | Two apartments combined into a single residence | project02 |
| 15 Central Park West | — | Apartment renovation, 2008 | none |
| 9th Street | — | Penthouse renovation, 2011 | none |
| 16th Street | — | Penthouse renovation, 2006 | none |
| 42nd Street | — | Apartment finishes, 2010 | none |
| 99 Jane Street | — | Hallway renovation, 2007 | none |

**Nassau County residences**
| Great Neck | — | Home theater, 2012 | none |
| Old Westbury | — | Home theater, 2011 | none |
| Great Neck | — | Apartment renovation, 2006 | none |

**Commercial, showhouse and installation**
| 2010 Hamptons Designer Showhouse | — | | project07 |
| Woods, Witt, Dealy & Sons, 40th Street | — | Office renovation, 2012 | none |
| Blow, The New York Blow Dry Bar, 14th Street | — | 2011 | none |
| Design on a Dime, benefitting Housing Works | — | With Bradley Stephens Design, 2011 | none |
| Cooper Hewitt National Design Awards after-party set | — | With Bradley Stephens Design, 2005 | none |

## Contact

- Phone: **917-836-0248**
- Email: **info@trfoxcontracting.com**
- Location line: **New York, NY. By appointment.**
  Do not publish 19 Teakwood Ln anywhere except the privacy policy's required mailing address.

## ⚠️ License numbers — DO NOT PUBLISH

Public records conflict on current status. Leave `LICENSE_STATUS_UNCONFIRMED` as a constant in
`src/data/firm.ts` and render nothing where license numbers would go until Todd confirms in
writing. "Insured" alone is safe and is verified; "licensed and insured" is not.

---

# 8. Authored copy — ships verbatim

## Hero

> **Full-service general contracting, from the first walkthrough to the final coat of paint.**
>
> We work with architects and designers across Manhattan, most of them more than once, and
> we're on site for the whole thing ourselves.

CTA: `Start a conversation` → `/contact`

*(Revision note: the first draft opened with "Two or three projects a year" and named Todd Fox
in nearly every section. This version leads with what the firm actually does, in the firm's own
voice, and keeps personal mentions to one spot, in §8's "How the work runs" section below, where
it's actually relevant.)*

## Home, method section — heading: `How the work runs`

> We want to be in the room before the drawings are final. Preconstruction is where a project's
> budget and its schedule get decided, and showing up after those are set means managing
> consequences instead of choices.
>
> Todd Fox runs the site himself, day to day, with a small crew and a subcontractor network
> we've worked with for years. Weekly meetings, daily calls, one person who has the whole
> project in his head.
>
> When a project is finished we don't disappear. Doors move, finishes settle, buildings shift.
> We come back.

*(This is the one place Todd is named by name. Nowhere else on the site.)*

## Home, work section — heading: `Selected work`

Intro line:
> Twenty-three years of interiors, most of them within a few blocks of each other.

Link: `All projects` → `/projects`

## Home, press section — heading: `Published`

No intro copy. Three entries as a list.

## Home, closing section — heading: `Get in touch`

> If you're an architect or a designer with something coming together, or a homeowner whose
> designer sent you here, reach out directly. We're glad to talk through what you have in mind
> before anything is set in stone.

Phone as `tel:` link, email as `mailto:` link. No separate button, no headline stat, no urgency
language. This replaces the fabricated "three or four inquiries a year" line from the first
draft entirely; that number didn't come from anywhere real and it shouldn't have been written.

## About page — heading: `T.R. Fox Contracting`

**Paste the client's own paragraph exactly as given, unedited, as the page's opening content:**

> T.R. Fox Contracting, Inc. is a full service general contracting and construction management
> firm, dedicated to tailoring our capabilities and practice to your specific project goals.
> With over 10 years of experience in the industry, and a strong focus on personal
> relationships with our clients, we pride ourselves on being able to execute the most
> complicated of projects, without sacrificing the finest of details, which are the distinction
> of every design.
>
> We find great value in becoming involved at the inception of a project. Over the years we
> have worked with some of the most exceptional architects and designers in the city,
> consistently satisfying their expectations. Repeat business has allowed us the opportunity to
> collaborate with architects, designers, and/ or clients, in order to streamline the delivery
> of a project while providing comprehensive construction management services. We firmly
> believe that the preconstruction process is just as critical as the construction phase, as
> there is no substitute for proper planning.

Do not correct "over 10 years" to the current 23. Do not fix the stray space in "and/ or." This
is the client's original text, reproduced exactly, not a document to edit.

## Contact page — heading: `Contact`

> If you're working on something and want to know whether it's a fit, the fastest way to find
> out is a call. If you'd rather write, send the drawings or a description of the space and the
> rough timeline you're working against.

Then: phone, email, `New York, NY. By appointment.`

## Footer

Standard firm info (name, phone, email, location line), the nav links, Privacy, and at the very
bottom, its own line, small and quiet:

> Site by [vilas.studio](https://vilas.studio)

---

# 9. Structure

| Route | Purpose |
|---|---|
| `/` | Hero, method, selected work (6), press, contact |
| `/projects` | Every project on record, grouped (renamed from `/work`) |
| `/about` | The client's own About Us text, verbatim |
| `/contact` | Phone, email, how an inquiry works. No form. |
| `/privacy` | Privacy policy |

Nav label is **Projects**, not Work, matching the route rename.

---

# 10. Quality floor

- Responsive from 375px up. Test at 375, 768, 1280, 1440.
- Real heading hierarchy, one `<h1>` per page.
- `<nav>`, `<main id="main" tabindex="-1">`, `<footer>`, skip link to `#main`.
- `:focus-visible` styled in `--accent`. Touch targets at least 44px under `(pointer: coarse)`.
- `prefers-reduced-motion` respected everywhere: nav state transition, background texture
  (already static), and the gallery open/close.
- Real `<title>` and meta description per route. `theme-color` set to `#F3F3F3`.
- `LocalBusiness` JSON-LD on `/`: name, telephone, email, areaServed, foundingDate. No
  `aggregateRating`, no `review`.
- Zero console errors at every breakpoint.

---

# 11. Workflow rules

- Don't write tests unless asked.
- Don't update README or docs unless asked.
- Don't add a dependency without asking.
- Run the build once at the end of a task batch, not per file.
- Match existing patterns. Don't introduce a second way of doing something already done once.
- If something is ambiguous, stop and ask. Don't guess and don't work around it.
- **When work is done, commit everything to the `main` branch. Never leave work staged.**
