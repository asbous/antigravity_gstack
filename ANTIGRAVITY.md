# gstack for Google Antigravity IDE (Gemini Flash)

The complete AI software engineering specialist ecosystem — adapted natively for **Google Antigravity IDE** and optimized for the **Gemini Flash model family**.

---

## 1. Overview

`gstack` provides a battle-tested fleet of **57 specialized engineering roles** (YC partner, CEO reviewer, principal systems architect, product designer, QA lead, release engineer, and root-cause investigator).

This adaptation removes proprietary Anthropic Claude Code assumptions (`AskUserQuestion`, `ExitPlanMode`, proprietary plan hooks) and rebuilds the workflow into a native Antigravity IDE toolkit optimized for Google's Gemini Flash models.

### Key Architectural Pillars
- **Decoupled from Claude-Specific Tooling**: Replaced proprietary tools with native Antigravity IDE primitives (`ask_question`, `view_file`, `replace_file_content`, `run_command`, `list_dir`, `grep_search`).
- **Antigravity Interactive Inquiry Protocol**: Replaces 4-option `AskUserQuestion` with structured Markdown decision briefs and native `ask_question` dialogs.
- **Live Execution Checklists**: Replaces `ExitPlanMode` with deterministic task lists (`[ ] Pending`, `[/] In Progress`, `[x] Completed`) tracked across every phase.
- **Gemini Flash Reasoning Scaffolds**: Explicit XML tag boundaries (`<role_definition>`, `<context_and_constraints>`, `<step_by_step_execution>`, `<output_format>`) and multi-pass reasoning pipelines to prevent context dropping.
- **Cross-Platform & Zero Vendor Lock-in**: Full support for Windows (PowerShell/Node.js), macOS, and Linux without requiring Bun.

---

## 2. Directory Layout & Customization Architecture

Antigravity IDE automatically discovers rules, skills, and workflows from the workspace root:

```text
.agent/ (and .agents/)
├── rules/
│   ├── 01-antigravity-core.md          # Core tool mappings, inquiry protocols & checklists
│   ├── 02-gemini-flash-guidelines.md   # Tag scaffolding, multi-pass decomposition & anti-hallucination
│   ├── 03-git-workflow.md              # Base branch detection, diff analysis & semantic commits
│   └── 04-safety-and-guardrails.md     # Destructive command interception & data preservation
├── skills.json                         # Complete machine-readable registry of all 57 slash commands
├── workflows.md                        # Interactive human- and agent-readable workflow reference
└── skills/                             # 57 Standardized Antigravity skill definitions
    ├── office-hours/SKILL.md
    ├── plan-ceo-review/SKILL.md
    ├── plan-eng-review/SKILL.md
    ├── plan-design-review/SKILL.md
    ├── review/SKILL.md
    ├── qa/SKILL.md
    ├── ship/SKILL.md
    └── ... (50 additional specialist skills)
```

---

## 3. Tool & Protocol Abstraction

### Native Antigravity Tool Mapping

| Intended Action | Claude Code Tool (Legacy) | Antigravity IDE Native Equivalent |
|---|---|---|
| Run terminal commands | `Bash` | `run_command` (PowerShell / Bash) |
| Read file content | `Read` | `view_file` (supports line slicing) |
| Surgical file edit | `Edit` | `replace_file_content` / `multi_replace_file_content` |
| Create / Overwrite file | `Write` | `write_to_file` |
| Search code / text | `Grep` | `grep_search` (ripgrep) |
| File discovery | `Glob` | `list_dir` |
| Human decision | `AskUserQuestion` (Max 4 choices) | `ask_question` / Structured Markdown decision brief |
| Subagent delegation | `Agent` | `invoke_subagent` / `browser_subagent` |
| Browser driving | Headless Chromium | Playwright / `browser_subagent` |

### Interactive Inquiries: Decision Briefs
In place of Claude's 4-option limit, Antigravity uses clear decision briefs:
```markdown
D1 — Choice of Architecture Pattern
Stakes: Determines migration complexity and rollback difficulty.
Recommendation: Option 1 because it eliminates state mutation side-effects.

1) [Recommended] Immutable Event Stream
   ✅ Guarantees auditability and replayability
   ❌ Slightly higher storage footprint
2) In-Place Database Mutation
   ✅ Simpler initial diff
   ❌ Difficult rollback if sync fails

Which option should we proceed with? (Reply with number or preference)
```

### Execution Tracking: Live Checklists
In place of `ExitPlanMode`, multi-step workflows maintain an active checklist:
```markdown
## Execution Checklist
- [x] Phase 1: Context Gathering & Boundary Discovery
- [/] Phase 2: Multi-Pass Code Review
- [ ] Phase 3: Synthesis, Verification & Next Steps
```

---

## 4. Gemini Flash Prompt Optimization

Gemini Flash models possess exceptional token throughput, fast processing speeds, and high structured extraction accuracy. The skill prompts are designed around three principles:

### 1. Tag-Delimited Structural Scaffolding
Every skill is framed with deterministic XML tags:
- `<role_definition>`: Defines identity, seniority, and authority.
- `<context_and_constraints>`: Grounding rules, forbidden operations, and boundaries.
- `<step_by_step_execution>`: Numbered, sequential execution phases.
- `<output_format>`: Enforces exact Markdown schemas, tables, and JSON outputs.

### 2. Multi-Pass Decomposition
Rather than attempting a complex code review in a single glance, tasks are broken into passes:
- **Pass 1: Architecture & Regressions** — Diff against merge base, verify contract preservation.
- **Pass 2: Edge Cases, Error Paths & Security** — Trace nulls, SQL safety, exception handling, race conditions.
- **Pass 3: Verification & Test Coverage** — Audit test fixtures, verify syntax, confirm zero broken types.

### 3. Anti-Hallucination Guarantees
- Verification before completion: Check file existence and line contents via `view_file` or `list_dir`.
- Never declare a task complete without executing verification tests (`run_command`).
- Anchor findings to exact file paths and line ranges: `[file.ts:42-60](file:///path/to/file.ts#L42-L60)`.

---

## 5. Core Workflow Highlights

### 1. `/office-hours` (Reframing & Design Brief)
- **Role**: YC Partner & Product Strategy Specialist
- **Dual Modes**:
  - *Startup Mode*: 6 forcing questions exposing demand reality, desperate specificity, and narrowest wedge.
  - *Builder Mode*: Brainstorming for hackathons, learning, open source, and side projects.
- **Output**: Generates a persistent design document in `.gstack/projects/<slug>/design-<date>.md`.

### 2. `/plan-ceo-review` (Scope & 10-Star Product)
- **Role**: Founder / Chief Executive Officer Reviewer
- **Four Ambition Modes**:
  - `SCOPE EXPANSION`: Dream big; build the 10-star product (10x better for 2x effort).
  - `SELECTIVE EXPANSION`: Harden the core scope while cherry-picking high-impact expansions.
  - `HOLD SCOPE`: Maximum rigor on failure modes, edge cases, and error rescue maps.
  - `SCOPE REDUCTION`: Strip to the essential minimum viable core.

### 3. `/plan-eng-review` (Architecture & Execution Plan)
- **Role**: Principal Systems Architect & Engineering Manager
- **Scope Gate**: Prompts user to select branch diff, pasted plan doc, or file path.
- **Multi-Pass Review**:
  - Pass 1: Architecture, Data Flow, and State Mutation Topology.
  - Pass 2: Error Rescue Maps, Failure Modes, and Blast Radius.
  - Pass 3: Test Plan, Observability, and Migration / Rollback Strategy.

### 4. `/plan-design-review` (Visual Audit & Mockups)
- **Role**: Principal Product Designer & UX Architect
- **10-Dimension Apple HIG Rubric**: Rates Hierarchy, Typography, Spacing, Color/Contrast, Feedback, Motion, Responsiveness, Accessibility, Form Design, Micro-delight (0-10).
- **Interactive Prototyping**: Generates visual mockups or semantic Pretext HTML before code is written.

### 5. `/review` (Diff Inspection & Safety Gate)
- **Role**: Staff Code Reviewer & Production Safety Lead
- **Multi-Pass Review**:
  - Pass 1: Architecture, regressions, and scope drift against merge base.
  - Pass 2: SQL safety, LLM trust boundaries, and security vulnerabilities.
  - Pass 3: Test coverage, dead code, and formatting.
- **Output**: Actionable issue table with severity tags (`[CRITICAL]`, `[HIGH]`, `[MEDIUM]`, `[LOW]`), exact line links, and gate outcomes.

### 6. `/qa` (Autonomous QA & Bug Fix Loop)
- **Role**: Lead QA Automation Engineer & Regression Specialist
- **Surfaces**: Browser UI, HTTP/REST APIs, CLI tools, Background Workers, and Webhooks.
- **Loop**: Verify clean working tree -> Multi-pass exploration -> Root cause isolation -> Atomic fix -> Re-verification -> Report generation in `.gstack/qa-reports/`.

### 7. `/ship` (Automated 5-Phase Release Pipeline)
- **Role**: Principal Release Engineer & Gatekeeper
- **5-Phase Pipeline**:
  1. Base Branch Integration & Sync (`git merge-base`)
  2. Test Suite Execution (`run_command`)
  3. Pre-Landing Review & Security Audit
  4. Semantic Version Bump (`VERSION`) & Release Notes (`CHANGELOG.md`)
  5. Atomic Commit, Push, and Pull Request Creation

---

## 6. Installation & Setup

### Automatic Setup (PowerShell / Windows)
```powershell
.\setup.ps1 --host antigravity
```
*Note: If Bun is not installed on Windows, `setup.ps1` automatically detects Node.js and executes the native Antigravity setup seamlessly.*

### Cross-Platform Setup (Node.js)
```bash
npm run setup:antigravity
# or directly:
node bin/setup-antigravity.js
```

### Options
- `--no-browser`: Skip the Chromium browser installation if you do not plan to use browser QA skills (`/qa`, `/browse`).

---

## 7. Triggering Workflows in Antigravity Chat

Simply type any slash command in Antigravity chat:

```text
/office-hours      -> "Help me brainstorm this new authentication service"
/plan-ceo-review   -> "Review this design doc — think bigger"
/plan-eng-review   -> "Lock in the technical architecture before we code"
/review            -> "Review the diff on this branch"
/qa                -> "Test the login and checkout flows"
/ship              -> "Ship this feature to main"
```
