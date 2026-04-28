import Layout from '../components/Layout'

export default function ClaudeCodeOS() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

          {/* Landscape warning — only visible on narrow portrait screens */}
          <div
            className="mb-6 rounded-lg px-4 py-3 text-sm text-center sm:hidden"
            style={{ backgroundColor: '#f9731620', color: '#f97316', border: '1px solid #f9731640' }}
          >
            For the best experience on phone, rotate to <strong>landscape view</strong>
          </div>

          {/* Train Badge */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-lg"
                style={{ backgroundColor: '#A7A9AC' }}
              >
                I
              </span>
              <span className="text-dark-muted">I-Line</span>
            </div>
          </div>

          {/* Title */}
          <section className="mb-8">
            <h1>Claude Code OS</h1>
            <p className="text-dark-muted text-lg mt-2">A personalized operating system for Claude Code &mdash; visualized</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Claude Code</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Exploratory Data Analysis</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80', border: '1px solid #4ade8040' }}>AI Startups</span>
              </div>
            </div>
          </section>

        </div>

        {/* Live App — wider than prose, outside the max-w-2xl container */}
        <div className="max-w-[1200px] mx-auto mb-12 px-4">
          <iframe
            src="/claude-code-os-app/index.html"
            title="Claude Code OS"
            className="w-full border-none block"
            style={{ height: '17500px', background: '#0a0a0a' }}
            scrolling="no"
          />
        </div>

      </article>
    </Layout>
  )
}
