import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const skill = readFileSync(new URL('../skills/answer-me-with-html/SKILL.md', import.meta.url), 'utf8');
const reply = skill.slice(skill.indexOf('5. Reply in the terminal'), skill.indexOf('\nWhen a page already exists'));
const lines = reply.split('\n');
const find = (needle) => lines.find((line) => line.includes(needle)) ?? '';

test('page links: a served URL takes priority over the local file link', () => {
  const served = lines.findIndex((line) => line.includes('If the render output has a `link:` line'));
  const fallback = lines.findIndex((line) => line.includes('Otherwise write the page link'));
  assert.ok(served >= 0, 'the served URL rule exists');
  assert.ok(fallback > served, 'choose the served URL before the local-file link');
  assert.match(lines[served], /skip.*local.*links/);
});

test('page links: the fallback is a file URL whose label is the same URL', () => {
  const fallback = find('Otherwise write the page link');
  assert.match(fallback, /\[file:\/\/\/abs\/path\.html\]\(file:\/\/\/abs\/path\.html\)/);
  assert.match(fallback, /absolute path from the `✓` line/);
  assert.match(fallback, /do not percent-encode/);
  assert.doesNotMatch(fallback, /DeepSeek|Harness|Codex/, 'no host-specific branch is left in the fallback');
});

test('page links: an in-app browser or present tool is called before the reply ends with the link', () => {
  const present = find('`present` tool');
  assert.match(present, /absolute path.*before you reply/);
  assert.match(present, /Still end the reply with the link/);
  assert.ok(lines.indexOf(present) > lines.findIndex((line) => line.includes('Otherwise write the page link')), 'the tool call comes after the link rule');
});
