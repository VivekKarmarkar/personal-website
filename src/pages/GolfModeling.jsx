import Layout from '../components/Layout'

export default function GolfModeling() {
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
            <h1>Golf Swing Biomechanics</h1>
          </section>

          {/* The Story */}
          <section className="mb-12 prose-medium">
            <h2>The Story</h2>
            <p>
              When I worked at TrackMan, I asked a colleague why we weren't modeling the golf swing with complete physics — equations of motion, moment of inertia, the whole deal. His answer was simple: <em>"We don't have most of the input parameters, and even if we did, the model is overly complicated. It doesn't provide the value it should given how complex it is. Data-driven techniques win here — it's much easier to fit a polynomial or a spline to the swing data near impact."</em>
            </p>
            <p>
              I went ahead with data-driven fitting at that point. But the question stuck with me: is full physics modeling really that bad?
            </p>
            <p>
              A few years later, I decided to find out. I built a multibody dynamics model — treating the golf swing as a double pendulum system with the arms as one segment and the club as another. The math was beautiful. The Lagrangian mechanics were elegant. And the implementation was... tedious.
            </p>
            <p>
              Every assumption I made felt shaky. The model needed parameters I couldn't measure. And when I finally got it working, I found myself thinking: <em>"Oh man, data-driven methods really are so much better for this problem."</em>
            </p>
            <p>
              My colleague was right all along. But I had to build the physics model myself to truly understand why.
            </p>

            {/* Video Embed */}
            <div className="mt-8 max-w-2xl">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-neutral-800">
                <iframe
                  src="https://www.youtube.com/embed/sJ5tDNFnnGY"
                  title="Golf Swing Double Pendulum Animation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </section>

          {/* Technical Summary */}
          <section className="mb-12 prose-medium">
            <h2>Technical Summary</h2>
            <p>
              The golf swing can be modeled as a <strong>double pendulum</strong>: the arms form one rotating segment, and the club forms the second. This system captures the essential mechanics — the transfer of angular momentum from the body through the arms to the club, culminating in maximum club head speed at impact.
            </p>
            <p>
              The physics follows from Lagrangian mechanics. You write down the kinetic and potential energy of the system, account for the lengths and masses of each segment, and derive the equations of motion. The model includes a driving torque at the shoulder (representing the golfer's effort) and tracks how energy flows through the system.
            </p>
            <p>
              I ran a parametric study to see how club mass affects performance. Heavier clubs store more energy but are harder to accelerate. Lighter clubs swing faster but deliver less momentum at impact. The sweet spot depends on the golfer's strength and technique — there's no universal optimum.
            </p>
            <p>
              The analysis also looked at the club angle at impact. This matters because the angle determines launch conditions — how high and how far the ball flies. The double pendulum naturally produces a "wrist snap" motion near impact, where the club whips through to catch up with the arms.
            </p>
            <p>
              The model worked. The physics was sound. But my colleague's point held: getting the input parameters right (segment lengths, masses, joint stiffnesses, driving torques) requires either expensive motion capture equipment or educated guesses. And even then, a well-tuned polynomial fit to real swing data predicts impact conditions more reliably than a physics model with uncertain inputs. The simple approach always wins...
            </p>
          </section>

        </div>
      </article>
    </Layout>
  )
}
