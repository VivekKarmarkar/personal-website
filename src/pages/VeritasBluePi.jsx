import Layout from '../components/Layout'

export default function VeritasBluePi() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header with both train badges */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: '#FF6319' }}
                >
                  P
                </span>
                <span className="text-dark-muted">AI for Physics</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: '#6CBE45' }}
                >
                  E
                </span>
                <span className="text-dark-muted">Education</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Veritas<sup className="text-accent">(Blue·Pi)</sup>
            </h1>
            <p className="text-dark-muted text-lg">
              An AI Physics Teacher that fuses the cinematic storytelling of Veritasium with the mathematical precision of 3Blue1Brown.
            </p>
          </section>

          {/* The Vision */}
          <section className="mb-12 prose-medium">
            <h2 className="text-xl font-semibold mb-6">The Vision</h2>

            <p className="text-dark-muted leading-relaxed mb-4">
              Veritasium and 3Blue1Brown have 14M+ combined subscribers because they've mastered physics education — one through compelling narratives and cinematic production, the other through beautiful mathematical visualizations.
            </p>

            <p className="text-dark-muted leading-relaxed mb-4">
              But there's only one Derek Muller and one Grant Sanderson. They can each produce maybe 50–100 videos in their careers.
            </p>

            <p className="text-white leading-relaxed mb-6 text-lg font-medium">
              What if that quality could scale infinitely?
            </p>

            <div className="space-y-4 mb-8">
              {/* The Veritasium Challenge */}
              <div className="flex gap-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                <div className="text-2xl">🎬</div>
                <div>
                  <div className="font-medium mb-1" style={{ color: '#FF6319' }}>The Veritasium Challenge</div>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    Long-form cinematic coherence. Today's video generation models excel at ~10 second clips. But engaging physics explanations require narratives with visual continuity across <em>minutes</em>, not seconds. Through proprietary techniques, we maintain character consistency and narrative flow — treating generative video as a computing primitive.
                  </p>
                </div>
              </div>

              {/* The 3Blue1Brown Challenge */}
              <div className="flex gap-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                <div className="text-2xl">📐</div>
                <div>
                  <div className="font-medium mb-1" style={{ color: '#6CBE45' }}>The 3Blue1Brown Challenge</div>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    Mathematical precision. Generative video can't accurately depict mathematical concepts — and worse, it's stochastic. We bridge natural language descriptions to precise geometric animations via <strong>Manim</strong> — the same framework Grant Sanderson created. Deterministic. Mathematically accurate. Seamlessly integrated.
                  </p>
                </div>
              </div>

              {/* The Fusion */}
              <div className="flex gap-4 p-4 rounded-lg border" style={{ borderColor: '#FF6319', backgroundColor: 'rgba(255, 99, 25, 0.1)' }}>
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-medium mb-1 text-white">The Fusion: Videobooks</div>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    The result is what we call <em>videobooks</em> — content synchronized to human comprehension speed that sits between audiobooks and cinema. Neither passive video nor pure audio, videobooks are an entirely new medium for knowledge communication. <span className="text-white">This is the Physics teacher I wish existed.</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Collaboration */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">The Collaboration</h2>

            <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 mb-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📚</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Eugenia Etkina</h3>
                  <p className="text-dark-muted text-sm leading-relaxed mb-3">
                    Distinguished Professor of Science Education at Rutgers University. Author of <em>College Physics: Explore and Apply</em> — a textbook that revolutionized how physics is taught by centering scientific reasoning and experimentation.
                  </p>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    I emailed her a link to my Electromagnetic Generator simulation and asked for her thoughts. She responded immediately. We set up a Zoom call. I pitched the idea of exploring videobooks together for her textbook.
                  </p>
                  <p className="text-white text-sm leading-relaxed mt-2">
                    Now we're collaborating.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Proof of Concept */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Proof of Concept: The Mystery Bottle</h2>

            <div className="mb-6">
              <p className="text-dark-muted leading-relaxed mb-4">
                This video demonstrates the fusion in action. It covers a section from Etkina's <em>College Physics</em>:
              </p>

              <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 mb-6">
                <div className="text-sm text-dark-muted mb-1">Newtonian Mechanics → Describing and Representing Interactions → Testing a Hypothesis</div>
                <div className="text-white font-medium">
                  Discovering that air applies an upward force on objects
                </div>
              </div>
            </div>

            {/* YouTube Embed */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-neutral-800">
              <iframe
                src="https://www.youtube.com/embed/RD7bxHtLxX0"
                title="The Mystery Bottle - Veritas^(Blue·Pi) Proof of Concept"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <p className="text-dark-muted text-sm mt-4 leading-relaxed">
              Notice how the cinematic narrative (Veritasium-style) seamlessly transitions to precise mathematical visualizations (3Blue1Brown-style). This is what scaling quality physics education looks like.
            </p>
          </section>

          {/* The Bigger Picture */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">The Bigger Picture</h2>

            <p className="text-dark-muted leading-relaxed mb-4">
              We're solving two fundamental AI challenges:
            </p>

            <ol className="list-decimal list-inside space-y-2 text-dark-muted mb-6">
              <li>Long-form video generation with narrative coherence</li>
              <li>Teaching AI to think like a Physicist (visual + mathematical + coherent)</li>
            </ol>

            <p className="text-dark-muted leading-relaxed mb-4">
              Once solved, this infrastructure enables applications across education, entertainment, research communication, and professional training — anywhere complex knowledge needs to be communicated with both precision and engagement.
            </p>

            <p className="text-dark-muted leading-relaxed">
              I'm not chasing a market opportunity. I'm building the Physics teacher I wish existed — one that combines the mathematical precision I need with the narrative clarity that actually makes things click.
            </p>

            <p className="text-white font-medium mt-4">
              This is what I think about at 2 A.M.
            </p>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-neutral-800">
            <p className="text-dark-muted text-sm mb-4">
              Read the full vision on{' '}
              <a
                href="https://medium.com/@vivek-karmarkar/veritas-blue-%CF%80-ai-physics-teacher-eb481b1a711d"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                style={{ color: '#FF6319' }}
              >
                Medium
              </a>
              .
            </p>
            <p className="text-dark-muted text-sm italic">
              Collaboration with Prof. Eugenia Etkina, Rutgers University.
            </p>
          </footer>

        </div>
      </article>
    </Layout>
  )
}
