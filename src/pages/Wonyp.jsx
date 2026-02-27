import Layout from '../components/Layout'

export default function Wonyp() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

          {/* Train Badge */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-lg"
                style={{ backgroundColor: '#FCCC0A' }}
              >
                D
              </span>
              <span className="text-dark-muted">AI Demos</span>
            </div>
          </div>

          {/* Title */}
          <section className="mb-16">
            <h1>What's on your Plate?</h1>
            <p className="text-dark-muted text-lg">LLM-driven Indian Food Analysis</p>
          </section>

          {/* Introduction */}
          <section className="mb-12">
            <h2>Introduction</h2>
            <p>
              Coming soon.
            </p>
          </section>

          {/* Architecture */}
          <section className="mb-12">
            <h2>Architecture</h2>
            <p>
              Coming soon.
            </p>
          </section>

          {/* Design Philosophy */}
          <section className="mb-12">
            <h2>Design Philosophy</h2>
            <p>
              Coming soon.
            </p>
          </section>

          {/* Results */}
          <section className="mb-12">
            <h2>Results</h2>
            <p>
              Coming soon.
            </p>
          </section>

          {/* Findings */}
          <section className="mb-12">
            <h2>Findings</h2>
            <p>
              Coming soon.
            </p>
          </section>

        </div>
      </article>
    </Layout>
  )
}
