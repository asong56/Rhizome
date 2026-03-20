!async function () {
    const L = document.getElementById('nl');
    const T = document.getElementById('nt');
    const B = document.getElementById('nb');
    const E = document.getElementById('ne');

    try {
        const nodes = await fetch('nodes.json').then(r => {
            if (!r.ok) throw 0;
            return r.json();
        });

        for (const n of nodes) {
            const dm = n.status === 'dormant';
            const tr = B.insertRow();
            if (dm) tr.className = 'dm';
            tr.innerHTML =
                `<td><span class="dot${dm ? ' off' : ''}" title="${dm ? 'dormant' : 'active'}"></span></td>` +
                `<td><a class="nn" href="${n.url}" target="_blank" rel="noopener">${n.name}</a>` +
                    `<div class="nid">${n.url.replace(/^https?:\/\//, '')}</div></td>` +
                `<td class="nb">${n.bio}</td>` +
                `<td><span class="tag">${n.url.split('.').pop()}</span></td>`;
        }

        L.hidden = true;
        T.hidden = false;
    } catch (_) {
        L.hidden = true;
        E.hidden = false;
    }
}();
