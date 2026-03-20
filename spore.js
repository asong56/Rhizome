(()=>{
  let V;
  function ov(){
    if(V)return V;
    (V=document.createElement('div')).style.cssText=
      'position:fixed;inset:0;z-index:2147483647;'+
      'background:var(--rz-bg,#F5F2EC);'+
      'clip-path:circle(0% at 50% 50%);'+
      'transition:clip-path 1.1s cubic-bezier(.22,1,.36,1);'+
      'pointer-events:none;will-change:clip-path';
    document.body.appendChild(V);
    return V;
  }
  function nav(h,id,d){
    requestAnimationFrame(()=>ov().style.clipPath='circle(150% at 50% 50%)');
    setTimeout(()=>location.href=`${h}/ring.html?f=${encodeURIComponent(id)}&d=${d}`,680);
  }

  class Spore extends HTMLElement{
    connectedCallback(){
      const lt=this.getAttribute('theme')!=='dark',
            h=(this.getAttribute('host')||'').replace(/\/$/,''),
            id=this.getAttribute('node-id')||'',
            lb=this.getAttribute('label')||'🌿 Rhizome';
      const
        fg=lt?'#18160F':'#E8E6DF',
        bg=lt?'rgba(245,242,236,.9)':'rgba(20,18,14,.88)',
        br=lt?'rgba(24,22,15,.11)':'rgba(232,230,223,.11)',
        ac=lt?'#1E4919':'#7fff8a',
        ink=lt?'rgba(30,73,25,.1)':'rgba(127,255,138,.08)';
      const shadow=this.attachShadow({mode:'open'});
      shadow.innerHTML=`<style>
:host{display:inline-block}
.w{display:inline-flex;align-items:center;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;
   font-size:12px;letter-spacing:.04em;border:1px solid ${br};border-radius:20px;
   background:${bg};color:${fg};backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
   overflow:hidden;user-select:none}
.l{padding:7px 14px 7px 16px;opacity:.5;font-weight:500;white-space:nowrap}
.d{width:1px;background:${br};align-self:stretch;flex-shrink:0}
b{all:unset;cursor:pointer;padding:7px 13px;opacity:.5;
  background:radial-gradient(ellipse at 50% 50%,${ink} 0%,transparent 65%);
  background-size:0 0;background-position:50% 50%;background-repeat:no-repeat;
  transition:opacity .18s,background-size .5s cubic-bezier(.22,1,.36,1)}
b:hover{opacity:1;background-size:220% 280%}
b:active{background-size:140% 180%;transition-duration:.08s,.08s}
svg{display:block;pointer-events:none}
</style>
<div class="w" role="navigation" aria-label="Rhizome webring">
  <span class="l">${lb}</span><i class="d"></i>
  <b data-d="p" title="Previous">
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M8.5 2L4 6.5l4.5 4.5" stroke="${fg}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </b><i class="d"></i>
  <b data-d="r" title="Random">
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="4" stroke="${fg}" stroke-width="1.2"/>
      <circle cx="6.5" cy="6.5" r="1.5" fill="${ac}"/>
    </svg>
  </b><i class="d"></i>
  <b data-d="n" title="Next">
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M4.5 2L9 6.5 4.5 11" stroke="${fg}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </b>
</div>`;
      shadow.querySelectorAll('b').forEach(b=>b.addEventListener('click',()=>nav(h,id,b.dataset.d)));
    }
  }
  customElements.get('rhizome-spore')||customElements.define('rhizome-spore',Spore);
})();
