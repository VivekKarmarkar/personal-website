import { Vector2D } from '../lib/constants';
import { MagneticDipole2D, calculateMagneticField } from '../lib/dipoleField';

interface Compass2DProps {
  position: Vector2D;
  dipole: MagneticDipole2D;
  visible: boolean;
  size: number;
}

export function Compass2D({ position, dipole, visible, size }: Compass2DProps) {
  if (!visible) return null;

  // Calculate magnetic field at compass position
  const field = calculateMagneticField(dipole, position);
  const fieldMagnitude = Math.sqrt(field.x * field.x + field.y * field.y);

  // Calculate needle angle (pointing in field direction, or default to north if no field)
  const needleAngle = fieldMagnitude < 1e-10 ? -Math.PI / 2 : Math.atan2(field.y, field.x);

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      {/* Compass body */}
      <circle
        cx={0}
        cy={0}
        r={size}
        fill="hsl(0, 0%, 95%)"
        stroke="hsl(0, 0%, 20%)"
        strokeWidth={3}
      />

      {/* Compass needle */}
      <g transform={`rotate(${(needleAngle * 180) / Math.PI})`}>
        {/* Needle body (thin line connecting both ends) */}
        <line
          x1={-size * 0.6}
          y1={0}
          x2={size * 0.6}
          y2={0}
          stroke="hsl(0, 0%, 30%)"
          strokeWidth={size * 0.08}
          strokeLinecap="round"
        />

        {/* North end (red arrowhead) */}
        <path
          d={`M ${size * 0.4},0 L ${size * 0.7},0 L ${size * 0.55},${size * 0.15} L ${size * 0.55},-${size * 0.15} Z`}
          fill="hsl(0, 70%, 50%)"
        />

        {/* South end (dark blunt end) */}
        <path
          d={`M -${size * 0.4},0 L -${size * 0.6},0 L -${size * 0.6},${size * 0.08} L -${size * 0.6},-${size * 0.08} Z`}
          fill="hsl(0, 0%, 20%)"
        />
      </g>

      {/* Center pin */}
      <circle cx={0} cy={0} r={size * 0.1} fill="hsl(0, 0%, 30%)" />
    </g>
  );
}
