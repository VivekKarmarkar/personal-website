import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import MatrixTransformsSim from '../../sims/maths/MatrixTransformsSim'

export default function MatrixTransforms() {
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

          {/* Simulation */}
          <MatrixTransformsSim />

        </div>
      </article>
    </Layout>
  )
}
