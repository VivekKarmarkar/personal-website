import { Vector2D } from '../lib/constants';
import { MagneticDipole2D, calculateMagneticField } from '../lib/dipoleField';

interface MagneticFieldLines2DProps {
  dipole: MagneticDipole2D;
  visible: boolean;
  viewBox: { width: number; height: number };
  density: number;
  strength: number; // 0-1 range for controlling opacity/brightness
}

export function MagneticFieldLines2D({ dipole, visible, viewBox, density, strength }: MagneticFieldLines2DProps) {
  if (!visible || strength === 0) return null;

  const arrows: JSX.Element[] = [];
  const gridSpacing = 50;

  // Create grid of field vectors
  for (let x = -300; x <= 300; x += gridSpacing) {
    for (let y = -200; y <= 200; y += gridSpacing) {
      const position: Vector2D = { x, y };
      const field = calculateMagneticField(dipole, position);

      const fieldMagnitude = Math.sqrt(field.x * field.x + field.y * field.y);
      const distanceFromDipole = Math.sqrt(
        (position.x - dipole.position.x) ** 2 + (position.y - dipole.position.y) ** 2
      );

      // Skip only if too close to magnet
      if (distanceFromDipole < 50) continue;

      // Normalize field vector for arrow direction
      const fieldDirection = {
        x: field.x / fieldMagnitude,
        y: field.y / fieldMagnitude,
      };

      // Fixed arrow length for visibility
      const arrowLength = 15;
      const endX = position.x + fieldDirection.x * arrowLength;
      const endY = position.y + fieldDirection.y * arrowLength;

      // Bright red color for visibility
      const color = 'red';

      arrows.push(
        <g key={`arrow-${x}-${y}`}>
          <line
            x1={position.x}
            y1={position.y}
            x2={endX}
            y2={endY}
            stroke={color}
            strokeWidth={2}
            opacity={strength * 0.8}
          />
          <circle
            cx={endX}
            cy={endY}
            r={2}
            fill={color}
            opacity={strength * 0.8}
          />
        </g>
      );
    }
  }

  return <g className="magnetic-field-lines">{arrows}</g>;
}
