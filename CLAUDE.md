# CLAUDE.md — scottmagnacca-corporate

> **Read this file at the start of every session before doing anything else.**

---

## ⚠️ Universal Code Principles (Non-Negotiable)

All code in this project must follow the 4 Universal Code Principles:

1. **Think Before Coding** — Name assumptions, ask if confused, push back with simpler approaches
2. **Simplicity First** — Minimum code needed, no breaking changes, no speculative code
3. **Surgical Changes** — Only touch what the specific task requires, match existing style
4. **Goal-Driven Execution** — Convert vague goals to verifiable success criteria, iterate until test passes

See `~/.claude/memory/universal_code_principles.md` for full details. **These principles override project-specific rules when there is tension.**

---

## PROJECT INFO

| Field | Value |
|---|---|
| **Project name** | scottmagnacca-corporate (Scott Magnacca corporate landing page) |
| **Local Mac path** | `~/Documents/Claude/Projects/scottmagnacca-corporate/` |
| **GitHub repo** | https://github.com/smagnacca/scottmagnacca-corporate |
| **Netlify site** | scottmagnacca-corporate (ID: `5374582f-f39a-44c6-9bb6-dd0f04b80bb0`) |
| **Live URL** | https://scottmagnacca-corporate.netlify.app |
| **Branch** | main |
| **Deploy method** | GitHub Action triggers Netlify build hook on every push to main |

This is the canonical home for the corporate landing page. **Do NOT edit this site from any other folder** (in particular, not from `code-cowork-2026-7-marketing-outreach/landing-page/`). All work happens here.

---

## DEPLOYMENT

Pushing to `main` automatically triggers a Netlify deploy via:
- `.github/workflows/netlify-deploy.yml` — POSTs to the Netlify build hook
- Build hook ID: `69f66e4e85e009fa07cca87c`

Manual deploy fallback: `netlify deploy --prod --dir=. --site=5374582f-f39a-44c6-9bb6-dd0f04b80bb0`

**Always verify deploy is `state=ready` before reporting "live"** (see global rule §7a).

---

## HERMES / OLLAMA LOCAL-FIRST PROTOCOL — MANDATORY FOR MAJOR CHANGES

**Applies to every major change in this project. Follow Section 20 of `~/.claude/CLAUDE.md` ("STRATEGIC OPS & SWARM ORCHESTRATOR — LOCAL-FIRST EXECUTION") in full.**

A "major change" = anything beyond a typo fix or a single-line tweak. Examples that qualify:
- New section, component, or feature on the landing page
- Copy rewrites of more than one paragraph
- Visual/design changes (colors, animations, layout)
- New form, function, or integration
- Anything touching multiple files or affecting the live site experience

### The protocol — every major change runs through this:

1. **Triage first (§20.1)** — pick the cheapest tier that fits:
   - **Local Script** (Playwright, ffmpeg, grep, hermes-check.sh, Ollama) for mechanical work
   - **Single Agent** for linear/creative single-voice work
   - **Agent Swarm (Aurora)** only when work has independent sub-tasks + retrieval + critique

2. **Pre-Flight Cost Alert (§20.2)** — before executing, output exactly:
   > **Do you want me to use [Single Agent / Agent Swarm / Local Script] for [X]?**
   > - Estimated cost: ~N tokens.
   > - Local-on-Mac share: ~P% (Ollama, Playwright, FFmpeg, shell scripts, git).

   Wait for Scott's confirmation before proceeding.

3. **Local QA before any push** — use `~/.claude/hermes-check.sh` + Ollama llama3 for contrast, easing, and deploy checks. Use Playwright against the live URL after deploy completes.

4. **Push tokens to local compute first.** Only escalate to API calls when the local toolchain genuinely can't cover the work.

### Tools available globally
- `hermes` CLI: `/Users/scottmagnacca/.local/bin/hermes`
- `hermes-check.sh`: `~/.claude/hermes-check.sh`
- Ollama (llama3): local
- Playwright CLI v1.59.1: project-level
- ffmpeg, grep, git: shell

### Why this rule exists
Reflexive API calls for tasks a local script could do for free burn Scott's tokens. The Pre-Flight Cost Alert makes spend visible before the meter starts.

---

## SESSION START CHECKLIST

1. Read this file ✓
2. Read global `~/.claude/CLAUDE.md` Section 20 (Hermes/Ollama protocol) — confirm understanding
3. `git status` + `git log --oneline -3` — confirm clean working tree and current state
4. State in 2 sentences what was last done and what's next

---

## SESSION END CHECKLIST

1. Verify any pushes triggered Netlify deploy (`state=ready` confirmed)
2. Update this CLAUDE.md if anything structural changed
3. Commit + push to main (triggers auto-deploy)
