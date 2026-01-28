import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

const tutorials = [
  {
    id: 'jax-tutorial',
    title: 'JAX for SciML',
    subtitle: 'A Broad Introduction to JAX for Scientific Machine Learning',
  },
  {
    id: 'jax-regression',
    title: 'JAX for Regression',
    subtitle: 'Fitting a sine wave with JAX',
  },
  {
    id: 'pytorch-loss-pinns',
    title: 'PyTorch for Loss-based PINNs',
    subtitle: 'A Quick Introduction to PyTorch for Automatic Differentiation and PINNs',
  },
  {
    id: 'pytorch-physical-layers',
    title: 'PyTorch for Physical Layers of a PINN',
    subtitle: 'Build a Simple Computational Microscope in PyTorch',
  },
]

function LearnMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="w-full py-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
          {/* Menu header - clickable to expand/collapse */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-900/50 transition-colors"
          >
            <h2 className="text-dark-muted text-sm font-medium uppercase tracking-wider">
              Learn
            </h2>
            <span className="text-dark-muted text-xl font-light">
              {isOpen ? '−' : '+'}
            </span>
          </button>

          {/* Content - only shown when expanded */}
          {isOpen && (
            <div className="border-t border-neutral-800">
              {tutorials.map((tutorial, index) => (
                <Link
                  key={tutorial.id}
                  to={`/teaching-pinns/tutorials/${tutorial.id}`}
                  className="block px-5 py-4 hover:bg-neutral-900/50 transition-colors border-b border-neutral-800 last:border-b-0"
                >
                  <div className="flex gap-3">
                    <span className="text-dark-muted text-sm mt-0.5">{index + 1}.</span>
                    <div>
                      <span className="text-white font-medium">{tutorial.title}</span>
                      {tutorial.subtitle && (
                        <span className="block text-dark-muted text-sm mt-1">{tutorial.subtitle}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Tutorials() {
  return (
    <Layout>
      {/* Back to station */}
      <div className="w-full pt-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/teaching-pinns"
            className="inline-flex items-center gap-2 text-dark-muted hover:text-white text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Back to Teaching PINNs Station
          </Link>
        </div>
      </div>

      <article className="w-full py-8 px-4">
        <div className="max-w-3xl mx-auto prose-medium">
          <section className="mb-8">
            <h1 className="whitespace-nowrap">Coding Tutorials St & Artifacts Ave</h1>
            <p className="text-dark-muted text-lg">
              Hands-on coding walkthroughs for Physics-Informed Neural Networks
            </p>
          </section>
        </div>
      </article>

      <LearnMenu />
    </Layout>
  )
}

export { tutorials }
