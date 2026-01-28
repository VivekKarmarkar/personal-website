interface CircularCoil2DProps {
  position: { x: number; y: number };
  radius: number;
  turns: number;
  current: number;
  showElectrons: boolean;
}

export function CircularCoil2D({ position, radius, turns, current, showElectrons }: CircularCoil2DProps) {
  const coilWidth = turns * 12; // Width based on number of turns (horizontal orientation)
  const wireThickness = 8; // Increased thickness for more substantial appearance
  const electronsPerTurn = 8; // Number of electrons per coil turn

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      {/* Solenoid coil - side view showing circular windings arranged horizontally */}
      {Array.from({ length: turns }, (_, i) => {
        const x = turns === 1 ? 0 : -coilWidth / 2 + (i * coilWidth) / (turns - 1);
        return (
          <g key={i}>
            {/* Coil winding - ellipse to show 3D perspective (rotated 90 degrees) */}
            <ellipse
              cx={x}
              cy={0}
              rx={radius * 0.3} // Flattened to show perspective
              ry={radius}
              fill="none"
              stroke="hsl(35, 70%, 45%)"
              strokeWidth={wireThickness}
            />

            {/* Top and bottom connection lines */}
            {i < turns - 1 && (
              <>
                <line
                  x1={x}
                  y1={-radius}
                  x2={turns === 1 ? x : -coilWidth / 2 + ((i + 1) * coilWidth) / (turns - 1)}
                  y2={-radius}
                  stroke="hsl(35, 70%, 45%)"
                  strokeWidth={wireThickness * 0.8}
                />
                <line
                  x1={x}
                  y1={radius}
                  x2={turns === 1 ? x : -coilWidth / 2 + ((i + 1) * coilWidth) / (turns - 1)}
                  y2={radius}
                  stroke="hsl(35, 70%, 45%)"
                  strokeWidth={wireThickness * 0.8}
                />
              </>
            )}
          </g>
        );
      })}

      {/* Moving electrons with minus signs - physics based velocity */}
      {showElectrons && (
        <>
          {Array.from({ length: electronsPerTurn * turns }, (_, i) => {
            const turnIndex = Math.floor(i / electronsPerTurn);
            const electronIndex = i % electronsPerTurn;

            // Physics-based electron velocity: v = I * v_scale (fixed at optimal value)
            const electronVelocityScale = 0.02; // Fixed optimal scaling factor
            const electronVelocity = current * electronVelocityScale * 10; // Add additional scaling for visibility

            // Base angle position for this electron
            const baseAngle = (electronIndex * 2 * Math.PI) / electronsPerTurn;

            // Time-based movement with physics velocity
            const timePhase = performance.now() * 0.001; // Remove modulo to allow continuous movement
            const angle = baseAngle + (electronVelocity * timePhase) % (2 * Math.PI);

            // Position along the elliptical coil winding path
            const turnCenterX = turns === 1 ? 0 : -coilWidth / 2 + (turnIndex * coilWidth) / (turns - 1);
            const ellipseRx = radius * 0.3; // Horizontal radius (flattened perspective)
            const ellipseRy = radius; // Vertical radius

            // Calculate position on the ellipse
            const x = turnCenterX + ellipseRx * Math.cos(angle);
            const y = ellipseRy * Math.sin(angle);

            return (
              <g key={i}>
                {/* Blue electron dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={3}
                  fill="hsl(220, 100%, 60%)"
                  stroke="hsl(220, 100%, 40%)"
                  strokeWidth={1}
                />
                {/* White minus sign */}
                <line
                  x1={x - 2}
                  y1={y}
                  x2={x + 2}
                  y2={y}
                  stroke="white"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </>
      )}
    </g>
  );
}
