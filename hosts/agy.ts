import { defineHost, GBRAIN_RESOLVERS, preambleToolGlossary } from './define-host';

// Google Antigravity IDE & CLI
// Paths: the IDE reads workspace skills from .agents/skills or .agent/skills
// and global skills from ~/.gemini/config/skills (or ~/.gemini/antigravity-cli/skills).
// Modular rules are read from .agents/rules/ and .agent/rules/.
const ANTIGRAVITY_TOOL_GLOSSARY = '**Antigravity Native Tool Names & Protocols:**\n' +
  '- Interactive Inquiries: Use `ask_question` tool if available, or present clear multiple-choice prompts directly in markdown with numbered options, `[Recommended]`, and trade-offs. (Replaces proprietary `AskUserQuestion`).\n' +
  '- Execution & Plan Tracking: Use step-by-step Execution Checklists (`[ ] Pending`, `[/] In Progress`, `[x] Completed`) printed after each phase. (Replaces proprietary `ExitPlanMode`).\n' +
  '- Terminal / Shell: `run_command` (PowerShell / Bash). Inspect exit codes and output.\n' +
  '- File Operations: `view_file` (reading with line ranges), `replace_file_content` (surgical single edits), `multi_replace_file_content` (multiple edits), `write_to_file` (file creation).\n' +
  '- Search: `grep_search` (ripgrep search), `list_dir` (directory inspection).\n' +
  '- Subagents: `invoke_subagent` and `browser_subagent` for autonomous browser sessions.';

const agy = defineHost({
  name: 'agy',
  displayName: 'Antigravity IDE',
  cliAliases: ['antigravity', 'antigravity-ide'],
  defaultModel: 'gemini',
  tier: 'full',
  capabilities: {
    toolExecution: true,
    questions: 'native',
    planMode: false,
    delegation: true,
    browser: true,
    safetyHooks: 'advisory',
  },

  globalRoot: '.gemini/config/skills/gstack',
  localSkillRoot: '.agent/skills',
  hostSubdir: '.agent',

  frontmatter: {
    mode: 'allowlist',
    keepFields: ['name', 'description', 'tools'],
    descriptionLimit: 1024,
    descriptionLimitBehavior: 'truncate',
    nameMatchesDirectory: true,
  },

  pathRewrites: [
    { from: 'if [ -d "$HOME/.claude/skills/gstack/.git" ]', to: 'if [ -d "$PWD/.git" ]' },
    { from: 'INSTALL_DIR="$HOME/.claude/skills/gstack"', to: 'INSTALL_DIR="$PWD"' },
    { from: '$HOME/.claude/skills/gstack', to: '$PWD' },
    { from: '~/.claude/skills/gstack', to: '$PWD' },
    { from: '.claude/skills/gstack', to: '.agent/skills' },
    { from: '.claude/skills/review', to: '.agent/skills/review' },
    { from: '.claude/skills', to: '.agent/skills' },
    { from: 'CLAUDE.md', to: 'ANTIGRAVITY.md' },
    { from: 'ExitPlanMode', to: 'Execution Checklist completion' },
  ],
  toolRewrites: preambleToolGlossary(ANTIGRAVITY_TOOL_GLOSSARY),

  suppressedResolvers: ['REVIEW_ARMY', ...GBRAIN_RESOLVERS],

  runtimeRoot: {
    globalSymlinks: ['bin', 'lib', 'browse/dist', 'browse/bin', 'design/dist', 'make-pdf/dist', 'freeze/bin', 'careful/bin', 'gstack-upgrade', 'ETHOS.md'],
    globalFiles: {
      'review': ['checklist.md', 'design-checklist.md', 'greptile-triage.md', 'TODOS-format.md'],
    },
  },
});

export default agy;

