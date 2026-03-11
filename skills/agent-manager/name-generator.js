// Indonesian Name Generator for OpenClaw Agent Manager
// Generates culturally relevant names based on agent role

const fs = require('fs');
const path = require('path');

// Name pools
const NAME_POOLS = {
  technical: {
    titles: ['Dr.', 'Engineer', 'Tech', 'Dev'],
    firstNames: ['Budi', 'Ahmad', 'Dwi', 'Eko', 'Surya', 'Rudi', 'Agus', 'Yudi', 'Joko', 'Sandi'],
    lastNames: ['Santoso', 'Setiawan', 'Susilo', 'Prasetyo', 'Wibowo', 'Hidayat', 'Rahman', 'Hakim', 'Suryanto', 'Pratama'],
    prefixes: ['Prof.', 'Dr.']
  },
  analytical: {
    titles: ['Prof.', 'Analyst', 'Researcher', 'Data'],
    firstNames: ['Dewi', 'Siti', 'Rina', 'Lestari', 'Sri', 'Indah', 'Nita', 'Sari', 'Wati', 'Yuni'],
    lastNames: ['Setiawan', 'Susanti', 'Wulandari', 'Pratiwi', 'Ningsih', 'Haryanti', 'Puspita', 'Wulandari', 'Haryani', 'Prasetyawati'],
    prefixes: ['Prof.', 'Dr.']
  },
  creative: {
    titles: ['Creative', 'Art', 'Design', 'Media'],
    firstNames: ['Gusti', 'Putu', 'Kadek', 'Nyoman', 'Made', 'Ketut', 'Wayan', 'Komang', 'Agung', 'Gede'],
    lastNames: ['Wulansari', 'Saraswati', 'Wijaya', 'Suardana', 'Purnama', 'Candra', 'Surya', 'Paramita', 'Mahadewi', 'Anggraini'],
    prefixes: ['I Gusti', 'I Putu', 'I Kadek']
  }
};

// Task-based name modifiers
const TASK_MODIFIERS = {
  'github': 'GitHub',
  'dojo': 'Dojo',
  'nmap': 'Security',
  'backup': 'Backup',
  'deploy': 'Deploy',
  'report': 'Report',
  'content': 'Content',
  'marketing': 'Marketing',
  'social': 'Social Media',
  'design': 'Design'
};

class NameGenerator {
  constructor() {
    this.loadCustomNames();
  }

  loadCustomNames() {
    const customPath = path.join(__dirname, 'indonesian-names.json');
    if (fs.existsSync(customPath)) {
      try {
        const customData = JSON.parse(fs.readFileSync(customPath, 'utf8'));
        for (const role in customData) {
          if (NAME_POOLS[role]) {
            Object.assign(NAME_POOLS[role], customData[role]);
          }
        }
        console.log('[NameGenerator] Loaded custom Indonesian names');
      } catch (err) {
        console.error('[NameGenerator] Failed to load custom names:', err.message);
      }
    }
  }

  generate(role, task) {
    if (!NAME_POOLS[role]) {
      role = 'technical'; // Default to technical
    }

    const pool = NAME_POOLS[role];
    
    // Generate base name
    const firstName = this.getRandom(pool.firstNames);
    const lastName = this.getRandom(pool.lastNames);
    
    let fullName = `${firstName} ${lastName}`;

    // Add prefix based on role only (no task modifier in name)
    let prefix = "";
    if (role === "technical" || role === "analytical") {
      prefix = task.includes("github") || task.includes("dojo") ? "Prof. " : "Dr. ";
    } else if (role === "creative") {
      const randomPrefix = this.getRandom(pool.prefixes) || "I Gusti";
      prefix = randomPrefix + " ";
    }

    const finalName = prefix + fullName;
    return finalName;
  }

  getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateMultiple(role, count) {
    const names = new Set();
    while (names.size < count) {
      names.add(this.generate(role, ''));
    }
    return Array.from(names);
  }

  // Generate name with custom task
  generateWithTask(role, task) {
    const baseName = this.generate(role, '');
    const taskKeywords = Object.keys(TASK_MODIFIERS);
    const matchedKeyword = taskKeywords.find(keyword => 
      task.toLowerCase().includes(keyword)
    );
    
    if (matchedKeyword) {
      const modifier = TASK_MODIFIERS[matchedKeyword];
      return `${modifier} ${baseName}`;
    }
    
    return baseName;
  }
}

// Create instance
const nameGenerator = new NameGenerator();

// Export for use
module.exports = nameGenerator;

// Export class for testing
module.exports.NameGenerator = NameGenerator;

// Example usage
if (require.main === module) {
  console.log('Testing Indonesian Name Generator:');
  console.log('Technical:', nameGenerator.generate('technical', 'github-issue-triage'));
  console.log('Analytical:', nameGenerator.generate('analytical', 'data-report'));
  console.log('Creative:', nameGenerator.generate('creative', 'social-media'));
  console.log('Multiple:', nameGenerator.generateMultiple('technical', 3));
}