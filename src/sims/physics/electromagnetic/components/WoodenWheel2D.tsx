interface WoodenWheel2DProps {
  position: { x: number; y: number };
  radius: number;
  rotation: number;
}

export function WoodenWheel2D({ position, radius, rotation }: WoodenWheel2DProps) {
  const transform = `translate(${position.x}, ${position.y}) rotate(${(rotation * 180) / Math.PI})`;

  return (
    <g transform={transform}>
      {/* Main wheel */}
      <circle
        cx={0}
        cy={0}
        r={radius}
        fill="hsl(30, 40%, 35%)"
        stroke="hsl(25, 35%, 30%)"
        strokeWidth={3}
      />

      {/* Spokes */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const x2 = Math.cos(angle) * radius * 0.8;
        const y2 = Math.sin(angle) * radius * 0.8;
        return (
          <line
            key={i}
            x1={0}
            y1={0}
            x2={x2}
            y2={y2}
            stroke="hsl(25, 35%, 30%)"
            strokeWidth={4}
          />
        );
      })}

      {/* Bar magnet stretching along full diameter (AO = N pole, OB = S pole) */}
      <g>
        {/* North pole (AO) - from center to positive x */}
        <rect
          x={0}
          y={-12}
          width={radius}
          height={24}
          fill="hsl(0, 70%, 50%)"
          stroke="hsl(0, 50%, 30%)"
          strokeWidth={1}
        />

        {/* South pole (OB) - from center to negative x */}
        <rect
          x={-radius}
          y={-12}
          width={radius}
          height={24}
          fill="hsl(220, 70%, 50%)"
          stroke="hsl(220, 50%, 30%)"
          strokeWidth={1}
        />

        {/* Labels */}
        <text
          x={radius * 0.5}
          y={3}
          textAnchor="middle"
          fill="white"
          style={{ fontSize: '12px', fontWeight: 'bold' }}
        >
          N
        </text>

        <text
          x={-radius * 0.5}
          y={3}
          textAnchor="middle"
          fill="white"
          style={{ fontSize: '12px', fontWeight: 'bold' }}
        >
          S
        </text>
      </g>

      {/* Center hub */}
      <circle
        cx={0}
        cy={0}
        r={radius * 0.15}
        fill="hsl(0, 0%, 20%)"
        stroke="hsl(0, 0%, 15%)"
        strokeWidth={2}
      />
    </g>
  );
}
