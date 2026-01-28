# Project Status Report
**Last Updated:** January 21, 2026 (Session 8)

## Summary

Vivek Karmarkar's personal website — an interactive educational platform at the intersection of Physics and AI. The site uses a NYC subway navigation metaphor with multiple "lines" representing different project areas. **Session 8** integrated the **Feynman Conservation of Energy simulation** — a 3,700+ line interactive recreation of Feynman's famous "Dennis the Menace blocks" analogy from Lectures on Physics Vol I, Chapter 4. This is now simulation #7 in the gallery. Extensive dark mode fixes were applied, and known issues were documented for future sessions.

## Goals Accomplished

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

## Next Steps

1. **Fix Feynman Sim Issues (Future Session):**
   - Layout — reduce cramping, give elements breathing room
   - Size — enlarge garden, toybox, rug for better usability
   - Save pop-ups — fix finnicky dialog behavior
   - Rigorous testing — 30+ item checklist in FEYNMAN_SIM_TODO.md

2. **Implement Elena Z.'s Sequence Convergence Features:**
   - Custom sequence input
   - Wrong limit attempts
   - N(ε) staircase visualization

3. **Continue Building:**
   - Quat-PINNs video/paper when available
   - SORA Videos station (G Train)

## Roadmap

### Near-term
- Fix Feynman simulation UX issues
- Continue populating website with content
- Real user testing for simulations

### Medium-term
- ML Circuit Diagram for JAX Regression tutorial
- Mobile responsiveness improvements
- Performance optimization (code splitting)

### Long-term Vision
- **Veritas^(Blue·Pi)** — human-AI collaborative IDE for physics story videobooks
- **Position for Physics Education / EdTech** — PhET, Brilliant, Khan Academy
- **AI Classroom methodology** — Rapid pedagogical iteration before real user testing

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
| `AI_CLASSROOM_EXPERIMENT_REPORT.md` | Pedagogical testing methodology | ★★★★ |
| `CLAUDE.md` | Project guide for Claude instances | ★★★★ |
