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

// Measured by eye against /public/board.jpg (1672x941): the panel's blank
// face, inside its black frame border, as a percentage of the full 16:9
// photograph. The frame's inner edge sits at roughly x 386-1277, y 171-785
// px, but the panel is photographed at a slight angle rather than dead-on
// (the left edge alone drifts ~388px at the top to ~384px at the bottom),
// so these percentages use the innermost reading on each side and are
// pulled in a couple more points so the overlay stays inside the gray face
// on every side rather than touching the frame.
const panelBox = {
  left: "23.5%",
  top: "18.5%",
  width: "52.5%",
  height: "64%",
};

export default function BoardPanel() {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<boolean[]>(() =>
    Array(PHOTO_COUNT).fill(false)
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false); // hover or keyboard focus
  const [tabHidden, setTabHidden] = useState(false);
  const [boardFailed, setBoardFailed] = useState(false);
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

  return (
    <div ref={sectionRef}>
      <div
        className="relative w-full"
        style={{ aspectRatio: "16 / 9", backgroundColor: "var(--color-canvas-deep)" }}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        {!boardFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/board.jpg"
            alt=""
            aria-hidden="true"
            // Same non-blocking pattern as the rotating photos below: if the
            // asset isn't uploaded yet, the section still renders, just with
            // an empty background instead of a broken-image icon.
            ref={(node) => {
              if (node?.complete && node.naturalWidth === 0) setBoardFailed(true);
            }}
            onError={() => setBoardFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

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
