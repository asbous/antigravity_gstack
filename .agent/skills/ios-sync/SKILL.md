---
name: ios-sync
description: |
  Regenerate the iOS debug bridge against the latest upstream gstack templates.
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
You are the **iOS Debug Bridge Specialist** within Google Antigravity IDE, specialized in the `/ios-sync` workflow (iOS Live-Device QA).
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
## Execution Protocol for `/ios-sync`

### Phase 1: Context Gathering & Boundary Discovery
1. Identify the current workspace, active git branch, and relevant changed files using `run_command` and `list_dir`.
2. Inspect project rules in `.agent/rules/` and architectural conventions in `ANTIGRAVITY.md` or `AGENTS.md`.
3. Initialize the live **Execution Checklist** for this workflow.

### Phase 2: Workflow Execution & Multi-Pass Analysis

# Resync the iOS debug bridge

After `/ios-qa` is installed in an app, the user may:

1. Add new `@Observable` classes or properties that need accessor coverage.
2. Upgrade gstack to a newer version with hardening fixes.
3. Move the `// @Snapshotable` generator marker comment to a different field.

This skill regenerates the relevant artifacts in place.

**Templates live in upstream gstack.** The installed
`gstack-ios-qa-regen` launcher resolves its own gstack root and copies only
the supported bridge files from `ios-qa/templates/`.

## Phase 1: Detect installed version

1. Read `<app>/DebugBridgeGenerated/.gstack-version` (written by /ios-qa
   during install). If missing, treat the install as "unknown old version".
2. Read upstream version from `$GSTACK_ROOT/VERSION`.
3. If versions match AND no new `@Observable` classes were added, exit
   early with "already up to date".

## Phase 2: Regenerate codegen output

Run the deterministic regenerator once. `--app-source` is the directory the
accessor scanner should inspect; `--bridge-dir` is the local Swift package
that the app links in Debug builds:

```bash
bin/gstack-ios-qa-regen \
  --app-source "$APP_SOURCE_DIR" \
  --bridge-dir "$APP_SOURCE_DIR/DebugBridge"
```

The command removes only the known obsolete generated files from the former
flat `DebugBridgeGenerated/` layout before emitting the current accessor.
Generation accepts file-scope observable classes and JSON-native scalar,
array, String-keyed dictionary, and Optional field types. It rejects custom
types, implicitly unwrapped Optionals, nested observable classes, and duplicate
snapshot keys before writing a completion marker.

The composite-hash cache key handles whether anything actually needs
regenerating; if Swift version, generator git rev, lockfile, source content,
and platform triple all match the cache, this is a ~50ms no-op.

## Phase 3: Review the generated diff

1. Review changes under `<app>/DebugBridge/` and
   `<app>/DebugBridgeGenerated/StateAccessor.swift`.
2. Confirm the command did not modify the app's handwritten Swift files.
3. Keep app-specific wiring in the app target; canonical bridge package files
   are regenerated from upstream and should not be hand-edited.

## Phase 4: Verify

1. `swift build` succeeds against the app's package.
2. `xcodebuild -scheme <SchemeName>` succeeds.
3. Re-launch the app on the device; daemon connects + rotates token.
4. `GET /state/snapshot` returns the new accessor schema hash.

## Failure modes

| Symptom | Action |
|---|---|
| Swift compile fails after regen | Revert via `git restore` + ask_question (or structured markdown choice brief): surface the compile error |
| Codegen reports an invalid marked declaration | Use a file-scope observable class and a writable instance `var` with an explicit JSON-native type, internal/public setter, and a key unique across models; otherwise remove the `// @Snapshotable` marker. |
| Schema hash unchanged after adding new @Observable | No field has the standalone `// @Snapshotable` marker comment — codegen excludes unmarked state correctly. Add the comment immediately above each field that should be snapshotted. |
| Scanner sees generated bridge sources | Pass the narrow app source directory; the regenerator automatically excludes `DebugBridgeGenerated` and `StateAccessor.swift`. |

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
