import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import FeynmanConservationSim from '../../sims/physics/FeynmanConservationSim'

export default function FeynmanConservation() {
  return (
    <Layout>
      <div className="min-h-screen bg-dark-bg py-4 px-4">
        {/* Back link */}
        <Link
          to="/interactive-sims"
          className="inline-flex items-center gap-2 text-dark-muted hover:text-white text-sm mb-4 transition-colors"
        >
          <span>←</span>
          Back to Simulations
        </Link>

        {/* Simulation - full width */}
        <div className="w-[calc(100vw-2rem)] ml-[calc(-50vw+50%+1rem)]">
          <FeynmanConservationSim />
        </div>
      </div>
    </Layout>
  )
}
