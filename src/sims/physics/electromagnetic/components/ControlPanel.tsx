import { Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { SimulationState } from '../hooks/useSimulationState';

interface ControlPanelProps {
  state: SimulationState;
  onUpdateState: (updates: Partial<SimulationState>) => void;
}

export function ControlPanel({ state, onUpdateState }: ControlPanelProps) {
  const handleMagnetStrengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateState({ magnetStrength: Number(e.target.value) });
  };

  const handleLoopAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateState({ loopArea: Number(e.target.value) });
  };

  const handleLoopCountChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(10, state.loopCount + delta));
    onUpdateState({ loopCount: newCount });
  };

  return (
    <div className="w-72 bg-gray-900/95 backdrop-blur rounded-lg border border-gray-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Electromagnetic Generator</h3>
      </div>

      <div className="p-4 space-y-5">
        {/* Magnet Strength */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Magnet Strength</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={state.magnetStrength}
              onChange={handleMagnetStrengthChange}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="min-w-[3rem] text-sm text-gray-400">{state.magnetStrength}%</span>
          </div>
        </div>

        {/* Loop Count */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Loop Count</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLoopCountChange(-1)}
              disabled={state.loopCount <= 1}
              className="p-2 rounded border border-gray-600 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="h-4 w-4 text-gray-300" />
            </button>
            <span className="min-w-[2rem] text-center text-sm text-white">{state.loopCount}</span>
            <button
              onClick={() => handleLoopCountChange(1)}
              disabled={state.loopCount >= 10}
              className="p-2 rounded border border-gray-600 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp className="h-4 w-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Loop Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Loop Area</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="20"
              max="100"
              value={state.loopArea}
              onChange={handleLoopAreaChange}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="min-w-[3rem] text-sm text-gray-400">{state.loopArea}%</span>
          </div>
        </div>

        {/* RPM Display (Read-only) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Rotation Speed</label>
          <div className="text-center p-2 bg-gray-800 rounded-md">
            <span className="text-sm font-medium text-white">{state.rpm} RPM</span>
            <div className="text-xs text-gray-500 mt-1">Controlled by water faucet</div>
          </div>
        </div>

        {/* Visibility Controls */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">Show</label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.showMagneticField}
              onChange={(e) => onUpdateState({ showMagneticField: e.target.checked })}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <span className="text-sm text-gray-300">Magnetic Field</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.showElectrons}
              onChange={(e) => onUpdateState({ showElectrons: e.target.checked })}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <span className="text-sm text-gray-300">Electrons</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.showCompass}
              onChange={(e) => onUpdateState({ showCompass: e.target.checked })}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <span className="text-sm text-gray-300">Compass</span>
          </label>
        </div>

        {/* Play/Pause Controls */}
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={() => onUpdateState({ isPlaying: !state.isPlaying })}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              state.isPlaying
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {state.isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play
              </>
            )}
          </button>
        </div>

        {/* Physics Values Display */}
        <div className="pt-4 space-y-2 text-xs text-gray-500 border-t border-gray-700">
          <div className="flex justify-between">
            <span>EMF:</span>
            <span>{state.inducedEMF.toFixed(3)} V</span>
          </div>
          <div className="flex justify-between">
            <span>Current:</span>
            <span>{state.inducedCurrent.toFixed(3)} A</span>
          </div>
          <div className="flex justify-between">
            <span>Power:</span>
            <span>{state.power.toFixed(3)} W</span>
          </div>
        </div>
      </div>
    </div>
  );
}
