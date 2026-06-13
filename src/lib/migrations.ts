// JSON file schema migration system
// Tracks schema version and applies migrations on startup

import fs from 'fs';
import path from 'path';

const SCHEMA_FILE = path.join(process.cwd(), 'src', 'data', 'schema-version.json');

interface SchemaState {
  version: number;
  lastMigratedAt: string;
}

function loadSchemaState(): SchemaState {
  try {
    if (fs.existsSync(SCHEMA_FILE)) {
      return JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf-8'));
    }
  } catch {}
  return { version: 0, lastMigratedAt: new Date(0).toISOString() };
}

function saveSchemaState(state: SchemaState) {
  const dir = path.dirname(SCHEMA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SCHEMA_FILE, JSON.stringify(state, null, 2));
}

// Migration registry — add new migrations here
const migrations: Array<{
  version: number;
  description: string;
  migrate: () => void | Promise<void>;
}> = [
  {
    version: 1,
    description: 'Ensure products have short_description field',
    migrate: () => {
      const file = path.join(process.cwd(), 'src', 'data', 'products.json');
      if (!fs.existsSync(file)) return;
      try {
        const products = JSON.parse(fs.readFileSync(file, 'utf-8'));
        let changed = false;
        for (const p of products) {
          if (!p.short_description && p.description) {
            p.short_description = p.description.replace(/<[^>]+>/g, '').substring(0, 200);
            changed = true;
          }
          if (p.sessionVersion === undefined) p.sessionVersion = 0;
        }
        if (changed) fs.writeFileSync(file, JSON.stringify(products, null, 2));
      } catch { /* ignore corrupt data */ }
    },
  },
  {
    version: 2,
    description: 'Ensure posts have status field',
    migrate: () => {
      const file = path.join(process.cwd(), 'src', 'data', 'posts.json');
      if (!fs.existsSync(file)) return;
      try {
        const posts = JSON.parse(fs.readFileSync(file, 'utf-8'));
        let changed = false;
        for (const p of posts) {
          if (!p.status) { p.status = 'published'; changed = true; }
          if (!p.excerpt && p.content) {
            p.excerpt = p.content.replace(/<[^>]+>/g, '').substring(0, 160);
            changed = true;
          }
        }
        if (changed) fs.writeFileSync(file, JSON.stringify(posts, null, 2));
      } catch { /* ignore */ }
    },
  },
  {
    version: 3,
    description: 'Ensure pages have status and metaDescription fields',
    migrate: () => {
      const file = path.join(process.cwd(), 'src', 'data', 'pages.json');
      if (!fs.existsSync(file)) return;
      try {
        let pages = JSON.parse(fs.readFileSync(file, 'utf-8'));
        // Handle both array and object formats
        let changed = false;
        if (!Array.isArray(pages)) {
          // Convert object format to array format
          pages = Object.entries(pages).map(([slug, data]: [string, any]) => ({
            id: slug,
            title: data.title || slug,
            slug,
            content: data.content || '',
            status: data.status || 'published',
            metaDescription: data.metaDescription || '',
            date: data.date || new Date().toISOString(),
          }));
          changed = true;
        }
        for (const p of pages) {
          if (!p.status) { p.status = 'published'; changed = true; }
          if (!p.metaDescription) { p.metaDescription = ''; changed = true; }
          if (!p.id) { p.id = p.slug || Date.now().toString(36); changed = true; }
        }
        if (changed) fs.writeFileSync(file, JSON.stringify(pages, null, 2));
      } catch { /* ignore */ }
    },
  },
];

export async function runMigrations() {
  const state = loadSchemaState();
  const currentVersion = state.version;

  const pending = migrations.filter(m => m.version > currentVersion);

  if (pending.length === 0) return { migrated: false, from: currentVersion, to: currentVersion };

  for (const migration of pending) {
    try {
      await migration.migrate();
    } catch (err) {
      console.error(`Migration ${migration.version} failed:`, err);
      // Continue with next migration
    }
  }

  const newVersion = pending[pending.length - 1].version;
  saveSchemaState({ version: newVersion, lastMigratedAt: new Date().toISOString() });

  return { migrated: true, from: currentVersion, to: newVersion };
}

export function getSchemaVersion(): number {
  return loadSchemaState().version;
}
