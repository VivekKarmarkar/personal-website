import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { simulations, subjects } from '../data/simulations'

function SimCard({ sim }) {
  return (
    <Link
      to={sim.url}
      className="block bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all hover:scale-[1.02]"
    >
      <div className="aspect-video bg-neutral-800 overflow-hidden">
        <img
          src={sim.thumbnail}
          alt={sim.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{sim.title}</h3>
        <p className="text-dark-muted text-sm">{sim.description}</p>
        <div className="flex gap-2 mt-3">
          {sim.subjects.map(subject => (
            <span
              key={subject}
              className="text-xs px-2 py-1 rounded-full bg-neutral-800 text-dark-muted"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function InteractiveSims() {
  const [selectedSubjects, setSelectedSubjects] = useState([])

  const toggleSubject = (subjectId) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(s => s !== subjectId)
        : [...prev, subjectId]
    )
  }

  const filteredSims = selectedSubjects.length === 0
    ? simulations
    : simulations.filter(sim =>
        sim.subjects.some(s => selectedSubjects.includes(s))
      )

  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Train Badges */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#FF6319' }}
              >
                P
              </span>
              <span className="text-dark-muted">AI for Physics</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#6CBE45' }}
              >
                E
              </span>
              <span className="text-dark-muted">Education</span>
            </div>
          </div>

          {/* Title */}
          <section className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Interactive Simulations</h1>
            <p className="text-dark-muted text-lg">
              Explore physics, maths, and machine learning through interactive visualizations
            </p>
          </section>

          <div className="flex gap-8">
            {/* Sidebar filters */}
            <aside className="w-48 flex-shrink-0">
              <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-muted">
                Filter by Subject
              </h2>
              <div className="space-y-3">
                {subjects.map(subject => (
                  <label
                    key={subject.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={() => toggleSubject(subject.id)}
                      className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-accent focus:ring-accent"
                    />
                    <span className="text-dark-text group-hover:text-white transition-colors">
                      {subject.label}
                    </span>
                  </label>
                ))}
              </div>

              {selectedSubjects.length > 0 && (
                <button
                  onClick={() => setSelectedSubjects([])}
                  className="mt-4 text-sm text-dark-muted hover:text-white transition-colors"
                >
                  Clear filters
                </button>
              )}
            </aside>

            {/* Simulation grid */}
            <main className="flex-1">
              {filteredSims.length === 0 ? (
                <div className="text-center py-16 text-dark-muted">
                  <p>No simulations match the selected filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSims.map(sim => (
                    <SimCard key={sim.id} sim={sim} />
                  ))}
                </div>
              )}
            </main>
          </div>

        </div>
      </article>
    </Layout>
  )
}
