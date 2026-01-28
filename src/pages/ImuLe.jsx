import Layout from '../components/Layout'

export default function ImuLe() {
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
            <h1>Lyapunov Exponents from IMU Data</h1>
          </section>

          {/* The Story - Two Column Layout */}
          <section className="mb-12 prose-medium">
            <h2>The Story</h2>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Text Column */}
              <div className="lg:w-3/5">
                <p>
                  I like trail running. So when the NACOB 2022 conference had a session on trail running biomechanics, I was there. Researchers from Brooks and BOA were discussing a hard problem: how do you actually <em>quantify</em> stability on uneven terrain? Assigning meaningful metrics was proving difficult.
                </p>
                <p>
                  Then one of them said something that made me sit up: <em>"Dan suggested we try using Lyapunov Exponents, but that seems like some fancy math..."</em>
                </p>
                <p>
                  I was sitting in that room thinking: I run on trails. I want to work with IMU sensors. And my MS Physics thesis at IISER Kolkata was on understanding the effect of complex-valued fixed points on limit cycles — the mathematics of nonlinear dynamics and stability. Someone had just spelled out the exact challenge I wanted, but didn't know existed.
                </p>
                <p>
                  So I started pursuing it. The reality of research hit quickly: the hardest part wasn't the math. It was reliably getting the sensors to sync to the lab stations, and figuring out how to place sensors on sweaty skin in a non-intrusive manner.
                </p>
                <p>
                  I also realized I hadn't fully understood the Lyapunov Exponent arguments in the literature — it seemed like a metric being computed and used as a proxy for stability, without the deeper dynamical systems interpretation I was hoping for. So I simplified: a proof-of-concept with walking data, computing LE from IMU signals based on established methods.
                </p>
                <p>
                  That's IMU-LE. Trail running serendipity meets nonlinear dynamics meets the unglamorous reality of sensor placement.
                </p>
              </div>

              {/* Image Column */}
              <div className="lg:w-2/5">
                <img
                  src="/physics-for-sports/lyapunov-exponent-project/project-page-image.png"
                  alt="Phase space trajectory and Lyapunov exponent divergence plot"
                  className="w-full rounded-lg border border-neutral-800"
                />
              </div>
            </div>
          </section>

          {/* Technical Summary */}
          <section className="mb-12 prose-medium">
            <h2>Technical Summary</h2>
            <p>
              The Lyapunov exponent quantifies how fast nearby trajectories in a dynamical system diverge from each other. If you start two identical systems with slightly different initial conditions, a positive Lyapunov exponent means they'll drift apart exponentially — the hallmark of chaos and sensitive dependence on initial conditions.
            </p>
            <p>
              For gait analysis, this translates to: <em>how quickly does your body recover from small perturbations while walking?</em> A higher exponent suggests less stable gait. Literature suggests it's the best single metric for quantifying walking stability.
            </p>
            <p>
              The trick is that you can't directly observe the full dynamical system — you only have a 1D time series from an accelerometer. The solution is <strong>state-space reconstruction</strong>: transform the signal into a higher-dimensional space using time-delayed copies of itself. Remarkably, the reconstructed dynamics are topologically equivalent to the true dynamics, so Lyapunov exponents computed this way are valid.
            </p>
            <p>
              The data pipeline started with motion sensors strapped to the shin, recording 100 times per second. From each walking session, I extracted the middle 150 steps — not the first or last, which might be influenced by speeding up or slowing down. Each step was resampled to exactly 100 data points. From there: reconstruct the state-space, compute the divergence curve, fit lines to the early growth phase and the later flat phase, and extract the Lyapunov exponents.
            </p>
            <p>
              The results were encouraging. The divergence curves behaved exactly as expected: rapid initial growth as nearby paths separate, then flattening out once they've drifted as far apart as the system allows. Left-right symmetry showed up clearly. The left leg turned out to be more reliable than the right, with the front-to-back acceleration giving the most consistent results across trials.
            </p>
            <p>
              One small innovation: I used RANSAC — a computer vision algorithm — to automatically detect when the subject was standing still between walking sessions. It's not a standard tool in this field, but it worked cleanly here, making the data extraction almost fully automatic.
            </p>
          </section>

        </div>
      </article>
    </Layout>
  )
}
