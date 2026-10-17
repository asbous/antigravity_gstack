# Antigravity Workflows & Slash Commands Index

This catalog registers all **57 specialist workflows** available in Google Antigravity IDE, powered by the Gemini Flash model family.

## Quick Reference by Category

### Plan-Mode Reviews

| Command | Specialist Role | Purpose |
|---|---|---|
| `/autoplan` | **Executive Review Orchestrator** | Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them sequentially with auto-decisions using 6 decision principles. |
| `/design-consultation` | **Design Systems Architect** | "Design consultation: understands your product, researches the landscape, proposes a complete design system (aesthetic, typography, color, layout, spacing, motion), and generates font+color preview... " |
| `/office-hours` | **YC Partner & Product Strategist** | YC Office Hours — two modes. |
| `/plan-ceo-review` | **Founder / Chief Executive Officer Reviewer** | CEO/founder-mode plan review. |
| `/plan-design-review` | **Principal Product Designer & UX Architect** | Designer's eye plan review — interactive, like CEO and Eng review. |
| `/plan-devex-review` | **Head of Developer Experience & SDK Architect** | Interactive developer experience plan review. |
| `/plan-eng-review` | **Principal Software Engineer & Engineering Manager** | Eng manager-mode plan review. |
| `/plan-tune` | **Autonomous Tuning Specialist** | "Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). " |
| `/spec` | **Product Systems Architect & Specification Engineer** | Turn vague intent into a precise, executable spec in five phases. |

### Implementation & Quality

| Command | Specialist Role | Purpose |
|---|---|---|
| `/claude-code` | **Independent LLM Reviewer (Claude)** | Claude Code CLI second opinion for non-Claude Code hosts. Review a diff, challenge a change for failure modes, or consult Claude with read-only repo access and session continuity. Use for "claude review", "claude challenge", "ask claude", or an explicit Claude Code second opinion. |
| `/codex` | **Independent LLM Reviewer (Codex)** | OpenAI Codex CLI wrapper — three modes. |
| `/design-html` | **Pretext-Native Frontend Specialist** | "Design finalization: generates production-quality Pretext-native HTML/CSS. " |
| `/design-review` | **Design QA Lead & Visual Systems Auditor** | "Designer's eye QA: finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns, and slow interactions — then fixes them. " |
| `/design-shotgun` | **Exploratory UI/UX Designer** | "Design shotgun: generate multiple AI design variants, open a comparison board, collect structured feedback, and iterate. " |
| `/deslop-shared-libs` | **Refactoring & Architecture Specialist** | Find worthwhile shared-code extractions in recent work. |
| `/devex-review` | **Developer Experience Auditor** | Live developer experience audit. |
| `/investigate` | **Senior Systems Debugger & Root Cause Investigator** | Systematic debugging with root cause investigation. |
| `/qa` | **Lead QA Automation Engineer & Regression Specialist** | Fix browser/API/CLI/job/worker/webhook bugs. |
| `/qa-only` | **Independent Verification & QA Auditor** | Report browser/API/CLI/job/worker/webhook bugs. |
| `/review` | **Staff Code Reviewer & Production Safety Lead** | Pre-landing PR review. |
| `/test-audit` | **Test Architecture Specialist** | Find low-value or duplicate tests and the test-only code they keep alive. |

### Release & Deploy

| Command | Specialist Role | Purpose |
|---|---|---|
| `/canary` | **Production Telemetry & Canary Monitor** | Post-deploy canary monitoring. |
| `/document-generate` | **Diataxis Documentation Architect** | Generate missing documentation from scratch for a feature, module, or entire project. |
| `/document-release` | **Technical Documentation Lead** | Release documentation audit. |
| `/gstack-upgrade` | **Platform Maintenance Engineer** | Upgrade gstack to the latest version. |
| `/land-and-deploy` | **Deployment & Site Reliability Engineer** | Land and deploy workflow. |
| `/landing-report` | **Release Operations Lead** | Read-only queue dashboard for workspace-aware ship. |
| `/setup-deploy` | **Cloud Infrastructure & Deploy Specialist** | Configure deployment settings for /land-and-deploy. |
| `/ship` | **Principal Release Engineer & Gatekeeper** | "Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create PR. " |

### Browser & Automation

| Command | Specialist Role | Purpose |
|---|---|---|
| `/browse` | **Browser Automation & Headless Chromium Operator** | "Drive a real browser through Aside: open a page, read it, click through a flow, take screenshots, check console errors. " |
| `/open-gstack-browser` | **Interactive Browser Navigator** | Launch GStack Browser — AI-controlled Chromium with the sidebar extension baked in. |
| `/pair-agent` | **Remote Agent Pairing Coordinator** | Pair a remote AI agent with your browser. |
| `/scrape` | **Web Data Extraction Specialist** | Pull data from a web page through the Aside browser — your real, already signed-in sessions. |
| `/setup-browser-cookies` | **Session & Cookie Provisioning Specialist** | Import cookies from your real Chromium browser into the headless browse session. |
| `/skillify` | **Browser Workflow Codifier** | Codify the most recent successful /scrape flow into a permanent browser-skill on disk. |

### iOS Live-Device QA

| Command | Specialist Role | Purpose |
|---|---|---|
| `/ios-clean` | **iOS Release Packaging Specialist** | "Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. " |
| `/ios-design-review` | **Apple HIG Design Specialist** | Visual design audit for iOS apps on real hardware. |
| `/ios-fix` | **Autonomous iOS Bug Fixer** | Autonomous iOS bug fixer. |
| `/ios-qa` | **iOS Live-Device QA Specialist** | Live-device iOS QA for SwiftUI apps. |
| `/ios-sync` | **iOS Debug Bridge Specialist** | Regenerate the iOS debug bridge against the latest upstream gstack templates. |

### Operational & Memory

| Command | Specialist Role | Purpose |
|---|---|---|
| `/benchmark` | **Web Performance & Core Web Vitals Engineer** | Web performance regression detection. |
| `/benchmark-models` | **AI Benchmarking Specialist** | Cross-model benchmark for gstack skills. |
| `/context-restore` | **Session State Restorer** | Restore working context saved earlier by /context-save. |
| `/context-save` | **Session Context Architect** | Save working context. |
| `/cso` | **Chief Security Officer** | "Security audit: supported static findings; qualified profiles add reproduction and repair candidates. " |
| `/eval-plan` | **Empirical Evaluation Architect** | Preregister a paid eval (bars, arms, decoys, stop rules), dry-run it at zero cost, then run a three-item priced pilot whose spend table gates approval. |
| `/health` | **Codebase Health & Static Analysis Auditor** | Code quality dashboard. |
| `/learn` | **Organizational Learning & Memory Manager** | Manage project learnings. |
| `/retro` | **Engineering Retrospective Lead** | Weekly engineering retrospective. |
| `/setup-gbrain` | **Cross-Machine Memory Coordinator** | "Set up gbrain for this coding agent: install the CLI, initialize a local PGLite or Supabase brain, register MCP, capture per-remote trust policy. " |
| `/sync-gbrain` | **Knowledge Graph Synchronizer** | Keep gbrain current with this repo's code and refresh agent search guidance in CLAUDE.md. |

### Safety & Scoping

| Command | Specialist Role | Purpose |
|---|---|---|
| `/careful` | **Destructive Command Guardrail** | Safety guardrails for destructive commands. |
| `/diagram` | **Visual Architecture & Diagramming Specialist** | "Turn an English description (or mermaid source) into a diagram triplet: the source, an editable .excalidraw file you can open on excalidraw.com, and rendered SVG + PNG. " |
| `/freeze` | **Directory Scope Enforcer** | Restrict file edits to a specific directory for the session. |
| `/guard` | **Composite Safety & Guardrail Controller** | "Full safety mode: destructive command warnings + directory-scoped edits. " |
| `/make-pdf` | **Typesetting & Publication Specialist** | Turn any markdown file into a publication-quality PDF. |
| `/unfreeze` | **Scope Restriction Releaser** | Clear the freeze boundary set by /freeze, allowing edits to all directories again. |

---

## Workflow Details

### `/autoplan` — Executive Review Orchestrator
- **Category**: Plan-Mode Reviews
- **Description**: Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them sequentially with auto-decisions using 6 decision principles.
- **Skill Path**: [`.agent/skills/autoplan/SKILL.md`](file:///./.agent/skills/autoplan/SKILL.md)
- **Voice / Text Triggers**: `"run all reviews"`, `"automatic review pipeline"`, `"auto plan review"`

### `/benchmark` — Web Performance & Core Web Vitals Engineer
- **Category**: Operational & Memory
- **Description**: Web performance regression detection.
- **Skill Path**: [`.agent/skills/benchmark/SKILL.md`](file:///./.agent/skills/benchmark/SKILL.md)
- **Voice / Text Triggers**: `"web performance benchmark"`, `"check page speed"`, `"detect page performance regression"`

### `/benchmark-models` — AI Benchmarking Specialist
- **Category**: Operational & Memory
- **Description**: Cross-model benchmark for gstack skills.
- **Skill Path**: [`.agent/skills/benchmark-models/SKILL.md`](file:///./.agent/skills/benchmark-models/SKILL.md)
- **Voice / Text Triggers**: `"cross model benchmark"`, `"compare claude gpt gemini"`, `"benchmark skill across models"`, `"which model should I use"`

### `/browse` — Browser Automation & Headless Chromium Operator
- **Category**: Browser & Automation
- **Description**: "Drive a real browser through Aside: open a page, read it, click through a flow, take screenshots, check console errors. "
- **Skill Path**: [`.agent/skills/browse/SKILL.md`](file:///./.agent/skills/browse/SKILL.md)
- **Voice / Text Triggers**: `"browse a page"`, `"open this url"`, `"take page screenshot"`

### `/canary` — Production Telemetry & Canary Monitor
- **Category**: Release & Deploy
- **Description**: Post-deploy canary monitoring.
- **Skill Path**: [`.agent/skills/canary/SKILL.md`](file:///./.agent/skills/canary/SKILL.md)
- **Voice / Text Triggers**: `"monitor after deploy"`, `"canary check"`, `"watch for errors post-deploy"`

### `/careful` — Destructive Command Guardrail
- **Category**: Safety & Scoping
- **Description**: Safety guardrails for destructive commands.
- **Skill Path**: [`.agent/skills/careful/SKILL.md`](file:///./.agent/skills/careful/SKILL.md)
- **Voice / Text Triggers**: `"be careful"`, `"warn before destructive"`, `"safety mode"`

### `/claude-code` — Independent LLM Reviewer (Claude)
- **Category**: Implementation & Quality
- **Description**: Claude Code CLI second opinion for non-Claude Code hosts. Review a diff, challenge a change for failure modes, or consult Claude with read-only repo access and session continuity. Use for "claude review", "claude challenge", "ask claude", or an explicit Claude Code second opinion.
- **Skill Path**: [`.agent/skills/claude-code/SKILL.md`](file:///./.agent/skills/claude-code/SKILL.md)
- **Voice / Text Triggers**: `"claude review"`, `"claude challenge"`, `"ask claude"`

### `/codex` — Independent LLM Reviewer (Codex)
- **Category**: Implementation & Quality
- **Description**: OpenAI Codex CLI wrapper — three modes.
- **Skill Path**: [`.agent/skills/codex/SKILL.md`](file:///./.agent/skills/codex/SKILL.md)
- **Voice / Text Triggers**: `"codex review"`, `"second opinion"`, `"outside voice challenge"`

### `/context-restore` — Session State Restorer
- **Category**: Operational & Memory
- **Description**: Restore working context saved earlier by /context-save.
- **Skill Path**: [`.agent/skills/context-restore/SKILL.md`](file:///./.agent/skills/context-restore/SKILL.md)
- **Voice / Text Triggers**: `"resume where i left off"`, `"restore context"`, `"where was i"`, `"pick up where i left off"`, `"context restore"`

### `/context-save` — Session Context Architect
- **Category**: Operational & Memory
- **Description**: Save working context.
- **Skill Path**: [`.agent/skills/context-save/SKILL.md`](file:///./.agent/skills/context-save/SKILL.md)
- **Voice / Text Triggers**: `"save progress"`, `"save state"`, `"save my work"`, `"context save"`

### `/cso` — Chief Security Officer
- **Category**: Operational & Memory
- **Description**: "Security audit: supported static findings; qualified profiles add reproduction and repair candidates. "
- **Skill Path**: [`.agent/skills/cso/SKILL.md`](file:///./.agent/skills/cso/SKILL.md)
- **Voice / Text Triggers**: `"security audit"`, `"check for vulnerabilities"`, `"owasp review"`

### `/design-consultation` — Design Systems Architect
- **Category**: Plan-Mode Reviews
- **Description**: "Design consultation: understands your product, researches the landscape, proposes a complete design system (aesthetic, typography, color, layout, spacing, motion), and generates font+color preview... "
- **Skill Path**: [`.agent/skills/design-consultation/SKILL.md`](file:///./.agent/skills/design-consultation/SKILL.md)
- **Voice / Text Triggers**: `"design system"`, `"create a brand"`, `"design from scratch"`

### `/design-html` — Pretext-Native Frontend Specialist
- **Category**: Implementation & Quality
- **Description**: "Design finalization: generates production-quality Pretext-native HTML/CSS. "
- **Skill Path**: [`.agent/skills/design-html/SKILL.md`](file:///./.agent/skills/design-html/SKILL.md)
- **Voice / Text Triggers**: `"build the design"`, `"code the mockup"`, `"make design real"`

### `/design-review` — Design QA Lead & Visual Systems Auditor
- **Category**: Implementation & Quality
- **Description**: "Designer's eye QA: finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns, and slow interactions — then fixes them. "
- **Skill Path**: [`.agent/skills/design-review/SKILL.md`](file:///./.agent/skills/design-review/SKILL.md)
- **Voice / Text Triggers**: `"visual design audit"`, `"design qa"`, `"fix design issues"`

### `/design-shotgun` — Exploratory UI/UX Designer
- **Category**: Implementation & Quality
- **Description**: "Design shotgun: generate multiple AI design variants, open a comparison board, collect structured feedback, and iterate. "
- **Skill Path**: [`.agent/skills/design-shotgun/SKILL.md`](file:///./.agent/skills/design-shotgun/SKILL.md)
- **Voice / Text Triggers**: `"explore design variants"`, `"show me design options"`, `"visual design brainstorm"`

### `/deslop-shared-libs` — Refactoring & Architecture Specialist
- **Category**: Implementation & Quality
- **Description**: Find worthwhile shared-code extractions in recent work.
- **Skill Path**: [`.agent/skills/deslop-shared-libs/SKILL.md`](file:///./.agent/skills/deslop-shared-libs/SKILL.md)
- **Voice / Text Triggers**: `"find code worth sharing"`, `"shared-code extraction opportunities"`

### `/devex-review` — Developer Experience Auditor
- **Category**: Implementation & Quality
- **Description**: Live developer experience audit.
- **Skill Path**: [`.agent/skills/devex-review/SKILL.md`](file:///./.agent/skills/devex-review/SKILL.md)
- **Voice / Text Triggers**: `"live dx audit"`, `"test developer experience"`, `"measure onboarding time"`

### `/diagram` — Visual Architecture & Diagramming Specialist
- **Category**: Safety & Scoping
- **Description**: "Turn an English description (or mermaid source) into a diagram triplet: the source, an editable .excalidraw file you can open on excalidraw.com, and rendered SVG + PNG. "
- **Skill Path**: [`.agent/skills/diagram/SKILL.md`](file:///./.agent/skills/diagram/SKILL.md)
- **Voice / Text Triggers**: `"make a diagram"`, `"draw a diagram"`, `"create a flowchart"`, `"diagram this"`, `"visualize this flow"`, `"architecture diagram"`

### `/document-generate` — Diataxis Documentation Architect
- **Category**: Release & Deploy
- **Description**: Generate missing documentation from scratch for a feature, module, or entire project.
- **Skill Path**: [`.agent/skills/document-generate/SKILL.md`](file:///./.agent/skills/document-generate/SKILL.md)
- **Voice / Text Triggers**: `"write docs for this"`, `"generate documentation"`, `"document this feature"`, `"create a tutorial"`, `"write a how-to"`, `"explain this module"`, `"docs for this project"`

### `/document-release` — Technical Documentation Lead
- **Category**: Release & Deploy
- **Description**: Release documentation audit.
- **Skill Path**: [`.agent/skills/document-release/SKILL.md`](file:///./.agent/skills/document-release/SKILL.md)
- **Voice / Text Triggers**: `"update docs after ship"`, `"document what changed"`, `"post-ship docs"`

### `/eval-plan` — Empirical Evaluation Architect
- **Category**: Operational & Memory
- **Description**: Preregister a paid eval (bars, arms, decoys, stop rules), dry-run it at zero cost, then run a three-item priced pilot whose spend table gates approval.
- **Skill Path**: [`.agent/skills/eval-plan/SKILL.md`](file:///./.agent/skills/eval-plan/SKILL.md)
- **Voice / Text Triggers**: `"plan an eval"`, `"preregister an eval"`, `"how much will this eval cost"`, `"pilot the eval"`

### `/freeze` — Directory Scope Enforcer
- **Category**: Safety & Scoping
- **Description**: Restrict file edits to a specific directory for the session.
- **Skill Path**: [`.agent/skills/freeze/SKILL.md`](file:///./.agent/skills/freeze/SKILL.md)
- **Voice / Text Triggers**: `"freeze edits to directory"`, `"lock editing scope"`, `"restrict file changes"`

### `/gstack-upgrade` — Platform Maintenance Engineer
- **Category**: Release & Deploy
- **Description**: Upgrade gstack to the latest version.
- **Skill Path**: [`.agent/skills/gstack-upgrade/SKILL.md`](file:///./.agent/skills/gstack-upgrade/SKILL.md)
- **Voice / Text Triggers**: `"upgrade gstack"`, `"update gstack version"`, `"get latest gstack"`

### `/guard` — Composite Safety & Guardrail Controller
- **Category**: Safety & Scoping
- **Description**: "Full safety mode: destructive command warnings + directory-scoped edits. "
- **Skill Path**: [`.agent/skills/guard/SKILL.md`](file:///./.agent/skills/guard/SKILL.md)
- **Voice / Text Triggers**: `"full safety mode"`, `"guard against mistakes"`, `"maximum safety"`

### `/health` — Codebase Health & Static Analysis Auditor
- **Category**: Operational & Memory
- **Description**: Code quality dashboard.
- **Skill Path**: [`.agent/skills/health/SKILL.md`](file:///./.agent/skills/health/SKILL.md)
- **Voice / Text Triggers**: `"code health check"`, `"quality dashboard"`, `"how healthy is codebase"`

### `/investigate` — Senior Systems Debugger & Root Cause Investigator
- **Category**: Implementation & Quality
- **Description**: Systematic debugging with root cause investigation.
- **Skill Path**: [`.agent/skills/investigate/SKILL.md`](file:///./.agent/skills/investigate/SKILL.md)
- **Voice / Text Triggers**: `"debug this"`, `"fix this bug"`, `"why is this broken"`, `"root cause analysis"`, `"investigate this error"`

### `/ios-clean` — iOS Release Packaging Specialist
- **Category**: iOS Live-Device QA
- **Description**: "Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. "
- **Skill Path**: [`.agent/skills/ios-clean/SKILL.md`](file:///./.agent/skills/ios-clean/SKILL.md)
- **Voice / Text Triggers**: `"clean the ios debug bridge"`, `"remove debugbridge"`, `"strip the gstack ios instrumentation"`

### `/ios-design-review` — Apple HIG Design Specialist
- **Category**: iOS Live-Device QA
- **Description**: Visual design audit for iOS apps on real hardware.
- **Skill Path**: [`.agent/skills/ios-design-review/SKILL.md`](file:///./.agent/skills/ios-design-review/SKILL.md)
- **Voice / Text Triggers**: `"review the ios design"`, `"audit the iphone app visuals"`, `"design qa the ios app"`

### `/ios-fix` — Autonomous iOS Bug Fixer
- **Category**: iOS Live-Device QA
- **Description**: Autonomous iOS bug fixer.
- **Skill Path**: [`.agent/skills/ios-fix/SKILL.md`](file:///./.agent/skills/ios-fix/SKILL.md)
- **Voice / Text Triggers**: `"fix this ios bug"`, `"patch the iphone app"`, `"auto-fix the ios issue"`

### `/ios-qa` — iOS Live-Device QA Specialist
- **Category**: iOS Live-Device QA
- **Description**: Live-device iOS QA for SwiftUI apps.
- **Skill Path**: [`.agent/skills/ios-qa/SKILL.md`](file:///./.agent/skills/ios-qa/SKILL.md)
- **Voice / Text Triggers**: `"ios qa"`, `"test the iphone app"`, `"test the ipad app"`, `"test my ios app"`, `"find bugs on the device"`, `"qa the ios app"`

### `/ios-sync` — iOS Debug Bridge Specialist
- **Category**: iOS Live-Device QA
- **Description**: Regenerate the iOS debug bridge against the latest upstream gstack templates.
- **Skill Path**: [`.agent/skills/ios-sync/SKILL.md`](file:///./.agent/skills/ios-sync/SKILL.md)
- **Voice / Text Triggers**: `"resync the ios debug bridge"`, `"regenerate ios accessors"`, `"update the gstack ios instrumentation"`

### `/land-and-deploy` — Deployment & Site Reliability Engineer
- **Category**: Release & Deploy
- **Description**: Land and deploy workflow.
- **Skill Path**: [`.agent/skills/land-and-deploy/SKILL.md`](file:///./.agent/skills/land-and-deploy/SKILL.md)
- **Voice / Text Triggers**: `"merge and deploy"`, `"land the pr"`, `"ship to production"`

### `/landing-report` — Release Operations Lead
- **Category**: Release & Deploy
- **Description**: Read-only queue dashboard for workspace-aware ship.
- **Skill Path**: [`.agent/skills/landing-report/SKILL.md`](file:///./.agent/skills/landing-report/SKILL.md)
- **Voice / Text Triggers**: `"landing report"`, `"version queue"`, `"ship queue"`, `"what version comes next"`, `"show open PR versions"`

### `/learn` — Organizational Learning & Memory Manager
- **Category**: Operational & Memory
- **Description**: Manage project learnings.
- **Skill Path**: [`.agent/skills/learn/SKILL.md`](file:///./.agent/skills/learn/SKILL.md)
- **Voice / Text Triggers**: `"show learnings"`, `"what have we learned"`, `"manage project learnings"`

### `/make-pdf` — Typesetting & Publication Specialist
- **Category**: Safety & Scoping
- **Description**: Turn any markdown file into a publication-quality PDF.
- **Skill Path**: [`.agent/skills/make-pdf/SKILL.md`](file:///./.agent/skills/make-pdf/SKILL.md)
- **Voice / Text Triggers**: `"markdown to pdf"`, `"generate pdf"`, `"make pdf"`, `"export pdf"`

### `/office-hours` — YC Partner & Product Strategist
- **Category**: Plan-Mode Reviews
- **Description**: YC Office Hours — two modes.
- **Skill Path**: [`.agent/skills/office-hours/SKILL.md`](file:///./.agent/skills/office-hours/SKILL.md)
- **Voice / Text Triggers**: `"brainstorm this"`, `"is this worth building"`, `"help me think through"`, `"office hours"`

### `/open-gstack-browser` — Interactive Browser Navigator
- **Category**: Browser & Automation
- **Description**: Launch GStack Browser — AI-controlled Chromium with the sidebar extension baked in.
- **Skill Path**: [`.agent/skills/open-gstack-browser/SKILL.md`](file:///./.agent/skills/open-gstack-browser/SKILL.md)
- **Voice / Text Triggers**: `"open gstack browser"`, `"launch chromium"`, `"show me the browser"`

### `/pair-agent` — Remote Agent Pairing Coordinator
- **Category**: Browser & Automation
- **Description**: Pair a remote AI agent with your browser.
- **Skill Path**: [`.agent/skills/pair-agent/SKILL.md`](file:///./.agent/skills/pair-agent/SKILL.md)
- **Voice / Text Triggers**: `"pair with agent"`, `"connect remote agent"`, `"share my browser"`

### `/plan-ceo-review` — Founder / Chief Executive Officer Reviewer
- **Category**: Plan-Mode Reviews
- **Description**: CEO/founder-mode plan review.
- **Skill Path**: [`.agent/skills/plan-ceo-review/SKILL.md`](file:///./.agent/skills/plan-ceo-review/SKILL.md)
- **Voice / Text Triggers**: `"think bigger"`, `"expand scope"`, `"strategy review"`, `"rethink this plan"`

### `/plan-design-review` — Principal Product Designer & UX Architect
- **Category**: Plan-Mode Reviews
- **Description**: Designer's eye plan review — interactive, like CEO and Eng review.
- **Skill Path**: [`.agent/skills/plan-design-review/SKILL.md`](file:///./.agent/skills/plan-design-review/SKILL.md)
- **Voice / Text Triggers**: `"design plan review"`, `"review ux plan"`, `"check design decisions"`

### `/plan-devex-review` — Head of Developer Experience & SDK Architect
- **Category**: Plan-Mode Reviews
- **Description**: Interactive developer experience plan review.
- **Skill Path**: [`.agent/skills/plan-devex-review/SKILL.md`](file:///./.agent/skills/plan-devex-review/SKILL.md)
- **Voice / Text Triggers**: `"developer experience review"`, `"dx plan review"`, `"check developer onboarding"`

### `/plan-eng-review` — Principal Software Engineer & Engineering Manager
- **Category**: Plan-Mode Reviews
- **Description**: Eng manager-mode plan review.
- **Skill Path**: [`.agent/skills/plan-eng-review/SKILL.md`](file:///./.agent/skills/plan-eng-review/SKILL.md)
- **Voice / Text Triggers**: `"review architecture"`, `"eng plan review"`, `"check the implementation plan"`

### `/plan-tune` — Autonomous Tuning Specialist
- **Category**: Plan-Mode Reviews
- **Description**: "Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). "
- **Skill Path**: [`.agent/skills/plan-tune/SKILL.md`](file:///./.agent/skills/plan-tune/SKILL.md)
- **Voice / Text Triggers**: `"tune questions"`, `"stop asking me that"`, `"too many questions"`, `"show my profile"`, `"show my vibe"`, `"developer profile"`, `"turn off question tuning"`

### `/qa` — Lead QA Automation Engineer & Regression Specialist
- **Category**: Implementation & Quality
- **Description**: Fix browser/API/CLI/job/worker/webhook bugs.
- **Skill Path**: [`.agent/skills/qa/SKILL.md`](file:///./.agent/skills/qa/SKILL.md)
- **Voice / Text Triggers**: `"qa test this"`, `"find bugs on site"`, `"test the site"`

### `/qa-only` — Independent Verification & QA Auditor
- **Category**: Implementation & Quality
- **Description**: Report browser/API/CLI/job/worker/webhook bugs.
- **Skill Path**: [`.agent/skills/qa-only/SKILL.md`](file:///./.agent/skills/qa-only/SKILL.md)
- **Voice / Text Triggers**: `"qa report only"`, `"just report bugs"`, `"test but dont fix"`

### `/retro` — Engineering Retrospective Lead
- **Category**: Operational & Memory
- **Description**: Weekly engineering retrospective.
- **Skill Path**: [`.agent/skills/retro/SKILL.md`](file:///./.agent/skills/retro/SKILL.md)
- **Voice / Text Triggers**: `"weekly retro"`, `"what did we ship"`, `"engineering retrospective"`

### `/review` — Staff Code Reviewer & Production Safety Lead
- **Category**: Implementation & Quality
- **Description**: Pre-landing PR review.
- **Skill Path**: [`.agent/skills/review/SKILL.md`](file:///./.agent/skills/review/SKILL.md)
- **Voice / Text Triggers**: `"review this pr"`, `"code review"`, `"check my diff"`, `"pre-landing review"`

### `/scrape` — Web Data Extraction Specialist
- **Category**: Browser & Automation
- **Description**: Pull data from a web page through the Aside browser — your real, already signed-in sessions.
- **Skill Path**: [`.agent/skills/scrape/SKILL.md`](file:///./.agent/skills/scrape/SKILL.md)
- **Voice / Text Triggers**: `"scrape this page"`, `"get data from"`, `"pull from"`, `"extract from"`, `"what is on"`

### `/setup-browser-cookies` — Session & Cookie Provisioning Specialist
- **Category**: Browser & Automation
- **Description**: Import cookies from your real Chromium browser into the headless browse session.
- **Skill Path**: [`.agent/skills/setup-browser-cookies/SKILL.md`](file:///./.agent/skills/setup-browser-cookies/SKILL.md)
- **Voice / Text Triggers**: `"import browser cookies"`, `"login to test site"`, `"setup authenticated session"`

### `/setup-deploy` — Cloud Infrastructure & Deploy Specialist
- **Category**: Release & Deploy
- **Description**: Configure deployment settings for /land-and-deploy.
- **Skill Path**: [`.agent/skills/setup-deploy/SKILL.md`](file:///./.agent/skills/setup-deploy/SKILL.md)
- **Voice / Text Triggers**: `"configure deploy"`, `"setup deployment"`, `"set deploy platform"`

### `/setup-gbrain` — Cross-Machine Memory Coordinator
- **Category**: Operational & Memory
- **Description**: "Set up gbrain for this coding agent: install the CLI, initialize a local PGLite or Supabase brain, register MCP, capture per-remote trust policy. "
- **Skill Path**: [`.agent/skills/setup-gbrain/SKILL.md`](file:///./.agent/skills/setup-gbrain/SKILL.md)
- **Voice / Text Triggers**: `"setup gbrain"`, `"install gbrain"`, `"connect gbrain"`, `"start gbrain"`, `"configure gbrain"`

### `/ship` — Principal Release Engineer & Gatekeeper
- **Category**: Release & Deploy
- **Description**: "Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create PR. "
- **Skill Path**: [`.agent/skills/ship/SKILL.md`](file:///./.agent/skills/ship/SKILL.md)
- **Voice / Text Triggers**: `"ship it"`, `"create a pr"`, `"push to main"`, `"deploy this"`

### `/skillify` — Browser Workflow Codifier
- **Category**: Browser & Automation
- **Description**: Codify the most recent successful /scrape flow into a permanent browser-skill on disk.
- **Skill Path**: [`.agent/skills/skillify/SKILL.md`](file:///./.agent/skills/skillify/SKILL.md)
- **Voice / Text Triggers**: `"skillify"`, `"codify this scrape"`, `"save this scrape"`, `"make this permanent"`

### `/spec` — Product Systems Architect & Specification Engineer
- **Category**: Plan-Mode Reviews
- **Description**: Turn vague intent into a precise, executable spec in five phases.
- **Skill Path**: [`.agent/skills/spec/SKILL.md`](file:///./.agent/skills/spec/SKILL.md)
- **Voice / Text Triggers**: `"spec this out"`, `"file an issue"`, `"write up a ticket"`, `"turn this into an issue"`, `"make this a github issue"`, `"turn this into a backlog item"`

### `/sync-gbrain` — Knowledge Graph Synchronizer
- **Category**: Operational & Memory
- **Description**: Keep gbrain current with this repo's code and refresh agent search guidance in CLAUDE.md.
- **Skill Path**: [`.agent/skills/sync-gbrain/SKILL.md`](file:///./.agent/skills/sync-gbrain/SKILL.md)
- **Voice / Text Triggers**: `"sync gbrain"`, `"refresh gbrain"`, `"reindex repo"`, `"update gbrain"`

### `/test-audit` — Test Architecture Specialist
- **Category**: Implementation & Quality
- **Description**: Find low-value or duplicate tests and the test-only code they keep alive.
- **Skill Path**: [`.agent/skills/test-audit/SKILL.md`](file:///./.agent/skills/test-audit/SKILL.md)
- **Voice / Text Triggers**: `"audit the test suite"`, `"find low-value tests"`, `"prune useless tests"`

### `/unfreeze` — Scope Restriction Releaser
- **Category**: Safety & Scoping
- **Description**: Clear the freeze boundary set by /freeze, allowing edits to all directories again.
- **Skill Path**: [`.agent/skills/unfreeze/SKILL.md`](file:///./.agent/skills/unfreeze/SKILL.md)
- **Voice / Text Triggers**: `"unfreeze edits"`, `"unlock all directories"`, `"remove edit restrictions"`

