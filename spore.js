(()=>{
    let overlay;

    function uid(url) {
        let h = 2166136261;
        for (let i = 0; i < url.length; i++) {
            h ^= url.charCodeAt(i);
            h = Math.imul(h, 16777619) >>> 0;
        }
        return h.toString(36).toUpperCase().padStart(8, '0').slice(-8);
    }

    function getOverlay() {
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.style.cssText =
            'position:fixed;inset:0;z-index:2147483647;' +
            'background:var(--rz-bg,#F5F2EC);' +
            'clip-path:circle(0% at 50% 50%);' +
            'transition:clip-path 1.1s cubic-bezier(.22,1,.36,1);' +
            'pointer-events:none;will-change:clip-path';
        document.body.appendChild(overlay);
        return overlay;
    }

    function navigate(host, nodeUrl, dir) {
        requestAnimationFrame(() => getOverlay().style.clipPath = 'circle(150% at 50% 50%)');
        setTimeout(() => {
            location.href = `${host}/ring.html?f=${uid(nodeUrl)}&d=${dir}`;
        }, 680);
    }

    class RhizomeSpore extends HTMLElement {
        connectedCallback() {
            const light = this.getAttribute('theme') !== 'dark';
            const host  = (this.getAttribute('host') || '').replace(/\/$/, '');
            const url   = this.getAttribute('node-url') || location.href;
            const label = this.getAttribute('label') || '🌿 Rhizome';

            const fg  = light ? '#18160F' : '#E8E6DF';
            const bg  = light ? 'rgba(245,242,236,.92)' : 'rgba(20,18,14,.9)';
            const br  = light ? 'rgba(24,22,15,.12)'    : 'rgba(232,230,223,.12)';
            const ac  = light ? '#1E4919' : '#7fff8a';
            const ink = light ? 'rgba(30,73,25,.1)'     : 'rgba(127,255,138,.08)';

            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
<style>
    :host { display: inline-block; }
    .w {
        display: inline-flex;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
        font-size: 12px;
        letter-spacing: .04em;
        border: 1px solid ${br};
        border-radius: 20px;
        background: ${bg};
        color: ${fg};
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        overflow: hidden;
        user-select: none;
    }
    .l {
        padding: 7px 14px 7px 16px;
        opacity: .5;
        font-weight: 500;
        white-space: nowrap;
    }
    .d {
        width: 1px;
        background: ${br};
        align-self: stretch;
        flex-shrink: 0;
    }
    b {
        all: unset;
        cursor: pointer;
        padding: 7px 13px;
        opacity: .5;
        background: radial-gradient(ellipse at 50% 50%, ${ink} 0%, transparent 65%);
        background-size: 0 0;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        transition: opacity .18s, background-size .5s cubic-bezier(.22,1,.36,1);
    }
    b:hover  { opacity: 1; background-size: 220% 280%; }
    b:active { background-size: 140% 180%; transition-duration: .08s, .08s; }
    svg { display: block; pointer-events: none; }
</style>
<div class="w" role="navigation" aria-label="Rhizome webring">
    <span class="l">${label}</span>
    <i class="d"></i>
    <b data-d="p" title="Previous">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M8.5 2L4 6.5l4.5 4.5" stroke="${fg}" stroke-width="1.35"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </b>
    <i class="d"></i>
    <b data-d="r" title="Random">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="${fg}" stroke-width="1.2"/>
            <circle cx="6.5" cy="6.5" r="1.5" fill="${ac}"/>
        </svg>
    </b>
    <i class="d"></i>
    <b data-d="n" title="Next">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M4.5 2L9 6.5 4.5 11" stroke="${fg}" stroke-width="1.35"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </b>
</div>`;

            shadow.querySelectorAll('b').forEach(b =>
                b.addEventListener('click', () => navigate(host, url, b.dataset.d))
            );
        }
    }

    if (!customElements.get('rhizome-spore')) {
        customElements.define('rhizome-spore', RhizomeSpore);
    }
})();
