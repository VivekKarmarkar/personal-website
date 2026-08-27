import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function ClaudeCodeOSPhoneCall() {
  return (
    <Layout>
      {/* Back to station */}
      <div className="w-full pt-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/claude-code-os"
            className="inline-flex items-center gap-2 text-dark-muted hover:text-white text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Back to Claude Code OS Station
          </Link>
        </div>
      </div>

      <article className="w-full py-8 px-4">
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
              <span className="text-dark-muted">Claude Code Borough Local on AI Island</span>
            </div>
          </div>

          {/* Title */}
          <section className="mb-8">
            <h1>VOYP &mdash; The Errand Caller</h1>
            <p className="text-dark-muted text-lg mt-2">The VOYP MCP test campaign behind the <code className="text-sm bg-neutral-800 px-1.5 py-0.5 rounded">/call-voyp</code> skill</p>
          </section>

        </div>

        {/* Live App — wider than prose, outside the max-w-2xl container */}
        <div className="max-w-[1200px] mx-auto mb-12 px-4">
          <iframe
            src="/voyp-app/index.html"
            title="VOYP — The Errand Caller"
            className="w-full border-none block h-[5900px] md:h-[4650px]"
            style={{ background: '#0a0a0a' }}
            scrolling="no"
          />
        </div>

      </article>
    </Layout>
  )
}
