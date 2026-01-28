import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { perspectives } from './Perspectives'

// Custom content for ml-optics-complex-numbers
function MLOpticsContent() {
  return (
    <>
      <p>
        This conversation with Prof. Roarke Horstmeyer explores a fundamental tension at the intersection of Machine Learning and Physics: <strong>complex numbers are essential to optics, yet most ML libraries weren't built with them in mind.</strong>
      </p>
      <p>
        The issue runs deep. Machine Learning emerged from domains like text, natural language, and images—all fundamentally real-valued. But when you try to adapt neural networks for physical phenomena like optics, you quickly run into the limitation that the underlying mathematics demands complex-valued representations. This isn't a minor inconvenience; it's a structural mismatch between how ML tools work and what physics requires.
      </p>
      <p>
        We discuss the concept of <strong>complex-valued latent spaces</strong>—the idea that the internal representations learned by a neural network might themselves be complex numbers, not just the inputs and outputs. This opens up fascinating questions about how networks encode phase information and interference patterns.
      </p>
      <p>
        Roarke also shares his perspective on <strong>"Physical Layers"</strong> in neural networks—layers that encode known physics directly into the architecture rather than hoping the network learns it from data. And despite working at the cutting edge of computational optics, he confirms a timeless truth: <strong>"Data is King."</strong> Even the most elegant physics-informed architecture needs quality data to succeed.
      </p>
      <p>
        His advice for students? <strong>Focus on the fundamentals.</strong> The tools and frameworks will evolve, but a deep understanding of the underlying physics and mathematics will always be valuable.
      </p>
    </>
  )
}

// Custom content for genai-astrophysics-llms
function GenAIAstrophysicsContent() {
  return (
    <>
      <p>
        Dr. Rachel Akeson's journey is a reminder that owning the full picture matters. During her PhD, she owned the <strong>end-to-end pipeline</strong>—from data collection to analysis to interpretation. That holistic understanding shaped her career.
      </p>
      <p>
        Today, Rachel works at <strong>IPAC (Infrared Processing and Analysis Center) at Caltech</strong>, home to the <strong>NASA Exoplanet Archive</strong>. Our conversation revealed a perspective on "AI for Astrophysics" that I hadn't expected: her focus isn't on using neural networks to model physical systems, but on using <strong>LLMs to intelligently parse and process archive data</strong>—so that scientists can spend more time on the "fun" part of discovery.
      </p>
      <p>
        This is <strong>AI-driven efficiency enhancement</strong>: using modern language models as tools to accelerate the workflow of working scientists. It's a practical, grounded application of AI that's quite different from what I initially imagined when thinking about "AI + Astrophysics."
      </p>
      <p>
        For contrast, consider someone like <strong>Katie Bouman</strong>, who uses Neural Fields to image black holes—that's the more expected intersection of PINNs and astrophysics, where neural networks directly model physical phenomena. Rachel's work represents a complementary but distinct approach: AI as infrastructure, not as physics simulator.
      </p>
      <p>
        Her closing advice? Simple and timeless: <strong>"Follow your curiosity."</strong>
      </p>
    </>
  )
}

export default function PerspectivePage() {
  const { perspectiveId } = useParams()
  const perspective = perspectives.find(p => p.id === perspectiveId)

  if (!perspective) {
    return (
      <Layout>
        <div className="w-full py-16 px-4 text-center">
          <h1 className="text-2xl text-white">Perspective not found</h1>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Back to Perspectives */}
      <div className="w-full pt-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/teaching-pinns/perspectives"
            className="inline-flex items-center gap-2 text-dark-muted hover:text-white text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Broader Perspectives
          </Link>
        </div>
      </div>

      <article className="w-full py-8 px-4">
        <div className="max-w-2xl mx-auto prose-medium">
          {/* Title */}
          <section className="mb-12">
            <h1>{perspective.title}</h1>
            {perspective.subtitle && (
              <p className="text-dark-muted text-lg mt-2">{perspective.subtitle}</p>
            )}
          </section>

          {/* Content */}
          <section className="mb-12">
            {perspective.id === 'ml-optics-complex-numbers' ? (
              <MLOpticsContent />
            ) : perspective.id === 'genai-astrophysics-llms' ? (
              <GenAIAstrophysicsContent />
            ) : (
              <p>Content coming soon...</p>
            )}
          </section>

          {/* YouTube embed */}
          <section className="mb-16">
            {perspective.id === 'ml-optics-complex-numbers' ? (
              <iframe
                className="w-full aspect-video rounded-lg"
                src="https://www.youtube.com/embed/4cKtSahMAJo"
                title="Machine Learning for Optics and Complex Numbers"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : perspective.id === 'genai-astrophysics-llms' ? (
              <iframe
                className="w-full aspect-video rounded-lg"
                src="https://www.youtube.com/embed/7wg_2rQe11o"
                title="Generative AI for Astrophysics and LLMs"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800">
                <span className="text-dark-muted">YouTube video coming soon</span>
              </div>
            )}
          </section>
        </div>
      </article>
    </Layout>
  )
}
