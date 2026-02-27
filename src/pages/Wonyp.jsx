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

          {/* Placeholder sections */}
          <section className="mb-12">
            <h2>The Idea</h2>
            <p>
              Coming soon.
            </p>
          </section>

          <section className="mb-12">
            <h2>How It Works</h2>
            <p>
              Coming soon.
            </p>
          </section>

          <section className="mb-12">
            <h2>Demo</h2>
            <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800">
              <span className="text-dark-muted">Demo coming soon</span>
            </div>
          </section>

        </div>
      </article>
    </Layout>
  )
}
