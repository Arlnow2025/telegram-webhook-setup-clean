// Indonesian Name Generator for OpenClaw Agent Manager
// v1.1.0 - Fixed: task modifier tidak menyusup ke nama agent

const fs = require('fs');
const path = require('path');

// Name pools default
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
    lastNames: ['Setiawan', 'Susanti', 'Wulandari', 'Pratiwi', 'Ningsih', 'Haryanti', 'Puspita', 'Haryani', 'Prasetyawati', 'Kusumaningrum'],
    prefixes: ['Prof.', 'Dr.']
  },
  creative: {
    titles: ['Creative', 'Art', 'Design', 'Media'],
    firstNames: ['Gusti', 'Putu', 'Kadek', 'Nyoman', 'Made', 'Ketut', 'Wayan', 'Komang', 'Agung', 'Gede'],
    lastNames: ['Wulansari', 'Saraswati', 'Wijaya', 'Suardana', 'Purnama', 'Candra', 'Surya', 'Paramita', 'Mahadewi', 'Anggraini'],
    prefixes: ['I Gusti', 'I Putu', 'I Kadek']
  }
};

// Task-based name modifiers (hanya untuk generateWithTask, tidak dipakai di generate())
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
            // Merge array dengan deduplikasi, tidak replace seluruh pool
            for (const key in customData[role]) {
              if (Array.isArray(customData[role][key]) && Array.isArray(NAME_POOLS[role][key])) {
                const merged = [...new Set([...NAME_POOLS[role][key], ...customData[role][key]])];
                NAME_POOLS[role][key] = merged;
              } else {
                NAME_POOLS[role][key] = customData[role][key];
              }
            }
          }
        }
        console.log('[NameGenerator] Loaded custom Indonesian names');
      } catch (err) {
        console.error('[NameGenerator] Failed to load custom names:', err.message);
      }
    }
  }

  generate(role, task = '') {
    if (!NAME_POOLS[role]) {
      role = 'technical'; // Default fallback
    }

    const pool = NAME_POOLS[role];

    const firstName = this.getRandom(pool.firstNames);
    const lastName = this.getRandom(pool.lastNames);

    // FIX: Prefix hanya berdasarkan role, TIDAK campur task modifier ke dalam nama
    let prefix = '';
    if (role === 'technical' || role === 'analytical') {
      // Gunakan "Prof." jika task mengandung kata github/dojo, selainnya "Dr."
      const isAcademic = task && (task.toLowerCase().includes('github') || task.toLowerCase().includes('dojo'));
      prefix = isAcademic ? 'Prof. ' : 'Dr. ';
    } else if (role === 'creative') {
      // Ambil prefix Bali yang valid dari pool
      const randomPrefix = this.getRandom(pool.prefixes) || 'I Gusti';
      prefix = randomPrefix + ' ';
    }

    return `${prefix}${firstName} ${lastName}`;
  }

  getRandom(array) {
    if (!array || array.length === 0) return '';
    return array[Math.floor(Math.random() * array.length)];
  }

  generateMultiple(role, count) {
    const names = new Set();
    let attempts = 0;
    const maxAttempts = count * 10; // Cegah infinite loop jika pool kecil
    while (names.size < count && attempts < maxAttempts) {
      names.add(this.generate(role, ''));
      attempts++;
    }
    return Array.from(names);
  }

  // Generate name dengan task modifier sebagai label (bukan bagian dari nama)
  generateWithTask(role, task) {
    const baseName = this.generate(role, task);
    const taskKeywords = Object.keys(TASK_MODIFIERS);
    const matchedKeyword = taskKeywords.find(keyword =>
      task.toLowerCase().includes(keyword)
    );

    // Task modifier hanya sebagai label terpisah, bukan disisipkan ke nama
    if (matchedKeyword) {
      return {
        name: baseName,
        taskLabel: TASK_MODIFIERS[matchedKeyword]
      };
    }

    return { name: baseName, taskLabel: null };
  }
}

// Create singleton instance
const nameGenerator = new NameGenerator();

module.exports = nameGenerator;
module.exports.NameGenerator = NameGenerator;

// Test jika dijalankan langsung
if (require.main === module) {
  console.log('Testing Indonesian Name Generator v1.1.0:');
  console.log('Technical (github):', nameGenerator.generate('technical', 'github-backup'));
  console.log('Technical (normal):', nameGenerator.generate('technical', 'fix-server'));
  console.log('Analytical:', nameGenerator.generate('analytical', 'report-analysis'));
  console.log('Creative:', nameGenerator.generate('creative', 'social-media'));
  console.log('Multiple technical:', nameGenerator.generateMultiple('technical', 3));
  console.log('With task label:', nameGenerator.generateWithTask('analytical', 'report-analysis'));
}
