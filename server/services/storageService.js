const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const SEED_DIR = path.join(__dirname, '../seed');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function seedDataIfEmpty() {
  ensureDir(DATA_DIR);
  const existing = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  if (existing.length > 0) return;

  if (!fs.existsSync(SEED_DIR)) {
    console.log('No seed directory found, starting empty.');
    return;
  }
  const seeds = fs.readdirSync(SEED_DIR).filter((f) => f.endsWith('.json'));
  seeds.forEach((file) => {
    fs.copyFileSync(path.join(SEED_DIR, file), path.join(DATA_DIR, file));
  });
  console.log(`✓ Seeded ${seeds.length} sample calls from /seed`);
}

function getAllCalls() {
  ensureDir(DATA_DIR);
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf-8')))
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

function getCallById(id) {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveCall(callData) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(path.join(DATA_DIR, `${callData.id}.json`), JSON.stringify(callData, null, 2));
}

module.exports = { seedDataIfEmpty, getAllCalls, getCallById, saveCall };
