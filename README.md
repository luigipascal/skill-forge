# skill-forge

**Free CLI to validate, scaffold, and install [Agent Skills](https://agentskills.io) for [Cursor](https://cursor.com), Claude Code, and other compatible AI coding agents.**

Stop guessing whether your `SKILL.md` is valid. Stop copy-pasting skill folders by hand. **skill-forge** gives you a small, zero-dependency toolkit to lint skills, create new ones, migrate Cursor rules, and install a curated starter set in one command.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-green.svg)](package.json)
[![Agent Skills](https://img.shields.io/badge/spec-agentskills.io-purple.svg)](https://agentskills.io)

---

## Why skill-forge?

Agent Skills are folders with a `SKILL.md` file — instructions agents load when your task matches the skill description. They work across Cursor, Claude, and a growing list of tools ([full list](https://agentskills.io)).

**The problem:** the spec is simple, but teams hit the same issues:

- Invalid frontmatter (`name`, `description`) → skill never triggers
- Cursor rules (`.mdc`) and slash commands duplicated instead of reusable skills
- No easy way to bootstrap proven example skills locally

**skill-forge solves that** with four commands: `validate`, `init`, `convert`, `install-curated`.

---

## Install

```bash
git clone https://github.com/luigipascal/skill-forge.git
cd skill-forge
npm install
npm run setup
```

`setup` builds the CLI, validates bundled examples, and optionally installs curated skills into your personal Cursor folder.

### One-liner (after cloning)

```bash
npx skill-forge doctor
npx skill-forge install-curated
```

---

## Commands

| Command | What it does |
|---------|----------------|
| `skill-forge validate [paths...]` | Lint `SKILL.md` (frontmatter, name format, description length, body) |
| `skill-forge init <name> --desc "..."` | Scaffold a new skill (project or `--scope personal`) |
| `skill-forge convert [root]` | Migrate intelligent Cursor rules + commands → `.cursor/skills/` |
| `skill-forge install-curated` | Install recommended skills to `~/.cursor/skills/` |
| `skill-forge doctor` | Check Node version and installed skills |

### Examples

```bash
# Validate your skills before committing
skill-forge validate examples .cursor/skills

# Create a project skill
skill-forge init api-review --desc "Reviews REST API designs for consistency. Use when designing endpoints or reviewing OpenAPI specs."

# Create a personal skill (all projects)
skill-forge init commit-style --scope personal --desc "Formats git commits in conventional style. Use when writing commit messages."

# Migrate Cursor rules that use 'Apply intelligently'
skill-forge convert .

# Preview migration without writing files
skill-forge convert . --dry-run

# Install starter skills (Anthropic Apache 2.0 examples + skill-forge originals)
skill-forge install-curated
skill-forge install-curated --force   # overwrite existing
```

---

## What gets installed (`install-curated`)

### From [anthropics/skills](https://github.com/anthropics/skills) (Apache 2.0)

| Skill | Good for |
|-------|----------|
| **mcp-builder** | Designing MCP servers and tools |
| **webapp-testing** | Playwright-style web app testing workflows |
| **skill-creator** | Writing skills that trigger reliably |
| **frontend-design** | UI quality and layout guidance |

### Original examples (this repo)

| Skill | Good for |
|-------|----------|
| **typescript-quality** | Strict TS/Node conventions, minimal diffs |
| **mcp-server-quality** | MCP tool naming, schemas, error messages |
| **orchestra-memory** | Recall local Orchestra memory before coding *(optional; Orchestra users)* |

---

## Skill format (quick reference)

```
my-skill/
├── SKILL.md          # required
├── reference.md      # optional — loaded on demand
└── scripts/          # optional — helper scripts
```

```markdown
---
name: my-skill
description: Does X and Y. Use when the user mentions Z or works on W.
---

# My Skill

Step-by-step instructions for the agent…
```

**Rules enforced by `validate`:**

- `name`: lowercase, hyphens, max 64 chars, should match folder name
- `description`: required, max 1024 chars, should explain WHAT + WHEN
- Body: non-empty; warn if over 500 lines

---

## Where skills live in Cursor

| Scope | Path |
|-------|------|
| All your projects | `~/.cursor/skills/<name>/SKILL.md` |
| One repository | `.cursor/skills/<name>/SKILL.md` |

**Do not** write custom skills to `~/.cursor/skills-cursor/` — that directory is reserved for Cursor internals.

---

## Convert Cursor rules → skills

Only **intelligent rules** migrate cleanly (have a `description`, no `globs`, not `alwaysApply: true`). Rules tied to file globs should stay as rules.

```bash
skill-forge convert /path/to/your/project
```

Also converts `.cursor/commands/*.md` slash commands into skills.

---

## Repository layout

```
skill-forge/
├── bin/skill-forge.js       # CLI entry
├── src/                     # TypeScript source
├── examples/                # Public example skills (copy or learn from)
├── .cursor/skills/          # Skills active when editing this repo
├── .github/workflows/       # CI: validate all bundled skills
├── CONTRIBUTING.md
└── docs/PUBLISH.md          # GitHub repo setup checklist
```

---

## Development

```bash
npm run dev validate examples
npm run build
npm test   # alias: validate:all via setup
```

---

## Related projects

- [agentskills.io](https://agentskills.io) — open Agent Skills specification
- [anthropics/skills](https://github.com/anthropics/skills) — official example skills
- [skills.sh](https://skills.sh) — skill discovery
- [Cursor Skills docs](https://cursor.com/docs/context/skills)

---

## License

Apache 2.0 — see [LICENSE](./LICENSE).

Example skills copied from `anthropics/skills` retain their upstream licenses (Apache 2.0 for listed curated skills). Document skills (`docx`, `pdf`, etc.) are **not** included in `install-curated`.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Bug reports and example skill PRs welcome.
