export const meta = {
  name: 'port-batch-execute',
  description: 'Stage B: port an approved batch of reference sites, wire routing/lines, verify, append learnings to porting_context.md, commit and push',
  whenToUse: 'Run ONLY after port-batch-discover output has been reviewed with Vivek and his interview answers are merged into the plan passed as args.',
  phases: [
    { title: 'Port', detail: 'one agent per site — disjoint files only' },
    { title: 'Wire', detail: 'single agent for shared files (routes, stations, lines, board, map)' },
    { title: 'Verify', detail: 'build + per-site fidelity checks' },
    { title: 'Learn', detail: 'append case notes to porting_context.md' },
    { title: 'Commit', detail: 'targeted commit and push' },
  ],
}

// args: {
//   date: 'YYYY-MM-DD',                     // stamped into case notes (scripts cannot call Date)
//   sites: [{
//     projectName, sitePath, pattern,       // from approved Stage A proposal
//     station: { id, name, description, tagline, tags },
//     lineIds: ['D'],                       // line membership (multiple = transfer station, dual badges)
//     notes,                                // any per-site instructions incl. Vivek's answers
//   }],
//   newLines: [{ id, name, fullName, description, direction, colorHex, colorName,
//                lineOrderPosition, arrivalTime, bulletTextColor }],   // [] if none
// }
const ROOT = '/home/vivekkarmarkar/Python Files/personal-website'
const CONTEXT = `${ROOT}/porting_context.md`

if (!args || !args.sites || args.sites.length === 0) throw new Error('args.sites is required — pass the approved Stage A plan')
const NEW_LINES = args.newLines || []
const DATE = args.date || 'unknown-date'

// ---------- Phase 1: Port (parallel, disjoint file sets) ----------
phase('Port')

const PORT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['station_id', 'status', 'files_created', 'pattern_used', 'deviations', 'learnings'],
  properties: {
    station_id: { type: 'string' },
    status: { type: 'string', enum: ['ported', 'blocked'] },
    files_created: { type: 'array', items: { type: 'string' }, description: 'repo-relative paths of every file created (page, public/ assets, etc.)' },
    pattern_used: { type: 'string' },
    deviations: { type: 'array', items: { type: 'string' }, description: 'anywhere you departed from porting_context.md and why' },
    learnings: { type: 'array', items: { type: 'string' }, description: 'raw material for the case note: new elements, surprises, judgment calls' },
    blocked_reason: { type: 'string' },
  },
}

const ported = await parallel(args.sites.map(s => () =>
  agent(
    `Port ONE reference site into the React personal website. You may create files but MUST NOT touch shared files.

Approved plan for this site:
${JSON.stringify(s, null, 2)}
New lines being inaugurated in this batch (badge colors/labels you may need): ${JSON.stringify(NEW_LINES)}

Rules of engagement:
1. FIRST read ${CONTEXT} in full — patterns, invariants, conventions. It is the law. Follow the pattern assigned in the plan (${s.pattern}); if reality on the ground contradicts the plan, do the closest faithful thing and record it in deviations (do NOT stop to ask).
2. Read the reference site fully, and read ONE existing ported page of the same pattern as your template (case notes in the context file name them).
3. Create: src/pages/<StationName>.jsx and any public/<station>/ assets, per the pattern. Copy assets byte-identical, prune unused, preserve directory structure. If shipping PDFs, note the .gitignore negation in learnings (the Wire agent applies it).
4. FORBIDDEN files (the Wire agent owns them): src/App.jsx, src/data/stations.js, src/data/lines.js, src/components/* (Layout, ArrivalBoard, Story...), src/pages/Home.jsx, .gitignore, porting_context.md. Your page must import only what exists.
5. Badges: render the correct train badge(s) for lineIds ${JSON.stringify(s.lineIds)} using colors/direction from src/data/lines.js (or from the newLines data above if the line is being inaugurated in this batch).
6. Do not run git. Do not run npm run build (the Verify phase does).

Return via StructuredOutput.`,
    { label: `port:${s.station.id}`, phase: 'Port', schema: PORT_SCHEMA }
  )
))

const okPorts = ported.filter(Boolean).filter(p => p.status === 'ported')
log(`${okPorts.length}/${args.sites.length} sites ported`)
if (okPorts.length === 0) return { error: 'All ports failed or blocked', ported }

// ---------- Phase 2: Wire (single agent, owns the shared files) ----------
phase('Wire')

const WIRE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['status', 'files_modified', 'notes'],
  properties: {
    status: { type: 'string', enum: ['wired', 'partial'] },
    files_modified: { type: 'array', items: { type: 'string' } },
    notes: { type: 'array', items: { type: 'string' }, description: 'anything left undone or needing eyes (e.g. subway-map SVG geometry needing a design decision)' },
  },
}

const wired = await agent(
  `Wire newly ported stations (and any inaugural lines) into the site's shared files. You own exactly the files the port agents were forbidden to touch.

Ported stations (files already created):
${JSON.stringify(okPorts, null, 2)}
Approved station identities: ${JSON.stringify(args.sites.map(s => ({ station: s.station, lineIds: s.lineIds })), null, 2)}
New lines to inaugurate: ${JSON.stringify(NEW_LINES, null, 2)}

1. FIRST read ${CONTEXT} — Site Conventions section especially.
2. For each station: add the route in src/App.jsx (lazy/import style matching existing), the entry in src/data/stations.js (match tone and field shape of neighbors), and the station id into each line's array in src/data/lines.js (position it sensibly within the line's narrative order).
3. For each NEW line: study the inauguration commits (git show 5d1c7a4, git show 5eabbef) to enumerate the full blast radius — lines.js entry + lineOrder, ArrivalBoard, landing page (Home.jsx / Story.jsx / map), bullet text color. Apply the approved identity exactly (arrival time and colors are Vivek-approved — do not second-guess). If the subway-map visual needs SVG geometry you cannot confidently derive, wire everything else and record it in notes rather than guessing badly.
4. If any port shipped PDFs under public/, add the targeted .gitignore negation (!public/<app>/*.pdf).
5. Do not run git commit. You may run 'npx vite build' briefly ONLY to sanity-check imports resolve; the Verify phase owns real verification.

Return via StructuredOutput.`,
  { label: 'wire', phase: 'Wire', schema: WIRE_SCHEMA }
)

// ---------- Phase 3: Verify (build gate, then parallel fidelity checks) ----------
phase('Verify')

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['build_passed', 'summary'],
  properties: {
    build_passed: { type: 'boolean' },
    summary: { type: 'string', description: 'if failed: the error and what you fixed or could not fix' },
    files_fixed: { type: 'array', items: { type: 'string' } },
  },
}

let build = null
for (let attempt = 1; attempt <= 3; attempt++) {
  build = await agent(
    `Run 'npm run build' in ${ROOT}. If it fails, diagnose and FIX the errors (imports, syntax, JSX) with minimal edits — never delete features to make it compile — then re-run until it passes or you are truly stuck. Attempt ${attempt} of 3. Return via StructuredOutput.`,
    { label: `build-check:${attempt}`, phase: 'Verify', schema: BUILD_SCHEMA }
  )
  if (build && build.build_passed) break
  log(`Build attempt ${attempt} failed: ${build ? build.summary : 'agent error'}`)
}

const VERIFY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['station_id', 'verdict', 'checklist_failures', 'fidelity_notes'],
  properties: {
    station_id: { type: 'string' },
    verdict: { type: 'string', enum: ['pass', 'issues'] },
    checklist_failures: { type: 'array', items: { type: 'string' } },
    fidelity_notes: { type: 'array', items: { type: 'string' }, description: 'content present in the reference but missing/wrong in the port, or vice versa' },
  },
}

const verifications = build && build.build_passed
  ? await parallel(args.sites.map((s, i) => () =>
      agent(
        `Verify one ported station against its reference and the checklist. Read-only except you may run the dev server / vite preview to look at the page.

Station: ${JSON.stringify(s.station)} (pattern ${s.pattern})
Reference: ${s.sitePath}
Port result: ${JSON.stringify(ported[i])}

1. Read ${CONTEXT} §Invariants (the verification checklist is item 9).
2. Fidelity: diff the reference's section structure/prose against the ported page (and public/ copy if iframed) — flag dropped content that the pattern does not justify dropping.
3. Checklist: duplicate titles, iframe scrollbar, background seams, tag row overflow, embed containers, diagram interactivity, asset paths resolve (check the actual files exist under public/).
4. If you can serve and screenshot the page (npx vite preview or the Playwright/Chrome MCP tools via ToolSearch), do it; if not, verify statically and say so in fidelity_notes.

Return via StructuredOutput.`,
        { label: `verify:${s.station.id}`, phase: 'Verify', schema: VERIFY_SCHEMA }
      )
    ))
  : []

// ---------- Phase 4: Learn (append-only update to the weights) ----------
phase('Learn')

const LEARN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['case_notes_appended', 'new_patterns_recorded'],
  properties: {
    case_notes_appended: { type: 'array', items: { type: 'string' } },
    new_patterns_recorded: { type: 'array', items: { type: 'string' } },
  },
}

const learned = await agent(
  `Update ${CONTEXT} per its Self-Update Contract. APPEND-ONLY for case notes; never rewrite existing entries.

Batch date: ${DATE}
Port results: ${JSON.stringify(ported.filter(Boolean), null, 2)}
Wire result: ${JSON.stringify(wired)}
Verifications: ${JSON.stringify(verifications.filter(Boolean), null, 2)}
New lines inaugurated: ${JSON.stringify(NEW_LINES.map(l => l.id))}

1. Append one case note per ported station using the template in §Case Notes (pattern, why, deviations, new elements, taste calls, verification outcome).
2. If any port used a genuinely new pattern, add it to §The Pattern Taxonomy with the next letter and a "when" rule.
3. Update §Unsaturated Territory: remove what this batch saturated, add what it revealed.
4. If a line was inaugurated, record its identity decisions (arrival time rationale etc.) in §Site Conventions.

Return via StructuredOutput.`,
  { label: 'learn', phase: 'Learn', schema: LEARN_SCHEMA }
)

// ---------- Phase 5: Commit (targeted — never sweep unrelated working-tree changes) ----------
phase('Commit')

const COMMIT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['committed', 'pushed', 'commit_messages'],
  properties: {
    committed: { type: 'boolean' },
    pushed: { type: 'boolean' },
    commit_messages: { type: 'array', items: { type: 'string' } },
    problems: { type: 'string' },
  },
}

const commit = await agent(
  `Commit and push the batch. TARGETED adds only — the working tree may contain unrelated changes that must NOT be swept in.

Files created by ports: ${JSON.stringify(okPorts.flatMap(p => p.files_created))}
Files modified by wiring: ${JSON.stringify(wired ? wired.files_modified : [])}
Also include: porting_context.md (updated by the Learn phase).

1. git status first. git add ONLY the listed paths (plus .gitignore if wiring modified it). Leave everything else untracked/unstaged.
2. Match the repo's commit-message style (git log --oneline -15): short imperative subject lines. One commit per station plus one for wiring/inauguration is the house style; a single batch commit is acceptable if cleaner. porting_context.md goes with the final commit.
3. End each commit message body with:
Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
4. git push. Report exactly what was committed and pushed.

Return via StructuredOutput.`,
  { label: 'commit', phase: 'Commit', schema: COMMIT_SCHEMA }
)

return {
  ported,
  wired,
  build,
  verifications,
  learned,
  commit,
}
