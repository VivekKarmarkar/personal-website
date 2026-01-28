interface BarMagnet2DProps {
  position: { x: number; y: number };
  rotation: number;
  strength: number;
  width: number;
  height: number;
}

export function BarMagnet2D({ position, rotation, strength, width, height }: BarMagnet2DProps) {
  const transform = `translate(${position.x}, ${position.y}) rotate(${(rotation * 180) / Math.PI})`;

  return (
    <g transform={transform}>
      {/* North pole (red) */}
      <rect
        x={-width / 4}
        y={-height / 2}
        width={width / 2}
        height={height}
        fill={`hsl(0, ${60 + strength * 40}%, ${40 + strength * 20}%)`}
        stroke="hsl(0, 50%, 30%)"
        strokeWidth={2}
      />

      {/* South pole (blue) */}
      <rect
        x={(-width * 3) / 4}
        y={-height / 2}
        width={width / 2}
        height={height}
        fill={`hsl(220, ${60 + strength * 40}%, ${40 + strength * 20}%)`}
        stroke="hsl(220, 50%, 30%)"
        strokeWidth={2}
      />

      {/* Labels */}
      <text
        x={-width / 8}
        y={height / 4}
        textAnchor="middle"
        fill="white"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        N
      </text>

      <text
        x={(-width * 5) / 8}
        y={height / 4}
        textAnchor="middle"
        fill="white"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        S
      </text>
    </g>
  );
}
