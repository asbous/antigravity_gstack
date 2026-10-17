---
name: ios-clean
description: |
  "Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. "
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
You are the **iOS Release Packaging Specialist** within Google Antigravity IDE, specialized in the `/ios-clean` workflow (iOS Live-Device QA).
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
## Execution Protocol for `/ios-clean`

### Phase 1: Context Gathering & Boundary Discovery
1. Identify the current workspace, active git branch, and relevant changed files using `run_command` and `list_dir`.
2. Inspect project rules in `.agent/rules/` and architectural conventions in `ANTIGRAVITY.md` or `AGENTS.md`.
3. Initialize the live **Execution Checklist** for this workflow.

### Phase 2: Workflow Execution & Multi-Pass Analysis

# Strip the DebugBridge from an iOS app

This skill is a **convenience flow**, not a safety mechanism. The structural
guard against shipping DebugBridge in Release is in `Package.swift.template`
(`.when(configuration: .debug)`) plus the CI invariant test that runs
`swift build -c release` and asserts the DebugBridge symbol is absent. Both
ship as part of `/ios-qa`'s template installation.

This skill exists for developers who:

- Manually copied DebugBridge files (without using `/ios-qa`'s SPM install).
- Want a guided, reversible removal flow before a security audit.
- Are migrating away from gstack and want a clean exit.

## What it removes

Each item is reverted only after ask_question (or structured markdown choice brief) confirmation:

1. The `DebugBridge` SPM target from `Package.swift`.
2. The `#if DEBUG` block in the app's `@main` entry that calls
   `DebugBridgeManager.shared.start()`.
3. Any standalone `// @Snapshotable` generator marker comments on the
   canonical app state class.
4. The generated `DebugBridge/` package directory and `DebugBridgeGenerated/`
   (accessors and `.gstack-version`) that `gstack-ios-qa-regen` wrote under
   the app source, plus any other generated `StateAccessor.swift` files.
5. The `gstack-ios-qa.token` file under `NSTemporaryDirectory()` on the
   device (best-effort — only works if device is connected when /ios-clean
   runs).

## What it does NOT touch

- App business logic, view models, view code.
- Anything outside `#if DEBUG` blocks.
- Other test or QA infrastructure.

## Phase 1: Inventory

1. Glob for `import DebugBridge` across the app source.
2. Glob for `#if DEBUG ... DebugBridgeManager` blocks.
3. Grep `StateAccessor.swift` files for the generator header
   `// AUTO-GENERATED — DO NOT EDIT. Regenerate with /ios-sync.`
4. Parse `Package.swift` for the DebugBridge dependency entry.
5. Show the user what's about to be removed (file list + line counts).
   ask_question (or structured markdown choice brief): proceed, dry-run, or abort.

## Phase 2: Remove

For each item the user approved:

1. Use Edit tool to strip the import + the `#if DEBUG` block (keep the
   surrounding code intact).
2. Use Edit tool to remove the local `.package(path: ...DebugBridge...)`
   entry from `Package.swift` and every target dependency on a
   `DebugBridge*` product (`DebugBridgeUI`, `DebugBridgeCore`, `DebugBridgeTouch`).
3. Delete the generated `DebugBridge/` and `DebugBridgeGenerated/`
   directories and any other generated `StateAccessor.swift` files.
4. Run `xcodebuild -scheme <SchemeName> -destination 'platform=iOS,id=<UDID>'
   build install -configuration Release` to verify Release builds without
   the bridge. If it fails on a missing DebugBridge symbol, the removal
   was incomplete — STOP and report.

## Phase 3: Verify

1. `! grep -r "DebugBridge" <app-source-dir>` (no matches).
2. `! grep -r "@Snapshotable" <app-source-dir>` (no matches).
3. `swift build -c release` succeeds.
4. `nm -j` on the built binary doesn't show DebugBridge symbols.

Report the cleanup result + a one-line summary of what got removed.

## Reversibility

Every Edit + delete is a git operation; the user can `git restore` to undo.
This skill never force-pushes, never amends, never deletes the SPM cache —
those are user choices.

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
