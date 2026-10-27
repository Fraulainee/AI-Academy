import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createDb } from './db.js';
import { createApp } from './app.js';
import { loadConfig } from './config.js';

let server, base, dir;
const cookieOf = (res) => (res.headers.get('set-cookie') || '').split(';')[0];
const call = (p, { method = 'GET', body, cookie } = {}) =>
  fetch(base + p, {
    method,
    headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });

before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aia-'));
  const config = loadConfig({ JWT_SECRET: 'x'.repeat(40), EDUCATOR_EMAILS: 'prof@school.edu', FRONTEND_DIST: path.join(dir, 'none') });
  const app = createApp({ db: createDb(dir), config });
  await new Promise((r) => (server = app.listen(0, r)));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test('register, me, logout, login', async () => {
  let res = await call('/api/auth/register', { method: 'POST', body: { name: 'Ana Cruz', email: 'Ana@Example.com', password: 'longenough1' } });
  assert.equal(res.status, 201);
  const cookie = cookieOf(res);
  assert.match(cookie, /^aia_session=/);
  assert.equal((await res.json()).user.role, 'student');

  res = await call('/api/auth/me', { cookie });
  assert.equal((await res.json()).user.email, 'ana@example.com');
  assert.equal((await (await call('/api/auth/me')).json()).user, null);

  res = await call('/api/auth/register', { method: 'POST', body: { name: 'Dup', email: 'ana@example.com', password: 'longenough1' } });
  assert.equal(res.status, 409);

  res = await call('/api/auth/login', { method: 'POST', body: { email: 'ana@example.com', password: 'wrong-password' } });
  assert.equal(res.status, 401);
  res = await call('/api/auth/login', { method: 'POST', body: { email: 'ana@example.com', password: 'longenough1' } });
  assert.equal(res.status, 200);
});

test('validation and educator allow-list', async () => {
  let res = await call('/api/auth/register', { method: 'POST', body: { name: 'X', email: 'bad', password: 'longenough1' } });
  assert.equal(res.status, 400);
  res = await call('/api/auth/register', { method: 'POST', body: { name: 'X', email: 'x@y.co', password: 'short' } });
  assert.equal(res.status, 400);
  res = await call('/api/auth/register', { method: 'POST', body: { name: 'Prof', email: 'prof@school.edu', password: 'longenough1' } });
  assert.equal((await res.json()).user.role, 'educator');
});

test('page state is private per user and requires sign-in', async () => {
  assert.equal((await call('/api/state/mock-exam')).status, 401);
  const a = cookieOf(await call('/api/auth/register', { method: 'POST', body: { name: 'A', email: 'a@a.co', password: 'longenough1' } }));
  const b = cookieOf(await call('/api/auth/register', { method: 'POST', body: { name: 'B', email: 'b@b.co', password: 'longenough1' } }));
  assert.equal((await call('/api/state/mock-exam', { method: 'PUT', cookie: a, body: { data: { history: [1] } } })).status, 200);
  assert.deepEqual((await (await call('/api/state/mock-exam', { cookie: a })).json()).data, { history: [1] });
  assert.equal((await (await call('/api/state/mock-exam', { cookie: b })).json()).data, null);
  assert.equal((await call('/api/state/Bad_Key', { cookie: a })).status, 400);
  assert.equal((await call('/api/state/mock-exam', { method: 'PUT', cookie: a, body: { data: 'str' } })).status, 400);
});

test('theme preference', async () => {
  const c = cookieOf(await call('/api/auth/register', { method: 'POST', body: { name: 'T', email: 't@t.co', password: 'longenough1' } }));
  assert.equal((await call('/api/me/theme', { method: 'PUT', cookie: c, body: { theme: 'neon' } })).status, 400);
  assert.equal((await call('/api/me/theme', { method: 'PUT', cookie: c, body: { theme: 'dark' } })).status, 200);
  assert.equal((await (await call('/api/auth/me', { cookie: c })).json()).user.theme, 'dark');
});

test('unknown api route is JSON 404', async () => {
  const res = await call('/api/nope');
  assert.equal(res.status, 404);
  assert.ok((await res.json()).error);
});
