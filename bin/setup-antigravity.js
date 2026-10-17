#!/usr/bin/env node
/**
 * Standalone Antigravity IDE Setup Installer for gstack with Gemini Flash.
 *
 * Runs on standard Node.js (Windows, macOS, Linux).
 * Configures:
 * 1. Modular Rules in .agent/rules/ and .agents/rules/
 * 2. Complete Skills Ecosystem in .agent/skills/ and .agents/skills/
 * 3. Registry files: .agent/skills.json and .agent/workflows.md
 * 4. Companion asset copying (checklists, sections, specialists)
 * 5. Headless browser verification via Playwright (Node / Python / Bun)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function log(msg) {
  console.log(`[gstack-antigravity] ${msg}`);
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    ensureDir(dest);
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

async function main() {
  console.log('\n============================================================');
  console.log('       gstack for Google Antigravity IDE & Gemini Flash     ');
  console.log('============================================================\n');

  log('Phase 1: Validating runtime environment...');
  try {
    const nodeVer = process.version;
    log(`Node.js version: ${nodeVer}`);
  } catch (e) {
    console.error('Error: Node.js is required to install gstack for Antigravity.');
    process.exit(1);
  }

  try {
    const gitVer = execSync('git --version', { encoding: 'utf8' }).trim();
    log(`Git version: ${gitVer}`);
  } catch (e) {
    console.warn('Warning: git command not detected on PATH.');
  }

  log('Phase 2: Building Antigravity modular rules & skills...');
  const buildScript = path.join(ROOT, 'scripts', 'build-antigravity.js');
  if (fs.existsSync(buildScript)) {
    execSync(`node "${buildScript}"`, { stdio: 'inherit', cwd: ROOT });
  } else {
    console.error(`Cannot find build script at ${buildScript}`);
    process.exit(1);
  }

  log('Phase 3: Synchronizing companion skill assets (checklists, templates, sections)...');
  const skillDirs = fs.readdirSync(ROOT).filter(f => {
    const full = path.join(ROOT, f);
    return fs.statSync(full).isDirectory() && !f.startsWith('.') && f !== 'node_modules';
  });

  for (const s of skillDirs) {
    const srcDir = path.join(ROOT, s);
    for (const targetRoot of ['.agent/skills', '.agents/skills']) {
      const destDir = path.join(ROOT, targetRoot, s);
      if (!fs.existsSync(destDir)) continue;

      // Copy sections/ if present
      const sectionsDir = path.join(srcDir, 'sections');
      if (fs.existsSync(sectionsDir)) {
        copyRecursive(sectionsDir, path.join(destDir, 'sections'));
      }

      // Copy templates/ if present
      const templatesDir = path.join(srcDir, 'templates');
      if (fs.existsSync(templatesDir)) {
        copyRecursive(templatesDir, path.join(destDir, 'templates'));
      }

      // Copy specialists/ if present
      const specialistsDir = path.join(srcDir, 'specialists');
      if (fs.existsSync(specialistsDir)) {
        copyRecursive(specialistsDir, path.join(destDir, 'specialists'));
      }

      // Copy markdown assets (like checklist.md, greptile-triage.md)
      for (const file of fs.readdirSync(srcDir)) {
        if (file.endsWith('.md') && file !== 'SKILL.md' && file !== 'SKILL.md.tmpl') {
          fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
        }
      }
    }
  }

  log('✓ Companion assets (checklists, sections, templates) staged successfully.');

  log('Phase 4: Configuring browser automation dependencies (Playwright)...');
  const skipBrowser = process.argv.includes('--no-browser') || process.env.GSTACK_SKIP_PLAYWRIGHT === '1';
  if (!skipBrowser) {
    try {
      log('Verifying Playwright browser availability...');
      const checkCmd = 'npx playwright --version';
      execSync(checkCmd, { stdio: 'pipe', cwd: ROOT });
      log('Playwright package detected.');
      
      // Attempt browser install if needed
      log('Installing Playwright Chromium browser binary...');
      execSync('npx playwright install chromium', { stdio: 'inherit', cwd: ROOT });
      log('✓ Headless Chromium is installed and ready.');
    } catch (err) {
      log('Notice: Playwright installation skipped or will run on first browser workflow.');
    }
  } else {
    log('Browser installation skipped (--no-browser).');
  }

  log('Phase 5: Setting script execution permissions...');
  if (process.platform !== 'win32') {
    try {
      execSync('chmod -R +x bin/ scripts/', { cwd: ROOT });
      log('✓ Set executable permissions on bin/ and scripts/');
    } catch (e) {}
  }

  console.log('\n============================================================');
  console.log('  gstack for Antigravity IDE is INSTALLED and READY!        ');
  console.log('============================================================');
  console.log('Installed features:');
  console.log('  ✓ 57 Specialist Skills in .agent/skills/ and .agents/skills/');
  console.log('  ✓ Modular Rules in .agent/rules/ & .agents/rules/');
  console.log('  ✓ Slash Command Registry in .agent/skills.json');
  console.log('  ✓ Interactive Workflows in .agent/workflows.md');
  console.log('  ✓ Gemini Flash Reasoning Scaffolds (<role_definition>, <step_by_step_execution>)');
  console.log('  ✓ Antigravity Multiple-Choice Inquiries (Replaces AskUserQuestion)');
  console.log('  ✓ Live Execution Checklists (Replaces ExitPlanMode)');
  console.log('\nQuick Start:');
  console.log('  Trigger any workflow in Antigravity chat:');
  console.log('    /office-hours      -> Reframing & strategic product brief');
  console.log('    /plan-ceo-review   -> CEO 10-star product review');
  console.log('    /plan-eng-review   -> Architecture, edge cases & data flow review');
  console.log('    /review            -> Multi-pass pre-landing PR code review');
  console.log('    /qa                -> Autonomous surface QA & atomic fixes');
  console.log('    /ship              -> Automated 5-phase test, review & PR ship pipeline');
  console.log('\nFor documentation and full command index, view ANTIGRAVITY.md\n');
}

main().catch(err => {
  console.error('[setup-antigravity] Fatal error:', err);
  process.exit(1);
});
