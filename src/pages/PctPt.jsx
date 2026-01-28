import Layout from '../components/Layout'

export default function PctPt() {
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
            <h1>Point Cluster Technique with Perturbation Theory</h1>
          </section>

          {/* The Story */}
          <section className="mb-12 prose-medium">
            <h2>The Story</h2>
            <p>
              I wanted to combine Physics and Sports. That quest led me deep into the world of optical motion capture algorithms — the math behind tracking human movement with cameras.
            </p>
            <p>
              I was trying to understand an algorithm called the <strong>Point Cluster Technique</strong>. It's essentially a physics-inspired optimization algorithm for fitting optical motion capture data. The key word is <em>inspired</em>. It borrows ideas from physics — particularly the concept of moment of inertia from mechanics — to design an optimization scheme. But it doesn't embed the actual physics at play. It's physics-inspired, not physics-informed.
            </p>
            <p>
              Here's the problem: when you walk or run, your skin doesn't stay rigidly attached to your bones — it moves in complicated ways. But nobody drills holes into your bones to track them directly. Instead, we place sensors on the skin surface to estimate what the bone is doing. That discrepancy is where all hell breaks loose. The original algorithm tries to account for this movement as more than just noise through its physics-inspired optimization — but it doesn't inform the algorithm of the actual complicated physics of skin movement.
            </p>
            <p>
              I found that the physics-inspired optimization was incomplete. So I took it to completion — again borrowing ideas from physics, this time from an unexpected place: <strong>Perturbation Theory</strong> from quantum mechanics.
            </p>
            <p>
              It turns out that while I ventured into this interdisciplinary field of Physics for Sports... I was always a theoretical physicist at heart.
            </p>

            {/* Video Embed */}
            <div className="mt-8 max-w-2xl">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-neutral-800">
                <iframe
                  src="https://www.youtube.com/embed/dSjNnyRPydk"
                  title="Point Cluster Technique with Perturbation Theory"
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
              The Point Cluster Technique is built on a simple physical insight: for a rigid body, the <strong>principal moments of inertia</strong> should be constant. Imagine spinning a wrench — it has preferred axes of rotation determined by how its mass is distributed. Those don't change unless the wrench physically deforms.
            </p>
            <p>
              PCT computes an inertia tensor from the marker positions at each instant. If the markers were truly attached to a rigid bone, the eigenvalues of this tensor (the principal moments) would stay constant over time. But because markers sit on wobbly skin, the eigenvalues drift. PCT tries to fix this by adjusting the mathematical "mass" assigned to each marker to minimize that drift.
            </p>
            <p>
              The problem? PCT optimizes the eigenvalues collectively using a norm-based constraint. This works sometimes, but the mathematical constraints are brittle — in testing, the original PCT only produced valid results for about 20 out of 100 marker configurations. The rest failed completely.
            </p>
            <p>
              PCT-PT takes a different approach: instead of optimizing eigenvalues collectively, it uses <strong>eigenvalue perturbation theory</strong> to denoise the inertia matrix iteratively. The algorithm asks: if I have a noisy inertia tensor, what small correction would bring each eigenvalue back to its reference value? This is solved as a linear system, one eigenvalue at a time.
            </p>
            <p>
              The result? PCT-PT produced valid, continuous results for all 100 marker configurations. Center of mass errors dropped from 1.2 cm to 0.75 cm. Orientation errors fell from 2-4° to 1-2°. The mathematical constraints that broke PCT simply don't exist in the perturbation framework.
            </p>
            <p className="mt-6">
              <a
                href="https://www.nature.com/articles/s41598-023-47144-2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EE352E] hover:underline"
              >
                Read the paper in Nature Scientific Reports →
              </a>
            </p>
          </section>

        </div>
      </article>
    </Layout>
  )
}
