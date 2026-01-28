import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import ElectromagneticGeneratorSim from '../../sims/physics/electromagnetic/ElectromagneticGeneratorSim'

export default function ElectromagneticGenerator() {
  return (
    <Layout>
      <div className="min-h-screen bg-dark-bg py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <Link
            to="/interactive-sims"
            className="inline-flex items-center gap-2 text-dark-muted hover:text-white text-sm mb-6 transition-colors"
          >
            <span>←</span>
            Back to Simulations
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Electromagnetic Generator</h1>
            <p className="text-dark-muted text-lg">
              Explore Faraday's Law of electromagnetic induction with an interactive generator simulation
            </p>
          </div>

          {/* Physics note */}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
            <p className="text-accent text-sm">
              <strong>Faraday's Law:</strong> EMF = -N × (ΔΦ/Δt) — A changing magnetic flux through a coil induces
              an electromotive force. Watch as the rotating magnet generates current that powers the light bulb.
            </p>
          </div>

          {/* Simulation - breaks out of container for full width */}
          <div className="w-[calc(100vw-2rem)] ml-[calc(-50vw+50%+1rem)]">
            <ElectromagneticGeneratorSim height="750px" />
          </div>

          {/* Instructions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-900 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 text-sm">Water Faucet Control</h3>
              <p className="text-dark-muted text-xs">
                Drag the slider on the water faucet to control the wheel's rotation speed.
                More water = faster rotation = higher induced EMF.
              </p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 text-sm">Adjustable Parameters</h3>
              <p className="text-dark-muted text-xs">
                Change magnet strength, loop count, and loop area to see how they affect
                the induced current and power output.
              </p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 text-sm">Draggable Compass</h3>
              <p className="text-dark-muted text-xs">
                Drag the compass around the scene to explore how the magnetic field
                direction changes at different positions relative to the rotating magnet.
              </p>
            </div>
          </div>

          {/* Key Concepts */}
          <div className="mt-6 bg-neutral-900 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Key Concepts</h3>
            <ul className="space-y-2 text-dark-muted text-sm">
              <li>• <strong className="text-white">Magnetic Field Lines:</strong> Show the direction and relative strength of the magnetic field from the bar magnet</li>
              <li>• <strong className="text-white">Induced EMF:</strong> Varies sinusoidally as the magnet rotates, reaching maximum when flux change is greatest</li>
              <li>• <strong className="text-white">Electron Flow:</strong> Visualizes the induced current flowing through the coil windings</li>
              <li>• <strong className="text-white">Light Bulb Brightness:</strong> Proportional to the power being generated (P = I²R)</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}
