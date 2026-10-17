#!/usr/bin/env node
/**
 * Antigravity Skill Ecosystem Generator & Adapter for Gemini Flash.
 *
 * This script:
 * 1. Catalogs all 57 skills in the gstack repository.
 * 2. Generates .agent/skills.json and .agents/skills.json (structured registry).
 * 3. Generates .agent/workflows.md and .agents/workflows.md (interactive workflow manual).
 * 4. Transforms and packages all skills into .agent/skills/<name>/SKILL.md and
 *    .agents/skills/<name>/SKILL.md with:
 *    - Native Antigravity tool mappings (run_command, view_file, replace_file_content, ask_question)
 *    - Gemini Flash XML tags (<role_definition>, <context_and_constraints>, <step_by_step_execution>, <output_format>)
 *    - Execution Checklists replacing ExitPlanMode
 *    - Structured decision briefs replacing AskUserQuestion
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CATEGORY_MAP = {
  'office-hours': 'Plan-Mode Reviews',
  'plan-ceo-review': 'Plan-Mode Reviews',
  'plan-eng-review': 'Plan-Mode Reviews',
  'plan-design-review': 'Plan-Mode Reviews',
  'plan-devex-review': 'Plan-Mode Reviews',
  'plan-tune': 'Plan-Mode Reviews',
  'autoplan': 'Plan-Mode Reviews',
  'design-consultation': 'Plan-Mode Reviews',
  'spec': 'Plan-Mode Reviews',

  'review': 'Implementation & Quality',
  'qa': 'Implementation & Quality',
  'qa-only': 'Implementation & Quality',
  'investigate': 'Implementation & Quality',
  'design-review': 'Implementation & Quality',
  'design-shotgun': 'Implementation & Quality',
  'design-html': 'Implementation & Quality',
  'devex-review': 'Implementation & Quality',
  'test-audit': 'Implementation & Quality',
  'deslop-shared-libs': 'Implementation & Quality',
  'codex': 'Implementation & Quality',
  'claude-code': 'Implementation & Quality',

  'ship': 'Release & Deploy',
  'land-and-deploy': 'Release & Deploy',
  'canary': 'Release & Deploy',
  'landing-report': 'Release & Deploy',
  'document-release': 'Release & Deploy',
  'document-generate': 'Release & Deploy',
  'setup-deploy': 'Release & Deploy',
  'gstack-upgrade': 'Release & Deploy',

  'browse': 'Browser & Automation',
  'open-gstack-browser': 'Browser & Automation',
  'setup-browser-cookies': 'Browser & Automation',
  'scrape': 'Browser & Automation',
  'skillify': 'Browser & Automation',
  'pair-agent': 'Browser & Automation',

  'ios-qa': 'iOS Live-Device QA',
  'ios-fix': 'iOS Live-Device QA',
  'ios-design-review': 'iOS Live-Device QA',
  'ios-clean': 'iOS Live-Device QA',
  'ios-sync': 'iOS Live-Device QA',

  'context-save': 'Operational & Memory',
  'context-restore': 'Operational & Memory',
  'learn': 'Operational & Memory',
  'retro': 'Operational & Memory',
  'health': 'Operational & Memory',
  'benchmark': 'Operational & Memory',
  'benchmark-models': 'Operational & Memory',
  'eval-plan': 'Operational & Memory',
  'cso': 'Operational & Memory',
  'setup-gbrain': 'Operational & Memory',
  'sync-gbrain': 'Operational & Memory',

  'careful': 'Safety & Scoping',
  'freeze': 'Safety & Scoping',
  'guard': 'Safety & Scoping',
  'unfreeze': 'Safety & Scoping',
  'make-pdf': 'Safety & Scoping',
  'diagram': 'Safety & Scoping'
};

const ROLE_MAP = {
  'office-hours': 'YC Partner & Product Strategist',
  'plan-ceo-review': 'Founder / Chief Executive Officer Reviewer',
  'plan-eng-review': 'Principal Software Engineer & Engineering Manager',
  'plan-design-review': 'Principal Product Designer & UX Architect',
  'plan-devex-review': 'Head of Developer Experience & SDK Architect',
  'plan-tune': 'Autonomous Tuning Specialist',
  'autoplan': 'Executive Review Orchestrator',
  'design-consultation': 'Design Systems Architect',
  'spec': 'Product Systems Architect & Specification Engineer',

  'review': 'Staff Code Reviewer & Production Safety Lead',
  'qa': 'Lead QA Automation Engineer & Regression Specialist',
  'qa-only': 'Independent Verification & QA Auditor',
  'investigate': 'Senior Systems Debugger & Root Cause Investigator',
  'design-review': 'Design QA Lead & Visual Systems Auditor',
  'design-shotgun': 'Exploratory UI/UX Designer',
  'design-html': 'Pretext-Native Frontend Specialist',
  'devex-review': 'Developer Experience Auditor',
  'test-audit': 'Test Architecture Specialist',
  'deslop-shared-libs': 'Refactoring & Architecture Specialist',
  'codex': 'Independent LLM Reviewer (Codex)',
  'claude-code': 'Independent LLM Reviewer (Claude)',

  'ship': 'Principal Release Engineer & Gatekeeper',
  'land-and-deploy': 'Deployment & Site Reliability Engineer',
  'canary': 'Production Telemetry & Canary Monitor',
  'landing-report': 'Release Operations Lead',
  'document-release': 'Technical Documentation Lead',
  'document-generate': 'Diataxis Documentation Architect',
  'setup-deploy': 'Cloud Infrastructure & Deploy Specialist',
  'gstack-upgrade': 'Platform Maintenance Engineer',

  'browse': 'Browser Automation & Headless Chromium Operator',
  'open-gstack-browser': 'Interactive Browser Navigator',
  'setup-browser-cookies': 'Session & Cookie Provisioning Specialist',
  'scrape': 'Web Data Extraction Specialist',
  'skillify': 'Browser Workflow Codifier',
  'pair-agent': 'Remote Agent Pairing Coordinator',

  'ios-qa': 'iOS Live-Device QA Specialist',
  'ios-fix': 'Autonomous iOS Bug Fixer',
  'ios-design-review': 'Apple HIG Design Specialist',
  'ios-clean': 'iOS Release Packaging Specialist',
  'ios-sync': 'iOS Debug Bridge Specialist',

  'context-save': 'Session Context Architect',
  'context-restore': 'Session State Restorer',
  'learn': 'Organizational Learning & Memory Manager',
  'retro': 'Engineering Retrospective Lead',
  'health': 'Codebase Health & Static Analysis Auditor',
  'benchmark': 'Web Performance & Core Web Vitals Engineer',
  'benchmark-models': 'AI Benchmarking Specialist',
  'eval-plan': 'Empirical Evaluation Architect',
  'cso': 'Chief Security Officer',
  'setup-gbrain': 'Cross-Machine Memory Coordinator',
  'sync-gbrain': 'Knowledge Graph Synchronizer',

  'careful': 'Destructive Command Guardrail',
  'freeze': 'Directory Scope Enforcer',
  'guard': 'Composite Safety & Guardrail Controller',
  'unfreeze': 'Scope Restriction Releaser',
  'make-pdf': 'Typesetting & Publication Specialist',
  'diagram': 'Visual Architecture & Diagramming Specialist'
};

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function cleanDescription(desc) {
  return desc.replace(/^\s+/gm, '').replace(/\s+/g, ' ').replace(/\(gstack\)/g, '').trim();
}

function buildAntigravityPrompt(skillName, originalContent, desc) {
  const role = ROLE_MAP[skillName] || 'Senior Staff Systems Engineer';
  const category = CATEGORY_MAP[skillName] || 'Specialized Workflow';

  // Extract body after frontmatter
  let body = originalContent;
  if (body.startsWith('---')) {
    const endFm = body.indexOf('\n---', 3);
    if (endFm !== -1) {
      body = body.slice(endFm + 4).trim();
    }
  }

  // Find where the main domain content starts, skipping Claude preamble
  const mainHeaderMatch = body.match(/\n# [^\n]+/);
  if (mainHeaderMatch) {
    body = body.slice(mainHeaderMatch.index).trim();
  }

  // Clean comments and header banners
  body = body.replace(/<!--[\s\S]*?-->\n*/g, '').trim();

  // Decouple Claude-specific phrases, tools, and paths
  body = body
    .replace(/AskUserQuestion/g, 'ask_question (or structured markdown choice brief)')
    .replace(/ExitPlanMode/g, 'update the Execution Checklist to [x] Completed and present the final plan to the developer')
    .replace(/~?\/?\.claude\/skills\/gstack\/bin\//g, 'bin/')
    .replace(/~?\/?\.claude\/skills\/gstack\//g, '.agent/skills/gstack/')
    .replace(/~?\/?\.claude\/skills\//g, '.agent/skills/')
    .replace(/~?\/?\.claude\//g, '.agent/')
    .replace(/CLAUDE\.md/g, 'ANTIGRAVITY.md / AGENTS.md')
    .replace(/use the Bash tool/g, 'use the `run_command` tool')
    .replace(/use the Read tool/g, 'use the `view_file` tool')
    .replace(/use the Write tool/g, 'use the `write_to_file` tool')
    .replace(/use the Edit tool/g, 'use the `replace_file_content` tool')
    .replace(/use the Grep tool/g, 'use the `grep_search` tool')
    .replace(/use the Glob tool/g, 'use the `list_dir` tool')
    .replace(/the Bash tool/g, '`run_command`')
    .replace(/the Read tool/g, '`view_file`')
    .replace(/the Write tool/g, '`write_to_file`')
    .replace(/the Edit tool/g, '`replace_file_content`')
    .replace(/the Grep tool/g, '`grep_search`')
    .replace(/the Glob tool/g, '`list_dir`')
    .replace(/the Agent tool/g, '`invoke_subagent`');

  // Multi-pass decomposition scaffolds for core workflows
  let multiPassScaffold = '';
  if (skillName === 'review') {
    multiPassScaffold = `
### Multi-Pass Review Decomposition:
- **Pass 1: Architecture, Regressions & Structural Integrity**
  Diff working tree against merge base (\`git merge-base origin/main HEAD\`). Audit module boundaries, data contracts, and blast radius.
- **Pass 2: Edge Cases, Security Vulnerabilities & SQL Safety**
  Inspect trust boundaries, injection risks, authentication context, error handling, and concurrency bugs.
- **Pass 3: Verification, Test Coverage & Code Quality**
  Verify unit tests pass, typechecks pass, and code adheres to formatting rules.
`;
  } else if (skillName === 'qa') {
    multiPassScaffold = `
### Multi-Pass QA Exploration & Verification:
- **Pass 1: Reproduction & Critical User Journey Probes**
  Verify clean git state (\`git status\`). Execute reproduction probes on primary surfaces (Browser, API, CLI, Worker).
- **Pass 2: Edge & Boundary Test Probes**
  Probe zero states, empty inputs, network timeouts, error response handling, and concurrent requests.
- **Pass 3: Root Cause Isolation, Atomic Fix & Re-Verification**
  Isolate defect, apply surgical patch via \`replace_file_content\`, and re-run probe to confirm 100% resolution with zero regressions.
`;
  } else if (skillName === 'ship') {
    multiPassScaffold = `
### 5-Phase Automated Ship Pipeline:
- **Phase 1: Base Integration & Sync** — Merge base branch, resolve sync conflicts.
- **Phase 2: Comprehensive Test Execution** — Run test suite via \`run_command\` and verify zero failures.
- **Phase 3: Pre-Landing Diff Review** — Audit full diff against merge base for security, regressions, and quality.
- **Phase 4: Release Preparation** — Bump semantic version in \`VERSION\` and generate release notes in \`CHANGELOG.md\`.
- **Phase 5: Commit, Push & Pull Request** — Atomic commit with conventional formatting, push branch, open PR with full summary.
`;
  } else if (skillName === 'office-hours') {
    multiPassScaffold = `
### Dual-Mode Strategic Ideation:
- **Startup Mode**: Six forcing questions (Demand Reality, Status Quo, Desperate Specificity, Narrowest Wedge, Observation, Future-Fit).
- **Builder Mode**: Design thinking brainstorming for side projects, hackathons, open source, and learning.
- **Synthesis**: Saves structured design document to \`.gstack/projects/<slug>/design-<date>.md\`.
`;
  } else if (skillName === 'plan-ceo-review') {
    multiPassScaffold = `
### 4-Mode Vision & Ambition Review:
- **Modes**: SCOPE EXPANSION (10-star product), SELECTIVE EXPANSION (harden core + cherry-pick), HOLD SCOPE (edge case rigor), SCOPE REDUCTION (minimal viable core).
- **Pass 1**: Premise Challenge & 10-Star Product Exploration.
- **Pass 2**: System Blindspots & Critical Assumption Stress-Testing.
- **Pass 3**: Scope Resolution & Decision Record Generation.
`;
  } else if (skillName === 'plan-eng-review') {
    multiPassScaffold = `
### Multi-Pass Technical Architecture Lock:
- **Scope Gate**: Confirm review target (branch diff vs plan doc vs file path) using Antigravity multiple-choice prompt.
- **Pass 1**: Architecture, Data Flow, State Mutation & Dependency Topology.
- **Pass 2**: Edge Cases, Error Rescue Maps & Blast Radius Modeling.
- **Pass 3**: Observability, Test Plan, Migration & Rollback Strategy.
`;
  } else if (skillName === 'plan-design-review') {
    multiPassScaffold = `
### 10-Dimension Apple HIG Visual & Interaction Review:
- **Rubric**: Rates each dimension 0-10 (Hierarchy, Typography, Spacing, Color/Contrast, Feedback, Motion, Responsiveness, Accessibility, Form Design, Micro-delight).
- **Mockup Generation**: Generates visual mockups or semantic Pretext HTML before code is written.
- **Plan Enhancement**: Directly updates the plan with missing design decisions.
`;
  }

  // Build optimized Gemini Flash tag architecture
  const result = `---
name: ${skillName}
description: |
  ${cleanDescription(desc)}
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
You are the **${role}** within Google Antigravity IDE, specialized in the \`/${skillName}\` workflow (${category}).
You operate with technical precision, proactive verification, and deep contextual grounding powered by Gemini Flash.
</role_definition>

<context_and_constraints>
1. **Antigravity Native Execution**:
   - Terminal commands: \`run_command\` (PowerShell / Bash).
   - Code inspection: \`view_file\` (always inspect lines before editing).
   - Code edits: \`replace_file_content\` for contiguous edits, \`multi_replace_file_content\` for multiple edits.
   - File creation: \`write_to_file\`.
   - Workspace search: \`grep_search\` and \`list_dir\`.
   - Human decisions: Use \`ask_question\` if available, or present a structured decision brief directly in the chat turn with clear numbered choices.
2. **Checklist Discipline**:
   - Maintain a live Execution Checklist: \`[ ] Pending\`, \`[/] In Progress\`, \`[x] Completed\`.
   - Print the updated checklist after completing each major phase.
3. **Anti-Hallucination & Verification**:
   - Always verify file existence and syntax before declaring completion.
   - Never assume commands succeeded without checking return codes and output.
4. **Hard Boundaries**:
   - Do not perform irreversible deletions, force-pushes, or schema drops without explicit developer confirmation.
</context_and_constraints>

<step_by_step_execution>
## Execution Protocol for \`/${skillName}\`

### Phase 1: Context Gathering & Boundary Discovery
1. Identify the current workspace, active git branch, and relevant changed files using \`run_command\` and \`list_dir\`.
2. Inspect project rules in \`.agent/rules/\` and architectural conventions in \`ANTIGRAVITY.md\` or \`AGENTS.md\`.
3. Initialize the live **Execution Checklist** for this workflow.

### Phase 2: Workflow Execution & Multi-Pass Analysis
${multiPassScaffold}
${body}

### Phase 3: Synthesis, Verification & Next Steps
1. Verify all generated or modified files exist and have valid syntax.
2. Run any required project tests or typecheck commands via \`run_command\`.
3. Update the Execution Checklist to mark all completed phases \`[x]\`.
4. Provide a clear, actionable summary with file links and recommended follow-ups.
</step_by_step_execution>

<output_format>
- Structure output using clean Markdown headings, bullet points, and code diff blocks.
- Highlight key decisions with **bold** text and code symbols in backticks.
- Link modified files using standard Markdown syntax with file paths.
- Print the final status as one of: \`STATUS: DONE\`, \`STATUS: DONE_WITH_CONCERNS\`, or \`STATUS: BLOCKED\`.
</output_format>
`;

  return result;
}

function run() {
  console.log('Antigravity Builder: Scanning skills...');

  const dirs = fs.readdirSync(ROOT).filter(f => {
    const full = path.join(ROOT, f);
    return fs.statSync(full).isDirectory() && !f.startsWith('.') && f !== 'node_modules';
  });

  const skills = [];

  for (const d of dirs) {
    const tmplPath = path.join(ROOT, d, 'SKILL.md.tmpl');
    const mdPath = path.join(ROOT, d, 'SKILL.md');
    let content = null;
    if (fs.existsSync(mdPath)) {
      content = fs.readFileSync(mdPath, 'utf8');
    } else if (fs.existsSync(tmplPath)) {
      content = fs.readFileSync(tmplPath, 'utf8');
    }

    if (content) {
      const nameMatch = content.match(/^name:\s*(.+)$/m);
      const descMatch = content.match(/^description:\s*\|?\s*\n((?:\s{2,}.*(?:\n|$))+)/m) || content.match(/^description:\s+(.+)$/m);
      const name = nameMatch ? nameMatch[1].trim() : d;
      let desc = '';
      if (descMatch) {
        desc = descMatch[1].replace(/^\s+/gm, '').replace(/\s+/g, ' ').trim().replace(/\s*\(gstack\)\s*$/, '');
      }

      // Extract triggers
      const triggers = [];
      const triggerBlock = content.match(/^triggers:\n((?:\s+-\s+.*(?:\n|$))+)/m);
      if (triggerBlock) {
        for (const line of triggerBlock[1].split('\n')) {
          const m = line.match(/^\s+-\s+(.+)$/);
          if (m) triggers.push(m[1].replace(/['"]/g, '').trim());
        }
      }

      skills.push({
        dir: d,
        name,
        desc,
        triggers,
        content
      });
    }
  }

  skills.sort((a, b) => a.name.localeCompare(b.name));
  console.log(`Found ${skills.length} skills.`);

  // 1. Build registry object
  const registry = {};
  for (const s of skills) {
    registry['/' + s.name] = {
      command: '/' + s.name,
      name: s.name,
      category: CATEGORY_MAP[s.name] || 'Operational & Memory',
      role: ROLE_MAP[s.name] || 'Systems Engineer',
      description: cleanDescription(s.desc),
      triggers: s.triggers,
      path: `.agent/skills/${s.name}/SKILL.md`,
      tools: [
        'run_command',
        'view_file',
        'replace_file_content',
        'multi_replace_file_content',
        'write_to_file',
        'list_dir',
        'grep_search',
        'ask_question'
      ]
    };
  }

  // 2. Write skills.json to .agent and .agents
  for (const targetDir of ['.agent', '.agents']) {
    ensureDir(path.join(ROOT, targetDir));
    fs.writeFileSync(path.join(ROOT, targetDir, 'skills.json'), JSON.stringify(registry, null, 2), 'utf8');
  }
  console.log('✓ Wrote .agent/skills.json and .agents/skills.json');

  // 3. Generate workflows.md
  let workflowsMd = `# Antigravity Workflows & Slash Commands Index

This catalog registers all **${skills.length} specialist workflows** available in Google Antigravity IDE, powered by the Gemini Flash model family.

## Quick Reference by Category

`;

  const categories = [...new Set(Object.values(CATEGORY_MAP))];
  for (const cat of categories) {
    const catSkills = skills.filter(s => (CATEGORY_MAP[s.name] || 'Operational & Memory') === cat);
    workflowsMd += `### ${cat}\n\n`;
    workflowsMd += `| Command | Specialist Role | Purpose |\n`;
    workflowsMd += `|---|---|---|\n`;
    for (const s of catSkills) {
      workflowsMd += `| \`/${s.name}\` | **${ROLE_MAP[s.name] || 'Specialist'}** | ${cleanDescription(s.desc)} |\n`;
    }
    workflowsMd += `\n`;
  }

  workflowsMd += `---

## Workflow Details

`;

  for (const s of skills) {
    const cat = CATEGORY_MAP[s.name] || 'Operational & Memory';
    const role = ROLE_MAP[s.name] || 'Specialist';
    workflowsMd += `### \`/${s.name}\` — ${role}
- **Category**: ${cat}
- **Description**: ${cleanDescription(s.desc)}
- **Skill Path**: [\`.agent/skills/${s.name}/SKILL.md\`](file:///./.agent/skills/${s.name}/SKILL.md)
`;
    if (s.triggers.length > 0) {
      workflowsMd += `- **Voice / Text Triggers**: ${s.triggers.map(t => `\`"${t}"\``).join(', ')}\n`;
    }
    workflowsMd += `\n`;
  }

  for (const targetDir of ['.agent', '.agents']) {
    fs.writeFileSync(path.join(ROOT, targetDir, 'workflows.md'), workflowsMd, 'utf8');
  }
  console.log('✓ Wrote .agent/workflows.md and .agents/workflows.md');

  // 4. Transform and write all skills into .agent/skills/ and .agents/skills/
  let transformedCount = 0;
  for (const s of skills) {
    const adapted = buildAntigravityPrompt(s.name, s.content, s.desc);
    for (const targetDir of ['.agent', '.agents']) {
      const skillFolder = path.join(ROOT, targetDir, 'skills', s.name);
      ensureDir(skillFolder);
      fs.writeFileSync(path.join(skillFolder, 'SKILL.md'), adapted, 'utf8');
    }
    transformedCount++;
  }
  console.log(`✓ Standardized and generated ${transformedCount} skills in .agent/skills/ and .agents/skills/`);
}

run();
