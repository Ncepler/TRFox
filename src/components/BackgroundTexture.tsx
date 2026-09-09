// Static plaster-grain texture over the flat --canvas field. No animation,
// no interaction; purely decorative, so it stays out of the accessibility tree.
export default function BackgroundTexture() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 mix-blend-multiply opacity-[0.025]"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <filter id="plaster-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#plaster-grain)" />
    </svg>
  );
}
