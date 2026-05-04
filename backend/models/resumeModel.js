const fs = require('fs/promises');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../db/resumes.json');

async function loadResumes() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveResume(record) {
  const resumes = await loadResumes();
  resumes.push(record);
  await fs.writeFile(DB_FILE, JSON.stringify(resumes, null, 2), 'utf8');
  return record;
}

module.exports = { loadResumes, saveResume };
