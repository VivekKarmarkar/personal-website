import { useRef, useCallback } from 'react'
import Layout from '../components/Layout'

export default function ClaudeCodeOS() {
  const iframeRef = useRef(null)

  const handleLoad = useCallback(() => {
    try {
      const el = iframeRef.current
      const doc = el?.contentDocument || el?.contentWindow?.document
      if (doc) {
        el.style.height = '0px'
        el.style.height = doc.documentElement.scrollHeight + 'px'
      }
    } catch {
      // cross-origin fallback — keep the CSS height
    }
  }, [])

  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

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
            ref={iframeRef}
            onLoad={handleLoad}
            src="/claude-code-os-app/index.html"
            title="Claude Code OS"
            className="w-full border-none block"
            style={{ height: '22000px', background: '#0a0a0a' }}
            scrolling="no"
          />
        </div>

        <div className="max-w-2xl mx-auto prose-medium">
          {/* GitHub */}
          <section className="mb-16 text-center">
            <a
              href="https://github.com/VivekKarmarkar/claude-code-os"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-dark-muted hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </section>
        </div>

      </article>
    </Layout>
  )
}
