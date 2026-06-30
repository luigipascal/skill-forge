---
name: orchestra-memory
description: >-
  Queries Orchestra shared memory at localhost:4317 before coding when context
  may exist in prior chats, synced repos, or ingested threads. Use when the user
  mentions Orchestra memory, Untitled threads, recall, or cross-project context.
---

# Orchestra Memory

See `examples/orchestra-memory/SKILL.md` in the skill-forge repo for full instructions.

## Quick recall

```powershell
Invoke-RestMethod -Method POST -Uri http://localhost:4317/api/recall `
  -ContentType "application/json" `
  -Body '{"query":"YOUR_TOPIC","limit":8}'
```

Match ChatGPT threads by URL id in `source_id`, not by conversation title.
