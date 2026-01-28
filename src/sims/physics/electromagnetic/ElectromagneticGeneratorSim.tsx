import { useSimulationState } from './hooks/useSimulationState';
import { SimulationScene2D } from './components/SimulationScene2D';
import { ControlPanel } from './components/ControlPanel';

interface ElectromagneticGeneratorSimProps {
  height?: string;
}

export function ElectromagneticGeneratorSim({ height = '700px' }: ElectromagneticGeneratorSimProps) {
  const { state, updateState, magneticDipole, circularCoil } = useSimulationState();

  return (
    <div className="w-full bg-gray-950 rounded-lg overflow-hidden" style={{ height }}>
      {/* Full-screen warning */}
      <div className="bg-amber-900/50 border-b border-amber-700 px-4 py-2 text-center">
        <span className="text-amber-200 text-sm font-medium">
          Best experienced in full screen mode
        </span>
      </div>

      <div className="flex h-[calc(100%-40px)]">
        {/* Control Panel */}
        <div className="flex-shrink-0 p-4 flex items-start">
          <ControlPanel state={state} onUpdateState={updateState} />
        </div>

        {/* 2D Scene */}
        <div className="flex-1 relative">
          <SimulationScene2D
            state={state}
            magneticDipole={magneticDipole}
            circularCoil={circularCoil}
            onUpdateState={updateState}
          />

          {/* Scene Info Overlay */}
          <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur rounded-lg p-3 text-sm">
            <div className="text-white font-medium mb-2">Physics Simulation</div>
            <div className="space-y-1 text-gray-400">
              <div>Dipole Field Approximation</div>
              <div>Real-time EMF Calculation</div>
              <div>Faraday's Law Applied</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur rounded-lg p-3 text-sm text-gray-400">
            <div>Drag the water faucet slider to control rotation speed</div>
            <div>Drag the compass to explore the magnetic field</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElectromagneticGeneratorSim;
