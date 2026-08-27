# Vivek Karmarkar — Personal Website

An interactive, NYC-subway-themed portfolio and educational platform: physics, mathematics, and machine learning taught through hands-on simulations, plus a growing borough of Claude Code / AI-agent project stations.

## Overview

The site is organized as a subway map. Each **line** is a theme (P — AI for Physics, A — Physics for AI, E — Education, D — AI Demos, I — Claude Code Borough, W — Writing, G — Generative Art, S — Physics for Sports, F — Fun), and each **station** is a project page. The core philosophy: as AI gets better at writing code, the valuable human skill becomes *understanding* — so the flagship content makes the architecture-to-code mapping visceral instead of just presenting it.

Live site: [vivekkarmarkar.vercel.app](https://vivekkarmarkar.vercel.app) (pushes to `main` auto-deploy).

## Features

- **Subway navigation** — arrival board, line/station data driven from `src/data/`, transfer stations with dual badges
- **Interactive simulations** (`/interactive-sims`) — Earnshaw's Theorem, projectile motion, an electromagnetic generator (Faraday's law, TypeScript), matrix transforms, Neural Net Lego (visual NN builder that generates real JAX/PyTorch/TensorFlow/Julia code), ε-N sequence convergence, and Feynman's conservation-of-energy blocks game
- **Teaching PINNs hub** (`/teaching-pinns`) — lectures, coding tutorials (including a JAX regression tutorial with a typing-animation "Dynamic Mode"), and expert conversations
- **Claude Code OS station** (`/claude-code-os`) — a layered hub: the *main layer* is a data portrait of a 100+-skill personal operating system built on Claude Code; the *life layer* holds three MCP test-campaign pages (Kiwi flights, VOYP phone calls, Reddit news)
- **Project stations** ported from standalone reference sites (WONYP, Dancer Claude, Professor Claude, RCP, VM Claude, and more) — the porting system itself lives in-repo (`porting_context.md` + `workflows/`)
- **Writing line** — web editions of position papers, e.g. *Agentic Algorithm Discovery* (`/agentic-algorithm-discovery`)

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
npm install
npm run dev      # dev server (localhost:5173)
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Project Structure

```
src/
├── App.jsx            # all routes
├── components/        # Layout, Header, ArrivalBoard, Story, ThemeToggle
├── pages/             # one file per station (plus teaching-pinns/ and sims/ subtrees)
├── sims/              # simulation engines (physics/, maths/, ml/)
└── data/              # stations.js, lines.js, simulations.js, ...
public/
├── <station>-app/     # self-contained apps embedded via iframe (Pattern C ports)
└── images/, pat-scan/, generative-art/, ...
porting_context.md     # learned weights of the reference-site porting system
```

## Tech Stack

React 19 · Vite 7 · Tailwind CSS 4 · react-router 7 · Three.js (@react-three/fiber) · Recharts · Prism.js · TypeScript (per-sim, alongside JSX)

## License

No license file — all rights reserved. Content and projects © Vivek Karmarkar.
