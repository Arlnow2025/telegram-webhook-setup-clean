# OpenClaw Agent Manager - Indonesian Naming System

This directory contains the Agent Manager MCP server with Indonesian cultural naming.

## Files

### `server.js`
- Main MCP server with Indonesian name generation
- Agent lifecycle management (spawn, terminate, list, pool status)
- Auto-termination after 15 minutes idle
- Persistent state using `agents.json`

### `name-generator.js`
- Indonesian name generator with culturally relevant names
- Role-based naming: technical, analytical, creative
- Task-based modifiers (GitHub, Dojo, Security, etc.)
- Customizable name pools via `indonesian-names.json`

### `indonesian-names.json`
- Configurable name pools for Indonesian naming
- Separate lists for technical, analytical, creative roles
- Customizable prefixes and name combinations

## Features

### 🤖 Indonesian Naming
- **Technical**: Dr. [Nama] Santoso, Prof. [Nama] Setiawan
- **Analytical**: Prof. [Nama] Setiawan, Dr. [Nama] Susanti
- **Creative**: I Gusti [Nama] Wulansari, I Putu [Nama] Saraswati

### 🔧 MCP Tools
- `agent_spawn` - Create new agents with Indonesian names
- `agent_terminate` - Gracefully terminate agents
- `agent_list` - List all active agents
- `agent_pool_status` - Show pool utilization and health metrics

### 📊 Auto-Management
- **Auto-termination**: Idle agents terminated after 15 minutes
- **Pool Capacity**: Max 10 agents (configurable)
- **Health Monitoring**: Every 30 seconds cleanup
- **Persistent State**: Agents survive server restarts

## Usage

### Starting Server
```bash
cd skills/agent-manager
node server.js
```

### MCP Tools
```bash
# List agents
mcporter call agent-manager.agent_list

# Spawn agent
mcporter call agent-manager.agent_spawn --args '{"role":"technical","task":"github-backup"}'

# Pool status
mcporter call agent-manager.agent_pool_status
```

### Integration
Agent Manager integrates with Queue Worker for auto-agent spawning based on job types:
- `dojo-train` → technical agent
- `nmap-scan` → technical agent
- `github-backup` → technical agent
- `report` → analytical agent
- `content` → creative agent

## Configuration

### `config.yaml`
```yaml
agent_timeout_ms: 900000
pool_max_size: 10
state_file: agents.json
audit_log: audit.log
metrics_file: metrics.json
```

### Name Customization
Edit `indonesian-names.json` to add/remove names for specific roles.

## Security
- **PrivateTmp**: Isolated temp directories
- **ProtectSystem**: System file protection
- **ReadWritePaths**: Limited filesystem access
- **NoNewPrivileges**: No privilege escalation

## Monitoring
- **Audit Log**: All agent lifecycle events
- **Metrics**: Spawn/terminate counts, uptime
- **Health Checks**: Every 30 seconds

## Dependencies
- Node.js 22+
- @modelcontextprotocol/sdk
- File system for persistent state

---

**Built with ❤️ for Indonesian cultural relevance in agent systems**