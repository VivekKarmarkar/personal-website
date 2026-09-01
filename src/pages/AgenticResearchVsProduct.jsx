import Layout from '../components/Layout'
import ResolutionNotice from '../components/ResolutionNotice'

function Callout({ color = '#f28c3b', children }) {
  return (
    <div className="rounded-r-xl my-7" style={{ background: '#161b22', borderLeft: `3px solid ${color}`, padding: '20px 24px', fontSize: '17px', lineHeight: 1.6 }}>
      {children}
    </div>
  )
}

export default function AgenticResearchVsProduct() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

          <ResolutionNotice />

          {/* W Train Badge */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#996633' }}
              >
                W
              </span>
              <span className="text-dark-muted">Writing</span>
            </div>
          </div>

          {/* Hero */}
          <section className="mb-8">
            <p className="mb-4" style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', color: '#f28c3b' }}>Hypothesis</p>
            <h1>Agentic Research Beats Agentic Product Development</h1>
            <p className="text-dark-muted text-lg mt-4" style={{ marginBottom: 0 }}>Why a coding agent can one-shot a novel algorithm but not a novel product &mdash; and what that means for how you build each.</p>
            <p className="mt-5" style={{ color: '#8888aa', fontSize: '15px', letterSpacing: '0.5px', marginBottom: 0 }}>1 September 2026</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Agentic Coding</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316b0', border: '1px solid #f9731630' }}>Claude Code</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8', border: '1px solid #38bdf840' }}>Algorithm Discovery</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8', border: '1px solid #38bdf840' }}>Product Development</span>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80', border: '1px solid #4ade8040' }}>AI Startups</span>
              </div>
            </div>
          </section>

          {/* The observation */}
          <section className="mb-14">
            <h2>The observation</h2>
            <p>Coding agents are increasingly used for two very different kinds of work. One is scientific or algorithmic research &mdash; designing novel components, implementing standard ones, integrating them into working pipelines. The other is building products &mdash; apps, tools, and interfaces meant for human use.</p>
            <p>A pattern emerges: research tasks work remarkably well with a <strong>scaffolding + one-shot</strong> approach. You set up the problem, give a few starting points, and let the agent run. Products don&rsquo;t respond to the same treatment. A one-shot build produces something that looks roughly right but feels wrong the moment someone uses it.</p>
            <p>The question: <strong>why does one-shotting work for research and fail for products?</strong></p>
          </section>

          {/* The hypothesis */}
          <section className="mb-14">
            <h2>The hypothesis: research has an oracle</h2>
            <p>When you set up a scientific computing problem &mdash; designing an algorithm to reconstruct some quantity from measurements, for example &mdash; there is a <strong>built-in verification</strong> at the end of the loop. The math either converges or it doesn&rsquo;t. The loss goes down or it doesn&rsquo;t. The reconstruction matches the ground truth or it doesn&rsquo;t.</p>
            <p>If the agent invents the wrong component, the oracle catches it immediately. The physics, the data, the convergence plot &mdash; these are <strong>automated success criteria</strong> that fire without any human in the loop. The spec doesn&rsquo;t need to be perfect because the oracle corrects the output.</p>

            <Callout color="#8fc97e">
              <strong style={{ color: '#e6edf3' }}>The key insight:</strong> the success criterion is embedded in the anatomy of the problem statement itself. When you write &ldquo;minimize this loss function subject to these physics constraints,&rdquo; you have told the agent exactly what success looks like &mdash; and the agent can verify it autonomously.
            </Callout>
          </section>

          {/* Products have no oracle */}
          <section className="mb-14">
            <h2>Products have no oracle</h2>
            <p>When an agent builds a UI, there is no convergence plot that says &ldquo;this button is in the wrong place.&rdquo; There is no loss function for &ldquo;this workflow feels awkward.&rdquo; The only oracle is <strong>a human using it</strong> &mdash; and that oracle only fires when someone is holding the device and pressing things.</p>
            <p>You can dictate a thorough spec. The agent will build it. The first version will look roughly right. Then someone <strong>uses</strong> it &mdash; and within ten minutes discovers that the thing specced isn&rsquo;t the thing actually wanted. Not because the spec was bad, but because using a product teaches you things that imagining a product can&rsquo;t.</p>
            <p>The button should be in a different spot, the viewer should scroll differently, the feedback flow should work in an order nobody anticipated. Corrections follow, the agent rebuilds, and you&rsquo;re in the incremental loop anyway &mdash; just with a wasted first pass.</p>

            {/* Comparison grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-8">
              <div className="rounded-[14px] p-5" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <h3 className="font-black text-lg mb-3 flex items-center gap-2" style={{ color: '#e6edf3' }}>
                  <span style={{ color: '#8fc97e' }}>&#x2713;</span> Research
                </h3>
                <p className="text-sm mb-2" style={{ color: '#c9d1d9' }}>Your taste sets the <strong style={{ color: '#e6edf3' }}>direction</strong>.</p>
                <p className="text-sm mb-2" style={{ color: '#c9d1d9' }}>The math verifies the <strong style={{ color: '#e6edf3' }}>execution</strong>.</p>
                <p className="text-sm mb-2" style={{ color: '#c9d1d9' }}>The spec can be loose because verification is cheap.</p>
                <p className="text-sm mb-0" style={{ color: '#c9d1d9' }}><strong style={{ color: '#e6edf3' }}>Oracle-closeable.</strong></p>
              </div>
              <div className="rounded-[14px] p-5" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <h3 className="font-black text-lg mb-3 flex items-center gap-2" style={{ color: '#e6edf3' }}>
                  <span style={{ color: '#e87e7e' }}>&#x2717;</span> Product
                </h3>
                <p className="text-sm mb-2" style={{ color: '#c9d1d9' }}>Your taste sets the <strong style={{ color: '#e6edf3' }}>direction</strong>.</p>
                <p className="text-sm mb-2" style={{ color: '#c9d1d9' }}>Your taste also verifies the <strong style={{ color: '#e6edf3' }}>execution</strong>.</p>
                <p className="text-sm mb-2" style={{ color: '#c9d1d9' }}>The spec must be tight because verification is expensive (you have to use it).</p>
                <p className="text-sm mb-0" style={{ color: '#c9d1d9' }}><strong style={{ color: '#e6edf3' }}>Human-closeable.</strong></p>
              </div>
            </div>

            <p>And a tight spec of a novel product is a contradiction &mdash; you can&rsquo;t tightly specify something you haven&rsquo;t used. That&rsquo;s why scaffolding + one-shot works for algorithms (the math oracle catches errors) and fails for products (there is no oracle until you hold it).</p>
          </section>

          {/* The one-shot isn't always wasted */}
          <section className="mb-14">
            <h2>The one-shot isn&rsquo;t always wasted</h2>
            <p>The one-shot works when the product is <strong>well-understood</strong>. &ldquo;Build me a standard to-do app&rdquo; &mdash; every design decision has been made a thousand times before. The agent&rsquo;s training data contains the oracle implicitly: the conventions, the patterns, the expected behavior.</p>
            <p>The one-shot fails when the product is <strong>novel</strong> &mdash; when someone is the first person building this specific thing and the requirements live in their fingers, not their head. If nobody has built it before, the spec can&rsquo;t be complete because the knowledge it needs doesn&rsquo;t exist until someone starts using it.</p>
          </section>

          {/* What this means for build methodology */}
          <section className="mb-14">
            <h2>What this means for build methodology</h2>
            <p>For research: <strong>spec the problem statement with the success criterion baked in, then let the agent run.</strong> The oracle handles verification. The agent can invent, implement, and validate autonomously.</p>
            <p>For a novel product: <strong>build incrementally.</strong> Build one piece. Use it. Learn what the next piece should be from using the first one. Each piece tested before the next is specced. The human stays in the loop not because the agent is incapable, but because the verification function lives in human judgment, not in math.</p>

            <Callout color="#7eb5e8">
              <strong style={{ color: '#e6edf3' }}>The build methodology:</strong> incremental, dictated, each piece tested before the next is specced. This is a foundational decision that belongs before the first line of code.
            </Callout>
          </section>

          {/* Implications for scientific research */}
          <section className="mb-14">
            <h2>Implications for scientific research</h2>
            <p>The success criterion embedded in the problem statement anatomy is not just a convenience &mdash; it is the <strong>mechanism</strong> that makes the agentic loop closeable. Without it, the agent cannot autonomously verify whether it succeeded, and the loop requires a human at every iteration.</p>
            <p>This distinction &mdash; oracle-closeable versus human-closeable &mdash; points toward a design principle for anyone using coding agents for algorithmic research: <strong>if you want the agent to close the loop autonomously, write the success criterion into the problem statement.</strong> The more precisely you can state what success looks like in terms the agent can evaluate, the more of the loop the agent can own.</p>
          </section>

          {/* Footer */}
          <footer className="pt-6" style={{ borderTop: '1px solid #30363d' }}>
            <p className="text-sm" style={{ color: '#8b949e' }}>
              Hypothesis developed through conversation, September 1, 2026.
            </p>
          </footer>

        </div>
      </article>
    </Layout>
  )
}
