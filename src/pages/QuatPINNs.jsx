import Layout from '../components/Layout'

export default function QuatPINNs() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

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
                style={{ backgroundColor: '#0039A6' }}
              >
                A
              </span>
              <span className="text-dark-muted">Physics for AI</span>
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
          <section className="mb-16">
            <h1>Quaternionic Physics-Informed Neural Networks</h1>
          </section>

          {/* The Foundation */}
          <section className="mb-12">
            <p>
              Quaternions are a fundamental entity in Physics and Mathematics. The familiar dot products and cross products—probably the first key concepts introduced in Physics 101—are often just <em>introduced</em>. Their origin story is not told.
            </p>
            <p>
              The fundamental problem these vector products solve is the creation of a system that multiplies objects with multiple dimensions in ways that lead to physically meaningful results. Enter quaternions: hyper-complex numbers with one real part and an imaginary <em>vector</em> instead of an imaginary scalar.
            </p>
            <p>
              These objects can naturally encode rotations since they describe an axis and an angle. The familiar vector products are, in some sense, components of quaternion multiplication. Once you see this, you can't unsee it.
            </p>
          </section>

          {/* The Extension */}
          <section className="mb-12">
            <h2>Extending Neural Networks</h2>
            <p>
              Given how fundamental quaternions are, it makes sense that extending vanilla real-valued neural networks to quaternionic spaces might teach us something. But the math of quaternions being fundamentally different requires coding up functions for quaternionic algebra in modern deep learning frameworks—leveraging the automatic differentiation superpowers and standardization that frameworks like JAX provide.
            </p>
            <p>
              I extended Physics-Informed Neural Networks (an AI algorithm for solving differential equations) to Quaternionic Differential Equations. The expectation: getting PINNs to solve QDEs would validate the capability of PINNs (<em>AI for Physics</em>) while simultaneously revealing what physics tells us about good AI algorithm choices (<em>Physics for AI</em>). The software development to extend JAX with quaternionic algebra functions was itself an exercise in <em>Physics for AI</em>.
            </p>
          </section>

          {/* The Reality */}
          <section className="mb-12">
            <h2>What Actually Happened</h2>
            <p>
              In reality, it was tricky to get PINNs to work for QDEs. My intuition held its own—I discovered something very fundamental about better choices for AI algorithms. However, I am still working on this project and have not published the results on any public forum yet.
            </p>
            <p>
              What I did complete was a proof-of-concept extending PINNs to QDEs involving real-world, industry-grade Inertial Measurement Unit (IMU) sensor data from the R&D team of a world leader in this space—Movella/XSens. This project is entirely my <strong>independent research</strong>.
            </p>
          </section>

          {/* The Sports Connection */}
          <section className="mb-12">
            <h2>The Sports Connection</h2>
            <p>
              Data is king for machine learning, and I recognize that. While Quaternionic PINNs focus on the foundational aspects of neural networks, they're still fitting data — and using high-quality real-world data significantly enhances the credibility of the results.
            </p>
            <p>
              Quaternionic Differential Equations describe how rotations — and more broadly, how <em>pose</em> — change dynamically over time. Inertial Measurement Unit (IMU) sensors provide exactly this kind of data. While this work doesn't focus on the specific scenarios where IMU data matters most, real-world IMU data serves as an excellent source for validating the approach.
            </p>
            <p>
              And where do you find some of the best examples of IMU data collection? Sports. Athletes in motion, tracked by sensors, generating rich quaternionic time-series data. The S Train connection writes itself.
            </p>
          </section>

          {/* Recognition */}
          <section className="mb-12">
            <h2>Talks & Recognition</h2>
            <p>
              The proof-of-concept work led to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Accepted conference talk</strong> at the{' '}
                <a
                  href="https://archive.aps.org/smt/2025/mar-t37/8/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  APS Global Physics Summit 2025
                </a>
              </li>
              <li>
                <strong>Invited talk</strong> at the{' '}
                <a
                  href="https://mpl.mpg.de/events/event/solving-quaternion-differential-equations-qdes-for-inertial-measurement-unit-imu-orientation-estimation-using-physics-informed-neural-networks-pinns"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Max Planck Institute for the Science of Light
                </a>
              </li>
            </ul>
          </section>

          {/* Video placeholder */}
          <section className="mb-16">
            <h2>Video</h2>
            <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800">
              <span className="text-dark-muted">YouTube recording coming soon</span>
            </div>
          </section>

        </div>
      </article>
    </Layout>
  )
}
