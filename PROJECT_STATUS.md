# Project Status Report
**Last Updated:** February 11, 2026 (Sessions 9-11)

## Summary

Vivek Karmarkar's personal website — an interactive educational platform at the intersection of Physics and AI. The site uses a NYC subway navigation metaphor with multiple "lines" representing different project areas. **Sessions 9-11** (January 28 - February 11, 2026) shifted focus from simulation development to infrastructure and research: the full codebase was committed to Git, Vercel deployment was configured with SPA routing and PAT Scan fixes, and a comprehensive research effort produced a landscape analysis of the interactive educational simulations market. This culminated in a rigorous 5-agent fact-check audit that verified 145+ sources and corrected 4 wrong author attributions before the document could be shared with luminaries.

## Goals Accomplished

### February 10-11, 2026 (Session 11) — Landscape Analysis Fact-Check Audit

**Comprehensive fact-check of the landscape analysis document using a 5-agent verification swarm.**

The landscape analysis (`research/landscape_analysis.md` and `research/landscape_analysis/index.html`) was destined for an audience including Demis Hassabis, Geoffrey Hinton, Yoshua Bengio, Steven Strogatz, Eugenia Etkina, and Carl Wieman. Every claim needed independent verification to meet that standard.

**5-Agent Swarm Results:**

| Agent | Scope | Verdict |
|-------|-------|---------|
| Market Verifier | 22 market numbers against primary sources | 22/25 exact match |
| Competitor Verifier | Player metrics, funding rounds, dates | PhET & Labster figures outdated |
| Papers Verifier | Author names, venues, characterizations | 4 wrong first-author attributions found |
| Study Verifier | Effect sizes, sample sizes, citations | 8/10 verified |
| Editorial Reviewer | Unsourced claims, subjective language | ~35 issues flagged |

**Critical Discovery -- 4 Wrong Author Attributions:**

| Incorrect | Correct | Paper | Venue |
|-----------|---------|-------|-------|
| Markel et al. | Lu & Wang | Generative Students | L@S 2024 |
| Xu et al. | Gao et al. | Agent4Edu | AAAI 2025 |
| Kasneci et al. | Yuan et al. | Valid Student Simulation | arXiv 2026 |
| Naous et al. | Teutloff et al. | Synthetic Founders | arXiv 2025 |

**18 High-Confidence Fixes Applied:**
- 4 author corrections (both MD and HTML)
- 2 outdated competitor metrics (PhET 93 -> 120+ languages; Labster 2000+ -> 3000+ institutions)
- 2 data integrity fixes (arithmetic error in source count; unsourced Freeman ~6% conversion rate removed)
- 2 attribution gaps filled (Khanmigo source, K-12 revenue multiples source)
- 5 editorial language fixes (removed "landmark", "world-class", other promotional adjectives)
- 1 terminology clarification (gamification vs. game-based learning)
- 1 self-referential language check (zero "we/our/us" remaining outside direct quotes)
- 1 structural fix (bifurcating -> splitting into three paths)

**Artifacts Produced:**
- `research/fact-check-audit.pptx` -- 8-slide dark-themed presentation summarizing the audit
- `research/fact-check-audit.pdf` -- PDF export of the presentation
- `research/fact-check-notes.html` -- Detailed per-claim verification reference notes
- `research/session-summary-2026-02-11-fact-check.md` -- Session summary

**Editorial Policy Established:** Every remaining claim in the document is now either (1) a direct quote with attribution, (2) a sourced number with a named primary source, or (3) neutral descriptive language. No unsourced assertions remain.

---

### February 10, 2026 (Session 10) — Research: Landscape Analysis & Literature Reviews

**Three parallel research tracks completed:**

**1. Interactive Sims Landscape Analysis:**
- Full market research of the interactive educational simulations space
- Analyzed $189B global EdTech market and $14.4B simulation learning segment
- Mapped competitors: PhET, Brilliant, Labster, GeoGebra, 3Blue1Brown/Manim, Exploratorium, indie creators
- Identified blue ocean niche: physics sims + live code generation (no existing player combines both)
- Created `research/interactive-sims-landscape/` with sources, analysis, and summary
- Generated `market-research-interactive-sims.pptx` presentation

**2. Learning-by-Doing Literature Review:**
- Surveyed pedagogical research on interactive and experiential learning
- Created bibliography and detailed notes
- Generated `research/learning-by-doing/summary.md` (23,000+ characters)
- Presentation materials produced

**3. AI Agent Classrooms Literature Review:**
- Surveyed emerging research on AI agents simulating student behavior
- Key papers: Lu & Wang (Generative Students, L@S 2024), Gao et al. (Agent4Edu, AAAI 2025)
- Created bibliography and detailed notes
- Presentation materials produced

**Unified Landscape Analysis Document:**
- `research/landscape_analysis.md` -- Comprehensive 19,000+ character analysis synthesizing all three tracks
- `research/landscape_analysis/index.html` -- Polished HTML version for sharing

**Files Created:**
- `research/interactive-sims-landscape/` -- Full directory with sources, analysis, summary, presentation
- `research/learning-by-doing/` -- Papers, notes, bibliography, summary, presentation
- `research/ai-agent-classrooms/` -- Papers, notes, bibliography, summary, presentation
- `research/landscape_analysis.md` -- Unified analysis
- `research/landscape_analysis/index.html` -- HTML version

---

### January 28 - February 3, 2026 (Session 9) — Git Setup & Vercel Deployment

**Initial Git commit and deployment infrastructure:**

| Commit | Date | Description |
|--------|------|-------------|
| `8a3a70f` | Jan 28 | Initial commit: Interactive educational platform |
| `786244f` | Feb 3 | Add web development learning resources from internet deep-dive session |
| `6bbc510` | Feb 3 | Add vercel.json with SPA rewrites for client-side routing |
| `ef2ff92` | Feb 3 | Fix PAT Scan home button to link back to main website |
| `3211b3e` | Feb 3 | Simplify vercel.json rewrite to standard SPA pattern |
| `a1ba680` | Feb 3 | Convert all PAT Scan relative paths to absolute |

**Key Infrastructure Work:**
- Full codebase committed to Git (all 7 sims, all pages, all data)
- Vercel deployment configured with SPA client-side routing
- PAT Scan static site fixed: home button links back to main website, all relative paths converted to absolute
- `vercel.json` added with standard SPA rewrite pattern

---

### January 21, 2026 (Session 8) — Feynman Conservation of Energy Integration

**New Simulation Integrated (Simulation #7):**
- **Feynman's Conservation of Energy** (`/sims/feynman-conservation`)
- 3,700+ lines of JSX code
- Based on Feynman Lectures Vol I, Ch 4, Sec 4-1 "What is Energy?"
- Features: Plot (verbatim Feynman text), Playground (free exploration), Game (inference challenge)

**Files Created:**
- `src/sims/physics/FeynmanConservationSim.jsx` — Main simulation (3,700+ lines)
- `src/pages/sims/FeynmanConservation.jsx` — Minimal page wrapper
- `public/images/sims/feynman-conservation-card.png` — Gallery thumbnail
- `FEYNMAN_SIM_TODO.md` — Known issues and testing checklist

**Files Modified:**
- `src/data/simulations.js` — Added simulation entry
- `src/App.jsx` — Added route

**Dark Mode Fixes Applied:**
- Plot page: Dark background (#111827), light text (#e5e7eb)
- Plot scrollbar: 50px wide with visible thumb
- Equation boxes: Dark blue background (#1e3a5f) with white text
- Playground/Game landing pages: Dark background matching Plot
- Home landing page: Dark background matching other landing pages
- Header bar: Dark background (#111827) with light title
- "Total Blocks: 28" text: Explicitly black
- "Known Information" entries: Explicitly black
- "Back to Playground/Game Instructions" buttons: White text on dark header

**Split-Screen Notice:**
- Non-intrusive amber banner: "USE FULLSCREEN MODE FOR BEST EXPERIENCE"
- Automatically hides on screens ≥1024px wide
- Replaced annoying modal dialog with simple CSS media query approach

**Known Issues Documented (for future sessions):**
1. **Layout Issue** — Everything too cramped (High priority)
2. **Size Issue** — Garden, toybox, rug need to be larger (High priority)
3. **Save Pop-ups** — Finnicky and painful to use (Critical priority)
4. **Testing Required** — 30+ item checklist in FEYNMAN_SIM_TODO.md

---

### January 18, 2026 (Session 7) — Broader Perspectives Section

**New "Lower Exit" Added to Teaching PINNs Hub:**
- Added third exit button: "Broader Perspectives St & Artifacts Ave"
- Links to `/teaching-pinns/perspectives`

**Two Perspective Items Added:**

| Item | Title | Expert | Institution |
|------|-------|--------|-------------|
| 1 | Machine Learning for Optics and Complex Numbers | Prof. Roarke Horstmeyer | Duke University |
| 2 | Generative AI for Astrophysics and LLMs | Dr. Rachel Akeson | IPAC Caltech |

**Files Created:**
- `src/pages/teaching-pinns/Perspectives.jsx`
- `src/pages/teaching-pinns/PerspectivePage.jsx`

---

### January 17, 2026 (Session 6) — AI Classroom Experiment

**Created 15 AI Student Agents for Pedagogical Testing:**

| Category | Count | Examples |
|----------|-------|----------|
| Freshman Students | 10 | priya-physics-kid, sasha-computational-kid, raj-memorizer-student |
| Elite/Olympiad | 5 | yuki-tanaka-math-evaluator, triple-gold-prodigy, ioi-gold-medalist |

**Key Results:**
- Target audience (Priya → Yuki): Mean improvement +0.57 points
- CS students independently discovered "spec vs implementation" framing
- Raj (memorizer) showed 0 improvement — validates target audience selection

**Documentation Created:**
- `AI_CLASSROOM_EXPERIMENT_REPORT.md` — 800+ line research report
- `scripts/generate_ai_classroom_report.py` — PDF generator

**Insight Implemented:**
- Added "spec vs implementation" framing to Sequence Convergence Philosophy box

---

### January 17, 2026 (Session 5) — Sequence Convergence Simulation

**New Simulation Added (Simulation #6):**
- **Sequence Convergence Visualizer** (`/sims/sequence-convergence`)
- Prominent ε-N definition display
- Three sequence types with difficulty gradient
- Challenge Mode with locked tolerance pane
- Philosophy box with pedagogical framing

---

### Earlier Sessions (January 13-16, 2026)
- Veritas^(Blue·Pi) page with Eugenia Etkina collaboration
- Suno Songs page (G Train)
- Electromagnetic Generator simulation
- Multi-persona reviewer agents
- Neural Net Lego, JAX Regression Tutorial, Teaching PINNs hub

## Challenges Encountered

### Session 8: Dark Mode Consistency
- **Problem:** Feynman simulation was built for light mode; many elements rendered poorly in dark mode
- **Solution:** Systematic fixes to backgrounds, text colors, equation boxes, and header
- **Iterations:** Multiple rounds of user feedback to get colors right

### Session 8: Split-Screen Warning UX
- **Problem:** Initial modal dialog was "FUCKING ANNOYING" — blocked entire screen
- **Solution:** Replaced with simple amber banner that auto-hides on large screens
- **Reference:** Copied approach from Sequence Convergence sim

### Session 8: Feynman Sim Layout/Sizing
- **Problem:** Everything too cramped, pop-ups finnicky
- **Status:** Documented in FEYNMAN_SIM_TODO.md for future session
- **Priority:** High — needs dedicated session to fix

## Conversation Summary

### Session 8: Feynman Integration

User revealed a "surprise" — a new standalone Feynman Conservation of Energy simulation in the `interactive sims/physics/` folder. This is a substantial 3,700+ line simulation recreating the famous blocks analogy from Feynman Lectures.

**Key Decisions:**
1. **Minimal page wrapper:** User explicitly wanted the game to appear exactly as built — removed all extra content boxes I initially added
2. **Dark mode priority:** Multiple iterations to fix colors for Plot, Playground, Game landing pages, and header
3. **Non-intrusive fullscreen notice:** User rejected modal dialog, adopted banner approach from Sequence Convergence
4. **Document, don't fix:** Layout/sizing/popup issues documented for future session rather than attempting fixes now

**User's Explicit Feedback:**
- "COMPLETELY REMOVE IT... I WANT THE GAME I MADE TO APPEAR AS IT IS"
- "the split screen warning is FUCKING ANNOYING - it is terrible"
- "make some markdown file" for future session issues

## Completed (as of Feb 11, 2026)

- Landscape analysis fact-checked and ready for distribution to luminaries
- Full codebase in Git with Vercel deployment configured
- 7 interactive simulations live on the site
- Research foundation established (market landscape, pedagogical literature, AI agent classrooms)
- PAT Scan deployment issues resolved (absolute paths, SPA routing)

## In Progress

- **Landscape analysis distribution** -- Document is verified and ready to share with Demis Hassabis, Geoffrey Hinton, Yoshua Bengio, Steven Strogatz, Eugenia Etkina, Carl Wieman, and others
- **Research directory** -- Not yet committed to Git (currently untracked); needs decision on what to include in the repository

## Next Steps

1. **Share the Landscape Analysis:**
   - Document is fact-checked and ready for distribution
   - HTML version (`research/landscape_analysis/index.html`) suitable for web sharing
   - Presentation materials available for different contexts

2. **Commit Research to Git:**
   - Decide which research artifacts belong in the repository
   - The `research/` directory is currently untracked

3. **Fix Feynman Sim Issues (Dedicated Session):**
   - Layout -- reduce cramping, give elements breathing room
   - Size -- enlarge garden, toybox, rug for better usability
   - Save pop-ups -- fix finnicky dialog behavior
   - Rigorous testing -- 30+ item checklist in FEYNMAN_SIM_TODO.md

4. **Implement Elena Z.'s Sequence Convergence Features:**
   - Custom sequence input
   - Wrong limit attempts
   - N(ε) staircase visualization

5. **Continue Building:**
   - Quat-PINNs video/paper when available
   - SORA Videos station (G Train)

## Roadmap

### Near-term
- Share landscape analysis with target audience
- Fix Feynman simulation UX issues
- Real user testing for simulations

### Medium-term
- ML Circuit Diagram for JAX Regression tutorial
- Mobile responsiveness improvements
- Performance optimization (code splitting)
- Expand research into actionable strategy (positioning, outreach)

### Long-term Vision
- **Veritas^(Blue·Pi)** -- human-AI collaborative IDE for physics story videobooks
- **Position for Physics Education / EdTech** -- PhET, Brilliant, Khan Academy
- **AI Classroom methodology** -- Rapid pedagogical iteration before real user testing

---

## Interactive Simulations (7 Total)

| # | Simulation | Subject | Key Feature |
|---|------------|---------|-------------|
| 1 | Earnshaw's Theorem | Physics | Electrostatic equilibrium impossibility |
| 2 | Colliding Projectile | Physics | Air resistance and wind |
| 3 | Matrix Transforms | Maths, ML | 3D rotation/scaling |
| 4 | Neural Net Lego | ML | Visual NN builder with code generation |
| 5 | Electromagnetic Generator | Physics | Faraday's Law visualization |
| 6 | Sequence Convergence | Maths | ε-N definition with Challenge Mode |
| 7 | **Feynman's Conservation of Energy** | Physics | Dennis the Menace blocks analogy |

---

## Live Stations

| Line | Station | Status |
|------|---------|--------|
| P (AI for Physics) | Veritas^(Blue·Pi) | Live |
| P | Quat-PINNs | Live (needs video/paper) |
| P | Teaching PINNs | Live (3 exits: Lectures, Tutorials, Perspectives) |
| P | PAT Scan | Live |
| P | Interactive Sims | Live (7 sims) |
| A (Physics for AI) | CVNNs | Live |
| A | Quat-PINNs | Live |
| A | Teaching PINNs | Live |
| E (Education) | Veritas^(Blue·Pi) | Live |
| E | Teaching PINNs | Live |
| E | Interactive Sims | Live |
| G (Generative Art) | Suno Songs | Live |
| G | SORA Videos | Placeholder |
| S (Physics for Sports) | All stations | Live |
| F (Fun) | All stations | Placeholder |

---

## Key Files Reference

| File | Purpose | Importance |
|------|---------|------------|
| `FeynmanConservationSim.jsx` | Feynman blocks simulation | ★★★★★ |
| `FEYNMAN_SIM_TODO.md` | Known issues & testing checklist | ★★★★★ |
| `NeuralNetLegoSim.jsx` | Visual NN builder | ★★★★★ |
| `SequenceConvergenceSim.jsx` | ε-N definition visualizer | ★★★★★ |
| `JaxRegression.jsx` | Flagship JAX tutorial | ★★★★★ |
| `research/landscape_analysis.md` | Unified market landscape analysis (fact-checked) | ★★★★★ |
| `research/landscape_analysis/index.html` | HTML version for sharing | ★★★★★ |
| `research/fact-check-audit.pptx` | Fact-check audit presentation | ★★★★ |
| `research/fact-check-notes.html` | Per-claim verification reference | ★★★★ |
| `AI_CLASSROOM_EXPERIMENT_REPORT.md` | Pedagogical testing methodology | ★★★★ |
| `CLAUDE.md` | Project guide for Claude instances | ★★★★ |
| `research/interactive-sims-landscape/summary.md` | Market research executive summary | ★★★★ |
| `research/learning-by-doing/summary.md` | Learning-by-doing literature review | ★★★ |
| `research/ai-agent-classrooms/summary.md` | AI agent classrooms literature review | ★★★ |
