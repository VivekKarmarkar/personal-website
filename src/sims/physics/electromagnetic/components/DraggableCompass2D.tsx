import { useState, useRef } from 'react';
import { Compass2D } from './Compass2D';
import { MagneticDipole2D } from '../lib/dipoleField';

interface DraggableCompass2DProps {
  dipole: MagneticDipole2D;
  visible: boolean;
  size: number;
  initialPosition: { x: number; y: number };
}

export function DraggableCompass2D({ dipole, visible, size, initialPosition }: DraggableCompass2DProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startMouseX: number; startMouseY: number } | null>(null);

  if (!visible) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    dragRef.current = {
      startX: position.x,
      startY: position.y,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;

      const deltaX = e.clientX - dragRef.current.startMouseX;
      const deltaY = e.clientY - dragRef.current.startMouseY;

      setPosition({
        x: dragRef.current.startX + deltaX * 0.8, // Scale factor for sensitivity
        y: dragRef.current.startY + deltaY * 0.8,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <g
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      className="draggable-compass"
    >
      <Compass2D position={position} dipole={dipole} visible={true} size={size} />
      {/* Invisible larger hit area for easier dragging */}
      <circle
        cx={position.x}
        cy={position.y}
        r={size + 10}
        fill="transparent"
        stroke="none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
    </g>
  );
}
