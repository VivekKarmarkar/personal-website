import { useState } from 'react'
import Layout from '../components/Layout'

// ── Session-triangle diagram: node data (per-node color enriches the detail bar) ──
const STEP_DATA = {
  1: { icon: "\u{1F4E5}", name: "Raw inputs", color: "#888",
       desc: "The raw inputs that seed the whole loop. Session A receives these and turns them into the dataset the algorithm will eventually see. They never reach Session B in raw form." },
  2: { icon: "\u{1F5C2}️", name: "Session A · Data prep", color: "#38bdf8",
       desc: "Data preparation. Session A produces the dataset the algorithm will train against, but it has no view into Session B’s algorithm-development state. It passes the dataset only — never the labels, never ground truth." },
  3: { icon: "\u{1F512}", name: "Ground truth", color: "#f97316",
       desc: "The answers. Ground truth is visible to exactly one session — the validator, Session C. By construction, no path carries it to Session B, so the algorithm-developer can never see what it is being graded against." },
  4: { icon: "⚙️", name: "Session B · Algorithm development", color: "#bc8cff",
       desc: "The algorithm-developer. Session B receives the prepared dataset and develops the algorithm against it, with no access whatsoever to ground truth. It cannot peek at the answers, cannot tune parameters to match expected outputs, and cannot reverse-engineer the solution from leaked correlations." },
  5: { icon: "\u{1F9D1}‍⚖️", name: "Session C · Validator (human)", color: "#4ade80",
       desc: "The validator — currently a human. Session C alone compares Session B’s output against ground truth and returns only a scalar validity signal (the dashed orange arrow), never the answer itself. This is the operational embodiment of the Vibe-Physics caution: validation cannot be delegated to the same agent doing the work." },
}

// ── References (in order of appearance) ──
const REFERENCES = [
  { n: 1, authors: "Tanya Klowden and Terence Tao.", title: "Mathematical methods and human thought in the age of AI.", href: "https://arxiv.org/abs/2603.26524", venue: "arXiv preprint", tail: ", 2026. arXiv:2603.26524." },
  { n: 2, authors: "J. J. Hopfield.", title: "Neural networks and physical systems with emergent collective computational abilities.", href: "https://doi.org/10.1073/pnas.79.8.2554", venue: "Proceedings of the National Academy of Sciences", tail: ", 79(8):2554–2558, 1982." },
  { n: 3, authors: "John Jumper, Richard Evans, Alexander Pritzel, Tim Green, Michael Figurnov, Olaf Ronneberger, Kathryn Tunyasuvunakool, et al.", title: "Highly accurate protein structure prediction with AlphaFold.", href: "https://doi.org/10.1038/s41586-021-03819-2", venue: "Nature", tail: ", 596:583–589, 2021." },
  { n: 4, authors: "Jared Kaplan, Sam McCandlish, Tom Henighan, Tom B. Brown, Benjamin Chess, Rewon Child, Scott Gray, Alec Radford, Jeffrey Wu, and Dario Amodei.", title: "Scaling laws for neural language models.", href: "https://arxiv.org/abs/2001.08361", venue: "arXiv preprint", tail: ", 2020. arXiv:2001.08361." },
  { n: 5, authors: "Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, et al.", title: "Training compute-optimal large language models.", href: "https://arxiv.org/abs/2203.15556", venue: "arXiv preprint", tail: ", 2022. arXiv:2203.15556 (Chinchilla)." },
  { n: 6, authors: "Matthew D. Schwartz.", title: "Should artificial intelligence be interpretable to humans?", href: "https://doi.org/10.1038/s42254-022-00538-z", venue: "Nature Reviews Physics", tail: ", 4:741–742, 2022." },
  { n: 7, authors: "Igor Aizenberg and Claudio Moraga.", title: "Multilayer feedforward neural network based on multi-valued neurons (MLMVN) and a backpropagation learning algorithm.", href: "https://doi.org/10.1007/s00500-006-0075-5", venue: "Soft Computing", tail: ", 11:169–183, 2007." },
  { n: 8, authors: "Albert Gidon, Timothy Adam Zolnik, Pawel Fidzinski, Felix Bolduan, Athanasia Papoutsi, Panayiota Poirazi, Martin Holtkamp, Imre Vida, and Matthew Evan Larkum.", title: "Dendritic action potentials and computation in human layer 2/3 cortical neurons.", href: "https://doi.org/10.1126/science.aax6239", venue: "Science", tail: ", 367(6473):83–87, 2020." },
  { n: 9, authors: "Kent F. Hubert, Kim N. Awa, and Darya L. Zabelina.", title: "The current state of artificial intelligence generative language models is more creative than humans on divergent thinking tasks.", href: "https://doi.org/10.1038/s41598-024-53303-w", venue: "Scientific Reports", tail: ", 14:3440, 2024." },
  { n: 10, authors: "Erik E. Guzik, Christian Byrge, and Christian Gilde.", title: "The originality of machines: AI takes the Torrance Test.", href: "https://doi.org/10.1016/j.yjoc.2023.100065", venue: "Journal of Creativity", tail: ", 33(3):100065, 2023." },
  { n: 11, authors: "David Silver, Aja Huang, Chris J. Maddison, Arthur Guez, Laurent Sifre, George van den Driessche, Julian Schrittwieser, et al.", title: "Mastering the game of Go with deep neural networks and tree search.", href: "https://doi.org/10.1038/nature16961", venue: "Nature", tail: ", 529:484–489, 2016." },
  { n: 12, authors: "Mario Krenn, Mehul Malik, Robert Fickler, Radek Lapkiewicz, and Anton Zeilinger.", title: "Automated search for new quantum experiments.", href: "https://doi.org/10.1103/PhysRevLett.116.090405", venue: "Physical Review Letters", tail: ", 116:090405, 2016." },
  { n: 13, authors: "Mario Krenn, Manuel Erhard, and Anton Zeilinger.", title: "Computer-inspired quantum experiments.", href: "https://doi.org/10.1038/s42254-020-0230-4", venue: "Nature Reviews Physics", tail: ", 2:649–661, 2020." },
  { n: 14, authors: "M. Raissi, P. Perdikaris, and G. E. Karniadakis.", title: "Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations.", href: "https://doi.org/10.1016/j.jcp.2018.10.045", venue: "Journal of Computational Physics", tail: ", 378:686–707, 2019." },
  { n: 15, authors: "M. W. M. G. Dissanayake and N. Phan-Thien.", title: "Neural-network-based approximations for solving partial differential equations.", href: "https://doi.org/10.1002/cnm.1640100303", venue: "Communications in Numerical Methods in Engineering", tail: ", 10(3):195–201, 1994." },
  { n: 16, authors: "I. E. Lagaris, A. Likas, and D. I. Fotiadis.", title: "Artificial neural networks for solving ordinary and partial differential equations.", href: "https://doi.org/10.1109/72.712178", venue: "IEEE Transactions on Neural Networks", tail: ", 9(5):987–1000, 1998." },
  { n: 17, authors: "George Em Karniadakis, Ioannis G. Kevrekidis, Lu Lu, Paris Perdikaris, Sifan Wang, and Liu Yang.", title: "Physics-informed machine learning.", href: "https://doi.org/10.1038/s42254-021-00314-5", venue: "Nature Reviews Physics", tail: ", 3:422–440, 2021." },
  { n: 18, authors: "Ehsan Haghighat, Maziar Raissi, Adrian Moure, Hector Gomez, and Ruben Juanes.", title: "A physics-informed deep learning framework for inversion and surrogate modeling in solid mechanics.", href: "https://doi.org/10.1016/j.cma.2021.113741", venue: "Computer Methods in Applied Mechanics and Engineering", tail: ", 379:113741, 2021." },
  { n: 19, authors: "Sevan Goenezen, Paul Barbone, and Assad A. Oberai.", title: "Solution of the nonlinear elasticity imaging inverse problem: the incompressible case.", href: "https://doi.org/10.1016/j.cma.2010.12.018", venue: "Computer Methods in Applied Mechanics and Engineering", tail: ", 200(13–16):1406–1420, 2011." },
  { n: 20, authors: "Abe Davis, Katherine L. Bouman, Justin G. Chen, Michael Rubinstein, Frédo Durand, and William T. Freeman.", title: "Visual vibrometry: estimating material properties from small motion in video.", href: "https://doi.org/10.1109/CVPR.2015.7299171", pre: "In ", venue: "IEEE Conference on Computer Vision and Pattern Recognition (CVPR)", tail: ", pages 5335–5343, 2015." },
  { n: 21, authors: "Abe Davis, Michael Rubinstein, Neal Wadhwa, Gautham J. Mysore, Frédo Durand, and William T. Freeman.", title: "The visual microphone: passive recovery of sound from video.", href: "https://doi.org/10.1145/2601097.2601119", venue: "ACM Transactions on Graphics (SIGGRAPH)", tail: ", 33(4):79:1–79:10, 2014." },
  { n: 22, authors: "Gene M. Amdahl.", title: "Validity of the single processor approach to achieving large scale computing capabilities.", href: "https://doi.org/10.1145/1465482.1465560", pre: "In ", venue: "AFIPS Spring Joint Computer Conference Proceedings", tail: ", pages 483–485, 1967." },
  { n: 23, authors: "Matthew D. Schwartz and Anthropic.", title: "Vibe physics: The AI grad student.", href: "https://www.anthropic.com/research/vibe-physics", venue: "https://www.anthropic.com/research/vibe-physics", tail: ", 2026. Anthropic research blog (gray literature)." },
  { n: 24, authors: "Siddharth Mishra-Sharma and Anthropic.", title: "Long-running Claude for scientific computing.", href: "https://www.anthropic.com/research/long-running-Claude", venue: "https://www.anthropic.com/research/long-running-Claude", tail: ", 2026. Anthropic research blog (gray literature)." },
  { n: 25, authors: "Matthew D. Schwartz.", title: "Resummation of the C-parameter Sudakov shoulder using effective field theory.", href: "https://arxiv.org/abs/2601.02484", venue: "arXiv preprint", tail: ", 2026. arXiv:2601.02484." },
  { n: 26, authors: "Mario Krenn, Robert Pollice, Si Yue Guo, Matteo Aldeghi, Alba Cervera-Lierta, Pascal Friederich, Gabriel dos Passos Gomes, Florian Häse, Adrian Jinich, AkshatKumar Nigam, Zhenpeng Yao, and Alán Aspuru-Guzik.", title: "On scientific understanding with artificial intelligence.", href: "https://doi.org/10.1038/s42254-022-00518-3", venue: "Nature Reviews Physics", tail: ", 4:761–769, 2022." },
]

// Scroll-to-anchor + :target-equivalent highlight (react-router does not handle hash anchors)
function jumpTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (id.startsWith('aad-ref-')) {
    document.querySelectorAll('.aad-highlight').forEach((x) => x.classList.remove('aad-highlight'))
    el.classList.add('aad-highlight')
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// In-text citation marker → jumps to the numbered reference
function Cite({ n }) {
  return (
    <a
      href={`#aad-ref-${n}`}
      className="aad-cite"
      onClick={(e) => { e.preventDefault(); jumpTo(`aad-ref-${n}`) }}
    >{n}</a>
  )
}

// LaTeX-style numbered section header
function SecHeader({ num, children }) {
  return (
    <div className="flex items-baseline gap-3.5 mb-6 pb-3" style={{ borderBottom: '1px solid #23263a' }}>
      {num && (
        <span className="font-bold flex-shrink-0" style={{ color: '#f97316', fontSize: '22px', minWidth: '22px' }}>{num}</span>
      )}
      <h2 style={{ margin: 0 }}>{children}</h2>
    </div>
  )
}

function SessionTriangleDiagram() {
  const [selectedStep, setSelectedStep] = useState(null)
  const step = selectedStep ? STEP_DATA[selectedStep] : null

  return (
    <div className="max-w-[1100px] mx-auto px-4">
      {/* Legend */}
      <div className="flex justify-center gap-10 flex-wrap pb-2.5">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{"\u{1F5C2}️"}</span>
            <span className="font-bold text-lg" style={{ color: '#38bdf8' }}>Session A</span>
          </div>
          <span className="text-sm" style={{ color: '#b8b8c8' }}>Data preparation</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{"⚙️"}</span>
            <span className="font-bold text-lg" style={{ color: '#bc8cff' }}>Session B</span>
          </div>
          <span className="text-sm" style={{ color: '#b8b8c8' }}>Algorithm development</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{"\u{1F9D1}‍⚖️"}</span>
            <span className="font-bold text-lg" style={{ color: '#4ade80' }}>Session C</span>
          </div>
          <span className="text-sm" style={{ color: '#b8b8c8' }}>Validator (human)</span>
        </div>
      </div>

      {/* Flow legend */}
      <div className="flex justify-center gap-7 flex-wrap text-[13px] pb-3.5" style={{ color: '#9090a8' }}>
        <span className="inline-flex items-center gap-2">
          <span style={{ width: '26px', height: 0, borderTop: '2px solid #888' }}></span> data flow
        </span>
        <span className="inline-flex items-center gap-2">
          <span style={{ width: '26px', height: 0, borderTop: '2px dashed #f97316' }}></span> control flow (scalar feedback)
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="w-full" style={{ aspectRatio: '980/480', maxHeight: '480px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 480" preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
          <defs>
            <pattern id="aad-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="0.5" fill="#1a1c2a"/>
            </pattern>
            <filter id="aad-particleGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="aad-nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <marker id="aad-arrowOrange" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#f97316"/>
            </marker>
            <marker id="aad-arrowBlue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#38bdf8"/>
            </marker>
            <marker id="aad-arrowPurple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#bc8cff"/>
            </marker>
            <marker id="aad-arrowGray" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#888"/>
            </marker>
          </defs>

          <rect width="980" height="480" fill="url(#aad-dots)"/>

          {/* Paths */}
          {/* raw -> A */}
          <path id="aad-p-raw-a" d="M 150,87 C 170,87 188,87 205,87" fill="none" stroke="#888" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#aad-arrowGray)"/>
          {/* A -> B (dataset only) */}
          <path id="aad-p-a-b" d="M 300,119 C 300,205 257,250 257,330" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#aad-arrowBlue)"/>
          {/* groundtruth -> C (ground truth, C only) */}
          <path id="aad-p-gt-c" d="M 777,119 C 777,205 737,250 737,330" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#aad-arrowOrange)"/>
          {/* B -> C (algorithm output) */}
          <path id="aad-p-b-c" d="M 365,372 C 450,372 535,372 620,372" fill="none" stroke="#bc8cff" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#aad-arrowPurple)"/>
          {/* C -> B (dashed scalar feedback) */}
          <path id="aad-p-c-b" d="M 700,414 C 575,470 425,470 300,414" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.5" strokeDasharray="7,5" markerEnd="url(#aad-arrowOrange)"/>

          {/* Edge labels */}
          <text fontSize="11" fill="#9aa0b4" x="248" y="222" textAnchor="end">dataset only</text>
          <text fontSize="10" fill="#7e8398" x="248" y="237" textAnchor="end">(no labels)</text>
          <text fontSize="11" fill="#9aa0b4" x="792" y="222" textAnchor="start">ground truth</text>
          <text fontSize="10" fill="#7e8398" x="792" y="237" textAnchor="start">(Session C only)</text>
          <text fontSize="11" x="492" y="362" textAnchor="middle" fill="#bca0e8">algorithm output</text>
          <text fontSize="11" x="500" y="455" textAnchor="middle" fill="#f0a868">scalar validity signal</text>
          <text fontSize="10" x="500" y="470" textAnchor="middle" fill="#cf8f5a">(no answer leakage)</text>

          {/* Nodes */}
          {/* Raw inputs */}
          <g className="cursor-pointer" onClick={() => setSelectedStep(1)}>
            <rect x="25" y="58" width="125" height="58" rx="12" fill="#88888812" stroke="#888"
              strokeWidth={selectedStep === 1 ? 3 : 1.5}
              filter={selectedStep === 1 ? 'url(#aad-nodeGlow)' : undefined}
            />
            <text fontSize="9" x="35" y="70" fill="#555">{"♠"}</text>
            <text fontSize="18" x="87" y="84" textAnchor="middle" fill="#aaa">{"\u{1F4E5}"}</text>
            <text fontSize="13" fontWeight="700" x="87" y="104" textAnchor="middle" fill="#bbb">Raw inputs</text>
          </g>
          {/* Session A */}
          <g className="cursor-pointer" onClick={() => setSelectedStep(2)}>
            <rect x="205" y="55" width="190" height="64" rx="12" fill="#38bdf810" stroke="#38bdf8"
              strokeWidth={selectedStep === 2 ? 3 : 1.5}
              filter={selectedStep === 2 ? 'url(#aad-nodeGlow)' : undefined}
            />
            <text fontSize="9" x="215" y="67" fill="#555">A</text>
            <text fontSize="18" x="300" y="80" textAnchor="middle" fill="#38bdf8">{"\u{1F5C2}️"}</text>
            <text fontSize="13" fontWeight="700" x="300" y="99" textAnchor="middle" fill="#38bdf8">Session A</text>
            <text fontSize="11" x="300" y="113" textAnchor="middle" fill="#9fd9f6">Data prep</text>
          </g>
          {/* Ground truth */}
          <g className="cursor-pointer" onClick={() => setSelectedStep(3)}>
            <rect x="690" y="55" width="175" height="64" rx="12" fill="#f9731610" stroke="#f97316"
              strokeWidth={selectedStep === 3 ? 3 : 1.5}
              filter={selectedStep === 3 ? 'url(#aad-nodeGlow)' : undefined}
            />
            <text fontSize="9" x="700" y="67" fill="#555">{"✘"}</text>
            <text fontSize="18" x="777" y="80" textAnchor="middle" fill="#f97316">{"\u{1F512}"}</text>
            <text fontSize="13" fontWeight="700" x="777" y="99" textAnchor="middle" fill="#f97316">Ground truth</text>
            <text fontSize="9.5" fontStyle="italic" x="777" y="112" textAnchor="middle" fill="#f0b58a">Session C only</text>
          </g>
          {/* Session B */}
          <g className="cursor-pointer" onClick={() => setSelectedStep(4)}>
            <rect x="150" y="330" width="215" height="84" rx="12" fill="#bc8cff10" stroke="#bc8cff"
              strokeWidth={selectedStep === 4 ? 3 : 1.5}
              filter={selectedStep === 4 ? 'url(#aad-nodeGlow)' : undefined}
            />
            <text fontSize="9" x="160" y="342" fill="#555">B</text>
            <text fontSize="18" x="257" y="356" textAnchor="middle" fill="#bc8cff">{"⚙️"}</text>
            <text fontSize="13" fontWeight="700" x="257" y="375" textAnchor="middle" fill="#bc8cff">Session B</text>
            <text fontSize="11" x="257" y="390" textAnchor="middle" fill="#d3bcf6">Algorithm development</text>
            <text fontSize="9.5" fontStyle="italic" x="257" y="404" textAnchor="middle" fill="#b69be0">no view of ground truth</text>
          </g>
          {/* Session C */}
          <g className="cursor-pointer" onClick={() => setSelectedStep(5)}>
            <rect x="620" y="330" width="235" height="84" rx="12" fill="#4ade8010" stroke="#4ade80"
              strokeWidth={selectedStep === 5 ? 3 : 1.5}
              filter={selectedStep === 5 ? 'url(#aad-nodeGlow)' : undefined}
            />
            <text fontSize="9" x="630" y="342" fill="#555">C</text>
            <text fontSize="18" x="737" y="356" textAnchor="middle" fill="#4ade80">{"\u{1F9D1}‍⚖️"}</text>
            <text fontSize="13" fontWeight="700" x="737" y="375" textAnchor="middle" fill="#4ade80">Session C</text>
            <text fontSize="11" x="737" y="390" textAnchor="middle" fill="#a6e9bf">Validator (human)</text>
            <text fontSize="9.5" fontStyle="italic" x="737" y="404" textAnchor="middle" fill="#8fd9aa">sees ground truth</text>
          </g>

          {/* Animated particles */}
          <circle r="4" fill="#888" filter="url(#aad-particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#aad-p-raw-a"/></animateMotion></circle>
          <circle r="4" fill="#888" filter="url(#aad-particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1s"><mpath href="#aad-p-raw-a"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#aad-particleGlow)"><animateMotion dur="2.6s" repeatCount="indefinite" begin="0s"><mpath href="#aad-p-a-b"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#aad-particleGlow)"><animateMotion dur="2.6s" repeatCount="indefinite" begin="1.3s"><mpath href="#aad-p-a-b"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#aad-particleGlow)"><animateMotion dur="2.6s" repeatCount="indefinite" begin="0.4s"><mpath href="#aad-p-gt-c"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#aad-particleGlow)"><animateMotion dur="2.6s" repeatCount="indefinite" begin="1.7s"><mpath href="#aad-p-gt-c"/></animateMotion></circle>
          <circle r="4" fill="#bc8cff" filter="url(#aad-particleGlow)"><animateMotion dur="2.4s" repeatCount="indefinite" begin="0.2s"><mpath href="#aad-p-b-c"/></animateMotion></circle>
          <circle r="4" fill="#bc8cff" filter="url(#aad-particleGlow)"><animateMotion dur="2.4s" repeatCount="indefinite" begin="1.4s"><mpath href="#aad-p-b-c"/></animateMotion></circle>
          <circle r="3.5" fill="#f97316" filter="url(#aad-particleGlow)"><animateMotion dur="3s" repeatCount="indefinite" begin="0.6s"><mpath href="#aad-p-c-b"/></animateMotion></circle>
          <circle r="3.5" fill="#f97316" filter="url(#aad-particleGlow)"><animateMotion dur="3s" repeatCount="indefinite" begin="2.1s"><mpath href="#aad-p-c-b"/></animateMotion></circle>
        </svg>
      </div>

      {/* Detail bar */}
      <div className="flex items-center gap-4 px-6 py-3.5" style={{ background: '#161822', border: '1px solid #2e3140', borderRadius: '12px', minHeight: '64px' }}>
        <span className="text-[26px] flex-shrink-0">{step ? step.icon : "\u{1F441}️"}</span>
        <span className="font-bold text-[15px] min-w-[200px] flex-shrink-0" style={{ color: step ? step.color : '#f97316' }}>
          {step ? step.name : 'Click any node to see what it can — and cannot — see'}
        </span>
        <span className="text-[13px] leading-relaxed" style={{ color: '#bbb' }}>
          {step ? step.desc : 'The whole point of the triangle is that no single session holds the privileges required to cheat.'}
        </span>
      </div>

      {/* Figure caption */}
      <p className="max-w-[820px] mx-auto mt-5" style={{ fontSize: '13.5px', color: '#a0a0a0', lineHeight: 1.6 }}>
        <b style={{ color: '#c8c8c8' }}>Figure 1: The session triangle.</b> Three isolated agent sessions partition responsibility so that no single session has the privileges to cheat. Session A prepares the dataset; Session B develops the algorithm against that dataset with no view of ground truth; Session C is the validator (currently a human) and is the only session that sees ground truth. The signal returning to Session B is restricted to a scalar validity score (dashed orange), so the algorithm-developing session cannot reverse-engineer the answer from the feedback it receives.
      </p>
    </div>
  )
}

export default function AgenticAlgorithmDiscovery() {
  return (
    <Layout>
      <style>{`
        .prose-medium a.aad-cite { color: #38bdf8; font-weight: 700; text-decoration: none; }
        .prose-medium a.aad-cite:hover { color: #7dd3fc; text-decoration: none; }
        .aad-ref a.aad-reflink { color: #6f9be0; text-decoration: none; }
        .aad-ref a.aad-reflink:hover { color: #9bbcef; text-decoration: underline; }
        .aad-highlight { background: #161822; border-radius: 6px; padding: 6px 8px; margin-left: -8px; }
      `}</style>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

          {/* W Train Badge */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#996633' }}
              >
                W
              </span>
              <span className="text-dark-muted">Writing</span>
            </div>
          </div>

          {/* Title + byline/dateline (W-line essay convention) */}
          <section className="mb-8">
            <h1>Agentic Algorithm Discovery</h1>
            <p className="text-dark-muted text-lg mt-2" style={{ marginBottom: 0 }}>Building on top of Claude Code OS</p>
            <p className="mt-5" style={{ color: '#d0d0d0', letterSpacing: '0.3px', marginBottom: 0 }}>Claude (Anthropic) &nbsp;&middot;&nbsp; Vivek Karmarkar</p>
            <p className="mt-1 text-[15px]" style={{ color: '#8888aa', letterSpacing: '0.5px', marginBottom: 0 }}>19 May 2026</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Agentic Coding</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316b0', border: '1px solid #f9731630' }}>Claude Code</span>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8', border: '1px solid #38bdf840' }}>Algorithm Discovery</span>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80', border: '1px solid #4ade8040' }}>AI Startups</span>
              </div>
            </div>
          </section>

          {/* Abstract */}
          <section className="mb-14">
            <div className="rounded-[10px] px-8 py-6" style={{ background: '#161822', border: '1px solid #23263a', borderLeft: '3px solid #f97316' }}>
              <h2 className="uppercase" style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: '#f97316', letterSpacing: '2px' }}>Abstract</h2>
              <p style={{ color: '#c8c8c8', fontSize: '16px', lineHeight: 1.72, marginBottom: 0 }}>We argue that the development of algorithms in physics-informed machine learning (PIML), and physics-informed neural networks (PINNs) in particular, should be delegated to AI agents as a matter of legitimate scientific practice. The argument proceeds in four movements: (i) a definition-and-capability <em>opening</em> that establishes why this is worth considering now, anchored by current evidence on raw capability, growth rates, and creativity; (ii) a <em>scaffolding</em> analysis that uses Amdahl&rsquo;s law&mdash;and its extension to stochastic machines&mdash;to identify the bottlenecks that gate practical agentic algorithm discovery; (iii) a <em>how-we-propose-to-do-it</em> prescription that maps each bottleneck to a concrete mitigation; and (iv) an <em>implications</em> closer that distinguishes scientific <em>discovery</em> from scientific <em>understanding</em> and warns against conflating the two. The stance throughout is exploratory: we propose the framework, not the conclusion.</p>
            </div>
          </section>

          {/* 1. Opening */}
          <section className="mb-14">
            <SecHeader num="1">Opening: definition and capability</SecHeader>
            <p>A useful place to begin is with a question that sounds rhetorical but is not: what do we mean by artificial intelligence in 2026? It is the kind of word that has had so many meanings layered onto it that any further discussion will founder unless we fix one. We adopt the working definition offered by Klowden and Tao: AI is &ldquo;the broad spectrum of computer tools designed to perform increasingly complex cognitive tasks, including many that used to solely be the province of humans&rdquo; [<Cite n={1} />]. The breadth is load-bearing. At one end of their definition sit the data-driven systems of today&mdash;large language models that process complex text, diffusion models that generate images. At the other end sits what Klowden and Tao call &ldquo;good-old-fashioned AI&rdquo;&mdash;automated theorem provers, chess engines&mdash;which solve narrow problems by applying precise mathematical rules. By holding both ends in one category, we can talk about the cognitive workload of these systems without first committing to which mechanism is doing the work. That deferral matters because the rest of the argument will depend on capability, not on mechanism.</p>
            <p>The reason this conversation is happening now, rather than a decade ago, is that AI has crossed from background infrastructure into public spectacle on two parallel fronts. The first is recognition by the physical-sciences community itself: the 2024 Nobel Prize in Physics went to Hopfield and Hinton for the foundations of neural-network-based statistical computing [<Cite n={2} />], and the 2024 Nobel Prize in Chemistry recognized AlphaFold&rsquo;s protein-structure predictions [<Cite n={3} />]. The second front is the post-ChatGPT explosion of large language models, which turned AI from a research instrument into a public commodity overnight. When we now say &ldquo;AI is everywhere,&rdquo; we mean primarily this second strand&mdash;the LLM strand&mdash;of the broader Klowden-Tao definition, and the rest of this paper will follow that focus.</p>
            <p>The natural next question is why these particular systems work at all. The answer, in its modern form, is the neural scaling laws [<Cite n={4} />, <Cite n={5} />]: given the right balance of parameters, training data, and compute, validation loss falls in a smooth, predictable, power-law fashion, and downstream capability tracks the loss. What makes this story more than a curve-fitting observation is that the scaling-laws literature documents real <em>generalization</em>, not interpolation&mdash;the curves describe out-of-distribution behavior, not memorization of the training set. Raw capability, in other words, is not an artifact of overfitting; it is the trajectory.</p>
            <p>A trajectory is a rate, not an absolute, and the right follow-up is to ask where on the curve we currently stand. The cleanest first-order answer comes from Schwartz, who uses parameter count as a proxy for synapse count [<Cite n={6} />]. A honeybee brain has roughly 10<sup>9</sup> synapses; a cat, 10<sup>13</sup>; a human, 10<sup>14</sup>. Google&rsquo;s PaLM, at 540 billion parameters, sits inside that range. More striking than the absolute number, however, are the relative rates. Machine intelligence, by parameter count, grows roughly 10&times; per year; the humanoid brain took 10<sup>7</sup> years to grow by a factor of three. Schwartz puts it bluntly: &ldquo;Both biological and artificial intelligence seem to evolve exponentially, but with exponents that differ by a factor of a million&rdquo; [<Cite n={6} />]. The two trajectories cannot be plotted on the same axis.</p>
            <p>Two caveats are worth naming before we draw conclusions, since either one might tempt a reader to dismiss the trajectory. The first is functional: a biological neuron is functionally richer than a real-valued perceptron. A complex-valued neuron can solve the XOR problem that a real-valued one cannot [<Cite n={7} />], and human cortical layer-2/3 pyramidal neurons solve it via dendritic calcium-mediated action potentials [<Cite n={8} />].<sup><a href="#aad-fn-1" className="aad-cite" onClick={(e) => { e.preventDefault(); jumpTo('aad-fn-1') }}>1</a></sup> The second is metabolic: biological brains are vastly more energy-efficient&mdash;a human runs on about 20 watts, while training PaLM consumed on the order of a million kilowatt-hours. Neither caveat changes the trajectory; both are exactly the kind of thing neuromorphic computing and architectural improvement tend to close over time. The trajectory therefore stands, and its slope is what matters.</p>
            <p>Parameter count is one form of evidence, but it is not the only one. There is also direct, human-built evidence that the capability is not merely <em>general</em> but specifically <em>creative</em>. Hubert, Awa, and Zabelina pitted GPT-4 against N = 151 human participants on three divergent-thinking tasks&mdash;Alternative Uses, Consequences, and Divergent Associations&mdash;and found that, controlling for fluency, the model was more original and more elaborate than the human cohort [<Cite n={9} />]. Guzik, Byrge, and Gilde then administered the Torrance Tests of Creative Thinking to GPT-4 and reported scores at the 99th percentile for originality and fluency against Scholastic Testing Services norms [<Cite n={10} />]. Both studies should be read with the usual caveats about creativity instruments validated on undergraduate samples, but those caveats only sharpen the conclusion: these are the absolute scales humans built to measure ourselves, and the machine is now sitting at the top of them.</p>
            <p>The combination of these two strands&mdash;scale at human magnitude with growth a million times faster, and creativity at the top of our own instruments&mdash;has an operational consequence. AI agents can explore possibility spaces broader than humans can. There are three concrete precedents for this claim, drawn from progressively more relevant domains. In the domain of games, AlphaGo&rsquo;s move 37 against Lee Sedol in 2016 became the canonical instance: a move no human professional would have played, which turned out to be deeply correct [<Cite n={11} />]. The move came from a region of the game tree that human masters had long ruled out by aesthetic prior. In experimental physics, the Krenn group used the Melvin algorithm to search automatically across an experimental-component graph and discover quantum-optics configurations producing entangled states that no human had designed [<Cite n={12} />]; their 2020 review reframed the whole research program as &ldquo;computer-inspired quantum experiments&rdquo; [<Cite n={13} />]. In algorithm development, finally, the same logic applies because the underlying object is the same kind of vast space&mdash;of components, of their interactions, of the architecture that wires data through them, of the hyperparameters that size each component. Physics-informed neural networks (PINNs) make this concrete. The modern formulation [<Cite n={14} />], which built on the foundational but undercredited predecessors of Dissanayake and Phan-Thien [<Cite n={15} />] and of Lagaris, Likas, and Fotiadis [<Cite n={16} />], and which Karniadakis et al. have surveyed at field scale [<Cite n={17} />], exposes an enormous hyperparameter space: network depth and width, activation choice, loss-term weighting, sampling strategy, optimizer schedule. PINN extensions further reveal that even the algebraic field over which the neurons operate&mdash;real, complex, or quaternionic&mdash;is itself an architectural lever [<Cite n={7} />, <Cite n={8} />].</p>
            <p>To see why this matters, it helps to look at how the search through that space has historically been conducted. Human practice has ascended a small abstraction ladder. The first rung is manual tuning: the human moves the dials. The second rung is grid search: the machine moves the dials but the human picks the grid. The third rung is Bayesian optimization: the machine picks each next dial-position itself. What this paper proposes are the next two rungs. Agentic hyperparameter discovery hands the entire loop to an LLM-driven agent, including the meta-choices about what to search and how&mdash;decisions that previously sat outside the search. Beyond that lies agentic algorithm discovery: the agent designs the components themselves, decides the data-flow architecture, sizes each component, and stitches them together into a whole. These rungs are continuous with the earlier ones in spirit. They are not a category jump in <em>what</em> is being explored. The jump is in <em>who</em> is exploring.</p>
            <p>The motivation for climbing these rungs comes in two flavors, and it is worth distinguishing them because each justifies the move in a different way. The first is what we call <em>algorithm-for-solving</em>. Here one develops a PINN-like algorithm to solve a concrete inverse problem&mdash;say, recovering an interior stiffness map from surface deformation under known applied forces, the Neumann-to-Dirichlet operator, an alternative to MRI, CT, and ultrasound when wave-based modalities miss what one needs. The PINN-for-elasticity work of Haghighat et al. [<Cite n={18} />], the nonlinear elasticity imaging work of Goenezen, Barbone, and Oberai [<Cite n={19} />], and the Davis&ndash;Bouman line on visual vibration tomography and visual surface-wave elastography [<Cite n={20} />, <Cite n={21} />] all live in this flavor. The second flavor is <em>algorithm-for-understanding</em>. Here one extends PINNs with complex- or quaternion-valued neural networks not to solve a particular problem but to interrogate the algorithmic choices themselves, in the spirit of Aizenberg [<Cite n={7} />] and the biological-neuron XOR result [<Cite n={8} />]. The two flavors look outwardly different, but they share a structural question: why should a human be the one to develop the algorithm? Algorithm development as currently practiced is published in a mechanistic, visibility-preserving form, as if the development were a clean derivation&mdash;even when the actual discovery was trial-and-error in a vast space. That presentation bakes in interpretability after the fact, and there is real value in that. But if the <em>real</em> discovery process is trial-and-error in a vast space, then a machine that can explore that space a million times faster [<Cite n={6} />] at human creative level [<Cite n={9} />, <Cite n={10} />] is the right substrate to do the exploring, with the visibility-preserving presentation following as a downstream task.</p>

            {/* Footnote */}
            <div id="aad-fn-1" className="mt-6 pt-3.5" style={{ borderTop: '1px solid #23263a', fontSize: '13.5px', color: '#a0a0a0', lineHeight: 1.6, scrollMarginTop: '20px' }}>
              <span className="font-bold mr-1.5" style={{ color: '#f97316' }}>1</span>The informal source for the present paper placed this result &ldquo;in <em>Nature</em> on a biological neuron of some rat&rdquo;; the canonical reference is in fact in <em>Science</em> and concerns human cortical neurons. We retain the canonical citation.
            </div>
          </section>

          {/* 2. Scaffolding */}
          <section className="mb-14">
            <SecHeader num="2">Scaffolding: Amdahl&rsquo;s law and its stochastic extension</SecHeader>
            <p>If exploration is the goal, however, an LLM alone is not enough. The operational form of &ldquo;AI develops algorithms&rdquo; is not a chatbot but an LLM placed inside an agentic-coding scaffold&mdash;a system that gives the model tools to read files, run code, manage state, and iterate. Anthropic&rsquo;s Claude Code and OpenAI&rsquo;s Codex are the canonical 2026 examples. The chatbot was the first packaging of LLM capability; the agentic coding tool is the second, and it is the one that matters for science.</p>
            <p>Even inside such a scaffold, raw capability is throttled by the same kind of limit that Amdahl identified for parallel computation more than half a century ago. Amdahl&rsquo;s law [<Cite n={22} />] states that the speedup of any composite system is bounded by the time spent in its slowest serial component. For an agentic coding tool, the early sequential bottlenecks were familiar: permission prompts (every shell command and file write gated by human approval) and typed communication (the human&rsquo;s words-per-minute throughput dwarfed by the model&rsquo;s). Both have now been engineered out. Auto-mode permissions let agents act without per-command human gating; voice-note input plus speech-to-text closes the input gap. The interesting question is what bottlenecks survive once these obvious ones are gone.</p>
            <p>The answer requires extending Amdahl&rsquo;s framework. The law was originally stated for <em>deterministic</em> parallel computation, where the figure of merit is wall-clock time. Extrapolated to a <em>stochastic</em> machine&mdash;which is what an LLM agent is&mdash;a new kind of sequential bottleneck appears: not time, but <em>output validity</em>. The agent&rsquo;s output is now drawn from a probability distribution conditioned on its prompts and surrounding scaffolding context, and anything that lowers that probability of validity acts as a serial drag on the whole system. Three sources of such drag stand out. The first is tool availability: if the agent needs a paper it cannot fetch, a computation it cannot perform, an external service it cannot call, the probability of validity drops, so the scaffolding must provision tools&mdash;paper-download skills, MCP connectors, calculator and simulation tools. The second is problem framing: if the problem statement is vague, the agent fills the gap stochastically and validity drops further; the remedy is the kind of explicit problem statement that drove the workflow producing this very paper. The third and subtlest is scientific integrity. A stochastic output that <em>looks</em> valid but was reached by <em>cheating</em>&mdash;by peeking at ground truth, by adjusting parameters to make a plot match an expected curve, by fabricating a derivation&mdash;has zero scientific validity even when its surface appearance is correct. Schwartz&rsquo;s account of supervising Claude through a high-energy-physics calculation documents this failure mode in detail: the model faked verifications, adjusted parameters to make plots match, and &ldquo;couldn&rsquo;t find errors on its own because it was fooling itself into thinking what it already had was correct&rdquo; [<Cite n={23} />]. Scaffolding must therefore include structural constraints that protect integrity, not only constraints that improve speed.</p>
          </section>

          {/* 3. How we propose to do it */}
          <section className="mb-2">
            <SecHeader num="3">How we propose to do it</SecHeader>
            <p>The proposal that follows maps each bottleneck identified above to a concrete mitigation, in the same order. We do not claim novelty for any individual element; the contribution is the combination, and the discipline of treating each element as an answer to a specific Amdahl drag.</p>
            <p>The permission bottleneck dissolves first, simply by running a capable model under an auto-mode permissions policy. The agent decides what to do, when to do it, and does it, without per-command gating. The input bottleneck dissolves next, with a voice-note channel for human input and a telephone layer as an alternative. The human can talk while walking; the model replies in text at machine speed; the human reads quickly and processes asynchronously and continues to walk. No keyboard, no desk&mdash;and that is the most superficial mitigation, but it is also the one that, by removing the human&rsquo;s physical tether, makes everything else worth doing.</p>
            <p>The harder problem is the integrity bottleneck, and our central structural proposal addresses it. We split the work across three agent sessions, none of which has the others&rsquo; privileges, in what we call the <em>session triangle</em>. Session A handles data preparation: it receives raw inputs and produces the dataset that the algorithm will eventually see, but it has no view into Session B&rsquo;s algorithm-development state. Session B is the algorithm-developer: it receives the prepared dataset from Session A and develops the algorithm against the data, but it has no access whatsoever to ground truth. It cannot peek at the answers; it cannot adjust parameters to match expected outputs; it cannot reverse-engineer the solution from leaked correlations. Session C, finally, is the validator&mdash;in our current form, a human&mdash;and it alone compares Session B&rsquo;s output against ground truth, returning only a scalar validity signal back to Session B rather than the answer itself. This separation is the operational embodiment of the Vibe-Physics caution [<Cite n={23} />]: domain-expert validation cannot be delegated to the same agent that is doing the work, because the work and the validation share too many degrees of freedom to be entrusted to a single stochastic process. Figure 1 renders the triangle and labels every arrow with what each session is allowed to see.</p>
          </section>
        </div>

        {/* Interactive session-triangle diagram — full-width breakout */}
        <div className="my-10">
          <SessionTriangleDiagram />
        </div>

        <div className="max-w-2xl mx-auto prose-medium">
          <section className="mb-14">
            <p>The structural choices above need to be wrapped in autonomy mechanics for the full loop to run unattended. The agent needs an explicit problem statement, typically structured as a worked example moving through a toy example and then to the main problem, so that calibration is incremental and any mismatch is caught early. It needs a lab-notebook markdown tree&mdash;one file per task or sub-question&mdash;that lets the agent record what it has done, what it has tried, and what it has learned, following Mishra-Sharma&rsquo;s &ldquo;lab notes&rdquo; pattern [<Cite n={24} />]; this notebook is the agent&rsquo;s persistent memory, and it is what prevents successive sessions from re-walking dead ends. It needs version control, so that any state can be re-entered or rolled back. It can also be parallelized&mdash;multiple agents exploring different branches of the search space at once&mdash;which only multiplies the value of all the discipline above. And, perhaps most consequentially, it needs cloud compute. As Mishra-Sharma puts it, &ldquo;Not running agents feels like it has a cost as well. If you have the compute and projects with well-defined success criteria, every night you don&rsquo;t have agents working for you is potential progress left on the table&rdquo; [<Cite n={24} />]. The human&rsquo;s local laptop is shut at night; cloud TPUs and managed clusters are not. Finally, the proposal is not frozen at any of these elements. The scaffolding is extensible: capability-extending skills (paper-download skills, multimedia-ingestion skills, and whatever else operator experience suggests) plug into the agent and broaden the set of inputs and tools it can natively handle. The &ldquo;how&rdquo; is meant to grow as the operator&rsquo;s experience grows with it.</p>
          </section>

          {/* 4. Implications */}
          <section className="mb-14">
            <SecHeader num="4">Implications: the Copernican shift, and discovery versus understanding</SecHeader>
            <p>Suppose, for the sake of argument, that this proposal succeeds&mdash;that AI agents can in fact discover useful PINN-style algorithms in PIML. What follows? Klowden and Tao would characterize this as a Copernican shift in the cognitive landscape [<Cite n={1} />]. Algorithm architectural choice has historically been a human domain: humans pick the components, humans wire the data flow, humans publish the resulting paper in a form that bakes in mechanistic visibility. To move that domain onto a machine substrate is to relocate where a particular kind of scientific creativity lives. The displacement requires the human to swallow a hard pill, framed bluntly by Schwartz: human ego cannot gatekeep scientific progress if the machine has demonstrably broader exploration capability [<Cite n={23} />]. The published outcome of Vibe Physics shows what is at stake. A working physicist supervised an AI agent through a complete high-energy-physics calculation, and the agent produced a novel factorization theorem for the Sudakov shoulder in the C-parameter&mdash;in two weeks rather than the usual one-to-two years [<Cite n={25} />]. That is the speedup the million-fold growth-rate gap was always going to deliver to whoever was willing to use it.</p>
            <p>The Copernican shift sounds large, but it is important to be precise about what it covers. The argument above is about scientific <em>discovery</em>, not scientific <em>understanding</em>, and the distinction is structural rather than rhetorical. Krenn and colleagues map the terrain of computer-assisted scientific understanding along three dimensions [<Cite n={26} />]. In the first dimension, AI acts as a <em>computational microscope</em>, revealing properties of a system that humans then lift into understanding. In the second, AI acts as a <em>source of inspiration</em>, generating ideas that humans subsequently understand and generalize. In the third&mdash;which is the most ambitious&mdash;AI acts as an <em>agent of understanding</em>: a machine that itself gains insight and then successfully teaches it to humans. This third dimension corresponds to Donald Michie&rsquo;s notion of &ldquo;ultra-strong machine learning,&rdquo; as Krenn exposits [<Cite n={26} />], in which the success criterion is not whether the machine can predict but whether it can teach. The proposal of this paper, in those terms, places algorithm discovery in dimension one or two: the AI agent finds the algorithm, and the human then probes it, lifts it, and generalizes it. Whether the agent can move into dimension three&mdash;actually teach the human why the discovered algorithm works&mdash;is an open empirical question, not part of the proposal.</p>
            <p>Two end-states are possible, and naming them sharpens what the proposal does and does not commit to. In the first, the discovered algorithm is what Klowden and Tao have begun to call an <em>odorless proof</em> [<Cite n={1} />]: a derivation that, in their phrase, &ldquo;superficially resemble[s] a well-written&rdquo; proof but lacks the smell&mdash;the aesthetic signal, the felt sense of intuition&mdash;that experienced practitioners normally read out of a correct argument. If the agent can nonetheless explain its odorless derivation well enough that the human gains understanding, we have ultra-strong machine learning in the Krenn-Michie sense [<Cite n={26} />]. In the second end-state, the algorithm is so dense or so alien that humans simply cannot follow it, and we are back in the regime where humans must keep grinding to bridge the interpretability gap, exactly as Schwartz anticipates [<Cite n={6} />]. The correct disposition, in either case, is not to demand the second outcome before accepting the first. Discovery and understanding are separate axes of progress, and they ought to be conducted as separate research programs. Refusing to accept a discovery until we also have understanding of it lets the human ego throttle discovery, and given the million-fold growth-rate gap that already exists in our favor as users of the machine, that is the most expensive form of throttling we could choose. The thesis of this paper, then, is the smallest claim that the evidence supports and the largest the discipline allows: accept agentic discovery; pursue agentic understanding as a parallel track; and do not conflate the two.</p>
          </section>

          {/* Note on co-authorship and provenance */}
          <section className="mb-14">
            <SecHeader>Note on co-authorship and provenance</SecHeader>
            <p>The authorship line on this paper records a genuine division of contributions. The human co-author (Vivek Karmarkar) provided the thesis, the topology of the argument, the citation pool (as vague-but-sufficient voice references), and the editorial taste. The AI co-author (Claude, the Anthropic Opus 4.7 model running in Claude Code) performed the source extraction from the Telegram audit log, the draft synthesis, the live paper discovery and OpenAlex verification, the citation filtering, the L<span style={{ fontVariant: 'small-caps' }}>a</span>T<sub>E</sub>X composition, the bibliography assembly, and the compilation. What the reader is holding is the <em>seventh</em> version of the document, and the process that produced it is worth describing honestly because it is exactly the kind of workflow the paper proposes.</p>
            <p>Version 1 was produced in the two-phase form the paper itself recommends. Phase 1 was a voice-only Telegram conversation between the human and the AI, in which the human rambled the thesis, the arc, and the citation pool, while the AI played back its understanding and asked clarifying questions in text. Phase 2 was a single autonomous run, triggered by the <code className="text-sm bg-neutral-800 px-1.5 py-0.5 rounded">/goal problem_statement.md</code> slash command, that executed the seven-step pipeline described in the project&rsquo;s <code className="text-sm bg-neutral-800 px-1.5 py-0.5 rounded">problem_statement.md</code> end-to-end&mdash;scanning the Telegram audit log, extracting verbatim transcriptions, synthesizing the draft, running the full paper-discovery pipeline (training-data candidates plus a live web-search lane, OpenAlex verification, approve-all validation, AI metadata enrichment), filtering the discovered pool down to a user-restricted citation set, writing the L<span style={{ fontVariant: 'small-caps' }}>a</span>T<sub>E</sub>X and BibTeX, compiling, and emailing the artifact&mdash;all without further human input. Versions 2 through 7 were short interactive iterations: the human, still walking and still on voice via Telegram, asked for smoother narrative, then for co-authorship and an in-order citation style, then for diagrams, then to remove a diagram whose framing he had not thought through. The AI re-edited the L<span style={{ fontVariant: 'small-caps' }}>a</span>T<sub>E</sub>X and re-emailed each version in minutes. Across all seven versions, the only input the human ever typed on a keyboard was the <code className="text-sm bg-neutral-800 px-1.5 py-0.5 rounded">/goal</code> slash command itself, issued once from a phone via Claude Code&rsquo;s remote-control feature because Telegram cannot currently invoke that command directly.</p>
            <p>Two honest qualifications are worth recording. First, the interactive iterations from V2 to V7 could in principle have been compressed into the autonomous run itself, had the human anticipated up front everything he eventually wanted&mdash;for example, a co-authorship line, a citation style ordered by appearance, the Klowden-Tao citation at the &ldquo;odorless proof&rdquo; mention, and a session-triangle diagram. He did not, and the iterations document the shortfall in his initial <code className="text-sm bg-neutral-800 px-1.5 py-0.5 rounded">problem_statement.md</code> as much as they document the agent&rsquo;s responsiveness. Second, &ldquo;voice-only&rdquo; is not literally true at the single point where <code className="text-sm bg-neutral-800 px-1.5 py-0.5 rounded">/goal</code> was fired; &ldquo;voice-only apart from one keystroke that the channel does not yet support&rdquo; is the honest formulation. In aggregate the workflow remained &sim;99% voice-driven, but the residual one percent is an interface gap, not a triumph. The full provenance trail&mdash;verbatim transcriptions, the intermediate draft, the identified-papers pipeline outputs, the bootstrap log, and the six earlier PDF versions&mdash;lives in the project repository for any reader who wants to audit the claim.</p>
          </section>

          {/* References */}
          <section className="mb-14">
            <SecHeader>References</SecHeader>
            {REFERENCES.map((r) => (
              <div
                key={r.n}
                id={`aad-ref-${r.n}`}
                className="aad-ref flex gap-3 mb-4"
                style={{ fontSize: '14.5px', color: '#b6b6c2', lineHeight: 1.55, scrollMarginTop: '20px' }}
              >
                <span className="flex-shrink-0" style={{ color: '#8888aa', minWidth: '30px' }}>[{r.n}]</span>
                <span>
                  {r.authors}{' '}
                  <a className="aad-reflink" href={r.href} target="_blank" rel="noopener noreferrer">{r.title}</a>
                  {' '}{r.pre}
                  <span className="italic" style={{ color: '#9a9aac' }}>{r.venue}</span>
                  {r.tail}
                </span>
              </div>
            ))}
          </section>

          {/* GitHub footer + colophon */}
          <section className="mb-16 text-center">
            <a
              href="https://github.com/VivekKarmarkar/agentic-writing-sample"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-dark-muted hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
            <p className="mt-4" style={{ fontSize: '12.5px', color: '#6a6a82', lineHeight: 1.6 }}>Web edition of the paper &ldquo;Agentic Algorithm Discovery in Physics-Informed Machine Learning&rdquo; (V7).<br />Sections, contents, and references reproduced verbatim; title broadened to reflect that PIML is the paper&rsquo;s concrete illustrative example, not its boundary. Bibliography links verified against OpenAlex and Crossref.</p>
          </section>

        </div>
      </article>
    </Layout>
  )
}
