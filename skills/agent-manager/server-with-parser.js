// OpenClaw Agent Manager MCP Server
// Professional sub-agent lifecycle management with Indonesian naming

const fs = require('fs');
const path = require('path');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListToolsResultSchema,
  CallToolResultSchema
} = require('@modelcontextprotocol/sdk/types.js');

// Indonesian name generator
const nameGenerator = require('./name-generator');

// Configuration
const CONFIG = {
  AGENT_TIMEOUT_MS: 15 * 60 * 1000, // 15 minutes
  POOL_MAX_SIZE: 10,
  STATE_FILE: path.join(__dirname, 'agents.json'),
  AUDIT_LOG: path.join(__dirname, 'audit.log'),
  METRICS_FILE: path.join(__dirname, 'metrics.json')
};

// Load persistent state
let agents = new Map();
let metrics = { spawnCount: 0, terminateCount: 0, totalUptime: 0 };

function loadState() {
  try {
    if (fs.existsSync(CONFIG.STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG.STATE_FILE, 'utf8'));
      for (const [id, agent] of Object.entries(data.agents || {})) {
        agents.set(id, agent);
      }
      metrics = data.metrics || metrics;
      console.log(`[AgentManager] Loaded ${agents.size} agents from persistent storage`);
    }
  } catch (err) {
    console.error(`[AgentManager] Failed to load state:`, err.message);
  }
}

function saveState() {
  try {
    const state = {
      agents: Object.fromEntries(agents),
      metrics,
      lastSave: new Date().toISOString()
    };
    fs.writeFileSync(CONFIG.STATE_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error(`[AgentManager] Failed to save state:`, err.message);
  }
}

function logAudit(action, details) {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    details
  };
  fs.appendFileSync(CONFIG.AUDIT_LOG, JSON.stringify(entry) + '\n');
}

function cleanupIdleAgents() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [id, agent] of agents) {
    if (agent.status === 'active' && (now - agent.lastActive) > CONFIG.AGENT_TIMEOUT_MS) {
      agents.delete(id);
      cleaned++;
      logAudit('auto-terminate', { agentId: id, reason: 'idle timeout' });
    }
  }
  
  if (cleaned > 0) {
    console.log(`[AgentManager] Cleaned up ${cleaned} idle agents`);
    saveState();
    metrics.terminateCount += cleaned;
  }
}

function parseAgentResponse(response) {
  // Deteksi jika ada raw tool_call tags
  if (response.includes('