import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ResolutionNotice from '../components/ResolutionNotice'

// Native Pattern A rebuild of goose-mcp-tests/mcp_lean_project_webpages/codex_voyp_lean_project_website.html
// (prose verbatim; the comparison table, video panel, story sections and link cards reproduced with the
// source's own values; hero image as a site asset)

// Source palette (kept for the figures — they are the page's content, not chrome)
const P = { surface: '#29241c', surfaceDeep: '#18150f', line: '#3d362a', text: '#f4eee2', body: '#d6cebf', muted: '#a99c85' }

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

// The source's two-column section heading: display h2 left, muted description right (stacks on phone)
function FigureHeading({ title, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-7 mb-6">
      <h2 className="font-bold" style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.035em', lineHeight: 1.1, maxWidth: '14ch' }}>{title}</h2>
      <p className="m-0 text-sm sm:max-w-[42ch]" style={{ color: P.muted, lineHeight: 1.55 }}>{children}</p>
    </div>
  )
}

const CRITERIA = ['Duplex model', 'Good interruption handling', 'Low latency', 'Economic pricing', 'Frictionless phone setup']
const ROWS = [
  { provider: 'ElevenLabs', marks: [false, true, false, false, false] },
  { provider: 'LiveKit', marks: [false, true, false, false, false] },
  { provider: 'VOYP', marks: [false, false, true, true, true] },
]

function Status({ yes }) {
  return (
    <span
      role="img"
      aria-label={yes ? 'Yes' : 'No'}
      className="inline-grid place-items-center rounded-full font-bold"
      style={{ width: 34, height: 34, fontSize: 22, lineHeight: 1, color: yes ? '#4ade80' : '#ff6b57', background: yes ? 'rgba(74, 222, 128, 0.10)' : 'rgba(255, 107, 87, 0.10)' }}
    >
      {yes ? '✓' : '✕'}
    </span>
  )
}

// The source's provider comparison table, reproduced with its own values (scrolls horizontally on phone)
function ComparisonTable() {
  return (
    <div className="overflow-x-auto" role="region" aria-label="Scrollable outbound voice-agent provider comparison" tabIndex={0} style={{ border: `1px solid ${P.line}`, borderRadius: 16, background: P.surfaceDeep }}>
      <table className="w-full border-collapse" style={{ minWidth: 760 }}>
        <thead>
          <tr>
            {['Provider', ...CRITERIA].map((h, i) => (
              <th key={h} scope="col" className={`p-4 font-bold uppercase ${i === 0 ? 'text-left' : 'text-center'}`} style={{ color: P.muted, background: P.surface, fontSize: 11, letterSpacing: '0.09em', lineHeight: 1.4, borderBottom: `1px solid ${P.line}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, r) => (
            <tr key={row.provider}>
              <td className="p-4 text-left align-top font-bold" style={{ color: P.text, fontSize: 14, lineHeight: 1.55, borderBottom: r < ROWS.length - 1 ? `1px solid ${P.line}` : 0 }}>{row.provider}</td>
              {row.marks.map((yes, i) => (
                <td key={i} className="p-4 text-center align-top" style={{ color: P.body, fontSize: 14, lineHeight: 1.55, borderBottom: r < ROWS.length - 1 ? `1px solid ${P.line}` : 0 }}><Status yes={yes} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 .7a11.3 11.3 0 0 0-3.57 22c.57.1.78-.25.78-.55v-2.18c-3.17.69-3.84-1.35-3.84-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.03-.71.08-.7.08-.7 1.14.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.53-.29-5.2-1.27-5.2-5.64 0-1.25.45-2.27 1.18-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17A10.9 10.9 0 0 1 12 5.93c.97 0 1.95.13 2.86.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.18 1.81 1.18 3.06 0 4.38-2.67 5.34-5.21 5.63.41.36.78 1.05.78 2.11v3.13c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z"/>
    </svg>
  )
}

function ActionCard({ href, icon, small, strong }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3.5 rounded-xl px-5 py-4 bg-neutral-950 border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-600 transition-colors"
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
            <h1>VOYP &mdash; The Errand Caller</h1>
            <p className="text-dark-muted text-lg mt-2">The VOYP MCP test campaign behind the <Code>/call-voyp</Code> skill</p>
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

        {/* Hero explainer — the source's framed panel, wider than prose */}
        <div className="max-w-[908px] mx-auto mb-14 px-4">
          <figure className="m-0" style={{ padding: 'clamp(8px, 1.5vw, 14px)', background: P.surfaceDeep, border: `1px solid ${P.line}`, borderRadius: 26, boxShadow: '0 28px 80px rgba(0,0,0,0.3)' }}>
            <img
              src="/images/voyp/hero_voyp.png"
              width="880"
              height="693"
              alt="The Errand Caller explainer showing how the VOYP MCP finds a business, prepares a phone mission, monitors the live call, and hangs up when appropriate"
              className="w-full h-auto block"
              style={{ borderRadius: 17 }}
            />
          </figure>
        </div>

        <div className="max-w-2xl mx-auto prose-medium">

          {/* 00 */}
          <section className="mb-12">
            <StoryHeader num="00">Introduction</StoryHeader>
            <p>I wanted my coding agent to be able to place a real phone call whenever a task was easier to handle by phone. Ideally, the voice system would be a direct duplex interface: the agent could listen, speak, and react naturally without my having to wire several services together. The ElevenLabs and LiveKit routes I found pushed me into setting up a phone number through Twilio or another telephony provider. That route became a KYC and setup bottleneck for me. VOYP removed it in the MCP setup I tested: the phone layer was already handled, I could start with inexpensive credits, and a subscription remained optional for standard calls.</p>
            <p>Goose is an open-source AI-agent platform we found interesting because its demos make MCP servers easy to discover and try. An MCP server exposes tools, but tools alone do not know the user's preferred workflow. A skill is a repeatable set of instructions a coding agent can follow. Skills are at the heart of Claude Code OS because they bridge the gap between human intent and what the tools exposed by an MCP can do. For this project, we read Goose's official material, installed the VOYP MCP, and I manually inspected its tools. I asked Claude to create the visual explainer above, we tried a few simple examples, and Claude Code's questions and mine became a test campaign. We turned what we learned into <Code>/call-voyp</Code>, used <Code>/sync-os</Code> to add it to the Claude Code OS repository, and tested the finished skill once from beginning to end.</p>
          </section>
        </div>

        {/* Outbound voice-agent comparison — the source's table figure, in a breakout column like its 980px grid */}
        <div className="max-w-[1012px] mx-auto mb-14 px-4 pt-10" style={{ borderTop: `1px solid ${P.line}` }}>
          <div className="prose-medium">
            <FigureHeading title="Outbound voice-agent comparison">The practical difference was not simply whether each product could talk, but how much infrastructure stood between the coding agent and a real call.</FigureHeading>
          </div>
          <ComparisonTable />
          <p className="mt-3.5 mb-0 text-xs" style={{ color: P.muted, lineHeight: 1.55 }}>Green means the provider meets the criterion for this outbound-calling use case; red means it does not. This is a practical scorecard based on the paths we evaluated, not a universal benchmark.</p>
        </div>

        <div className="max-w-2xl mx-auto prose-medium">
          {/* 01 */}
          <section className="mb-12">
            <StoryHeader num="01">The tests we ran</StoryHeader>
            <p>We tested VOYP in twelve scenarios, eleven of which involved real phone calls. The first two calls went to Vivek's own phone: one used the default settings, and the other used the premium engine, a better voice, and call recording. Three calls tested Hindi, Marathi, and English; during the English call, Vivek deliberately tried to interrupt the agent while it was speaking. Another call tested whether the agent could schedule a calendar appointment entirely through conversation. Four calls went to real businesses: two restaurants were asked about their opening hours, while the other two numbers reached a voicemail and a recorded greeting. Another call went to an AI-run shop in San Francisco. The final scenario tested only the search tools and did not place a call.</p>
          </section>
        </div>

        {/* Hear one of the calls — the source's video panel figure */}
        <div className="max-w-[1012px] mx-auto mb-14 px-4 pt-10" style={{ borderTop: `1px solid ${P.line}` }}>
          <div className="prose-medium">
            <FigureHeading title="Hear one of the calls">A live call from the test campaign, rendered as a waveform video.</FigureHeading>
          </div>
          <figure className="m-0" style={{ padding: 'clamp(8px, 1.5vw, 14px)', background: P.surfaceDeep, border: `1px solid ${P.line}`, borderRadius: 26 }}>
            <iframe
              src="https://www.youtube.com/embed/iZ_5I82JSm0"
              title="Waveform video of a live VOYP call from the test campaign"
              loading="lazy"
              className="block w-full border-0"
              style={{ aspectRatio: '16 / 9', borderRadius: 17 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </figure>
        </div>

        <div className="max-w-2xl mx-auto prose-medium">
          {/* 02 */}
          <section className="mb-12">
            <StoryHeader num="02">What we learned</StoryHeader>
            <p>VOYP successfully handled the English errand calls. Both restaurants answered the question in under thirty seconds, and one employee called the agent “ma'am” without realizing it was a machine. It also completed the calendar test: the agent suggested a meeting time during the call, Vivek agreed, and we later verified that the appointment appeared in his Google Calendar. However, the agent uses strict turn-taking and cannot be interrupted in any language. Its Hindi was stiff and overly formal, its Marathi was grammatically broken, and during the Marathi call it continued speaking even after it was directly told to hang up. It also cannot distinguish a machine from a person: it asked its questions to both the voicemail and the recorded greeting, and a person monitoring the transcript had to hang up. On the premium engine, calls cost about eight credits per minute, billing begins before the recipient answers, and the search tools are free.</p>
          </section>

          {/* 03 */}
          <section className="mb-12">
            <StoryHeader num="03">Why a skill</StoryHeader>
            <p>After the tests, the remaining problem was no longer “Can VOYP make the call?” It was: Is this a number Vivek approved? Which business and phone number match the request? What exact questions should the agent ask, and what is it not allowed to reserve or buy? Who watches the live transcript for voicemail, a recorded greeting, a completed mission, or a spending limit? How should the answers, cost, and recording come back without exposing the credential-bearing output of the account tool? Those are repeatable operator decisions, so they belong in a skill.</p>
          </section>

          {/* 04 */}
          <section className="mb-12">
            <StoryHeader num="04">The skill</StoryHeader>
            <p><Code>/call-voyp</Code> calls only phone numbers Vivek has approved. It uses the free search to find a business's number, turns the purpose of the call into a short list of questions, and tells the agent not to make reservations or purchases unless Vivek requested them. Once the call connects, the skill monitors the live transcript and hangs up when it detects voicemail or a recording, when the spending limit is reached, or when the mission is complete. It reports the answers first, followed by the cost, and attaches the recording when one was made. One account tool exposes calendar credentials in plain text, so the skill reads only the credit balance and never repeats the remaining information.</p>
          </section>
        </div>

        {/* Project links — the source's action cards (+ the SKILL.md view Vivek added), 3-across like the source grid */}
        <div className="max-w-[880px] mx-auto mb-16 px-4 pt-8" style={{ borderTop: '1px solid #2e3140' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionCard href="https://github.com/VivekKarmarkar/claude-code-os/blob/main/skills/call-voyp/SKILL.md" icon="📓" small="Open the skill" strong="/call-voyp" />
            <ActionCard href="/skill-files/call-voyp-skill.html" icon="📜" small="Read the skill file" strong="SKILL.md" />
            <ActionCard href="https://github.com/VivekKarmarkar/claude-code-os" icon={<GitHubIcon />} small="Private GitHub repository" strong="Claude Code OS" />
          </div>
        </div>

      </article>
    </Layout>
  )
}
