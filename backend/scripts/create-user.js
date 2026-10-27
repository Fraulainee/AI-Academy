// Create (or reset the password of) an account from the command line.
//   npm run create-user -- --email faculty@school.edu --name "Dr. Jose" --password 'a-long-password' --role educator
import bcrypt from 'bcryptjs';
import { loadConfig } from '../src/config.js';
import { createDb } from '../src/db.js';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, all) => (cur.startsWith('--') ? [...acc, [cur.slice(2), all[i + 1]]] : acc), [])
);
const { email, name, password, role = 'student' } = args;
if (!email || !name || !password || !['student', 'educator'].includes(role)) {
  console.error('Usage: npm run create-user -- --email <email> --name <name> --password <8+ chars> [--role student|educator]');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const config = loadConfig();
const db = createDb(config.dataDir);
const existing = db.findUserByEmail(email);
if (existing) {
  console.error(`An account for ${email} already exists. Remove it from ${config.dataDir}/db.json first to recreate it.`);
  process.exit(1);
}
const user = await db.createUser({ name, email, passwordHash: await bcrypt.hash(password, 10), role });
await db.flush();
console.log(`Created ${user.role} ${user.email}`);
