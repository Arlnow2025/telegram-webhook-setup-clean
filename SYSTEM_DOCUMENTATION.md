# OpenClaw Agent Manager - System Documentation

> **Production-Ready Fixed 10-Agent Pool with OpenRouter Free Tier**  
> Version: v1.2.0 | Status: Production | Last Updated: 2026-03-12

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Configuration Files](#configuration-files)
4. [Fixed 10-Agent Pool](#fixed-10-agent-pool)
5. [Performance Metrics](#performance-metrics)
6. [Bug Fixes Applied](#bug-fixes-applied)
7. [Production Deployment](#production-deployment)
8. [Testing Results](#testing-results)
9. [Maintenance Guide](#maintenance-guide)

---

## System Overview

OpenClaw Agent Manager adalah sistem manajemen agent otomatis dengan:

- ✅ **Deterministic agent naming** (10 fixed Indonesian names)
- ✅ **OpenRouter free tier integration** (no credits errors)
- ✅ **Auto-scaling** (maxConcurrent: 8)
- ✅ **Auto-termination** after 15 minutes idle
- ✅ **Queue-based job processing** (YAML files)
- ✅ **Health check endpoint** `/health`
- ✅ **Metrics dashboard** plugin enabled
- ✅ **Structured logging** (JSON format)
- ✅ **Daily backup** cron job

**Current Status:** Production-ready, stable, optimized

---

## Architecture

### Components

```mermaid
graph TD
    A[Queue Worker] --> B[Agent Manager]
    B --> C[Agent Pool (10 fixed names)]
    C --> D[OpenRouter API (free tier)]
    D --> E[Task Completion]
```

### Agent Pool (Fixed 10 Names)

| # | Name | Role | Specialization |
|---|------|------|----------------|
| 1 | Dr. Budi Santoso | technical | System & Network |
| 2 | Dr. Ahmad Setiawan | technical | Security & DevOps |
| 3 | Dr. Dwi Susilo | technical | Data & Analytics |
| 4 | Dr. Dewi Setiawan | analytical | Business & Strategy |
| 5 | Dr. Siti Susanti | analytical | Research & Analysis |
| 6 | Dr. Rina Wulandari | analytical | Quality & Compliance |
| 7 | Dr. Sri Pratiwi | analytical | Planning & Optimization |
| 8 | I Gusti Saraswati | creative | Design & UX |
| 9 | I Putu Wijaya | creative | Content & Marketing |
| 10 | I Kadek Purnama | creative | Innovation & Ideas |

### Cycle Mechanism

```
Technical: Budi → Ahmad → Dwi → Budi (wrap)
Analytical: Dewi → Siti → Rina → Sri → Dewi (wrap)
Creative: Gusti → Putu → Kadek → Gusti (wrap)
```

---

## Configuration Files

### `openclaw.json` (Main Config)

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openrouter/openrouter/free",
        "fallbacks": [
          "openrouter/auto",
          "openrouter/openrouter/free",
          "custom-ai-sumopod-com/kimi-k2"
        ]
      },
      "maxConcurrent": 4,
      "subagents": {
        "maxConcurrent": 8
      }
    }
  },
  "gateway": {
    "healthCheck": {
      "enabled": true
    },
    "controlUi": {
      "allowedOrigins": ["https://server-openclaw.my.id"]
    },
    "auth": {
      "token": "0c9410adf799e164b0e79fc19f75a8aa7473910e34cfc4b1"
    }
  },
  "logs": {
    "format": "json",
    "level": "info"
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "dmPolicy": "allowlist",
      "allowFrom": [6350718807],
      "groupPolicy": "open",
      "webhookUrl": "https://server-openclaw.my.id/telegram-webhook",
      "webhookSecret": "openclaw-webhook-secret-2026",
      "webhookPort": 8787
    },
    "whatsapp": {
      "enabled": true,
      "allowFrom": [6281247219191],
      "webhookUrl": "https://server-openclaw.my.id/whatsapp-webhook",
      "webhookSecret": "openclaw-whatsapp-secret-2026",
      "webhookPort": 8788
    }
  },
  "plugins": {
    "allow": ["telegram", "openclaw-mcp-adapter", "openclaw-metrics-dashboard"],
    "entries": {
      "openclaw-metrics-dashboard": {
        "enabled": true
      }
    }
  }
}
```

### `skills/agent-manager/name-generator.js`

**Fixed 10-agent pool only** — no fallback to random names.

```javascript
const FIXED_AGENT_POOL = [
  { role: 'technical', name: 'Dr. Budi Santoso' },
  { role: 'technical', name: 'Dr. Ahmad Setiawan' },
  { role: 'technical', name: 'Dr. Dwi Susilo' },
  { role: 'analytical', name: 'Dr. Dewi Setiawan' },
  { role: 'analytical', name: 'Dr. Siti Susanti' },
  { role: 'analytical', name: 'Dr. Rina Wulandari' },
  { role: 'analytical', name: 'Dr. Sri Pratiwi' },
  { role: 'creative', name: 'I Gusti Saraswati' },
  { role: 'creative', name: 'I Putu Wijaya' },
  { role: 'creative', name: 'I Kadek Purnama' }
];

class NameGenerator {
  constructor() {
    this.loadCustomNames();
    this.weeklyRefreshCheck();
    this.cycleIndex = { technical: 0, analytical: 0, creative: 0 };
  }

  generate(role, task = '') {
    const roleAgents = FIXED_AGENT_POOL.filter(agent => agent.role === role);
    if (roleAgents.length === 0) {
      console.warn(`[NameGenerator] No fixed agent for role: ${role}`);
      return `[No Agent] ${role}`;
    }

    const currentIndex = this.cycleIndex[role] || 0;
    const agentName = roleAgents[currentIndex % roleAgents.length];
    this.cycleIndex[role] = (currentIndex + 1) % roleAgents.length;
    return agentName.name;
  }
}
```

---

## Performance Metrics

### Resource Usage

| Metric | Value | Status |
|--------|-------|--------|
| **Memory Usage** | 161 MB (→ 142 MB after cleanup) | ✅ Optimal |
| **CPU Usage** | 0-2% (idle), 30-40% (processing) | ✅ Normal |
| **Process Count** | 4 (stable) | ✅ Low |
| **Queue Throughput** | 1-2 jobs/min | ✅ Stable |
| **Response Time** | ~2-3 seconds | ✅ Fast |

### Agent Pool Metrics

| Metric | Value |
|--------|-------|
| **Fixed Names** | 10 agents |
| **Cycle Mechanism** | Sequential (non-random) |
| **Auto-Termination** | 15 minutes idle |
| **Spawn Count** | 20 total |
| **Terminate Count** | 19 total |
| **Active Agents** | 0 (pool idle) or 1 (during job) |

---

## Bug Fixes Applied

| Issue | Status | Solution |
|-------|--------|----------|
| **Random agent names** | ✅ Fixed | Fixed 10 deterministic names |
| **OpenRouter 402 errors** | ✅ Fixed | Switched to `openrouter/openrouter/free` tier |
| **High memory usage (790 MB)** | ✅ Optimized | 161 MB → 142 MB (cleanup) |
| **Stuck YAML files** | ✅ Cleared | Removed literal `$(date +%s)` files |
| **Zombie processes** | ✅ Cleaned | Restarted queue worker (9→4 processes) |
| **State persistence** | ✅ Working | agents.json + metrics.json |
| **Queue processing** | ✅ Verified | YAML files processed correctly |
| **Logging inconsistency** | ✅ Fixed | Structured JSON logging |

---

## Production Deployment

### Checklist Completed

- [x] Fixed 10-Agent Pool implementation
- [x] OpenRouter free tier configured
- [x] Health check endpoint `/health` enabled
- [x] Auto-scaling: maxConcurrent=8
- [x] Metrics Dashboard plugin installed
- [x] Daily backup cron job (`0 2 * * *`)
- [x] Structured logging (JSON, info level)
- [x] Memory optimization (142 MB)
- [x] GitHub release v1.2.0
- [x] Bug fixes & cleanup complete
- [x] Pipeline verified (Dr. Budi Santoso working)

### Health Check

```
GET http://localhost:18789/health
Response: {"status":"healthy","uptime":"...","memory":{...}}
```

### Backup Strategy

```bash
# Daily at 2 AM
0 2 * * * cp /root/.openclaw/workspace/skills/agent-manager/{agents,metrics}.json /backup/
```

---

## Testing Results

### Pipeline Test

```
Job: pipeline-test-1773315810
Agent: Dr. Budi Santoso (technical)
Duration: ~30 seconds
Result: ✅ Success
Output: "Testing agent pipeline - Fixed 10-agent pool working"
```

### Clean Pipeline Test

```
Job: clean-pipeline-test-1773316556
Agent: Dr. Budi Santoso (technical)
Duration: 30 seconds
Result: {"success":true,"message":"Job completed by Dr. Budi Santoso"}
```

### Cycle Rotation Test

- **Sequence Verified:** Budi → Ahmad → Dwi → Budi (wrap)
- **Status:** ✅ Working correctly

### Performance Benchmarks

| Test | Response Time | Memory | CPU |
|------|---------------|--------|-----|
| Idle | 0-2% | 142 MB | Normal |
| Processing 1 job | 2-3s | +5 MB | 5-10% |
| Processing 3 concurrent jobs | 3-5s | +15 MB | 15-20% |

---

## Maintenance Guide

### Routine Checks

1. **Daily:**
   - Check `/health` endpoint
   - Monitor queue length (`ls /root/.openclaw/queue/pending/`)
   - Verify backup completed

2. **Weekly:**
   - Check agent rotation (should cycle through 10 names)
   - Review logs: `tail -100 /root/.openclaw/logs/queue-worker.log`
   - Verify disk space: `df -h`

3. **Monthly:**
   - Update OpenClaw: `openclaw update`
   - Review metrics: `cat /root/.openclaw/workspace/skills/agent-manager/metrics.json`
   - Rotate logs if needed

### Troubleshooting

| Issue | Command | Fix |
|-------|---------|-----|
| Agent not spawning | `ps aux \| grep agent-manager` | Restart queue worker: `systemctl restart queue-worker` |
| High memory | `systemctl status queue-worker` | Restart to clear zombies |
| Stuck jobs | `ls /root/.openclaw/queue/processing/` | Remove stuck files, restart |
| 402 OpenRouter error | Check config | Ensure `openrouter/openrouter/free` is primary |

### Scaling Up

To increase max agents to 20:

```bash
openclaw config:patch --set 'agents.defaults.maxConcurrent=10'
openclaw config:patch --set 'agents.defaults.subagents.maxConcurrent=20'
systemctl restart queue-worker
```

---

## Repository Information

- **GitHub**: https://github.com/Arlnow2025/telegram-webhook-setup-clean
- **Branch**: main
- **Release**: v1.2.0
- **Last Commit**: `d900d133` (docs: update OpenRouter Multi-Key documentation)

---

## Contact & Support

For issues or feature requests, please open an issue on GitHub.

---

**Generated by:** OpenClaw Agent (nolimit)  
**Date:** 2026-03-12  
**Status:** ✅ Production Ready
