import { useState, useEffect, useRef, useCallback } from 'react'
import Layout from '../components/Layout'
import ResolutionNotice from '../components/ResolutionNotice'

const SLIDE_IMAGES = [
  '/images/wonyp/results_slideshow/sample_food_3_annotated.png',
  '/images/wonyp/results_slideshow/sample_food_6_annotated.png',
  '/images/wonyp/results_slideshow/sample_food_7_annotated.png',
  '/images/wonyp/results_slideshow/sample_food_11_annotated.png',
  '/images/wonyp/results_slideshow/sample_food_17_annotated.png',
]

const STEP_DATA = {
  1: { icon: "\u{1F4F7}", name: "Upload Photo", color: "#888",
       desc: "You upload a photo of your meal. That\u2019s it \u2014 one photo, and the pipeline does the rest." },
  2: { icon: "\u{1F9E0}", name: "Analyze Plate", color: "#f97316",
       desc: "What\u2019s on this plate, and how good is it for you? The Brain looks at the whole plate in one pass \u2014 names every dish and rates it on five scales: how healthy, how satiating, how bloating, how tasty, and how addictive." },
  3: { icon: "\u{1F441}\uFE0F", name: "Draw Boxes", color: "#38bdf8",
       desc: "Where is everything? The Eyes scan the entire image and draw tight boxes around every object they find. They don\u2019t know what\u2019s food and what isn\u2019t \u2014 a fork, a bowl, and a pile of rice all get boxes." },
  4: { icon: "\u{1F9E0}", name: "Classify Each Box", color: "#f97316",
       desc: "The Eyes found a dozen things \u2014 but which are actually food? The Brain examines each box alongside the full plate. A box covering most of the image is obviously just the whole photo again, so those are skipped." },
  5: { icon: "\u{1F504}", name: "Remove Duplicates", color: "#4ade80",
       desc: "If two boxes share more than half their area and have the same name, keep the tighter one. Two of the same food item in different locations both survive \u2014 only overlapping duplicates get collapsed." },
  6: { icon: "\u2702\uFE0F", name: "Cut Precise Shapes", color: "#38bdf8",
       desc: "The Scissors trace pixel-level outlines. They analyze the full image once upfront, then produce three candidate outlines per box. The one with the highest confidence score is selected." },
  7: { icon: "\u{1F9E0}", name: "Verify A vs B", color: "#f97316",
       desc: "Did the Scissors cut the right thing? The Brain sees two images \u2014 the cut-out (A) and everything around it (B). It picks which one is actually the food. When the Brain says \u201Cwrong cut,\u201D only that one box gets flipped." },
  8: { icon: "\u{1F4A1}", name: "Brightness Check", color: "#4ade80",
       desc: "At least 100 pixels need to be brighter than a minimum threshold. If the cut-out is too dark, it\u2019s likely not a food item and is quietly dropped." },
  9: { icon: "\u{1F3A8}", name: "Color & Label", color: "#4ade80",
       desc: "Food items correctly identified by the Brain, seen by the Eyes, and cut by the Scissors are shown with colorful masks and labels." },
}

function ResultsSlideshow() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const goTo = useCallback((idx) => {
    setCurrent((idx + SLIDE_IMAGES.length) % SLIDE_IMAGES.length)
  }, [])

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => goTo(current + 1), 6000)
  }, [current, goTo])

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [resetTimer])

  const navigate = (dir) => {
    goTo(current + dir)
  }

  return (
    <div className="relative max-w-[800px] mx-auto mb-14 select-none">
      <img
        src={SLIDE_IMAGES[current]}
        alt={`Sample food analysis ${current + 1}`}
        className="w-full block rounded-lg"
      />
      <button
        onClick={() => navigate(-1)}
        className="absolute top-1/2 left-3 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-2xl z-10 transition-colors"
        style={{ background: 'rgba(15,16,25,0.7)', border: '1px solid #2e3140', color: '#a0a0a0' }}
        aria-label="Previous image"
      >
        &#x2039;
      </button>
      <button
        onClick={() => navigate(1)}
        className="absolute top-1/2 right-3 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-2xl z-10 transition-colors"
        style={{ background: 'rgba(15,16,25,0.7)', border: '1px solid #2e3140', color: '#a0a0a0' }}
        aria-label="Next image"
      >
        &#x203A;
      </button>
    </div>
  )
}

function ArchitectureDiagram() {
  const [selectedStep, setSelectedStep] = useState(null)
  const step = selectedStep ? STEP_DATA[selectedStep] : null

  return (
    <div className="max-w-[1100px] mx-auto mb-14">
      {/* Legend */}
      <div className="flex justify-center gap-12 pb-3 flex-wrap">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{"\u{1F9E0}"}</span>
            <span className="font-bold text-lg" style={{ color: '#f97316' }}>Brain</span>
          </div>
          <span className="font-bold text-lg text-[#e0e0e0]">GPT-4o</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{"\u{1F441}\uFE0F"}</span>
            <span className="font-bold text-lg" style={{ color: '#38bdf8' }}>Eyes</span>
          </div>
          <span className="font-bold text-lg text-[#e0e0e0]">YOLOv8</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{"\u2702\uFE0F"}</span>
            <span className="font-bold text-lg" style={{ color: '#38bdf8' }}>Scissors</span>
          </div>
          <span className="font-bold text-lg text-[#e0e0e0]">SAM</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full" style={{ aspectRatio: '980/480', maxHeight: '480px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 480" preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
          <defs>
            <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="0.5" fill="#1a1c2a"/>
            </pattern>
            <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <marker id="arrowOrange" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#f97316"/>
            </marker>
            <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#38bdf8"/>
            </marker>
            <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#4ade80"/>
            </marker>
          </defs>

          <rect width="980" height="480" fill="url(#dots)"/>

          {/* Row 1 paths */}
          <path id="path-1-2" d="M 130,120 C 155,110 165,72 195,65" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="7,5" markerEnd="url(#arrowOrange)"/>
          <path id="path-1-3" d="M 130,140 C 155,150 165,188 195,195" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowBlue)"/>
          <path id="path-2-4" d="M 345,65 C 375,72 385,110 415,120" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="7,5" markerEnd="url(#arrowOrange)"/>
          <path id="path-3-4" d="M 345,195 C 375,188 385,150 415,140" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowBlue)"/>
          <path id="path-4-5" d="M 565,130 C 590,130 610,130 630,130" fill="none" stroke="#4ade80" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="3,4" markerEnd="url(#arrowGreen)"/>
          <path id="path-5-6" d="M 780,130 C 800,130 815,130 830,130" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowBlue)"/>

          {/* Turn + Row 2 paths */}
          <path id="path-6-7" d="M 910,170 C 910,220 910,280 910,340" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="7,5" markerEnd="url(#arrowOrange)"/>
          <path id="path-7-8" d="M 830,380 C 805,380 790,380 780,380" fill="none" stroke="#4ade80" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="3,4" markerEnd="url(#arrowGreen)"/>
          <path id="path-8-9" d="M 630,380 C 605,380 585,380 565,380" fill="none" stroke="#4ade80" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="3,4" markerEnd="url(#arrowGreen)"/>

          {/* Row 1 nodes */}
          {[
            { step: 1, x: 15, y: 100, w: 115, h: 60, emoji: "\u{1F4F7}", label: "Upload Photo", color: "#888", fill: "#88888812" },
            { step: 2, x: 195, y: 38, w: 150, h: 58, emoji: "\u{1F9E0}", label: "Analyze Plate", color: "#f97316", fill: "#f9731610" },
            { step: 3, x: 195, y: 168, w: 150, h: 58, emoji: "\u{1F441}\uFE0F", label: "Draw Boxes", color: "#38bdf8", fill: "#38bdf810" },
            { step: 4, x: 415, y: 100, w: 150, h: 60, emoji: "\u{1F9E0}", label: "Classify Each Box", color: "#f97316", fill: "#f9731610" },
            { step: 5, x: 630, y: 100, w: 150, h: 60, emoji: "\u{1F504}", label: "Remove Duplicates", color: "#4ade80", fill: "#4ade8010", fontSize: "11.5" },
            { step: 6, x: 830, y: 100, w: 150, h: 60, emoji: "\u2702\uFE0F", label: "Cut Precise Shapes", color: "#38bdf8", fill: "#38bdf810", fontSize: "11.5" },
          ].map(n => (
            <g key={n.step} className="cursor-pointer" onClick={() => setSelectedStep(n.step)}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="12" fill={n.fill} stroke={n.color}
                strokeWidth={selectedStep === n.step ? 3 : 1.5}
                filter={selectedStep === n.step ? 'url(#nodeGlow)' : undefined}
              />
              <text fontSize="9" x={n.x + 10} y={n.y + 12} fill="#555">{n.step}</text>
              <text fontSize="17" x={n.x + n.w / 2} y={n.y + 24} textAnchor="middle" fill={n.color}>{n.emoji}</text>
              <text fontSize={n.fontSize || "12.5"} fontWeight="700" x={n.x + n.w / 2} y={n.y + 46} textAnchor="middle" fill={n.color}>{n.label}</text>
            </g>
          ))}

          <text x="930" y="260" fontSize="20" fill="#333" textAnchor="middle">{"\u21B5"}</text>

          {/* Row 2 nodes */}
          {[
            { step: 7, x: 830, y: 350, w: 150, h: 60, emoji: "\u{1F9E0}", label: "Verify A vs B", color: "#f97316", fill: "#f9731610" },
            { step: 8, x: 630, y: 352, w: 150, h: 56, emoji: "\u{1F4A1}", label: "Brightness Check", color: "#4ade80", fill: "#4ade8010", fontSize: "11.5" },
            { step: 9, x: 415, y: 350, w: 150, h: 60, emoji: "\u{1F3A8}", label: "Color & Label", color: "#4ade80", fill: "#4ade8010" },
          ].map(n => (
            <g key={n.step} className="cursor-pointer" onClick={() => setSelectedStep(n.step)}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="12" fill={n.fill} stroke={n.color}
                strokeWidth={selectedStep === n.step ? 3 : 1.5}
                filter={selectedStep === n.step ? 'url(#nodeGlow)' : undefined}
              />
              <text fontSize="9" x={n.x + 10} y={n.y + 12} fill="#555">{n.step}</text>
              <text fontSize="17" x={n.x + n.w / 2} y={n.y + 24} textAnchor="middle" fill={n.color}>{n.emoji}</text>
              <text fontSize={n.fontSize || "12.5"} fontWeight="700" x={n.x + n.w / 2} y={n.y + 46} textAnchor="middle" fill={n.color}>{n.label}</text>
            </g>
          ))}
          <text x="400" y="385" fontSize="14" fill="#4ade80" textAnchor="end" opacity="0.6">{"\u2714"} done</text>

          {/* Animated particles */}
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0s"><mpath href="#path-1-2"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.25s"><mpath href="#path-1-2"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0s"><mpath href="#path-1-3"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.25s"><mpath href="#path-1-3"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.3s"><mpath href="#path-2-4"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.55s"><mpath href="#path-2-4"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.3s"><mpath href="#path-3-4"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.55s"><mpath href="#path-3-4"/></animateMotion></circle>
          <circle r="3" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.5s"><mpath href="#path-4-5"/></animateMotion></circle>
          <circle r="3" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.5s"><mpath href="#path-4-5"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.6s"><mpath href="#path-5-6"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.6s"><mpath href="#path-5-6"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="3s" repeatCount="indefinite" begin="0.7s"><mpath href="#path-6-7"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="3s" repeatCount="indefinite" begin="2.2s"><mpath href="#path-6-7"/></animateMotion></circle>
          <circle r="3" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.8s"><mpath href="#path-7-8"/></animateMotion></circle>
          <circle r="3" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.8s"><mpath href="#path-7-8"/></animateMotion></circle>
          <circle r="3" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.9s"><mpath href="#path-8-9"/></animateMotion></circle>
          <circle r="3" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.9s"><mpath href="#path-8-9"/></animateMotion></circle>
        </svg>
      </div>

      {/* Detail bar */}
      <div className="flex items-center gap-4 px-6 py-3.5 min-h-16" style={{ background: '#161822', borderTop: '1px solid #2e3140', borderRadius: '0 0 12px 12px' }}>
        <span className="text-[26px] flex-shrink-0">{step ? step.icon : ''}</span>
        <span className="font-bold text-[15px] min-w-[140px] flex-shrink-0" style={{ color: step ? step.color : '#f97316' }}>
          {step ? step.name : 'Click any step to see how it works'}
        </span>
        <span className="text-[13px] leading-relaxed" style={{ color: '#bbb' }}>
          {step ? step.desc : ''}
        </span>
      </div>
    </div>
  )
}

export default function Wonyp() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

          {/* Resolution guidance: portrait → landscape, laptop split → fullscreen */}
          <ResolutionNotice />

          {/* Train Badge */}
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
            <h1>What's on your Plate?</h1>
            <p className="text-dark-muted text-lg mt-2">GPT-4o + YOLOv8 + SAM &mdash; LLM-driven food analysis</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>LLMs</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316b0', border: '1px solid #f9731630' }}>Applied AI</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f9731680', border: '1px solid #f9731620' }}>Computer Vision</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8', border: '1px solid #38bdf840' }}>Food Tech</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8a0', border: '1px solid #38bdf825' }}>Health</span>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80', border: '1px solid #4ade8040' }}>AI Startups</span>
              </div>
            </div>
          </section>

          {/* Video */}
          <section className="mb-16">
            <div className="relative w-full rounded-xl overflow-hidden border border-neutral-800" style={{ paddingBottom: 'min(56.25%, 540px)', boxShadow: '0 4px 32px rgba(0,0,0,0.5)' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full border-none"
                src="https://www.youtube.com/embed/y4ACvU-SSX0"
                title="What's on your Plate? — Project Video"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>

          {/* Introduction */}
          <section className="mb-12">
            <h2>Introduction</h2>
            <p>
              Upload a photo of your meal. Three AI models &mdash; the Brain, the Eyes, and the Scissors &mdash; work together to find every item on your plate, cut each one out at the pixel level, and score the meal on five dimensions: health, satiety, bloat, tastiness, and addiction potential.
            </p>
            <p>
              The Brain is GPT-4o. It understands what food looks like, what it's called, and how nutritious it is. The Eyes are YOLOv8. They scan the image and find where things are. The Scissors are SAM (Segment Anything Model). They trace precise outlines around whatever you point them at. None of these models can do the full job alone &mdash; the Eyes can find objects but can't name them, the Brain can name food but can't locate it spatially, and the Scissors can cut anything but don't know what's worth cutting. The pipeline coordinates all three so that each one compensates for what the others can't do.
            </p>
            <p>
              The system prompt is tuned for Indian cuisine, and the evaluation test suite uses Indian food images &mdash; but the underlying architecture is model-agnostic. Swap the prompt and the test set, and the same pipeline works on any cuisine.
            </p>
          </section>
        </div>

        {/* Architecture - full width for the diagram */}
        <div className="max-w-2xl mx-auto prose-medium">
          <section className="mb-12">
            <h2 className="text-center mb-12">Architecture</h2>
          </section>
        </div>

        <ArchitectureDiagram />

        <div className="max-w-2xl mx-auto prose-medium">
          <section className="mb-12">
            <p>The pipeline processes each image through nine steps.</p>
            <p>
              The Brain analyzes the whole plate first. It looks at the full image in one pass, names every dish, and rates the meal on five scales. This big-picture understanding becomes context for everything that follows.
            </p>
            <p>
              At the same time, the Eyes scan the image and draw tight bounding boxes around every object they find. The Eyes don't know what's food and what isn't &mdash; a fork, a bowl rim, and a pile of rice all get boxes. The sorting happens next.
            </p>
            <p>
              Both streams converge when the Brain classifies each box. It examines the cropped region alongside the full plate photo and the description it wrote earlier. It makes a visual judgment: does this crop isolate a single food item, or is it junk? Boxes covering more than 90% of the image are skipped automatically as a cost guard &mdash; they're obviously just the whole photo again.
            </p>
            <p>
              After classification, duplicate boxes are removed. If two boxes with the same label overlap by more than half their area, the tighter one is kept. Two of the same food item in different locations both survive &mdash; only overlapping duplicates on the same item get collapsed.
            </p>
            <p>
              The Scissors then take over. They analyze the full image once upfront, then for each surviving box, they produce three candidate outlines. The one with the highest confidence score is selected. The Scissors don't know what they're cutting &mdash; they're trained to segment any object you point them at.
            </p>
            <p>
              But the Scissors sometimes trace the wrong thing &mdash; the bowl instead of the food inside it. So the Brain gets a second opinion. It sees two images: the cut-out region (A) and everything around it (B), both on black backgrounds. It picks which one actually shows the food. When the Brain says "wrong cut," the Scissors don't redo the entire image &mdash; they only flip their work inside that one box.
            </p>
            <p>
              The selected region then passes a brightness check. At least 100 pixels need to be brighter than a minimum threshold. If the cut-out is too dark, it's likely empty or not a food item, and it's quietly dropped.
            </p>
            <p>
              Finally, surviving items are overlaid on the original image with translucent color masks, bounding boxes, and labels. The annotated image, the five-score radar chart, and the item list are returned to the frontend.
            </p>
          </section>

          {/* Design Philosophy */}
          <section className="mb-12">
            <h2>Design Philosophy</h2>
            <p>
              The pipeline makes three separate GPT-4o calls per food item. That's not redundancy &mdash; it's a deliberate design choice built around what we call the "Anchoring Principle."
            </p>
            <p>
              The first call analyzes the full plate and names every dish. This establishes the vocabulary &mdash; it tells the pipeline that this plate contains rice, sambar, papad. From that point on, every downstream call is a verification question ("is this rice?") rather than an open-ended classification ("what is this?"). That distinction matters because context shrinks at every stage: the full image becomes a bounding box crop, then a segmentation mask. Asking "what is this?" with diminishing context loses robustness. Anchoring each question to a known label keeps it stable.
            </p>
            <p>
              This is why removing any single GPT call degrades the system. Without the first call, there are no labels to anchor to. Without the second, YOLO's boxes go unverified. Without the third, SAM's masks go unchecked. Three calls, three structurally different roles &mdash; and the architecture that ties them together is what makes this an LLM-driven workflow rather than a wrapper around any one model.
            </p>
          </section>

          {/* Results */}
          <section className="mb-12">
            <h2 className="text-center mb-12">Results</h2>
          </section>
        </div>

        <ResultsSlideshow />

        <div className="max-w-2xl mx-auto prose-medium">
          <section className="mb-12">
            <p>
              The pipeline was evaluated against a 17-image test suite of Indian meals, ranging from simple single-item plates to complex multi-dish meals with five or more items.
            </p>
            <p>
              90% identification accuracy &mdash; 28 out of 31 detections were correct across all images that produced output. Of the 14 images where the Eyes detected objects, 11 had zero wrong identifications. The remaining 3 images each had exactly one misidentified item.
            </p>
            <p>
              The segmentation quality was consistent. The Scissors' box-prompted outlines closely followed food boundaries, and the Brain's A/B verification step caught cases where the Scissors initially traced a container edge instead of the food surface.
            </p>
            <p>
              Three images &mdash; Modak, Salmon, and Rasmalai &mdash; produced no output at all. The Eyes found zero bounding boxes for these items. These represent the detection model's limits on certain food presentations and are excluded from the accuracy calculation.
            </p>
          </section>

          {/* Findings */}
          <section className="mb-12">
            <h2>Findings</h2>

            <div className="text-center mb-12">
              <img
                src="/images/wonyp/key_result.png"
                alt="Pie chart showing error breakdown: correct identifications vs Sambar bias vs no output"
                className="max-w-[500px] w-full rounded-lg mx-auto"
              />
              <p className="mt-3.5 text-sm text-dark-muted">
                Error breakdown across the 17-image test suite &mdash; correct identifications, Sambar-bias misclassifications, and no-output cases.
              </p>
            </div>

            <p>
              All three misidentifications followed the same pattern. The Brain defaulted to "Sambar" when it encountered an unfamiliar curry bowl.
            </p>
            <p>
              This is not a random failure mode. It reveals a systematic bias &mdash; when the Brain lacks confidence in a visual classification, it falls back to the most common South Indian curry in its training data. The errors were not spread across different food categories or different failure mechanisms. They clustered on a single label, applied to a single visual archetype: a round bowl of brown liquid.
            </p>
            <p>
              This finding points to a clear next step. A fine-tuned classifier trained on a curated dataset of Indian food categories could replace the Brain's zero-shot classification, eliminating the Sambar bias while preserving the Brain's role in verification and full-plate analysis where its generalist knowledge is an advantage.
            </p>
          </section>

          {/* GitHub */}
          <section className="mb-16 text-center">
            <a
              href="https://github.com/VivekKarmarkar/GPT-bhojan-attempt-new-v0-b"
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
