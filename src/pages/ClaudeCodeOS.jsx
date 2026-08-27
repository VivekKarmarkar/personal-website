import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

// Sub-layer exits of the Life layer (Teaching PINNs exit idiom)
const LIFE_EXITS = [
  { label: 'Flight', street: 'Kiwi — The Flight Vending Machine', to: '/claude-code-os/flight' },
  { label: 'Phone Call', street: 'VOYP — The Errand Caller', to: '/claude-code-os/phone-call' },
  { label: 'News', street: 'Reddit — The Magazine Stand', to: '/claude-code-os/news' },
]

function LayerChip({ children }) {
  return (
    <div
      className="px-2 py-1 rounded font-bold text-xs uppercase tracking-wider text-black"
      style={{ backgroundColor: '#A7A9AC' }}
    >
      {children}
    </div>
  )
}

function LifeExit({ label, street, to }) {
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
        <span className="text-dark-muted text-sm">{label}</span>
      </div>

      {/* Street name */}
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 flex-shrink-0 group-hover:translate-y-[-2px] transition-transform"
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

export default function ClaudeCodeOS() {
  const [lifeOpen, setLifeOpen] = useState(false)

  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Train Badge */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-lg"
                style={{ backgroundColor: '#A7A9AC' }}
              >
                I
              </span>
              <span className="text-dark-muted">Claude Code Borough Local on AI Island</span>
            </div>
          </div>

          {/* Title */}
          <section className="mb-10 prose-medium">
            <h1>Claude Code OS</h1>
            <p className="text-dark-muted text-lg mt-2">A personalized operating system for Claude Code</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Claude Code</span>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80', border: '1px solid #4ade8040' }}>AI Startups</span>
              </div>
            </div>
          </section>

          {/* Intro */}
          <section className="mb-10 prose-medium">
            <p>
              This station has multiple platforms — and in our world, we call platforms layers. Claude Code OS is an extended agentic harness — skills, hooks, MCPs, and plugins — that has let this human personalize and augment their bare-bones Claude Code. The <strong>main layer</strong> dives deep into the concept. The <strong>life layer</strong> discusses extensions that reduce friction in daily life — directly enhancing the quality of life through AI, especially Claude Code.
            </p>
          </section>

          {/* Layers */}
          <section className="mb-8 space-y-4">

            {/* Main layer */}
            <Link
              to="/claude-code-os/main"
              className="block bg-neutral-950 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-900 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <LayerChip>Main Layer</LayerChip>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-white font-medium text-lg mb-1">The Operating System</div>
                  <p className="text-dark-muted text-sm m-0">
                    The data portrait — skills as processes, the constellation, and the design philosophy behind the personal OS.
                  </p>
                </div>
                <svg
                  className="w-6 h-6 flex-shrink-0 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="#A7A9AC"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>

            {/* Life layer */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setLifeOpen(!lifeOpen)}
                className="w-full text-left p-6 hover:bg-neutral-900 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <LayerChip>Life Layer</LayerChip>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-white font-medium text-lg mb-1">The OS Out in the World</div>
                    <p className="text-dark-muted text-sm m-0">
                      Flights, phone calls, and the news — three MCP test campaigns turned into daily-life skills.
                    </p>
                  </div>
                  <svg
                    className={`w-6 h-6 flex-shrink-0 transition-transform ${lifeOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="#A7A9AC"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Sub-layer exits — expand on click */}
              {lifeOpen && (
                <div className="px-6 pb-6 border-t border-neutral-800 pt-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {LIFE_EXITS.map((exit) => (
                      <LifeExit key={exit.to} {...exit} />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </section>

        </div>
      </article>
    </Layout>
  )
}
