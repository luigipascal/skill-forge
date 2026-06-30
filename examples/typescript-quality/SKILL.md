---
name: typescript-quality
description: >-
  Applies TypeScript and Node.js quality defaults for new code — strict types,
  minimal diffs, match surrounding conventions, no over-engineering. Use when
  writing or reviewing .ts/.tsx in Node, Vite, Next.js, or CLI projects.
---

# TypeScript Quality

## Defaults

1. **Minimize scope** — smallest correct diff; no drive-by refactors
2. **Match the repo** — naming, imports, error style, test runner
3. **Strict typing** — avoid `any`; prefer existing domain types
4. **No premature abstraction** — inline one-liners beat tiny helpers
5. **Comments** — only non-obvious business or protocol details

## Before editing

- Read surrounding files and tests
- Grep for existing patterns (same feature elsewhere)
- Run the project's lint/test command if available

## Common checks

- `async` functions: handle errors at boundaries; don't swallow failures
- Public APIs: explicit return types when exported
- Config/env: never commit secrets; use `.env.example` placeholders
- Windows paths: prefer path joins; quote paths in shell examples

## Review checklist

- [ ] Types compile (`tsc` / project build)
- [ ] Tests updated or intentionally not needed
- [ ] No unrelated file changes
- [ ] User-facing text is clear and complete sentences
