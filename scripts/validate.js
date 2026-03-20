#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'nodes.json');
const REQUIRED = ['id', 'name', 'url', 'bio', 'tag', 'v'];
const ALLOWED = new Set([...REQUIRED, 'status']);
const ID   = /^[a-z0-9_-]{1,32}$/;
const URL  = /^https?:\/\/.+\..+/;
const VER  = /^\d+\.\d+\.\d+$/;

function check(n, i) {
  const e = [], P = `[${i}] ${n.id ?? '?'}`;
  for (const k of Object.keys(n)) if (!ALLOWED.has(k)) e.push(`${P}: unknown field "${k}"`);
  for (const f of REQUIRED) if (n[f] == null) e.push(`${P}: missing "${f}"`);
  if (n.id  && !ID.test(n.id))  e.push(`${P}: id must match ${ID}`);
  if (n.url && !URL.test(n.url)) e.push(`${P}: url must be http/https`);
  if (n.url && n.url.endsWith('/')) e.push(`${P}: url must not have trailing slash`);
  if (n.bio && n.bio.length > 160) e.push(`${P}: bio exceeds 160 chars`);
  if (n.tag && /\s/.test(n.tag)) e.push(`${P}: tag must not contain spaces`);
  if (n.v   && !VER.test(n.v))  e.push(`${P}: v must be semver`);
  if (n.name && n.name.length > 64) e.push(`${P}: name exceeds 64 chars`);
  if (n.status && n.status !== 'dormant') e.push(`${P}: status must be "dormant"`);
  return e;
}

console.log('🌿 Rhizome Validator\n');
let nodes;
try { nodes = JSON.parse(readFileSync(PATH, 'utf8')); }
catch (e) { console.error('Parse error:', e.message); process.exit(1); }
if (!Array.isArray(nodes)) { console.error('nodes.json must be an array'); process.exit(1); }

const seen = new Map();
nodes.forEach((n, i) => { if (n.id) { if (seen.has(n.id)) console.error(`Duplicate id "${n.id}" at ${seen.get(n.id)} and ${i}`); seen.set(n.id, i); }});

const errors = nodes.flatMap(check);
if (errors.length) { errors.forEach(e => console.error('  ✗', e)); console.error(`\n${errors.length} error(s).`); process.exit(1); }

const dormant = nodes.filter(n => n.status === 'dormant').length;
console.log(`✓ ${nodes.length} nodes valid  (active: ${nodes.length - dormant}  dormant: ${dormant})\n🌿 Grafting approved.`);
