import { WoodenWheel2D } from './WoodenWheel2D';
import { CircularCoil2D } from './CircularCoil2D';
import { MagneticFieldLines2D } from './MagneticFieldLines2D';
import { DraggableCompass2D } from './DraggableCompass2D';
import { LightBulb2D } from './LightBulb2D';
import { WaterFaucet2D } from './WaterFaucet2D';
import { SimulationState } from '../hooks/useSimulationState';
import { MagneticDipole2D } from '../lib/dipoleField';
import { CircularCoil2D as CircularCoilType } from '../lib/flux';

interface SimulationScene2DProps {
  state: SimulationState;
  magneticDipole: MagneticDipole2D;
  circularCoil: CircularCoilType;
  onUpdateState: (updates: Partial<SimulationState>) => void;
}

export function SimulationScene2D({ state, magneticDipole, circularCoil, onUpdateState }: SimulationScene2DProps) {
  const viewBox = { width: 800, height: 600 };

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox={`${-viewBox.width / 2} ${-viewBox.height / 2} ${viewBox.width} ${viewBox.height}`}
        className="border border-gray-700 rounded-lg"
      >
        {/* Magnetic field lines (render first, behind everything) */}
        <MagneticFieldLines2D
          dipole={magneticDipole}
          visible={state.showMagneticField}
          viewBox={viewBox}
          density={12}
          strength={state.magnetStrength / 100}
        />

        {/* Water faucet controller */}
        <WaterFaucet2D
          position={{ x: -240, y: -230 }}
          rpm={state.rpm}
          onRPMChange={(rpm) => onUpdateState({ rpm })}
        />

        {/* Wooden wheel with attached bar magnet */}
        <WoodenWheel2D position={{ x: -180, y: 0 }} radius={80} rotation={state.magnetRotation} />

        {/* Circular coil */}
        <CircularCoil2D
          position={{ x: circularCoil.center.x, y: circularCoil.center.y }}
          radius={circularCoil.radius}
          turns={circularCoil.turns}
          current={state.inducedCurrent}
          showElectrons={state.showElectrons}
        />

        {/* Connecting wires from coil terminals to light bulb */}
        <g stroke="hsl(0, 0%, 30%)" strokeWidth="3" fill="none">
          {(() => {
            const coilWidth = circularCoil.turns * 12;
            const leftTerminal = circularCoil.center.x - coilWidth / 2;
            const rightTerminal = circularCoil.center.x + coilWidth / 2;

            return (
              <>
                {/* Wire from left coil terminal to light bulb */}
                <path
                  d={`M ${leftTerminal} ${circularCoil.center.y - circularCoil.radius}
                     L ${leftTerminal} ${-120}
                     L 40 -120`}
                />
                {/* Wire from right coil terminal to light bulb */}
                <path
                  d={`M ${rightTerminal} ${circularCoil.center.y - circularCoil.radius}
                     L ${rightTerminal} ${-120}
                     L 100 -120`}
                />
              </>
            );
          })()}
        </g>

        {/* Light bulb */}
        <LightBulb2D
          position={{ x: 70, y: -150 }}
          brightness={state.lightBrightness}
          power={state.power}
          isPlaying={state.isPlaying}
        />

        {/* Draggable Compass */}
        <DraggableCompass2D
          dipole={magneticDipole}
          visible={state.showCompass}
          size={22}
          initialPosition={{ x: 220, y: 0 }}
        />
      </svg>
    </div>
  );
}
