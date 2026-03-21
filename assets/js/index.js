const K    = 'rz1', TTL = 864e5;
const btn  = document.getElementById('wander');
const note = document.getElementById('wander-note');

function uid(u) {
    let h = 2166136261;
    for (let i = 0; i < u.length; i++) h = Math.imul(h ^ u.charCodeAt(i), 16777619) >>> 0;
    return h.toString(36).toUpperCase().padStart(8, '0').slice(-8);
}

async function loadNodes() {
    try {
        const c = JSON.parse(localStorage.getItem(K));
        if (c && Date.now() - c.t < TTL) return c.d;
    } catch (_) {}
    const data = await fetch('nodes.json').then(r => {
        if (!r.ok) throw r.status;
        return r.json();
    });
    try { localStorage.setItem(K, JSON.stringify({ t: Date.now(), d: data })); } catch (_) {}
    return data;
}

btn.addEventListener('click', async () => {
    btn.disabled     = true;
    note.textContent = '';
    try {
        const alive = (await loadNodes()).filter(n => n.status !== 'dormant');
        if (!alive.length) {
            note.textContent = 'No active nodes yet.';
            btn.disabled = false;
            return;
        }
        const u = new Uint32Array(1);
        crypto.getRandomValues(u);
        const target = alive[u[0] % alive.length];
        location.href = `ring.html?f=${uid(target.url)}&d=r`;
    } catch (_) {
        note.textContent = 'Could not load nodes — try again.';
        btn.disabled = false;
    }
});
