interface LightBulb2DProps {
  position: { x: number; y: number };
  brightness: number; // 0-1
  power: number;
  isPlaying?: boolean;
}

export function LightBulb2D({ position, brightness, power, isPlaying = true }: LightBulb2DProps) {
  const glowRadius = 30 + brightness * 20;
  const filamentOpacity = 0.3 + brightness * 0.7;

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      {/* Glow effect */}
      {brightness > 0.1 && (
        <circle
          cx={0}
          cy={0}
          r={glowRadius}
          fill="hsl(50, 100%, 70%)"
          opacity={brightness * 0.3}
          style={isPlaying ? { animation: 'pulse 2s ease-in-out infinite' } : {}}
        />
      )}

      {/* Bulb outline */}
      <circle
        cx={0}
        cy={-5}
        r={20}
        fill="none"
        stroke="hsl(0, 0%, 60%)"
        strokeWidth={2}
      />

      {/* Filament */}
      <g opacity={filamentOpacity}>
        <path
          d="M -8,-10 Q 0,-5 8,-10 Q 0,0 -8,-10"
          fill="none"
          stroke="hsl(30, 100%, 60%)"
          strokeWidth={2}
        />
        <path
          d="M -8,-5 Q 0,0 8,-5 Q 0,5 -8,-5"
          fill="none"
          stroke="hsl(30, 100%, 60%)"
          strokeWidth={2}
        />
      </g>

      {/* Base */}
      <rect
        x={-12}
        y={15}
        width={24}
        height={15}
        fill="hsl(0, 0%, 40%)"
        stroke="hsl(0, 0%, 30%)"
        strokeWidth={1}
      />

      {/* Connecting wires */}
      <line
        x1={-15}
        y1={25}
        x2={-30}
        y2={25}
        stroke="hsl(0, 0%, 30%)"
        strokeWidth={3}
      />
      <line
        x1={15}
        y1={25}
        x2={30}
        y2={25}
        stroke="hsl(0, 0%, 30%)"
        strokeWidth={3}
      />
    </g>
  );
}
