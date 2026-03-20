#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const PATH     = join(dirname(fileURLToPath(import.meta.url)), '..', 'nodes.json');
const REQUIRED = ['name', 'url', 'bio'];
const ALLOWED  = new Set([...REQUIRED, 'status']);
const URL_RE   = /^https?:\/\/.+\..+/;

function validate(n, i) {
    const errors = [];
    const prefix = `[${i}] ${n.name ?? '?'}`;

    for (const k of Object.keys(n)) {
        if (!ALLOWED.has(k)) errors.push(`${prefix}: unknown field "${k}"`);
    }
    for (const f of REQUIRED) {
        if (!n[f]) errors.push(`${prefix}: missing required field "${f}"`);
    }

    if (n.url && !URL_RE.test(n.url))  errors.push(`${prefix}: url must be http/https`);
    if (n.url?.endsWith('/'))           errors.push(`${prefix}: url must not have trailing slash`);
    if (n.bio?.length > 160)           errors.push(`${prefix}: bio exceeds 160 chars`);
    if (n.name?.length > 64)           errors.push(`${prefix}: name exceeds 64 chars`);
    if (n.status && n.status !== 'dormant') {
        errors.push(`${prefix}: status must be "dormant"`);
    }

    return errors;
}

console.log('🌿 Rhizome Validator\n');

let nodes;
try {
    nodes = JSON.parse(readFileSync(PATH, 'utf8'));
} catch (e) {
    console.error('Parse error:', e.message);
    process.exit(1);
}

if (!Array.isArray(nodes)) {
    console.error('nodes.json must be an array');
    process.exit(1);
}

const seen = new Map();
nodes.forEach((n, i) => {
    if (!n.url) return;
    if (seen.has(n.url)) console.error(`Duplicate url "${n.url}" at ${seen.get(n.url)} and ${i}`);
    seen.set(n.url, i);
});

const errors = nodes.flatMap(validate);
if (errors.length) {
    errors.forEach(e => console.error('  ✗', e));
    console.error(`\n${errors.length} error(s).`);
    process.exit(1);
}

const dormant = nodes.filter(n => n.status === 'dormant').length;
console.log(`✓ ${nodes.length} nodes valid  (active: ${nodes.length - dormant}  dormant: ${dormant})`);
console.log('\n🌿 Grafting approved.');
