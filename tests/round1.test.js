import test from 'node:test';
import assert from 'node:assert/strict';
import server from '../src/server.js';

let base;

test.before(async () => {
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  base = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('ingest -> assess -> queue -> decision -> audit', async () => {
  const ingest = await fetch(`${base}/ingest/discord`, {
    method: 'POST', headers: {'content-type':'application/json'},
    body: JSON.stringify({ id: 'm1', author_id: 'u1', content: 'Buy now!!! Buy now!!! Buy now!!!'})
  }).then(r=>r.json());

  const assessed = await fetch(`${base}/assess`, {
    method: 'POST', headers: {'content-type':'application/json'},
    body: JSON.stringify({ item_id: ingest.id })
  }).then(r=>r.json());

  assert.ok(assessed.assessment.score >= 45);

  const queue = await fetch(`${base}/queue`).then(r=>r.json());
  assert.ok(queue.count >= 1);

  const decided = await fetch(`${base}/decision`, {
    method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({ item_id: ingest.id, reviewer_id: 'mod1', decision: 'reject', rationale: 'spam-like repetition' })
  }).then(r=>r.json());

  assert.equal(decided.decision, 'reject');

  const audit = await fetch(`${base}/audit`).then(r=>r.json());
  assert.ok(audit.count >= 3);
});
