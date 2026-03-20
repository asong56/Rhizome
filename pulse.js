(()=>{
    const K = 'rz1', TTL = 864e5;

    function uid(url) {
        let h = 2166136261;
        for (let i = 0; i < url.length; i++) {
            h ^= url.charCodeAt(i);
            h = Math.imul(h, 16777619) >>> 0;
        }
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
            nodes = await fetch(base + '/nodes.json').then(r => r.json());
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

        location.replace(target.url);
    }

    go();
})();
