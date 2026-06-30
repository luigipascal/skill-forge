# Contributing to skill-forge

Thanks for helping improve skill-forge!

## What we welcome

- Bug fixes and tests for the CLI (`validate`, `init`, `convert`, `install-curated`, `doctor`)
- New **original** example skills in `examples/` (not copies of copyrighted material)
- Documentation improvements
- Validation rules aligned with [agentskills.io](https://agentskills.io)

## What we don't accept

- Copied content from books or paywalled courses
- Bulk imports of source-available Anthropic document skills (`docx`, `pdf`, etc.) without license clarity
- Skills that embed secrets, API keys, or destructive commands without clear guardrails

## Example skill guidelines

1. One folder under `examples/<name>/`
2. Valid `SKILL.md` (run `npm run dev validate examples/<name>`)
3. `name` matches folder name
4. Description includes **what** the skill does and **when** the agent should use it
5. Keep `SKILL.md` under ~500 lines; use `reference.md` for detail

## Development

```bash
npm install
npm run build
npm run validate:all
```

## Pull requests

1. Fork and branch from `main`
2. Keep changes focused
3. Ensure CI passes (validates all bundled skills)
4. Describe what you changed and why
