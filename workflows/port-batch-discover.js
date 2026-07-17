export const meta = {
  name: 'port-batch-discover',
  description: 'Stage A: inventory a porting batch, classify each site against porting_context.md, draft proposals + a minimal human interview',
  whenToUse: 'Run first, on any reference-site folder (single site or whole batch). Its output is reviewed with Vivek before running port-batch-execute.',
  phases: [
    { title: 'Inventory', detail: 'enumerate the batch and parse the folder-name nomenclature' },
    { title: 'Analyze', detail: 'one agent per reference site' },
    { title: 'Propose', detail: 'merge into a proposal sheet + minimal interview' },
  ],
}

// args: { batchPath: string }  — absolute path to a batch folder OR a single reference-site folder.
const ROOT = '/home/vivekkarmarkar/Python Files/personal-website'
const CONTEXT = `${ROOT}/porting_context.md`
const BATCH = args && args.batchPath ? args.batchPath : `${ROOT}/summer-2026-batch reference project website folder`

// ---------- Phase 1: Inventory ----------
phase('Inventory')

const INVENTORY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['sites', 'nomenclature_notes'],
  properties: {
    sites: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['sitePath', 'projectName', 'lineHint'],
        properties: {
          sitePath: { type: 'string', description: 'absolute path to the reference-site folder (the one containing index.html or the raw assets)' },
          projectName: { type: 'string', description: 'best-guess human project name from folder names / README / index.html title' },
          lineHint: {
            type: 'object',
            additionalProperties: false,
            required: ['raw', 'lineId', 'isNewLine'],
            properties: {
              raw: { type: 'string', description: 'the verbatim folder-name label, e.g. "w-line (writing, new)"' },
              lineId: { type: 'string', description: 'single-letter line id parsed from the label (uppercase), or "?" if absent' },
              isNewLine: { type: 'boolean', description: 'true if the label marks the line as new/inaugural or the letter does not exist in src/data/lines.js' },
              lineName: { type: 'string', description: 'line name parsed from the label if present, e.g. "writing"' },
            },
          },
          notes: { type: 'string', description: 'anything else the folder structure signals (batch grouping, ordering, sibling files)' },
        },
      },
    },
    nomenclature_notes: { type: 'string', description: 'how the batch is organized overall; any labels you could not confidently parse' },
  },
}

const inventory = await agent(
  `Enumerate a batch of reference project websites for porting. Read-only.

Batch folder: ${BATCH}

1. Recursively list the folder (bash: find, 3-4 levels deep). Vivek labels folders intentionally — treat names like "d-line (old)" (existing line) and "w-line (writing, new)" (inaugural line named Writing) as signal. A "batch-NN" level groups sites; a leaf "* reference project website" folder is one site. The batch may also BE a single site folder directly.
2. For each site, peek at README.md and/or the <title>/h1 of index.html for the project name. If a folder has no index.html at all (raw assets only), it is still a site — note that in notes.
3. Also read ${ROOT}/src/data/lines.js (just the line ids) to decide isNewLine.
4. Empty folders (e.g. an empty batch-02) are not sites — mention them in nomenclature_notes.

Return via StructuredOutput.`,
  { label: 'inventory', phase: 'Inventory', schema: INVENTORY_SCHEMA }
)

if (!inventory || !inventory.sites || inventory.sites.length === 0) {
  return { error: 'No sites found in batch', batchPath: BATCH, inventory }
}
log(`Found ${inventory.sites.length} site(s) to port`)

// ---------- Phase 2: Analyze (parallel per site) ----------
const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['projectName', 'sitePath', 'contents', 'proposed_pattern', 'pattern_confidence', 'proposed_station', 'assets', 'risks'],
  properties: {
    projectName: { type: 'string' },
    sitePath: { type: 'string' },
    contents: { type: 'string', description: '3-5 sentences: what the reference contains top-to-bottom — sections, interactive elements, media, approximate size' },
    proposed_pattern: { type: 'string', description: 'Pattern letter from porting_context.md (A/B/C/D/...), or "NOVEL: <description>" if none fits — do NOT force-fit' },
    pattern_confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    pattern_rationale: { type: 'string', description: 'one sentence: why this pattern' },
    proposed_station: {
      type: 'object',
      additionalProperties: false,
      required: ['id', 'name', 'description'],
      properties: {
        id: { type: 'string', description: 'kebab-case station id' },
        name: { type: 'string', description: 'display name (puns in the spirit of existing stations are welcome but flag them as a taste call)' },
        description: { type: 'string', description: 'one-line station description for stations.js' },
        tagline: { type: 'string', description: 'hero tagline for the page' },
        tags: { type: 'array', items: { type: 'string' }, description: 'proposed tag pills (concept-grouped), or empty if tags feel not relevant (Caudio precedent)' },
      },
    },
    assets: { type: 'string', description: 'what must move to public/ (and what should be pruned); note PDFs (gitignore negation needed), audio, data files, CDN deps' },
    risks: { type: 'array', items: { type: 'string' }, description: 'technical watch-outs for the port (solve-ourselves items, NOT interview questions)' },
  },
}

phase('Analyze')
const analyses = await parallel(inventory.sites.map(s => () =>
  agent(
    `Analyze ONE reference site to plan its port into the React personal website. Read-only.

Site: ${s.projectName} at "${s.sitePath}"
Line hint from folder label: ${JSON.stringify(s.lineHint)}

1. FIRST read ${CONTEXT} — it defines the pattern taxonomy (A/B/C/D), invariants, conventions, and precedent taste calls. It is the source of truth; do not invent your own porting rules.
2. Read the site's README.md if present, then index.html (in chunks if large — you need full section structure, not every byte of inline JS). If the folder is assets-only (no HTML), that signals Pattern D.
3. Inventory assets (images/audio/pdf/data/js) and note pruning candidates and .gitignore implications.
4. Propose the pattern per the taxonomy and the A-vs-C guidance. If genuinely ambiguous or novel, say so honestly — pattern_confidence low + rationale.
5. Draft the station identity. Look at ${ROOT}/src/data/stations.js entries for tone (short, punchy descriptions).

Return via StructuredOutput.`,
    { label: `analyze:${s.projectName}`, phase: 'Analyze', schema: ANALYSIS_SCHEMA }
  )
))

// ---------- Phase 3: Propose (barrier: needs ALL analyses for line grouping + question dedup) ----------
const PROPOSAL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['proposal_sheet_md', 'questions', 'auto_inferred', 'new_lines'],
  properties: {
    proposal_sheet_md: { type: 'string', description: 'Phone-readable markdown proposal: one short block per site (pattern, station id/name, line, one-line rationale) + one block per new line (full drafted identity). Concise — Vivek reads this on a phone.' },
    new_lines: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'name', 'fullName', 'description', 'direction', 'colorHex', 'lineOrderPosition', 'arrivalTime'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          fullName: { type: 'string' },
          description: { type: 'string' },
          direction: { type: 'string' },
          colorHex: { type: 'string', description: 'MTA-palette color not colliding with existing lines' },
          colorName: { type: 'string', description: 'e.g. mta-brown' },
          lineOrderPosition: { type: 'string', description: 'where in lineOrder and why, e.g. "after I, before G"' },
          arrivalTime: { type: 'number', description: 'proposed ArrivalBoard minutes — a career statement (see porting_context.md), MUST be confirmed by Vivek' },
          bulletTextColor: { type: 'string', description: 'black or white, by contrast on colorHex' },
          rationale: { type: 'string' },
        },
      },
    },
    questions: {
      type: 'array',
      maxItems: 10,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['q', 'default'],
        properties: {
          q: { type: 'string', description: 'ONE sentence, high-level, zero technical jargon' },
          default: { type: 'string', description: 'the proposed answer if Vivek just says yes' },
          why: { type: 'string', description: 'one short clause on why this is his call' },
        },
      },
      description: 'ONLY load-bearing decisions that are genuinely Vivek\'s (taste, identity, irreversibles), produced by the information-saturation pipeline in porting_context.md §Interview Protocol — no arbitrary count cap; minimize questions subject to maximizing information saturation. Everything else: infer and list in auto_inferred.',
    },
    auto_inferred: { type: 'array', items: { type: 'string' }, description: 'decisions made by judgment that he can veto but need not read — one line each' },
  },
}

phase('Propose')
const proposal = await agent(
  `Synthesize a porting-batch proposal. Read-only.

Site analyses (from parallel analysts):
${JSON.stringify(analyses.filter(Boolean), null, 2)}

Line hints from the batch inventory:
${JSON.stringify(inventory.sites.map(s => ({ project: s.projectName, lineHint: s.lineHint })), null, 2)}

1. FIRST read ${CONTEXT} — especially the Interview Protocol and Site Conventions sections. Obey them strictly.
2. Read ${ROOT}/src/data/lines.js and ${ROOT}/src/data/stations.js fully, and skim ${ROOT}/src/components/ArrivalBoard.jsx for how arrival times are declared.
3. For each site: finalize the proposed line placement. For any NEW line, draft its complete identity (all fields) using existing lines as the style guide.
4. Study inauguration commits d Train 5d1c7a4 and I Train 5eabbef (git show --stat) to know the full blast radius of a new line — reflect anything surprising in the proposal sheet, not in the questions.
5. Produce the interview per the Interview Protocol's information-saturation pipeline: (a) draft the FULL candidate set of decisions that are genuinely Vivek's (new-line arrival time and board position are ALWAYS his; station-name puns and tag opt-outs are taste); (b) pruning transform — merge overlapping, drop anything inferable (those become auto_inferred lines); (c) tonality transform — one sentence each, high-level, empathetic, zero jargon; (d) final numerical sanity check. No hard cap: minimize count subject to information saturation. Each question ships with a default so "yes to all" is a complete answer.

Return via StructuredOutput.`,
  { label: 'propose', phase: 'Propose', schema: PROPOSAL_SCHEMA }
)

return {
  batchPath: BATCH,
  inventory,
  analyses: analyses.filter(Boolean),
  proposal,
}
