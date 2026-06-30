import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { validateSkillMd } from './validate.js';

/** Apache 2.0 skills from anthropics/skills — safe to copy into Cursor. */
export const CURATED_SKILLS = [
  'mcp-builder',
  'webapp-testing',
  'skill-creator',
  'frontend-design',
] as const;

export function cursorSkillsDir(): string {
  const home = process.env.USERPROFILE ?? process.env.HOME ?? '';
  return join(home, '.cursor', 'skills');
}

function cloneAnthropicsSkills(dest: string): void {
  mkdirSync(dest, { recursive: true });
  execFileSync(
    'git',
    ['clone', '--depth', '1', 'https://github.com/anthropics/skills.git', dest],
    { stdio: 'pipe', windowsHide: true },
  );
}

function copyDir(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const from = join(src, entry.name);
    const to = join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else cpSync(from, to);
  }
}

export function installCurated(options: { force?: boolean } = {}): {
  installed: string[];
  skipped: string[];
  errors: string[];
} {
  const destRoot = cursorSkillsDir();
  mkdirSync(destRoot, { recursive: true });

  const cloneDir = join(tmpdir(), `skill-forge-anthropics-${Date.now()}`);
  const installed: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  try {
    cloneAnthropicsSkills(cloneDir);
  } catch (err) {
    errors.push(`git clone failed: ${err instanceof Error ? err.message : String(err)}`);
    return { installed, skipped, errors };
  }

  for (const skill of CURATED_SKILLS) {
    const src = join(cloneDir, 'skills', skill);
    const dest = join(destRoot, skill);
    const skillMd = join(dest, 'SKILL.md');

    if (!existsSync(join(src, 'SKILL.md'))) {
      errors.push(`${skill}: not found in anthropics/skills`);
      continue;
    }

    if (existsSync(dest) && !options.force) {
      skipped.push(skill);
      continue;
    }

    if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    copyDir(src, dest);

    const result = validateSkillMd(skillMd);
    const hasError = result.issues.some((i) => i.level === 'error');
    if (hasError) {
      errors.push(`${skill}: validation failed after copy`);
    } else {
      installed.push(skill);
    }
  }

  // Install our original example skills (personal scope)
  const examples = ['orchestra-memory', 'typescript-quality', 'mcp-server-quality'];
  const repoRoot = join(import.meta.dirname, '..');
  for (const skill of examples) {
    const src = join(repoRoot, 'examples', skill);
    const dest = join(destRoot, skill);
    if (!existsSync(join(src, 'SKILL.md'))) continue;
    if (existsSync(dest) && !options.force) {
      skipped.push(skill);
      continue;
    }
    if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    copyDir(src, dest);
    installed.push(`${skill} (skill-forge)`);
  }

  rmSync(cloneDir, { recursive: true, force: true });
  return { installed, skipped, errors };
}
