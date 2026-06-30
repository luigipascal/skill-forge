import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { slugify } from './init.js';

function walkMdc(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkMdc(full, out);
    else if (entry.endsWith('.mdc')) out.push(full);
  }
  return out;
}

function parseMdc(content: string): { description?: string; globs?: string; alwaysApply?: string; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { body: content };
  const fm = match[1];
  const body = match[2];
  const get = (key: string) => fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim();
  return {
    description: get('description'),
    globs: get('globs'),
    alwaysApply: get('alwaysApply'),
    body,
  };
}

export function convertMdcRules(projectRoot: string, dryRun = false): { converted: string[]; skipped: string[] } {
  const rulesDir = join(projectRoot, '.cursor', 'rules');
  const skillsDir = join(projectRoot, '.cursor', 'skills');
  const converted: string[] = [];
  const skipped: string[] = [];

  for (const mdcPath of walkMdc(rulesDir)) {
    const raw = readFileSync(mdcPath, 'utf8');
    const parsed = parseMdc(raw);
    if (!parsed.description) {
      skipped.push(`${relative(projectRoot, mdcPath)} (no description)`);
      continue;
    }
    if (parsed.globs || parsed.alwaysApply === 'true') {
      skipped.push(`${relative(projectRoot, mdcPath)} (globs or alwaysApply — keep as rule)`);
      continue;
    }

    const base = basename(mdcPath, '.mdc');
    const slug = slugify(base);
    const destDir = join(skillsDir, slug);
    const destPath = join(destDir, 'SKILL.md');

    if (existsSync(destPath)) {
      skipped.push(`${relative(projectRoot, mdcPath)} (skill exists)`);
      continue;
    }

    const skillContent = `---
name: ${slug}
description: ${parsed.description}
---

${parsed.body.trimStart()}`;

    if (!dryRun) {
      mkdirSync(destDir, { recursive: true });
      writeFileSync(destPath, skillContent, 'utf8');
    }
    converted.push(relative(projectRoot, destPath));
  }

  return { converted, skipped };
}

export function convertCommands(projectRoot: string, dryRun = false): { converted: string[] } {
  const commandsDir = join(projectRoot, '.cursor', 'commands');
  const skillsDir = join(projectRoot, '.cursor', 'skills');
  const converted: string[] = [];

  if (!existsSync(commandsDir)) return { converted };

  for (const entry of readdirSync(commandsDir)) {
    if (!entry.endsWith('.md')) continue;
    const cmdPath = join(commandsDir, entry);
    const body = readFileSync(cmdPath, 'utf8');
    const slug = slugify(basename(entry, '.md'));
    const destDir = join(skillsDir, slug);
    const destPath = join(destDir, 'SKILL.md');
    if (existsSync(destPath)) continue;

    const firstLine = body.split(/\r?\n/).find((l) => l.trim() && !l.startsWith('#'));
    const description =
      firstLine?.slice(0, 200) ??
      `Run the ${slug} workflow. Use when the user invokes /${slug} or asks for ${slug.replace(/-/g, ' ')}.`;

    const skillContent = `---
name: ${slug}
description: ${description.replace(/\n/g, ' ')}
---

${body.trimStart()}`;

    if (!dryRun) {
      mkdirSync(destDir, { recursive: true });
      writeFileSync(destPath, skillContent, 'utf8');
    }
    converted.push(relative(projectRoot, destPath));
  }

  return { converted };
}
