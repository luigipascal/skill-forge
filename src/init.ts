import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

export function initSkill(options: {
  name: string;
  description: string;
  targetDir: string;
  scope: 'personal' | 'project';
}): string {
  const slug = slugify(options.name);
  if (!slug) throw new Error('Invalid skill name');

  const base =
    options.scope === 'personal'
      ? join(process.env.USERPROFILE ?? process.env.HOME ?? '', '.cursor', 'skills', slug)
      : join(options.targetDir, '.cursor', 'skills', slug);

  if (existsSync(join(base, 'SKILL.md'))) {
    throw new Error(`Skill already exists: ${base}`);
  }

  mkdirSync(base, { recursive: true });

  const content = `---
name: ${slug}
description: ${options.description.replace(/\n/g, ' ')}
---

# ${options.name}

## Instructions

Add step-by-step guidance for the agent.

## Examples

- Example usage 1
- Example usage 2

## Guidelines

- Keep outputs consistent with project conventions
`;

  const skillPath = join(base, 'SKILL.md');
  writeFileSync(skillPath, content, 'utf8');
  return skillPath;
}
