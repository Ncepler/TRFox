// Shared "real button" chrome -- soft corners, filled or bordered surface,
// and motion on both hover and press -- used by the /toddles admin
// dashboard and, per an explicit design decision, the public Projects
// section (see tr-fox-CLAUDE.md section 5 and
// .claude/skills/toddles-dashboard/SKILL.md). Centralized here so the three
// tiers and their hover/press values stay identical everywhere they're used
// rather than drifting apart as separate copies.
//
// Motion: grows slightly on hover (the cursor finding it), shrinks slightly
// on press (the click landing) -- feedback on both ends of the interaction,
// per the fluid-interface principle that feedback belongs on contact, not
// only on the result.
const motion = "transition-transform duration-150 hover:scale-105 active:scale-95";

export const primaryButtonClass = `tap-target inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 font-display text-sm text-canvas ${motion} disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100`;

export const secondaryButtonClass = `tap-target inline-flex items-center justify-center rounded-full border border-line px-4 py-2 font-display text-sm text-ink ${motion} hover:bg-canvas-deep disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100`;

export const ghostButtonClass = `tap-target inline-flex items-center justify-center rounded-full px-3 py-1.5 font-display text-sm ${motion} hover:bg-canvas-deep disabled:opacity-30 disabled:hover:scale-100 disabled:active:scale-100`;
