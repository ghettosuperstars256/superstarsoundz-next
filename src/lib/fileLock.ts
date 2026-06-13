// File-based write locking to prevent concurrent write corruption
// Uses a simple in-memory mutex per file path

const locks = new Map<string, Promise<void>>();

async function acquireLock(file: string): Promise<() => void> {
  // Wait for any existing lock on this file
  while (locks.has(file)) {
    await locks.get(file);
  }

  // Create a new lock
  let release: () => void;
  const promise = new Promise<void>(resolve => { release = resolve; });
  locks.set(file, promise);

  return () => {
    locks.delete(file);
    release!();
  };
}

// Thread-safe JSON write: acquires lock, reads current data, writes atomically
export async function safeWriteJSON(file: string, data: any): Promise<void> {
  const release = await acquireLock(file);
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dir = path.default.dirname(file);
    if (!fs.default.existsSync(dir)) {
      fs.default.mkdirSync(dir, { recursive: true });
    }
    // Write to temp file then rename for atomicity
    const tmpFile = `${file}.tmp.${Date.now()}`;
    fs.default.writeFileSync(tmpFile, JSON.stringify(data, null, 2));
    fs.default.renameSync(tmpFile, file);
  } finally {
    release();
  }
}

// Thread-safe JSON read
export async function safeReadJSON(file: string): Promise<any> {
  const release = await acquireLock(file);
  try {
    const fs = await import('fs');
    if (!fs.default.existsSync(file)) return null;
    return JSON.parse(fs.default.readFileSync(file, 'utf-8'));
  } finally {
    release();
  }
}

// Thread-safe JSON append: read → modify → write in a single lock
export async function safeUpdateJSON(
  file: string,
  updater: (current: any) => any,
  defaultValue: any = []
): Promise<any> {
  const release = await acquireLock(file);
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dir = path.default.dirname(file);
    if (!fs.default.existsSync(dir)) {
      fs.default.mkdirSync(dir, { recursive: true });
    }

    let current = defaultValue;
    if (fs.default.existsSync(file)) {
      try {
        current = JSON.parse(fs.default.readFileSync(file, 'utf-8'));
      } catch {
        current = defaultValue;
      }
    }

    const updated = updater(current);

    const tmpFile = `${file}.tmp.${Date.now()}`;
    fs.default.writeFileSync(tmpFile, JSON.stringify(updated, null, 2));
    fs.default.renameSync(tmpFile, file);

    return updated;
  } finally {
    release();
  }
}
