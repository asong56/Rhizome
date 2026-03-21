const K     = 'rz1', TTL = 864e5;
const DIRS  = { n: '→ Next Node', p: '← Prev Node', r: '⊕ Random Node' };
const STEPS = ['ROUTING', 'HANDSHAKE', 'VERIFYING', 'TUNNELING', 'CONNECTED'];
const sp    = new URLSearchParams(location.search);
const from  = sp.get('f'), dir = sp.get('d') || 'n';

document.getElementById('dir-label').textContent = DIRS[dir] || 'Record';

function uid(u) {
    let h = 2166136261;
    for (let i = 0; i < u.length; i++) h = Math.imul(h ^ u.charCodeAt(i), 16777619) >>> 0;
    return h.toString(36).toUpperCase().padStart(8, '0').slice(-8);
}

function mkrng(seed) {
    let s = parseInt(seed, 36) >>> 0;
    return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 2 ** 32; };
}

function fakeIPv6(rng) {
    const seg = () => (rng() * 0xffff | 0).toString(16).padStart(4, '0');
    return Array.from({ length: 8 }, seg).join(':');
}

function fakeCoord(rng) {
    const la = (rng() * 170 - 85).toFixed(4);
    const lo = (rng() * 360 - 180).toFixed(4);
    return `${Math.abs(la)}° ${la > 0 ? 'N' : 'S'},  ${Math.abs(lo)}° ${lo > 0 ? 'E' : 'W'}`;
}

function nodesUrl() {
    const base = document.querySelector('meta[name=rz-base]')?.content;
    if (base) return base + '/nodes.json';
    return location.origin + location.pathname.replace(/\/[^/]*$/, '/') + 'nodes.json';
}

async function loadNodes() {
    try {
        const c = JSON.parse(localStorage.getItem(K));
        if (c && Date.now() - c.t < TTL) return c.d;
    } catch (_) {}
    const r = await fetch(nodesUrl());
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    try { localStorage.setItem(K, JSON.stringify({ t: Date.now(), d: data })); } catch (_) {}
    return data;
}

function pickTarget(alive) {
    if (dir === 'r') {
        const u = new Uint32Array(1);
        crypto.getRandomValues(u);
        return alive[u[0] % alive.length];
    }
    const i = alive.findIndex(n => uid(n.url) === from?.toUpperCase());
    return alive[(i + (dir === 'p' ? -1 : 1) + alive.length) % alive.length];
}

function fillCard(target) {
    const id  = uid(target.url);
    const rng = mkrng(id);
    const $   = id => document.getElementById(id);

    $('f-name').textContent  = target.name;
    $('f-ip').textContent    = fakeIPv6(rng);
    $('f-coord').textContent = fakeCoord(rng);
    $('f-bio').textContent   = target.bio || '—';
    $('f-url').textContent   = target.url.replace(/^https?:\/\//, '');
    $('s-id').textContent    = id;
    $('s-time').textContent  = new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
}

function showError(msg) {
    const win = document.querySelector('.win');
    win.style.cssText += ';animation:none;opacity:1;transform:none';
    document.getElementById('f-name').textContent   = msg;
    document.getElementById('f-status').textContent = 'ERROR';
}

function startProgress(targetUrl) {
    const bar  = document.getElementById('bar');
    const pct  = document.getElementById('pct');
    const lbl  = document.getElementById('f-status');
    const win  = document.querySelector('.win');
    const t0   = performance.now(), DUR = 1800;

    function tick(now) {
        const p    = Math.min(100, (now - t0) / DUR * 100);
        const step = Math.min(4, p / 20 | 0);
        bar.value       = p;
        pct.textContent = Math.round(p) + '%';
        lbl.textContent = STEPS[step];

        if (p < 100) { requestAnimationFrame(tick); return; }

        win.style.transition = 'opacity .32s ease, transform .32s cubic-bezier(.22,1,.36,1)';
        win.style.opacity    = '0';
        win.style.transform  = 'translateY(-4px) scale(.98)';
        setTimeout(() => location.replace(targetUrl), 340);
    }

    requestAnimationFrame(tick);
}

async function boot() {
    try {
        const alive = (await loadNodes()).filter(n => n.status !== 'dormant');
        if (!alive.length) { showError('No active nodes'); return; }
        const target = pickTarget(alive);
        fillCard(target);
        startProgress(target.url);
    } catch (e) {
        showError('Failed to load nodes (' + e.message + ')');
    }
}

boot();
