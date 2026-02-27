# D Train Design — AI Demos Line

**Date:** 2026-02-27
**Status:** Approved
**Scope:** Line infrastructure only (Approach 1)

---

## Overview

Inaugurate the D Train — a new local line on AI Island for demo/portfolio-style AI projects. Gold color, 4 stations progressing from mainstream Applied AI to sci-fi Applied AI.

## Line Definition

| Field | Value |
|-------|-------|
| ID | D |
| Name | D Train |
| Full Name | AI Demos |
| Description | Applied AI project demos from mainstream to sci-fi |
| Direction | AI Island Local |
| Color | Gold `#FCCC0A` |
| Bullet Text | Black (not white — contrast on gold) |
| Line Order Position | After E, before G: `['P', 'A', 'E', 'D', 'G', 'S', 'F']` |

## Stations

| # | ID | Name | Full Name | Description | Position | Status |
|---|-----|------|-----------|-------------|----------|--------|
| 1 | wonyp | WONYP | What's on your Plate? | LLM-driven Indian Food Analysis | 10 | Ready (has URL) |
| 2 | gpt-bhojan | GPT-Bhojan | — | LLM-augmented Indian Food Classification | 20 | Coming soon |
| 3 | vm-claude | VM Claude | — | Claude plays games in the cloud | 30 | Coming soon |
| 4 | ai-professor | AI Professor | — | A Robot Teacher just for you | 40 | Coming soon |

Progression: mainstream -> sci-fi. WONYP and GPT-Bhojan are in the same "neighborhood" (both Indian food + LLMs).

## Arrival Time Overhaul

The arrival times are a personal statement — how close each vision is to reality.

| Line | Old ETA | New ETA | Signal |
|------|---------|---------|--------|
| D (AI Demos) | — | 1 min | Arriving now — ready to enter AI workforce |
| E (Education) | 3 min | 2 min | Sims live, vision clear |
| G (Generative Art) | 3 min | 2 min | Suno live |
| S (Sports) | 3 min | 2 min | Origin story, largely told |
| F (Fun) | 3 min | 3 min | Always running, no rush |
| P (AI for Physics) | 2 min | 5 min | Active research, ongoing |
| A (Physics for AI) | 5 min | 7 min | Long-haul theoretical work |

## Files Changed

| File | Change |
|------|--------|
| `src/data/lines.js` | Add D Train entry, update lineOrder |
| `src/data/stations.js` | Add 4 new station entries |
| `src/components/ArrivalBoard.jsx` | Update arrival times, black text for D bullet |

## Out of Scope

- No new routes in App.jsx
- No new page components
- No CSS changes
- WONYP page content is a future session
