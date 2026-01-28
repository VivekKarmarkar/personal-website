import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import NeuralNetLegoSim from '../../sims/ml/NeuralNetLegoSim'

export default function NeuralNetLego() {
  return (
    <Layout>
      <div className="min-h-screen bg-dark-bg py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <Link
            to="/interactive-sims"
            className="inline-flex items-center gap-2 text-dark-muted hover:text-white text-sm mb-6 transition-colors"
          >
            <span>←</span>
            Back to Simulations
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Neural Net Lego</h1>
            <p className="text-dark-muted text-lg">
              Build neural network architectures visually and watch the code auto-generate
            </p>
          </div>

          {/* Philosophy note */}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
            <p className="text-accent text-sm">
              <strong>Philosophy:</strong> AI models are getting better at writing code — the valuable skill is now
              <em> understanding</em> the architecture-to-code mapping. Build your network like Lego blocks and
              see how it translates to code across different frameworks.
            </p>
          </div>

          {/* Simulation - breaks out of container for full width */}
          <div className="w-[calc(100vw-2rem)] ml-[calc(-50vw+50%+1rem)]">
            <NeuralNetLegoSim
              showFrameworkDropdown={true}
              height="800px"
            />
          </div>

          {/* Instructions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-900 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 text-sm">Adding Layers</h3>
              <p className="text-dark-muted text-xs">
                Drag the "Layer" block from the toolbox into the building area, or click the + button after existing layers.
              </p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 text-sm">Adding Neurons</h3>
              <p className="text-dark-muted text-xs">
                Drag neurons with different activation functions into layers, or click the + inside a layer. Click a neuron to cycle its activation.
              </p>
            </div>
            <div className="bg-neutral-900 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 text-sm">Frameworks</h3>
              <p className="text-dark-muted text-xs">
                Use the dropdown to see how your architecture translates to JAX/Equinox, PyTorch, TensorFlow/Keras, or Julia/Flux.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
