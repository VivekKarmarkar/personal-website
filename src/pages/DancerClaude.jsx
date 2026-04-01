import { useState } from 'react'
import Layout from '../components/Layout'

const STEP_DATA = {
  1:  { icon: "\u{1F3B5}", name: "Upload Song", color: "#f97316",
       desc: "You upload any audio file \u2014 MP3, WAV, OGG. That\u2019s the only input. In Freestyle and Fusion modes, the dancer improvises to whatever you give it." },
  2:  { icon: "\u{1F442}", name: "Hear the Music", color: "#f97316",
       desc: "The Audio Engine runs an FFT every frame, splitting the spectrum into bass, mid, and treble bands. It computes an energy score (bass-weighted) and detects beats using a threshold with cooldown. This drives everything downstream." },
  3:  { icon: "\u{1F3B2}", name: "Pick a Move", color: "#38bdf8",
       desc: "The Move Sequencer bins the current energy into low, mid, or high and picks a random move from that bucket. In Fusion mode, it first flips a biased coin \u2014 the slider controls the probability of picking from the learnt bucket vs. freestyle. Two layers run independently: a primary layer for full-body moves and an arms overlay." },
  4:  { icon: "\u{1F483}", name: "Dance", color: "#38bdf8",
       desc: "The 13-joint Skeleton renders the chosen pose. Moves are keyframe deltas applied on top of a standing default pose. Spring easing gives natural momentum, groove bounce adds a persistent beat-synced dip, and per-instance variation (random scale, offset, mirror) keeps it from looking robotic." },
  5:  { icon: "\u{1F3AC}", name: "Render", color: "#888",
       desc: "Three visual themes \u2014 Minimal (black on white), Stylized (cyan spotlight on dark stage), Wild (particles, trails, color shift) \u2014 all beat-reactive. Video export captures the canvas + audio to WebM." },
  6:  { icon: "\u{1F4F9}", name: "YouTube Video", color: "#4ade80",
       desc: "yt-dlp downloads the video. Solo dancer, clean background, good lighting works best. YouTube Shorts are preferred \u2014 short duration means fast extraction." },
  7:  { icon: "\u{1F441}\uFE0F", name: "Watch Dancer", color: "#4ade80",
       desc: "MediaPipe extracts 33 body landmarks per frame. These are mapped to our 13-joint skeleton and sampled at 15fps. Missing joints are forward-filled. The result is normalized to an 800\u00D7500 canvas with a target skeleton height of 380px." },
  8:  { icon: "\u{1F9D1}\u200D\u{1F4BB}", name: "Extract Poses", color: "#4ade80",
       desc: "The full choreography is saved as a JSON file \u2014 timestamped joint positions at 15fps. Paired with the extracted MP3 audio. This is what PosePlayer loads for Learnt mode playback." },
  9:  { icon: "\u{1F9E9}", name: "Find Patterns", color: "#bc8cff",
       desc: "Dictionary learning (sklearn) decomposes the choreography into overlapping windows and finds recurring atoms \u2014 the mathematical building blocks. These are basis functions for the dance\u2019s function space. But a compact basis function isn\u2019t necessarily a dance move." },
  10: { icon: "\u{1F9D1}", name: "Human Picks", color: "#bc8cff",
       desc: "Each atom is rendered as an animated GIF and shown in a GTK dialog with checkboxes. The human watches them, picks the ones that look like real dance moves, names them, and submits. This is the quality gate \u2014 human-in-the-loop dictionary learning." },
  11: { icon: "\u{1F517}", name: "Fuse to Skeleton", color: "#bc8cff",
       desc: "Selected atoms are fused onto the freestyle skeleton using angle decomposition. Extract relative joint angles from the source pose, reconstruct with the freestyle bone lengths. The angles are the invariant \u2014 they don\u2019t change between dancers of different sizes. Moves are saved with audio metadata (energy, type) and fed into the Sequencer\u2019s learnt vocabulary." },
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
            <span className="text-[22px]">{"\u{1F442}"}</span>
            <span className="font-bold text-lg" style={{ color: '#f97316' }}>Ears</span>
          </div>
          <span className="font-bold text-lg text-[#e0e0e0]">Audio Engine</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{"\u{1F483}"}</span>
            <span className="font-bold text-lg" style={{ color: '#38bdf8' }}>Body</span>
          </div>
          <span className="font-bold text-lg text-[#e0e0e0]">Skeleton + Sequencer</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{"\u{1F441}\uFE0F"}</span>
            <span className="font-bold text-lg" style={{ color: '#4ade80' }}>Eyes</span>
          </div>
          <span className="font-bold text-lg text-[#e0e0e0]">MediaPipe CV</span>
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
            <marker id="arrowPurple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#bc8cff"/>
            </marker>
          </defs>

          <rect width="980" height="480" fill="url(#dots)"/>

          {/* Row 1 label */}
          <text x="490" y="20" fontSize="11" fill="#555" textAnchor="middle" fontWeight="700" letterSpacing="2">RUNTIME</text>

          {/* Row 1 paths */}
          <path id="p-1-2" d="M 145,80 C 185,80 205,80 240,80" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="7,5" markerEnd="url(#arrowOrange)"/>
          <path id="p-2-3" d="M 395,80 C 435,80 455,80 490,80" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowBlue)"/>
          <path id="p-3-4" d="M 645,80 C 685,80 705,80 740,80" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowBlue)"/>
          <path id="p-4-5" d="M 895,80 C 910,80 920,100 920,130" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowBlue)"/>

          {/* Row 1 nodes */}
          {[
            { step: 1, x: 15, y: 50, w: 130, h: 60, emoji: "\u{1F3B5}", label: "Upload Song", color: "#f97316", fill: "#f9731610" },
            { step: 2, x: 240, y: 50, w: 155, h: 60, emoji: "\u{1F442}", label: "Hear the Music", color: "#f97316", fill: "#f9731610" },
            { step: 3, x: 490, y: 50, w: 155, h: 60, emoji: "\u{1F3B2}", label: "Pick a Move", color: "#38bdf8", fill: "#38bdf810" },
            { step: 4, x: 740, y: 50, w: 155, h: 60, emoji: "\u{1F483}", label: "Dance", color: "#38bdf8", fill: "#38bdf810" },
          ].map(n => (
            <g key={n.step} className="cursor-pointer" onClick={() => setSelectedStep(n.step)}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="12" fill={n.fill} stroke={n.color}
                strokeWidth={selectedStep === n.step ? 3 : 1.5}
                filter={selectedStep === n.step ? 'url(#nodeGlow)' : undefined}
              />
              <text fontSize="9" x={n.x + 10} y={n.y + 12} fill="#555">{n.step}</text>
              <text fontSize="17" x={n.x + n.w / 2} y={n.y + 24} textAnchor="middle" fill={n.color}>{n.emoji}</text>
              <text fontSize="12.5" fontWeight="700" x={n.x + n.w / 2} y={n.y + 46} textAnchor="middle" fill={n.color}>{n.label}</text>
            </g>
          ))}

          {/* Render node (end of row 1) */}
          <g className="cursor-pointer" onClick={() => setSelectedStep(5)}>
            <rect x="860" y="130" width="105" height="55" rx="12" fill="#88888812" stroke="#888"
              strokeWidth={selectedStep === 5 ? 3 : 1.5}
              filter={selectedStep === 5 ? 'url(#nodeGlow)' : undefined}
            />
            <text fontSize="9" x="870" y="142" fill="#555">5</text>
            <text fontSize="17" x="912" y="152" textAnchor="middle" fill="#aaa">{"\u{1F3AC}"}</text>
            <text fontSize="12.5" fontWeight="700" x="912" y="172" textAnchor="middle" fill="#aaa">Render</text>
          </g>

          {/* Divider */}
          <line x1="40" y1="210" x2="940" y2="210" stroke="#23263a" strokeWidth="1"/>
          <text x="160" y="235" fontSize="11" fill="#555" textAnchor="middle" fontWeight="700" letterSpacing="2">LEARNING PIPELINE</text>

          {/* Row 2 paths */}
          <path id="p-6-7" d="M 145,300 C 185,300 205,300 240,300" fill="none" stroke="#4ade80" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowGreen)"/>
          <path id="p-7-8" d="M 395,300 C 435,300 455,300 490,300" fill="none" stroke="#4ade80" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowGreen)"/>
          <path id="p-8-9" d="M 645,300 C 685,300 705,300 740,300" fill="none" stroke="#bc8cff" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="7,5" markerEnd="url(#arrowPurple)"/>

          {/* Turn + Row 3 paths */}
          <path id="p-9-10" d="M 817,340 C 817,365 817,385 817,400" fill="none" stroke="#bc8cff" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="7,5" markerEnd="url(#arrowPurple)"/>
          <text x="860" y="380" fontSize="20" fill="#333" textAnchor="middle">{"\u21B5"}</text>
          <path id="p-10-11" d="M 740,430 C 700,430 680,430 645,430" fill="none" stroke="#bc8cff" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="7,5" markerEnd="url(#arrowPurple)"/>
          <path id="p-11-3" d="M 490,430 C 460,430 440,400 440,350 C 440,250 480,180 530,120" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.25" strokeDasharray="4,4" markerEnd="url(#arrowBlue)"/>

          {/* Row 2 nodes */}
          {[
            { step: 6, x: 15, y: 270, w: 130, h: 60, emoji: "\u{1F4F9}", label: "YouTube Video", color: "#4ade80", fill: "#4ade8010" },
            { step: 7, x: 240, y: 270, w: 155, h: 60, emoji: "\u{1F441}\uFE0F", label: "Watch Dancer", color: "#4ade80", fill: "#4ade8010" },
            { step: 8, x: 490, y: 270, w: 155, h: 60, emoji: "\u{1F9D1}\u200D\u{1F4BB}", label: "Extract Poses", color: "#4ade80", fill: "#4ade8010" },
            { step: 9, x: 740, y: 270, w: 155, h: 60, emoji: "\u{1F9E9}", label: "Find Patterns", color: "#bc8cff", fill: "#bc8cff10" },
          ].map(n => (
            <g key={n.step} className="cursor-pointer" onClick={() => setSelectedStep(n.step)}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="12" fill={n.fill} stroke={n.color}
                strokeWidth={selectedStep === n.step ? 3 : 1.5}
                filter={selectedStep === n.step ? 'url(#nodeGlow)' : undefined}
              />
              <text fontSize="9" x={n.x + 10} y={n.y + 12} fill="#555">{n.step}</text>
              <text fontSize="17" x={n.x + n.w / 2} y={n.y + 24} textAnchor="middle" fill={n.color}>{n.emoji}</text>
              <text fontSize="12.5" fontWeight="700" x={n.x + n.w / 2} y={n.y + 46} textAnchor="middle" fill={n.color}>{n.label}</text>
            </g>
          ))}

          {/* Row 3 nodes */}
          {[
            { step: 10, x: 740, y: 400, w: 155, h: 60, emoji: "\u{1F9D1}", label: "Human Picks", color: "#bc8cff", fill: "#bc8cff10" },
            { step: 11, x: 490, y: 400, w: 155, h: 60, emoji: "\u{1F517}", label: "Fuse to Skeleton", color: "#bc8cff", fill: "#bc8cff10" },
          ].map(n => (
            <g key={n.step} className="cursor-pointer" onClick={() => setSelectedStep(n.step)}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="12" fill={n.fill} stroke={n.color}
                strokeWidth={selectedStep === n.step ? 3 : 1.5}
                filter={selectedStep === n.step ? 'url(#nodeGlow)' : undefined}
              />
              <text fontSize="9" x={n.x + 10} y={n.y + 12} fill="#555">{n.step}</text>
              <text fontSize="17" x={n.x + n.w / 2} y={n.y + 24} textAnchor="middle" fill={n.color}>{n.emoji}</text>
              <text fontSize="12.5" fontWeight="700" x={n.x + n.w / 2} y={n.y + 46} textAnchor="middle" fill={n.color}>{n.label}</text>
            </g>
          ))}
          <text x="475" y="440" fontSize="14" fill="#38bdf8" textAnchor="end" opacity="0.5">{"\u2192"} into Sequencer</text>

          {/* Animated particles — Runtime flow */}
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#p-1-2"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1s"><mpath href="#p-1-2"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.3s"><mpath href="#p-2-3"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.3s"><mpath href="#p-2-3"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.5s"><mpath href="#p-3-4"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.5s"><mpath href="#p-3-4"/></animateMotion></circle>
          {/* Learning flow */}
          <circle r="4" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0s"><mpath href="#p-6-7"/></animateMotion></circle>
          <circle r="4" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.25s"><mpath href="#p-6-7"/></animateMotion></circle>
          <circle r="4" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.3s"><mpath href="#p-7-8"/></animateMotion></circle>
          <circle r="4" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.55s"><mpath href="#p-7-8"/></animateMotion></circle>
          <circle r="4" fill="#bc8cff" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.5s"><mpath href="#p-8-9"/></animateMotion></circle>
          <circle r="4" fill="#bc8cff" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.75s"><mpath href="#p-8-9"/></animateMotion></circle>
          <circle r="4" fill="#bc8cff" filter="url(#particleGlow)"><animateMotion dur="3s" repeatCount="indefinite" begin="0.7s"><mpath href="#p-9-10"/></animateMotion></circle>
          <circle r="4" fill="#bc8cff" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.9s"><mpath href="#p-10-11"/></animateMotion></circle>
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

function YouTubeEmbed({ src, title }) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-neutral-800 mb-16" style={{ paddingBottom: 'min(56.25%, 540px)', boxShadow: '0 4px 32px rgba(0,0,0,0.5)' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full border-none"
        src={src}
        title={title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default function DancerClaude() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

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
            <h1>Dancer Claude</h1>
            <p className="text-dark-muted text-lg mt-2">A stick figure that dances to music &mdash; three ways</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Claude Code</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316e0', border: '1px solid #f9731638' }}>Signal Processing</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316c0', border: '1px solid #f9731632' }}>Computer Vision</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316a0', border: '1px solid #f973162c' }}>Machine Learning</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f9731688', border: '1px solid #f9731626' }}>Physics-Based Modeling</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8', border: '1px solid #38bdf840' }}>Creative Technology</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8a0', border: '1px solid #38bdf825' }}>Music & Dance</span>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80', border: '1px solid #4ade8040' }}>AI Startups</span>
              </div>
            </div>
          </section>

          {/* Live App */}
          <section className="mb-12">
            <div className="w-full rounded-xl overflow-hidden border border-neutral-800" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.5)' }}>
              <iframe
                src="/dancer-claude-app/index.html"
                title="Dancer Claude — Live Demo"
                className="w-full border-none"
                style={{ height: '820px' }}
                allow="autoplay"
              />
            </div>
          </section>

          {/* Introduction */}
          <section className="mb-12">
            <h2>Introduction</h2>
            <p>
              A stick figure that dances to music in your browser. Upload any song and it improvises to the beat, picking from a vocabulary of 23 moves. Or switch to Learnt mode and it performs choreography extracted from real YouTube dance videos. Or try Fusion, where it blends both, controlled by a probability slider you can drag mid-song.
            </p>
            <p>
              Three modes, three levels of intelligence. Freestyle is your average Joe at the club, grooving with a few reliable moves. Learnt is that same Joe after watching YouTube tutorials, performing choreography note-for-note. Fusion is Joe at the club after dance class, deciding moment-to-moment whether to bust out a new move or stick with what he knows.
            </p>
            <p>
              Under the hood, the system combines real-time signal processing, computer vision, machine learning, and a physics-inspired invariant to make it all work together. The sections below explain how.
            </p>
          </section>

          {/* Project Overview Video */}
          <section className="mb-12">
            <h2 className="text-center mb-8">Project Overview</h2>
            <YouTubeEmbed
              src="https://www.youtube.com/embed/z62DJVUxkVw"
              title="Dancer Claude — Project Overview"
            />
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
            <p>
              Two pipelines power the system. The top row runs in real time in your browser. The bottom row runs offline on your machine.
            </p>
            <p>
              At runtime, the Ears analyze the audio waveform every frame, splitting it into bass, mid, and treble bands to compute an energy score and detect beats. The Body's sequencer uses that energy to pick a move from the right intensity bucket, flipping a biased coin in Fusion mode to decide between freestyle and learnt vocabularies. The Skeleton renders the chosen pose at 60fps with smoothstep interpolation, groove bounce, and spring easing.
            </p>
            <p>
              The learning pipeline starts with a YouTube dance video. The Eyes (MediaPipe) extract 13-joint poses at 15 frames per second. Dictionary learning decomposes the full choreography into recurring patterns, and a human reviews animated previews to select the ones that look like real dance moves. Selected atoms are fused onto the freestyle skeleton using angle decomposition, preserving the move's shape while adapting it to the stick figure's proportions.
            </p>
            <p>
              The bridge between the two pipelines is the angle invariant. Relative joint angles don't change between dancers of different sizes. Extract angles from any source, reconstruct with the target skeleton's bone lengths, and the move transfers perfectly. This is what makes Fusion possible: both vocabularies live in the same coordinate space.
            </p>
          </section>

          {/* Design Philosophy */}
          <section className="mb-12">
            <h2>Design Philosophy</h2>
            <p>
              A dance is a language. Moves are words. Poses are letters. The dance alphabet is a finite set of discrete poses that compose into sequences, and sequences compose into choreography. This is the fundamental abstraction: every dance, no matter how complex, is a path through a finite alphabet.
            </p>
            <p>
              The freestyle vocabulary was hand-crafted: 23 moves categorized by energy level and body region. But learning new moves from video requires decomposition. Dictionary learning finds a compact basis for the choreography's function space, but mathematical compactness doesn't equal human meaning. A basis function might span two moves or capture a transition rather than a move. So a human reviews the candidates. This is human-in-the-loop dictionary learning: the machine proposes, the human disposes.
            </p>
            <p>
              The deepest design choice is the invariant. When two dancers of different heights perform the same move, their joint coordinates differ but their joint angles are identical. Angles are the invariant representation: they describe what the body is doing, independent of whose body is doing it. Extract angles from a YouTube dancer, reconstruct with the stick figure's bone lengths, and the move transfers with full fidelity. No heuristic scaling, no proportion hacks. Just the underlying law.
            </p>
          </section>

          {/* The Claude Code Angle */}
          <section className="mb-12">
            <h2>The Claude Code Angle</h2>
            <p>
              This project could only have been built with Claude Code. Not because it's a good coding tool &mdash; because of something deeper about how the collaboration works.
            </p>
            <p>
              Music is a physical wave with precise mathematical structure. Fourier analysis reveals its frequency content. That frequency content maps lawfully onto human perception &mdash; bass frequencies vibrate your chest cavity and trigger a motor response, tempo drives rhythm, energy drives intensity. These aren't metaphors. They're psychoacoustics &mdash; a studied, lawful bridge between physics and perception.
            </p>
            <p>
              The dance engine models this bridge computationally. Energy is a bass-weighted first moment of the power spectral density, smoothed through an exponential moving average. Beat detection uses adaptive thresholding on low-frequency content. Amplitude scaling maps energy to movement size. These aren't arbitrary design choices &mdash; they're a computational proxy for how the human body responds to sound waves. Claude contributed the psychoacoustic model: the insight that bass frequencies drive physical movement because of wavelength-body resonance, and the specific implementation that weights bass at 45%, treble at 20%, with smoothing that mirrors the same mathematical structure as the Adam optimizer.
            </p>
            <p>
              This is what made the feedback loop work. Vivek would watch the dancer and describe what looked wrong in natural language &mdash; "it looks like a stiff guy at a wedding." Claude could decode that into a specific parameter offset &mdash; groove bounce too weak, amplitude scaling not bass-responsive enough &mdash; because the mapping from perception to physics is known and lawful. Fix the parameter, the perception changes, Vivek describes the new offset, iterate. The loop converges because every bridge in the chain is real: music to math (Fourier), math to code (algorithms), code to perception (the dance changes), perception to language (Vivek describes it), language to code (Claude understands all the bridges).
            </p>
            <p>
              Beyond the feedback loop, the project requires local machine access at every level. YouTube videos are downloaded with yt-dlp. MediaPipe runs computer vision on large video files. Dictionary learning (sklearn) decomposes choreographies into atoms. A GTK dialog pops up for human-in-the-loop review. The fusion pipeline runs angle decomposition in both Python and JavaScript. None of this is possible in a browser-only app builder like Lovable &mdash; the project spans frontend signal processing, Python ML pipelines, local file I/O, and native GUI, all orchestrated through a single coding agent.
            </p>
            <p>
              The vibes have physics underneath them. That's why this works.
            </p>
          </section>

          {/* Professor Claude Teaches Dancer Claude */}
          <section className="mb-12">
            <h2>Professor Claude Teaches Dancer Claude</h2>
            <p>
              Professor Claude is a separate project &mdash; a Socratic voice teaching system built with Claude Code. It's a voice interface where you ask questions and Claude teaches you through dialogue, not lectures, via a cute orange robot face.
            </p>
            <p>
              This is a raw recording of a Socratic session where Professor Claude walks through the Dancer Claude project at a high level &mdash; what the three modes are, how they work, and how they connect. The audio crackles and the production is rough, but that's the point: this is an unscripted, real exchange, not a polished demo. It captures the "meta" moment of using one Claude Code project to understand another Claude Code project.
            </p>
            <p>
              The deeper technical discussions &mdash; signal processing, spring easing, the perception-physics feedback loop &mdash; happened in later unrecorded sessions. We decided that the pressure of screen recording changed the quality of the Socratic dialogue, so this remains the one recorded example of the exchange. The insights from those later sessions are summarized in the sections above.
            </p>
            <YouTubeEmbed
              src="https://www.youtube.com/embed/zjzYER-Vaco"
              title="Professor Claude Teaches Dancer Claude"
            />
          </section>

          {/* Opa Gangnam Style */}
          <section className="mb-12">
            <h2 className="text-center mb-8">Opa Gangnam Style!</h2>
            <YouTubeEmbed
              src="https://www.youtube.com/embed/Hw2BSMZRFg4"
              title="Opa Gangnam Style!"
            />
          </section>

          {/* GitHub */}
          <section className="mb-16 text-center">
            <a
              href="https://github.com/VivekKarmarkar/dancer-claude"
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
