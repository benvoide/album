"use client";

export function AlbumLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Album"
    >
      {/* "Alb" text */}
      <text
        x="0"
        y="26"
        fontFamily="var(--font-display), system-ui, sans-serif"
        fontSize="24"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-0.02em"
      >
        Alb
      </text>

      {/* Album as "um" - open book with flipping pages */}
      <g transform="translate(52, 4)">
        {/* Album base - open book shape */}
        <path
          d="M 0 24 L 0 4 Q 0 0 4 0 L 20 0 Q 24 0 24 4 L 24 24 Q 24 28 20 28 L 4 28 Q 0 28 0 24 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Left page */}
        <path
          d="M 4 4 L 4 24 L 12 24 L 12 4 Z"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        {/* Right page */}
        <path
          d="M 20 4 L 20 24 L 12 24 L 12 4 Z"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        {/* Spine */}
        <line
          x1="12"
          y1="4"
          x2="12"
          y2="24"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        {/* Flipping page - animated */}
        <path
          d="M 12 4 L 12 24 L 24 24 L 24 4 Z"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.4"
          style={{
            transformOrigin: "12px 14px",
            animation: "pageFlip 2.5s ease-in-out infinite",
          }}
        />
      </g>
    </svg>
  );
}
