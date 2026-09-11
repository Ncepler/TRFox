"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PHOTO_COUNT = 5;
const HOLD_MS = 4000;
const FADE_MS = 600;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

const photos = Array.from(
  { length: PHOTO_COUNT },
  (_, i) => `/photorotation${i + 1}.jpg`
);

// The opening in the drawing is rect x=270 y=110 w=200 h=150 inside a
// 680x440 viewBox. The photo panel is plain HTML rather than SVG content,
// so it's positioned in percentages of the same aspect-locked wrapper and
// stays registered with the drawn outline at every rendered size.
const panelBox = {
  left: `${(270 / 680) * 100}%`,
  top: `${(110 / 440) * 100}%`,
  width: `${(200 / 680) * 100}%`,
  height: `${(150 / 440) * 100}%`,
};

export default function RoomPanel() {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<boolean[]>(() =>
    Array(PHOTO_COUNT).fill(false)
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false); // hover or keyboard focus
  const [tabHidden, setTabHidden] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // The autoplay is the default state of this thing, not an opt-in: it starts
  // on its own as soon as the section is on screen and keeps going. Depending
  // on `index` means a tick click restarts the interval, so a manual jump
  // gets its own full 4 seconds rather than the remainder of the last one.
  const running = inView && !held && !tabHidden && !reducedMotion;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setIndex((i) => (i + 1) % PHOTO_COUNT),
      HOLD_MS
    );
    return () => window.clearTimeout(timer);
  }, [running, index]);

  const onError = useCallback((i: number) => {
    setFailed((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }, []);

  const faint = { stroke: "var(--color-ink)", strokeOpacity: 0.32 };

  return (
    <div ref={sectionRef}>
      <div
        className="relative w-full"
        style={{ aspectRatio: "680 / 440" }}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 680 440"
          fill="none"
          aria-hidden="true"
        >
          {/* Exactly the shapes CLAUDE.md section 12 specifies. An earlier pass
              also drew ceiling and floor planes to close the box, but their
              last segments ran from the back wall's right edge out to x=620
              with no right-hand wall to meet, so they read as two stray
              diagonals trailing off into blank space. */}
          <polygon points="220,60 80,110 80,310 220,340" {...faint} strokeWidth="1" />

          <line x1="220" y1="60" x2="220" y2="340" stroke="var(--color-ink)" strokeWidth="1" />
          <rect x="220" y="60" width="300" height="280" stroke="var(--color-ink)" strokeWidth="1" />

          <path d="M100,310 A40,40 0 0 1 140,270" {...faint} strokeWidth="0.75" />
          <line x1="100" y1="310" x2="100" y2="270" {...faint} strokeWidth="0.75" />

          <rect x="270" y="110" width="200" height="150" stroke="var(--color-ink)" strokeWidth="1.25" />

          {/* Decorative floor dimension line. Deliberately unlabeled: no
              square footage figure for this drawing has been confirmed. */}
          <line x1="220" y1="365" x2="520" y2="365" stroke="var(--color-accent)" strokeWidth="0.75" />
          <line x1="216" y1="371" x2="224" y2="359" stroke="var(--color-accent)" strokeWidth="1" />
          <line x1="516" y1="371" x2="524" y2="359" stroke="var(--color-accent)" strokeWidth="1" />
        </svg>

        <div
          role="img"
          aria-label="Rotating photographs of completed projects"
          className="absolute overflow-hidden"
          style={{ ...panelBox, backgroundColor: "var(--color-canvas-deep)" }}
        >
          {photos.map((src, i) =>
            failed[i] ? null : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden="true"
                // The images are in the server-rendered HTML, so a 404 can
                // resolve before React ever attaches onError and the event
                // is lost. A finished load with no intrinsic width is the
                // same failure, so catch it when the node mounts too.
                ref={(node) => {
                  if (node?.complete && node.naturalWidth === 0) onError(i);
                }}
                onError={() => onError(i)}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: i === index ? 1 : 0,
                  transition: reducedMotion ? "none" : `opacity ${FADE_MS}ms ${EASING}`,
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Same rule-and-tick device as the project gallery's scrubber. */}
      <div
        className="mx-auto mt-6 max-w-[220px]"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        <svg
          className="block w-full"
          height="12"
          viewBox={`0 0 ${PHOTO_COUNT * 24} 12`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="6"
            x2={PHOTO_COUNT * 24}
            y2="6"
            stroke="var(--color-line)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="-mt-3 flex justify-between">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Photo ${i + 1} of ${PHOTO_COUNT}`}
              aria-current={i === index ? true : undefined}
              onClick={() => setIndex(i)}
              className="tap-target flex h-6 w-6 items-center justify-center"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                <line
                  x1="1"
                  y1="7"
                  x2="7"
                  y2="1"
                  stroke={i === index ? "var(--color-accent)" : "var(--color-line)"}
                  strokeWidth={i === index ? 2 : 1}
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
