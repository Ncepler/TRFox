"use client";

import { useRef } from "react";
import Image from "next/image";
import ProjectGallery from "@/components/ProjectGallery";
import type { ProjectImage } from "@/data/projects";

type ProjectFrameProps = {
  address: string;
  area: string;
  sf?: number;
  images: ProjectImage[];
};

// Wraps the framed hero photo and the (untouched) ProjectGallery together.
// ProjectGallery owns the only "View project" button in this subtree before
// the lightbox opens, so forwarding a click to it here opens the same
// gallery without adding any prop or edit to ProjectGallery itself.
export default function ProjectFrame({ address, area, sf, images }: ProjectFrameProps) {
  const galleryWrapRef = useRef<HTMLDivElement>(null);
  const hero = images[0];

  const openGallery = () => {
    galleryWrapRef.current?.querySelector<HTMLButtonElement>("button")?.click();
  };

  return (
    <div className="mt-4">
      <div
        role="button"
        tabIndex={0}
        onClick={openGallery}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openGallery();
          }
        }}
        aria-label={`View photos of ${address}`}
        className="group relative block w-full cursor-pointer rounded-lg p-3 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ backgroundColor: "var(--color-canvas-deep)" }}
      >
        {/* Blueprint-style register marks on the mat itself, clear of the
            photo so they read against a fixed light background no matter
            how dark or busy the photo underneath is. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 top-0.5 h-3 w-3 border-l border-t"
          style={{ borderColor: "var(--color-accent)" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0.5 top-0.5 h-3 w-3 border-r border-t"
          style={{ borderColor: "var(--color-accent)" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0.5 left-0.5 h-3 w-3 border-b border-l"
          style={{ borderColor: "var(--color-accent)" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0.5 right-0.5 h-3 w-3 border-b border-r"
          style={{ borderColor: "var(--color-accent)" }}
        />
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-sm border"
          style={{ borderColor: "var(--color-line)" }}
        >
          <Image
            src={hero.url}
            alt={hero.caption || `${address}${area ? `, ${area}` : ""}`}
            fill
            sizes="(min-width: 768px) 32rem, 92vw"
            loading="lazy"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
        {(area || sf) && (
          <div
            className="mt-2 flex items-baseline justify-between font-display text-[0.6875rem] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--color-ink-soft)" }}
          >
            <span>{area}</span>
            {sf ? <span>{sf.toLocaleString("en-US")} sf</span> : null}
          </div>
        )}
      </div>
      <div ref={galleryWrapRef}>
        <ProjectGallery address={address} images={images} />
      </div>
    </div>
  );
}
