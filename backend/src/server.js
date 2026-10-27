import bcrypt from 'bcryptjs';
import { loadConfig } from './config.js';
import { createDb } from './db.js';
import { createApp } from './app.js';

const config = loadConfig();
const db = createDb(config.dataDir);

// Development convenience: two demo accounts so the design can be explored immediately.
// Never created in production — use `npm run create-user` there.
if (!config.isProd && !db.findUserByEmail('maya@supervaise.io')) {
  const passwordHash = await bcrypt.hash('academy-demo', 10);
  await db.createUser({ name: 'Maya Santos', email: 'maya@supervaise.io', passwordHash, role: 'student' });
  await db.createUser({ name: 'R. Tolentino', email: 'faculty@supervaise.io', passwordHash, role: 'educator' });
  console.log('Seeded demo accounts (password "academy-demo"): maya@supervaise.io (student), faculty@supervaise.io (educator)');
}

const app = createApp({ db, config });
const server = app.listen(config.port, () => console.log(`AI Academy API listening on :${config.port} (${config.isProd ? 'production' : 'development'})`));

const stop = async () => {
  server.close();
  await db.flush();
  process.exit(0);
};
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
