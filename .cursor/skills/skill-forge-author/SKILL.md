---
name: skill-forge-author
description: >-
  Validates and scaffolds Agent Skills using the skill-forge CLI in this repo.
  Use when creating, linting, or converting Cursor rules to SKILL.md format.
---

# Skill Forge Author

This repo is **skill-forge** — toolkit for [agentskills.io](https://agentskills.io) compatible skills.

## Commands (from repo root)

```bash
npm run dev validate examples .cursor/skills
npm run dev init my-new-skill --desc "What it does and when to use it"
npm run dev convert D:\path\to\project
npm run dev install-curated
npm run setup
```

## Skill layout

```
my-skill/
├── SKILL.md          # required — YAML frontmatter + instructions
├── reference.md      # optional
└── scripts/          # optional helpers
```

## Required frontmatter

```yaml
---
name: my-skill          # lowercase, hyphens, max 64 chars
description: ...        # WHAT + WHEN, max 1024 chars
---
```

## Cursor locations

| Scope | Path |
|-------|------|
| Personal | `~/.cursor/skills/<name>/` |
| Project | `.cursor/skills/<name>/` |

Never write to `~/.cursor/skills-cursor/` (Cursor internal).
