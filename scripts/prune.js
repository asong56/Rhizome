#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'nodes.json');
const TIMEOUT = 8000;
const BATCH = 5;

async function probe(url) {
  for (const method of ['HEAD', 'GET']) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT);
    try {
      const r = await fetch(url, { method, signal: ctrl.signal, redirect: 'follow', headers: { 'User-Agent': 'Rhizome-Pruner/1.0' } });
      clearTimeout(t);
      if (r.ok || r.status < 500) return true;
    } catch (_) { clearTimeout(t); }
  }
  return false;
}

async function checkAll(nodes) {
  const out = [];
  for (let i = 0; i < nodes.length; i += BATCH) {
    const batch = await Promise.all(nodes.slice(i, i + BATCH).map(n => probe(n.url).then(ok => ({ ...n, _ok: ok }))));
    out.push(...batch);
    if (i + BATCH < nodes.length) await new Promise(r => setTimeout(r, 500));
  }
  return out;
}

const nodes = JSON.parse(readFileSync(PATH, 'utf8'));
console.log('🌿 Rhizome Pruner\n');
let changed = 0;

const pruned = (await checkAll(nodes)).map(({ _ok, ...n }) => {
  const was = n.status === 'dormant';
  if (!_ok && !was) { console.log(`  💤 dormant: ${n.id}`); changed++; return { ...n, status: 'dormant' }; }
  if (_ok && was)  { console.log(`  ✅ revived: ${n.id}`); changed++; const { status, ...r } = n; return r; }
  console.log(`  ${_ok ? '✓' : '✗'} ${n.id}`);
  return n;
});

if (changed) { writeFileSync(PATH, JSON.stringify(pruned, null, 2) + '\n'); console.log(`\n🌿 ${changed} node(s) updated.`); }
else console.log('\n🌿 All nodes unchanged.');
