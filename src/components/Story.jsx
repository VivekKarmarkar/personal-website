import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Story() {
  const [thesisOpen, setThesisOpen] = useState(false)

  return (
    <article className="w-full py-16 px-4">
      <div className="max-w-2xl mx-auto prose-medium">

        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          <img
            src="/images/vivek-profile.jpg"
            alt="Vivek Karmarkar"
            className="w-40 h-40 rounded-full object-cover"
          />
        </div>

        {/* Introduction */}
        <section className="mb-16">
          <p className="text-xl font-medium mb-4">
            Hi, I'm Vivek — an AI-enabled human exploring my curiosity.
          </p>
          <p>
            I like tinkering around and building small fun projects if something tickles my fancy or inspires me. Many of the artifacts you see around are products of my tinkering. If I've managed to spark your curiosity, take a look at{' '}
            <Link to="/wonyp" style={{ color: '#FCCC0A' }} className="underline underline-offset-2 hover:opacity-80">"What's on your Plate?"</Link>
            {' '}and{' '}
            <Link to="/dancer-claude" style={{ color: '#FCCC0A' }} className="underline underline-offset-2 hover:opacity-80">"Dancer Claude"</Link>.
          </p>
          <p>
            I come from a Physics background and like many Physicists who came before, I deeply value "deep kinesthetic thinking" = "movement" + "deep thinking" which ideally for me would be walking for 10–12 hours and thinking about things that I'm curious about. With the advent of Claude Code, this has almost become a reality... almost because remote-control breaks unexpectedly and some days might have undesirable social contracts called "meetings". However, I have and am continuing to customize Claude Code into what I call the{' '}
            <Link to="/claude-code-os" style={{ color: '#A7A9AC' }} className="underline underline-offset-2 hover:opacity-80">"Claude Code OS"</Link>
            {' '}with 150+ skills. Claude Code is truly a game changer and is also my "AI friend" that "coded" up this very website!
          </p>
          <p>
            I also like sharing my knowledge and have educational content available on Physics, Math, Machine Learning, Physics-informed Machine Learning and Claude Code in the form of{' '}
            <Link to="/teaching-pinns/lectures" style={{ color: '#6CBE45' }} className="underline underline-offset-2 hover:opacity-80">traditional lectures</Link>,{' '}
            <Link to="/teaching-pinns/tutorials" style={{ color: '#6CBE45' }} className="underline underline-offset-2 hover:opacity-80">interactive coding tutorials</Link>,{' '}
            <Link to="/interactive-sims" style={{ color: '#6CBE45' }} className="underline underline-offset-2 hover:opacity-80">interactive games</Link>
            {' '}and as{' '}
            <a href="#" onClick={e => e.preventDefault()} style={{ color: '#888888' }} className="underline underline-offset-2 cursor-default opacity-60">audio lectures</a>.
          </p>
          <p>
            Finally, I am a citizen of the world. I was born in NJ (USA) in the NYC metropolitan area, spent a lot of time in Pune and Kolkata (India), lived in Sheffield (UK) and Copenhagen (Denmark). NYC (USA) is one of my favourite cities and this website is "NYC-subway" themed — have a look :)
          </p>
        </section>

        {/* Collapsible Thesis */}
        <section className="mb-16 rounded-xl bg-neutral-900 border border-neutral-800 p-6">
          <button
            onClick={() => setThesisOpen(!thesisOpen)}
            className="flex items-center gap-3 w-full text-left group"
          >
            <h2 className="group-hover:opacity-80 transition-opacity m-0">The Thesis</h2>
            <svg
              className="w-5 h-5 text-dark-muted transition-transform duration-300"
              style={{ transform: thesisOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {thesisOpen && (
            <div className="mt-6">
              <p>
                AI alignment may be the most important tractable problem of our time—and it smells like physics.
              </p>
              <p>
                Here's what I mean. AI capabilities are advancing faster than our understanding of how these systems actually work. The gap is dangerous. And the people making real progress on closing it—on alignment, on interpretability, on mechanistic understanding—tend to reach for the physicist's toolkit. First principles thinking. Probing systems to see what breaks. Building up from fundamentals rather than patching symptoms. It's not a coincidence that so many AI safety leaders came from physics backgrounds.
              </p>
              <p>
                There's also the physical layer that most AI discourse ignores. AI doesn't run on abstractions—it runs on hardware. Energy efficiency, novel computing substrates like optical processors, embodied robots that need to navigate the real world. All of this is physics territory. The software and the substrate aren't separate problems.
              </p>
              <p>
                Now imagine a future where this all works out. Where AI systems are aligned, where they can do science—real science, Nobel Prize-winning science. What happens to a field like physics then? I think it becomes truly non-utilitarian. Not "non-utilitarian with an asterisk" because physicists were always employable with the right coding skills. Actually non-utilitarian. Pursued for wonder, for joy, for the sheer pleasure of understanding. Interactive simulations and visual explanations will still be consumed—because they were always consumed for learning and delight, not just career advancement.
              </p>
              <p>
                Physics-informed neural networks sit at exactly this intersection. For the physics student, they're a natural extension—you already have the PDEs, now you're teaching a neural network to respect them. For the mathematically-inclined non-physicist, they're a fresh lens on what machine learning can do when you give it structure. Either way, it's a different perspective.
              </p>
              <p>
                This site lives at the intersection: building physics sims with AI, designing educational content on PINNs, doing research where both fields inform each other.
              </p>
              <p>
                I know this all sounds a bit Black Mirror. But there's a White Mirror version too—and I think it's worth aspiring to. A future where learning is genuinely about joy and curiosity. AI is already accelerating the creation of interactive educational content. Extrapolate forward: brain-computer interfaces will let us communicate intent directly to these models (this isn't science fiction—researchers are already doing it). Error rates will drop. And when they do, what will actually matter is imagination. Ideas. Personal taste. The ability to iterate on a vision until it's right. And ultimately, the deep domain expertise—in physics, in pedagogy—to know when it <em>is</em> right. That's the future I'm building toward.
              </p>

              <h3 className="flex items-center gap-3 mt-10">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: '#0039A6' }}
                >
                  A
                </span>
                Physics for AI
              </h3>
              <p>
                I've always thought like a physicist. That means I instinctively want to strip things down to their building blocks, push them to their limits, and ask: what's <em>really</em> going on here? When I started working with AI systems, I brought that same instinct with me.
              </p>
              <p>
                What happens when you extend AI algorithms into physics scenarios? You get domains with known ground truths, precise mathematics, observable dynamics. You can stress-test the algorithms in ways that reveal their assumptions. You can start to crack open the black box.
              </p>
              <p>
                This is what I mean by Physics <em>for</em> AI—using the physicist's toolkit to understand AI itself. Not just asking "does it work?" but "why does it work?" and "what are the mechanics underneath?" My goal is to contribute to building AI systems that are more mechanistic, more interpretable, more grounded in first principles.
              </p>
              <p>
                There's also a meta-layer to this work that I find endlessly fascinating: human-AI collaboration itself. I spend a lot of time probing how large language models behave under different modes of interaction. How do they reason? How do they adapt? What happens when you push them in unexpected directions? This isn't just intellectual curiosity—it's practical. Understanding these dynamics is how you engineer better prompting techniques, better workflows, better ways of partnering with machine intelligence.
              </p>

              <h3 className="flex items-center gap-3 flex-wrap mt-10">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: '#FF6319' }}
                >
                  P
                </span>
                AI for Physics
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: '#6CBE45' }}
                >
                  E
                </span>
                Education
              </h3>
              <p>
                Now flip it around.
              </p>
              <p>
                I care deeply about physics education, and I think the medium of the textbook is fundamentally broken. It's static. It's passive. It was designed for a world before interactivity, before simulation, before generative AI. We can do so much better.
              </p>
              <p>
                Take something like PhET simulations—they're wonderful, genuinely transformative for learning. But here's the problem: a single high-quality simulation typically requires a team of experts, six months of development, and serious funding. That's not scalable. That puts the power to create these experiences in the hands of well-resourced institutions, not individual educators.
              </p>
              <p>
                Generative AI changes the equation. What once took a team and half a year can now be spun up rapidly. The bottleneck isn't resources anymore—it's imagination and tooling. I'm working on bridging that gap, on giving physics educators the ability to create interactive experiences without needing a development team behind them.
              </p>

              <h3 className="mt-10">
                Veritas<sup className="text-accent">(Blue·Pi)</sup>
              </h3>
              <p>
                There are two creators who've shaped how I think about science communication: 3Blue1Brown and Veritasium.
              </p>
              <p>
                3Blue1Brown does something magical with visual mathematics. Every animation serves understanding. When you watch one of his videos, you get this feeling of <em>finally getting it</em>—the moment when abstraction becomes intuition, when you can almost feel the concept clicking into place.
              </p>
              <p>
                Veritasium does something different but equally powerful. It's cinematic science storytelling. Discovery unfolds through narrative tension. You feel like you're on a journey—there's surprise, curiosity, the thrill of revelation.
              </p>
              <p>
                I kept asking myself: what if you could fuse these approaches?
              </p>
              <p>
                That question became <strong>Veritas<sup className="text-accent">(Blue·Pi)</sup></strong>—a human-AI collaborative IDE with agentic capabilities. The goal is to transform physics concepts into what I call <em>story videobooks</em>: a new medium that combines visual rigor with narrative depth. Think of it as a tool for creating 3Blue1Brown-meets-Veritasium content, with AI as a creative collaborator.
              </p>
              <p>
                But here's the thing that makes this really interesting to me: this isn't just a physics education project. It's also an exploration of something much harder—the intersection of AI, Physics, and Art.
              </p>
              <p>
                To build this well, I need to develop AI systems with <em>taste</em>. Systems that understand aesthetics. Systems that can make meaningful choices about visual rhythm, about narrative pacing, about what makes something beautiful versus merely correct. Film is an artistic medium, and teaching through film means grappling with questions of craft and emotional resonance that go way beyond technical accuracy.
              </p>

              <h3 className="mt-10">The Background</h3>
              <p>
                I didn't arrive at this intersection by accident.
              </p>
              <p>
                My foundation is in Physics—that's where the first-principles thinking comes from, the instinct to model everything, the comfort with abstraction. I also studied Sports Engineering, which pulled me in a different direction: toward real-world systems, bodies in motion, applied problem-solving where the messiness of reality can't be idealized away.
              </p>
              <p>
                I've lived in four countries—the United States, the United Kingdom, India, and Denmark. Each one taught me something different about how people relate to knowledge, to craft, to work. Moving between cultures gives you a certain flexibility of perspective. You learn that there's rarely only one way to frame a problem.
              </p>
              <p>
                My hobbies are Trail Running, Bouldering, Cricket, Coffee, and Claude Code.
              </p>
              <p>
                Nowadays, Claude Code ain't just my hobby—a /slashcommand a day keeps the manual labour away.
              </p>

              <h3 className="flex items-center gap-3 mt-10">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: '#EE352E' }}
                >
                  S
                </span>
                Physics for Sports
              </h3>
              <p>
                I wanted to combine my two interests: Physics and Sports. The question was how. I leaned into what I knew best—algorithmic thinking—and followed the thread wherever it led. Sports Physics. Sports Engineering. Motion tracking. Optical motion capture. And eventually, deep into the weeds of optical motion capture algorithms for human walking.
              </p>
              <p>
                That's where something clicked. The existing algorithms were shaped by the Signal Processing and Biomechanics communities—which explained why the literature was full of Least Squares and Kalman Filter variants. Solid techniques, but limited in a specific way. As an outsider—a physicist with a different toolbox—I could see the limitation clearly. I found a gap in one of the established algorithms and was able to fix it relatively easily, precisely because I wasn't trained to think within the existing paradigm.
              </p>
              <p>
                I extrapolated from there. The algorithm I'd been working with was <em>physics-inspired</em>—it borrowed ideas from physics, like using moment of inertia to optimize marker tracking. But it wasn't <em>physics-informed</em>. It didn't actually embed the underlying dynamics of how bodies move. To make real progress, I had a gut feeling we'd need something new: a method that was physics-informed <em>and</em> data-driven. Something that combined physics with machine learning. Physics with neural networks. Physics-Informed Neural Networks.
              </p>
              <p>
                That's how the S Train led me to PINNs.
              </p>
              <p>
                The loop has since closed in an unexpected way. I'm not using PINNs to build better motion tracking algorithms—at least not yet. Instead, I'm using motion tracking data to build better PINNs, and through that, better AI algorithms. The sports data became a proving ground for the AI research.
              </p>
              <p>
                But there's one place where PINNs and Sports still meet directly: PAT Scan. It's a new scanning technology I'm developing—think of it like a CT scan, but based on touch instead of X-rays. The goal is to map the stiffness of human tissue in 3D using surface measurements and physics-informed reconstruction. Medical physics, biomechanics, and AI, all converging in one project. The S Train isn't just backstory—it's still very much active.
              </p>

              <h3 className="mt-10">What I'm Building Toward</h3>
              <p>
                I don't have a tidy summary of where all this is going. The intersection of Physics and AI is still being mapped. The question of how humans and machines can genuinely collaborate—creatively, intellectually—is still wide open.
              </p>
              <p>
                What I know is this: I want to build things that matter. I want to understand things deeply. I want to stay at the frontier where the questions are still interesting and the answers aren't obvious yet.
              </p>
              <p className="text-xl font-medium">
                Rigorous but not dry. Playful but not unserious. Dark mode, always.
              </p>
              <p>
                That's the vibe. That's the work.
              </p>

              <h3 className="mt-10">The Documentation</h3>
              <p>
                I've been documenting all my night projects and spontaneous explorations on Medium. And in the spirit of everything I've said here about human-AI collaboration—most of my articles have their initial drafts written by ChatGPT or Claude, in their voice, with them credited as authors.
              </p>
              <p>
                This isn't something I hide. It's something I want to openly encourage. The future of writing, thinking, and building is collaborative. Let's be honest about it.
              </p>
              <p className="mt-8">
                <a
                  href="https://medium.com/@vivek-karmarkar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium"
                >
                  Read my work on Medium →
                </a>
              </p>
            </div>
          )}
        </section>

      </div>
    </article>
  );
}
