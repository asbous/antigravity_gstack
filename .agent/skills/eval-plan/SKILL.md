---
name: eval-plan
description: |
  Preregister a paid eval (bars, arms, decoys, stop rules), dry-run it at zero cost, then run a three-item priced pilot whose spend table gates approval.
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
You are the **Empirical Evaluation Architect** within Google Antigravity IDE, specialized in the `/eval-plan` workflow (Operational & Memory).
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
## Execution Protocol for `/eval-plan`

### Phase 1: Context Gathering & Boundary Discovery
1. Identify the current workspace, active git branch, and relevant changed files using `run_command` and `list_dir`.
2. Inspect project rules in `.agent/rules/` and architectural conventions in `ANTIGRAVITY.md` or `AGENTS.md`.
3. Initialize the live **Execution Checklist** for this workflow.

### Phase 2: Workflow Execution & Multi-Pass Analysis

# /eval-plan: Preregistered, paid evals

Three steps stand between an eval idea and the first priced call, in this order:
the preregistration (what counts, what stops the run), the zero-cost dry run (the
pipeline works on the real input shapes, with prices in the table), and the
priced pilot (three items per arm, settled against the invoice, extrapolated
with an error band). Only then is the owner asked to approve the full run. Every
step prints one grep-able line; a parent agent reads the lines, not this prose.

Usage: `/eval-plan [<prereg.md>] [--input <rows.jsonl>] [--arms <model,model>] [--cap <usd>] [--total <items>]`

## Boundaries

- Spend nothing before Step 3, and in Step 3 only what the ledger admits. A reservation the
  ledger refuses (`EVAL_BUDGET_EXHAUSTED`) ends the step; never retry to make room, never
  split a call to slip under the cap.
- Preregistered text is frozen once the pilot starts: a bar, arm, decoy or stop rule
  changed after a priced call is a new eval with a new preregistration.
- Held-out sets named in the preregistration are never read by this skill, pasted into a
  prompt, or summarized; the dry run reads the development rows only.
- Admission is an estimate. `lib/pricing.ts` prices standard text tokens and excludes
  cache writes, tool fees, service-tier and long-context multipliers, media tokens and
  seat-metered runs; actual cost reconciles at settle time and `unknown` charges stay
  visible in every spend table.
- Under `SESSION_KIND: unattended`, the approval in Step 4 is written as a gate item and
  the run ends `gate_pending`; this skill never approves a priced run by itself.

## Step 1: Preregistration

Write (or open) the preregistration file. Each section is required and must be filled;
`` guidance does not count as content:

| Section | What it holds |
|---|---|
| Bars | one line per metric: name, pass bar, direction, what a miss means for the decision |
| Arms | one line per arm: model id (in the price table), settings, per-item cost from Step 1b |
| Decoys | inputs the scorer must reject or score low; how many, how they were made, what a decoy pass proves |
| Stop rules | the spend cap, a bar missed on the pilot, a scorer below its bar, `budget_exhausted` |
| Held-out exposure | every held-out set the plan touches: prior exposure (which runs, which models), the reservation on it |

```bash
bin/gstack-eval-plan prereg --init <path>
bin/gstack-eval-plan prereg --check <path>
```

`PREREG: ok` continues. `PREREG: incomplete` names the missing or empty sections
(`PREREG_INCOMPLETE`, exit 1); fill them and rerun. Do not continue on an incomplete
preregistration.

When the summarizer counts diagnostics, declare them before the freeze commit in a
`## Diagnostics` section: `summarizer: <command naming {fixture}>`, `fixture: <synthetic
records file>`, and one `| diagnostic | expected |` row per diagnostic, with the count the
fixture is built to produce. The summarizer's last stdout line is one JSON object of counts.
Then run `prereg --check <path> --allow-repo-commands`. Without the flag, the summarizer is
listed and the check exits 3. Every `PREREG_DIAGNOSTIC:` line must say `ok`.
`PREREG_DIAGNOSTIC_UNTESTED` (exit 1) means a count, a missing diagnostic or an
undeclared one does not match its definition. Fix that before you freeze.

### Step 1b: Arms and their price

```bash
bin/gstack-eval-plan arms
```

Arms come from the project's model rules (`gstack-models resolve --role eval-arms`),
falling back to the repo's own policy document (`--policy-doc <path>`), or from
`--arms <picked-models>` when the user named them. Each `ARM:` line carries its source
and the per-item cost at the stated token estimate; `price=MISSING` (`EVAL_PRICE_MISSING`)
means the model has no row in `lib/pricing.ts`: add the row from the provider's pricing
page or drop the arm. Copy the priced arms into the Arms section.

When the repo commits `.gstack/eval-models.json` (allow, deny, per-scope lists, families
newest first; `docs/eval-models.md` in gstack), `arms`, `dry-run`, `pilot start` and
`price-gate` print one `EVAL_MODEL:` line per arm. Pass `--scope smoke` for a smoke run;
the default is `full`. A refused arm (`EVAL_MODEL_DENIED`, `EVAL_MODEL_OLD_GENERATION`,
`EVAL_MODEL_GENERATION_UNRESOLVED`) is replaced, never argued past.

## Step 2: zero-cost stub-model dry run

Run the pipeline over the real development rows with a stub model that costs nothing:

```bash
bin/gstack-eval-plan dry-run --input <path> --arms <picked-models> --retry-prompt <path> --out <outdir>
```

Add `--fields <id>` when the rows' prompt field is not `prompt`, and `--output-budget` with
the budget the run will use. The checklist printed must be all `ok`:

- `CHECK: price-table` — every arm has a price row.
- `CHECK: output-budget` — at or above the reasoning floor (8,192 tokens); a reasoning model
  spends output tokens thinking, and a smaller budget truncates the answer the scorer reads.
- `CHECK: retry-prompt` — the exact text the run sends on a retry, printed verbatim; a retry
  with no text is a repeat of the same failure at the same price.
- `CHECK: reservation-fits-cap` (with `--cap <cap-usd>`) — one call, the largest row plus the
  output budget, priced, fits under the cap; a provider refuses a reservation the cap cannot hold.
- `DRY_RUN_ROW:` lines name rows missing a field; fix the rows, not the prompt.

`DRY_RUN_RESULT: pass` writes `dry-run.json` to `--out`; the pilot refuses to start on
anything else (`EVAL_DRY_RUN_FAILED`).

## Step 3: Priced pilot (n≈3)

```bash
bin/gstack-eval-plan pilot start --out <outdir> --cap <cap-usd> --arms <picked-models> --dry-run <path>
```

`pilot start` reserves three attempts per arm through the spend ledger (`spend.json` in
`--out`): admission is `spent + reserved + unknown + estimate <= cap`, under a file lock
shared with any concurrent worker. Run each `PILOT_ATTEMPT:` through the project's own
eval command, then settle it with the actual cost from the provider's usage field, or
`unknown` when the call was seat-metered or CLI-metered:

```bash
bin/gstack-eval-plan pilot settle --out <outdir> --attempt <attempt-id> --usd <usd|unknown>
bin/gstack-eval-plan pilot report --out <outdir> --total <total-items> --workers <workers>
```

`pilot report` prints the spend table (`spent`, `reserved`, `unknown charges`, the worst case
with one in-flight call per worker, the worst-case overrun against the cap) and
`PILOT_PROJECTION:` — mean cost per item, its sample deviation, the projection to
`--total` items across the arms, and a 95% band. Regenerate the table at every later gate
of the run. Stop and report, without asking for approval, when the pilot missed a bar from
the preregistration, when `status=budget_exhausted`, or when `verdict=exceeds`.

## Step 4: The approval ask

Price every paid gate the plan names (a benchmark or eval command that spends) from the
repo's call-plan file; nothing is executed (`docs/eval-calls.md` in gstack). The gate
command is free text, so it reaches the pricer only as a file:

```bash
_GT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)/.gstack/tmp"
mkdir -p "$_GT" && chmod 700 "$_GT" || { echo "Not sent: cannot create $_GT for the text file." >&2; exit 1; }
_EX=$(git rev-parse --git-path info/exclude 2>/dev/null) && mkdir -p "$(dirname "$_EX")" && { grep -qxF '/.gstack/tmp/' "$_EX" 2>/dev/null || echo '/.gstack/tmp/' >> "$_EX"; }
GATE_FILE=$(mktemp "${_GT:?}/gate-command.XXXXXX") || { echo "Not sent: mktemp failed in $_GT." >&2; exit 1; }; echo "GATE_FILE: $GATE_FILE (name: ${GATE_FILE##*/})"
```

Write the text into each printed file with your file-write tool (Claude Code's Write tool needs a Read of the empty file first), exactly as it should appear. The text never goes into a shell command, heredoc or quoted argument. If a write fails or is refused, do not send: print the cause, the file path and the command below for sending by hand.

Write the exact gate command, one line, into the printed file, then price it:

```bash
GATE_FILE="$(git rev-parse --show-toplevel 2>/dev/null || pwd)/.gstack/tmp/<gate-file-name>"
bin/gstack-eval-plan price-gate --gate-file "$GATE_FILE" --cap-usd <cap-usd>
```

Each `GATE_PRICE:` line goes into the ask. `EVAL_GATE_UNPRICED`, `EVAL_PLAN_STALE`,
`EVAL_PRICE_MISSING` or `EVAL_GATE_OVER_CAP` means that gate is not approvable as priced;
`--allow-unpriced "<reason>"` only on the owner's word.

Present, in this order and nothing before it: the `PILOT_PROJECTION:` line, the spend
table, each gate's `GATE_PRICE:` line, the pilot's per-bar results, and the preregistration's stop rules. Then ask one
question with the projection as the recommended option only when `verdict=within`:

- A) Run `<total-items>` items at the projected cost (recommended when within the cap)
- B) Cut arms or items; recompute the projection first
- C) Stop here; keep the pilot results as the record

Under `SESSION_KIND: unattended` write the question as an `approval` gate item through
`gstack-gate` and end with `GSTACK_RESULT: skill=eval-plan status=gate_pending run=<outdir>`.
The full run, when approved, keeps settling every attempt into the same ledger and reprints
the spend table at each gate; `budget_exhausted` stops it.

## Tier 3, after P7 (not in this skill yet)

Each of these waits for the adoption number in the multi-agent wave plan (P7); one line each so the shape is known:

- Instrument audit: read every failing transcript of one dev round before freezing the scorer; check generated worlds for duplicate identifiers, word-like codes and generic phrases; mutation tests in both directions. (tier 3, after P7)
- Steady state: background queues empty at snapshot time, queue depth recorded as a gate. (tier 3, after P7)
- Sealed paths: declared in the plan; the skill refuses to quote from them, self-checks output for their n-grams and adds a provenance line. (tier 3, after P7)
- Off-machine persistence: long runs sync through `gstack-detach --sync-cmd <cmd> --sync-every <min>`. (tier 3, after P7)
- Memory preflight: concurrency times measured per-process memory, refuse above 70% of RAM. (tier 3, after P7)
- Power tables: power and risk sentences cite the committed power output with a sensitivity table over the obvious rule alternatives. (tier 3, after P7)
- QA soak: hours of mixed ingest against a long-lived server with a `CPU pinned, no progress` watchdog. (tier 3, after P7)

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
