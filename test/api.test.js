import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import app from '../src/app.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('health endpoint reports ok', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('books list and create endpoints work', async () => {
  const listResponse = await fetch(`${baseUrl}/api/books`);
  assert.equal(listResponse.status, 200);
  assert.ok((await listResponse.json()).data.length >= 2);

  const createResponse = await fetch(`${baseUrl}/api/books`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: 'Test Book', author: 'Test Author' })
  });
  assert.equal(createResponse.status, 201);
  assert.equal((await createResponse.json()).data.title, 'Test Book');
});
