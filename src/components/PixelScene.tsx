type Props = {
  /** 0-1 volume of the rainfall track, drives the window rain density. */
  rain: number;
  fire: number;
  sketching: boolean;
  swayingTail: boolean;
};

const RAIN_DROPS = Array.from({ length: 14 }, (_, index) => ({
  x: 6 + (index % 7) * 13,
  delay: (index * 0.17) % 1.1,
  y: index < 7 ? 0 : 20,
}));

export default function PixelScene({ rain, fire, sketching, swayingTail }: Props) {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-cream/10 bg-gradient-to-b from-[#2B3A3D] to-[#1E292B] shadow-inner">
      <svg
        viewBox="0 0 100 76"
        className="h-full w-full [image-rendering:pixelated]"
        shapeRendering="crispEdges"
        role="img"
        aria-label="Pixel art of a sleeping cat on an armchair by a rainy window"
      >
        <rect x="0" y="0" width="100" height="76" fill="#25332F" />

        {/* rainy window */}
        <rect x="8" y="6" width="52" height="38" fill="#3C5A63" />
        <g opacity={0.25 + rain * 0.75}>
          {RAIN_DROPS.map((drop) => (
            <rect
              key={`${drop.x}-${drop.delay}`}
              x={10 + drop.x * 0.62}
              y={drop.y}
              width="1"
              height="4"
              fill="#9FD3E0"
              className="animate-rainfall"
              style={{ animationDelay: `${drop.delay}s`, transformBox: "fill-box" }}
            />
          ))}
        </g>
        <rect x="8" y="6" width="52" height="38" fill="none" stroke="#7E998A" strokeWidth="2" />
        <rect x="33" y="6" width="2" height="38" fill="#7E998A" />
        <rect x="8" y="24" width="52" height="2" fill="#7E998A" />
        <rect x="6" y="44" width="56" height="3" fill="#5D7A70" />

        {/* fireplace glow on the right */}
        <rect x="76" y="34" width="18" height="22" fill="#2C3A34" />
        {/* volume opacity and the flicker animation must live on separate nodes:
            the animation's own opacity keyframes override the attribute. */}
        <g opacity={0.35 + fire * 0.65}>
          <g className="animate-flicker">
            <rect x="80" y="44" width="10" height="10" fill="#E0A458" />
            <rect x="82" y="40" width="6" height="6" fill="#F2C078" />
          </g>
        </g>

        {/* armchair */}
        <rect x="20" y="44" width="34" height="10" fill="#6F8C7E" />
        <rect x="16" y="48" width="6" height="18" fill="#7E998A" />
        <rect x="52" y="48" width="6" height="18" fill="#7E998A" />
        <rect x="16" y="60" width="42" height="10" fill="#7E998A" />
        <rect x="18" y="70" width="4" height="4" fill="#4F6459" />
        <rect x="52" y="70" width="4" height="4" fill="#4F6459" />

        {/* sleeping cat */}
        <g style={{ transformOrigin: "36px 58px" }} className="animate-breathe">
          <rect x="26" y="54" width="22" height="8" fill="#FAF6EE" />
          <rect x="24" y="56" width="4" height="6" fill="#FAF6EE" />
          <rect x="44" y="50" width="10" height="8" fill="#FAF6EE" />
          <rect x="44" y="48" width="2" height="3" fill="#FAF6EE" />
          <rect x="52" y="48" width="2" height="3" fill="#FAF6EE" />
          <rect x="46" y="53" width="2" height="1" fill="#1E292B" />
          <rect x="50" y="53" width="2" height="1" fill="#1E292B" />
          <rect x="48" y="55" width="2" height="1" fill="#E0A458" />
        </g>
        <rect
          x="22"
          y="60"
          width="8"
          height="3"
          fill="#FAF6EE"
          style={{ transformOrigin: "30px 61px" }}
          className={swayingTail ? "animate-tailsway" : undefined}
        />

        {/* zzz / sketch bubble */}
        {sketching ? (
          <g className="animate-bubble">
            <rect x="58" y="34" width="16" height="12" rx="2" fill="#FAF6EE" />
            <rect x="60" y="46" width="3" height="3" fill="#FAF6EE" />
            <rect x="61" y="38" width="10" height="1" fill="#7E998A" />
            <rect x="61" y="41" width="7" height="1" fill="#7E998A" />
          </g>
        ) : (
          <g opacity="0.8">
            <text x="58" y="44" fill="#FAF6EE" fontSize="7" fontFamily="monospace">
              z
            </text>
            <text x="64" y="38" fill="#FAF6EE" fontSize="5" fontFamily="monospace">
              z
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
