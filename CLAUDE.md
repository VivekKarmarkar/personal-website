# CLAUDE.md - Project Guide for Claude Code

> **📌 Active personal task (2026-07-17):** NYC event contacts to add on LinkedIn tonight — see [`contacts_NYC_event_2026-07-17.md`](contacts_NYC_event_2026-07-17.md). Pending: (1) Vivek confirms the 3 name spellings (voice-transcription-uncertain), (2) build a lightweight LinkedIn-like connect tool (dispatch agents + browser automation, since not logged in yet), (3) add the contacts at night after login. **Do these only when Vivek says — not automatically.**

## Project Overview

This is **Vivek Karmarkar's personal website** - an interactive educational platform that goes far beyond traditional tutorials or Jupyter notebooks. The site teaches machine learning, physics, and mathematics through visual, interactive experiences.

**Core Philosophy:** "AI models are getting better at writing code — the valuable skill is now *understanding* the architecture-to-code mapping."

**Unique features:**
- NYC subway-inspired navigation system
- Interactive simulations with live code generation
- Dynamic Mode for step-by-step code walkthroughs
- Animated training visualizations

## Positioning & Purpose

This site is more than a portfolio — it's a **thinking tool**.

The subway map metaphor forces categorization of work into lines (P, A, E, G, S, F). That categorization reveals patterns that aren't visible when you're in the weeds doing individual projects:

- **P Train (AI for Physics)** and **E Train (Education)** overlap heavily
- **S Train (Physics for Sports)** is origin story, not destination — it's how the journey to PINNs began
- The work that gets the most energy (Interactive Sims, Teaching PINNs, Neural Net Lego, Veritas^(Blue·Pi)) all lives at the intersection of **Physics + Education + AI tooling**

**Natural fit:** Physics Education / EdTech — places like Brilliant, PhET, Khan Academy, or building toward the Veritas^(Blue·Pi) vision as an independent creator using AI to produce educational content at scale.

**Who responds:** The people who've responded to this work are physics educators — Carl Wieman (PhET, Nobel laureate), Eugenia Etkina (ISLE pedagogy, College Physics textbook), HC Verma (legendary Concepts of Physics author). That's the community.

**The insight:** The site forced categorization, and the categorization revealed where Vivek actually belongs. It's not AI Safety (too educational). It's not pure Biomechanics (that was the origin, not the destination). It's Physics Education with AI-powered tooling.

## Tech Stack

- **Framework:** React 18 + Vite 7.3
- **Languages:** JavaScript (JSX) + TypeScript (TSX) - both supported
- **Styling:** Tailwind CSS v4 (uses `@theme` directive in index.css)
- **3D Graphics:** Three.js via @react-three/fiber and @react-three/drei
- **Charts:** Recharts for data visualization
- **Code Highlighting:** Prism.js (Python, Julia) + react-simple-code-editor
- **Icons:** lucide-react
- **Routing:** react-router-dom v6
- **Live Code Execution:** MyBinder via EventSource + WebSocket

## Quick Commands

```bash
npm run dev      # Start dev server (usually localhost:5173/5174)
npm run build    # Production build
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── App.jsx                    # Main router - ALL ROUTES DEFINED HERE
├── main.jsx                   # Entry point
├── index.css                  # Global styles + Tailwind @theme + code themes
├── components/
│   ├── Layout.jsx             # Page wrapper with header
│   ├── Header.jsx             # Navigation header
│   ├── ArrivalBoard.jsx       # NYC subway-style arrival board
│   ├── Story.jsx              # Story/bio component
│   └── ThemeToggle.jsx        # Dark/light mode toggle
├── pages/
│   ├── Home.jsx               # Landing page with subway navigation
│   ├── InteractiveSims.jsx    # Simulations gallery with filtering
│   ├── TeachingPINNs.jsx      # Teaching PINNs hub
│   ├── CVNNs.jsx              # Complex-Valued NNs page
│   ├── QuatPINNs.jsx          # Quaternion PINNs page
│   ├── SunoSongs.jsx          # ★ G Train - AI-generated music player ★
│   ├── VeritasBluePi.jsx      # ★ P/E Train - AI Physics Teacher vision ★
│   ├── teaching-pinns/
│   │   ├── Lectures.jsx       # Lectures listing
│   │   ├── LecturePage.jsx    # Individual lecture page
│   │   ├── Tutorials.jsx      # Tutorials listing
│   │   ├── TutorialPage.jsx   # Tutorial router
│   │   ├── Perspectives.jsx   # Broader Perspectives listing
│   │   ├── PerspectivePage.jsx # Individual perspective page
│   │   ├── JaxTutorial.jsx    # Basic JAX tutorial
│   │   └── JaxRegression.jsx  # JAX Regression tutorial (FLAGSHIP)
│   └── sims/
│       ├── EarnshawTheorem.jsx
│       ├── ProjectileMotion.jsx
│       ├── MatrixTransforms.jsx
│       ├── NeuralNetLego.jsx       # Neural Net Lego standalone page
│       ├── ElectromagneticGenerator.jsx  # EM generator page
│       ├── SequenceConvergence.jsx  # Sequence convergence page
│       └── FeynmanConservation.jsx  # Feynman blocks page wrapper
├── sims/
│   ├── physics/
│   │   ├── EarnshawSim.jsx         # Electrostatic equilibrium sim
│   │   ├── ProjectileMotionSim.jsx
│   │   ├── FeynmanConservationSim.jsx  # ★ 3,700+ line Feynman blocks sim ★
│   │   └── electromagnetic/        # ★ TypeScript sim ★
│   │       ├── ElectromagneticGeneratorSim.tsx  # Main wrapper
│   │       ├── lib/                # Physics modules
│   │       │   ├── constants.ts    # Vector math, physics constants
│   │       │   ├── dipoleField.ts  # Magnetic field calculations
│   │       │   └── flux.ts         # EMF, Faraday's Law
│   │       ├── hooks/
│   │       │   └── useSimulationState.ts  # Animation & physics state
│   │       └── components/         # SVG components
│   │           ├── SimulationScene2D.tsx
│   │           ├── ControlPanel.tsx
│   │           ├── WoodenWheel2D.tsx
│   │           ├── MagneticFieldLines2D.tsx
│   │           ├── CircularCoil2D.tsx
│   │           ├── LightBulb2D.tsx
│   │           ├── WaterFaucet2D.tsx
│   │           ├── Compass2D.tsx
│   │           └── DraggableCompass2D.tsx
│   ├── maths/
│   │   ├── MatrixTransformsSim.jsx
│   │   └── SequenceConvergenceSim.jsx  # ★ ε-N definition visualizer ★
│   └── ml/
│       └── NeuralNetLegoSim.jsx  # ★ THE KEY COMPONENT ★
└── data/
    ├── simulations.js         # Sim metadata for gallery
    ├── stations.js            # Subway stations data
    ├── lines.js               # Subway lines data
    ├── videobooks.js          # Videobooks data
    └── sunoSongs.js           # Suno song metadata and lyrics

public/
├── pat-scan/                  # Static PAT Scan website (DON'T MOVE!)
├── images/sims/               # Simulation thumbnails
└── generative-art/
    └── suno-songs/            # MP3 files for Suno Songs page
```

## Key Features

### 1. Interactive Simulations (`/interactive-sims`)

Seven simulations with subject filtering:

| Simulation | Subjects | Description |
|------------|----------|-------------|
| Earnshaw's Theorem | Physics | Why stable electrostatic equilibrium is impossible |
| Colliding Projectile | Physics | Bouncing with air resistance and wind |
| Electromagnetic Generator | Physics | Faraday's Law - rotating magnet induces current |
| Matrix Transforms | Maths, ML | 3D rotation/scaling visualization |
| Neural Net Lego | ML | Visual NN builder with code generation |
| Sequence Convergence | Maths | Interactive ε-N definition of convergence |
| Feynman Conservation of Energy | Physics | Dennis the Menace blocks analogy from Feynman Lectures |

---

### 2. Electromagnetic Generator Simulation (NEW)

**Location:** `src/sims/physics/electromagnetic/ElectromagneticGeneratorSim.tsx`
**URL:** `/sims/electromagnetic-generator`

Interactive visualization of Faraday's Law of electromagnetic induction.

#### Features:
- **Rotating Bar Magnet**: Attached to a wooden wheel, driven by water flow
- **Magnetic Field Lines**: Real-time dipole field visualization
- **Circular Coil**: Shows electron flow based on induced current
- **Light Bulb**: Brightness proportional to generated power (P = I²R)
- **Draggable Compass**: Explore field direction at any position
- **Water Faucet Control**: Drag slider to control RPM

#### Physics Implementation:
- Dipole field equation: B = (μ₀/4π) × (3(m·r̂)r̂ - m) / r³
- Faraday's Law: EMF = -N × dΦ/dt
- Real-time flux, EMF, current, and power calculations

#### Control Panel:
- Magnet Strength (0-100%)
- Loop Count (1-10 turns)
- Loop Area (20-100%)
- Visibility toggles (field lines, electrons, compass)
- Play/Pause
- Live physics values display (EMF, Current, Power)

#### Technical Notes:
- First TypeScript simulation in the project
- Uses relative imports within the electromagnetic folder
- Tailwind-only styling (no shadcn dependencies)
- `lucide-react` for icons

---

### 3. Sequence Convergence Simulation (NEW - Jan 17, 2026)

**Location:** `src/sims/maths/SequenceConvergenceSim.jsx`
**URL:** `/sims/sequence-convergence`

Interactive visualization of the ε-N definition of sequence convergence — the foundation of Real Analysis.

#### The Definition (displayed prominently in red):
```
∀ε > 0, ∃N ∈ ℕ such that n ≥ N ⟹ |xₙ − L| < ε
```

#### Features:
- **Three Sequence Types**: Monotonic (1/√n), Oscillating (sin(n/5)/√n), Noisy (random with shrinking variance)
- **Epsilon Slider with Animation**: Watch ε-band shrink and N shift rightward
- **Point Selection**: Click any point to see its value, distance from limit, and whether it's within ε
- **Challenge Mode**: Given an ε, find the smallest N that works
- **Locked Tolerance Pane**: When in Challenge Mode, the tolerance controls fade and lock in place (no layout shift)
- **Convergent Progress Bar**: Shows count of convergent terms above the main plot
- **Responsive Layout**: Legend + Challenge Mode on right in fullscreen, stacked in split-screen
- **Philosophy Box**: Explains the pedagogical approach — "feel" the definition, not just memorize it

#### Sequence Types:
| Type | Formula | Limit | Difficulty |
|------|---------|-------|------------|
| Monotonic | xₙ = 1/√n | 0 | Obvious |
| Oscillating | xₙ = sin(n/5)/√n | 0 | Medium |
| Noisy | Random within shrinking bands | 15 | Subtle |

#### Challenge Mode:
- Generates random ε between 0.05 and 0.4
- User must find smallest N such that all subsequent terms stay within ε
- Tolerance pane locks at 40% opacity with lock icon
- Hint provided: "Use the interactive plus sign clicker to solve the challenge"

#### Layout (Fullscreen):
- Left: Main canvas with convergent progress bar
- Right column: Legend (top) + Challenge Mode (bottom)
- Below: Tolerance & Animation controls (locked during challenge)
- Regenerate button for noisy sequence

#### Technical Notes:
- Canvas-based visualization with proper DPI scaling
- Real-time N threshold calculation
- Smooth animations with configurable speed (Slow/Medium/Fast)
- Split-screen mode shows "USE FULLSCREEN MODE FOR BEST EXPERIENCE" notice

---

### 4. Feynman Conservation of Energy Simulation (NEW - Jan 21, 2026)

**Location:** `src/sims/physics/FeynmanConservationSim.jsx`
**URL:** `/sims/feynman-conservation`

Interactive recreation of Feynman's famous "Dennis the Menace blocks" analogy from Feynman Lectures on Physics, Vol I, Chapter 4, Section 4-1: "What is Energy?"

#### The Analogy:
Dennis hides 28 indestructible blocks around the house. His mom must figure out how many blocks exist by indirect measurements — weighing the toybox, measuring bathtub water level — without ever seeing all blocks at once. This is exactly how physicists discover conservation laws.

#### Features:
- **28 Indestructible Blocks**: Drag and drop throughout the house
- **Multiple Hiding Spots**: Living room, bathroom, corridor, toybox, bathtub, under rug, garden (through window)
- **Measurement Tools**:
  - **Scale**: Weigh the toybox (empty = 16 oz, each block = 3 oz)
  - **Ruler**: Measure bathtub water level (base = 6 inches, each block = 0.25 inches)
  - **Calculator**: Save measurements and compute block counts
- **Interactive Elements**: Doors open/close, rug folds/unfolds, window opens/closes, bathtub shows bulges
- **Three Modes**:
  - **Plot**: Read the original Feynman text (dark mode, 50px scrollbar)
  - **Playground**: Free exploration with full access
  - **Game**: Inference challenge — toybox locked, bathtub retrieval blocked (Mom mode)

#### Formulas:
```
Toybox blocks = (weight - 16) / 3
Bathtub blocks = (water level - 6) / 0.25
Total = Visible + Toybox + Bathtub + Under Rug + Garden = 28
```

#### Technical Notes:
- 3,700+ lines of JSX with inline styles
- Complex state management for block positions, door states, measurements
- Coordinate systems differ between rooms
- Uses DOM measurements for drag-and-drop collision detection
- Dark mode styling throughout (background #111827, text #e5e7eb)
- Non-intrusive fullscreen notice (amber banner, auto-hides on large screens)

#### Known Issues (see `FEYNMAN_SIM_TODO.md`):
- Layout cramping — needs more breathing room
- Garden, toybox, rug too small
- Save pop-up dialogs finnicky
- Requires rigorous testing (30+ item checklist)

---

### 5. Suno Songs Page (G Train)

**Location:** `src/pages/SunoSongs.jsx`
**URL:** `/suno-songs`

AI-generated music player featuring songs created with Suno AI.

#### Features:
- **Audio Player**: Play/pause/stop controls per song
- **Seekable Progress Bar**: Click anywhere to seek
- **Time Display**: Current time / duration
- **Collapsible Lyrics**: Show/hide lyrics for each track
- **G Train Theming**: Purple accent (`#7C3AED`)

#### Songs Included:
| Song | Style | Language |
|------|-------|----------|
| The Experience Machine | Rap-rock, Linkin Park style | English |
| Chaand Sa Safar | Golden era Hindi | Hindi |
| Ye Raat Mahki Mahki | Golden era Hindi (transformation) | Hindi |
| Sadila Nako Dharu | Marathi lavani folk | Marathi |

#### The Story Section:
Visual card-based narrative explaining the physicist's methodology:
1. **Benchmark** — Test if it can reconstruct existing songs (copyright caught)
2. **Transform** — Apply transformation operator (same vibe, new words)
3. **Go Novel** — Create something entirely original
4. **The Realization** — Meta-awareness about "Experience Machine"
5. **The Conclusion** — Thesis statement song about the tool itself

#### Technical Notes:
- Audio files in `public/generative-art/suno-songs/`
- Filenames must be URL-safe kebab-case (no emojis/special chars)
- Uses `useRef` for Audio element across renders
- Event listeners: `loadedmetadata`, `timeupdate`, `ended`

---

### 6. Veritas^(Blue·Pi) Page (P + E Train)

**Location:** `src/pages/VeritasBluePi.jsx`
**URL:** `/veritas-blue-pi`

Vision page for an AI Physics Teacher that fuses Veritasium + 3Blue1Brown.

#### Concept:
- **Veritasium** (Derek Muller) — Cinematic storytelling, narrative-driven
- **3Blue1Brown** (Grant Sanderson) — Mathematical precision via Manim
- **Fusion** — "Videobooks": content synchronized to human comprehension speed

#### Page Sections:
1. **Header** — Dual train badges (P orange + E green)
2. **The Vision** — Problem statement + two challenges
3. **The Collaboration** — Eugenia Etkina partnership story
4. **Proof of Concept** — YouTube embed of "The Mystery Bottle"
5. **The Bigger Picture** — Fundamental AI challenges being solved

#### The Two Challenges:
| Challenge | Solution |
|-----------|----------|
| **Veritasium**: Long-form cinematic coherence | Proprietary techniques for character/narrative consistency across minutes |
| **3Blue1Brown**: Mathematical precision | Natural language → Manim animations (deterministic, not stochastic) |

#### Eugenia Etkina Collaboration:
- Distinguished Professor at Rutgers, author of *College Physics: Explore and Apply*
- User cold-emailed with EM Generator sim link → immediate response → Zoom → active collaboration
- Proof-of-concept video based on her textbook section

#### YouTube Video:
- **Title**: "The Mystery Bottle"
- **Topic**: Newtonian Mechanics → Describing and Representing Interactions → Testing a Hypothesis
- **Concept**: Discovering that air applies an upward force on objects

#### Design:
- Dual train badges matching landing page pattern
- Orange accent for P Train elements
- Green accent for E Train elements
- Cards with colored borders for challenges

---

### 7. Teaching PINNs Hub Structure

**Location:** `src/pages/TeachingPINNs.jsx`
**URL:** `/teaching-pinns`

The Teaching PINNs hub uses a subway station metaphor with three "exits":

| Exit | Street Name | URL | Content |
|------|-------------|-----|---------|
| Left Exit | Traditional Lectures St & Artifacts Ave | `/teaching-pinns/lectures` | Lecture-style video content |
| Right Exit | Coding Tutorials St & Artifacts Ave | `/teaching-pinns/tutorials` | Hands-on coding tutorials |
| Lower Exit | Broader Perspectives St & Artifacts Ave | `/teaching-pinns/perspectives` | Expert conversations on AI for Science |

#### Template Pattern
Each exit follows the same structure:
1. **Listing Page** (e.g., `Lectures.jsx`) — Collapsible "Learn" menu, back link, title/subtitle
2. **Detail Page** (e.g., `LecturePage.jsx`) — Back link, title/subtitle, custom content, YouTube embed
3. **Data Array** — Exported from listing page, imported by detail page

#### Broader Perspectives Content (Jan 18, 2026)

| Item | Expert | Institution | Key Topics |
|------|--------|-------------|------------|
| ML for Optics & Complex Numbers | Prof. Roarke Horstmeyer | Duke University | Complex-valued latent spaces, Physical Layers, "Data is King" |
| GenAI for Astrophysics & LLMs | Dr. Rachel Akeson | IPAC Caltech | LLMs for data parsing, AI-driven efficiency vs Neural Fields |

---

### 8. Neural Net Lego Simulation (★ FLAGSHIP COMPONENT ★)

**Location:** `src/sims/ml/NeuralNetLegoSim.jsx`

The crown jewel of the interactive system. A visual neural network builder that generates real code.

#### Features:
- **Visual Architecture Builder**
  - Add/remove layers (max 3 hidden layers)
  - Add/remove neurons per layer (max 10)
  - Per-layer activation functions (ReLU, Sigmoid, Tanh, Linear)
  - Click activation symbol to cycle through options
  - Double-click delete confirmation

- **Live Code Generation**
  - 4 frameworks: JAX/Equinox, PyTorch, TensorFlow/Keras, Julia/Flux
  - Raw vs Optimized code toggle
  - Optimized mode uses loops when all activations match

- **Weight/Activation Visualization**
  - Connection line thickness = weight magnitude
  - Connection color: green (+), red (-)
  - Neuron fill opacity = activation value (positive only)
  - Input slider to adjust input and watch activations flow
  - 🎲 button to randomize weights

- **Layout**
  - 50/50 split (diagram/code) - frozen
  - Full-screen warning banner
  - Show/Hide output values toggle

#### Props:
```jsx
<NeuralNetLegoSim
  lockedFramework="jax"           // Lock to specific framework (optional)
  showFrameworkDropdown={true}    // Show/hide framework selector
  initialArchitecture={[          // Pre-populate architecture
    { neurons: 10, activation: 'sigmoid' },
    { neurons: 10, activation: 'sigmoid' },
    { neurons: 10, activation: 'sigmoid' },
    { neurons: 1, activation: 'linear' },
  ]}
  height="800px"                  // Container height
  inputSize={1}                   // Number of inputs (default: 1)
/>
```

#### Architecture Constants:
```javascript
const MAX_NEURONS = 10
const MAX_HIDDEN_LAYERS = 3
const dividerPosition = 50  // Fixed at 50%
```

---

### 9. JAX Regression Tutorial (★ FLAGSHIP TUTORIAL ★)

**Location:** `src/pages/teaching-pinns/JaxRegression.jsx`
**URL:** `/teaching-pinns/tutorials/jax-regression`

Interactive tutorial teaching JAX/Equinox neural networks with unprecedented interactivity.

#### Dynamic Mode (Revolutionary Feature)

A step-by-step code walkthrough system:

- **Typing Animation**: Code appears character-by-character
- **Line Highlighting**: Current line highlighted as explanation plays
- **Synchronized Explanations**: Each line/block has its own explanation
- **Navigation**: Step forward/backward through code
- **Draggable Divider**: Adjust code/explanation split (currently issues with auto-scroll)

#### Static Mode

Traditional view:
- Full code visible immediately
- Narrative-style explanation
- Collapse/expand sections

#### Tutorial Sections (9 Boxes)

| Box | Title | Key Concept |
|-----|-------|-------------|
| 01 | Setup & Imports | JAX ecosystem introduction |
| 02 | Generate Data | Sin wave dataset |
| 03 | Architecture Config | Layer sizes, hyperparameters |
| 04 | Define MLP Class | ★ Integrated with Neural Net Lego ★ |
| 05 | First Prediction | vmap lesson (batching) |
| 06 | Loss Function | MSE for regression |
| 07 | Gradients | filter_value_and_grad |
| 08 | Optimizer | Optax SGD |
| 09 | Training Loop | Animated training visualization |

#### Neural Net Lego Integration (Box 04)

The sim is embedded above the MLP class code:
- Locked to JAX framework
- Pre-populated: [1, 10, 10, 10, 1] with Sigmoid activations
- Code in Box 04 **matches sim output exactly**
- Full-bleed layout (breaks out of container)

#### Code Structure for Box 04:
```python
import jax
import jax.numpy as jnp
import equinox as eqx

class MLP(eqx.Module):
    layers: list

    def __init__(self, key):
        keys = jax.random.split(key, 4)
        self.layers = [
            eqx.nn.Linear(1, 10, key=keys[0]),
            eqx.nn.Linear(10, 10, key=keys[1]),
            eqx.nn.Linear(10, 10, key=keys[2]),
            eqx.nn.Linear(10, 1, key=keys[3]),
        ]

    def __call__(self, x):
        x = jax.nn.sigmoid(self.layers[0](x))
        x = jax.nn.sigmoid(self.layers[1](x))
        x = jax.nn.sigmoid(self.layers[2](x))
        return self.layers[-1](x)

# Architecture: 1 → 10 → 10 → 10 → 1
model = MLP(jax.random.PRNGKey(42))
```

#### Animated Training Visualization

The final section shows:
- Loss curve over epochs
- Network predictions evolving to fit sine wave
- Play/pause animation controls
- Epoch slider for scrubbing

---

### 10. Styling & Design

#### NYC Subway Theme Colors
```css
--color-accent: #FF6319;     /* Orange - P Line (AI for Physics) */
--color-blue: #0039A6;       /* Blue - A Line (Physics for AI) */
--color-green: #6CBE45;      /* Green - E Line (Education) */
--color-purple: #7C3AED;     /* Purple - G Line (Generative Art) */
--color-red: #EE352E;        /* Red - S Line (Sports) */
--color-cyan: #00ADD8;       /* Cyan - F Line (Fun) */
--color-yellow: #FCCC0A;     /* Yellow - Highlights */
```

#### Activation Function Colors
```javascript
relu:    '#FF6319'  // Orange
sigmoid: '#0039A6'  // Blue
tanh:    '#6CBE45'  // Green
linear:  '#888888'  // Gray
```

#### Dark Mode First
Site is designed dark-mode first. Classes:
- `bg-dark-bg` - Background
- `text-dark-muted` - Muted text
- `text-white` - Primary text
- `bg-neutral-900`, `bg-neutral-950` - Card backgrounds

---

## Development Patterns

### Code Generation Pattern
```javascript
const generateJaxCode = (layers, inputSize, optimized) => {
  if (optimized && allSameActivation(layers)) {
    // Loop-based template
  } else {
    // Explicit layer-by-layer template
  }
  return codeString
}
```

### SVG Visualization Pattern
```jsx
<svg width={canvasWidth} height={canvasHeight}>
  {/* Connections */}
  {layers.map((layer, idx) =>
    // Draw lines with weight-based styling
  )}
  {/* Neurons */}
  {layers.map((layer, idx) =>
    // Draw circles with activation-based fill
  )}
</svg>
```

### Section Data Structure (Tutorials)
```javascript
{
  id: 'section-id',
  title: 'Section Title',
  description: 'One-liner description',
  hasDynamicMode: true,
  code: `# Python code`,
  lineExplanations: [  // For Dynamic Mode
    { lines: [0, 2], text: `**Bold** explanation` },
  ],
  explanation: `Narrative explanation for Static Mode`
}
```

---

## User Preferences (NON-NEGOTIABLE)

Based on extensive user feedback:

1. **Cells MUST be editable** - Users should freely modify code
2. **Restore button** - Appears when code modified, resets to original
3. **NO fake "expected output"** - Only show real execution results
4. **Syntax highlighting required** - Code must be colored
5. **NO redirects to Colab** - User explicitly rejected this
6. **Engaging narrative explanations** - Story-like, not dry notes
7. **Blueprint metaphor for OOP** - User loves this
8. **No scrollbars in sims** - Everything must fit without scrolling
9. **Full-screen mode for Neural Net Lego** - Warning banner displayed

---

## Things NOT to Do

1. **Don't redirect to Colab** - User explicitly rejected
2. **Don't use Pyodide for JAX** - Needs server-side (XLA compilation)
3. **Don't add fake/staged output** - User called this "complete BS"
4. **Don't move `/public/pat-scan/`** - Static site, URL-dependent
5. **Don't write dry notebook-style explanations** - Make them engaging
6. **Don't add scrollbars to sims** - Calculate heights properly
7. **Don't change the divider position** - Currently frozen at 50%
8. **Don't add extra wrappers to Feynman sim** - User explicitly said "I WANT THE GAME I MADE TO APPEAR AS IT IS"
9. **Don't use intrusive modal dialogs for warnings** - Use non-intrusive banners that auto-hide

---

## Known Issues

| Issue | Location | Status |
|-------|----------|--------|
| Auto-scroll not working in Dynamic Mode | JaxRegression.jsx | Documented in `issues_20260111_185644.md` |
| Layout cramping - everything too cramped | FeynmanConservationSim.jsx | Documented in `FEYNMAN_SIM_TODO.md` |
| Garden, toybox, rug too small | FeynmanConservationSim.jsx | Documented in `FEYNMAN_SIM_TODO.md` |
| Save pop-up dialogs finnicky | FeynmanConservationSim.jsx | Documented in `FEYNMAN_SIM_TODO.md` |
| 30+ item testing checklist pending | FeynmanConservationSim.jsx | Documented in `FEYNMAN_SIM_TODO.md` |

---

## Future Development: ML Circuit Diagram

**Planned enhancement for JAX Regression tutorial**

A unified "circuit" metaphor that builds up as you progress:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   [Data Tank]  ──→  [Neural Net]  ──→  [Loss Meter]            │
│    x, y              (Lego sim)        predicted vs actual      │
│                          ↑                    │                 │
│                          │                    ▼                 │
│                    [Weight Updates]  ←──  [Optimizer]           │
│                                            🌀 (GPU fan)         │
│                          ↑                    │                 │
│                          └────── gradients ───┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Progressive Reveal Plan:
- Box 03: Data Tank appears
- Box 04: Neural Net Lego lights up
- Box 05: vmap "sprinkler" machine + data connection
- Box 06: Loss Meter connects
- Box 07: Gradient arrows appear
- Box 08: Optimizer (GPU fan) spins up
- Box 09: Full loop animates

### vmap Visualization Concept:
- Data tank = horizontal line of data points (batch)
- vmap machine = "sprinkler" that creates NN copies
- Drag NN into vmap → `jax.vmap(model)` appears
- Connect copies to data points → `(x_samples)` completes
- Visually shows WHY vmap exists: one model, many inputs

### Architecture Decision:
- Create `JaxRegressionCircuitSim.jsx` (tutorial-specific)
- NOT a general sim for `/interactive-sims`
- Copy and extend `NeuralNetLegoSim.jsx`
- Components: DataTank, VmapMachine, LossMeter, Optimizer, etc.

---

## File Reference

| File | Purpose | Importance |
|------|---------|------------|
| `FeynmanConservationSim.jsx` | Feynman blocks simulation (3,700+ lines) | ★★★★★ |
| `NeuralNetLegoSim.jsx` | Core NN builder component | ★★★★★ |
| `JaxRegression.jsx` | Flagship tutorial | ★★★★★ |
| `VeritasBluePi.jsx` | AI Physics Teacher vision | ★★★★★ |
| `SequenceConvergenceSim.jsx` | ε-N definition visualizer | ★★★★★ |
| `FEYNMAN_SIM_TODO.md` | Feynman sim known issues & testing checklist | ★★★★★ |
| `SunoSongs.jsx` | G Train audio player | ★★★★ |
| `ElectromagneticGeneratorSim.tsx` | EM physics simulation | ★★★★ |
| `Story.jsx` | Landing page narrative + The Thesis | ★★★★ |
| `Perspectives.jsx` | Broader Perspectives listing | ★★★★ |
| `PerspectivePage.jsx` | Individual perspective pages | ★★★★ |
| `App.jsx` | All routes | ★★★★ |
| `stations.js` | Subway stations data | ★★★ |
| `lines.js` | Subway lines data | ★★★ |
| `sunoSongs.js` | Song metadata and lyrics | ★★★ |
| `simulations.js` | Sim metadata | ★★★ |
| `index.css` | Theme + code styles | ★★★ |
| `tsconfig.json` | TypeScript configuration | ★★ |
| `ROADMAP.md` | Project roadmap and milestones | ★★★ |
| `PROJECT_STATUS.md` | Session-by-session progress log | ★★★ |

---

## Session History

### Major Milestones

**Phase 1: Foundation**
- NYC subway navigation system
- Basic page structure
- PAT Scan website integration

**Phase 2: Interactive Simulations**
- Earnshaw's Theorem sim
- Colliding Projectile sim
- Matrix Transforms sim
- Simulations gallery with filtering

**Phase 3: JAX Tutorial System**
- Binder integration (live code execution)
- Editable code cells
- Syntax highlighting
- Narrative explanations

**Phase 4: Dynamic Mode (Jan 2026)**
- Typing animation effect
- Line-by-line highlighting
- Step navigation
- Draggable divider
- Full-bleed containers

**Phase 5: Neural Net Lego (Jan 2026)**
- Visual NN builder from scratch
- 4-framework code generation
- Weight visualization (thickness/color)
- Activation visualization (fill opacity)
- Forward pass computation
- Input slider for live updates
- Integration into JAX Regression tutorial
- Raw/Optimized code toggle
- Double-click delete confirmation

**Phase 6: Code-Sim Consistency (Jan 2026)**
- Updated Box 04 code to match sim exactly
- Changed class from `SimpleMLP` to `MLP`
- Architecture: [1, 10, 10, 10, 1] with Sigmoid
- Updated all lineExplanations and explanations
- Fixed all `SimpleMLP` references throughout

**Phase 7: Electromagnetic Generator (Jan 13, 2026)**
- Added TypeScript support to the project (tsconfig.json, path aliases)
- Added lucide-react for icons
- Ported electromagnetic-sim from standalone project
- Created physics modules (dipoleField, flux, constants)
- Built 9 SVG components for the simulation
- Replaced shadcn components with Tailwind equivalents
- Integrated as 5th simulation on interactive sims page
- Features: rotating magnet, field lines, coil, light bulb, draggable compass

**Phase 8: The Thesis (Jan 14, 2026)**
- Added philosophical framing to landing page (Story.jsx)
- Connected AI alignment, physics thinking, and PINNs
- Articulated the "White Mirror" vision for human-AI collaboration
- BCIs, imagination, taste, and deep domain expertise as future differentiators

**Phase 9: Suno Songs - G Train (Jan 15, 2026)**
- First live station on G Train (Generative Art line)
- Audio player with play/pause/stop, seekable progress bar
- 4 songs: rap-rock, golden era Hindi, Marathi lavani
- "The Story" section with physicist's methodology cards
- Renamed MP3 files to URL-safe kebab-case

**Phase 10: Veritas^(Blue·Pi) (Jan 15, 2026)**
- Vision page for AI Physics Teacher (Veritasium + 3Blue1Brown fusion)
- Dual train badges (P + E) matching landing page style
- Documented the two challenges: cinematic coherence + mathematical precision
- Eugenia Etkina collaboration story
- YouTube proof-of-concept embed: "The Mystery Bottle"
- Station live on P Train and E Train

**Phase 11: Sequence Convergence Simulation (Jan 17, 2026)**
- 6th interactive simulation added to the gallery
- Interactive ε-N definition visualizer for Real Analysis
- Three sequence types: Monotonic, Oscillating, Noisy (with difficulty gradient)
- Challenge Mode with locked Tolerance pane (no layout shift)
- Prominent red definition display: ∀ε > 0, ∃N ∈ ℕ such that n ≥ N ⟹ |xₙ − L| < ε
- Philosophy box explaining pedagogical approach
- Responsive layout: Legend + Challenge Mode on right in fullscreen
- Convergent progress bar above main plot
- Split-screen mode shows fullscreen recommendation notice
- Canvas-based visualization with DPI scaling

**Phase 12: AI Classroom Experiment (Jan 17, 2026)**
- Novel pedagogical testing methodology using AI student agents
- Created 15 student agents with distinct cognitive profiles
- Ran within-subjects experiment: Control (symbolic) vs Treatment (simulation)
- Target audience validated: Priya (physics intuition) → Yuki (IMO gold)
- Key discovery: CS students framed it as "spec vs implementation"
- Critical validation: Raj (memorizer) showed zero improvement — mirrors real pre-med behavior
- Actionable features identified from Elena Z. (triple olympiad gold)
- Created detailed markdown report: `AI_CLASSROOM_EXPERIMENT_REPORT.md`
- Created PDF report generator: `scripts/generate_ai_classroom_report.py`
- Established AI Classroom as rapid iteration layer before real user testing

**Phase 13: Broader Perspectives Section (Jan 18, 2026)**
- Added third "Lower Exit" to Teaching PINNs hub: "Broader Perspectives St & Artifacts Ave"
- Created `Perspectives.jsx` listing page and `PerspectivePage.jsx` template
- Two expert conversations added with YouTube embeds:
  - Prof. Roarke Horstmeyer (Duke) — ML for Optics, Complex Numbers, Physical Layers
  - Dr. Rachel Akeson (IPAC Caltech) — LLMs for Astrophysics, AI-driven efficiency
- Expands AI for Science context beyond PINNs

**Phase 14: Feynman Conservation of Energy Simulation (Jan 21, 2026)**
- 7th interactive simulation added to the gallery
- 3,700+ line interactive recreation of Feynman's "Dennis the Menace blocks" analogy
- Based on Feynman Lectures Vol I, Ch 4, Sec 4-1 "What is Energy?"
- Three modes: Plot (read Feynman text), Playground (free exploration), Game (inference challenge)
- Features: 28 blocks, toybox, bathtub, rug, garden, scale, ruler, calculator
- Dark mode fixes: Plot background, 50px scrollbar, equation boxes, landing pages, header
- Replaced intrusive modal split-screen warning with non-intrusive amber banner
- Created `FEYNMAN_SIM_TODO.md` documenting known issues:
  - Layout cramping — needs breathing room
  - Garden, toybox, rug too small
  - Save pop-up dialogs finnicky
  - 30+ item testing checklist pending
- Files created: `FeynmanConservationSim.jsx`, `FeynmanConservation.jsx`, card image

---

## Notable Collaborations & Recognition

The user has a track record of getting quick responses from physics/education luminaries:

| Person | Affiliation | Connection |
|--------|-------------|------------|
| **Florian Marquardt** | MPI | Invited talk alongside Nobel laureates |
| **HC Verma** | IIT Kanpur | Author of legendary *Concepts of Physics* |
| **Steven Strogatz** | Cornell | Nonlinear dynamics, math communication |
| **Carl Wieman** | Stanford (Nobel 2001) | Founded PhET simulations |
| **Eugenia Etkina** | Rutgers | Active collaboration on videobooks |
| **Roarke Horstmeyer** | Duke University | Conversation on ML for Optics, Complex Numbers |
| **Rachel Akeson** | IPAC Caltech | Conversation on LLMs for Astrophysics |

---

## What Makes This Special

This isn't just a portfolio site. It's a **proof of concept** for a new kind of educational content:

1. **Visual-first learning**: See the architecture, then understand the code
2. **Interactive exploration**: Change things, see immediate results
3. **Progressive disclosure**: Complexity revealed as needed
4. **Code-diagram consistency**: What you build = what you see in code
5. **Multi-framework translation**: Same architecture, different languages

The user's insight is profound: as AI gets better at writing code, the valuable human skill becomes **understanding** — and this site makes that understanding visceral.

---

## AI Classroom Methodology (★ NOVEL RESEARCH APPROACH ★)

**Developed:** January 17, 2026

A novel approach to pedagogical testing using AI student agents as rapid proxies for real students.

### The Concept

Instead of waiting weeks to recruit real students for user testing, create AI agents with distinct cognitive profiles and run them through educational content. This surfaces:

1. Which student archetypes benefit most from a simulation
2. Unexpected insights and framings
3. Feature suggestions from "expert" perspectives
4. Edge cases and failure modes

### The Experiment: Sequence Convergence Simulation

**Design:** Within-subjects (same agent experiences both conditions)
- **Control:** Traditional symbolic ε-N definition
- **Treatment:** Interactive simulation walkthrough description

**15 AI Student Agents Created:**

| Category | Agents |
|----------|--------|
| Freshman (10) | priya-physics-kid, geometry-marcus, luna-art-student, sasha-computational-kid, wei-philosopher-student, skeptical-engineering-student, elena-symbolic-math-student, raj-memorizer-student, tyler-overconfident-freshman, math-anxious-student-amy |
| Olympiad (5) | yuki-tanaka-math-evaluator (IMO), ipho-gold-medalist, ioi-gold-medalist, triple-gold-prodigy, jee-air-1 |

### Key Results

**Target Audience (Priya → Yuki):** Mean improvement +0.57 points

| Student | Profile | Δ | Key Insight |
|---------|---------|---|-------------|
| Priya | Physics intuition | +2 | "N is a FUNCTION of ε" |
| Sasha | CS freshman | +1 | "Definition = spec, Simulation = implementation" |
| Viktor | IOI gold | +1 | "Definition = spec, Simulation = implementation" |
| Elena Z. | Triple gold | +0.05 | Custom sequences, wrong L attempts, N(ε) staircase |

### Critical Discoveries

1. **Spec vs Implementation Framing**: Two CS students (Sasha, Viktor) independently articulated: "The definition is the specification, the simulation is the implementation." Powerful for computational thinkers.

2. **The Raj Effect**: Memorizer agent showed zero improvement — asked "What are the steps?" instead of exploring. **This perfectly mirrors Vivek's real experience teaching pre-med students.** Validates target audience selection.

3. **Tyler Humbling**: Overconfident student went from 9/10 → 7/10. Challenge Mode exposed false confidence. This is a SUCCESS of the simulation.

4. **Ceiling Effects with Value**: Olympiad students showed minimal improvement (already understood) but provided the most actionable feature suggestions.

### Limitations Discovered

- Some agents gave idealized responses (Amy +5, Luna +3) — flagged as unrealistic
- Expert human judgment needed to validate against real classroom experience
- Treatment was description of simulation, not actual interaction

### Target Audience Confirmed

**Build for:** Physics-intuition freshman (Priya) → IMO gold medalist (Yuki)
**NOT for:** Procedural memorizers (Raj), math-anxious students needing validation

### Actionable Feature Backlog (from Elena Z.)

| Feature | Difficulty | Impact |
|---------|------------|--------|
| Custom sequence input (user-defined formulas) | Medium | High for advanced users |
| Wrong limit attempts (guess L, see what happens) | Low | High for all users |
| N(ε) staircase visualization | Medium | Medium |

### Insight Implemented (The Loop Closed!)

The "spec vs implementation" framing from Sasha and Viktor was added directly to the simulation's Philosophy box:

> *"For the computational thinkers: the definition is the **specification**, this simulation is the **implementation**."*

This was suggested by Claude (the chatbot) after reading the experiment results — demonstrating that insights from AI Classroom can flow directly into product improvements.

### Files Created

- `AI_CLASSROOM_EXPERIMENT_REPORT.md` — Full detailed report (for Claude instances)
- `scripts/generate_ai_classroom_report.py` — PDF report generator with charts

### The Methodology Going Forward

**Traditional approach:**
1. Build simulation → 2. Run user study (weeks) → 3. Iterate → 4. Repeat

**AI Classroom approach:**
1. Build simulation → 2. Create AI student agents → 3. Run rapid experiments (hours) → 4. Identify patterns → 5. THEN run real user study with better hypotheses

This is not a replacement for real user testing — it's a **rapid iteration layer** that comes before it.

---

## Enforce Consistency on Requested Changes

When changes are requested, do not hyper-focus on local things. A given change possibly applies in multiple places — apply it so consistency is enforced throughout and nothing breaks. Even if it applies in only one place, apply it in a way that keeps the whole consistent.

**Exception:** battle-tested places that work well — don't touch those. Everywhere else, apply it.

(Dictated by Vivek, 2026-08-27.)
