# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## 🔧 Installed Tools & Integrations

### GitHub CLI (`gh`)
- Version: 2.38.0
- Auth: Logged in as `Arlnow2025`
- Scopes: repo, admin, workflow
- Use: GitHub API access, repo management, issues, PRs

### MCP Porter (`mcporter`)
- Version: 0.7.3
- Purpose: Model Context Protocol client/server manager
- Config: `~/.mcporter/mcporter.json`
- Use: Connect to MCP servers (Tavily, n8n, QMD, nmap, etc.)

### Agent Browser (`agent-browser`)
- Version: 0.9.2
- Purpose: Headless browser automation (Rust + Node.js fallback)
- Use: Web automation, scraping, testing

### Context7 (MCP Server)
- URL: `https://mcp.context7.com/mcp`
- Tools: resolve-library-id, query-docs
- Coverage: 20,000+ libraries with real-time docs
- Use: Prevent outdated APIs, get code examples

### n8n-mcp (MCP Server)
- URL: `https://nsr87-n8nfree.t87iry.easypanel.host/mcp-server/http`
- Auth: Bearer token (MCP-specific)
- Tools: search_workflows, get_workflow_details, execute_workflow
- Enabled workflow: `openclaw` (FVc3THKzvG4fDdBv)
- Use: Trigger and manage n8n workflows from agents

### QMD (Local Knowledge Search)
- URL: `http://localhost:8181/mcp`
- Collection: `openclaw-docs` (40+ markdown files)
- Tools: search, vector_search, deep_search, get, multi_get, status
- Models: GGUF embedding + reranker (CPU mode)
- Use: Semantic search over workspace docs, meeting notes, decisions

### Tavily MCP
- URL: `https://mcp.tavily.com/mcp`
- Auth: Bearer token (tvly-dev-1b1n5h...)
- Tools: tavily_search, tavily_extract, tavily_crawl, tavily_map, tavily_research
- Use: Real-time web search, content extraction, website crawling, research

### nmap-mcp (Network Security)
- Location: `/root/.openclaw/workspace/skills/nmap-mcp/`
- Prerequisites: nmap 7.93+, Python 3.10+, fastmcp, python-nmap, pyyaml
- Capability: `cap_net_raw` set on `/usr/bin/nmap`
- Tools (14): ping_scan, arp_discovery, top_ports, syn_scan, tcp_scan, udp_scan, service_detection, os_detection, script_scan, vuln_scan, full_recon, custom_scan, list_scans, get_scan
- Use: Network security auditing, asset discovery, host discovery, port scanning, vulnerability assessment
- Config: `config.yaml` with `allowed_cidrs` for scope enforcement
- Audit logging: enabled to `./audit.log`
- Scan persistence: results saved to `./scans/`

---

## 📊 Tool Status Summary

| Tool | Version | Status | Purpose |
|------|---------|--------|---------|
| GitHub CLI | 2.38.0 | ✅ Installed & Auth'd | GitHub API access |
| MCP Porter | 0.7.3 | ✅ Installed | MCP client/server manager |
| Agent Browser | 0.9.2 | ✅ Installed | Web automation |
| Context7 | - | ✅ Connected | Library docs search |
| n8n-mcp | - | ✅ Connected | Workflow automation |
| QMD | - | ✅ Connected | Local knowledge search |
| Tavily MCP | - | ✅ Connected | Real-time web search |
| nmap-mcp | - | ✅ Installed | Network security scanning |

---

## 🔍 System Overview

**Core Components:**
- OpenRouter Multi-Key Agent: Running (active switch monitoring)
- Telegram Webhook: Active (via Nginx reverse proxy)
- Nginx: Running (port 80/443, SSL enabled)
- Gateway Service: Live (port 18789)
- MCP Adapter: Plugin enabled

**Security Notes:**
- Gateway bind: `loopback` (127.0.0.1) — safe for local
- Auth: Token-based (token configured)
- File permissions: 600 for sensitive configs
- Telegram DM policy: allowlist (only 6350718807)

**Repositories:**
- Primary documentation repo: https://github.com/Arlnow2025/telegram-webhook-setup-clean
- Contains: webhook docs, multi-key agent docs, multi-agent system, error documentation, skills

---

**Last Updated:** 2026-03-11 06:21 UTC
**Agent:** OpenClaw Agent (nolimit)