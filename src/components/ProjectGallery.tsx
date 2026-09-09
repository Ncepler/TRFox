"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

function photoSrc(id: string, n: number) {
  return `/projects/${id}/${String(n).padStart(2, "0")}.jpg`;
}

const CLOSE_MS = 200;

export default function ProjectGallery({ project }: { project: Project }) {
  const { photoCount } = project;
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex(((i % photoCount) + photoCount) % photoCount),
    [photoCount]
  );
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  const open = (i: number) => {
    setIndex(i);
    setMounted(true);
  };

  const close = useCallback(() => {
    setVisible(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMounted(false), CLOSE_MS);
    triggerRef.current?.focus();
  }, []);

  // Mount → next frame → fade in. Keeps the transition CSS-driven, not JS-timed.
  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    dialogRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, close, prev, next]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  if (photoCount <= 0) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="tap-target mt-2 font-display text-sm"
        style={{ color: "var(--color-accent)" }}
        onClick={() => open(0)}
      >
        View project
      </button>

      {mounted && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={project.address}
          tabIndex={-1}
          className={`fixed inset-0 z-[100] flex flex-col transition-opacity duration-200 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundColor: "rgba(25,23,20,0.96)" }}
          onClick={close}
        >
          <button
            type="button"
            className="tap-target absolute right-4 top-4 z-10 font-display text-sm"
            style={{ color: "var(--color-canvas)" }}
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            Close
          </button>

          {/* This wrapper is deliberately the click-to-close scrim: only the
              photo box below it (and its own descendants) stop propagation. */}
          <div className="flex min-h-0 flex-1 items-center justify-center p-4 md:p-10">
            <div
              className="relative h-full w-full"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                if (touchStartX.current == null) return;
                const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
                if (Math.abs(dx) > 40) {
                  if (dx < 0) next();
                  else prev();
                }
                touchStartX.current = null;
              }}
            >
              <Image
                key={index}
                src={photoSrc(project.id, index + 1)}
                alt={`${project.address}, photo ${index + 1} of ${photoCount}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority={index === 0}
              />
              {photoCount > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    className="absolute inset-y-0 left-0 w-1/3"
                    onClick={prev}
                  />
                  <button
                    type="button"
                    aria-label="Next photo"
                    className="absolute inset-y-0 right-0 w-1/3"
                    onClick={next}
                  />
                </>
              )}
            </div>
          </div>

          <div
            className="px-6 pb-4 text-center font-display text-sm md:px-10"
            style={{ color: "var(--color-canvas)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p>
              {project.address}
              {project.area && project.area !== project.address ? `, ${project.area}` : ""}
            </p>
            {project.scope ? (
              <p className="mt-1" style={{ color: "rgba(243,243,243,0.7)" }}>
                {project.scope}
              </p>
            ) : null}
          </div>

          {photoCount > 1 && (
            <div className="px-6 pb-6 md:px-10" onClick={(e) => e.stopPropagation()}>
              <div className="relative mx-auto flex h-4 max-w-md items-center">
                <div className="absolute inset-x-0 h-px" style={{ backgroundColor: "var(--color-line)" }} />
                <div className="relative flex w-full justify-between">
                  {Array.from({ length: photoCount }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to photo ${i + 1} of ${photoCount}`}
                      aria-current={i === index}
                      onClick={() => goTo(i)}
                      className="tap-target flex h-4 w-4 items-center justify-center"
                    >
                      <span
                        className="block h-2 w-2 rotate-45 border"
                        style={
                          i === index
                            ? { backgroundColor: "var(--color-accent)", borderColor: "var(--color-accent)" }
                            : { backgroundColor: "transparent", borderColor: "var(--color-line)" }
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
