import { readFileSync, existsSync } from 'node:fs';
import { basename, join } from 'node:path';

export interface SkillFrontmatter {
  name?: string;
  description?: string;
  [key: string]: string | undefined;
}

export interface ValidationIssue {
  level: 'error' | 'warn';
  message: string;
}

export interface ValidationResult {
  skillPath: string;
  name: string | null;
  issues: ValidationIssue[];
}

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function parseFrontmatter(content: string): {
  frontmatter: SkillFrontmatter;
  body: string;
  rawFrontmatter: string;
} | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const rawFrontmatter = match[1];
  const body = match[2];
  const frontmatter: SkillFrontmatter = {};
  const lines = rawFrontmatter.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!kv) {
      i++;
      continue;
    }
    const key = kv[1];
    let value = kv[2].trim();
    if (value === '|' || value === '>' || value === '|-' || value === '>-' || value === '') {
      const block: string[] = [];
      i++;
      while (i < lines.length && (lines[i].startsWith('  ') || lines[i].trim() === '')) {
        block.push(lines[i].replace(/^  /, ''));
        i++;
      }
      value = block.join('\n').trim();
    } else {
      value = value.replace(/^['"]|['"]$/g, '');
      i++;
    }
    frontmatter[key] = value;
  }
  return { frontmatter, body, rawFrontmatter };
}

export function validateSkillMd(filePath: string): ValidationResult {
  const issues: ValidationIssue[] = [];
  const skillPath = filePath;
  let name: string | null = null;

  if (!existsSync(filePath)) {
    return {
      skillPath,
      name: null,
      issues: [{ level: 'error', message: 'File not found' }],
    };
  }

  const content = readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    return {
      skillPath,
      name: null,
      issues: [{ level: 'error', message: 'Missing YAML frontmatter (--- ... ---)' }],
    };
  }

  const { frontmatter, body } = parsed;
  name = frontmatter.name ?? null;

  if (!frontmatter.name) {
    issues.push({ level: 'error', message: 'Missing required field: name' });
  } else {
    if (frontmatter.name.length > 64) {
      issues.push({ level: 'error', message: 'name must be at most 64 characters' });
    }
    if (!NAME_RE.test(frontmatter.name)) {
      issues.push({
        level: 'error',
        message: 'name must be lowercase alphanumeric with hyphens (agentskills.io)',
      });
    }
    const folder = basename(join(filePath, '..'));
    if (folder !== frontmatter.name) {
      issues.push({
        level: 'warn',
        message: `folder "${folder}" should match name "${frontmatter.name}"`,
      });
    }
  }

  if (!frontmatter.description?.trim()) {
    issues.push({ level: 'error', message: 'Missing required field: description' });
  } else if (frontmatter.description.length > 1024) {
    issues.push({ level: 'error', message: 'description must be at most 1024 characters' });
  } else if (frontmatter.description.length < 20) {
    issues.push({ level: 'warn', message: 'description is very short; add WHAT and WHEN triggers' });
  }

  if (!body.trim()) {
    issues.push({ level: 'error', message: 'Body is empty after frontmatter' });
  }

  const lines = content.split(/\r?\n/).length;
  if (lines > 500) {
    issues.push({
      level: 'warn',
      message: `SKILL.md is ${lines} lines; keep under 500 for context efficiency`,
    });
  }

  return { skillPath, name, issues };
}

export function findSkillMdRoots(paths: string[]): string[] {
  const found: string[] = [];
  for (const p of paths) {
    const direct = join(p, 'SKILL.md');
    if (existsSync(direct)) {
      found.push(direct);
      continue;
    }
    if (existsSync(p) && p.endsWith('SKILL.md')) {
      found.push(p);
    }
  }
  return found;
}
