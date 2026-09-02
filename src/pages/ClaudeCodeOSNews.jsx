import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ResolutionNotice from '../components/ResolutionNotice'

// Native Pattern A rebuild of goose-mcp-tests/mcp_lean_project_webpages/codex_reddit_lean_project_website.html
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

export default function ClaudeCodeOSNews() {
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
            <h1>Reddit &mdash; The Magazine Stand</h1>
            <p className="text-dark-muted text-lg mt-2">The Reddit MCP test campaign behind the <Code>/ask-reddit</Code> skill</p>
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

        {/* Hero explainer — the source's framed panel, wider than prose */}
        <div className="max-w-[908px] mx-auto mb-14 px-4">
          <figure className="m-0" style={{ padding: 'clamp(8px, 1.5vw, 14px)', background: '#18150f', border: '1px solid #3d362a', borderRadius: 26, boxShadow: '0 28px 80px rgba(0,0,0,0.3)' }}>
            <img
              src="/images/reddit/hero_reddit.png"
              width="880"
              height="699"
              alt="The Magazine Stand explainer showing how the Reddit MCP reads a community's hot posts and opens matching discussions"
              className="w-full h-auto block"
              style={{ borderRadius: 17 }}
            />
          </figure>
        </div>

        <div className="max-w-2xl mx-auto prose-medium">

          {/* 00 */}
          <section className="mb-12">
            <StoryHeader num="00">Introduction</StoryHeader>
            <p>I found the Reddit MCP through Goose and installed it because it looked like a quick way to bring current community discussions into my coding agent. I hoped it could provide another useful source of information and streamline the information-gathering skills we already use. After testing, it proved less promising than I expected: it is useful for seeing what is popular right now, but its lack of search makes it a poor fit for broader Reddit research.</p>
            <p>Goose is an open-source AI-agent platform we found interesting because its demos make MCP servers easy to discover and try. An MCP server exposes tools, but tools alone do not know the user's preferred workflow. A skill is a repeatable set of instructions a coding agent can follow. Skills are at the heart of Claude Code OS because they bridge the gap between human intent and what the tools exposed by an MCP can do. For this project, we read Goose's official material, installed the Reddit MCP, and I manually inspected its tools. I asked Claude to create the visual explainer above, we tried a few simple examples, and Claude Code's questions and mine became a test campaign. We turned what we learned into <Code>/ask-reddit</Code>, used <Code>/sync-os</Code> to add it to the Claude Code OS repository, and tested the finished skill once in live use.</p>
          </section>

          {/* 01 */}
          <section className="mb-12">
            <StoryHeader num="01">The tests we ran</StoryHeader>
            <p>We tested the Reddit server with seventeen scenarios: eleven technical tests followed by six real questions. The technical tests covered reading all of Reddit at once, fetching three communities in one request, requesting a community that does not exist, requesting a private community, requesting one hundred posts at once, retrieving fifty comments from a 193-comment thread, supplying incorrect post numbers and full web links, fetching picture posts, checking whether adult content is filtered, sending thirteen requests simultaneously, and reading the same post from two places at the same time. Vivek's six real questions asked whether Opus has gotten worse, whether Claude speaks a new language, whether Claude Code or Codex is winning, what people think of Codex's voice, whether Hermes is overhyped or good, and how four coding agents compare.</p>
          </section>

          {/* 02 */}
          <section className="mb-12">
            <StoryHeader num="02">What we learned</StoryHeader>
            <p>The server performed well on the technical tests. It can fetch several communities in one request, its data is live rather than cached, and all thirteen simultaneous requests succeeded. Its error messages are also clear and distinct: a missing community, a private community, and an incorrect post number each produce a different message. However, it does not filter adult content, and picture posts are returned without their images. Four of the six real questions concerned topics that were currently popular and received concrete answers. These included the community calling Claude's dialect “Claudish” and one user publishing a 150-test scoreboard comparing six coding models, which covered more models than the four named in the question. The other two questions failed because their topics were not trending that day. The server has no search function, so it cannot reach a post that is no longer on the current front pages.</p>
          </section>

          {/* 03 */}
          <section className="mb-12">
            <StoryHeader num="03">Why a skill</StoryHeader>
            <p>The tests showed a clear boundary: the MCP can report what is hot now, but it cannot search beyond the current front pages. So how should a natural-language question be classified before any tool is called? Is it asking what is hot with a topic, which the MCP can answer, or asking to find posts about something, which it cannot? Which community should be checked? Which ten to fifteen posts should be fetched, which titles match the question, and which threads should be opened? How should the final answer carry through real quotes and their scores? If the request requires search, how should the coding agent decline it clearly, explain the limitation, and point to a tool that can actually search? Those are the repeatable decisions the skill needs to make.</p>
          </section>

          {/* 04 */}
          <section className="mb-12">
            <StoryHeader num="04">The skill</StoryHeader>
            <p><Code>/ask-reddit</Code> takes a natural-language question and determines what kind of question it is. For a question such as “What's hot with X?”, it uses its own knowledge to choose the relevant community, fetches ten to fifteen posts, reads every title, opens the matching threads, and answers with real quotes and their scores. For a request such as “Find me posts about Y,” it declines, explains that the Reddit server cannot search, and points to a tool that can. Four live runs of the finished skill confirmed its scope: “What's hot with X?” is the type of question it answers well.</p>
          </section>
        </div>

        {/* Project links — the source's action cards (+ the SKILL.md view Vivek added), 3-across like the source grid */}
        <div className="max-w-[880px] mx-auto mb-16 px-4 pt-8" style={{ borderTop: '1px solid #2e3140' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionCard href="https://github.com/VivekKarmarkar/claude-code-os/blob/main/skills/ask-reddit/SKILL.md" icon="📓" small="Open the skill" strong="/ask-reddit" />
            <ActionCard href="/skill-files/ask-reddit-skill.html" icon="📜" small="Read the skill file" strong="SKILL.md" />
            <ActionCard href="https://github.com/VivekKarmarkar/claude-code-os" icon={<GitHubIcon />} small="Private GitHub repository" strong="Claude Code OS" />
          </div>
        </div>

      </article>
    </Layout>
  )
}
