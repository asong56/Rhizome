#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const PATH     = join(dirname(fileURLToPath(import.meta.url)), '..', 'nodes.json');
const REQUIRED = ['name', 'url', 'bio'];
const ALLOWED  = new Set([...REQUIRED, 'status']);
const URL_RE   = /^https?:\/\/.+\..+/;

function validate(n, i) {
    const e = [], P = `[${i}] ${n.name ?? '?'}`;
    for (const k of Object.keys(n))   if (!ALLOWED.has(k))        e.push(`${P}: unknown field "${k}"`);
    for (const f of REQUIRED)          if (!n[f])                  e.push(`${P}: missing "${f}"`);
    if (n.url && !URL_RE.test(n.url))                              e.push(`${P}: url must be http/https`);
    if (n.url?.endsWith('/'))                                      e.push(`${P}: url must not have trailing slash`);
    if (n.bio?.length  > 160)                                      e.push(`${P}: bio exceeds 160 chars`);
    if (n.name?.length > 64)                                       e.push(`${P}: name exceeds 64 chars`);
    if (n.status && n.status !== 'dormant')                        e.push(`${P}: status must be "dormant"`);
    return e;
}

console.log('🌿 Rhizome Validator\n');

let nodes;
try { nodes = JSON.parse(readFileSync(PATH, 'utf8')); }
catch (e) { console.error('Parse error:', e.message); process.exit(1); }

if (!Array.isArray(nodes)) { console.error('nodes.json must be an array'); process.exit(1); }

// Duplicate URL check
const seen = new Map();
nodes.forEach((n, i) => {
    if (!n.url) return;
    if (seen.has(n.url)) console.error(`Duplicate url at [${seen.get(n.url)}] and [${i}]`);
    seen.set(n.url, i);
});

const errors = nodes.flatMap(validate);
if (errors.length) {
    errors.forEach(e => console.error(' ✗', e));
    console.error(`\n${errors.length} error(s).`);
    process.exit(1);
}

const dormant = nodes.filter(n => n.status === 'dormant').length;
console.log(`✓ ${nodes.length} nodes  (active: ${nodes.length - dormant}  dormant: ${dormant})\n🌿 Grafting approved.`);
