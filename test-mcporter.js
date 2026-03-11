// Test MCP CLI wrapper
const queueWorker = require('./queue-worker');

// Test the wrapper
(async () => {
  try {
    const status = await queueWorker.mcporterCLI.call('agent-manager.agent_pool_status', {});
    console.log('✅ agent_pool_status:', JSON.stringify(status, null, 2));
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();