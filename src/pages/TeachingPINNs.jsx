import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

// Line colors from the MTA palette
const lineColors = {
  P: '#FF6319', // MTA orange
  A: '#0039A6', // MTA blue
  E: '#6CBE45', // MTA green
}

function LineBullet({ line }) {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-sm font-bold"
      style={{ backgroundColor: lineColors[line] }}
    >
      {line}
    </span>
  )
}

function SubwayExit({ direction, street, to }) {
  return (
    <Link
      to={to}
      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-5 hover:bg-neutral-900 transition-colors group"
    >
      {/* Exit sign header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-yellow-500 text-black px-2 py-1 rounded font-bold text-xs uppercase tracking-wider">
          Exit
        </div>
        <span className="text-dark-muted text-sm">{direction}</span>
      </div>

      {/* Street name */}
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform"
          fill="none"
          stroke="#EAB308"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span className="text-white font-medium">{street}</span>
      </div>
    </Link>
  )
}

export default function TeachingPINNs() {
  return (
    <Layout>
      <article className="w-full py-8 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Subway Exits */}
          <section className="mb-8">
            <div className="flex gap-4">
              <SubwayExit
                direction="Left Exit"
                street="Traditional Lectures St & Artifacts Ave"
                to="/teaching-pinns/lectures"
              />
              <SubwayExit
                direction="Right Exit"
                street="Coding Tutorials St & Artifacts Ave"
                to="/teaching-pinns/tutorials"
              />
            </div>
            <div className="flex gap-4 mt-4 justify-center">
              <div className="flex max-w-[calc(50%-0.5rem)] w-full">
                <SubwayExit
                  direction="Lower Exit"
                  street="Broader Perspectives St & Artifacts Ave"
                  to="/teaching-pinns/perspectives"
                />
              </div>
            </div>
          </section>

          {/* Title */}
          <div className="prose-medium">
            <section className="mb-16">
              <h1>Teaching PINNs</h1>
              <p className="text-dark-muted text-lg flex items-center gap-2 flex-wrap">
                Triple interchange — where <LineBullet line="P" />, <LineBullet line="A" /> and <LineBullet line="E" /> meet
              </p>
            </section>

            {/* Content */}
            <section className="mb-12">
              <p>
                Physics-Informed Neural Networks sit at a unique intersection. Whether you're a Physics student transitioning to AI (<LineBullet line="A" />), solving Physics problems with AI (<LineBullet line="P" />), or an educator who lives at the intersection (<LineBullet line="E" />) — this is your station.
              </p>
              <p>
                Take the <strong>left exit</strong> for traditional lecture-style content: a comprehensive introduction, deep dives into the foundational research papers, and a roadmap of the broader Scientific Machine Learning landscape.
              </p>
              <p>
                Take the <strong>right exit</strong> for hands-on coding tutorials: learn to build PINNs from scratch in JAX and PyTorch, from automatic differentiation fundamentals to physical layers and computational microscopy.
              </p>
            </section>
          </div>

        </div>
      </article>
    </Layout>
  )
}
