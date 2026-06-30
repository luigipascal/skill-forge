---
name: mcp-server-quality
description: >-
  Designs and implements MCP servers with clear tool names, Zod/Pydantic schemas,
  pagination, and actionable errors. Use when building MCP tools, integrating
  APIs with Cursor, or extending Orchestra MCP surfaces.
---

# MCP Server Quality

## Tool design

- Prefix tools by domain: `github_list_repos`, `orchestra_search`
- Descriptions: one line what + when + key params
- Return focused JSON; paginate large lists
- Errors: say what failed, what to try next

## Stack preference

| Context | Choice |
|---------|--------|
| Local / Cursor stdio | TypeScript MCP SDK or Python FastMCP |
| Remote / Cloudflare | Workers + streamable HTTP (see Cloudflare MCP skill if installed) |

## Implementation checklist

- [ ] Input schema with field descriptions and examples
- [ ] `readOnlyHint` / `destructiveHint` annotations where supported
- [ ] Test with MCP Inspector: `npx @modelcontextprotocol/inspector`
- [ ] No secrets in repo; env vars documented in README

## Orchestra integration

Orchestra MCP endpoint (when server running): `http://127.0.0.1:4317/mcp`

Memory tools: `memory_search`, `memory_save`, `memory_context` — prefer these over duplicating memory logic in new MCP servers.
