// Minimal JSON-file store. Good for a single-instance deployment (a cohort of a few hundred learners).
// Writes are serialised and atomic (write temp file, then rename). To scale out, replace this module
// with a Postgres/SQLite implementation exposing the same functions.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function createDb(dataDir) {
  fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, 'db.json');
  let data = { users: [], states: {} };
  if (fs.existsSync(file)) {
    try {
      data = { users: [], states: {}, ...JSON.parse(fs.readFileSync(file, 'utf8')) };
    } catch (e) {
      throw new Error(`Cannot read ${file}: ${e.message}. Fix or remove the file.`);
    }
  }

  let writing = Promise.resolve();
  const persist = () => {
    writing = writing.then(async () => {
      const tmp = `${file}.${process.pid}.tmp`;
      await fs.promises.writeFile(tmp, JSON.stringify(data));
      await fs.promises.rename(tmp, file);
    });
    return writing;
  };

  const publicUser = (u) => u && { id: u.id, name: u.name, email: u.email, role: u.role, theme: u.theme || null };

  return {
    publicUser,
    findUserByEmail: (email) => data.users.find((u) => u.email === email.toLowerCase()) || null,
    findUserById: (id) => data.users.find((u) => u.id === id) || null,
    async createUser({ name, email, passwordHash, role }) {
      const user = { id: crypto.randomUUID(), name, email: email.toLowerCase(), passwordHash, role, theme: null, createdAt: new Date().toISOString() };
      data.users.push(user);
      await persist();
      return user;
    },
    async setTheme(userId, theme) {
      const u = data.users.find((x) => x.id === userId);
      if (u) {
        u.theme = theme;
        await persist();
      }
    },
    getState: (userId, key) => (data.states[userId] && data.states[userId][key]) ?? null,
    async setState(userId, key, value) {
      (data.states[userId] ||= {})[key] = value;
      await persist();
    },
    flush: () => writing,
  };
}
