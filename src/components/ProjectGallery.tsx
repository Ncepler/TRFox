"use client";

import { useEffect, useRef, useState } from "react";

type ProjectGalleryProps = {
  slug: string;
  address: string;
  scope: string;
  photoCount: number;
};

export default function ProjectGallery({ slug, address, scope, photoCount }: ProjectGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const photos = Array.from({ length: photoCount }, (_, i) =>
    `/projects/${slug}/${String(i + 1).padStart(2, "0")}.jpg`
  );

  const openGallery = () => {
    setIndex(0);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIndex((i) => (i + 1) % photos.length);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openGallery}
        className="tap-target mt-3 inline-block border-b border-accent font-display text-sm"
        style={{ color: "var(--color-accent)" }}
      >
        View project
      </button>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photos of ${address}`}
          tabIndex={-1}
          className="gallery-scrim fixed inset-0 z-[100] flex flex-col outline-none"
          // Spec calls for rgba(25,23,20,0.96), but that value is nearly
          // identical to --ink, so the 4% transparency lets the page's own
          // text-shaped negative space bleed through as visible ghosting.
          // Fully opaque keeps the same near-black color and actually
          // achieves "the photo reads as the only thing in the room."
          style={{ backgroundColor: "rgb(25,23,20)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            onClick={close}
            className="tap-target absolute right-4 top-4 z-10 font-display text-sm"
            style={{ color: "var(--color-canvas)" }}
          >
            Close
          </button>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[index]}
              alt={`${address}, photo ${index + 1} of ${photos.length}`}
              className="max-h-full max-w-full object-contain"
            />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={prev}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize"
                />
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={next}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize"
                />
              </>
            )}
          </div>

          <div className="px-6 pb-3 text-center font-display text-sm" style={{ color: "var(--color-canvas)" }}>
            <span>{address}</span>
            {scope ? <span className="opacity-70">. {scope}</span> : null}
          </div>

          {photos.length > 1 && (
            <div className="px-6 pb-8">
              <svg
                className="mx-auto block w-full max-w-md"
                height="12"
                viewBox={`0 0 ${photos.length * 24} 12`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line
                  x1="0"
                  y1="6"
                  x2={photos.length * 24}
                  y2="6"
                  stroke="var(--color-line)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="mx-auto -mt-3 flex max-w-md justify-between">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to photo ${i + 1} of ${photos.length}`}
                    aria-current={i === index}
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
          )}
        </div>
      )}
    </>
  );
}
