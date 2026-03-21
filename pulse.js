(()=>{
    const K = 'rz1', TTL = 864e5;

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
        const base = document.querySelector('meta[name=rz-base]')?.content || '';
        const r = await fetch(base ? base + '/nodes.json' : 'nodes.json');
        if (!r.ok) throw new Error(r.status);
        const data = await r.json();
        try { localStorage.setItem(K, JSON.stringify({ t: Date.now(), d: data })); } catch (_) {}
        return data;
    }

    async function go() {
        const p     = new URLSearchParams(location.search);
        const from  = p.get('f'), dir = p.get('d') || 'n';
        const alive = (await loadNodes()).filter(n => n.status !== 'dormant');
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

        location.replace(target.url);
    }

    go().catch(() => {});
})();
