// OpenClaw Agent Manager MCP Server
// Professional sub-agent lifecycle management with Indonesian naming

const fs = require('fs');
const path = require('path');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  ListToolsRequestSchema,
  CallToolRequestSchema
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

  // Kumpulkan dulu, baru delete (aman untuk Map iteration)
  const toClean = [];
  for (const [id, agent] of agents) {
    // Hanya agent active yang idle (tidak sedang busy)
    const isIdle = agent.status === 'active';
    const isTimedOut = (now - agent.lastActive) > CONFIG.AGENT_TIMEOUT_MS;

    if (isIdle && isTimedOut) {
      toClean.push(id);
    }
  }

  // Hapus & log
  for (const id of toClean) {
    agents.delete(id);
    cleaned++;
    logAudit('auto-terminate', {
      agentId: id,
      reason: 'idle timeout',
      timestamp: new Date().toISOString()
    });
  }

  // Simpan state dengan error handling
  if (cleaned > 0) {
    console.log(`[AgentManager] Cleaned up ${cleaned} idle agents`);
    try {
      saveState();
      metrics.terminateCount += cleaned;
    } catch (err) {
      console.error('[AgentManager] Failed to save state after cleanup:', err);
    }
  }
}

async function main() {
  // Load state
  loadState();

  // Create MCP server
  const server = new Server(
    {
      name: 'agent-manager',
      version: '1.0.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // Tool: agent_spawn
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'agent_spawn',
          description: 'Spawn a new agent with Indonesian naming',
          inputSchema: {
            type: 'object',
            properties: {
              role: {
                type: 'string',
                enum: ['technical', 'analytical', 'creative'],
                description: 'Agent role type'
              },
              task: {
                type: 'string',
                description: 'Task description for the agent'
              },
              priority: {
                type: 'number',
                description: 'Priority (1-5)',
                default: 3
              }
            },
            required: ['role', 'task']
          }
        },
        {
          name: 'agent_terminate',
          description: 'Terminate an agent',
          inputSchema: {
            type: 'object',
            properties: {
              agentId: {
                type: 'string',
                description: 'Agent ID to terminate'
              }
            },
            required: ['agentId']
          }
        },
        {
          name: 'agent_list',
          description: 'List all active agents',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'agent_pool_status',
          description: 'Get agent pool status and metrics',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'agent_spawn':
          // Check pool capacity
          if (agents.size >= CONFIG.POOL_MAX_SIZE) {
            cleanupIdleAgents();
            if (agents.size >= CONFIG.POOL_MAX_SIZE) {
              throw new Error(`Agent pool full (${agents.size}/${CONFIG.POOL_MAX_SIZE})`);
            }
          }

          // Generate Indonesian name
          const indonesianName = nameGenerator.generate(args.role, args.task);
          const agentId = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          const agent = {
            id: agentId,
            role: args.role,
            name: indonesianName,
            task: args.task,
            priority: args.priority || 3,
            status: 'active',
            spawnedAt: new Date().toISOString(),
            lastActive: Date.now(),
            metadata: {},
            instructions: [
              "Always return final answer directly",
              "Never output raw XML or tool_call tags",
              "If unsure, ask for clarification",
              "Output must be clean text or valid JSON only"
            ],
            output_format: 'clean_text'
          };

          agents.set(agentId, agent);
          metrics.spawnCount++;
          saveState();
          logAudit('spawn', { agentId, role: args.role, name: indonesianName, task: args.task });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  agentId,
                  name: indonesianName,
                  role: args.role,
                  status: 'active',
                  message: `Agent spawned: ${indonesianName} (${args.role})`
                }, null, 2)
              }
            ]
          };

        case 'agent_terminate':
          const agentToTerminate = agents.get(args.agentId);
          if (!agentToTerminate) {
            throw new Error(`Agent ${args.agentId} not found`);
          }
          agents.delete(args.agentId);
          metrics.terminateCount++;
          saveState();
          logAudit('terminate', { agentId: args.agentId, reason: 'manual' });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  agentId: args.agentId,
                  status: 'terminated',
                  message: `Agent terminated: ${agentToTerminate.name}`
                }, null, 2)
              }
            ]
          };

        case 'agent_list':
          const agentList = Array.from(agents.values()).map(a => ({
            id: a.id,
            name: a.name,
            role: a.role,
            status: a.status,
            spawnedAt: a.spawnedAt,
            lastActive: new Date(a.lastActive).toISOString()
          }));
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  count: agents.size,
                  agents: agentList
                }, null, 2)
              }
            ]
          };

        case 'agent_pool_status':
          cleanupIdleAgents();
          const byRole = {};
          for (const agent of agents.values()) {
            byRole[agent.role] = (byRole[agent.role] || 0) + 1;
          }
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  total: agents.size,
                  poolMax: CONFIG.POOL_MAX_SIZE,
                  byRole,
                  utilization: agents.size / CONFIG.POOL_MAX_SIZE,
                  metrics,
                  timestamp: new Date().toISOString()
                }, null, 2)
              }
            ]
          };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`
          }
        ],
        isError: true
      };
    }
  });

  // Periodic cleanup (every 30 seconds)
  setInterval(cleanupIdleAgents, 30000);

  // Use stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[AgentManager] Server started');
  
  // Handle shutdown
  process.on('SIGTERM', async () => {
    console.log('[AgentManager] Shutting down...');
    saveState();
    await server.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('[AgentManager] Shutting down...');
    saveState();
    await server.close();
    process.exit(0);
  });

  // Keep process alive for MCP stdio connections
  await new Promise(() => {});
}

main().catch(console.error);