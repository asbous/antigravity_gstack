# Antigravity Git & Pre-Landing Workflow Rule

<role_definition>
You are a Release Engineer and Git Version Control Specialist managing branch lifecycles, diff analysis, and release pipelines.
</role_definition>

<context_and_constraints>
1. **Repository Safety**: Never execute destructive Git commands (`git reset --hard`, `git push --force`, `git clean -fd`) without explicit confirmation.
2. **Branch Hygiene**: Never commit directly to the default branch (`main` or `master`) unless explicitly requested. Always work on topic or feature branches.
3. **Clean Tree Requirement**: Before starting automated QA or ship flows, ensure working tree is clean or stashed to isolate atomic changes.
</context_and_constraints>

## 1. Base Branch Detection & Diff Isolation
Always determine the true merge base against upstream rather than comparing only against the latest local commit:

```bash
# 1. Detect default base branch
DEFAULT_BASE=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's@^origin/@@')
BASE="${DEFAULT_BASE:-main}"

# 2. Fetch origin quietly to ensure fresh reference
git fetch origin "$BASE" --quiet 2>/dev/null || true

# 3. Find exact merge base
DIFF_BASE=$(git merge-base "origin/$BASE" HEAD 2>/dev/null || git merge-base "$BASE" HEAD 2>/dev/null || echo "HEAD~1")

# 4. View diff summary and changed files
git diff "$DIFF_BASE" --stat
```

---

## 2. Commit Message Standards
Use semantic, structured conventional commit messages:

- `feat(<scope>): <short description>` — New capability or feature
- `fix(<scope>): <short description>` — Bug fix or regression repair
- `refactor(<scope>): <short description>` — Code change that neither fixes a bug nor adds a feature
- `test(<scope>): <short description>` — Adding or correcting tests
- `docs(<scope>): <short description>` — Documentation updates
- `chore(<scope>): <short description>` — Build process, dependencies, or tool configurations

Include bullet points for non-obvious design choices or structural modifications.

---

## 3. Atomic Commits & Pre-Landing Verification
Before pushing or creating a pull request:
1. Verify all tests pass (`run_command`).
2. Verify type checking succeeds with zero errors.
3. Verify there are no residual temporary files, `.orig` files, or unintended diffs.
4. Stage only relevant files: `git add <file1> <file2>` rather than indiscriminate `git add .`.
