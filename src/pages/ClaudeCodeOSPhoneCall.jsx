import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ResolutionNotice from '../components/ResolutionNotice'
import AutoHeightIframe from '../components/AutoHeightIframe'

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

          {/* Resolution guidance: portrait → landscape, laptop split → fullscreen */}
          <ResolutionNotice />

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
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Agent Skills</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316b0', border: '1px solid #f9731630' }}>MCPs</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f9731680', border: '1px solid #f9731620' }}>Agentic Coding</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8', border: '1px solid #38bdf840' }}>Life Automation</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8', border: '1px solid #38bdf840' }}>AI in the Wild</span>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80', border: '1px solid #4ade8040' }}>DevRel</span>
              </div>
            </div>
          </section>

        </div>

        {/* Live App — wider than prose, outside the max-w-2xl container */}
        <div className="max-w-[1200px] mx-auto mb-12 px-4">
          <AutoHeightIframe
            src="/voyp-app/index.html"
            title="VOYP — The Errand Caller"
            initialHeight={4650}
          />
        </div>

      </article>
    </Layout>
  )
}
