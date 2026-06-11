import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data', 'dashboard-db');
const DB_DIR = path.join(DATA_DIR, 'db');

// Ensure directories exist
function ensureDirs() {
  [DATA_DIR, DB_DIR, path.join(DB_DIR, 'campaigns'), path.join(DB_DIR, 'products'), path.join(DB_DIR, 'logs')].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

ensureDirs();

function getFilePath(collection: string, id: string): string {
  return path.join(DB_DIR, collection, `${id}.json`);
}

function getCollectionDir(collection: string): string {
  const dir = path.join(DB_DIR, collection);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function readItem(collection: string, id: string): any | null {
  try {
    const filePath = getFilePath(collection, id);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export function writeItem(collection: string, id: string, data: any): void {
  const filePath = getFilePath(collection, id);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function deleteItem(collection: string, id: string): void {
  const filePath = getFilePath(collection, id);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export function listItems(collection: string): any[] {
  const dir = getCollectionDir(collection);
  try {
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try {
          return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  const logFile = path.join(DATA_DIR, 'scraper.log');
  fs.appendFileSync(logFile, logEntry + '\n');
}

export { DATA_DIR, DB_DIR };
