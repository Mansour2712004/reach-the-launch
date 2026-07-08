// Logo: the three words of the brand name stacked vertically,
// each line growing in weight/size toward "LAUNCH" — visually reads
// as a countdown building up to the launch moment. A small ascending
// streak (the "launch" cue) cuts across the wordmark in the teal accent.
export default function Logo({ size = 'md', showTagline = false }) {
  const dims = {
    sm: { w: 120, fontTop: 11, fontMid: 9, fontBottom: 22 },
    md: { w: 160, fontTop: 13, fontMid: 10, fontBottom: 28 },
    lg: { w: 220, fontTop: 16, fontMid: 12, fontBottom: 38 },
  }[size]

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <svg width={dims.w} height={dims.fontTop + dims.fontMid + dims.fontBottom + 14} viewBox={`0 0 200 ${dims.fontTop + dims.fontMid + dims.fontBottom + 20}`}>
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0CE8B" />
            <stop offset="100%" stopColor="#D4AF6A" />
          </linearGradient>
        </defs>

        {/* ascending launch streak behind the words */}
        <line x1="8" y1={dims.fontTop + dims.fontMid + dims.fontBottom + 6} x2="150" y2="4" stroke="#1FB6A6" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        <circle cx="150" cy="4" r="3.5" fill="#1FB6A6" />

        <text x="0" y={dims.fontTop} fontFamily="Poppins, sans-serif" fontWeight="600" fontSize={dims.fontTop} letterSpacing="4" fill="#8B96A8">
          REACH
        </text>
        <text x="0" y={dims.fontTop + dims.fontMid + 2} fontFamily="Poppins, sans-serif" fontWeight="500" fontSize={dims.fontMid} letterSpacing="6" fill="#1FB6A6">
          THE
        </text>
        <text x="0" y={dims.fontTop + dims.fontMid + dims.fontBottom + 2} fontFamily="Poppins, sans-serif" fontWeight="800" fontSize={dims.fontBottom} letterSpacing="1" fill="url(#goldGrad)">
          LAUNCH
        </text>
      </svg>
      {showTagline && (
        <span className="hidden md:block text-xs text-mist border-l border-white/10 pl-2 ml-1 leading-tight">
          Every project.<br />Its best moment.
        </span>
      )}
    </div>
  )
}
