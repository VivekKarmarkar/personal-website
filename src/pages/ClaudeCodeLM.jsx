import { useState } from 'react'
import Layout from '../components/Layout'

// ── Architecture (Post-Pivot) step data ─────────────────────────────
const STEP_DATA = {
  1: { icon: "📚", name: "1. Sections (parallel swarm)", color: "#f97316",
       desc: "pdftotext extracts the paper and its section structure is discovered. Then a parallel swarm — one agent per section — writes the per-section explanations simultaneously, each already obeying the project's narration style. They fan into the synthesizer (step 2). Output: sections.json + section_explanations/*.md." },
  2: { icon: "✍️", name: "2. Synthesizer", color: "#f97316",
       desc: "Connect the per-section explanations into one flowing draft_story.md — a connected story, not concatenation." },
  3: { icon: "🎯", name: "3. Narrative", color: "#f97316",
       desc: "Identify the ONE load-bearing message in the paper. Write narrative_refined.md with a strong hook + 6-beat arc (background → what → how → proof → limitations → where it leaves us). Target 13-15K chars." },
  4: { icon: "🛡️", name: "4. Hallucination Check", color: "#f97316",
       desc: "For each substantive claim, call the blue paper-reading skill stack below to find verbatim PDF grounding. Append a YAML journal entry. Correct anything CONTRADICTED or SILENT using the verbatim excerpt as ground truth. Write narrative_final.md + hallucination_audit.md." },
  5: { icon: "🎨", name: "5. Tag Enrichment", color: "#f97316",
       desc: "Read narrative_final.md. Insert eleven_v3 audio tags ([warmly], [excited], [whispers], [awe], [sigh], [pause]) at strategic moments — about 1 tag per 2 sentences. NEVER modify the spoken words. Write narrative_v3_tagged.md." },
  6: { icon: "🎙️", name: "6. audify-eleven", color: "#f97316",
       desc: "Mechanical TTS engine. Chunks the tagged narrative under v3's 5000-char cap, calls ElevenLabs text_to_speech.convert per chunk with Matilda voice + tuned VoiceSettings, ffmpeg-concats the chunk mp3s losslessly. Output: podcast.mp3." },
  7: { icon: "☁️", name: "7. Upload + Share", color: "#f97316",
       desc: "gws drive files create (with cd into the mp3 dir to dodge the gws path bug) + gws drive permissions create. The agent that owns the mp3 also owns the share. Returns a webViewLink." },
  8: { icon: "❓", name: "/ask-question-about-paper", color: "#38bdf8",
       desc: "Ask the paper a direct question, get the verbatim text excerpt back with page number + structural context. Appends a YAML journal entry. Handles 'paper doesn't answer this' by recording status: null. Pre-existing skill from the highlighting flow." },
  9: { icon: "🔍", name: "/find-evidence-in-paper", color: "#38bdf8",
       desc: "Find verbatim text in the PDF that SUPPORTS, CONTRADICTS, PARTIALLY_SUPPORTS, or is SILENT on a user claim. Appends a YAML journal entry with the verbatim excerpt, page number, and AI commentary on the evidential relationship. Load-bearing for hallucination prevention." },
  10: { icon: "✏️", name: "/text-to-highlight-in-paper", color: "#38bdf8",
        desc: "Locate a verbatim excerpt in the PDF given a fuzzy context cue (verbatim quote, partial quote, or descriptive hint). Appends a YAML journal entry. The grounding layer that lets us point Cat-2 highlighting skills at the right text." },
  11: { icon: "💾", name: "MD Context Store", color: "#4ade80",
        desc: "All artifacts persist as versioned markdown files on disk — sections.json, draft_story.md, narrative_refined.md, narrative_final.md, narrative_v3_tagged.md, hallucination_audit.md, the find-evidence-in-paper journal. Human-readable, agent-parseable, git-diffable. The pipeline's persistent memory." },
  12: { icon: "📄", name: "Paper PDF (input)", color: "#888",
        desc: "Any research paper. Local file path or a paper reference (DOI, arXiv ID, title, URL) when invoked via /download-podcastify-plus-and-share — /paper-download-hack runs synchronously in the orchestrator to resolve a reference into a real PDF on disk before handing off to the background agent." },
  13: { icon: "📧", name: "Drive → Inbox (output)", color: "#888",
        desc: "gws drive files create uploads the mp3 to Google Drive (under the agent's authenticated account); gws drive permissions create grants reader access to the recipient email (default: vivekjobapp123@gmail.com). The agent returns the webViewLink. The recipient's phone gets a Drive notification — they tap, the mp3 plays inline." },
}

const ARCH_DEFAULT = {
  icon: "🤖", name: "Click any step to see how it works", color: "#f97316",
  desc: "The orange dashed box is the Level-4 background-agent boundary — everything inside it runs autonomously once the orchestrator fires the skill. The blue dashed box is the paper-reading skill stack Vivek already had in his pocket flow, now wired into the hallucination-check phase. The green cylinder is the markdown-context store every step reads and writes.",
}

// ── Voice → /goal flow step data ────────────────────────────────────
const V_STEP_DATA = {
  1: { icon: "🎙️", name: "Voice (dictation)", color: "#888",
       desc: "Vivek dictates the project into Telegram, usually mid-walk — long voice messages, raw thinking aloud. The dictation is what kicks off every project on this stack." },
  2: { icon: "📱", name: "Telegram channel", color: "#38bdf8",
       desc: "The voice arrives as an .oga attachment on the Telegram channel wired into Claude Code. A voice-transcription hook downloads the file and transcribes it on arrival, so Claude sees text instead of opaque audio." },
  3: { icon: "🤖", name: "Claude Code (shaping)", color: "#f97316",
       desc: "Claude reads the transcript, asks back the missing constraints, surfaces tensions, and helps shape the raw dictation into a precise multi-section specification — over a few voice-message exchanges, the picture sharpens." },
  4: { icon: "📝", name: "Spec markdown file", color: "#4ade80",
       desc: "The shaped spec lands on disk as a markdown file: motivation, scope, phases with exit criteria, cardinal constraints, risks, out-of-scope items. Human-readable, agent-parseable, git-diffable. Vivek can review or edit before firing." },
  5: { icon: "⚡", name: "/goal trigger", color: "#f97316",
       desc: "One command: /goal @<doc>.md and take ALL DECISIONS AUTONOMOUSLY. Claude reads the contract, builds an internal task list, and executes phase by phase — no interactive back-and-forth, no clarifying questions, judgment calls documented in the final summary." },
  6: { icon: "📧", name: "Deliverable to inbox", color: "#888",
       desc: "When the autonomous run completes, the deliverable (mp3, PDF, paper bundle, dataset — whatever the spec named) lands in Vivek's Google Drive shared with vivekjobapp123@gmail.com. His phone buzzes; he taps and plays. The loop closes." },
}

const VF_DEFAULT = {
  icon: "🎤", name: "Click any step to see what happens", color: "#f97316",
  desc: "Six steps from voice memo to deliverable in the inbox. The four middle steps (Telegram → Claude → Spec → /goal) are the project-shaping loop; the outer two are dictation in and deliverable out.",
}

// ── Abstraction Ladder rungs (top → bottom) ─────────────────────────
const LADDER_RUNGS = [
  { level: 'LEVEL 5', name: 'In-House + Background Agent', constraint: 'What got built. RESOLVED for NotebookLM.', variant: 'top' },
  { level: 'LEVEL 4', name: 'API/SDK + Background Agent', constraint: 'Would resolve cleanly — if a NotebookLM API or SDK existed.', variant: 'highlight' },
  { level: 'LEVEL 3', name: 'API/SDK + Main Agent', constraint: 'The call blocks — the main session is stuck inside one request.' },
  { level: 'LEVEL 2', name: 'MCP', constraint: 'MCP tools fire the call, but no signal when audio is done.' },
  { level: 'LEVEL 1', name: 'Computer Use', constraint: 'Clicking the NotebookLM UI. Wrong mode for a coding agent.' },
]

// ── Shared components ───────────────────────────────────────────────

function Mono({ children }) {
  return <span className="font-mono text-[0.9em]" style={{ color: '#f97316' }}>{children}</span>
}

// ONE reusable detail bar shared by both interactive diagrams
function DetailBar({ item, attached = false }) {
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-6 py-3.5 min-h-16"
      style={{
        background: '#161822',
        borderTop: '1px solid #2e3140',
        borderRadius: attached ? '0 0 12px 12px' : '12px',
        marginTop: attached ? 0 : 8,
      }}
    >
      <span className="text-[26px] flex-shrink-0">{item.icon}</span>
      <span className="font-bold text-[15px] sm:min-w-[180px] flex-shrink-0" style={{ color: item.color }}>
        {item.name}
      </span>
      <span className="text-[13px] leading-relaxed" style={{ color: '#bbb' }}>
        {item.desc}
      </span>
    </div>
  )
}

function YouTubeEmbed({ src, title, eyebrow, caption }) {
  return (
    <div className="mb-10">
      {eyebrow && (
        <span className="block text-center text-[13px] font-bold uppercase mb-3.5" style={{ color: '#f97316', letterSpacing: '1.5px' }}>
          {eyebrow}
        </span>
      )}
      <div className="relative w-full rounded-xl overflow-hidden border border-neutral-800"
           style={{ paddingBottom: 'min(56.25%, 540px)', boxShadow: '0 4px 32px rgba(0,0,0,0.5)' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full border-none"
          src={src}
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption && (
        <span className="block text-center text-sm mt-3.5" style={{ color: '#9a9a9a' }}>{caption}</span>
      )}
    </div>
  )
}

// ── The Abstraction Ladder ──────────────────────────────────────────
function AbstractionLadder() {
  return (
    <div className="ccl-ladder">
      <div className="ccl-spine"></div>
      {LADDER_RUNGS.map((rung) => (
        <div key={rung.level} className={`ccl-rung${rung.variant ? ` ccl-${rung.variant}` : ''}`}>
          <div className="ccl-dot"></div>
          <div className="ccl-rung-main">
            <div className="ccl-rung-left">
              <span className="ccl-era">{rung.level}</span>
              <span className="ccl-name">{rung.name}</span>
            </div>
            <span className="ccl-constraint">{rung.constraint}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Architecture diagram (13 nodes, serpentine pipeline) ────────────

const ARCH_PIPELINE_NODES = [
  { step: 2, x: 312, y: 84, emoji: '✍️', label: 'Synthesizer' },
  { step: 3, x: 448, y: 84, emoji: '🎯', label: 'Narrative' },
  { step: 4, x: 584, y: 84, emoji: '🛡️', label: 'Halluc. Check' },
  { step: 5, x: 584, y: 224, emoji: '🎨', label: 'Tag Enrich' },
  { step: 6, x: 448, y: 224, emoji: '🎙️', label: 'audify-eleven' },
  { step: 7, x: 312, y: 224, emoji: '☁️', label: 'Upload+Share' },
]

const ARCH_SKILL_NODES = [
  { step: 8, x: 184, emoji: '❓', label: 'ask-question' },
  { step: 9, x: 350, emoji: '🔍', label: 'find-evidence' },
  { step: 10, x: 516, emoji: '✏️', label: 'text-to-highlight' },
]

const ARCH_PARTICLES = [
  { path: 'p-1-2', dur: '2.2s', begin: '0s', fill: '#f97316', r: 3.2 },
  { path: 'p-2-3', dur: '2.2s', begin: '0.5s', fill: '#f97316', r: 3.2 },
  { path: 'p-3-4', dur: '2.2s', begin: '1.0s', fill: '#f97316', r: 3.2 },
  { path: 'p-4-5', dur: '2.4s', begin: '1.5s', fill: '#f97316', r: 3.2 },
  { path: 'p-5-6', dur: '2.2s', begin: '2.0s', fill: '#f97316', r: 3.2 },
  { path: 'p-6-7', dur: '2.2s', begin: '2.5s', fill: '#f97316', r: 3.2 },
  { path: 'p-7-out', dur: '2.6s', begin: '3.0s', fill: '#888', r: 3.2 },
  { path: 'p-4-pr', dur: '4s', begin: '0s', fill: '#38bdf8', r: 2.8 },
]

function ArchitectureDiagram() {
  const [selectedStep, setSelectedStep] = useState(null)
  const item = selectedStep ? STEP_DATA[selectedStep] : ARCH_DEFAULT

  return (
    <div className="ccl-arch max-w-[1100px] mx-auto mb-14">
      {/* Legend */}
      <div className="flex justify-center gap-9 px-6 pb-4 flex-wrap">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">🤖</span>
            <span className="font-bold text-base" style={{ color: '#f97316' }}>Background Agent</span>
          </div>
          <span className="text-xs" style={{ color: '#888' }}>Level-4 architecture, applied to a from-scratch pipeline</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">📚</span>
            <span className="font-bold text-base" style={{ color: '#38bdf8' }}>Paper-Reading Stack</span>
          </div>
          <span className="text-xs" style={{ color: '#888' }}>existing pocket-flow skills → grounding &amp; hallucination check</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">💾</span>
            <span className="font-bold text-base" style={{ color: '#4ade80' }}>Markdown Context Store</span>
          </div>
          <span className="text-xs" style={{ color: '#888' }}>all artifacts persist as .md files on disk</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full" style={{ aspectRatio: '980/520', maxHeight: '520px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 520" preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
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

          <rect width="980" height="520" fill="url(#dots)"/>

          {/* Background Agent dashed box */}
          <rect x="158" y="58" width="586" height="242" rx="14"
                fill="#f9731608" stroke="#f97316" strokeWidth="2" strokeDasharray="8,5"/>
          <text x="172" y="50" fontSize="10" fontWeight="700" letterSpacing="1.5" fill="#f97316">
            🤖 BACKGROUND AGENT — LEVEL-4 ARCHITECTURE
          </text>

          {/* INPUT: Paper PDF (left-top) */}
          <g className="ccl-node cursor-pointer" onClick={() => setSelectedStep(12)}>
            <rect x="34" y="86" width="94" height="48" rx="11" fill="#88888810" stroke="#888"
              strokeWidth={selectedStep === 12 ? 3 : 1.5}
              filter={selectedStep === 12 ? 'url(#nodeGlow)' : undefined}/>
            <text fontSize="17" x="81" y="108" textAnchor="middle" fill="#888" pointerEvents="none">📄</text>
            <text fontSize="11.5" fontWeight="700" x="81" y="125" textAnchor="middle" fill="#888" pointerEvents="none">Paper PDF</text>
          </g>

          {/* OUTPUT: Drive → Inbox (left-bottom, serpentine end) */}
          <g className="ccl-node cursor-pointer" onClick={() => setSelectedStep(13)}>
            <rect x="28" y="225" width="100" height="48" rx="11" fill="#88888810" stroke="#888"
              strokeWidth={selectedStep === 13 ? 3 : 1.5}
              filter={selectedStep === 13 ? 'url(#nodeGlow)' : undefined}/>
            <text fontSize="17" x="78" y="247" textAnchor="middle" fill="#888" pointerEvents="none">📧</text>
            <text fontSize="11.5" fontWeight="700" x="78" y="264" textAnchor="middle" fill="#888" pointerEvents="none">Drive → Inbox</text>
          </g>

          {/* Step 1: parallel per-section swarm (stacked sheets) */}
          <g className="ccl-node cursor-pointer" onClick={() => setSelectedStep(1)}>
            <rect x="176" y="69" width="100" height="50" rx="11" fill="#f9731606" stroke="#f97316" strokeWidth="1" opacity="0.4"/>
            <rect x="176" y="74" width="100" height="50" rx="11" fill="#f973160a" stroke="#f97316" strokeWidth="1.1" opacity="0.6"/>
            <rect x="176" y="79" width="100" height="50" rx="11" fill="#f973160f" stroke="#f97316" strokeWidth="1.3" opacity="0.82"/>
            <rect x="176" y="84" width="100" height="50" rx="11" fill="#f9731618" stroke="#f97316"
              strokeWidth={selectedStep === 1 ? 3 : 1.7}
              filter={selectedStep === 1 ? 'url(#nodeGlow)' : undefined}/>
            <rect x="176" y="84" width="100" height="50" rx="11" fill="none" stroke="#fbbf24" strokeWidth="2" filter="url(#nodeGlow)" pointerEvents="none">
              <animate attributeName="stroke-opacity" values="0.12;0.7;0.12" dur="2.6s" repeatCount="indefinite"/>
            </rect>
            <text fontSize="9" x="184" y="97" fill="#555" pointerEvents="none">1</text>
            <text fontSize="17" x="226" y="106" textAnchor="middle" fill="#f97316" pointerEvents="none">📚</text>
            <text fontSize="11.5" fontWeight="700" x="226" y="124" textAnchor="middle" fill="#f97316" pointerEvents="none">Sections</text>
            <text x="226" y="151" textAnchor="middle" fill="#fbbf24" fontSize="11.5" fontWeight="700" pointerEvents="none">⭐ parallel</text>
            <text x="226" y="165" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700" pointerEvents="none">per-section agents</text>
          </g>

          {/* Orange pipeline nodes (2-7) */}
          {ARCH_PIPELINE_NODES.map(n => (
            <g key={n.step} className="ccl-node cursor-pointer" onClick={() => setSelectedStep(n.step)}>
              <rect x={n.x} y={n.y} width="100" height="50" rx="11" fill="#f9731610" stroke="#f97316"
                strokeWidth={selectedStep === n.step ? 3 : 1.5}
                filter={selectedStep === n.step ? 'url(#nodeGlow)' : undefined}/>
              <text fontSize="9" x={n.x + 8} y={n.y + 13} fill="#555" pointerEvents="none">{n.step}</text>
              <text fontSize="17" x={n.x + 50} y={n.y + 22} textAnchor="middle" fill="#f97316" pointerEvents="none">{n.emoji}</text>
              <text fontSize="11.5" fontWeight="700" x={n.x + 50} y={n.y + 40} textAnchor="middle" fill="#f97316" pointerEvents="none">{n.label}</text>
            </g>
          ))}

          {/* vertical drop: Halluc Check (4) → Tag Enrich (5) */}
          <path id="p-4-5" d="M 634,134 L 634,224" fill="none" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowOrange)"/>

          {/* Paper-Reading skill stack (blue, below) */}
          <rect x="172" y="358" width="520" height="82" rx="14"
                fill="#38bdf808" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8,5"/>
          {ARCH_SKILL_NODES.map(n => (
            <g key={n.step} className="ccl-node cursor-pointer" onClick={() => setSelectedStep(n.step)}>
              <rect x={n.x} y="372" width="156" height="54" rx="11" fill="#38bdf810" stroke="#38bdf8"
                strokeWidth={selectedStep === n.step ? 3 : 1.5}
                filter={selectedStep === n.step ? 'url(#nodeGlow)' : undefined}/>
              <text fontSize="9" x={n.x + 8} y="385" fill="#555" pointerEvents="none">{n.step}</text>
              <text fontSize="17" x={n.x + 78} y="399" textAnchor="middle" fill="#38bdf8" pointerEvents="none">{n.emoji}</text>
              <text fontSize="11.5" fontWeight="700" x={n.x + 78} y="417" textAnchor="middle" fill="#38bdf8" pointerEvents="none">{n.label}</text>
            </g>
          ))}
          <text x="174" y="456" fontSize="10" fontWeight="700" letterSpacing="1.5" fill="#38bdf8">
            📚 PAPER-READING SKILL STACK — HALLUCINATION CHECK
          </text>

          {/* MD Context Store (green cylinder, right) */}
          <g className="ccl-node cursor-pointer" onClick={() => setSelectedStep(11)}>
            <ellipse cx="872" cy="94" rx="68" ry="11" fill="#4ade8015" stroke="#4ade80"
              strokeWidth={selectedStep === 11 ? 3 : 1.5}/>
            <rect x="804" y="94" width="136" height="74" fill="#4ade8015" stroke="#4ade80"
              strokeWidth={selectedStep === 11 ? 3 : 1.5}
              filter={selectedStep === 11 ? 'url(#nodeGlow)' : undefined}/>
            <ellipse cx="872" cy="168" rx="68" ry="11" fill="#4ade8025" stroke="#4ade80"
              strokeWidth={selectedStep === 11 ? 3 : 1.5}/>
            <text fontSize="17" x="872" y="124" textAnchor="middle" fill="#4ade80" pointerEvents="none">💾</text>
            <text fontSize="11.5" fontWeight="700" x="872" y="144" textAnchor="middle" fill="#4ade80" pointerEvents="none">MD Context Store</text>
            <text x="872" y="200" textAnchor="middle" fill="#4ade80" fontSize="11.5" fontStyle="italic" pointerEvents="none">.md files persist on disk</text>
          </g>

          {/* Data-flow arrows */}
          <path id="p-in-1" d="M 128,110 L 176,109" fill="none" stroke="#888" strokeWidth="2" strokeOpacity="0.5" markerEnd="url(#arrowGray)"/>
          <path id="p-1-2" d="M 276,109 L 312,109" fill="none" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowOrange)"/>
          <path id="p-2-3" d="M 412,109 L 448,109" fill="none" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowOrange)"/>
          <path id="p-3-4" d="M 548,109 L 584,109" fill="none" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowOrange)"/>
          <path id="p-5-6" d="M 584,249 L 548,249" fill="none" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowOrange)"/>
          <path id="p-6-7" d="M 448,249 L 412,249" fill="none" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowOrange)"/>
          <path id="p-7-out" d="M 312,249 L 132,249" fill="none" stroke="#888" strokeWidth="2" strokeOpacity="0.6" markerEnd="url(#arrowGray)"/>

          {/* Halluc Check → Paper-Reading box: Manhattan route (out, down, in) */}
          <path id="p-4-pr" d="M 684,118 L 762,118 L 762,398 L 692,398"
                fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.75"
                strokeDasharray="7,4" markerEnd="url(#arrowBlue)"/>

          {/* Green MD-store junction node + clean hub connections */}
          <circle cx="744" cy="178" r="11" fill="none" stroke="#4ade80" strokeWidth="1" strokeOpacity="0.4"/>
          <circle cx="744" cy="178" r="6" fill="#4ade80" stroke="#0a0a0a" strokeWidth="1.5"/>
          <path d="M 744,178 C 772,172 788,158 804,150" fill="none" stroke="#4ade80" strokeWidth="1.6" strokeOpacity="0.6" strokeDasharray="4,3"/>
          <path d="M 684,128 C 710,140 730,162 742,173" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.55" strokeDasharray="4,3"/>
          <path d="M 684,232 C 710,220 730,196 742,184" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.55" strokeDasharray="4,3"/>

          {/* Animated particles */}
          {ARCH_PARTICLES.map(p => (
            <circle key={`${p.path}-${p.begin}`} r={p.r} fill={p.fill} filter="url(#particleGlow)">
              <animateMotion dur={p.dur} repeatCount="indefinite" begin={p.begin}>
                <mpath href={`#${p.path}`}/>
              </animateMotion>
            </circle>
          ))}
        </svg>
      </div>

      <DetailBar item={item} attached />
    </div>
  )
}

// ── Voice-flow diagram (Design Philosophy) ──────────────────────────

const VF_NODES = [
  { step: 1, x: 30, w: 110, emoji: '🎤', label: 'Voice', color: '#888', fill: '#88888810' },
  { step: 2, x: 180, w: 135, emoji: '📱', label: 'Telegram channel', color: '#38bdf8', fill: '#38bdf810' },
  { step: 3, x: 355, w: 135, emoji: '🤖', label: 'Claude Code', color: '#f97316', fill: '#f9731610' },
  { step: 4, x: 530, w: 135, emoji: '📝', label: 'Spec .md', color: '#4ade80', fill: '#4ade8010' },
  { step: 5, x: 705, w: 125, emoji: '⚡', label: '/goal trigger', color: '#f97316', fill: '#f9731610' },
  { step: 6, x: 870, w: 100, emoji: '📧', label: 'Inbox', color: '#888', fill: '#88888810' },
]

const VF_PATHS = [
  { id: 'vp-1-2', d: 'M 140,120 L 180,120', stroke: '#888', marker: 'vfArrowGray' },
  { id: 'vp-2-3', d: 'M 315,120 L 355,120', stroke: '#38bdf8', marker: 'vfArrowBlue' },
  { id: 'vp-3-4', d: 'M 490,120 L 530,120', stroke: '#f97316', marker: 'vfArrowOrange' },
  { id: 'vp-4-5', d: 'M 665,120 L 705,120', stroke: '#4ade80', marker: 'vfArrowGreen' },
  { id: 'vp-5-6', d: 'M 830,120 L 870,120', stroke: '#f97316', marker: 'vfArrowOrange' },
]

const VF_PARTICLES = [
  { path: 'vp-1-2', begin: '0s', fill: '#888' },
  { path: 'vp-2-3', begin: '0.4s', fill: '#38bdf8' },
  { path: 'vp-3-4', begin: '0.8s', fill: '#f97316' },
  { path: 'vp-4-5', begin: '1.2s', fill: '#4ade80' },
  { path: 'vp-5-6', begin: '1.6s', fill: '#f97316' },
]

function VoiceFlowDiagram() {
  const [selectedStep, setSelectedStep] = useState(null)
  const item = selectedStep ? V_STEP_DATA[selectedStep] : VF_DEFAULT

  return (
    <div className="ccl-vf max-w-[1100px] mx-auto mt-8 mb-9">
      <div className="w-full" style={{ aspectRatio: '980/240', maxHeight: '240px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 240" preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
          <defs>
            <pattern id="dots-vf" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="0.5" fill="#1a1c2a"/>
            </pattern>
            <filter id="vfGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="vfParticle" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <marker id="vfArrowGray" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#888"/>
            </marker>
            <marker id="vfArrowBlue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#38bdf8"/>
            </marker>
            <marker id="vfArrowOrange" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#f97316"/>
            </marker>
            <marker id="vfArrowGreen" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#4ade80"/>
            </marker>
          </defs>
          <rect width="980" height="240" fill="url(#dots-vf)"/>

          {VF_NODES.map(n => (
            <g key={n.step} className="ccl-node cursor-pointer" onClick={() => setSelectedStep(n.step)}>
              <rect x={n.x} y="90" width={n.w} height="60" rx="12" fill={n.fill} stroke={n.color}
                strokeWidth={selectedStep === n.step ? 3 : 1.5}
                filter={selectedStep === n.step ? 'url(#vfGlow)' : undefined}/>
              <text fontSize="18" x={n.x + n.w / 2} y="118" textAnchor="middle" fill={n.color} pointerEvents="none">{n.emoji}</text>
              <text fontSize="11.5" fontWeight="700" x={n.x + n.w / 2} y="140" textAnchor="middle" fill={n.color} pointerEvents="none">{n.label}</text>
            </g>
          ))}

          {VF_PATHS.map(p => (
            <path key={p.id} id={p.id} d={p.d} fill="none" stroke={p.stroke} strokeWidth="2" markerEnd={`url(#${p.marker})`}/>
          ))}

          {VF_PARTICLES.map(p => (
            <circle key={p.path} r="3" fill={p.fill} filter="url(#vfParticle)">
              <animateMotion dur="2s" repeatCount="indefinite" begin={p.begin}>
                <mpath href={`#${p.path}`}/>
              </animateMotion>
            </circle>
          ))}
        </svg>
      </div>

      <DetailBar item={item} />
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────

export default function ClaudeCodeLM() {
  return (
    <Layout>
      <style>{`
        .ccl-ladder { display: flex; flex-direction: column; position: relative; padding-left: 40px; max-width: 900px; margin: 0 auto; }
        .ccl-spine { position: absolute; left: 58px; top: 0; bottom: 0; width: 3px; background: linear-gradient(to top, #1a1c2a, #f97316); border-radius: 2px; }
        .ccl-rung { display: flex; align-items: stretch; position: relative; transition: all 0.3s ease; cursor: default; }
        .ccl-rung:hover .ccl-rung-main { background: #1e2030; }
        .ccl-rung:hover .ccl-constraint { color: #e0e0e0; }
        .ccl-dot { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 13px; height: 13px; border-radius: 50%; background: #2e3140; border: 2px solid #404560; z-index: 2; transition: all 0.3s ease; }
        .ccl-rung:hover .ccl-dot { border-color: #f97316; background: #f97316; box-shadow: 0 0 8px rgba(249,115,22,0.4); }
        .ccl-rung-main { flex: 1; display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 14px 36px; border-radius: 8px; transition: background 0.3s ease; gap: 16px; }
        .ccl-rung-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
        .ccl-era { font-size: 11px; color: #606580; font-family: 'SF Mono','Cascadia Code','Fira Code',Consolas,monospace; min-width: 70px; flex-shrink: 0; }
        .ccl-name { font-size: 14px; color: #c8c8c8; font-weight: 500; white-space: nowrap; }
        .ccl-constraint { font-size: 12px; color: #606580; font-style: italic; text-align: right; transition: color 0.3s ease; flex-shrink: 0; max-width: 380px; }
        .ccl-highlight .ccl-dot { background: #f97316; border-color: #f97316; box-shadow: 0 0 12px rgba(249,115,22,0.5); width: 15px; height: 15px; }
        .ccl-highlight .ccl-name { color: #f97316; font-weight: 700; font-size: 15px; }
        .ccl-highlight .ccl-constraint { color: #a0a0a0; }
        .ccl-top .ccl-dot { background: #f97316; border-color: #fbbf24; box-shadow: 0 0 18px rgba(249,115,22,0.7); width: 17px; height: 17px; animation: ccl-pulse-dot 2s ease-in-out infinite; }
        .ccl-top .ccl-name { color: #fbbf24; font-weight: 700; font-size: 16px; }
        .ccl-top .ccl-constraint { color: #c8c8c8; font-weight: 500; font-style: normal; }
        @keyframes ccl-pulse-dot {
          0%, 100% { box-shadow: 0 0 12px rgba(249,115,22,0.5); }
          50% { box-shadow: 0 0 24px rgba(249,115,22,0.9); }
        }
        .ccl-arch g.ccl-node:hover rect, .ccl-vf g.ccl-node:hover rect { stroke-width: 2.8; }
        @media (max-width: 700px) {
          .ccl-constraint { display: none; }
          .ccl-rung-main { padding: 10px 12px 10px 30px; }
          .ccl-era { min-width: 50px; font-size: 10px; }
          .ccl-name { font-size: 12px; }
          .ccl-ladder { padding-left: 30px; }
          .ccl-spine { left: 48px; }
          .ccl-dot { left: 8px; }
        }
      `}</style>
      <article className="w-full py-16 px-4">
        <div className="max-w-2xl mx-auto prose-medium">

          {/* Landscape warning — only visible on narrow portrait screens */}
          <div
            className="mb-6 rounded-lg px-4 py-3 text-sm text-center sm:hidden"
            style={{ backgroundColor: '#f9731620', color: '#f97316', border: '1px solid #f9731640' }}
          >
            For the best experience on phone, rotate to <strong>landscape view</strong>
          </div>

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
            <h1>ClaudeCodeLM</h1>
            <p className="text-dark-muted text-lg mt-2">The voice-first research walk had one broken step &mdash; hearing the paper as a podcast. So the podcast engine got built from scratch: grounded, single-narrator, run by a background agent.</p>
            <div className="flex flex-col items-start gap-2.5 mt-6">
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316', border: '1px solid #f9731640' }}>Claude Code</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#f97316b0', border: '1px solid #f9731630' }}>Agentic AI</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8', border: '1px solid #38bdf840' }}>Document Analysis</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#38bdf8a0', border: '1px solid #38bdf825' }}>EdTech</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80', border: '1px solid #4ade8040' }}>AI Startups</span>
                <span className="px-4 py-1.5 rounded-full text-sm" style={{ color: '#4ade80a0', border: '1px solid #4ade8025' }}>NotebookLM Team</span>
              </div>
            </div>
          </section>

          {/* Video: 60-second demo */}
          <section className="mb-12">
            <YouTubeEmbed
              src="https://www.youtube.com/embed/Q_IQ2MiEk_g"
              title="ClaudeCodeLM Demo"
              eyebrow="Watch · 60-second demo"
              caption="From a voice note on a walk to a grounded podcast in your inbox — the whole idea, fast."
            />
          </section>

          {/* Audio: what got built */}
          <section className="mb-16">
            <div
              className="rounded-2xl p-8"
              style={{
                background: 'linear-gradient(135deg, #14172a, #1a1d2e)',
                border: '1px solid #23263a',
                boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <span className="text-sm font-bold uppercase" style={{ color: '#f97316', letterSpacing: '2px' }}>
                  🎤 Listen — What Got Built
                </span>
                <span className="text-[13px]" style={{ color: '#8888aa' }}>
                  Single host · grounded in the paper · shorter than NotebookLM
                </span>
              </div>
              <audio controls preload="metadata" className="w-full outline-none">
                <source src="/claude-code-lm/podcast.mp3" type="audio/mpeg" />
                Your browser doesn't support inline audio. <a href="/claude-code-lm/podcast.mp3">Download the mp3</a>.
              </audio>
              <div className="flex gap-4 mt-3.5 flex-wrap font-mono text-xs" style={{ color: '#606580' }}>
                <span>📚 <strong className="font-normal" style={{ color: '#a0a0a0' }}>Paper</strong>&nbsp;Nakamura &amp; Uhlmann, <em>Global uniqueness for an inverse boundary problem arising in elasticity</em> (Inventiones, 1994)</span>
                <span>🎤 <strong className="font-normal" style={{ color: '#a0a0a0' }}>Voice</strong>&nbsp;Matilda</span>
                <span>🧠 <strong className="font-normal" style={{ color: '#a0a0a0' }}>Model</strong>&nbsp;eleven_v3</span>
                <span>⏱️ <strong className="font-normal" style={{ color: '#a0a0a0' }}>Duration</strong>&nbsp;16:06</span>
                <span>🏷️ <strong className="font-normal" style={{ color: '#a0a0a0' }}>Tags</strong>&nbsp;53 inline audio tags</span>
              </div>
            </div>
          </section>

          {/* Introduction */}
          <section className="mb-12">
            <h2>Introduction</h2>
            <p>
              Somewhere outside, a phone buzzes in a pocket. The person carrying it is walking. They're working on a research project &mdash; not reading it on a screen, not sitting at a desk, just talking through it. A voice note goes out over Telegram. Claude grabs the PDF with one skill, surfaces the section that matters with another, answers a question by quoting the paper's own words back. The whole loop runs from a sidewalk. That part already works.
            </p>
            <p>
              Except for that one thing. The NotebookLM audio podcast &mdash; the two-host conversational explainer of the paper &mdash; is the one piece of the flow with no clean way to ask for it. Vivek can say the words, but it wasn't clear how Claude could turn around and do it at the drop of a hat. And the moment matters more than it sounds. A walking researcher wants to listen to the paper, not just read it. When that request hits a wall, the whole mid-walk rhythm breaks. The natural ask should produce a natural answer. It didn't.
            </p>
            <p>
              So the project went hunting. Agents fanned out across Google's official documentation, Anthropic's, MCP marketplaces, the general web &mdash; looking for any clean endpoint, any official SDK, any community wrapper good enough to install and forget. Google's audio-generation API turned out to be enterprise-only and unreachable from a personal account. The unofficial community wrappers could fire the request but couldn't tell you when the audio was ready. Nothing usable came back. So the project did something honest. It stopped trying to fix the original thing and built a different thing from scratch &mdash; a single-narrator podcast that paraphrases the paper in its own words and checks its substantive claims back against the source. No two-host banter. No guarantee of perfection &mdash; but grounded, and honest about being grounded rather than guessed.
            </p>
            <p>
              What's playing at the top of this page is one of those. Sixteen minutes about a 1994 paper by Nakamura and Uhlmann on inverse elasticity &mdash; proving that the elastic properties inside a solid body are uniquely determined by the measurements you can make on its outer surface alone. The voice is Matilda, an ElevenLabs narrator. One host, not two. Shorter than NotebookLM. It isn't a copy of what was originally wanted &mdash; it turned out to be its own thing. The first time Vivek pressed play on it during a walk, he said it was better than the original.
            </p>
          </section>

          {/* The Abstraction Ladder — intro */}
          <section className="mb-12">
            <h2>The Abstraction Ladder</h2>
            <p>
              Here's the ladder Claude could climb to deliver that NotebookLM podcast on a walk. Five rungs of increasing cleanliness, each one fixing the defect of the rung below it. The top rung &mdash; Level 5 &mdash; is what got built. It only had to exist because the rung directly below it (Level 4) presumes a NotebookLM API or SDK that Vivek can use, and there isn't one.
            </p>
          </section>
        </div>

        {/* Ladder — full width breakout */}
        <div className="mb-6">
          <AbstractionLadder />
          <p className="text-center mt-6 text-xs italic" style={{ color: '#606580' }}>
            Each rung removes the prior rung's defect ↑
          </p>
        </div>

        <div className="max-w-2xl mx-auto prose-medium">
          <section className="mb-12 mt-14">
            <p>Climb the ladder from the bottom up.</p>
            <p>
              <strong>Level 1: Computer Use.</strong> Claude opens NotebookLM in a browser and clicks the buttons by hand &mdash; like a person at a keyboard, except the person is an AI. It works the way watching someone else use your mouse "works": badly. And it's the wrong shape for Claude in the first place.
            </p>
            <p>
              <strong>Level 2: MCP.</strong> Instead of clicking buttons, Claude talks to a small helper program that already knows how to drive NotebookLM behind the scenes. Claude says "make a podcast about this paper" and the helper sends the request. The catch: the request goes out, and then silence. Nothing tells Claude when the audio is actually ready. Claude has to keep checking back, like someone refreshing their inbox.
            </p>
            <p>
              <strong>Level 3: API/SDK + Main Agent.</strong> Same kind of programmatic request, but now Claude itself makes the call. Claude fires the request &mdash; and then it's blocked inside that one call until the audio comes back. Not checking back over and over like Level 2; just stuck holding the line, doing nothing else. That works. But while Claude is held up on that single request, Vivek can't talk to it about anything else. The whole conversation is frozen, waiting on one task.
            </p>
            <p>
              <strong>Level 4: API/SDK + Background Agent.</strong> Same setup, but the checking-back happens off to one side, in a background helper that doesn't need Vivek's attention. The main conversation stays free. The helper waits, fetches the audio when it's done, and drops it in a folder. Twenty minutes later Vivek asks "is it ready?" &mdash; Claude looks, finds it, sends it over. That would be the clean answer.
            </p>
            <p>
              Would be. Level 4 only works if there's a way for software to ask NotebookLM to make a podcast on demand &mdash; a real programmatic door. Vivek doesn't have one. Google's official channel is locked behind an enterprise paywall and isn't reachable from his personal account. The simpler standalone channel was shut down the day before the search began. The community workarounds are fragile and break easily. There's no foundation under Level 4.
            </p>
            <p>
              <strong>Level 5: In-House + Background Agent.</strong> So the project did the next thing: built the podcast itself from scratch, using pieces Vivek already had &mdash; the paper-reading tools, a text-to-speech engine, a hallucination check &mdash; all wrapped in the same background helper from Level 4. What's inside Level 5 is the architecture section below.
            </p>
          </section>

          {/* Architecture header + narrated walkthrough video */}
          <section className="mb-12">
            <h2 className="text-center mb-12">Architecture (Post-Pivot)</h2>
            <YouTubeEmbed
              src="https://www.youtube.com/embed/WaYVJCHWjaI"
              title="ClaudeCodeLM Architecture Explainer"
              eyebrow="Watch · narrated walkthrough"
              caption="The narrated tour of the pipeline — watch it, then explore the interactive diagram below."
            />
          </section>
        </div>

        {/* Architecture diagram — full width breakout */}
        <ArchitectureDiagram />

        <div className="max-w-2xl mx-auto prose-medium">
          <section className="mb-12">
            <p>
              This is Level 5 unpacked, and three principles drive its shape: efficiency (a background agent doing the work in parallel), accuracy (claims grounded in the paper, and honest about it), and scaffolding (the single-host emotional layer). The orange dashed box is the background agent. Inside, a seven-phase pipeline drafts a narrative from the paper, grounds its substantive claims back against the source PDF, layers in ElevenLabs audio tags, and synthesizes the final mp3.
            </p>
            <p>
              The blue dashed box is Vivek's pre-existing paper-reading skill stack &mdash; called from the hallucination-check phase to find verbatim grounding for its claims. The green cylinder on the right is the markdown context store, where every artifact persists as a versioned file.
            </p>
          </section>

          {/* Design Philosophy */}
          <section className="mb-4">
            <h2>Design Philosophy</h2>
            <p>
              The pattern that runs underneath every project on this stack &mdash; including this one &mdash; is the same, and it doesn't begin at a keyboard. It begins out loud. Vivek dictates the project &mdash; usually mid-walk, into Telegram &mdash; in long voice messages that arrive as audio attachments. The voice-message hook transcribes each one on arrival, and over the course of a few exchanges, the raw dictation gets shaped into a precise specification document. Claude probes for missing constraints, surfaces tensions, suggests structure. Vivek redirects, sharpens, corrects. When the conversation has carved out a complete picture &mdash; motivation, scope, phases, exit criteria, cardinal constraints, risks, out-of-scope items &mdash; the result lands on disk as a markdown file: <Mono>problem_statement.md</Mono> for this project, <Mono>roadmap.md</Mono>, <Mono>podcastify-plus-with-eleven-labs.md</Mono>, and so on.
            </p>
            <p>
              Then comes the trigger. One line: <Mono>/goal @&lt;the-document&gt;.md and take ALL DECISIONS AUTONOMOUSLY</Mono>. The agent reads the contract, builds an internal task list, and executes phase by phase without further input. No interactive back-and-forth. No mid-run clarifying questions. Judgment calls get made and documented in the final summary. Vivek walks away. The deliverable lands in his inbox.
            </p>
          </section>
        </div>

        {/* Voice-flow diagram — full width breakout */}
        <VoiceFlowDiagram />

        <div className="max-w-2xl mx-auto prose-medium">
          <section className="mb-12">
            <p>
              This pattern works for a non-obvious reason. The conversation that turns a dictated voice memo into a specification document is itself the highest-leverage work in the whole project. By the time the markdown file is precise enough to fire against, the hard thinking is already done &mdash; the constraints are named, the gates are honest, the scope is bounded. What the agent inherits is execution, which is exactly the kind of work AI agents are good at. The pattern fails when the spec is fuzzy. It succeeds when the spec names the constraints honestly &mdash; including the ones that should kill the project if they don't pan out.
            </p>
            <p>
              This very project is an example. The contract was <Mono>problem_statement.md</Mono>: motivation, the 4-level ladder, Phase 1's branch logic (terminate if nothing surfaces, proceed if something does), Phase 2's two-test plan. When Phase 1 came back with verdict (c), the contract's branch logic said proceed-with-build-it-yourself; the autonomous run took that branch without further input. The voice-shaped, markdown-committed contract <em>is</em> the discipline that keeps the agent honest when the ladder breaks.
            </p>
            <p>
              And the result ships the way every artifact here does &mdash; as a git repository: not a locked product but a malleable blueprint, a Claude Code skill you clone, point Claude at, and reshape to fit your own agents.
            </p>
          </section>

          {/* Video: comprehensive walkthrough */}
          <section className="mb-12">
            <YouTubeEmbed
              src="https://www.youtube.com/embed/xfFaYYOpf0k"
              title="ClaudeCodeLM Comprehensive Walkthrough"
              eyebrow="Watch · the full walkthrough"
              caption="The complete tour in one watch — the demo, a bridge, then a deeper dive into the architecture."
            />
          </section>

          {/* GitHub */}
          <section className="mb-16 text-center">
            <a
              href="https://github.com/VivekKarmarkar/nblm-podcast-api"
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
