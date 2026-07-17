# Porting Context

**The learned weights of the porting system.** The porting workflows (`workflows/port-batch-discover.js`, `workflows/port-batch-execute.js`) are the fixed architecture; this file is what they learn. Every workflow run **reads this file first** and **appends what it learned last**. Case notes are append-only — never rewrite history. Seeded 2026-07-17 from a 7-agent forensic comparison of every reference→ported pair (raw data: `workflows/data/porting-forensics-2026-07-17.json`).

The original `/port-reference-site` skill (frozen at the first 2 ports) remains untouched per the cardinal rule; its mechanics are absorbed here.

---

## The Pattern Taxonomy

Four porting patterns observed so far. New patterns get the next letter — do not force-fit a novel reference into these.

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
- **Arrival times on the ArrivalBoard are a career statement, not decoration:** D=1 (arriving now), E/G/S=2 (next up), F=3 (no rush), P=5 (ongoing), A=7 (long-haul). A new line NEEDS one, and it's Vivek's call.
- **New-line inauguration** touches more than `lines.js`: study the D Train (5d1c7a4) and I Train (5eabbef) inauguration commits to enumerate every file (lineOrder, ArrivalBoard, Home/Story map & landing links, bullet text color — black on gold, contrast-checked).
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

---

## Unsaturated Territory (watch for these)

- **W line (Writing)** — planned, never inaugurated. First essay-type port will likely add nuance (reading-length pages, bibliography links, maybe a Pattern E).
- **A-vs-C ambiguity** for coherent content sites — currently a taste call.
- **Audio + writeup combined** (cloudcodelm has podcast.mp3 + full site) — first hybrid of C/D elements pending.
- **Mobile reflow** — no real responsive story for fixed-coordinate diagrams; only scaling and rotation banners so far.
- Batches, inaugural lines, and multi-line batches are handled by the workflows, but no batch has actually been run end-to-end yet.

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
