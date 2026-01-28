import Layout from '../components/Layout'

export default function CVNNs() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

          {/* A Train Badge */}
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#0039A6' }}
            >
              A
            </span>
            <span className="text-dark-muted">Physics for AI</span>
          </div>

          {/* Title */}
          <section className="mb-16">
            <h1>Complex-Valued Neural Networks</h1>
          </section>

          {/* Text Snippet 1 */}
          <section className="mb-8">
            <p>
              Complex numbers are the go-to mathematical framework for describing Signal Processing, Quantum Mechanics and Optics which in turn means that Neural Networks designed with Complex-valued architectures can be supported via Optical Computing, thus fundamentally giving rise to more energy-efficient hardware for Artificial Intelligence.
            </p>
            <p>
              In addition, a single complex-valued neuron has been shown to solve the XOR gate problem, a functionality which a biological neuron was recently shown to have but a property that the "standard" neurons lack.
            </p>
            <p>
              These ideas are of paramount fundamental value and they needed to be taken seriously while discussing the larger context of Physics and AI—this is primarily <em>Physics for AI</em> and I thought it was an absolute necessity to include a short seminar style video on this topic.
            </p>
          </section>

          {/* Video 1 */}
          <section className="mb-16">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/MxL5-kMZn5g"
                title="Complex-Valued Neural Networks"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>

          {/* Text Snippet 2 */}
          <section className="mb-8">
            <p>
              While Complex Numbers in Machine Learning—particularly in the context of Physics and AI—sound very promising, I decided it was worth talking to an expert using these ideas practically. This led to an informational interview with Prof. Roarke Horstmeyer of Duke University, who conducts research at the intersection of Machine Learning and Optics for Biomedical Applications, using complex numbers as the prime mathematical machinery.
            </p>
            <p>
              The key motivation behind including this interview was to share a message: <em>this is not just scientists buying into the AI & ML hype—there is legitimate research bridging the abstract (complex numbers) with the practical (biomedical engineering) via AI as the primary tool.</em>
            </p>
          </section>

          {/* Video 2 */}
          <section className="mb-16">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/4cKtSahMAJo"
                title="Interview with Prof. Roarke Horstmeyer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>


        </div>
      </article>
    </Layout>
  )
}
