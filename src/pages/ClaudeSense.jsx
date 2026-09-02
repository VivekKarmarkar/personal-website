import Layout from '../components/Layout'
import ResolutionNotice from '../components/ResolutionNotice'
import AutoHeightIframe from '../components/AutoHeightIframe'

export default function ClaudeSense() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

          {/* Resolution guidance: phone portrait → landscape, laptop split → fullscreen */}
          <ResolutionNotice />

          {/* Train Badge — D */}
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

          {/* Title (rebuilt from the page's masthead: kicker + h1 + subtitle) */}
          <section className="mb-8">
            <p className="mb-4" style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#f97316' }}>Giving Claude a sense of touch</p>
            <h1>ClaudeSense</h1>
            <p className="text-dark-muted text-lg mt-2">A small hardware experiment with a bigger idea: one coding agent, one context, all the way from a physical measurement to a scientific answer.</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Claude Code</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316b0', border: '1px solid #f9731630' }}>Agentic Coding</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f9731680', border: '1px solid #f9731620' }}>Embodied AI</span>
              </div>
            </div>
          </section>

        </div>

        {/* Live page — wider than prose, outside the max-w-2xl container */}
        <div className="max-w-[1200px] mx-auto mb-12 px-4">
          <AutoHeightIframe
            src="/claudesense-app/index.html"
            title="ClaudeSense — From Sensor to Answer"
            initialHeight={4000}
          />
        </div>

      </article>
    </Layout>
  )
}
