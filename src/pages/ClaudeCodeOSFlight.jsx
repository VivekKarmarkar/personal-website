import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ResolutionNotice from '../components/ResolutionNotice'

// Native Pattern A rebuild of goose-mcp-tests/mcp_lean_project_webpages/codex_kiwi_lean_project_website.html
// (prose verbatim; story sections and link cards re-implemented in site styles; hero image as a site asset)

function StoryHeader({ num, children }) {
  return (
    <div className="mb-5">
      <span className="block mb-2 text-[12px] font-bold" style={{ color: '#f97316', letterSpacing: '0.16em' }}>{num}</span>
      <h2 style={{ margin: 0 }}>{children}</h2>
    </div>
  )
}

function Code({ children }) {
  return <code className="text-sm bg-neutral-800 px-1.5 py-0.5 rounded" style={{ color: '#f97316' }}>{children}</code>
}

function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 .7a11.3 11.3 0 0 0-3.57 22c.57.1.78-.25.78-.55v-2.18c-3.17.69-3.84-1.35-3.84-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.03-.71.08-.7.08-.7 1.14.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.53-.29-5.2-1.27-5.2-5.64 0-1.25.45-2.27 1.18-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17A10.9 10.9 0 0 1 12 5.93c.97 0 1.95.13 2.86.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.18 1.81 1.18 3.06 0 4.38-2.67 5.34-5.21 5.63.41.36.78 1.05.78 2.11v3.13c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z"/>
    </svg>
  )
}

// The page's link cards (the source's <nav class="actions">), in site styles
function ActionCard({ href, icon, small, strong }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3.5 rounded-xl px-5 py-4 bg-neutral-950 border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-600 transition-colors no-underline"
      style={{ textDecoration: 'none' }}
    >
      <span className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 text-[20px]" style={{ background: '#161822', color: '#e6edf3' }}>{icon}</span>
      <span className="min-w-0 flex-1">
        <small className="block text-[11px] uppercase tracking-wide text-dark-muted whitespace-nowrap">{small}</small>
        <strong className="block text-white text-[15px]">{strong}</strong>
      </span>
      <span className="flex-shrink-0" style={{ color: '#f97316' }} aria-hidden="true">↗</span>
    </a>
  )
}

export default function ClaudeCodeOSFlight() {
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

          {/* Resolution guidance: phone portrait → landscape, laptop split → fullscreen */}
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
          <section className="mb-10">
            <h1>Kiwi &mdash; The Flight Vending Machine</h1>
            <p className="text-dark-muted text-lg mt-2">The Kiwi MCP test campaign behind the <Code>/find-flight-kiwi</Code> skill</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Agent Skills</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316b0', border: '1px solid #f9731630' }}>MCPs</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f9731680', border: '1px solid #f9731620' }}>Agentic Coding</span>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8', border: '1px solid #38bdf840' }}>Life Automation</span>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80', border: '1px solid #4ade8040' }}>DevRel</span>
              </div>
            </div>
          </section>
        </div>

        {/* Hero explainer — the source's framed panel (surface-deep #18150f, 1px #3d362a, 26px radius, inner padding, shadow), wider than prose */}
        <div className="max-w-[908px] mx-auto mb-14 px-4">
          <figure
            className="m-0"
            style={{ padding: 'clamp(8px, 1.5vw, 14px)', background: '#18150f', border: '1px solid #3d362a', borderRadius: '26px', boxShadow: '0 28px 80px rgba(0,0,0,0.3)' }}
          >
            <img
              src="/images/kiwi/hero_kiwi.png"
              width="880"
              height="634"
              alt="The Flight Vending Machine explainer showing how a natural-language trip request becomes a Kiwi flight search and two or three bookable results"
              className="w-full h-auto block"
              style={{ borderRadius: '17px' }}
            />
          </figure>
        </div>

        <div className="max-w-2xl mx-auto prose-medium">

          {/* 00 */}
          <section className="mb-12">
            <StoryHeader num="00">Introduction</StoryHeader>
            <p>I wanted my coding agent to be the one place I could use to handle flights at the drop of a hat: ideally it would book a flight directly, and at minimum it would find the right flight and return a link that made booking simple. My existing setup was not reliable enough. It was a hacky skill built on a hacky library, with a complicated, multi-level optimization pipeline on top. Then I serendipitously saw the Kiwi MCP in a demo on the Goose OSS YouTube channel. It looked like a cleaner route to the unified agent experience I wanted, so we installed it to find out what it could really do.</p>
            <p>Goose is an open-source AI-agent platform we found interesting because its demos make MCP servers easy to discover and try. An MCP server exposes tools, but tools alone do not know the user's preferred workflow. A skill is a repeatable set of instructions a coding agent can follow. Skills are at the heart of Claude Code OS because they bridge the gap between human intent and what the tools exposed by an MCP can do. For this project, we read Goose's official material, installed the Kiwi MCP, and I manually inspected its tools. I asked Claude to create the visual explainer above, we tried a few simple examples, and Claude Code's questions and mine became a test campaign. We turned what we learned into a repeatable flight-search skill, used <Code>/sync-os</Code> to add it to the Claude Code OS repository, and tested the finished skill once from beginning to end.</p>
          </section>

          {/* 01 */}
          <section className="mb-12">
            <StoryHeader num="01">The tests we ran</StoryHeader>
            <p>We tested Kiwi with twelve flight-search scenarios to understand what it handles well and where it fails. We tested ambiguous locations such as “the Bay Area” and “Portland,” broad searches across many destinations, routes with no nonstop flights, and cabin classes unavailable at certain airports. We then tested individual filters—including weekdays, checked baggage, and airline exclusions—as well as deliberately impossible trips, searches far into the future, and a final search combining twelve conditions at once.</p>
          </section>

          {/* 02 */}
          <section className="mb-12">
            <StoryHeader num="02">What we learned</StoryHeader>
            <p>Kiwi handles flight-search filters very well. In our most complex test, it returned eleven itineraries while respecting all twelve conditions. Baggage costs were included correctly—the same trip increased from $329 to $397 when a checked bag was added—and excluded airlines stayed out of the results. The main problem is that Kiwi does not explain empty or ambiguous results. An unknown location looks the same as a route with no flights, ambiguous city names can be resolved without telling the user which airport was chosen, and searches more than about ten months ahead can return “no flights” simply because prices are not available yet.</p>
          </section>

          {/* 03 */}
          <section className="mb-12">
            <StoryHeader num="03">Why a skill</StoryHeader>
            <p>Those findings leave a clear set of questions. How should a natural-language trip request become one precise Kiwi search? Which airports should count when a user names a place rather than an airport? How do we map the user's preferences, exclude separate-ticket itineraries and airport overnights by default, and return only the best two or three options with booking links? If Kiwi returns nothing, how do we relax one constraint at a time and explain what prevented a match? And for dates near the edge of Kiwi's pricing window, how do we distinguish unavailable pricing from a route with no flights? The skill is the repeatable answer to those questions.</p>
          </section>

          {/* 04 */}
          <section className="mb-12">
            <StoryHeader num="04">The skill</StoryHeader>
            <p><Code>/find-flight-kiwi</Code> takes a natural-language trip request and converts it into a Kiwi search. It resolves airports using a one-hour travel-radius rule, maps the user's preferences to Kiwi's search parameters, and excludes separate-ticket itineraries and airport overnights by default. It then returns the best two or three options with booking links. If a search returns no results, the skill retries while relaxing one constraint at a time and explains which constraint prevented a match. For dates near the edge of Kiwi's roughly ten-month pricing window, it identifies the problem as unavailable pricing rather than incorrectly reporting that no flights exist.</p>
          </section>

        </div>

        {/* Project links — the source's 3-across action cards (+ the SKILL.md view Vivek added), in a breakout column like the source's 980px grid */}
        <div className="max-w-[880px] mx-auto mb-16 px-4 pt-8" style={{ borderTop: '1px solid #2e3140' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionCard href="https://github.com/VivekKarmarkar/claude-code-os/blob/main/skills/find-flight-kiwi/SKILL.md" icon="📓" small="Open the skill" strong="/find-flight-kiwi" />
            <ActionCard href="/skill-files/find-flight-kiwi-skill.html" icon="📜" small="Read the skill file" strong="SKILL.md" />
            <ActionCard href="https://github.com/VivekKarmarkar/claude-code-os" icon={<GitHubIcon />} small="Private GitHub repository" strong="Claude Code OS" />
          </div>
        </div>
      </article>
    </Layout>
  )
}
