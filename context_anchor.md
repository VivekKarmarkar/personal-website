# Context Anchor

Append-only, timestamped, Vivek-dictated load-bearing context. Newest entry is current unless it says otherwise. On compaction: read this file first.

---

## 2026-08-27 18:56 EDT — Caching is an issue; we fix it later, not now

**Vivek's dictation (via goosemcptest relay):** caching IS an issue, and we will fix it later, not now.

**The finding being anchored:** Vivek hit a dead "Back to Claude Code OS Station" link on his phone tonight. Six emulated reproduction attempts (desktop click, phone tap, early tap, overlay probe, iframe scan, hub scan) reproduced nothing — the link navigates correctly on every fresh load. Diagnosis: a **stale tab across tonight's multiple redeploys** — old bundle JS in his open tab tried to lazy-load route chunks the new deploy had purged, the router fetch failed silently, and the click appeared to do nothing. **Confirmed by Vivek: after a hard refresh on his phone, the link works.**

**The deferred fix (do NOT build until he green-lights it):** chunk-load-error recovery — catch the failed dynamic-import/chunk fetch and reload the page once, so tabs left open across deploys self-heal instead of going dead.

**Current shipped state alongside (as of this anchor):**
- All fixes through commit `fce06a3` are live on vivekkarmarkar.vercel.app; main == origin/main, tree clean.
- Tonight's arc: Claude Code OS layered hub (MAIN + LIFE → Flight/Phone Call/News) + three Pattern C ports (`1461847`) → device-first ResolutionNotice standard (`295f328`) → Vivek's 4-agent fix round: tiles/hub banner/additive SKILL.md cards with redactions (`65e4484`) → combined Codex+CC review fixes: AutoHeightIframe, narrow-phone CSS, 3-col actions, NNLego PyTorch comma (`f6ab1af`, hardened `de85cca`) → AutoHeightIframe propagated to /claude-code-os/main (`fce06a3`). All verified on live via reviewer↔fixer loop (5/5) + independent re-verification.
- **Open item awaiting Vivek's call:** pre-existing internal horizontal overflow in the data portrait app (public/claude-code-os-app) at ≤350px widths — battle-tested class, not touched.

*Subordinate additions (Claude, non-contradicting): the review union file lives at `goose-mcp-tests/mcp_lean_project_webpages/codex_and_cc_relay_session_combined_feedback.md`; the porting system's learned rules from tonight are appended in `porting_context.md`; the chunk-error recovery, when green-lit, belongs in the React shell (a lazy-route error boundary or a `vite:preloadError` listener in `src/main.jsx`) — noted here only so the future session starts in the right file.*

---

## 2026-09-01 15:33 EDT — ARPD deployed as second W-line station

**Deployment:** "Agentic Research Beats Agentic Product Development — Hypothesis" ported as second W-line station (after AAD). Commit `459b973`, live at `https://vivekkarmarkar.vercel.app/agentic-research-vs-product`. Station label ARPD, Pattern A native rebuild (content-only essay — callout boxes, Research/Product comparison grid, no diagrams/citations/interactive elements). Source: `goose-mcp-tests/agentic_research_vs_product.html`. Verified on live at desktop 1440×900: W badge, orange HYPOTHESIS kicker, comparison grid two-column, all callouts rendered, prose verbatim. The ResolutionNotice component is applied (device-first standard, consistent with every other project page).

**Tag updates (commit `0526f0d`):** Professor Claude green row → LiveKit / DevRel / AI Startups; three life pages (flight/phone-call/news) → orange Skills/MCPs/Agentic Coding + blue Life Automation + green DevRel; Claude Code LM blue row → +Workflow Automation (2nd), EdTech demoted to 3rd; ARPD → AAD's rows + equally-bright blue "Product Development". **Follow-up (commit `2a2f0a3`):** life pages' first orange tag corrected from "Skills" to "Agent Skills."

---

## 2026-09-01 16:54 EDT — Current shipped state: all deployments live, tree clean

**Shipped and verified live on vivekkarmarkar.vercel.app (main at `2a2f0a3`):**
- ARPD deployed as second W-line station (`/agentic-research-vs-product`), Pattern A native rebuild with W badge, callout boxes, comparison grid, ResolutionNotice.
- Tag updates across five pages: Professor Claude (LiveKit/DevRel/AI Startups green row), three life pages (Agent Skills/MCPs/Agentic Coding orange + Life Automation blue + DevRel green), Claude Code LM (+Workflow Automation blue, EdTech demoted), ARPD (AAD's rows + Product Development blue).
- All prior fixes from the Aug 27 deployment round remain live: layered Claude Code OS hub, three Pattern C life pages with AutoHeightIframe, device-first ResolutionNotice across 12 pages, additive SKILL.md cards with privacy redactions, NNLego PyTorch comma fix.
- Open items unchanged: stale-tab caching fix deferred (do NOT build until green-lit); data portrait sub-350px internal overflow awaiting Vivek's call.

---

## 2026-09-02 02:19 EDT — Metro page removed; do not redeploy without Vivek's go

**Vivek's stated intent (via goosemcptest relay):** Metro page deployed 2026-09-01 then removed 2026-09-02 at Vivek's request (commit `9325cee`); do not redeploy without his explicit go. His words on the metro MCP: "is not working, it's not properly tested, I want that off my website."

*Subordinate (Claude): the source stays on disk at `goose-mcp-tests/metro_lean_project_website.html` + `metro_tools_eli5_grid.png`; the removal reversed deployment commit `a95ee2b` exactly (route, shell, hub LIFE exit, `public/metro-app`). Live-verified: hub back to Flight / Phone Call / News.*

---

## 2026-09-02 17:47 EDT — ClaudeSense deployed as the new last D-line station

**Vivek's placement (via goosemcptest relay):** ClaudeSense deployed 2026-09-02 (`f087a57`) on the D line after ClaudeCodeLM as the new last station, per Vivek's voice instruction; tags Claude Code → Agentic Coding / PhD Research / DevRel. His words: "deploy it on the AI demos line after Claude Code LM; the station is called ClaudeSense, C and S capital; it is the new last station on that line."

*Subordinate (Claude): live at `/claudesense`; Pattern C — `public/claudesense-app/index.html` iframed whole from `tekscan-connector/tekscan_project_website_working.html` (Codex's original `tekscan_project_website.html` untouched), masthead rebuilt natively, three youtube-nocookie embeds; D array in `lines.js` ends with `claudesense` (position 55). Verified live at four device regimes + arrival board.*
