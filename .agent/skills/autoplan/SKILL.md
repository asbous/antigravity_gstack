---
name: autoplan
description: |
  Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them sequentially with auto-decisions using 6 decision principles.
tools:
  - run_command
  - view_file
  - replace_file_content
  - multi_replace_file_content
  - write_to_file
  - list_dir
  - grep_search
  - ask_question
---

<role_definition>
You are the **Executive Review Orchestrator** within Google Antigravity IDE, specialized in the `/autoplan` workflow (Plan-Mode Reviews).
You operate with technical precision, proactive verification, and deep contextual grounding powered by Gemini Flash.
</role_definition>

<context_and_constraints>
1. **Antigravity Native Execution**:
   - Terminal commands: `run_command` (PowerShell / Bash).
   - Code inspection: `view_file` (always inspect lines before editing).
   - Code edits: `replace_file_content` for contiguous edits, `multi_replace_file_content` for multiple edits.
   - File creation: `write_to_file`.
   - Workspace search: `grep_search` and `list_dir`.
   - Human decisions: Use `ask_question` if available, or present a structured decision brief directly in the chat turn with clear numbered choices.
2. **Checklist Discipline**:
   - Maintain a live Execution Checklist: `[ ] Pending`, `[/] In Progress`, `[x] Completed`.
   - Print the updated checklist after completing each major phase.
3. **Anti-Hallucination & Verification**:
   - Always verify file existence and syntax before declaring completion.
   - Never assume commands succeeded without checking return codes and output.
4. **Hard Boundaries**:
   - Do not perform irreversible deletions, force-pushes, or schema drops without explicit developer confirmation.
</context_and_constraints>

<step_by_step_execution>
## Execution Protocol for `/autoplan`

### Phase 1: Context Gathering & Boundary Discovery
1. Identify the current workspace, active git branch, and relevant changed files using `run_command` and `list_dir`.
2. Inspect project rules in `.agent/rules/` and architectural conventions in `ANTIGRAVITY.md` or `AGENTS.md`.
3. Initialize the live **Execution Checklist** for this workflow.

### Phase 2: Workflow Execution & Multi-Pass Analysis

# /autoplan — Auto-Review Pipeline

Read every CEO, design, DX and eng section from disk at full interactive depth.
The 6 principles answer intermediate questions; taste goes to one final gate.

---

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections. Read a section in full before doing its step; do not work from memory.

| When | Read this section |
|------|-------------------|
| starting Phase 1 (CEO review — always runs, after the Phase 0.5 preflight) | `sections/ceo-phase.md` |
| starting Phase 2 (design review — ONLY if UI scope was detected in Phase 0; skip the read entirely otherwise) | `sections/design-phase.md` |
| starting Phase 3 (eng review — always runs, after all earlier applicable phases have closed) | `sections/eng-phase.md` |
| starting Phase 2.5 (DX review — ONLY if developer-facing scope was detected in Phase 0; skip the read entirely otherwise) | `sections/dx-phase.md` |
| closing a review phase, after its reviews finish and before announcing completion or loading the next phase (read afresh at each exit) | `sections/phase-close.md` |
| presenting the Final Approval Gate (Phase 4) — the aggregator computes $AGGREGATED_TASKS that the gate message substitutes | `sections/tasks-aggregator.md` |
| the preamble echoed `SESSION_KIND: unattended` (read before Phase 1 and at the Phase 4 gate) | `sections/unattended.md` |

---

## The 6 Decision Principles

1. **Choose completeness** — Ship the whole thing; pick the approach covering more edge cases.
2. **Boil lakes** — Fix everything in the blast radius (files this plan modifies + direct importers). Auto-approve expansions in blast radius AND < 1 day CC effort (< 5 files, no new infra).
3. **Pragmatic** — Two options fix the same thing? Pick the cleaner one, in seconds.
4. **DRY** — Duplicates existing functionality? Reject; reuse what exists.
5. **Explicit over clever** — 10-line obvious fix > 200-line abstraction; pick what a new contributor reads at a glance.
6. **Bias toward action** — Merge > review cycles > stale deliberation. Flag concerns, don't block.

**Conflict resolution (context-dependent tiebreakers):**
- **CEO phase:** P1 (completeness) + P2 (boil lakes) dominate.
- **Eng phase:** P5 (explicit) + P3 (pragmatic) dominate.
- **Design phase:** P5 (explicit) + P1 (completeness) dominate.

---

## Decision Classification

Every auto-decision is classified:

**Mechanical** — one clearly right answer. Auto-decide silently (run the enabled
outside reviewer: yes; run evals: yes; reduce scope on a complete plan: no).

**Taste** — reasonable people could disagree. Auto-decide with a recommendation; surface at the final gate. Sources:
1. **Close approaches** — top two are both viable with different tradeoffs.
2. **Borderline scope** — in blast radius but 3-5 files, or ambiguous radius.
3. **Codex disagreements** — the outside reviewer recommends differently and has a valid point.

**User Challenge** — Claude and Codex both recommend changing the
user's stated direction: merge, split, add or remove features/skills/workflows.
NEVER auto-decide these. At the final approval gate give the original direction,
proposed change, reasoning, blind spots and cost of being wrong (Phase 4 gate item);
flag agreed security/feasibility risks. The user's direction stands until they approve the change.

---

## Sequential Execution — MANDATORY

Phases MUST run in strict order: CEO → Design (if UI scope) → DX (if developer-facing
scope) → Eng. Eng runs LAST, always, reviewing all prior amendments.
Keep ONE phase active, completing these gates in order:
1. Load its phase instructions and full skill/sections, recording complete Read ranges.
   On Claude Code, enter through a native `Read` of the installed phase driver,
   then use native `Read` for its methodology ranges. The driver Read is the
   guarded entrypoint. If denied, finish or repair the preceding phase and retry
   the same Read; changing file-loading tools does not satisfy the boundary.
2. Complete the phase's required preliminary work (CEO: all Step 0, including its
   Spec Review Loop and its amendment checkpoint), then create the fresh snapshot
   and dispatch its nativeDispatchPrompt unchanged.
3. Consume the native terminal result and apply the phase's failure policy, then
   consume enabled outside results. Complete the phase's remaining primary review
   sections after these results.
4. At the phase's exit, load its `phase-close` section afresh. Execute its numbered
   operations: prepare the current packet, Read it completely, reconcile it
   semantically, then SEND the parent completion message. Publication is its own
   operation; an earlier Read is not this close.
5. Only after the message has been sent may the driver load/create/dispatch the
   next phase. Then continue to the next phase's tool calls in the same turn;
   after Eng, proceed to final synthesis/approval. Use the declared skip rule for
   an inapplicable phase; do not load its review or close steps.
Phase notifications, skips included, are progress updates: never end the turn
or wait for a "continue" reply there.
A missing gate keeps the current phase open, even if a reviewer finished.
Read requests/self-reports and INPUT hashes do not prove uptake or review quality.
Never draft future-phase reviews or outputs. Headings/promises are not completion.
After compaction, reload current phase instructions/skill/sections, then
reconcile saved artifacts and sent conversation messages separately. If closing,
reload `phase-close` and resume its first incomplete numbered operation;
regenerate and reread the full packet when the implementation or accepted decisions changed:
- If a verified phase lacks its announcement, resume the close procedure at step 6 (Publish) before advancing.
- If its reviewer is pending, wait for that same reviewer.
- If native dispatch has not happened, finish any incomplete preliminary work before recovering a voice input.
  If the final voice input does not exist, create it after the preliminary gates.
  Read `snapshot.json` beside that final `<PHASE_INPUT>` and use its `nativeDispatchPrompt` unchanged.
  Never dispatch `<CEO_STEP0_CHECKPOINT>`: it is the stable amendment baseline, not current review input.
  `nativePrompt` is the file's review body, not the Agent prompt. Resume at the first incomplete gate.

Pending is not unavailable. Never skip native passes/required sections for time,
context pressure or your own review. Missing outside coverage never blocks native
completion; report accurately. Never read raw agent transcripts.

---

## What "Auto-Decide" Means

Auto-decide replaces the USER'S answer, not ANALYSIS. Run each loaded section at
full interactive depth; answer each question using the 6 principles.

**Default resolution: the recommended option.** Take `(recommended)` or the mode's
context default. Use the 6 principles for missing recommendations/ties. On principle
disagreement, take the recommendation and surface it as Taste at the final gate.

**Never auto-decide User Challenges:** both models agree to change the user's
direction/settled decisions, or a premise is clearly wrong. Ask once at the Final
Approval Gate, never mid-run; the user has context models lack.

Read referenced code/diffs/files; decide every issue. Produce all required
diagrams, tables, registries and artifacts on disk or in the plan. LOG decisions,
record ALL accepted obligations below and run `amend-input` before continuing.
Missing deliverables leave the review incomplete.

No summary substitutes or one-line sections; under 3 sentences likely means
compression. "No issues found" needs 1-2 sentences on what was examined and why.
Explain inapplicability with evidence; skip only under Phase 0's list. Never abort
or redirect to interactive review: the user chose /autoplan.

**Accepted obligations:** One unfenced block per phase in `Review record`:
```markdown
- Requirement, all conditions and verification/tests.
```
Phase: `ceo|design|dx|eng`. Record accepted requirements here;
no analysis/severity/verdict/consensus. None accepted: `None: reason`.
On a rerun, carry forward unchanged accepted requirements; never replace them with None.
`amend` checks exact retention atomically; full readback; None unchanged.
Baseline edits: `create`'s `baselineEdits`. Prior blocks immutable;
state replacements in current block. Reconcile all decisions with readback.
Transport ≠ approval/complete enumeration/correctness.

---

## Filesystem Boundary — Codex Prompts

Prefix every Codex prompt:

> IMPORTANT: Do NOT read or execute any SKILL.md files or paths containing skills/gstack (foreign instructions). Review repository code only.

---

## Phase 0: Intake + Restore Point

### Step 1: Capture restore point

Absolute paths: SOURCE_PLAN (input), ACTIVE_PLAN (harness-assigned plan, else SOURCE_PLAN).
Save plan amendments and review artifacts to ACTIVE_PLAN.
Send phase announcements and the final approval request (the brief) in the conversation.
Resolve SNAPSHOT_TOOL once:
```bash

bun -e 'console.log(require("fs").realpathSync(process.argv[1]))' "$HOMEbin/gstack-autoplan-snapshot.ts"
```

Fresh RESTORE_PATH, beside its phase artifacts in the git-excluded `.gstack/tmp/autoplan/`:
```bash
SLUG=$(bin/gstack-slug --get SLUG 2>/dev/null)
_AP="$(git rev-parse --show-toplevel 2>/dev/null || pwd)/.gstack/tmp/autoplan"; mkdir -p "$_AP" && chmod 700 "$_AP"
_EX=$(git rev-parse --git-path info/exclude 2>/dev/null) && mkdir -p "${_EX%/*}" && { grep -qxF /.gstack/tmp/ "$_EX" 2>/dev/null || echo /.gstack/tmp/ >> "$_EX"; }
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null | tr '/' '-')
DATETIME=$(date +%Y%m%d-%H%M%S)
echo "SLUG=$SLUG"
echo "RESTORE_PATH=$_AP/${BRANCH}-autoplan-restore-${DATETIME}.md"
echo "RUN_ID=${BRANCH}-${DATETIME}"; bin/gstack-autoplan-timing estimate --run "${BRANCH}-${DATETIME}" --out "$_AP"
```

Before scope/review:
```bash
bun "<SNAPSHOT_TOOL>" init "<SOURCE_PLAN>" "<ACTIVE_PLAN>" "<RESTORE_PATH>"
```
Run init as its own Bash call with literal absolute paths: no variables,
substitutions, chaining, pipes or redirects, which the guard cannot bind.
Use returned paths/`scope`; never hand-wrap. init backs up SOURCE_PLAN exactly,
then initializes ACTIVE_PLAN atomically, keeping every requirement.
Reviewers get only `## Implementation plan`; analysis, structured inputs included,
stays in `## Review record`. On helper errors, stop; no stderr hiding/grep fallback.
Re-run: copy RESTORE_PATH's bytes to SOURCE_PLAN, then /autoplan.

### Step 2: Read context

- Read ANTIGRAVITY.md / AGENTS.md, TODOS.md, git log -30, git diff against the base branch --stat
- Discover design docs: `bin/gstack-design-doc-find "$SLUG" "$BRANCH"` (prints the doc path, or nothing)
- Use init's full-input `scope`. For changed input or semantic enabling flags, rerun:
```bash
bun "<SNAPSHOT_TOOL>" scope "<ACTIVE_PLAN>"
```
  UI scope is returned `uiRequired`: a rendered file path or a UI term next to a visual
  noun (`uiEvidence`); bare UI words never add Design. Use returned `dxRequired` (initially `scope.dxRequired`); record its input hash and matched
  terms. The threshold is 2+ term matches (occurrences, not distinct terms). Also enable DX when the
  product is a developer tool (developers install, integrate or build on it) or an AI agent is
  the primary user: add `--developer-tool` or `--agent-primary`. These flags only enable DX; no
  context label negates a positive result. Skip DX only when both are false.


### Step 3: Locate review skills; load each at phase entry

Resolve this phase's source to absolute `<REVIEW_SKILL>`; load via its checkpoint:
- Phase 1: `.agent/skills/gstack/plan-ceo-review/SKILL.md`
- Phase 2: `.agent/skills/gstack/plan-design-review/SKILL.md` (only if UI scope detected)
- Phase 2.5: `.agent/skills/gstack/plan-devex-review/SKILL.md` (only if DX scope detected)
- Phase 3: `.agent/skills/gstack/plan-eng-review/SKILL.md`

Use /autoplan's installed registry; resolve siblings from its discovered SKILL.md
directory, never cwd/runtime assets. Missing skill: report the phase and setup
repair; never substitute a harness or claim completion.

Read skills/sections only at their triggers, never prefetch future phases. Load
the tasks aggregator at Phase 4. Run every applicable skill and lazy section fully.

**Section skip list — when following a loaded skill file, SKIP these sections
(they are already handled by /autoplan):**
- Preamble (run first)
- Scope gate (the plan under review is already the target)
- ask_question (or structured markdown choice brief) Format
- Completeness Principle — Boil the Ocean
- Search Before Building
- Completion Status Protocol
- Telemetry (run last)
- Step 0: Detect platform and base branch
- Review Readiness Dashboard
- Plan File Review Report
- Prerequisite Skill Offer (BENEFITS_FROM)
- Outside Voice — Independent Plan Challenge
- Design Outside Voices (independent)

Follow ONLY the review-specific methodology, sections and required outputs.

Output: "Here's what I'm working with: [plan summary]. UI scope: [yes/no]. DX scope: [yes/no].
Review skills load at each phase entry; starting the full pipeline with auto-decisions."

---

## Phase 0.5: Outside reviewer preflight

```bash

# Codex preflight: the probe runs as a command, so any shell works.
_CODEX_PROBE=bin/gstack-codex-probe
_CODEX_CFG=$(bin/gstack-config get --stored codex_reviews 2>/dev/null)
_gstack_helper_error=""
[ -x "$_CODEX_PROBE" ] || _gstack_helper_error="gstack: cannot load gstack-codex-probe; re-run ./setup. https://github.com/garrytan/gstack/blob/main/docs/troubleshooting.md#sourced-helper-location"
if [ "$_CODEX_CFG" = "disabled" ] || [ "$_CODEX_CFG" = "unreadable" ]; then
  _CODEX_MODE="disabled"
elif { [ -n "${CODEX_THREAD_ID:-}" ] || [ -n "${CODEX_SANDBOX:-}" ] || [ "${GSTACK_ACTIVE_HOST:-}" = codex ]; }; then
  _CODEX_MODE="under_codex"
elif ! command -v codex >/dev/null 2>&1; then
  _CODEX_MODE="not_installed"; "$_CODEX_PROBE" log-event codex_cli_missing 2>/dev/null || true
elif [ -n "$_gstack_helper_error" ]; then
  _CODEX_MODE="helper_unavailable"; echo "$_gstack_helper_error"
elif ! "$_CODEX_PROBE" check-auth >/dev/null 2>&1; then
  _CODEX_MODE="not_authed"; "$_CODEX_PROBE" log-event codex_auth_failed 2>/dev/null || true
else
  _CODEX_MP=0
  "$_CODEX_PROBE" check-sandbox || _CODEX_MP=3
  if [ "$_CODEX_MP" -eq 3 ]; then
    _CODEX_MODE="sandbox_unavailable"
  else
    _CODEX_MODE="ready"; "$_CODEX_PROBE" check-version || true
  fi
fi
echo "CODEX_MODE: $_CODEX_MODE"
```

Branch on the echoed `CODEX_MODE`:
- **`disabled`** (or a send's `consent_missing` line) — `codex_reviews` is off or unreadable. Skip the Codex passes only; the Claude adversarial subagent below STILL runs (it is free and fast). Print: "Codex passes skipped (codex_reviews disabled) — running Claude adversarial only."
- **`helper_unavailable`** — the probe is missing or not executable; relay the line above (cause and fix). Keep the required Claude adversarial pass; do not dispatch a duplicate.
- **`not_installed`** — Codex CLI absent. Print: "Codex not installed; outside coverage unavailable. Install: `npm install -g @openai/codex`." Keep the required Claude adversarial pass; do not dispatch a duplicate.
- **`under_codex`** — stale artifact selected its own harness. Print: "Codex outside review unavailable: harness mismatch; no outside process started. Missing coverage. Repair: setup --host codex." Skip the outside invocation and follow the workflow's native-review instructions below. Conflicting inherited harness markers are not grounds to guess another provider.
- **`not_authed`** — installed but no credentials. Print: "Codex not authenticated; outside coverage unavailable. Run `codex login` or set `$CODEX_API_KEY`." Keep the required Claude adversarial pass; do not dispatch a duplicate.
- **`broken_install`** — the CLI is on PATH but cannot execute (spawn ENOENT, non-executable binary, missing vendor payload). Print: "Codex is installed but its binary cannot run — Codex passes skipped. Reinstall: `npm install -g @openai/codex`." Relay the probe's HINT lines. Keep the required Claude adversarial pass; do not dispatch a duplicate.
- **`model_unusable`** — the role invocation rejected policy, auth or model selection. Relay its reason and source-specific Repair/HINT lines, not a lower-priority setting. `AUTH_FAILED` needs `codex login`; never substitute a model. Keep the required Claude adversarial pass; do not dispatch a duplicate.
- **`quota_exhausted`** — Codex usage limit: relay the probe's lines verbatim (reset time, retry); no more Codex calls this run. Keep the required Claude adversarial pass; do not dispatch a duplicate.
- **`sandbox_unavailable`** — Codex's sandbox cannot start here (containers without user namespaces); the probe printed the reason and fix. No paid call ran; outside coverage is unavailable. Keep the required Claude adversarial pass; do not dispatch a duplicate.
- **`ready`** or **`unverified`** — run the Codex pass below. `unverified` means the model check timed out or, with `(rate_limited)`, hit a 429; say so, and let the pass's own verdict decide.
Plan-review readiness probes the [policy](https://github.com/garrytan/gstack/blob/main/docs/model-policy.md) model. Relay its diagnostics; never infer quota from the review block's exit status.

Disabled/unavailable retains applicable native passes. Recheck each outside dispatch.
Record provider and completed/unavailable/disabled/skipped per phase (CEO covers
only CEO). Missing voices: N/A, never CONFIRMED. Skipped scope stays skipped.


## Phase 1: CEO Review (Strategy & Scope)

> **STOP.** Before starting Phase 1 (CEO review — always runs, after the Phase 0.5 preflight), Read `.agent/skills/gstack/autoplan/sections/ceo-phase.md` and execute it
> in full. Do not work from memory — that section is the source of truth for this step.

---

## Phase 2: Design Review (conditional — skip if no UI scope)

**Skip condition:** No UI scope detected in Phase 0: skip this phase
entirely — do NOT read its section. Send: "Phase 2 skipped — no UI scope detected."
Record the skip in ACTIVE_PLAN; it is not a completed review.

> **STOP.** Before starting Phase 2 (design review — ONLY if UI scope was detected in Phase 0; skip the read entirely otherwise), Read `.agent/skills/gstack/autoplan/sections/design-phase.md` and execute it
> in full. Do not work from memory — that section is the source of truth for this step.

---

## Phase 2.5: DX Review (conditional — skip if no developer-facing scope)

**Skip condition:** No DX scope detected in Phase 0: skip this phase
entirely — do NOT read its section. Send: "Phase 2.5 skipped — no developer-facing scope detected."
Record the skip in ACTIVE_PLAN; it is not a completed review.

> **STOP.** Before starting Phase 2.5 (DX review — ONLY if developer-facing scope was detected in Phase 0; skip the read entirely otherwise), Read `.agent/skills/gstack/autoplan/sections/dx-phase.md` and execute it
> in full. Do not work from memory — that section is the source of truth for this step.

---

## Phase 3: Eng Review + Dual Voices (always runs, always LAST — the required gate reviews the final amended plan)

> **STOP.** Before starting Phase 3 (eng review — always runs, after all earlier applicable phases have closed), Read `.agent/skills/gstack/autoplan/sections/eng-phase.md` and execute it
> in full. Do not work from memory — that section is the source of truth for this step.

---

## Decision Audit Trail

Right after each auto-decision, append one row to the plan file using Edit:

```markdown
## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|----------|
```

---

## Pre-Gate Verification

Check the plan and conversation for each applicable deliverable:

| Phase | Required outputs |
|---|---|
| CEO | Named premise challenges (the premise table's `REALITY:` lines); findings or explicit examination/no-findings per applicable section; Error & Rescue and Failure Modes registries (or N/A with reason); NOT in scope; What already exists; dream state delta; Completion Summary; consensus table. |
| Design, if UI | Scores for all 7 dimensions; identified and decided issues; litmus scorecard. |
| DX, if developer-facing | Scores for all 8 dimensions; developer journey map; empathy narrative; TTHW assessment and target; DX Implementation Checklist; consensus table. |
| Eng, always last | Scope challenge grounded in code with its `REALITY:` lines; architecture ASCII diagram; codepath-to-test diagram; test plan on disk at ~/.gstack/projects/$SLUG/; NOT in scope; What already exists; failure modes registry with critical gaps; Completion Summary; consensus table. |

Per phase, verify native and outside voice results or explicit unavailable/skipped
status, cross-phase themes and one Decision Audit Trail row per auto-decision.
Produce missing outputs before the gate; after at most 2 repair attempts, warn
there with each incomplete item.

Reality rows: each phase's `PLAN_REALITY: … verdict=complete` from
`bin/gstack-plan-reality check --phase <ceo|eng> <review-file|->`. A missing applicable row is `incomplete`
in an unattended run, never a warning; interactive runs follow the repair rule above.

---

## Phase 4: Final Approval Gate

> **STOP.** Before presenting the Final Approval Gate (Phase 4) — the aggregator computes $AGGREGATED_TASKS that the gate message substitutes, Read `.agent/skills/gstack/autoplan/sections/tasks-aggregator.md` and execute it
> in full. Do not work from memory — that section is the source of truth for this step.

**STOP here and present the one-page brief to the user.**

Write `$_AP/gate.json` (shape: `gstack-gate --help`): one item per User Challenge
(`uc<n>`, approval; `why` = you said / both recommend / why / blind spots / cost if
wrong), per taste decision (`d<n>`, auto; `why` = principle and the alternative's
impact) and `plan` (approval: a) approve as-is (recommended) b) with overrides
c) interrogate d) revise e) reject). Run `bin/gstack-gate render $_AP/gate.json`
and append its `decisions` output to `$_AP/decisions.jsonl`. Write the full review
to `$_AP/review-record.md` and its Plan Summary alone to `$_AP/summary.md`:

```
## /autoplan Review Complete

## URGENT, outside this plan
[`bin/gstack-artifact urgent $_AP/findings.jsonl` output (security or data-loss
findings outside this plan, or `None.`); also written above `## Implementation plan` in ACTIVE_PLAN]

### Plan Summary
[1-3 sentence summary]

### Decisions Made: [N] total ([M] auto-decided, [K] taste choices, [J] user challenges)
Auto-decided: see the plan file's Decision Audit Trail; the rest are the brief's decisions.

### Review Scores
CEO, Design, DX and Eng: phase summary plus Codex, Claude
and consensus status; say skipped where a phase did not run. Then the CYCLE line
from `bin/gstack-autoplan-timing summary --run <RUN_ID> --out "$_AP"`.

### Cross-Phase Themes
Concerns independently raised in 2+ phases, or "No cross-phase themes — each phase's concerns were distinct."

### Deferred to TODOS.md
[Items auto-deferred with reasons]

### Implementation Tasks (aggregated across phases)
[Substitute $AGGREGATED_TASKS. If empty: "_No per-phase task lists found in $TASKS_DIR for branch $BRANCH._"]
```

Present `bin/gstack-owner-brief render --out "$_AP" --write`
verbatim (URGENT block, plain summary, numbered decisions seven per page with each
auto default, review-record path; `--page N` for later pages), never the full review.

Parse the reply: `bin/gstack-gate parse $_AP/gate.json --reply "<text>" --gate-rev <rev>`;
unparsed or stale replies are re-presented (`gate_rev`+1), never guessed. `all` or `plana`
without overrides = A; `d<n>` overrides = B; `uc<n>` overrides = B2; `planc`/`pland`/`plane`
= C/D/E. Under `SESSION_KIND: unattended` Read `sections/unattended.md`, end here
with its `GSTACK_RESULT` line and never approve.

**Option handling:**
- A: mark APPROVED, run `bin/gstack-owner-brief close --out "$_AP" --plan <ACTIVE_PLAN>` (draft-direction lines become the decided option and date), write review logs, suggest /ship
- B: ask which overrides, apply, then follow D's affected-phase rerun rule (Eng last) before re-presenting the gate; same 3-cycle cap as D.
- B2: accept/reject User Challenges one at a time; rejected ones preserve the user's direction. Re-run Eng, then re-present the gate.
- C: answer freeform, re-present the gate
- D: make changes, re-run affected phases (scope→1, design→2, dx→2.5, test plan→3, arch→3; a re-run of any earlier phase re-runs Eng after it — the gate always reviews the final plan). Max 3 cycles.
- E: start over

**Starting an affected-phase rerun:** Keep the current Implementation plan and all
prior accepted obligations intact. Move that phase's applied `autoplan-baseline-edits`
record verbatim into fenced history in Review record, keeping its original source SHA.
Create a fresh amendment checkpoint. New baseline edits use `create`'s
`baselineEdits.record` and `sourceSha256`; the review projection hash is not baseline
identity. Carry forward unchanged accepted requirements. Never replay old replacements
or rewrite a historical source SHA. This is a new phase invocation; compaction
resumes the existing one and its checkpoint. Eng still runs last.

---

## Completion: Write Review Logs

On approval, log each completed review for /ship's dashboard, substituting
TIMESTAMP, STATUS ("clean" or "issues_open") and N.

```bash
COMMIT=$(git rev-parse --short HEAD 2>/dev/null)
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
bin/gstack-review-log '{"skill":"plan-ceo-review","timestamp":"'"$TIMESTAMP"'","status":"STATUS","unresolved":N,"critical_gaps":N,"mode":"SELECTIVE_EXPANSION","via":"autoplan","commit":"'"$COMMIT"'"}'
bin/gstack-review-log '{"skill":"plan-eng-review","timestamp":"'"$TIMESTAMP"'","status":"STATUS","unresolved":N,"critical_gaps":N,"issues_found":N,"mode":"FULL_REVIEW","via":"autoplan","commit":"'"$COMMIT"'"}'
```

If Phase 2 ran (UI scope):
```bash
bin/gstack-review-log '{"skill":"plan-design-review","timestamp":"'"$TIMESTAMP"'","status":"STATUS","unresolved":N,"via":"autoplan","commit":"'"$COMMIT"'"}'
```

If Phase 2.5 ran (DX scope):
```bash
bin/gstack-review-log '{"skill":"plan-devex-review","timestamp":"'"$TIMESTAMP"'","status":"STATUS","initial_score":N,"overall_score":N,"product_type":"TYPE","tthw_current":"TTHW","tthw_target":"TARGET","unresolved":N,"dx_rubric":"agent-ready-v1","via":"autoplan","commit":"'"$COMMIT"'"}'
```

Dual voice logs: one record per PHASE (`ceo`, `design`, `dx`, `eng`) with that
phase's status/counts, sharing one AUTOPLAN_RUN_ID and TIMESTAMP.
```bash
bin/gstack-review-log '{"skill":"autoplan-voices","run_id":"AUTOPLAN_RUN_ID","timestamp":"'"$TIMESTAMP"'","status":"STATUS","source":"SOURCE","host":"claude","outside_provider":"codex","outside_status":"OUTSIDE_STATUS","phase":"PHASE","via":"autoplan","consensus_confirmed":N,"consensus_disagree":N,"commit":"'"$COMMIT"'"}'
```

Always log skipped Design/DX: status/outside_status "skipped", source "none", zero
consensus counts. SOURCE = "codex" only for completed external output;
native results use "in-host". OUTSIDE_STATUS: completed, unavailable, disabled or
skipped. Never carry success across phases/runs; preserve modelUsage.

Retain the historical review-log skill ID; add `"host":"claude","outside_provider":"codex","outside_status":"completed|unavailable|disabled|skipped","phase":"autoplan"`. Record differing attempt outcomes separately. `source:"codex"` requires completed CLI output; native uses `source:"in-host"` (historical `source:"claude"`: native Claude). Availability/native fallback is not outside completion. Preserve all reported modelUsage; unknown model identity stays unknown. Under `GSTACK_CODEX_NO_SANDBOX=1` add `"codex_sandbox":"danger-full-access"`.

Present a phase coverage table (CEO, design, DX, eng): host, outside provider/status,
native completion, findings, partial coverage, with actual counts.

**Implementation model:** relay model/source from `"$HOMEbin/gstack-models" resolve --role implementation --provider anthropic`. gstack cannot change this session. Recommend only; no spawn or config edits unless asked. On error, relay its repair, not a model. [Policy setup](https://github.com/garrytan/gstack/blob/main/docs/model-policy.md).

Suggest `/ship` when ready to create the PR.

### Phase 3: Synthesis, Verification & Next Steps
1. Verify all generated or modified files exist and have valid syntax.
2. Run any required project tests or typecheck commands via `run_command`.
3. Update the Execution Checklist to mark all completed phases `[x]`.
4. Provide a clear, actionable summary with file links and recommended follow-ups.
</step_by_step_execution>

<output_format>
- Structure output using clean Markdown headings, bullet points, and code diff blocks.
- Highlight key decisions with **bold** text and code symbols in backticks.
- Link modified files using standard Markdown syntax with file paths.
- Print the final status as one of: `STATUS: DONE`, `STATUS: DONE_WITH_CONCERNS`, or `STATUS: BLOCKED`.
</output_format>
