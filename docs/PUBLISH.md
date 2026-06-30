# Publishing skill-forge on GitHub

Use this checklist when creating the public repository.

## 1. Create the repository

```bash
cd skill-forge   # or d:\skills
gh repo create skill-forge --public --description "CLI to validate, scaffold, and install Agent Skills for Cursor and agentskills.io agents" --source=. --remote=origin
```

Or create manually on GitHub, then:

```bash
git remote add origin https://github.com/luigipascal/skill-forge.git
git push -u origin main
```

## 2. GitHub repository settings

### About (sidebar)

**Description** (copy-paste):

```
CLI to validate, scaffold, and install Agent Skills for Cursor and agentskills.io-compatible agents. Lint SKILL.md, migrate Cursor rules, install curated starter skills.
```

**Website:** `https://agentskills.io`

**Topics** (add all):

```
agent-skills
cursor
cursor-ide
ai-agents
mcp
skills
cli
typescript
agentskills
claude
developer-tools
```

### Social preview

Optional: add a repo image (1280×640) with text: **skill-forge — Agent Skills toolkit for Cursor**

## 3. First release

```bash
git tag v0.1.0
git push origin v0.1.0
gh release create v0.1.0 --title "v0.1.0 — Initial release" --notes-file CHANGELOG.md
```

## 4. Optional: npm publish

skill-forge is designed to run from clone (`npm install && npm run setup`). npm publish is optional; if you publish:

- Add `"repository"` field to `package.json` pointing at `luigipascal/skill-forge`

## 5. Promote (free channels)

- Link from your GitHub profile README
- List on [skills.sh](https://skills.sh) if you add skills there
- Mention in Cursor community / Agent Skills discussions (follow each forum's rules)

## License note for README

This project is **original tooling**. Curated install copies only **Apache 2.0** skills from [anthropics/skills](https://github.com/anthropics/skills). It does not redistribute source-available document skills or any book content.
