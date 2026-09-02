import Layout from '../components/Layout'
import ResolutionNotice from '../components/ResolutionNotice'

// Native Pattern A rebuild of tekscan-connector/tekscan_project_website_working.html
// (prose verbatim; section structure re-implemented in site styles; videos via the site embed pattern)

function YouTubeEmbed({ src, title, eyebrow }) {
  return (
    <div className="mb-10">
      {eyebrow && (
        <span className="block text-[12px] font-bold uppercase mb-3.5" style={{ color: '#9a9a9a', letterSpacing: '0.14em' }}>
          {eyebrow}
        </span>
      )}
      <div className="relative w-full rounded-xl overflow-hidden border border-neutral-800"
           style={{ paddingBottom: 'min(56.25%, 540px)', boxShadow: '0 4px 32px rgba(0,0,0,0.5)' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full border-none"
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  )
}

// Story-block header: the source's numbered, uppercase section label — in site typography
function StoryHeader({ num, children }) {
  return (
    <div className="mb-5">
      <span className="block mb-2 text-[12px] font-bold" style={{ color: '#f97316', letterSpacing: '0.16em' }}>{num}</span>
      <h2 style={{ margin: 0 }}>{children}</h2>
    </div>
  )
}

function Code({ children }) {
  return <code className="text-sm bg-neutral-800 px-1.5 py-0.5 rounded" style={{ color: '#f97316' }}>{children}</code>
}

const FLOW_STEPS = ['Hand', 'Sensor strip', 'Tekscan electronics', 'USB', 'Python', 'Claude Code']

function FlowChart() {
  return (
    <div
      className="flex flex-wrap items-center gap-2.5 my-6 px-5 py-4 rounded-xl"
      style={{ background: '#161822', border: '1px solid #2e3140' }}
      role="img"
      aria-label="Hand to sensor strip to Tekscan electronics to USB to Python to Claude Code"
    >
      {FLOW_STEPS.map((step, i) => (
        <span key={step} className="contents">
          <span className="px-2.5 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap" style={{ color: '#e6edf3', background: '#0f1019', border: '1px solid #2e3140' }}>{step}</span>
          {i < FLOW_STEPS.length - 1 && <span className="font-bold" style={{ color: '#f97316' }} aria-hidden="true">→</span>}
        </span>
      ))}
    </div>
  )
}

export default function ClaudeSense() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

          {/* Resolution guidance: phone portrait → landscape, laptop split → fullscreen */}
          <ResolutionNotice />

          {/* Train Badge — D */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-lg"
                style={{ backgroundColor: '#FCCC0A' }}
              >
                D
              </span>
              <span className="text-dark-muted">AI Demos</span>
            </div>
          </div>

          {/* Title */}
          <section className="mb-8">
            <p className="mb-4" style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#f97316' }}>Giving Claude a sense of touch</p>
            <h1>ClaudeSense</h1>
            <p className="text-dark-muted text-lg mt-2">A small hardware experiment with a bigger idea: one coding agent, one context, all the way from a physical measurement to a scientific answer.</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Claude Code</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316b0', border: '1px solid #f9731630' }}>Agentic Coding</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f9731680', border: '1px solid #f9731620' }}>Embodied AI</span>
              </div>
            </div>
          </section>

          {/* Top video */}
          <section className="mb-12">
            <YouTubeEmbed src="https://www.youtube-nocookie.com/embed/DjuOJzv9Or4" title="ClaudeSense — Short Demo (15 s)" />
          </section>

          {/* 00 */}
          <section className="mb-12">
            <StoryHeader num="00">One place, one context</StoryHeader>
            <p>Scientific work is full of handoffs. An instrument has its own software. That software may only run on one operating system. Data gets exported into another tool, analyzed somewhere else, and explained in yet another place. The researcher has to keep moving the files and the context between all of them.</p>
            <p>I wanted to see what happens when a coding agent holds that whole thread. Give it access to the instrument, let it take the measurement, keep the analysis beside the data, and return the result through the same conversation. The compatibility problems and awkward interfaces may still exist, but the researcher no longer has to coordinate them by hand.</p>
            <p>That is the sense of embodiment I care about here: direct access to measurements from the physical world. Once the agent can receive those measurements, it can do more than run a fixed script. It can compare possible models, choose or adapt an algorithm, design a new approach when needed, and use the result to decide what to measure next.</p>
          </section>

          {/* 01 */}
          <section className="mb-12">
            <StoryHeader num="01">The test case</StoryHeader>
            <p>The sensor on hand was a Tekscan FlexiForce ELF: a thin strip that measures force through a USB handle. It came with a Windows executable and little else. There was no public API, no SDK, no Linux driver, and no documentation for the bytes traveling over the cable.</p>
            <p>I had never used Ghidra or decoded the protocol of a hardware device. I could set the goal, handle the physical steps, and judge whether the result was useful, but I could not tell the agent how to solve the technical problem. The only hard constraint I set was: no Windows and no Wine—a compatibility layer that lets Windows applications run on Linux. That made the sensor a good test: could a coding agent get through the compatibility mess and build the missing connection itself?</p>
          </section>

          {/* 02 */}
          <section className="mb-12">
            <StoryHeader num="02">What Claude Code built</StoryHeader>
            <p>Claude Code Opus 4.8 opened the Windows program in Ghidra, a tool for inspecting compiled software when the source code is unavailable. It followed the program from the “Set Frame Rate” button down to the bytes sent over USB, recovered the commands, and worked out how the sensor streams its readings.</p>
            <p>From there, it built a Linux driver in about 80 lines of Python and a live browser display with a force readout, a scrolling chart, and two-point calibration. Open <Code>localhost:8777</Code>, press the strip, and the measurement moves in real time.</p>
            <p>Even the physical handoff stayed in the same workflow. Claude Code made a short instructional video showing me how to seat the sensor strip in the handle and connect the handle to the laptop. I followed the video, pressed the sensor, and the agent read the measurement in the terminal.</p>
          </section>

          {/* Middle video */}
          <section className="mb-12">
            <YouTubeEmbed src="https://www.youtube-nocookie.com/embed/lzua8GDIsuI" title="ClaudeSense — Instructional Video (56 s)" eyebrow="Connecting the hardware, step by step" />
          </section>

          {/* 03 */}
          <section className="mb-12">
            <StoryHeader num="03">The scientific pipeline</StoryHeader>
            <p>The force reading is only the first step. Imagine measuring force and deformation on the surface of an object, then using those measurements to estimate how stiff the material is inside. That is an inverse problem: working backward from what you can observe on the surface to infer something hidden underneath.</p>
            <p>A coding agent can already implement standard methods, compare algorithmic choices, and design a different approach when the usual one does not fit. Connecting it directly to the sensor puts those abilities beside the experiment. The same context can cover instrument access, calibration, data checks, algorithm selection or design, inference, validation, the next measurement, and the final explanation.</p>
            <p>The researcher stays with the scientific question and the judgment calls instead of bouncing between a vendor app, an incompatible operating system, exported files, notebooks, and separate interfaces. That workflow could be supervised from a phone. This demonstration was built with Claude Code, but the architecture is not tied to one agent; Codex or another capable coding agent could use the same kind of connector.</p>
          </section>

          {/* 04 */}
          <section className="mb-12">
            <StoryHeader num="04">The live proof</StoryHeader>
            <p>In the live test, a hard finger press reached 196 out of 255 counts. Claude Code followed the curve second by second: first contact, a steady hold, a full release, and a final squeeze. The path was direct: hand → sensor strip → Tekscan electronics → USB → Python → Claude Code.</p>
            <FlowChart />
            <p>My role was to set the direction, perform the physical steps, judge the result, and shape the story. For the videos, I suggested using SAM—the Segment Anything Model—to highlight my finger, ElevenLabs for sound, and FFmpeg to edit everything and synchronize the audio with the applied force. Claude Code handled the unfamiliar technical work that made the measurement possible.</p>
            <p>The Linux code is small, the recovered protocol is documented, and the repository is public. No Tekscan software is required to run it.</p>
          </section>

          {/* 06 */}
          <section className="mb-12">
            <StoryHeader num="06">The full story</StoryHeader>
            <p>Watch the full story in the video below.</p>
          </section>

          {/* End video */}
          <section className="mb-12">
            <YouTubeEmbed src="https://www.youtube-nocookie.com/embed/DuwbCYduKaw" title="ClaudeSense — Master Video (4:33)" />
          </section>

          {/* 07 */}
          <section className="mb-12">
            <StoryHeader num="07">Relevance to my PhD project</StoryHeader>
            <p>My PhD project is the PAT Scan — Palpation-Assisted Tomographic Scanning. It is a broad idea about a novel imaging paradigm: figuring out what is inside an object without cutting it open, by leveraging pushes and pulls on the surface. The territory is wide — software, hardware, software-hardware integration, AI and applied AI, physics and applied mathematics.</p>
            <p>The current PhD work focuses on algorithmic development assuming the data already exists. I call this SciML++ for MBT: Agentic Scientific Machine Learning for Mechanics-Based Tomography. The focus is on how agentic AI can be leveraged for the entire algorithm-development process — implementing standard components, designing novel components, integrating them — where the human supplies taste, steering, and verification.</p>
            <p>The next question once the algorithm is built: how does it interact with the real world? That requires data and instrumentation. And before answering what that instrumentation is, there is always friction between the instrumentation layer and the algorithm layer.</p>
            <p>This tekscan-connector project is a small proof of concept that coding agents like Claude Code can autonomously solve the problem of removing that friction — the friction at the hardware-software interface, the interface between algorithm and instrumentation — and have everything in one place, irrespective of what the instrumentation is.</p>
            <p>What the instrumentation ultimately is remains a further question. Alternatives include compliant mechanism-based sensors, GelSight sensors for force, and a smartphone camera for deformation. There is also a hypothesis that world models could train pattern-matching between smartphone video inputs and surface mechanical data — the boundary observable operator.</p>
            <p>This project is a proof of concept of how the instrumentation-algorithm interface can be seamlessly coupled and the friction resolved, all via a coding agent.</p>
          </section>

          {/* GitHub */}
          <section className="mb-16 text-center">
            <a
              href="https://github.com/VivekKarmarkar/tekscan-connector"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-dark-muted hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </section>

        </div>
      </article>
    </Layout>
  )
}
