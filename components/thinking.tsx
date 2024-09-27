"use client";

import React from "react";

interface ColorStop {
  color: string;
  position: number;
}

interface ThinkingProps {
  text: string;
  fontSize: number;
  animationDuration: number;
  colorStops: ColorStop[];
}

export default function Thinking({
  text,
  fontSize,
  animationDuration,
  colorStops,
}: ThinkingProps) {
  const gradientString = createGradientString(colorStops);

  return (
    <div
      className="thinking-text text-center w-full max-w-full overflow-hidden"
      aria-label="AI is thinking"
    >
      {text}
      <style jsx>{`
        @keyframes gradient-animation {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .thinking-text {
          background: ${gradientString};
          background-size: 200% 100%;
          animation: gradient-animation ${animationDuration}s linear infinite;
          will-change: background-position;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          font-size: clamp(8px, ${fontSize}px, 100px);
          line-height: 1.2;
          white-space: nowrap;
        }

        @media (prefers-reduced-motion: reduce) {
          .thinking-text {
            animation: none;
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}

function createGradientString(colorStops: ColorStop[]): string {
  const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);

  if (sortedStops.length < 2) {
    sortedStops.push({ ...sortedStops[0], position: 100 });
  }

  const gradientParts = sortedStops.map(
    (stop) => `${stop.color} ${stop.position}%`
  );
  const repeatedGradient = [...gradientParts, ...gradientParts].join(", ");
  return `linear-gradient(to right, ${repeatedGradient})`;
}
