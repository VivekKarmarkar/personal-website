import React, { useState, useRef, useCallback, useEffect } from 'react';

interface WaterFaucet2DProps {
  position: { x: number; y: number };
  rpm: number;
  onRPMChange: (rpm: number) => void;
}

export function WaterFaucet2D({ position, rpm, onRPMChange }: WaterFaucet2DProps) {
  const [isDragging, setIsDragging] = useState(false);
  const faucetRef = useRef<SVGGElement>(null);
  const dragStartX = useRef(0);
  const initialHandleX = useRef(0);

  // Map RPM (0-120) to handle position (0 to 100)
  const handleX = (rpm / 120) * 100;

  // Water flow intensity based on RPM
  const flowIntensity = rpm / 120;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!faucetRef.current) return;

      setIsDragging(true);
      dragStartX.current = e.clientX;
      initialHandleX.current = handleX;

      e.preventDefault();
    },
    [handleX]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartX.current;
      // Convert screen pixels to SVG units (scale factor)
      const scaleFactor = 0.3;
      const newHandleX = Math.max(0, Math.min(100, initialHandleX.current + deltaX * scaleFactor));

      // Convert handle position back to RPM
      const newRPM = Math.round((newHandleX / 100) * 120);
      onRPMChange(Math.max(0, Math.min(120, newRPM)));
    },
    [isDragging, onRPMChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <g>
      {/* Horizontal Tap Control */}
      <g transform={`translate(${position.x}, ${position.y})`}>
        {/* Control base */}
        <rect
          x={-60}
          y={-15}
          width={120}
          height={30}
          fill="hsl(220, 15%, 50%)"
          stroke="hsl(220, 15%, 35%)"
          strokeWidth={2}
          rx={15}
        />

        {/* Slider track */}
        <rect
          x={-50}
          y={-5}
          width={100}
          height={10}
          fill="hsl(220, 10%, 30%)"
          stroke="hsl(220, 10%, 20%)"
          strokeWidth={1}
          rx={5}
        />

        {/* Draggable slider handle */}
        <g
          ref={faucetRef}
          transform={`translate(${-50 + handleX}, 0)`}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
        >
          <circle
            cx={0}
            cy={0}
            r={12}
            fill={isDragging ? 'hsl(200, 70%, 60%)' : 'hsl(200, 50%, 65%)'}
            stroke="hsl(200, 40%, 45%)"
            strokeWidth={2}
          />
          <circle cx={0} cy={0} r={6} fill="hsl(200, 30%, 35%)" />
        </g>

        {/* Labels */}
        <text
          x={-50}
          y={-25}
          textAnchor="middle"
          fill="#888"
          style={{ fontSize: '8px', userSelect: 'none' }}
        >
          OFF
        </text>
        <text
          x={50}
          y={-25}
          textAnchor="middle"
          fill="#888"
          style={{ fontSize: '8px', userSelect: 'none' }}
        >
          MAX
        </text>

        {/* RPM display */}
        <text
          x={0}
          y={40}
          textAnchor="middle"
          fill="white"
          style={{ fontSize: '12px', fontWeight: 'bold', userSelect: 'none' }}
        >
          {rpm} RPM
        </text>
      </g>

      {/* Vertical Faucet Spout above wheel */}
      <g transform="translate(-180, -230)">
        {/* Spout pipe */}
        <rect
          x={-12}
          y={0}
          width={24}
          height={70}
          fill="hsl(220, 15%, 60%)"
          stroke="hsl(220, 15%, 45%)"
          strokeWidth={2}
          rx={3}
        />

        {/* Spout opening */}
        <ellipse
          cx={0}
          cy={70}
          rx={12}
          ry={6}
          fill="hsl(220, 10%, 40%)"
          stroke="hsl(220, 10%, 25%)"
          strokeWidth={1}
        />

        {/* Water flow from spout */}
        {flowIntensity > 0 && (
          <g>
            {/* Main water stream falling straight down */}
            <rect
              x={-2}
              y={70}
              width={Math.max(2, Math.min(flowIntensity * 36, 12))}
              height={200}
              fill="hsl(200, 80%, 70%)"
              opacity={0.7}
              rx={1}
            >
              <animate
                attributeName="opacity"
                values="0.7;0.5;0.7"
                dur={`${Math.max(0.5, 1.5 - flowIntensity)}s`}
                repeatCount="indefinite"
              />
            </rect>

            {/* Water droplets falling */}
            {Array.from({ length: Math.floor(flowIntensity * 12) }, (_, i) => (
              <circle
                key={i}
                cx={Math.sin(i * 0.8) * 3}
                cy={75 + i * 12}
                r={1 + Math.min(flowIntensity * 4.5, 2.5)}
                fill="hsl(200, 70%, 75%)"
                opacity={0.6}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`0,0; ${Math.sin(i * 0.2) * 2},200`}
                  dur={`${Math.max(0.4, 1 - flowIntensity * 0.3)}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.05}s`}
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.8;0.3;0"
                  dur={`${Math.max(0.4, 1 - flowIntensity * 0.3)}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.05}s`}
                />
              </circle>
            ))}

            {/* Splash effect on wheel */}
            <g transform="translate(0, 270)">
              {Array.from({ length: 6 }, (_, i) => (
                <circle
                  key={`splash-${i}`}
                  cx={Math.cos((i * Math.PI) / 3) * 15}
                  cy={Math.sin((i * Math.PI) / 3) * 8}
                  r={2}
                  fill="hsl(200, 60%, 80%)"
                  opacity={flowIntensity * 0.4}
                >
                  <animate
                    attributeName="r"
                    values="1;4;1"
                    dur="0.8s"
                    repeatCount="indefinite"
                    begin={`${i * 0.1}s`}
                  />
                  <animate
                    attributeName="opacity"
                    values={`${flowIntensity * 0.4};${flowIntensity * 0.2};${flowIntensity * 0.4}`}
                    dur="0.8s"
                    repeatCount="indefinite"
                    begin={`${i * 0.1}s`}
                  />
                </circle>
              ))}
            </g>
          </g>
        )}
      </g>
    </g>
  );
}
