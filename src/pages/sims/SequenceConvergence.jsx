import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SequenceConvergenceSim from '../../sims/maths/SequenceConvergenceSim'

export default function SequenceConvergence() {
  return (
    <Layout>
      <article className="w-full py-8 px-4">
        <div className="max-w-screen-xl mx-auto">

          {/* Back button */}
          <Link
            to="/interactive-sims"
            className="inline-flex items-center gap-2 text-dark-muted hover:text-white transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Simulations
          </Link>

          {/* Fullscreen Notice - only shows in split-screen mode */}
          <p className="text-amber-400 font-bold text-sm mb-4 tracking-wide lg:hidden">
            USE FULLSCREEN MODE FOR BEST EXPERIENCE
          </p>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Sequence Convergence Visualizer
          </h1>

          {/* Simulation */}
          <SequenceConvergenceSim />

        </div>
      </article>
    </Layout>
  )
}
