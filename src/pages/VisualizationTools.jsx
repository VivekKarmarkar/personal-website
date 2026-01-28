import Layout from '../components/Layout'

export default function VisualizationTools() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* S Train Badge */}
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#EE352E' }}
            >
              S
            </span>
            <span className="text-dark-muted">Physics for Sports</span>
          </div>

          {/* Title */}
          <section className="mb-12 prose-medium">
            <h1>Visualization Tools</h1>
          </section>

          {/* Gait Analysis Visualization Tool */}
          <section className="mb-12 prose-medium">
            <h2>Gait Analysis Visualization Tool</h2>
            <p>
              While re-implementing optical motion capture algorithms for gait analysis — and developing new ones in-house — I needed a way to actually <em>see</em> what the algorithms were producing. Not just numbers in a spreadsheet, but the full gait sequence animated in sync with the computed joint angles.
            </p>
            <p>
              So I built a simple tool in MATLAB. Two panes: the top shows the three knee angles evolving over time, with a vertical line that tracks the current moment. The bottom pane shows the actual motion — "walking triangles" that connect key anatomical landmarks on each body segment, animated in sync with the timeline above.
            </p>
            <p>
              To visualize the reference frames that matter for the analysis, I added orthonormal triads — three perpendicular unit vectors at each segment showing exactly how the coordinate systems are oriented. You can watch them rotate as the leg moves through the gait cycle.
            </p>
            <p>
              It started as a validation tool — a way to catch bugs and sanity-check results on demand. It ended up being oddly entertaining. There's something satisfying about watching triangles walk.
            </p>

            {/* Video Embed */}
            <div className="mt-8 max-w-2xl">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-neutral-800">
                <iframe
                  src="https://www.youtube.com/embed/d4Cs4v1rME0"
                  title="Gait Analysis Visualization Tool"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </section>

          {/* Biomechanical Movement Visualization Tool */}
          <section className="mb-12 prose-medium">
            <h2>Biomechanical Movement Visualization Tool</h2>
            <p>
              This is the core primitive underneath the gait analysis tool — the foundational layer that makes the walking triangles possible.
            </p>
            <p>
              Before you can visualize a specific application like gait, you need a general-purpose engine for rendering rigid body motion: taking marker trajectories, computing segment poses, and drawing the resulting geometry frame by frame. This tool handles all of that — the coordinate transformations, the reference frame tracking, the synchronized playback.
            </p>
            <p>
              The gait analysis visualization was just one configuration built on top of this primitive. The same engine could visualize a golf swing, a throwing motion, or any other biomechanical sequence. Build the foundation right, and the applications come easy.
            </p>

            {/* Walking */}
            <h3 className="mt-8 font-bold">Walking</h3>
            <div className="mt-4 max-w-2xl">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-neutral-800">
                <iframe
                  src="https://www.youtube.com/embed/cBEt-2HYYDM"
                  title="Walking Visualization"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Running */}
            <h3 className="mt-8 font-bold">Running</h3>
            <div className="mt-4 max-w-2xl">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-neutral-800">
                <iframe
                  src="https://www.youtube.com/embed/Qn5qVPrlv90"
                  title="Running Visualization"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Squats */}
            <h3 className="mt-8 font-bold">Squats</h3>
            <div className="mt-4 max-w-2xl">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-neutral-800">
                <iframe
                  src="https://www.youtube.com/embed/CBmNhfnSEiE"
                  title="Squats Visualization"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Star Movement */}
            <h3 className="mt-8 font-bold">Star Movement</h3>
            <div className="mt-4 max-w-2xl">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-neutral-800">
                <iframe
                  src="https://www.youtube.com/embed/B_1ZJ3CsBZQ"
                  title="Star Movement Visualization"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </section>

        </div>
      </article>
    </Layout>
  )
}
