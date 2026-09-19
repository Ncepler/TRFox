"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

/* ------------------------------------------------------------------
   The scroll-scrubbed cinematic hero.

   Built to the 10k-websites engineering standard (Blob fetch, a rAF
   lerp that rests, gated seeks, delta-gated DOM writes, paced caption
   bands, the four-layer legibility system, five live static-hero
   gates, complete without the video), adapted from that skill's
   plain-HTML target into a React client component.

   The one adaptation that matters: the scroll drive never touches
   React state. State updates at 60fps would re-render the tree every
   frame, which is the choppiness the whole standard exists to prevent.
   Everything scroll-driven is written straight to DOM nodes through
   refs, and every write is delta-gated. React renders the markup once;
   the drive loop owns it after that.
   ------------------------------------------------------------------ */

const VIDEO_URL = "/trfoxherovideo.mp4";
const POSTER_URL = "/hero-scrub-poster.jpg";
const ENDING_URL = "/hero-scrub-ending.jpg";

/** 820vh of hero: five beats with room for the brand card and the settle. */
const HERO_VH = 820;

/** The brand card is gone by 2% of the hero's scroll, about 15vh. */
const BRAND_FADE_END = 0.02;

/* PLACEHOLDER, confirm before shipping: the kicker under the wordmark,
   the settle band's sub line, and the CTA's label and destination. */
const KICKER = "GENERAL CONTRACTING";
const CTA_LABEL = "Get a quote";
const CTA_HREF = "/contact";

type Entrance = "drift" | "blur" | "grid" | "scatter" | "rise";

type Band = {
  /** Scroll-progress range. Each is 0.16 to 0.18 of an 820vh hero, so
      every plateau lands between 86 and 101vh: five to six normal flicks. */
  a: number;
  b: number;
  entrance: Entrance;
  headline: string;
  /** The one word per headline that carries the accent. Never more than one. */
  em?: string;
  sub: string;
  /** Per-band scrim peak alpha, tuned against that band's worst frame. */
  alpha: number;
  /** Optional assembly-window override, in progress units. */
  ramp?: number;
};

/* The band map. Each beat sits on what the footage is physically doing
   at that point, and its entrance echoes that motion. */
const BANDS: Band[] = [
  {
    // The raw right side is at its most visible: studs, joists, sheeting.
    a: 0.04,
    b: 0.2,
    entrance: "drift",
    headline: "Every job starts as a shell.",
    em: "shell.",
    sub: "Studs, ductwork, bare concrete. This is where TRFox starts.",
    alpha: 0.68,
  },
  {
    // Cabinetry and wall surfaces resolve into clean finished white.
    a: 0.22,
    b: 0.4,
    entrance: "blur",
    headline: "Walls done right.",
    em: "right.",
    sub: "Paint, no seams, finished clean.",
    alpha: 0.7,
  },
  {
    // The wood floor closes over the last of the concrete and sheeting.
    a: 0.42,
    b: 0.58,
    entrance: "grid",
    headline: "The floor comes together.",
    em: "together.",
    sub: "Every surface finished the same way. Right.",
    alpha: 0.72,
  },
  {
    // The dining table lands and the pendant arrives and lights.
    a: 0.6,
    b: 0.78,
    entrance: "scatter",
    headline: "Then it’s a home.",
    em: "home.",
    sub: "Furnished, wired, ready to live in.",
    alpha: 0.66,
  },
  {
    // The shot at rest: pendant lit, dusk skyline, nothing moving.
    // No accent word here on purpose: in this band the CTA carries the
    // accent, and the brand's own name is not a word to half-colour.
    a: 0.8,
    b: 0.96,
    entrance: "rise",
    headline: "TRFOX CONTRACTING",
    sub: "General contracting, start to finish.",
    alpha: 0.7,
    ramp: 0.036,
  },
];

/** Seeded, so the "random" offsets are identical on every load and the
    server's HTML matches the client's. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const smoothstep = (p: number, e0: number, e1: number) => {
  const t = clamp((p - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

type CharSpan = { ch: string; th: number; jx: number; jy: number; jr: number };
type WordSpan = { chars: CharSpan[]; th: number; em: boolean };

/** Split once, deterministically, at render time. Character entrances
    need per-character custom properties, and word entrances need
    per-word ones, so both levels are always built. */
function splitHeadline(band: Band, seed: number): WordSpan[] {
  const rand = rng(seed);
  const words = band.headline.split(" ");
  const totalChars = words.reduce((n, w) => n + w.length, 0);
  const spread = 0.5;
  let charIndex = 0;

  return words.map((word, wi) => {
    const chars = [...word].map((ch) => {
      const ordered = totalChars > 1 ? charIndex / (totalChars - 1) : 0;
      charIndex += 1;
      return {
        ch,
        // Ordered threshold for grid, random for scatter; both are
        // generated so the CSS for either entrance has what it needs.
        th:
          band.entrance === "grid"
            ? ordered * spread + rand() * 0.06
            : rand() * 0.55,
        jx: band.entrance === "grid" ? -18 - rand() * 26 : (rand() - 0.5) * 84,
        jy: (rand() - 0.5) * 64,
        jr: (rand() - 0.5) * 26,
      };
    });
    return {
      chars,
      th: words.length > 1 ? (wi / (words.length - 1)) * 0.42 : 0,
      em: Boolean(band.em) && word === band.em,
    };
  });
}

export default function ScrubHero() {
  const split = useMemo(
    () => BANDS.map((band, i) => splitHeadline(band, 20260917 + i * 7919)),
    []
  );

  const heroRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const staticWrapRef = useRef<HTMLDivElement>(null);
  const staticStartRef = useRef<HTMLDivElement>(null);
  const staticEndRef = useRef<HTMLDivElement>(null);
  const staticTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    const poster = posterRef.current;
    const brand = brandRef.current;
    const cue = cueRef.current;
    const staticWrap = staticWrapRef.current;
    const staticStart = staticStartRef.current;
    const staticEnd = staticEndRef.current;
    const staticText = staticTextRef.current;
    if (!hero || !stage || !video || !poster || !brand) return;

    /* ---------- cached DOM state, so nothing is written twice ---------- */
    const cache = BANDS.map(() => ({ op: -1, k: -1 }));
    let lastBrandOp = -1;
    let lastCueOn: boolean | null = null;

    /* ---------- the seek gate ---------- */
    let seekBusy = false;
    let pendingTime: number | null = null;

    function requestSeek(t: number) {
      if (!video || !video.duration) return;
      if (seekBusy) {
        pendingTime = t; // coalesce to the newest target
        return;
      }
      seekBusy = true;
      video.currentTime = t;
    }

    const onSeeked = () => {
      seekBusy = false;
      if (pendingTime !== null) {
        const t = pendingTime;
        pendingTime = null;
        requestSeek(t); // exactly one follow-up
      }
    };

    // The deadlock escape: without this a seek that errors leaves the
    // gate busy forever and scrubbing freezes permanently mid-scroll.
    const onVideoError = () => {
      seekBusy = false;
      pendingTime = null;
      failVideo();
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onVideoError);

    /* ---------- progress ---------- */
    function heroProgress() {
      if (!hero) return 0;
      const total = hero.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp(-hero.getBoundingClientRect().top / total, 0, 1);
    }

    /* ---------- the caption drive, every write delta-gated ---------- */
    function updateCaptions(p: number) {
      for (let i = 0; i < BANDS.length; i++) {
        const band = BANDS[i];
        const el = bandRefs.current[i];
        if (!el) continue;

        const f = Math.min(0.02, (band.b - band.a) / 3);
        // The last band skips the ease-out, so the journey ends settled.
        //
        // The standard also has band one skip its ease-in, so the hero
        // never opens on footage with no words. Here the brand card is
        // the opening words, and it owns the first 2% by itself, so band
        // one eases in on its own range like every other band. Skipping
        // it stacked the first caption on top of the brand card at
        // scroll zero and threw the drift-down entrance away unseen.
        const easeIn = smoothstep(p, band.a, band.a + f);
        const easeOut =
          i === BANDS.length - 1 ? 0 : smoothstep(p, band.b - f, band.b);
        const op = easeIn * (1 - easeOut);

        const ramp = band.ramp ?? Math.min(0.025, (band.b - band.a) * 0.35);
        const k = clamp((p - band.a) / ramp, 0, 1);

        if (Math.abs(op - cache[i].op) > 0.004) {
          cache[i].op = op;
          el.style.opacity = String(op);
        }
        if (Math.abs(k - cache[i].k) > 0.008) {
          cache[i].k = k;
          el.style.setProperty("--k", String(k));
        }
      }

      // The brand card goes fast: gone by 2% of the hero, not fading
      // alongside the journey.
      const brandOp = 1 - smoothstep(p, 0, BRAND_FADE_END);
      if (brand && Math.abs(brandOp - lastBrandOp) > 0.004) {
        lastBrandOp = brandOp;
        brand.style.opacity = String(brandOp);
      }

      const cueOn = p < 0.012;
      if (cue && cueOn !== lastCueOn) {
        lastCueOn = cueOn;
        stage?.classList.toggle("cue-gone", !cueOn);
      }
    }

    /* ---------- the rAF lerp that rests ---------- */
    let target = 0;
    let shown = 0;
    let rafId: number | null = null;
    let lastTick = 0;
    let heroOnScreen = true;

    function tick(now: number) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      const kSmooth = 0.16;
      // The exponent normalizes smoothing to a 60fps reference, so a
      // 120Hz screen converges at the same speed as a 60Hz one.
      shown += (target - shown) * (1 - Math.pow(1 - kSmooth, dt / 16.667));
      if (Math.abs(target - shown) < 0.0005) {
        shown = target;
        rafId = null;
        lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
      if (video && video.duration) requestSeek(shown * video.duration);
      updateCaptions(shown);
    }

    function onScroll() {
      target = heroProgress();
      if (rafId === null && heroOnScreen) {
        lastTick = 0;
        rafId = requestAnimationFrame(tick);
      }
    }

    /* ---------- the video, loaded only inside the gated path ---------- */
    let heroInitialized = false;
    let blobUrl: string | null = null;
    let watchdog: number | undefined;
    let aborter: AbortController | null = null;

    function failVideo() {
      stage?.classList.add("video-failed");
    }

    async function loadHeroBlob() {
      // 4.7 MB, comfortably under the 8 MB line where a streamed ring
      // earns its place, so the plain Blob form is the right one here.
      // The Blob matters regardless of size: a host without partial
      // download support clamps every seek to zero, and scrubbing
      // silently does nothing on the live site while working locally.
      aborter = new AbortController();
      watchdog = window.setTimeout(() => aborter?.abort(), 20000);
      const res = await fetch(VIDEO_URL, { signal: aborter.signal });
      if (!res.ok) throw new Error(`hero video ${res.status}`);
      const blob = await res.blob();
      window.clearTimeout(watchdog);
      if (!video) return;
      blobUrl = URL.createObjectURL(blob);
      video.src = blobUrl;
      video.load();
      video.addEventListener(
        "canplay",
        () => {
          requestSeek(heroProgress() * (video.duration || 0));
          stage?.classList.add("video-ready");
        },
        { once: true }
      );
    }

    function initHeroOnce() {
      if (heroInitialized) return;
      heroInitialized = true;
      // The poster wins the bandwidth race by design: paint it first,
      // and start the video only once it is in, or has failed.
      poster!.style.backgroundImage = `url('${POSTER_URL}')`;
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        loadHeroBlob().catch(failVideo);
      };
      const img = new Image();
      img.onload = start;
      img.onerror = start;
      img.src = POSTER_URL;
      window.setTimeout(start, 4000); // a hung poster never blocks forever
    }

    /* ---------- the one gate, decided live ---------- */
    // The scroll-scrubbed video now runs on every viewport, including
    // phones: the blob-fetch path already downloads the whole (4.7 MB)
    // file before seeking, so mobile scrubbing has no network-seek
    // problem to work around. Only reduced-motion still gets the static
    // crossfade, since that's an accessibility choice, not a device one.
    // Character-for-character identical to the media query block in
    // globals.css. If one side drifts, that side loads assets the
    // other side hides.
    const GATES = ["(prefers-reduced-motion: reduce)"];

    let scrubOn = false;
    let staticOn = false;
    let staticArmed = false;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    function staticProgress() {
      if (!staticWrap) return 0;
      const total = staticWrap.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp(-staticWrap.getBoundingClientRect().top / total, 0, 1);
    }

    const staticCache = { end: -1, text: -1 };

    function onStaticScroll() {
      const p = staticProgress();
      // The crossfade doesn't start at scroll zero (there'd be nothing to
      // scroll through before it began) and finishes with room to spare,
      // so the finished shot and the words both get a moment to sit still
      // before the track runs out.
      const endOp = smoothstep(p, 0.15, 0.85);
      const textOp = smoothstep(p, 0.55, 0.9);
      if (staticEnd && Math.abs(endOp - staticCache.end) > 0.004) {
        staticCache.end = endOp;
        staticEnd.style.opacity = String(endOp);
      }
      if (staticText && Math.abs(textOp - staticCache.text) > 0.004) {
        staticCache.text = textOp;
        staticText.style.opacity = String(textOp);
      }
    }

    function armStatic() {
      if (staticArmed || !staticStart || !staticEnd) return;
      staticArmed = true;
      // Set from JS for the same reason the poster is: a background
      // image declared in markup downloads on every visitor, including
      // the desktop ones who never see this layout.
      staticStart.style.backgroundImage = `url('${POSTER_URL}')`;
      staticEnd.style.backgroundImage = `url('${ENDING_URL}')`;
    }

    function enableStatic() {
      if (staticOn) return;
      staticOn = true;
      armStatic();
      if (reducedMotion) {
        // No scroll-driven motion: land straight on the finished room and
        // its words, full screen, nothing to animate into place.
        if (staticEnd) staticEnd.style.opacity = "1";
        if (staticText) staticText.style.opacity = "1";
        return;
      }
      window.addEventListener("scroll", onStaticScroll, { passive: true });
      onStaticScroll();
    }

    function disableStatic() {
      if (!staticOn) return;
      staticOn = false;
      window.removeEventListener("scroll", onStaticScroll);
    }

    function enableScrub() {
      disableStatic();
      if (scrubOn) return;
      scrubOn = true;
      initHeroOnce();
      window.addEventListener("scroll", onScroll, { passive: true });
      // Reset the caches so styles pinned by the static path get rewritten.
      cache.forEach((c) => {
        c.op = -1;
        c.k = -1;
      });
      lastBrandOp = -1;
      lastCueOn = null;
      updateCaptions(heroProgress());
      onScroll(); // re-seek to the current scroll position
    }

    function disableScrub() {
      if (!scrubOn) return;
      scrubOn = false;
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function applyHeroMode() {
      if (GATES.some((q) => matchMedia(q).matches)) {
        disableScrub();
        enableStatic();
      } else {
        enableScrub();
      }
    }

    // Keep the query lists referenced: unreferenced ones have
    // historically lost their listeners.
    const MQLS = GATES.map((q) => matchMedia(q));
    MQLS.forEach((m) => m.addEventListener("change", applyHeroMode));

    /* ---------- rest while off-screen ---------- */
    const io = new IntersectionObserver(
      ([entry]) => {
        heroOnScreen = entry.isIntersecting;
        if (!heroOnScreen && rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        } else if (heroOnScreen && scrubOn) {
          onScroll();
        }
      },
      { threshold: 0 }
    );
    io.observe(hero);

    const onResize = () => {
      if (scrubOn) onScroll();
      if (staticOn) onStaticScroll();
    };
    window.addEventListener("resize", onResize, { passive: true });

    applyHeroMode();

    return () => {
      MQLS.forEach((m) => m.removeEventListener("change", applyHeroMode));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onStaticScroll);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onVideoError);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (watchdog) window.clearTimeout(watchdog);
      aborter?.abort();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, []);

  return (
    <>
      <div
        ref={heroRef}
        id="hero"
        data-cinematic="true"
        className="scrub-hero -mt-20"
        style={{ height: `${HERO_VH}vh` }}
      >
        <div ref={stageRef} className="scrub-stage">
          <div ref={posterRef} className="scrub-poster" aria-hidden="true" />
          {/* Decorative: the captions carry the content, so this stays
              out of the accessibility tree and out of the tab order. */}
          <video
            ref={videoRef}
            className="scrub-video"
            preload="none"
            muted
            playsInline
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="scrub-scrim" aria-hidden="true" />
          <div className="scrub-topscrim" aria-hidden="true" />

          <div ref={brandRef} className="brand-card">
            <div>
              <NextImage
                src="/text-logo-white.png"
                alt="TRFox Contracting"
                width={372}
                height={218}
                priority
                className="brand-logo"
              />
              <p className="brand-kicker">{KICKER}</p>
            </div>
          </div>

          {BANDS.map((band, i) => (
            <div
              key={band.headline}
              ref={(el) => {
                bandRefs.current[i] = el;
              }}
              className={`band e-${band.entrance}`}
              style={{ ["--band-alpha" as string]: String(band.alpha) }}
            >
              <div className="band-scrim" aria-hidden="true" />
              <div className="band-text">
                {band.entrance === "blur" ? (
                  <div className="blur-stack">
                    <h2 className="band-head layer-soft" aria-hidden="true">
                      {renderPlain(band)}
                    </h2>
                    <h2 className="band-head layer-sharp">{renderPlain(band)}</h2>
                  </div>
                ) : (
                  <h2 className="band-head">
                    <span className="sr-only">{band.headline}</span>
                    <span aria-hidden="true">
                      {split[i].map((word, wi) => (
                        <span key={wi}>
                          <span
                            className={`w${word.em ? " band-em" : ""}`}
                            style={{ ["--th" as string]: String(word.th) }}
                          >
                            {word.chars.map((c, ci) => (
                              <span
                                key={ci}
                                className="c"
                                style={{
                                  ["--th" as string]: String(c.th),
                                  ["--jx" as string]: `${c.jx}px`,
                                  ["--jy" as string]: `${c.jy}px`,
                                  ["--jr" as string]: `${c.jr}deg`,
                                }}
                              >
                                {c.ch}
                              </span>
                            ))}
                          </span>
                          {wi < split[i].length - 1 ? " " : null}
                        </span>
                      ))}
                    </span>
                  </h2>
                )}

                <p className="band-sub">{band.sub}</p>

                {i === BANDS.length - 1 ? (
                  <div className="band-cta">
                    <Link href={CTA_HREF} className="tap-target hero-btn">
                      {CTA_LABEL}
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          <div ref={cueRef} className="scrub-cue" aria-hidden="true">
            <svg
              className="scrub-cue-chevron"
              width="22"
              height="13"
              viewBox="0 0 22 13"
              fill="none"
            >
              <path
                d="M1 1l10 10L21 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* The static hero: phones, portrait tablets, sideways phones, and
          reduced motion. Same journey as the scrub hero -- raw shell to
          finished room -- as two crossfading photos instead of a scrubbed
          video, pinned full-screen (sticky) so there's nowhere to go
          until the crossfade finishes. Reduced motion lands directly on
          the finished frame instead of animating into it. */}
      <div ref={staticWrapRef} className="static-hero-wrap -mt-20">
        <section className="static-hero">
          <div ref={staticStartRef} className="static-hero-img" aria-hidden="true" />
          <div ref={staticEndRef} className="static-hero-img static-hero-img-end" aria-hidden="true" />
          <div className="static-hero-scrim" aria-hidden="true" />
          <div ref={staticTextRef} className="static-hero-text">
            <h1 className="band-head">TRFOX CONTRACTING</h1>
            <p className="band-sub">{BANDS[4].sub}</p>
            <div style={{ marginTop: "1.25rem" }}>
              <Link href={CTA_HREF} className="tap-target hero-btn">
                {CTA_LABEL}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/** The blur entrance crossfades two whole copies, so its text stays
    unsplit: no per-character spans, nothing to assemble. */
function renderPlain(band: Band) {
  if (!band.em) return band.headline;
  const i = band.headline.lastIndexOf(band.em);
  if (i < 0) return band.headline;
  return (
    <>
      {band.headline.slice(0, i)}
      <span className="band-em">{band.em}</span>
      {band.headline.slice(i + band.em.length)}
    </>
  );
}
