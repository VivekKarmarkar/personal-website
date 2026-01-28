import Layout from '../components/Layout'

export default function PatScan() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Train Badges */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#FF6319' }}
              >
                P
              </span>
              <span className="text-dark-muted">AI for Physics</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#EE352E' }}
              >
                S
              </span>
              <span className="text-dark-muted">Physics for Sports</span>
            </div>
          </div>

          {/* Title */}
          <section className="mb-12 prose-medium">
            <h1>Palpation-Assisted Tomography</h1>
          </section>

          {/* The Story */}
          <section className="mb-12 prose-medium">
            <h2>The Story</h2>
            <p>
              I'm as reliant on my Garmin as I am on Claude. Heart rate, step count, run tracking — it's all there. I even hacked together a simple app that uses ChatGPT's vision to analyze my food. But something's missing: a wearable that tells me how stiff my muscles get after a running or climbing session.
            </p>
            <p>
              Not just one number. Imagine a simple device that could visualize a <em>map</em> of stiffness across your entire leg — where it's tight, where it's loose, how it changes over time. That's the vision.
            </p>
            <p>
              Getting there is a long road. But here's an idea that might help: a new kind of scanning technology.
            </p>
          </section>

          {/* The Approach */}
          <section className="mb-12 prose-medium">
            <h2>The Approach</h2>
            <p>
              Think of how a CT scan works: it takes X-rays from many different angles, then combines them to build an image of what's inside. We're doing something similar — but with touch instead of X-rays.
            </p>
            <p>
              The idea: use simple, economical tools to press on a body part from different angles. Measure how the surface deforms using nothing more than smartphone cameras. Then use that surface data — the forces applied and the shape changes observed — to reconstruct a map of internal stiffness.
            </p>
            <p>
              The physics of how materials deform is well understood. By baking those equations into an AI algorithm, we can work backwards from what we see on the surface to infer what's happening inside. No expensive MRI. No ultrasound equipment. Just cameras, controlled pressure, and smart math.
            </p>
          </section>

          {/* The Name */}
          <section className="mb-12 prose-medium">
            <h2>The Name</h2>
            <p>
              Doctors have used palpation — the art of diagnosis through touch — for centuries. We're combining that intuition with the multi-angle scanning approach of computed tomography. Hence: <strong>Palpation-Assisted Tomography</strong>, or PAT Scan.
            </p>
            <p>
              Right now, we're building the bare-bones proof-of-concept: an algorithm that can take surface measurements and reconstruct an internal stiffness map. It's early days, but the physics is sound and the potential is real — an economical alternative to MRI and ultrasound elastography, starting with medical applications and maybe, someday, making its way into sports.
            </p>
          </section>

          {/* Link to Project Website */}
          <section className="mb-12 prose-medium">
            <p>
              <a
                href="/pat-scan/index.html"
                className="text-[#FF6319] hover:underline"
              >
                Visit the full project website →
              </a>
            </p>
          </section>

        </div>
      </article>
    </Layout>
  )
}
