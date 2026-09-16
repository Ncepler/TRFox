---
name: toddles-dashboard
description: Visual and interaction rules for the /toddles admin dashboard in this repo (src/app/toddles, src/components/toddles). Use whenever building or editing anything under /toddles -- forms, buttons, cards, lists, disclosure panels. Distilled from Apple's fluid-interface and design-principles guidance (WWDC "Designing Fluid Interfaces", "The Details of UI Typography", "Principles of Great Design"), scoped down to what a small internal admin tool needs.
---

# Toddles dashboard design

`/toddles` is the site's internal admin tool, not a public marketing page.
It follows different rules than the rest of the site on purpose: the public
pages (governed by `tr-fox-CLAUDE.md`) are deliberately flat -- no shadows,
no rounded cards, no gradients, links underlined rather than buttoned. That
restraint is a brand choice for client-facing copy. An admin dashboard has
no such constraint: its only job is to be unmistakably operable by someone
who is not a developer. **Never carry these rules onto the public site, and
never carry the public site's flat-link style onto this dashboard.**

## Real buttons, not links

Every clickable action here is a button with real chrome -- padding, a
filled or bordered background, a pill or soft-rounded shape (`rounded-full`
or `rounded-2xl`) -- never bare underlined text in the accent color. An
underlined link reads as decoration at the bottom of a long form; it has
already been mistaken for "no save button" once. Three tiers, reused as
shared class strings inside `ToddlesAdmin.tsx`:

- **Primary** (`primaryButtonClass`): the one action per view that matters
  most -- Add project, Save changes. Solid `bg-ink` / `text-canvas`,
  `rounded-full`.
- **Secondary** (`secondaryButtonClass`): a real but lower-emphasis action --
  Cancel, Choose images, Import from site. Bordered, `rounded-full`,
  `hover:bg-canvas-deep`.
- **Ghost** (`ghostButtonClass`): compact per-row actions -- Edit, Delete,
  reorder arrows inside a list. Small pill padding, background only on
  hover, so a dense list doesn't turn into a wall of boxes.

All three get press feedback -- `active:scale-[0.97]` with a short
transition -- because Apple's fluid-interface guidance is explicit that
feedback belongs on the press, not just the outcome: a button that only
reacts once the action completes reads as unresponsive in the interval
between click and result.

## Soft corners everywhere, consistently

Inputs get `rounded-lg`, cards and panels get `rounded-2xl`, buttons get
`rounded-full`. Never mix a sharp-cornered element into an otherwise soft
layout -- consistency is what makes it read as "designed" rather than
assembled from whatever the browser defaults to. Card containers (the form
panel, each project in the grid) also get a `shadow-sm` -- enough to lift
them off the canvas as a distinct surface, not enough to look like a
skeuomorphic 2012 UI kit.

## Forms are disclosed, not always-on

An empty form sitting open above an empty list reads as broken, not as an
invitation. The create/edit form starts collapsed behind a single primary
button ("Add project"); clicking it (or Edit on an existing item) reveals
the whole panel -- fields and the image picker together, as one disclosure,
not staged behind a second click. Cancel, or a successful save, collapses
it again.

Animate the reveal, don't just toggle it. Use the CSS grid `0fr` / `1fr`
`grid-template-rows` trick (animating `grid-template-rows` on a wrapper with
`overflow-hidden` inside) rather than `max-height` -- it settles at the
form's real height with no guessed magic number. Use this site's existing
easing constant, `cubic-bezier(0.22, 1, 0.36, 1)` (the same curve
`RoomPanel.tsx`'s crossfade uses), so motion feels like one system rather
than a different curve per component. Always pair it with
`motion-reduce:transition-none` -- collapse/expand instantly for
`prefers-reduced-motion`, per Apple's reduced-motion guidance: cut the
motion, keep the state change legible.

## Inputs look editable

Every text input, textarea, and select gets a visible focus state --
`focus:border-accent focus:ring-2 focus:ring-accent/20` -- on top of the
rounded border. A field that looks identical focused and unfocused makes a
long form feel inert.

## A native `<input type="file">` is never shown bare

It renders as unstyled system text ("Choose Files" / "No file chosen")
that reads as inert, not clickable. Always hide it (`className="sr-only"`)
inside a `<label>` styled as a real button (secondary tier above) that
triggers it.

## Errors are specific, always returned rather than thrown

Next.js redacts an error *thrown* from a Server Action down to an opaque
digest in production ("Minified React error #441") -- the real message
never reaches the browser. Every Toddles action returns `{ ok: false,
message }` instead of throwing (see `src/app/toddles/actions.ts` and
`src/lib/blob.ts`'s `assertBlobConfigured()`), and the component renders
that message directly. Keep this pattern for any new action: a caught,
generic "Save failed." is strictly worse than the real cause.
