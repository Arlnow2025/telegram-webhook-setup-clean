// Indonesian Name Generator for OpenClaw Agent Manager
// v2.1.0 — Fixed 10-agent pool only, no fallback, weekly refresh

// Fixed agent pool (10 agents total) - deterministic, no randomness
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
    this.weeklyRefreshCheck();
    this.cycleIndex = { technical: 0, analytical: 0, creative: 0 };
  }

  // Check if we need to refresh agent pool (weekly)
  weeklyRefreshCheck() {
    const fs = require('fs');
    const path = require('path');
    const statePath = path.join(__dirname, 'agents.json');
    try {
      if (fs.existsSync(statePath)) {
        const data = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        const lastRefresh = data.lastRefresh || data.lastSave;
        if (lastRefresh) {
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          if (new Date(lastRefresh) < weekAgo) {
            this.resetCycleIndices();
            console.log('[NameGenerator] Weekly refresh: reset agent cycle indices');
          }
        }
      }
    } catch (err) {
      // Ignore errors
    }
  }

  resetCycleIndices() {
    this.cycleIndex = { technical: 0, analytical: 0, creative: 0 };
  }

  generate(role, task = '') {
    if (!FIXED_AGENT_POOL || FIXED_AGENT_POOL.length === 0) {
      console.warn('[NameGenerator] Fixed agent pool empty — returning placeholder');
      return `[No Agent] ${role}`;
    }

    // Filter agents by role
    const roleAgents = FIXED_AGENT_POOL.filter(agent => agent.role === role);
    if (roleAgents.length === 0) {
      console.warn(`[NameGenerator] No agent for role: ${role}`);
      return `[No Agent] ${role}`;
    }

    // Cycle through role agents with wrap-around
    const currentIndex = this.cycleIndex[role] || 0;
    const agentName = roleAgents[currentIndex % roleAgents.length];
    
    // Increment cycle index for next call
    this.cycleIndex[role] = (currentIndex + 1) % roleAgents.length;

    return agentName.name;
  }

  // Get current cycle index (for debugging)
  getCycleIndex(role) {
    return this.cycleIndex[role] || 0;
  }

  // Reset all cycle indices (for weekly refresh)
  resetCycle() {
    this.cycleIndex = { technical: 0, analytical: 0, creative: 0 };
    console.log('[NameGenerator] Cycle indices reset (weekly refresh)');
  }
}

// Create singleton instance
const nameGenerator = new NameGenerator();

module.exports = nameGenerator;
module.exports.NameGenerator = NameGenerator;

// Test if run directly
if (require.main === module) {
  console.log('Testing Indonesian Name Generator v2.1.0 (Fixed Pool Only):');
  console.log('Technical:', nameGenerator.generate('technical'));
  console.log('Analytical:', nameGenerator.generate('analytical'));
  console.log('Creative:', nameGenerator.generate('creative'));
  console.log('Cycle index technical:', nameGenerator.getCycleIndex('technical'));
  console.log('Cycle index analytical:', nameGenerator.getCycleIndex('analytical'));
  console.log('Cycle index creative:', nameGenerator.getCycleIndex('creative'));
}