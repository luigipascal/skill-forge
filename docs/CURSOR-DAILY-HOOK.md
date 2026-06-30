# Cursor daily hook

Runs **once per calendar day** when you start a Cursor session:

1. `npm run build` (if needed)
2. `npm run doctor`
3. `npm run install:curated`

## User-level (all projects)

Already configured at `~/.cursor/hooks.json` if you used the installer.

Manual install:

1. Copy `skill-forge-daily.mjs` to `~/.cursor/hooks/`
2. Add to `~/.cursor/hooks.json`:

```json
"sessionStart": [
  {
    "command": "node",
    "args": ["C:/Users/YOU/.cursor/hooks/skill-forge-daily.mjs"],
    "env": { "SKILL_FORGE_ROOT": "D:/skills" }
  }
]
```

3. Restart Cursor (or save `hooks.json` — Cursor reloads hooks on save)

## Logs

- `~/.cursor/hooks/skill-forge-daily.log`
- Stamp file: `~/.cursor/hooks/.skill-forge-daily.last`

## Force re-run today

Delete the stamp file and open a new Cursor window:

```powershell
Remove-Item $env:USERPROFILE\.cursor\hooks\.skill-forge-daily.last -ErrorAction SilentlyContinue
```
