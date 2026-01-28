# Project Roadmap

**Personal Website - Interactive Educational Platform**
**Last Updated:** January 21, 2026

---

## Vision

An interactive educational platform at the intersection of **Physics**, **AI**, and **Education** — teaching machine learning, physics, and mathematics through visual, interactive experiences rather than traditional tutorials or notebooks.

**Core Philosophy:** "AI models are getting better at writing code — the valuable skill is now *understanding* the architecture-to-code mapping."

**Ultimate Goal:** Build toward **Veritas^(Blue·Pi)** — a human-AI collaborative IDE for creating physics story videobooks that fuse Veritasium's cinematic storytelling with 3Blue1Brown's mathematical precision.

**Target Position:** Physics Education / EdTech — Brilliant, PhET, Khan Academy, or independent creator using AI to produce educational content at scale.

---

## Current State

### Live Features

| Feature | Status | Description |
|---------|--------|-------------|
| NYC Subway Navigation | ✅ Live | 6 train lines (P, A, E, G, S, F) as navigation metaphor |
| Interactive Simulations | ✅ Live | 7 simulations with filtering by subject |
| Teaching PINNs Hub | ✅ Live | 3 exits: Lectures, Tutorials, Perspectives |
| JAX Regression Tutorial | ✅ Live | Dynamic Mode + Neural Net Lego integration |
| Suno Songs (G Train) | ✅ Live | AI-generated music with playback |
| Veritas^(Blue·Pi) Vision | ✅ Live | Vision page with Eugenia Etkina collaboration |

### Interactive Simulations (7 Total)

| # | Simulation | Subject | Status |
|---|------------|---------|--------|
| 1 | Earnshaw's Theorem | Physics | ✅ Complete |
| 2 | Colliding Projectile | Physics | ✅ Complete |
| 3 | Matrix Transforms | Maths, ML | ✅ Complete |
| 4 | Neural Net Lego | ML | ✅ Complete |
| 5 | Electromagnetic Generator | Physics | ✅ Complete |
| 6 | Sequence Convergence | Maths | ✅ Complete |
| 7 | Feynman Conservation of Energy | Physics | ⚠️ Needs Polish |

---

## Milestones

### Completed

#### Session 8 (Jan 21, 2026) — Feynman Conservation of Energy
- [x] Integrated 3,700+ line Feynman blocks simulation
- [x] Dark mode fixes across all pages (Plot, Playground, Game, Home)
- [x] Non-intrusive split-screen notice
- [x] Documented known issues in FEYNMAN_SIM_TODO.md

#### Session 7 (Jan 18, 2026) — Broader Perspectives
- [x] Added "Lower Exit" to Teaching PINNs hub
- [x] Two expert perspective pages (Horstmeyer, Akeson)

#### Session 6 (Jan 17, 2026) — AI Classroom Experiment
- [x] Created 15 AI student agents for pedagogical testing
- [x] Validated target audience (Priya → Yuki)
- [x] Discovered "spec vs implementation" framing
- [x] Added insight to Sequence Convergence Philosophy box

#### Session 5 (Jan 17, 2026) — Sequence Convergence
- [x] Interactive ε-N definition visualizer
- [x] Challenge Mode with locked tolerance pane
- [x] Three sequence types with difficulty gradient

#### Earlier Sessions (Jan 13-16, 2026)
- [x] Electromagnetic Generator simulation (TypeScript)
- [x] Veritas^(Blue·Pi) vision page
- [x] Suno Songs player (G Train)
- [x] Neural Net Lego simulation
- [x] JAX Regression tutorial with Dynamic Mode

---

### In Progress

#### Feynman Simulation Polish (High Priority)
- [ ] Fix layout cramping — give elements breathing room
- [ ] Increase size of garden, toybox, rug
- [ ] Fix save pop-up dialogs (Scale, Ruler, Calculator)
- [ ] Complete 30+ item testing checklist
- **Reference:** `FEYNMAN_SIM_TODO.md`

---

### Upcoming

#### Near-term (Next 1-2 Sessions)

| Task | Priority | Complexity |
|------|----------|------------|
| Fix Feynman simulation UX issues | High | Medium |
| Deploy website (Git → GitHub → Vercel) | High | Easy |
| Sequence Convergence: Custom sequence input | Medium | Medium |
| Sequence Convergence: Wrong limit attempts | Medium | Low |
| Sequence Convergence: N(ε) staircase visualization | Medium | Medium |

#### Medium-term (Next Month)

| Task | Priority | Complexity |
|------|----------|------------|
| ML Circuit Diagram for JAX Tutorial | High | High |
| Mobile responsiveness improvements | Medium | Medium |
| Code splitting for performance | Medium | Medium |
| Real user testing for simulations | High | Low |

#### Long-term (Quarter+)

| Task | Priority | Complexity |
|------|----------|------------|
| Quat-PINNs video/paper integration | Medium | Low |
| SORA Videos station (G Train) | Low | Medium |
| Additional Teaching PINNs perspectives | Medium | Low |
| Veritas^(Blue·Pi) prototype development | High | Very High |

---

## Deployment & Hosting

### Current State
- **Code location:** Local only (`/home/vivekkarmarkar/Python Files/personal-website/`)
- **Version control:** Not yet initialized
- **Hosting:** None — site only runs on `localhost`

### Deployment Steps

| Step | Task | Complexity | Status |
|------|------|------------|--------|
| 1 | Initialize Git repository | Easy (~2 min) | ⬜ Not started |
| 2 | Create GitHub repository | Easy (~2 min) | ⬜ Not started |
| 3 | Push code to GitHub | Easy (~2 min) | ⬜ Not started |
| 4 | Connect to Vercel/Netlify | Easy (~5 min) | ⬜ Not started |
| 5 | Configure custom domain (optional) | Easy (~10 min) | ⬜ Not started |

### Recommended Platform: Vercel or Netlify

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Free tier | ✅ Generous | ✅ Generous |
| Auto-deploy from GitHub | ✅ Yes | ✅ Yes |
| Vite/React support | ✅ Native | ✅ Native |
| SPA routing | ✅ Automatic | ✅ With config |
| Build time | ~30 seconds | ~30 seconds |

### How Updates Will Work

```
You edit code locally
        ↓
git add . && git commit -m "message" && git push
        ↓
GitHub receives changes
        ↓
Vercel/Netlify auto-detects push
        ↓
Runs: npm run build
        ↓
Deploys new dist/ folder
        ↓
Live site updated (~30 seconds)
```

### Considerations

| Item | Size | Impact |
|------|------|--------|
| Audio files (Suno songs) | 24 MB | ✅ Fine for free tier |
| Simulation card images | ~2 MB | ✅ Fine |
| JavaScript bundle | ~1-2 MB | ✅ Fine (code splitting later) |
| PAT Scan static site | ~5 MB | ✅ Will work as-is |

### Priority

**When to deploy:** After Feynman simulation polish is complete, or sooner if you want to share the site with collaborators (Eugenia Etkina, etc.)

---

## Future Ideas

### New Simulations

| Idea | Subject | Source |
|------|---------|--------|
| Fourier Transform Visualizer | Maths, Physics | Natural fit for audio/signal content |
| PINN Training Visualization | ML, Physics | Shows physics loss integration |
| Quaternion Rotation Demo | Maths, ML | Ties to Quat-PINNs work |
| Lagrangian Mechanics Sim | Physics | Advanced mechanics visualization |

### Tutorial Enhancements

| Feature | Description |
|---------|-------------|
| ML Circuit Diagram | Progressive reveal as tutorial advances |
| vmap "Sprinkler" Visualization | Shows why vmap exists |
| Live Code Execution | MyBinder integration for more sections |
| Code Diff View | Show before/after for optimizations |

### Platform Features

| Feature | Description |
|---------|-------------|
| User Progress Tracking | Remember completed sections |
| Interactive Quizzes | Test understanding after simulations |
| Simulation Parameter Sharing | URL-encoded states |
| Export to Notebook | Download tutorial as .ipynb |

### Content Expansion

| Area | Description |
|------|-------------|
| More Perspectives | Additional expert conversations |
| Video Integration | More Veritas^(Blue·Pi) proof-of-concepts |
| Physics for Sports Deep Dives | Expand S Train content |
| Fun Station Content | Populate F Train |

---

## Technical Debt

### High Priority

| Issue | Location | Impact |
|-------|----------|--------|
| Feynman sim layout/sizing | `FeynmanConservationSim.jsx` | Usability |
| Feynman save pop-ups finnicky | `FeynmanConservationSim.jsx` | Core gameplay |
| Dynamic Mode auto-scroll broken | `JaxRegression.jsx` | Tutorial UX |

### Medium Priority

| Issue | Location | Impact |
|-------|----------|--------|
| Divider position frozen at 50% | `NeuralNetLegoSim.jsx` | Flexibility |
| No code splitting | `App.jsx` | Load time |
| Missing mobile optimization | Various | Mobile users |

### Low Priority

| Issue | Location | Impact |
|-------|----------|--------|
| Inconsistent TypeScript usage | Mixed `.jsx`/`.tsx` | Maintainability |
| Missing unit tests | None exist | Reliability |
| No CI/CD pipeline | N/A | Solved by Vercel/Netlify |

---

## Architecture Decisions

### Current Stack
- **Framework:** React 18 + Vite 7.3
- **Styling:** Tailwind CSS v4
- **3D:** Three.js via react-three/fiber
- **Charts:** Recharts
- **Code:** Prism.js + react-simple-code-editor
- **Routing:** react-router-dom v6

### Planned Additions
- Code splitting via React.lazy()
- Service worker for offline capability
- Analytics for user engagement tracking

### Constraints (Non-Negotiable)
- Dark mode first design
- No scrollbars in simulations
- Editable code cells
- No redirect to Colab
- No fake/staged output

---

## Success Metrics

### Engagement Goals
- Simulation completion rates
- Tutorial progression tracking
- Time spent on interactive elements
- Return visitor patterns

### Quality Goals
- All simulations pass functionality tests
- Consistent dark mode across site
- Mobile-responsive layouts
- Sub-3s initial load time

### Community Goals
- Collaboration with physics educators
- Recognition from PhET/Brilliant/Khan
- Adoption in educational settings

---

## Key Contacts & Collaborations

| Person | Affiliation | Status |
|--------|-------------|--------|
| Eugenia Etkina | Rutgers | Active collaboration |
| Carl Wieman | Stanford (Nobel) | Connected |
| HC Verma | IIT Kanpur | Connected |
| Roarke Horstmeyer | Duke | Perspective recorded |
| Rachel Akeson | IPAC Caltech | Perspective recorded |

---

## References

- `CLAUDE.md` — Project guide and context
- `PROJECT_STATUS.md` — Session-by-session progress
- `FEYNMAN_SIM_TODO.md` — Feynman simulation issues
- `AI_CLASSROOM_EXPERIMENT_REPORT.md` — Pedagogical testing methodology
