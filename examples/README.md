# Example skills

Copy any folder into `~/.cursor/skills/` (personal) or your repo's `.cursor/skills/` (project).

| Skill | Description |
|-------|-------------|
| [typescript-quality](./typescript-quality/) | TS/Node coding defaults — minimal diffs, strict types |
| [mcp-server-quality](./mcp-server-quality/) | MCP tool design checklist |
| [orchestra-memory](./orchestra-memory/) | Query Orchestra memory at localhost:4317 *(optional)* |

Validate before use:

```bash
skill-forge validate examples/typescript-quality
```

Install all curated skills (includes these + Anthropic examples):

```bash
skill-forge install-curated
```
