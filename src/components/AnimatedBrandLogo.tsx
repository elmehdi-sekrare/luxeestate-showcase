import { motion } from "framer-motion";

/**
 * Animated Shems Almadina brand logo — SVG leaf/petal sunburst
 * inspired by the brand's green petal icon.
 * Each petal enters with stagger + rotation + scale, then gently pulses.
 */
export function AnimatedBrandLogo({ size = 280 }: { size?: number }) {
  const center = size / 2;
  const petalCount = 8;
  const petalColors = [
    "#8DC63F", "#6AAF35", "#4CAF50", "#388E3C",
    "#7CB342", "#558B2F", "#66BB6A", "#43A047",
  ];

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="drop-shadow-2xl"
      initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer glow */}
      <defs>
        <radialGradient id="brand-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
        </radialGradient>
        <filter id="petal-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#4CAF50" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background glow circle */}
      <motion.circle
        cx={center}
        cy={center}
        r={center * 0.9}
        fill="url(#brand-glow)"
        animate={{ r: [center * 0.85, center * 0.95, center * 0.85] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Petals arranged in a circle */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (360 / petalCount) * i;
        const color = petalColors[i % petalColors.length];
        const petalLength = 42 + (i % 2) * 12; // alternate sizes
        const petalWidth = 18 + (i % 3) * 4;

        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.4 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              transformOrigin: `${center}px ${center}px`,
            }}
          >
            <motion.g
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{
                duration: 6 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              style={{
                transformOrigin: `${center}px ${center}px`,
              }}
            >
              {/* Teardrop/leaf petal */}
              <motion.path
                d={createPetalPath(center, center, petalLength, petalWidth, angle)}
                fill={color}
                filter="url(#petal-shadow)"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.85, 1, 0.85],
                }}
                transition={{
                  duration: 3 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                style={{
                  transformOrigin: `${center}px ${center}px`,
                }}
              />
            </motion.g>
          </motion.g>
        );
      })}

      {/* Center dot */}
      <motion.circle
        cx={center}
        cy={center}
        r={8}
        fill="#4CAF50"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          delay: 1,
        }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />
      <motion.circle
        cx={center}
        cy={center}
        r={4}
        fill="#8DC63F"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />
    </motion.svg>
  );
}

/** Generate a teardrop/leaf petal SVG path */
function createPetalPath(
  cx: number,
  cy: number,
  length: number,
  width: number,
  angleDeg: number,
): string {
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  // Tip of the petal (far from center)
  const tipX = cx + Math.cos(angleRad) * length;
  const tipY = cy + Math.sin(angleRad) * length;
  // Base offset perpendicular
  const perpRad = angleRad + Math.PI / 2;
  const halfW = width / 2;
  // Control points for the bezier curves
  const midDist = length * 0.55;
  const midX = cx + Math.cos(angleRad) * midDist;
  const midY = cy + Math.sin(angleRad) * midDist;

  const cp1x = midX + Math.cos(perpRad) * halfW;
  const cp1y = midY + Math.sin(perpRad) * halfW;
  const cp2x = midX - Math.cos(perpRad) * halfW;
  const cp2y = midY - Math.sin(perpRad) * halfW;

  return `M ${cx} ${cy} Q ${cp1x} ${cp1y} ${tipX} ${tipY} Q ${cp2x} ${cp2y} ${cx} ${cy} Z`;
}

/** Animated brand name text */
export function AnimatedBrandName() {
  const letters = "SHAMS EL MEDINA".split("");

  return (
    <div className="mt-6 flex items-center justify-center gap-1">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.5 + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`inline-block font-display text-2xl tracking-[0.15em] md:text-3xl ${
            letter === " " ? "w-3" : "text-cream"
          }`}
          style={{ perspective: "600px" }}
        >
          <motion.span
            animate={{ color: ["#F5F0E8", "#C9A84C", "#F5F0E8"] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          >
            {letter}
          </motion.span>
        </motion.span>
      ))}
    </div>
  );
}
