import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';

test('cli outputs queue decisions', ()=>{
  const out = execSync('node src/cli.js --input examples.items.json --top 2', { encoding:'utf8' });
  assert.match(out, /queue/);
  assert.match(out, /review|reject|accept/);
});
