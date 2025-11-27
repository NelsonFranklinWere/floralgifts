import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Incomplete circular arc - proper round circle on outer side, covering all content */}
      {/* Perfect circle with gap on left side, large enough to wrap around all text and bouquet */}
      <circle
        cx="200"
        cy="100"
        r="94"
        fill="none"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="590.62"
        strokeDashoffset="50"
        transform="rotate(-90 200 100)"
      />

      {/* "Floral" - Green cursive script at top center */}
      <text
        x="200"
        y="42"
        fontFamily="'Brush Script MT', 'Lucida Handwriting', 'Dancing Script', cursive"
        fontSize="30"
        fill="#10b981"
        textAnchor="middle"
        fontWeight="normal"
        style={{ fontStyle: "italic" }}
      >
        Floral
      </text>

      {/* "WHISPERS" - Large bold red sans-serif capitals - most prominent */}
      <text
        x="200"
        y="88"
        fontFamily="Arial, 'Helvetica Neue', sans-serif"
        fontSize="50"
        fill="#ef4444"
        textAnchor="middle"
        fontWeight="900"
        letterSpacing="4"
      >
        WHISPERS
      </text>

      {/* "GIFTS" - Smaller bold green sans-serif capitals */}
      <text
        x="200"
        y="118"
        fontFamily="Arial, 'Helvetica Neue', sans-serif"
        fontSize="34"
        fill="#10b981"
        textAnchor="middle"
        fontWeight="900"
        letterSpacing="2.5"
      >
        GIFTS
      </text>

      {/* Red outline floral bouquet illustration - positioned to the right, extending slightly outside arc */}
      <g transform="translate(270, 35)">
        {/* Main stem */}
        <path
          d="M 0 45 L 0 65"
          stroke="#ef4444"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Bow at bottom of stem */}
        <path
          d="M -6 65 Q -6 62 -4 62 Q -2 62 -2 64 Q -2 62 0 62 Q 2 62 2 64 Q 2 62 4 62 Q 6 62 6 65"
          stroke="#ef4444"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="-3" cy="63" r="1" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <circle cx="3" cy="63" r="1" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        
        {/* Left branch with leaves */}
        <path
          d="M 0 55 Q -18 48 -25 35"
          stroke="#ef4444"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="-22" cy="32" rx="4" ry="6" fill="none" stroke="#ef4444" strokeWidth="2" transform="rotate(-35 -22 32)" />
        <ellipse cx="-18" cy="40" rx="3" ry="5" fill="none" stroke="#ef4444" strokeWidth="2" transform="rotate(25 -18 40)" />
        
        {/* Right branch with leaves */}
        <path
          d="M 0 55 Q 18 48 25 35"
          stroke="#ef4444"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="22" cy="32" rx="4" ry="6" fill="none" stroke="#ef4444" strokeWidth="2" transform="rotate(35 22 32)" />
        <ellipse cx="18" cy="40" rx="3" ry="5" fill="none" stroke="#ef4444" strokeWidth="2" transform="rotate(-25 18 40)" />
        
        {/* Daisy-like flower (left) - detailed petals */}
        <circle cx="-15" cy="18" r="7" fill="none" stroke="#ef4444" strokeWidth="2" />
        <circle cx="-15" cy="18" r="3.5" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        {/* Petals */}
        <ellipse cx="-15" cy="11" rx="2" ry="4" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <ellipse cx="-8" cy="18" rx="2" ry="4" fill="none" stroke="#ef4444" strokeWidth="1.5" transform="rotate(90 -8 18)" />
        <ellipse cx="-15" cy="25" rx="2" ry="4" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <ellipse cx="-22" cy="18" rx="2" ry="4" fill="none" stroke="#ef4444" strokeWidth="1.5" transform="rotate(90 -22 18)" />
        <path d="M -15 11 L -15 5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        
        {/* Rose-like flower (center top) - layered petals */}
        <path
          d="M 0 8 Q -4 5 -7 8 Q -4 11 0 11 Q 4 11 7 8 Q 4 5 0 8"
          stroke="#ef4444"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 0 11 Q -3 8 -6 11 Q -3 14 0 14 Q 3 14 6 11 Q 3 8 0 11"
          stroke="#ef4444"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 0 14 Q -2 12 -4 14 Q -2 16 0 16 Q 2 16 4 14 Q 2 12 0 14"
          stroke="#ef4444"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="0" cy="12" r="2.5" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M 0 16 L 0 22" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        
        {/* Small flower (right) */}
        <circle cx="15" cy="16" r="5" fill="none" stroke="#ef4444" strokeWidth="2" />
        <circle cx="15" cy="16" r="2.5" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <ellipse cx="15" cy="11" rx="1.5" ry="3" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <ellipse cx="20" cy="16" rx="1.5" ry="3" fill="none" stroke="#ef4444" strokeWidth="1.5" transform="rotate(90 20 16)" />
        <ellipse cx="15" cy="21" rx="1.5" ry="3" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <ellipse cx="10" cy="16" rx="1.5" ry="3" fill="none" stroke="#ef4444" strokeWidth="1.5" transform="rotate(90 10 16)" />
        <path d="M 15 11 L 15 5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        
        {/* Additional decorative leaves on stem */}
        <ellipse cx="-4" cy="50" rx="2.5" ry="4" fill="none" stroke="#ef4444" strokeWidth="1.5" transform="rotate(-50 -4 50)" />
        <ellipse cx="4" cy="50" rx="2.5" ry="4" fill="none" stroke="#ef4444" strokeWidth="1.5" transform="rotate(50 4 50)" />
      </g>

      {/* Slogan "Feel the Beauty and Blossom" - Black bold sans-serif below logo */}
      <text
        x="200"
        y="185"
        fontFamily="Arial, 'Helvetica Neue', sans-serif"
        fontSize="17"
        fill="black"
        textAnchor="middle"
        fontWeight="900"
        letterSpacing="2"
      >
        Feel the Beauty and Blossom
      </text>
    </svg>
  );
}

