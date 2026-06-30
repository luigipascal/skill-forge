---
name: orchestra-memory
description: >-
  Queries Orchestra shared memory at localhost:4317 before coding when context
  may exist in prior chats, synced repos, or ingested threads. Use when the user
  mentions Orchestra memory, Untitled threads, recall, or cross-project context.
---

# Orchestra Memory

Orchestra runs locally (default `http://localhost:4317`). Use it to avoid re-discovering decisions already captured in memory.

## When to recall

- User references a prior ChatGPT/NotebookLM thread by URL or nickname (e.g. "Untitled-1")
- Starting work on a repo that is in Orchestra sync paths
- Cross-project decisions (OrbaLang, Forum, Indie, Gustavo, Orchestra itself)

## Quick checks

```powershell
# Health + stats
Invoke-RestMethod http://localhost:4317/api/health

# Search by keyword
Invoke-RestMethod "http://localhost:4317/api/search?q=YOUR_QUERY&limit=10"

# Recall block for agent context
Invoke-RestMethod -Method POST -Uri http://localhost:4317/api/recall `
  -ContentType "application/json" `
  -Body '{"query":"YOUR_QUERY","limit":8}'

# Fetch conversation by ID (from search hits)
Invoke-RestMethod "http://localhost:4317/api/conversations/CONVERSATION_ID"
```

## Match ChatGPT URLs

If the user gives `https://chatgpt.com/c/<id>`, search conversations:

- `source_id` often contains `/c/<id>`
- Title may differ from "Untitled-1" — match on URL fragment, not title

## After recall

Summarize relevant memory for the user, note conflicts with current task, then proceed with implementation.
