import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { lectures } from './Lectures'

// Line colors from the MTA palette
const lineColors = {
  A: '#0039A6', // MTA blue
  P: '#FF6319', // MTA orange
}

function LineBadge({ line }) {
  return (
    <strong
      className="font-bold"
      style={{ color: lineColors[line] }}
    >
      {line}
    </strong>
  )
}

// Custom content for what-are-pinns-1
function WhatArePinns1Content() {
  return (
    <>
      <p>
        There is no textbook on PINNs—we are still in the early days. Given that this field is valuable (it has a station on both the <span style={{ color: lineColors.P }}><LineBadge line="P" /></span> and <span style={{ color: lineColors.A }}><LineBadge line="A" /></span> lines), there is a huge opportunity to communicate the core ideas well.
      </p>
      <p>
        The exercise one must do is to go straight to the source and extract its essence. This is what I do here with the foundational PINN paper discussion lectures.
      </p>
      <p>
        This lecture discusses the seminal <strong>Karniadakis et al. (2021)</strong> review paper{' '}
        <a
          href="https://www.nature.com/articles/s42254-021-00314-5"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          "Physics-informed machine learning"
        </a>{' '}
        published in <em>Nature Reviews Physics</em>—a landmark paper with 4,750+ citations that laid out the vision for integrating physics constraints into neural networks.
      </p>
    </>
  )
}

// Custom content for what-are-pinns-2
function WhatArePinns2Content() {
  return (
    <>
      <p>
        There is no textbook on PINNs—we are still in the early days. Given that this field is valuable (it has a station on both the <span style={{ color: lineColors.P }}><LineBadge line="P" /></span> and <span style={{ color: lineColors.A }}><LineBadge line="A" /></span> lines), there is a huge opportunity to communicate the core ideas well.
      </p>
      <p>
        The exercise one must do is to go straight to the source and extract its essence. This is what I do here with the foundational PINN paper discussion lectures.
      </p>
      <p>
        This lecture discusses the original <strong>Raissi, Perdikaris & Karniadakis (2019)</strong> paper{' '}
        <a
          href="https://www.sciencedirect.com/science/article/pii/S0021999118307125"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          "Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations"
        </a>{' '}
        published in the <em>Journal of Computational Physics</em>—the paper that introduced the PINN framework and coined the term itself.
      </p>
    </>
  )
}

// Custom content for pinns-sciml-roadmap
function RoadmapContent() {
  return (
    <>
      <p>
        <strong>AI for Science</strong> is a real thing. The <strong>2024 Nobel Prize in Chemistry</strong> went to DeepMind for <strong>AlphaFold</strong>—a watershed moment for the field.
      </p>
      <p>
        The intersection of AI and Science is a remarkably broad field, still in its infancy. It encompasses everything under the sun: from <span style={{ color: lineColors.A }}><LineBadge line="A" /> Physics for AI</span> to <span style={{ color: lineColors.P }}><LineBadge line="P" /> AI for Physics</span>, from <strong>Quantum Neural Networks</strong> to <strong>AlphaFold</strong> for protein structure prediction.
      </p>
      <p>
        This lecture discusses how <strong>PINNs</strong> fits into this broader landscape of Scientific Machine Learning. While the field is dynamic and rapidly evolving, the core ideas I discussed in Summer 2024 remain valuable context for understanding where we are and where we might be heading.
      </p>
    </>
  )
}

// Custom content for intro-pinns
function IntroPinnsContent() {
  return (
    <>
      <p>
        This lecture is meant to be an accessible and tasteful exposition to Physics-Informed Neural Networks (PINNs).
      </p>
      <p>
        PINNs serve as an organic starting point for Physics students entering AI. In my view, understanding PINNs is the shortest bridge from the "Physics Island" to the "AI Island"—which is why it's a station on the <span style={{ color: lineColors.A }}><LineBadge line="A" /> line</span> (Physics → AI).
      </p>
      <p>
        For those who want to go deeper and invent novel architectures for solving Physics problems, PINNs remains an excellent foundation. In this case, you're hopping on the <span style={{ color: lineColors.P }}><LineBadge line="P" /> line</span> (AI → Physics).
      </p>
      <p>
        This lecture systematically dismantles the core ideas from the cornerstone PINNs papers and reconstructs them from the ground up—using elementary problems from Physics and Engineering, presented in a way that aligns with the Physicist's way of thinking and, more broadly, the scientific method.
      </p>
      <p>
        This lecture is available on{' '}
        <a
          href="https://www.youtube.com/@vizuara"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Vizuara AI Lab's YouTube channel
        </a>
        —an EdTech start-up I collaborated with over Summer 2024—and has 16K+ views and 400+ likes and counting.
      </p>
    </>
  )
}

// Simple parser for **bold** text (for other lectures)
function formatText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function LecturePage() {
  const { lectureId } = useParams()
  const lecture = lectures.find(l => l.id === lectureId)

  if (!lecture) {
    return (
      <Layout>
        <div className="w-full py-16 px-4 text-center">
          <h1 className="text-2xl text-white">Lecture not found</h1>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Back to Lectures */}
      <div className="w-full pt-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/teaching-pinns/lectures"
            className="inline-flex items-center gap-2 text-dark-muted hover:text-white text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Traditional Lectures
          </Link>
        </div>
      </div>

      <article className="w-full py-8 px-4">
        <div className="max-w-2xl mx-auto prose-medium">
          {/* Title */}
          <section className="mb-12">
            <h1>{lecture.title}</h1>
            {lecture.subtitle && (
              <p className="text-dark-muted text-lg mt-2">{lecture.subtitle}</p>
            )}
          </section>

          {/* Content */}
          <section className="mb-12">
            {lecture.content === 'jsx' && lecture.id === 'intro-pinns' ? (
              <IntroPinnsContent />
            ) : lecture.content === 'jsx' && lecture.id === 'what-are-pinns-1' ? (
              <WhatArePinns1Content />
            ) : lecture.content === 'jsx' && lecture.id === 'what-are-pinns-2' ? (
              <WhatArePinns2Content />
            ) : lecture.content === 'jsx' && lecture.id === 'pinns-sciml-roadmap' ? (
              <RoadmapContent />
            ) : lecture.content && Array.isArray(lecture.content) ? (
              lecture.content.map((paragraph, index) => (
                <p key={index}>{formatText(paragraph)}</p>
              ))
            ) : (
              <p>Lecture content coming soon...</p>
            )}
          </section>

          {/* YouTube embed */}
          <section className="mb-16">
            {lecture.id === 'intro-pinns' ? (
              <iframe
                className="w-full aspect-video rounded-lg"
                src="https://www.youtube.com/embed/zjH8imO-UWo"
                title="Introduction to Physics-informed Neural Networks"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : lecture.id === 'what-are-pinns-1' ? (
              <iframe
                className="w-full aspect-video rounded-lg"
                src="https://www.youtube.com/embed/T1wohwIxfhk"
                title="What are PINNs? Part 1"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : lecture.id === 'what-are-pinns-2' ? (
              <iframe
                className="w-full aspect-video rounded-lg"
                src="https://www.youtube.com/embed/VKtDRp2PzzY"
                title="What are PINNs? Part 2"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : lecture.id === 'pinns-sciml-roadmap' ? (
              <iframe
                className="w-full aspect-video rounded-lg"
                src="https://www.youtube.com/embed/Wp7y9tf-ta4"
                title="PINNs and SciML Roadmap"
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
