import test from 'node:test';
import assert from 'node:assert/strict';
import server from '../src/server.js';

let base;

test.before(async () => {
  await new Promise(resolve => server.listen(0, resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('ingest rejects missing content', async () => {
  const r = await fetch(`${base}/ingest/discord`, {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({author_id:'u1'})
  });
  assert.equal(r.status, 400);
  const j = await r.json();
  assert.match(j.error, /content is required/);
});

test('decision rejects invalid decision value', async () => {
  const ingest = await fetch(`${base}/ingest/discord`, {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({content:'hello'})
  }).then(r=>r.json());

  const r = await fetch(`${base}/decision`, {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({item_id: ingest.id, decision:'banish'})
  });
  assert.equal(r.status, 400);
  const j = await r.json();
  assert.match(j.error, /invalid decision/);
});
