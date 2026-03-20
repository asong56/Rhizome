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
    let s = seed >>> 0;
    return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 2 ** 32; };
}

function fakeIP(rng) {
    return `10.${rng() * 254 + 1 | 0}.${rng() * 254 + 1 | 0}.${rng() * 254 + 1 | 0}`;
}

function fakeCoord(rng) {
    const la = (rng() * 170 - 85).toFixed(4);
    const lo = (rng() * 360 - 180).toFixed(4);
    return `${Math.abs(la)}° ${la > 0 ? 'N' : 'S'},  ${Math.abs(lo)}° ${lo > 0 ? 'E' : 'W'}`;
}

async function boot() {
    let nodes;
    try {
        const c = JSON.parse(localStorage.getItem(K));
        if (c && Date.now() - c.t < TTL) nodes = c.d;
    } catch (_) {}

    if (!nodes) {
        const base = document.querySelector('meta[name=rz-base]')?.content || '';
        nodes = await fetch(base ? base + '/nodes.json' : 'nodes.json').then(r => r.json());
        try { localStorage.setItem(K, JSON.stringify({ t: Date.now(), d: nodes })); } catch (_) {}
    }

    const alive = nodes.filter(n => n.status !== 'dormant');
    if (!alive.length) return;

    let target;
    if (dir === 'r') {
        const u = new Uint32Array(1);
        crypto.getRandomValues(u);
        target = alive[u[0] % alive.length];
    } else {
        const i = alive.findIndex(n => uid(n.url) === from?.toUpperCase());
        target = alive[(i + (dir === 'p' ? -1 : 1) + alive.length) % alive.length];
    }

    const rng = mkrng(parseInt(uid(target.url), 36) >>> 0);
    const $ = id => document.getElementById(id);

    $('f-name').textContent  = target.name;
    $('f-ip').textContent    = fakeIP(rng);
    $('f-coord').textContent = fakeCoord(rng);
    $('f-bio').textContent   = target.bio || '—';
    $('f-url').textContent   = target.url.replace(/^https?:\/\//, '');
    $('s-id').textContent    = uid(target.url);
    $('s-time').textContent  = new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC';

    const bar = $('bar'), pct = $('pct'), lbl = $('f-status');
    const win = document.querySelector('.win');
    const t0  = performance.now(), DUR = 1800;

    function tick(now) {
        const p = Math.min(100, (now - t0) / DUR * 100);
        bar.value       = p;
        pct.textContent = Math.round(p) + '%';
        lbl.textContent = STEPS[Math.min(4, p / 100 * 5 | 0)];

        if (p < 100) { requestAnimationFrame(tick); return; }

        win.style.transition = 'opacity .32s ease, transform .32s cubic-bezier(.22,1,.36,1)';
        win.style.opacity    = '0';
        win.style.transform  = 'translateY(-4px) scale(.98)';
        setTimeout(() => location.replace(target.url), 340);
    }

    requestAnimationFrame(tick);
}

boot();
