import Layout from '../components/Layout'

export default function TrackMan() {
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
            <h1>TrackMan Experience</h1>
          </section>

          {/* Image */}
          <section className="mb-12">
            <img
              src="/physics-for-sports/trackman-experience/trackman_experience_image.png"
              alt="TrackMan Experience"
              className="w-full rounded-lg border border-neutral-800"
            />
          </section>

          {/* Write-up */}
          <section className="mb-12 prose-medium">
            <p>
              Tracking a golf ball that spins at thousands of RPM and rockets out of the field-of-view of multiple cameras is hard. The out-of-the-box tracking algorithms from optical motion capture providers like Qualisys weren't designed for this. And we had constraints: only one wall to mount four cameras, and we needed to track both the golf club and the ball simultaneously.
            </p>
            <p>
              Here's the insight that made it work: the club swing happens in a different space than the ball flight. So we split the problem. Two cameras (CTC-1 and CTC-2) were focused on the club using regular tracking settings — that part was straightforward.
            </p>
            <p>
              The other two cameras (BTC-1 and BTC-2) we pushed to their limits. We lowered the data acquisition thresholds so they would track <em>anything</em> that reflects infrared light. Golf balls do. But so does random dust, reflections, and noise. The result? Beautiful club trajectories on one pair of cameras, and a sea of noise on the other.
            </p>
            <p>
              But here's the trick: a golf ball at rest, struck, and then tracked in early flight follows a <strong>piecewise linear trajectory</strong> — the first piece is horizontal (at rest), then a sharp transition (impact), then the flight path. RANSAC — a computer vision technique that excels at extracting lines from noisy images — was perfect for this. Feed it the sea of noise, and it finds the ball trajectory.
            </p>
            <p>
              Bonus: RANSAC automatically gives you the time-of-impact, which greatly simplifies all downstream analysis. That was my TrackMan experience — creative constraints breeding clever solutions.
            </p>
          </section>

        </div>
      </article>
    </Layout>
  )
}
