/**
 * Brand watermark — Green flower logo + شمس المدينة in big Arabic text.
 * High visibility, positioned above section backgrounds with z-index.
 */
export function BrandWatermark({ className = "", size = "lg", align = "center" }: { className?: string; size?: "md" | "lg"; align?: "center" | "start" }) {
  const logoSize = size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const textSize = size === "lg" ? "text-5xl" : "text-3xl";
  const alignClass = align === "start" ? "items-start" : "items-center";

  return (
    <div className={`pointer-events-none relative z-30 flex flex-col ${alignClass} gap-3 select-none ${className}`}>
      {/* Flower logo — 8 petals in rich green shades */}
      <svg viewBox="0 0 100 100" className={logoSize}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const colors = [
            "#145A32", "#1B6B3A", "#228B45", "#2D9B55",
            "#145A32", "#1B6B3A", "#228B45", "#0D4F2B",
          ];
          const rad = (angle * Math.PI) / 180;
          const cx = 50 + 22 * Math.cos(rad);
          const cy = 50 + 22 * Math.sin(rad);
          return (
            <ellipse
              key={angle}
              cx={cx}
              cy={cy}
              rx="12"
              ry="7"
              fill={colors[i]}
              transform={`rotate(${angle}, ${cx}, ${cy})`}
            />
          );
        })}
        <circle cx="50" cy="50" r="8" fill="white" />
        <circle cx="50" cy="50" r="5" fill="#1B6B3A" opacity="0.4" />
      </svg>

      {/* Arabic text — high contrast on light backgrounds */}
      <p
        className={`font-display ${textSize} font-bold tracking-wide`}
        style={{ direction: "rtl", color: "#0B3D21", textShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
      >
        شمس المدينة
      </p>
    </div>
  );
}
