import { useState } from 'react'
import Layout from '../components/Layout'

const STEP_DATA = {
  1:  { icon: "\u{1F399}️", name: "You Speak", color: "#888",
       desc: "You talk to the orange robot. That’s the only input — just voice. The frontend captures your audio through the browser’s microphone." },
  2:  { icon: "\u{1F3A4}", name: "LiveKit WebRTC", color: "#f97316",
       desc: "LiveKit Cloud handles real-time audio transport via WebRTC. Your voice streams to the agent backend with minimal latency. Noise cancellation runs on the audio input." },
  3:  { icon: "\u{1F9E0}", name: "OpenAI Realtime", color: "#38bdf8",
       desc: "In standalone mode, OpenAI’s Realtime API handles everything in one model — speech understanding, reasoning, and speech generation. No separate STT→LLM→TTS chain. The agent can also push visual content to the frontend via LiveKit RPC." },
  4:  { icon: "\u{1F4AC}", name: "Robo Speaks", color: "#888",
       desc: "The robot avatar speaks the response. Its mouth moves with the audio, eyes blink, and the chest indicator light shifts from thinking (amber) to speaking (green). Three visual modes: the basic chat, the visual pane for markdown and LaTeX, and the blackboard with live typewriter rendering." },
  5:  { icon: "\u{1F399}️", name: "You Speak", color: "#888",
       desc: "Same voice input, different pipeline. In Claude Code mode, you’re not talking to OpenAI — you’re talking to a live Claude Code session with access to files, tools, and the terminal." },
  6:  { icon: "\u{1F442}", name: "Deepgram STT", color: "#f97316",
       desc: "Deepgram Nova-3 transcribes your speech to text with multilingual support. Silero VAD detects when you stop speaking, with generous endpointing delays (1.5–6 seconds) because Claude Code takes longer to respond than a simple LLM call." },
  7:  { icon: "\u{1F4E8}", name: "HTTP to Bridge", color: "#f97316",
       desc: "The LiveKit agent posts your transcribed text via HTTP to the robo-voice MCP Channel Server running locally. This HTTP request will block until Claude Code responds — up to 90 seconds." },
  8:  { icon: "\u{1F517}", name: "Channel Push", color: "#4ade80",
       desc: "The MCP server pushes a channel notification into Claude Code’s conversation. Your message appears in Claude’s context like a chat bubble arriving — no polling, no pulling. This is the push-based architecture that makes real-time voice possible." },
  9:  { icon: "\u{1F9E0}", name: "Claude Code", color: "#4ade80",
       desc: "Claude Code processes your message with full access to its tools, files, and terminal. It can read code, run commands, search the web, or just have a conversation. When it’s ready to respond, it calls the speak tool." },
  10: { icon: "\u{1F50A}", name: "Speak Tool", color: "#4ade80",
       desc: "Claude Code calls the speak tool with response text. The MCP server resolves the pending HTTP request from step 7, returning Claude’s words to the LiveKit agent. This is the async rendezvous — the blocked request and the speak call meet at the server." },
  11: { icon: "\u{1F4AC}", name: "Robo Speaks", color: "#f97316",
       desc: "OpenAI TTS converts Claude’s text to speech. The robot avatar animates, and you hear the response. The full round trip — from your voice to Claude Code’s brain and back — typically takes 3–10 seconds depending on Claude’s thinking time." },
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
            <span className="text-[22px]">{"\u{1F3A4}"}</span>
            <span className="font-bold text-lg" style={{ color: '#f97316' }}>Voice</span>
          </div>
          <span className="font-bold text-lg text-[#e0e0e0]">LiveKit + OpenAI</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{"\u{1F9E0}"}</span>
            <span className="font-bold text-lg" style={{ color: '#38bdf8' }}>Brain</span>
          </div>
          <span className="font-bold text-lg text-[#e0e0e0]">OpenAI or Claude Code</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">{"\u{1F517}"}</span>
            <span className="font-bold text-lg" style={{ color: '#4ade80' }}>Bridge</span>
          </div>
          <span className="font-bold text-lg text-[#e0e0e0]">MCP Channel Server</span>
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
            <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#888"/>
            </marker>
          </defs>

          <rect width="980" height="480" fill="url(#dots)"/>

          {/* Row 1: Standalone mode */}
          <text x="490" y="20" fontSize="11" fill="#555" textAnchor="middle" fontWeight="700" letterSpacing="2">STANDALONE MODE</text>

          {/* Row 1 paths */}
          <path id="p-1-2" d="M 145,80 C 195,80 215,80 255,80" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowOrange)"/>
          <path id="p-2-3" d="M 425,80 C 475,80 495,80 535,80" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowBlue)"/>
          <path id="p-3-4" d="M 705,80 C 755,80 775,80 815,80" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowOrange)"/>

          {/* Row 1 nodes */}
          {[
            { step: 1, x: 15, y: 50, w: 130, h: 60, emoji: "\u{1F399}️", label: "You Speak", color: "#888", fill: "#88888812" },
            { step: 2, x: 255, y: 50, w: 170, h: 60, emoji: "\u{1F3A4}", label: "LiveKit WebRTC", color: "#f97316", fill: "#f9731610" },
            { step: 3, x: 535, y: 50, w: 170, h: 60, emoji: "\u{1F9E0}", label: "OpenAI Realtime", color: "#38bdf8", fill: "#38bdf810" },
            { step: 4, x: 815, y: 50, w: 150, h: 60, emoji: "\u{1F4AC}", label: "Robo Speaks", color: "#888", fill: "#88888812" },
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

          {/* Divider */}
          <line x1="40" y1="160" x2="940" y2="160" stroke="#23263a" strokeWidth="1"/>
          <text x="160" y="185" fontSize="11" fill="#555" textAnchor="middle" fontWeight="700" letterSpacing="2">CLAUDE CODE MODE</text>

          {/* Row 2 paths */}
          <path id="p-5-6" d="M 145,260 C 195,260 215,260 255,260" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowOrange)"/>
          <path id="p-6-7" d="M 425,260 C 475,260 495,260 535,260" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowOrange)"/>
          <path id="p-7-8" d="M 705,260 C 755,260 775,260 815,260" fill="none" stroke="#4ade80" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowGreen)"/>

          {/* Turn + Row 3 paths */}
          <path id="p-8-9" d="M 890,290 C 890,330 890,350 890,370" fill="none" stroke="#4ade80" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowGreen)"/>
          <text x="930" y="340" fontSize="20" fill="#333" textAnchor="middle">{"↵"}</text>
          <path id="p-9-10" d="M 815,400 C 755,400 705,400 645,400" fill="none" stroke="#4ade80" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowGreen)"/>
          <path id="p-10-11" d="M 475,400 C 415,400 355,400 295,400" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowOrange)"/>

          {/* Row 2 nodes */}
          {[
            { step: 5, x: 15, y: 230, w: 130, h: 60, emoji: "\u{1F399}️", label: "You Speak", color: "#888", fill: "#88888812" },
            { step: 6, x: 255, y: 230, w: 170, h: 60, emoji: "\u{1F442}", label: "Deepgram STT", color: "#f97316", fill: "#f9731610" },
            { step: 7, x: 535, y: 230, w: 170, h: 60, emoji: "\u{1F4E8}", label: "HTTP to Bridge", color: "#f97316", fill: "#f9731610" },
            { step: 8, x: 815, y: 230, w: 150, h: 60, emoji: "\u{1F517}", label: "Channel Push", color: "#4ade80", fill: "#4ade8010" },
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
            { step: 9, x: 815, y: 370, w: 150, h: 60, emoji: "\u{1F9E0}", label: "Claude Code", color: "#4ade80", fill: "#4ade8010" },
            { step: 10, x: 475, y: 370, w: 170, h: 60, emoji: "\u{1F50A}", label: "Speak Tool", color: "#4ade80", fill: "#4ade8010" },
            { step: 11, x: 145, y: 370, w: 150, h: 60, emoji: "\u{1F4AC}", label: "Robo Speaks", color: "#888", fill: "#88888812" },
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
          <text x="130" y="405" fontSize="14" fill="#f97316" textAnchor="end" opacity="0.6">{"✔"} TTS</text>

          {/* Animated particles — Standalone flow */}
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#p-1-2"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1s"><mpath href="#p-1-2"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.3s"><mpath href="#p-2-3"/></animateMotion></circle>
          <circle r="4" fill="#38bdf8" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.3s"><mpath href="#p-2-3"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="0.5s"><mpath href="#p-3-4"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2s" repeatCount="indefinite" begin="1.5s"><mpath href="#p-3-4"/></animateMotion></circle>

          {/* Animated particles — Claude Code flow */}
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0s"><mpath href="#p-5-6"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.25s"><mpath href="#p-5-6"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.3s"><mpath href="#p-6-7"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.55s"><mpath href="#p-6-7"/></animateMotion></circle>
          <circle r="4" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.5s"><mpath href="#p-7-8"/></animateMotion></circle>
          <circle r="4" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.75s"><mpath href="#p-7-8"/></animateMotion></circle>
          <circle r="4" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="3s" repeatCount="indefinite" begin="0.7s"><mpath href="#p-8-9"/></animateMotion></circle>
          <circle r="4" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.9s"><mpath href="#p-9-10"/></animateMotion></circle>
          <circle r="4" fill="#4ade80" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="2s"><mpath href="#p-9-10"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.1s"><mpath href="#p-10-11"/></animateMotion></circle>
          <circle r="4" fill="#f97316" filter="url(#particleGlow)"><animateMotion dur="2.5s" repeatCount="indefinite" begin="2.3s"><mpath href="#p-10-11"/></animateMotion></circle>
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
    <div className="relative w-full rounded-xl overflow-hidden border border-neutral-800 mb-10"
         style={{ paddingBottom: 'min(56.25%, 540px)', boxShadow: '0 4px 32px rgba(0,0,0,0.5)' }}>
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

export default function ProfessorClaude() {
  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

          {/* Dual Train Badges — D + I */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-lg"
                style={{ backgroundColor: '#FCCC0A' }}
              >
                D
              </span>
              <span className="text-dark-muted">AI Demos</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-lg"
                style={{ backgroundColor: '#A7A9AC' }}
              >
                I
              </span>
              <span className="text-dark-muted">Infrastructure</span>
            </div>
          </div>

          {/* Title */}
          <section className="mb-8">
            <h1>Professor Claude</h1>
            <p className="text-dark-muted text-lg mt-2">LiveKit + OpenAI Realtime API + Claude Code Channels &mdash; a voice AI system built by a physicist with no CS degree</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Claude Code</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316b0', border: '1px solid #f9731630' }}>Voice Agents</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f9731680', border: '1px solid #f9731620' }}>MCP Channels</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8', border: '1px solid #38bdf840' }}>Creative Technology</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8a0', border: '1px solid #38bdf825' }}>EdTech</span>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80', border: '1px solid #4ade8040' }}>AI Startups</span>
              </div>
            </div>
          </section>

          {/* Hero Video */}
          <section className="mb-16">
            <YouTubeEmbed
              src="https://www.youtube.com/embed/iS7eBHtN4SE"
              title="Professor Claude — Project Demo"
            />
          </section>

          {/* Introduction */}
          <section className="mb-12">
            <h2>Introduction</h2>
            <p>
              Talk to an orange robot. It listens, thinks, and responds with voice &mdash; while drawing equations on a blackboard, writing code in Julia and Python, sketching ASCII diagrams, taking notes, and singing Punjabi songs if you ask nicely. Three AI models play three roles: the Voice carries speech across the wire via WebRTC, the Brain thinks about what to say, and the Bridge pushes your words into a live Claude Code session the instant you finish speaking.
            </p>
            <p>
              Robo Chat started as a fantasy &mdash; what if Claude could attend a PhD comprehensive exam? Not as text on a screen, but as a cute animated face with blue LED eyes, a mouth that moved with speech, and a natural conversational style that doesn't interrupt. The idea came before the exam. The system came together in a day and a half after it, catalyzed by a random Twitter scroll that surfaced LiveKit's voice agent demo.
            </p>
            <p>
              The project was built entirely with Claude Code. Not a single line of code was written by hand. Instead, a physicist used systems thinking to guide Claude Code through custom slash-command skills &mdash; niche library research, sycophancy detection, code audits, add-on features &mdash; making strategic decisions about what to keep, what to strip, and what to build custom. The result is a system that operates in three modes: a chill voice chatbot, an interactive Professor Claude with a visual blackboard, and a bridge to live Claude Code sessions via push-based MCP channels.
            </p>
          </section>
        </div>

        {/* Architecture — full width for the diagram */}
        <div className="max-w-2xl mx-auto prose-medium">
          <section className="mb-12">
            <h2 className="text-center mb-12">Architecture</h2>
          </section>
        </div>

        <ArchitectureDiagram />

        <div className="max-w-2xl mx-auto prose-medium">
          <section className="mb-12">
            <p>
              Two pipelines power the system. The top row runs standalone &mdash; you speak, LiveKit carries audio via WebRTC, and OpenAI's Realtime API handles everything in a single model: speech understanding, reasoning, and speech generation. No separate STT-LLM-TTS chain. One round trip, minimal latency.
            </p>
            <p>
              The bottom row bridges voice to a live Claude Code session. Here the pipeline splits: Deepgram transcribes your speech, the LiveKit agent posts the text to the MCP Channel Server running locally, and the server pushes a channel notification directly into Claude Code's conversation. Claude processes the message, calls the <code className="text-sm bg-neutral-800 px-1.5 py-0.5 rounded">speak</code> tool, and the server resolves the blocking HTTP request &mdash; returning Claude's response to the agent for TTS. The entire handoff is an async rendezvous: the HTTP request from the agent waits until Claude's speak tool fires.
            </p>
            <p>
              Both pipelines share the same frontend &mdash; the animated orange robot with its blue LED eyes, moving mouth, and chest indicator light that shifts between listening, thinking, and speaking states. In standalone mode, the robot connects to OpenAI's brain. In Claude Code mode, it becomes a voice interface to a full coding agent with access to files, tools, and the terminal.
            </p>
          </section>

          {/* Design Philosophy */}
          <section className="mb-12">
            <h2>Design Philosophy</h2>
            <p>
              The component with the information should initiate the action. This is the Information Expert Principle &mdash; and it's why the channel architecture is the only correct choice for real-time voice.
            </p>
            <p>
              Robochat knows the instant you stop speaking. It has the audio stream, the voice activity detection, the complete transcription. Claude Code has none of this &mdash; it's blind to the audio. So if Claude drives, Claude must continuously ask: "Did you finish talking? Did you finish talking?" Each query adds latency. Each gap between queries is a moment where you might be speaking and nobody is listening. With channels, Robochat pushes the message the instant it is ready. Zero wasted time. The information flows from where it exists to where it is needed, immediately.
            </p>
            <p>
              This insight wasn't learned from a textbook. It was derived from building &mdash; the channel approach worked beautifully, the regular MCP polling approach felt clunky and broken &mdash; and then validated through adversarial reasoning. What if Claude drives instead? Trace it through. Where does it break? The information asymmetry makes one direction natural and the other fundamentally strained. In the channel design, Robochat is the drummer keeping the beat of the conversation. Claude plays when the beat arrives. Making Claude the drummer forces a musician to keep time &mdash; but Claude is designed to play when given the beat, not to set it.
            </p>
          </section>

          {/* The Physicist's Method */}
          <section className="mb-12">
            <h2>The Physicist's Method</h2>
            <p>
              This project was built in a day and a half by someone with a physics degree and no formal computer science training. Not a single line of code was written by hand. The question is: what skills replaced the code?
            </p>
            <p>
              Three things. Solution scouting &mdash; finding LiveKit's voice agent demo on Twitter while doomscrolling after PhD comps. Systems thinking &mdash; decomposing problems into their structural components, the way a physicist decomposes a second-order ODE into a linear dynamical system. And Claude Code itself &mdash; a constellation of custom skills invoked via slash commands: niche library research to understand Anam's free-tier limits and OpenAI's Realtime API, sycophancy detection to keep Claude Code honest, code-audit swarms to validate changes, add-on feature to implement one thing at a time without breaking others.
            </p>
            <p>
              The hardest problem was the blackboard. Claude Code kept trying to solve live streaming and live rendering as one coupled problem &mdash; and failed five times. The breakthrough came from decoupling: the visual pane already had the content. Just render it character by character. Don't stream and render simultaneously. Get all the data, then animate. This is a physicist's move &mdash; separate the variables, solve the simpler problem. It worked on the first try.
            </p>
            <p>
              Physics doesn't teach specific solutions. It teaches how to think about systems. A physicist learns that the same differential equation describes a spring, a circuit, and a pendulum. The details differ, but the structure is the same. AI tools have collapsed the barrier between "can think clearly about systems" and "can build software products." The bottleneck used to be implementation. Now the bottleneck is thinking. And thinking is what physics trains you to do.
            </p>
          </section>

          {/* Three Modes of Use */}
          <section className="mb-12">
            <h2>Three Modes of Use</h2>
            <p>
              The user's Claude Code Operating System (customized layer over Claude Code) adapts to three physical contexts across the day.
            </p>
            <p>
              Remote control mode: walking 30,000 steps across university campus while Claude Code trains neural networks and writes reports on the laptop back home. The phone becomes a mobile command center &mdash; productive work runs remotely while the user exercises outdoors.
            </p>
            <p>
              Voice conversation mode: lying outside on campus or in bed at night, brainstorming with Robo connected to a live Claude Code session via channels. Split-screen &mdash; the robot on one side, Claude Code's terminal on the other.
            </p>
            <p>
              Standalone Professor Claude: pure one-on-one tutoring with the blackboard, LaTeX rendering, code cells, and ASCII diagrams. No Claude Code session needed. Just voice and visuals.
            </p>
            <p>
              During a recorded reflection session, Robo was asked to guess the builder's educational background based solely on how the project was described &mdash; the problem-solving approach, the way systems were decomposed, the comfort with abstract models. Robo guessed physics on the first try. "The way you tackled complex problems &mdash; very methodically breaking things down, experimenting through trial and error, and focusing on both the conceptual and practical sides. That kind of analytical mindset is often found in physics." The system had recognized its builder's discipline from the shape of the conversation alone.
            </p>
          </section>

          {/* The Origin Story */}
          <section className="mb-12">
            <h2>The Origin Story</h2>
            <p>
              The idea was simple and slightly absurd: have Claude attend a PhD comprehensive exam. Not as a text interface &mdash; as a presence. A cute animated face that could sit in a Zoom call, listen to the presentation, and ask questions during Q&A. The same way you'd invite a remote committee member &mdash; send them a link, they click in, they appear.
            </p>
            <p>
              Three or four attempts before the exam all failed. Claude Code's research kept converging on the same tech stacks, and they kept breaking in similar ways. The idea sat there, unsolved. Two days after passing comps, doomscrolling through Twitter, a post about LiveKit and real-time audio caught attention. Click. YouTube demo. A voice agent with a human avatar that fills out medical forms through natural conversation. The realization was immediate: this exists. Clone the repo. Swap the human avatar for an orange robot. Strip the medical form logic. Keep everything else.
            </p>
            <p>
              The design philosophy crystallized: if a solution exists, use it out of the box and tweak only what needs to change. Anam's avatar library had a three-minute limit on the free tier. Niche library research confirmed it. Solution: throw away Anam entirely, have Claude Code build a custom SVG robot. That eliminates the time limit and the API dependency in one move. Then: use the user's own OpenAI API key for the heavy lifting, keeping LiveKit on the free tier for transport. Cut bloat, minimize dependencies, solve the problem.
            </p>
            <p>
              Built in a day and a half. The irony &mdash; the project that was supposed to demo at the comprehensive exam came to life immediately after it &mdash; became part of the story itself.
            </p>
          </section>

          {/* Use Cases */}
          <section className="mb-12">
            <h2 className="text-center mb-12">Use Cases</h2>
            <YouTubeEmbed
              src="https://www.youtube.com/embed/iS7eBHtN4SE"
              title="Use Case 1"
            />
            <YouTubeEmbed
              src="https://www.youtube.com/embed/ajq4H-btOLA"
              title="Use Case 2"
            />
            <YouTubeEmbed
              src="https://www.youtube.com/embed/zjzYER-Vaco"
              title="Use Case 3"
            />
          </section>

          {/* GitHub */}
          <section className="mb-16 text-center">
            <a
              href="https://github.com/VivekKarmarkar/livekit-project"
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
