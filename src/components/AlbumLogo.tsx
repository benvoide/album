export function AlbumLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Album"
    >
      <text
        x="0"
        y="20"
        fontFamily="var(--font-display), system-ui, sans-serif"
        fontSize="20"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-0.03em"
      >
        Album
      </text>
    </svg>
  );
}
