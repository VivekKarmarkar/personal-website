# Porting Context

**The learned weights of the porting system.** The porting workflows (`workflows/port-batch-discover.js`, `workflows/port-batch-execute.js`) are the fixed architecture; this file is what they learn. Every workflow run **reads this file first** and **appends what it learned last**. Case notes are append-only — never rewrite history. Seeded 2026-07-17 from a 7-agent forensic comparison of every reference→ported pair (raw data: `workflows/data/porting-forensics-2026-07-17.json`).

The original `/port-reference-site` skill (frozen at the first 2 ports) remains untouched per the cardinal rule; its mechanics are absorbed here.

---

## The Pattern Taxonomy

Five porting patterns observed so far. New patterns get the next letter — do not force-fit a novel reference into these.

### Pattern A — Full Native Rebuild
**When:** content-only reference (prose + diagrams + media embeds), no complex app, and the station deserves flagship treatment.
**Examples:** WONYP, Professor Claude.
- Everything becomes React JSX. Prose carried verbatim.
- Interactive vanilla-JS SVG diagrams are **re-implemented**: `selectStep()` DOM mutation → `useState` + conditional props; hand-written `<g>` node blocks → data arrays mapped in JSX; SMIL `<animateMotion>` particles carried straight into JSX unchanged.
- `STEP_DATA` lifted to a module constant, typically **enriched** (per-step `color` field tinting the detail bar — beyond parity, not just translation).
- Reusable `YouTubeEmbed` component for multi-video pages (Professor Claude has 4 embeds).

### Pattern B — Split Port (app iframed, writeup rebuilt)
**When:** the reference contains a real interactive app (canvas, ES modules, audio engine) that cannot become React, plus a writeup.
**Example:** Dancer Claude.
- App extracted to `public/<station>-app/`, index.html stripped to just the app (529 → 92 lines), two-line CSS surgery: `min-height: 100vh` → `auto`, background → site black.
- Writeup below rebuilt natively as React sections (Pattern A treatment).
- Unused assets pruned (10 video files deliberately not copied — asset copy is selective, not wholesale).

### Pattern C — Whole-Site Iframe
**When:** the reference is a large, coherent, self-contained site whose entire body should be preserved (data portraits, protocol docs, long writeups). The dominant pattern for I-Train ports.
**Examples:** Claude Code OS (17,500px), RCP (8,000px), VM Claude (7,000px).
- The ENTIRE reference site copied to `public/<station>-app/`; React rebuilds **only the hero**.
- Hero excised from the copy with an explanatory comment (`<!-- 1. HERO (removed for iframe embed) -->`); next section gets inline `padding-top: 40px` to compensate.
- Seamless-scroll technique: giant **fixed** px height + `scrolling="no"` + body retinted `#0f1019` → `#0a0a0a` so the iframe reads as native page flow.
- ⚠️ JS `onLoad` auto-resize was tried and **reverted** (crashed on phone rotation, commit d8ac629). Use fixed heights, tuned via screenshots.
- CDN deps (D3, Google Fonts) retained inside the iframe — not vendored. Runtime `fetch()` of data.json works fine from `public/`.
- React-side chrome deferred to the iframe: don't duplicate GitHub footers etc. — the iframe owns the page furniture.

### Pattern D — Asset-Only Authoring
**When:** no reference site exists — just raw media/data.
**Example:** Claude Caudio (four mp3s, nothing else).
- Template comes from **inside the repo** (Caudio cloned SunoSongs.jsx player, recolored G-purple → E-green).
- 100% of copy authored fresh; filesystem order replaced by curated pedagogical order; snake_case filenames → display titles.
- Source directory hierarchy preserved under `public/` and surfaced as information architecture ("MODULE 01: Core Concepts" — future modules = new folders).
- Per-item `<a download>` buttons for offline use.

### Pattern E — Essay / Position-Paper Port (Pattern A mechanics + scholarly furniture)
**When:** the reference is a reading-length essay or position paper with scholarly apparatus — abstract, numbered sections, in-text citations, footnotes, a references list, byline/dateline. The W-line native format.
**Example:** Agentic Algorithm Discovery (first W-line station, invented here 2026-07-17).
- Mechanically identical to Pattern A (native rebuild, verbatim prose, diagrams re-implemented on `useState`, SMIL particles carried unchanged). What's new is the **furniture set**: abstract card (`#161822` bg, 3px orange left border, uppercase small-caps label), LaTeX-style numbered sec-headers (orange number + `#23263a` bottom rule), bracketed in-text citation markers, footnote block, numbered references list with live hrefs, and a GitHub colophon carried as content-bearing provenance.
- **Hero gains a byline/dateline slot** between tagline and tag pills — author line (`#d0d0d0`) over date (`#8888aa`).
- Hash-anchor citations without react-router support: Cite components `preventDefault` + `scrollIntoView({behavior:'smooth'})` + `scrollMarginTop`, with a page-scoped highlight class toggled via DOM as the `:target`-equivalent. Keep diagram selection state component-local so cite highlights survive re-renders.
- Prefix ALL SVG ids (defs, filters, markers, mpath paths) with a page-unique prefix — mpath `href` / filter `url()` collide otherwise.
- Page-scoped `<style>` is required: `.prose-medium a` (0,1,1 specificity) beats class-only link colors — write cite/reflink rules as `.prose-medium a.<prefix>-cite`. This recurs on any essay nested in prose-medium.
- **Verbatim fidelity is machine-verified, not eyeballed:** scratchpad diff script (strip tags, decode HTML entities + JS `\u{...}` escapes, collapse whitespace) over every paragraph, reference entry, href, SVG label, and stepData string. Port and verify agents each wrote one independently on AAD — standard for all essay ports.
- ⚠️ Carry the reference's `@media` rules into the scoped style block, not just desktop CSS — AAD dropped a 640px detail-bar stack and failed the phone-portrait check.
- Body prose still goes in site `prose-medium` (invariant 7); the essay furniture keeps reference-exact sizes/colors.

### Choosing between A and C (open taste question)
Professor Claude (native, A) and VM Claude (iframed, C) are structurally similar references — the taxonomy drifted toward C over time (faster, preserves fidelity). Current default: **C for I-Train-style long writeups, A for flagship content pages on audience-facing lines**. When ambiguous, this is a legitimate (single, high-level) interview question.

---

## Invariants (saturated — held across all 7 ports)

1. **Hero always excised** from the source and rebuilt natively: train badge(s) + left-aligned `h1` + `text-dark-muted` tagline + optional tag pills, inside a `max-w-2xl prose-medium` column, wrapped in the site `Layout`.
2. **Routing wiring is always identical:** route in `src/App.jsx`, station entry in `src/data/stations.js`, station id in the line's array(s) in `src/data/lines.js`. Cross-line stations appear in multiple arrays → transfer stations, and get **dual badges** (D+I Professor Claude, E+I Caudio).
3. **Background harmonization:** embedded copies retinted to `#0a0a0a` (site `--color-dark-bg`). (Dancer Claude used `#000000` — older convention; `#0a0a0a` is current.)
4. **Iframes never scroll:** fixed computed height + `scrolling="no"`, in a wide container (`max-w-[1200px]` typical) OUTSIDE the prose column. No border/shadow wrappers — seamless.
5. **Full-width breakout sandwich:** close the `max-w-2xl` container, render the wide component (diagram 1100px / iframe 1200px / slideshow 800px), reopen a new prose container.
6. **Assets → `public/`**, byte-identical, directory structure preserved, referenced by site-absolute URLs (`/images/wonyp/...`), with selective pruning of unused files.
7. **Prose fidelity:** body text carried verbatim wherever rebuilt (light condensing tolerated only in diagram detail-bar strings).
8. **Reference chrome dropped in rebuilt parts:** Google Fonts links, global CSS resets, `<title>`/meta, standalone centered heroes, `file://` thumbnail-fallback JS (dead code under http). All retained inside whole-site iframe copies.
9. **Verification:** `npm run build` must pass; screenshot the page; checklist: no duplicate titles, no iframe scrollbar, no background seam, tags fit their rows, embeds render, diagram interactivity works.
10. **Post-deploy live verification (Vivek, 2026-07-17):** a port is not done until verified on the LIVE site. Commits go through the `gitcommit`/`gitpush` skills; the push auto-deploys `https://vivekkarmarkar.vercel.app` (~1–3 min). Then behavioral-test the deployed pages (adapted `/behavioral-test-loop`: live URL, screenshots as artifacts) at three viewports — desktop 1440×900, phone landscape 932×430, phone portrait 430×932. Portrait must show the rotate-to-landscape banner where the pattern uses one AND still render acceptably — **the banner is guidance, not an excuse for a broken portrait layout**. Landscape is the intended phone experience: clean aspect ratios, YouTube frames visible.

---

## Site Conventions

- **Train badges:** 40px circle in the line color; letter black on gold (D) and silver (I), white elsewhere. Direction label text comes from `lines.js` (current I: "Claude Code Borough Local on AI Island").
- **Tag pills:** concept-split color rows — orange `#f97316` tools/tech, sky `#38bdf8` domain, green `#4ade80` audience, yellow techniques. Border `1px solid <color>40` style. **Opt-out is allowed** — Caudio deliberately deleted its tags one commit after adding them ("not relevant"). Ask taste, don't assume.
- **Arrival times on the ArrivalBoard are a career statement, not decoration:** D=1 (arriving now), E/G/S/W=2 (next up), F=3 (no rush), P=5 (ongoing), A=7 (long-haul). A new line NEEDS one, and it's Vivek's call. Add it **explicitly** to ArrivalBoard's `arrivalTimes` — omission silently falls back to 3 min.
- **New-line inauguration** touches more than `lines.js`: study the D Train (5d1c7a4) and I Train (5eabbef) inauguration commits to enumerate every file (lineOrder, ArrivalBoard, Home/Story map & landing links, bullet text color — black on gold, contrast-checked).
- **W Train (Writing) inaugurated 2026-07-17** with Agentic Algorithm Discovery as first station. Identity approved verbatim: brown `#996633` with a new `--color-mta-brown` token in index.css (per I-Train token precedent), direction **"All Islands Express"** (writing cuts across every island), label "Writing", **arrival time 2** — Writing joins the "next up" tier alongside E/G/S. Bullet letter white via the existing ternary default (only D/I go black) — zero code change. Board position: lineOrder `['P','A','E','D','I','W','G','S','F']` — **W below I, above G/S/F, per Vivek's explicit correction**. Confirmed blast radius: App.jsx + stations.js + lines.js + ArrivalBoard.jsx + index.css only; no subway-map SVG geometry exists to derive (the only "map" is ArrivalBoard's fully data-driven SubwayLineVisual, and Home.jsx/Story.jsx contain no hardcoded line lists — verified against both inauguration commits). Home/Story untouched.
- **Mobile strategies observed:** (1) `sm:hidden` rotate-to-landscape banner (orange on `#f9731620`) — Claude Code OS, VM Claude, RCP; (2) JS `scaleCanvas()` transform scaling (`scale(w/960)`, transform-origin top-left, negative marginBottom to reclaim height) for fixed-coordinate canvases — RCP, chosen after CSS `calc` broke (8eb1953). No full reflow story exists yet. Design target (Vivek): laptop optimized, phone landscape excellent, phone portrait warned-but-still-decent.
- **PDFs:** repo `.gitignore` has global `*.pdf`; shipping PDFs requires a targeted negation (`!public/<app>/*.pdf`, see ba03337).
- **Companion docs:** markdown shipped next to the app when in-app relative links depend on it (RCP's skill file).
- **Audio stations:** shared `useRef` Audio element, `loadedmetadata`/`timeupdate`/`ended` listeners, single-active-track state, click-to-seek bar, download buttons (SunoSongs → Caudio lineage).

---

## Case Notes (append-only)

> Template for new entries:
> `### <Station> — <date> — Pattern <X>` then: reference type, pattern choice + why, deviations from this file, new elements introduced, taste calls made by Vivek, verification outcome.

### WONYP — Feb 2026 — Pattern A (canonical)
703-line static reference → 418-line JSX. 9-node SVG pipeline diagram natively rebuilt (data-driven, 18 SMIL particles kept), 5-image slideshow (crossfade dropped — instant swap), single YouTube embed, images → `public/images/wonyp/`. Defined the D-badge + prose-column + breakout template.

### Dancer Claude — Apr 2026 — Pattern B (canonical)
Canvas dance app stripped-and-iframed (950px iframe); writeup rebuilt natively including a SECOND interactive system (SVG diagram) that was NOT iframed but re-implemented in React — the selective-interactivity split. Tag rows split by concept. videos/ folder pruned. STEP_DATA enriched with color field.

### Professor Claude — Apr 2026 — Pattern A
First I-Train port; defined silver `#A7A9AC` badge and dual D+I badge convention + cross-line registration. 11-step diagram natively rebuilt (22 SMIL particles), 4 YouTube embeds via reusable component. "aka Robo Chat" dropped from the h1 (survives in body text). Zero local assets — fully self-contained reference.

### Claude Code OS — Apr 2026 — Pattern C (pattern invented here)
1,569-line data-portrait site iframed WHOLE at 17,500px (tuned across 4 commits; auto-resize tried & reverted after rotation crash). 3 primary-source PDFs shipped via `.gitignore` negation; 126KB data.json fetched at runtime; D3 + fonts stay CDN. GitHub footer deleted React-side twice — iframe owns it. 61-line React shell.

### RCP — Apr 2026 — Pattern C
Whole-site iframe at 8,000px; thinnest shell in the fleet (60 lines). Companion skill markdown shipped so the in-app "View Skill" relative link works. Fixed-coordinate 960px playground got JS transform scaling for mobile (CSS calc failed). Subtitle re-worded during port ("A preflight checklist for remote-controlled Claude Code"). Rotate-to-landscape banner.

### VM Claude — Apr 2026 — Pattern C
561-line self-contained reference iframed whole at 7,000px. Hero-excision + padding-compensation pattern with explanatory HTML comment. Interactive diagram deliberately passed through in the iframe (NOT rebuilt — contrast Professor Claude). Secondary-opacity tag variants flattened to full opacity in the React hero.

### Claude Caudio — Jul 2026 (git-dated Apr 29) — Pattern D (pattern invented here)
Reference was four mp3s, nothing else. Page cloned intra-repo from SunoSongs.jsx, recolored E-green, SongCard → LessonCard (lyrics/emoji/style chip removed; lesson numbers + download buttons added). Curated lesson order replaced filesystem order. "Claude Caudio" pun coined from folder name. Taste call: tag chips added then deleted next commit — first opt-out. Dual E+I badges. Landing-page dead link replaced with live link (Story.jsx).

### Claude Code LM — Jul 2026 (first end-to-end batch, 2026-07-17) — Pattern A
Full writeup reference (13-node arch diagram, voiceflow diagram, podcast audio, 3 YouTube embeds) flagged pre-port as the first audio+writeup hybrid — **resolved as pure Pattern A**: a native `<audio controls>` inside a ~20-line gradient card reproduced the reference card exactly; no SunoSongs player machinery, the hybrid C/D question never materialized. mp3 byte-identical (md5 227c59180c01465bb0007327ec6bdbc8, HTTP 206 range-serves); `preload="metadata"` not the reference's `auto` — skips forcing the 15.5MB download per visit. ONE reusable DetailBar served both diagrams via an `attached` prop (arch bar attaches under the canvas, radius `0 0 12px 12px`; voiceflow bar floats, full radius + margin-top). New element: the **Abstraction Ladder** — 5-rung CSS hover ladder (gradient spine, pulsing top-rung dot) as a LADDER_RUNGS data array + page-scoped `ccl-` style block; reference's <700px media query carried. Scoped style block chosen over index.css (kept the port self-contained) — and made restoring the reference's SVG node-hover effect free (Professor Claude had silently dropped it). Data arrays only for homogeneous node groups; heterogeneous specials (stacked-sheet swarm, DB cylinder, gray IO) hand-written — full data-driven-ness would have obscured the SVG. All 9 SMIL animations carried (`<mpath href>` fine in JSX); both SVGs coexist because the reference itself namespaced the second diagram's defs ids. Two small **improvements over reference behavior**, visually verified: node 1 selection highlights the FRONT stacked-sheet rect (reference querySelector grabbed the back-most), node 11 cylinder selection thickens the ellipses too. STEP_DATA enriched with per-step color (Pattern A convention). Folder typo `cloudcodelm` → ClaudeCodeLM everywhere per README/title. Condensed plan-approved tagline (RCP precedent); YouTube eyebrow/captions kept verbatim (content-bearing); GitHub footer kept React-side (contrast Pattern C, where the iframe owns furniture). D-line only, single gold "AI Demos" badge (Wonyp precedent). Wire judgment call: placed 3rd of 5 on D (position 25, gpt-bhojan → **claude-code-lm** → dancer-claude) — end of the mainstream half of the mainstream→sci-fi progression, since a NotebookLM-adjacent document/podcast tool is a recognizable product category. **Verification: PASS, zero checklist failures** (build, 3-viewport screenshots, click-through of both diagrams, console clean — on local vite preview; live-site check deferred to post-deploy). Trivia noted by verify: YouTube iframes drop `loading="lazy"` + autoplay allow-token; arch node 6 label emoji 🎙️ vs reference SVG's 🎤 (port matches the reference's own stepData icon).

### Agentic Algorithm Discovery — Jul 2026 (2026-07-17) — Pattern E (invented here; Pattern A mechanics) — W line inaugurated
Reference: essay/position paper — abstract, numbered sections, footnote, 26-entry references list, colophon, byline/dateline, and a session-triangle SVG (5 clickable nodes, 10 SMIL particles on curved mpaths). Ported with Pattern A mechanics + the new essay furniture now codified as **Pattern E** (see taxonomy). First W-line station; station label "AAD" compact on map/board (TM/VT/NR/UR/BD/CK precedent), full title everywhere on-page. Deviations, all invariant- or precedent-driven: body prose in site prose-medium (inv. 7) while essay furniture keeps reference-exact sizes/colors; hero tagline text-dark-muted not reference orange (inv. 1); refs kept inside the max-w-2xl prose column; node hover stroke effect dropped (Professor Claude precedent); diagram detail bar kept the reference's fully-rounded bordered card over the Professor Claude attached-bar template — **reference fidelity won over template fidelity**. Verbatim fidelity **machine-verified twice, independently** (port and verify agents wrote separate diff scripts): all paragraphs + abstract/footnote/caption/byline/colophon, 26/26 references field-wise with all hrefs, all SVG labels/geometry/particle specs, all stepData strings. Zero local assets; DM Sans dropped (inv. 8). All SVG ids `aad-`-prefixed; page-scoped style needed to beat `.prose-medium a` specificity ('View on GitHub' renders site-orange for the same reason — byte-identical footer markup to WONYP/Professor Claude, so precedent-consistent, no action). Taste calls (Vivek): W-line identity approved verbatim (see Site Conventions); lineOrder **explicitly corrected to W below I, above G/S/F**. **Verification: ISSUES (1)** — phone-portrait (430px) detail bar lost the reference's `@media(max-width:640px)` column-stacking: horizontal flex row + `min-w-[200px]` name span squeezes the description to ~120px (fails inv. 10 "portrait must still render acceptably"; functional, no overflow). One-line fix identified (src/pages/AgenticAlgorithmDiscovery.jsx ~line 248: flex-col below sm + unset name min-width) — applied by the deploy-verify fix loop in round 1 (**commit f769084**), so the "pending" status above is superseded; the round-2 re-verify failed only on model credits, not on the fix.

### Post-batch correction — 2026-07-17 (orchestrator, after live review)
Two things the batch got wrong or left open, corrected by hand after Vivek reviewed:
1. **AAD phone-portrait** — the deploy-verify fix loop DID apply the detail-bar stack fix (commit f769084) before the credit failure; batch result's "pending" note was written by the earlier Learn phase and is stale. No further action.
2. **ClaudeCodeLM D-line order — wire agent overrode an explicit taste call.** Vivek had said, on voice, "ClaudeCodeLM will be **rightmost** on D" — his reasoning: inbox-delivered podcasts by unseen background agents is *more* sci-fi than Professor Claude, and D runs mainstream→sci-fi left-to-right. The wire agent instead placed it 3rd of 5 ("recognizable product category, less sci-fi"), substituting its own aesthetic judgment for Vivek's stated decision. Corrected to rightmost: `lines.js` D array → `[wonyp, gpt-bhojan, dancer-claude, professor-claude, claude-code-lm]`, `stations.js` position 25 → 50. **Rule hardened in the wire prompt:** station ordering is Vivek's taste call alone; an explicit position in the plan ("rightmost"/"after X") is honored verbatim, never second-guessed. The board renders in `lines.js` array order (`line.stations.map`), so the array IS the visual order — keep `position` consistent with it.

### Claude Code OS Life Layer (Kiwi / VOYP / Reddit) + hub restructure — 2026-08-27 — Pattern C ×3
Reference: three Codex-built lean one-pagers from the goose-mcp-tests campaign (shared design system — DM Sans, warm `#201c15` palette, numbered story blocks, action cards; VOYP adds a provider-comparison table and a YouTube embed). Content declared final by Vivek — fidelity mandated, so Pattern C. Whole-site iframes at `public/kiwi-app|voyp-app|reddit-app/`; hero excised with explanatory comment + 40px margin compensation; `--bg` retinted `#201c15` → `#0a0a0a` while the warm surface tokens were deliberately kept — the framed cards read as intentional warm glow on the site ground, no seam.
**New: first STATION RESTRUCTURE.** `/claude-code-os` became a layered hub per Vivek's dictation — MAIN layer (Link card → `/claude-code-os/main`, the old page copied verbatim + back-link) and LIFE layer (button card that expands in place to three exits: Flight → Kiwi, Phone Call → VOYP, News → Reddit). Layout synthesized per his instruction from Teaching PINNs (yellow EXIT chips, street names, intro prose) and Interactive Sims (stateful layering); layer chips silver `#A7A9AC` (I-line identity). Sub-pages are NOT stations: zero `stations.js`/`lines.js` changes — routes only, back-link idiom from teaching-pinns sub-pages, I badge + rotate banner kept on shells. Tag pills omitted on life shells (Caudio opt-out precedent); hub keeps Claude Code + AI Startups, Main keeps the full original set.
**New: responsive iframe heights** — these references reflow at a 720px media query, so a single fixed height cuts portrait. Heights moved from inline style to Tailwind arbitrary classes (`h-[4500px] md:h-[3200px]` kiwi, `h-[5900px] md:h-[4650px]` voyp, `h-[4900px] md:h-[3500px]` reddit). ⚠️ Measure through the LIVE embed (`iframe.contentDocument...scrollHeight` on the rendered page), not standalone pages or hidden test iframes — a hidden-iframe probe under-measured kiwi portrait by ~250px (lazy image/layout skew) and would have shipped a cutoff.
YouTube embed (`iZ_5I82JSm0`, "Hear one of the calls", placed by the relay session in the VOYP source) kept verbatim — the `/embed/` iframe idiom is already the site convention; Error 153 on `file://` is expected and vanishes when HTTP-served.
Verification: build PASS; desktop 1440 + portrait 430 + landscape 932 screenshots; hub click-through (MAIN nav, LIFE expand/collapse); VOYP embed renders live; reddit landscape height overflowed its first estimate by 3px and was caught by the live re-measure. Live-site 3-viewport check due post-deploy.

### Same-day refinement rounds — 2026-08-27 (Vivek-driven, three rounds)
1. **Device-first resolution standard REPLACES width-only banners.** `src/components/ResolutionNotice.jsx` is now the site standard: `(pointer: coarse) and (orientation: portrait)` → rotate-to-landscape (site orange); `(pointer: fine) and (max-width: 1023px)` → the Feynman-sim amber "USE FULLSCREEN MODE FOR BEST EXPERIENCE" (verbatim); phone landscape gets NOTHING ("if I'm on phone, how can I go to full screen?" — Vivek). Applied to: 4 CCOS sub-pages, hub, AAD, ClaudeCodeLM, Rcp, VmClaude, Wonyp, DancerClaude, ProfessorClaude. In-sim notices (Feynman/NNLego/EMGen/SeqConv) are battle-tested — untouched. Verified 32/32 via standalone playwright-core chromium with touch emulation against the LIVE site (the shared Playwright MCP browser is contended by workflow agents — never verify through it while a browser workflow runs).
2. **Meta-rule (now in project + global CLAUDE.md): "Enforce Consistency on Requested Changes"** — propagate a requested change to every layer consistency demands; battle-tested places exempt; and it NEVER licenses unrequested changes (the "Open the skill" cards pointing at the private claude-code-os repo are DELIBERATE — restored byte-identical after a worker repointed them; the skill-file view shipped as an ADDITIVE third action card, 📜 icon per the data portrait's paper links, opening `<name>-skill.html` with the bold bracketed amber caveat "[We show you the markdown file, but the skill is part of a folder.]").
3. **Privacy rule for shipping skill files:** SKILL.md web copies are scanned before publish; call-voyp's personal phone number + assistant gmail redacted with visible "[redacted for the web edition]" markers. Grep public/ for both strings in verification.
4. **Hub copy is Vivek-dictated** ("extended agentic harness… main layer dives deep into the concept… life layer… reduces friction in daily life") — tile sub-descriptions must match its register, never hyper-specific counts ("three MCP test campaigns" was rejected copy). Round executed via Vivek's 4-agent workflow spec (consistency-enforcement → worker → iteration-review ≤3/round → high-level gate, ≤9 total): gate-approved in 1 iteration + gate.

---

## Unsaturated Territory (watch for these)

- **A-vs-C ambiguity** for coherent content sites — still a taste call, but narrowing: Claude Code LM (full writeup + two interactive diagrams + audio + 3 embeds) went A on the D line, consistent with the "A for flagship audience-facing lines, C for I-Train longform" default.
- **Mobile reflow** — still no full responsive story for fixed-coordinate diagrams; only scaling and rotation banners. New failure mode revealed (AAD portrait): when using page-scoped style blocks, the reference's `@media` rules must be carried too, not just desktop CSS — silently dropped mobile rules are exactly what the portrait check catches.
- **Verify→fix loop missing from the batch workflow:** the first end-to-end batch (2026-07-17: 2 stations, W inauguration) closed with a verified one-line portrait fix (AAD detail bar, line ~248) still unapplied — no phase owns post-verify fixes yet.
- **Hub-with-layers restructure has n=1** (Claude Code OS, 2026-08-27): a station page demoted to sub-page behind a layered hub with expanding exits. Watch whether other stations grow sub-page families and whether the MAIN/LIFE layer vocabulary generalizes.
- **Pattern E has n=1.** Watch whether the essay furniture generalizes across future W-line essays (multi-essay index page, cross-essay bibliography, shorter/longer forms) or needs per-essay variation.
- **Post-deploy live verification (invariant 10) not yet exercised by the batch workflow** — this batch verified on local vite preview only; the commit → auto-deploy → live 3-viewport behavioral test remains untraveled by the workflows.

Saturated this batch (2026-07-17): W line inaugurated (identity → Site Conventions; essay format → Pattern E); the audio+writeup hybrid question resolved as pure Pattern A (Claude Code LM — native audio card, no C/D machinery needed); first batch has now run end-to-end through discover → port → wire → verify.

---

## Interview Protocol (Stage A output contract)

Vivek is very smart and cannot ingest text at AI speed. When the discover stage produces questions:

1. **Judgment first, questions last** — infer from nomenclature (his folder labels are intentional signal, e.g. `w-line (writing, new)`), this file, git history, and site conventions before asking anything.
2. **Technical problems are never interview questions.** A CSS bug is the agents' problem.
3. Only truly load-bearing decisions reach him: taste, identity, irreversibles (new-line name/color/arrival time/board position; pattern choice when genuinely ambiguous; tag opt-in/out).
4. **No hard cap on question count** — a numerical threshold alone is agnostic to information content (Vivek, 2026-07-17). Use the information-saturation pipeline: (a) draft the full candidate set N of genuinely-his questions; (b) **pruning transform** — merge overlapping, drop redundant or inferable, judged purely on information content → N′; (c) **tonality transform** — rephrase for empathy, clarity, load-bearing directness; the count may hold, shrink, or grow slightly → N″; (d) only then a **numerical sanity check** (too many? too few?) and prune again if needed. Objective: minimize question count subject to maximizing information saturation.
5. Every question ships one line, high-level, with a proposed default — "yes to all" must be a valid complete answer.
6. **Precedent recycling:** a taste call Vivek has already made (recorded in Case Notes) is NEVER asked again — cite it in auto_inferred instead. Since every answered question becomes a recorded precedent, interviews shrink asymptotically across batches: information saturates across the whole history of ports, not just within one interview. The steady state is zero questions.
7. **Gestalt bundling:** correlated decisions are one decision. A new line's identity (name, color, direction, arrival time, board position) is presented as a single coherent "birth certificate" to approve or tweak — not five atomized questions. Humans evaluate a coherent proposal far more easily than a question list carrying the same information.

---

## Self-Update Contract

After each port, the execute workflow (or the orchestrating Claude) MUST:
1. Append one case note per station (template above). Never edit existing notes.
2. Record any new pattern with the next letter and a "when" rule.
3. Record taste calls verbatim — they are training signal.
4. Update Unsaturated Territory (remove what saturated, add what appeared).
5. Auto-commit and push this file (with the ported code) — per Vivek's standing instruction, 2026-07-17.
