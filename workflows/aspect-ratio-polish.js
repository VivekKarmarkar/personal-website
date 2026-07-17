export const meta = {
  name: 'aspect-ratio-polish',
  description: 'Lean CI/CD loop: audit live pages at 4 viewports, add missing landscape/fullscreen warnings + fix real breakage, commit → push → redeploy → re-audit',
  whenToUse: 'After deploying page changes, to confirm every target route renders golden across phone portrait/landscape and laptop split/full — and auto-fix the gaps. Pass routes via args; keeps agent count minimal to conserve usage credits.',
  phases: [
    { title: 'Audit', detail: 'one agent per route — 4 viewports on the live site' },
    { title: 'Fix', detail: 'single agent applies targeted fixes + commits + pushes' },
    { title: 'Reverify', detail: 'wait for redeploy, re-audit only the pages that had issues' },
  ],
}

// args: {
//   routes?: string[]        // routes to audit (default: the batch-01 pages + landing)
//   maxFixRounds?: number    // default 1 — bounded fix→reverify loops
//   assumeFresh?: boolean    // default true — the caller ensured the live site already reflects the latest push
// }
const ROOT = '/home/vivekkarmarkar/Python Files/personal-website'
const CONTEXT = `${ROOT}/porting_context.md`
const LIVE = 'https://vivekkarmarkar.vercel.app'

const PLAN = (typeof args === 'string') ? JSON.parse(args) : (args || {})
const ROUTES = (PLAN.routes && PLAN.routes.length) ? PLAN.routes : ['/', '/agentic-algorithm-discovery', '/claude-code-lm']
const MAX_FIX_ROUNDS = PLAN.maxFixRounds != null ? PLAN.maxFixRounds : 1

// Vivek's aspect-ratio contract (porting_context.md invariant 10), encoded once:
const CRITERIA = `Test these FOUR viewports and judge each:
- Laptop full 1440x900: everything nice — no horizontal body scroll, no duplicate titles, embeds render, interactive diagrams work.
- Laptop split ~720x900: must still look nice (reflow cleanly). If the page genuinely breaks at this width AND relies on a fullscreen experience, a "for the best experience, use full screen" notice should be present; if it reflows fine, no notice needed.
- Phone landscape 932x430: the intended phone experience — beautiful, correct aspect ratios, any YouTube/iframe frames fully visible, tap targets usable.
- Phone portrait 430x932: MUST (a) render acceptably with NO horizontal body overflow / crowding, AND (b) show the site-standard "rotate to landscape" warning banner (orange #f97316 on #f9731620, sm:hidden). The banner is guidance, not an excuse for a broken portrait layout — both are required.`

const AUDIT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['route', 'overall', 'viewports', 'fixable_issues'],
  properties: {
    route: { type: 'string' },
    overall: { type: 'string', enum: ['golden', 'issues'] },
    viewports: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['viewport', 'verdict', 'note'],
        properties: {
          viewport: { type: 'string' },
          verdict: { type: 'string', enum: ['pass', 'fail'] },
          note: { type: 'string' },
        },
      },
    },
    fixable_issues: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['description', 'file_hypothesis', 'severity'],
        properties: {
          description: { type: 'string' },
          file_hypothesis: { type: 'string', description: 'the src file + region most likely responsible' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          suggested_fix: { type: 'string' },
        },
      },
    },
  },
}

const auditRoute = (route, round) => agent(
  `Audit ONE page of the live personal website across aspect ratios. Read-only (browser + repo reads); do NOT edit files.

Live URL: ${LIVE}${route}
Round: ${round}

1. Read ${CONTEXT} invariant 10 (the aspect-ratio contract) and §Site Conventions (the rotate-to-landscape banner markup lives on ClaudeCodeOS/RCP/ClaudeCodeLM pages).
2. Load a browser (ToolSearch for the Playwright MCP tools: mcp__plugin_playwright_playwright__browser_navigate/browser_resize/browser_take_screenshot/browser_snapshot — or the claude-in-chrome tools as fallback). Be economical: navigate with a cache-buster (${LIVE}${route}?v=<round>), then resize + one screenshot per viewport, four total. CONFIRM the loaded URL path is exactly ${route} before you judge anything — if you landed on a different page, re-navigate; never report a viewport verdict for the wrong route.
${CRITERIA}
3. For any FAIL, name the concrete defect and your best guess at the responsible src file/region (grep the repo to confirm). A missing rotate-to-landscape banner on a phone-portrait page is a FAIL. Horizontal overflow/crowding is a FAIL.
4. overall = 'golden' only if all four viewports pass.

Return via StructuredOutput.`,
  { label: `audit${round > 1 ? '-r' + round : ''}:${route === '/' ? 'home' : route.replace(/\//g, '')}`, phase: round > 1 ? 'Reverify' : 'Audit', schema: AUDIT_SCHEMA }
)

// ---------- Audit ----------
// SEQUENTIAL, not parallel: audit agents share one Chrome/Playwright instance and
// collide on the active tab when run concurrently (observed 2026-07-17 — the "/" agent
// got navigated onto /rcp by a peer and mis-reported its route). One-at-a-time is slower
// but correct, and keeps concurrent token spikes down too.
phase('Audit')
let audits = []
for (const r of ROUTES) { const a = await auditRoute(r, 1); if (a) audits.push(a) }

let round = 1
while (round <= MAX_FIX_ROUNDS) {
  const failing = audits.filter(a => a.overall === 'issues')
  if (failing.length === 0) { log(`All ${audits.length} routes golden — no fixes needed`); break }
  log(`Round ${round}: ${failing.length} route(s) with issues — fixing`)

  // ---------- Fix (single agent, owns edits + commit + push) ----------
  phase('Fix')
  const fixResult = await agent(
    `Fix concrete aspect-ratio defects on the personal website, then commit and push. Targeted edits only — do NOT disturb pages/components that passed.

Defects to fix (by route):
${JSON.stringify(failing.map(f => ({ route: f.route, issues: f.fixable_issues })), null, 2)}

Rules:
1. Read ${CONTEXT} first (invariant 10 + Site Conventions for the exact rotate-to-landscape banner markup — copy it verbatim from an existing page).
2. Minimal, additive fixes: add missing warning banners, fix overflow/crowding (e.g. overflow-x-auto + min-width, responsive stacking). NEVER delete features to silence a failure; NEVER touch files unrelated to these defects.
3. Run 'npm run build' — must pass.
4. Commit (read ~/.claude/skills/gitcommit/SKILL.md for conventions) with TARGETED git add of only the files you changed — the working tree has unrelated changes that must stay unstaged. End the message with:
Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
5. Push (per ~/.claude/skills/gitpush/SKILL.md). The push auto-deploys ${LIVE}.
6. Report the pre-push live bundle hash (curl ${LIVE}, grep '/assets/index-*.js') so the reverify step can detect the fresh deploy, plus the files you changed.

Return a short text summary INCLUDING the line: PREPUSH_BUNDLE=<hash>`,
    { label: `fix-r${round}`, phase: 'Fix' }
  )
  const m = (fixResult || '').match(/PREPUSH_BUNDLE=(\S+)/)
  const preBundle = m ? m[1] : null

  // ---------- Wait for redeploy ----------
  phase('Reverify')
  await agent(
    `Confirm the new Vercel deploy of ${LIVE} is live before re-auditing. Vercel builds take ~1-3 min.
Poll: fetch ${LIVE}, extract the hashed JS bundle path (/assets/index-*.js). ${preBundle ? `The pre-push bundle was ${preBundle}; wait until it CHANGES.` : 'Wait ~120s for the rebuild.'} Retry every ~30s (bash sleep) up to 6 minutes. Return a one-line confirmation of the new bundle hash (or timeout).`,
    { label: `deploy-wait-r${round}`, phase: 'Reverify' }
  )

  // ---------- Re-audit only the previously-failing routes (sequential — see Audit note) ----------
  const reaudited = []
  for (const f of failing) { const a = await auditRoute(f.route, round + 1); if (a) reaudited.push(a) }
  const stillGolden = audits.filter(a => a.overall === 'golden')
  audits = [...stillGolden, ...reaudited]
  round++
}

const remaining = audits.filter(a => a.overall === 'issues')
return {
  routes: ROUTES,
  golden: remaining.length === 0,
  audits,
  remaining_issues: remaining.flatMap(a => a.fixable_issues.map(i => ({ route: a.route, ...i }))),
}
