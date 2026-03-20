(()=>{
    const K = 'rz1', TTL = 864e5;

    function uid(u) {
        let h = 2166136261;
        for (let i = 0; i < u.length; i++) h = Math.imul(h ^ u.charCodeAt(i), 16777619) >>> 0;
        return h.toString(36).toUpperCase().padStart(8, '0').slice(-8);
    }

    async function go() {
        const p = new URLSearchParams(location.search);
        const from = p.get('f'), dir = p.get('d') || 'n';

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

        let t;
        if (dir === 'r') {
            const u = new Uint32Array(1);
            crypto.getRandomValues(u);
            t = alive[u[0] % alive.length];
        } else {
            const i = alive.findIndex(n => uid(n.url) === from?.toUpperCase());
            t = alive[(i + (dir === 'p' ? -1 : 1) + alive.length) % alive.length];
        }

        location.replace(t.url);
    }

    go();
})();
