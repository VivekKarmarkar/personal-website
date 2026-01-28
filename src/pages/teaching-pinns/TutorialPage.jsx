import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { tutorials } from './Tutorials'
import JaxTutorial from './JaxTutorial'
import JaxRegression from './JaxRegression'

export default function TutorialPage() {
  const { tutorialId } = useParams()

  // Render JaxTutorial for jax-tutorial
  if (tutorialId === 'jax-tutorial') {
    return <JaxTutorial />
  }

  // Render JaxRegression for jax-regression
  if (tutorialId === 'jax-regression') {
    return <JaxRegression />
  }

  const tutorial = tutorials.find(t => t.id === tutorialId)

  if (!tutorial) {
    return (
      <Layout>
        <div className="w-full py-16 px-4 text-center">
          <h1 className="text-2xl text-white">Tutorial not found</h1>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Back to Tutorials */}
      <div className="w-full pt-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/teaching-pinns/tutorials"
            className="inline-flex items-center gap-2 text-dark-muted hover:text-white text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Coding Tutorials
          </Link>
        </div>
      </div>

      <article className="w-full py-8 px-4">
        <div className="max-w-2xl mx-auto prose-medium">
          {/* Title */}
          <section className="mb-12">
            <h1>{tutorial.title}</h1>
            {tutorial.subtitle && (
              <p className="text-dark-muted text-lg mt-2">{tutorial.subtitle}</p>
            )}
          </section>

          {/* Content */}
          <section className="mb-12">
            <p>Tutorial content coming soon...</p>
          </section>

          {/* YouTube embed placeholder */}
          <section className="mb-16">
            <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800">
              <span className="text-dark-muted">YouTube video coming soon</span>
            </div>
          </section>
        </div>
      </article>
    </Layout>
  )
}
