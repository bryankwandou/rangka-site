import { BASE, LANGS } from "../i18n/base.js";


/* ═══ i18n engine ═══ */
const PACKS={id:null};          /* null = use inline baseline */
let lang="id", pending=null;

const orig=new Map();
document.querySelectorAll("[data-i18n],[data-i18n-html]").forEach(el=>{
  orig.set(el, el.dataset.i18nHtml ? el.innerHTML : el.textContent);
});

function pack(){ return PACKS[lang]||null }
function S(k){                                   /* string lookup with fallback chain */
  const p=pack();
  if(p&&p.t&&p.t[k]!=null) return p.t[k];
  const en=PACKS.en;
  if(lang!=="id"&&lang!=="en"&&en&&en.t&&en.t[k]!=null) return en.t[k];
  return null;
}
function U(k){                                   /* builder UI strings */
  const p=pack(); if(p&&p.ui&&p.ui[k]!=null) return p.ui[k];
  const en=PACKS.en; if(lang!=="id"&&en&&en.ui&&en.ui[k]!=null) return en.ui[k];
  return BASE.ui[k];
}
function DATA(key){                              /* gen / chk / ins / skel */
  const p=pack(); if(p&&p[key]) return p[key];
  const en=PACKS.en; if(lang!=="id"&&en&&en[key]) return en[key];
  return BASE[key];
}

function loadPack(code){
  if(code==="id"||PACKS[code]) return Promise.resolve();
  return new Promise(res=>{
    const s=document.createElement("script");
    s.src=import.meta.env.BASE_URL.replace(/\/?$/,"/")+"i18n/"+code+".js";
    s.onload=()=>res();
    s.onerror=()=>{ PACKS[code]=PACKS[code]||{}; res(); };   /* fail soft: keep baseline */
    document.head.appendChild(s);
  });
}
window.rangkaPack=function(code,data){ PACKS[code]=data; };

function setLang(code){
  let meta=LANGS.find(l=>l.c===code)||LANGS[0];
  pending=code;
  /* non-English packs fall back to English, so it must be present too */
  const need = code==="en"||code==="id" ? [code] : [code,"en"];
  Promise.all(need.map(loadPack)).then(()=>{
    if(pending!==code) return;                    /* a newer switch won */
    if(code!=="id" && !(PACKS[code]&&PACKS[code].t)){   /* pack failed to load */
      code="id"; meta=LANGS[0];
    }
    lang=code;
    document.documentElement.lang=code;
    document.documentElement.dir=meta.dir;
    document.documentElement.removeAttribute("data-boot-lang");
    applyLang();
    try{localStorage.setItem("rangka-lang",code)}catch(e){}
  });
}

function applyLang(){
  document.querySelectorAll("[data-i18n],[data-i18n-html]").forEach(el=>{
    const html=!!el.dataset.i18nHtml, k=el.dataset.i18n||el.dataset.i18nHtml;
    const v = lang==="id" ? orig.get(el) : (S(k)!=null ? S(k) : orig.get(el));
    if(html) el.innerHTML=v; else el.textContent=v;
  });
  const meta=LANGS.find(l=>l.c===lang);
  document.getElementById("langcode").textContent=lang.toUpperCase();
  document.getElementById("langbtn").setAttribute("aria-label",(S("lang_label")||"Bahasa / Language")+" — "+meta.n);
  buildLangMenu(); buildTabs(); buildInstall(); buildChecks(); render(); wireCopy(document); startDemo(); hdRender();
  paintTheme();
}

function buildLangMenu(){
  const m=document.getElementById("langmenu");
  m.innerHTML="";
  LANGS.forEach(l=>{
    const b=document.createElement("button");
    b.type="button"; b.setAttribute("role","menuitemradio");
    b.setAttribute("aria-checked", l.c===lang?"true":"false");
    b.innerHTML='<span>'+l.n+'</span><small>'+l.c.toUpperCase()+'</small>';
    b.onclick=()=>{ closeLang(); setLang(l.c); };
    m.appendChild(b);
  });
}
function openLang(){ const m=document.getElementById("langmenu"); m.hidden=false; document.getElementById("langbtn").setAttribute("aria-expanded","true"); }
function closeLang(){ const m=document.getElementById("langmenu"); m.hidden=true; document.getElementById("langbtn").setAttribute("aria-expanded","false"); }
document.getElementById("langbtn").onclick=e=>{ e.stopPropagation(); document.getElementById("langmenu").hidden?openLang():closeLang(); };
document.addEventListener("click",e=>{ if(!e.target.closest(".langwrap")) closeLang(); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ closeLang(); closeMenu(); } });

/* ═══ theme: system → light → dark ═══ */
const tbtn=document.getElementById("theme"), ticon=document.getElementById("themeicon");
const mq=matchMedia("(prefers-color-scheme:dark)");
function current(){ return document.documentElement.getAttribute("data-theme")||"system" }
function paintTheme(){
  const c=current();
  ticon.textContent = c==="light" ? "☀" : c==="dark" ? "☾" : "◐";
  tbtn.setAttribute("aria-label", c==="light"?U("theme_light"):c==="dark"?U("theme_dark"):U("theme_sys"));
  tbtn.title=tbtn.getAttribute("aria-label");
  const dark = c==="dark" || (c==="system" && mq.matches);
  document.querySelectorAll('meta[name="theme-color"]').forEach(m=>m.remove());
  const m=document.createElement("meta"); m.name="theme-color"; m.content=dark?"#15130f":"#f7f4ee";
  document.head.appendChild(m);
}
tbtn.onclick=()=>{
  const next={system:"light",light:"dark",dark:"system"}[current()];
  if(next==="system"){ document.documentElement.removeAttribute("data-theme"); try{localStorage.removeItem("rangka-theme")}catch(e){} }
  else { document.documentElement.setAttribute("data-theme",next); try{localStorage.setItem("rangka-theme",next)}catch(e){} }
  paintTheme();
  document.getElementById("live").textContent=tbtn.getAttribute("aria-label");
};
mq.addEventListener("change",paintTheme);

/* ═══ mobile menu ═══ */
const burger=document.getElementById("burger"), menu=document.getElementById("menu");
function closeMenu(){ menu.classList.remove("open"); burger.setAttribute("aria-expanded","false"); }
burger.onclick=()=>{ const o=menu.classList.toggle("open"); burger.setAttribute("aria-expanded",o?"true":"false"); };
menu.addEventListener("click",e=>{ if(e.target.tagName==="A") closeMenu(); });
addEventListener("resize",()=>{ if(innerWidth>900) closeMenu(); });

/* ═══ genre tabs ═══ */
const tabs=document.getElementById("tabs"), panel=document.getElementById("panel");
let gi=0;
function showGenre(i){
  const G=DATA("gen"); gi=Math.min(i,G.length-1);
  [...tabs.children].forEach((t,j)=>{ t.setAttribute("aria-selected", gi===j?"true":"false"); t.tabIndex = gi===j?0:-1; });
  const g=G[gi].t;
  panel.innerHTML='<h3></h3><p class="sub mono"></p><ol></ol>';
  panel.querySelector("h3").textContent=g[1];
  panel.querySelector(".sub").textContent=g[2];
  const ol=panel.querySelector("ol");
  g[3].forEach(x=>{ const li=document.createElement("li"); li.textContent=x; ol.appendChild(li); });
}
function buildTabs(){
  const G=DATA("gen"); tabs.innerHTML="";
  G.forEach((g,i)=>{
    const b=document.createElement("button");
    b.className="gcard"; b.type="button"; b.setAttribute("role","tab"); b.innerHTML=gIcon(g.k)+"<b></b><small></small>"; b.querySelector("b").textContent=g.t[0]; b.querySelector("small").textContent=g.t[1];
    b.onclick=()=>showGenre(i);
    b.onkeydown=e=>{
      const d=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0;
      if(!d) return; e.preventDefault();
      const n=(i+d+G.length)%G.length; showGenre(n); tabs.children[n].focus();
    };
    tabs.appendChild(b);
  });
  showGenre(gi);
}

/* ═══ install tabs ═══ */
const itabs=document.getElementById("itabs"), ipanel=document.getElementById("ipanel");
let ii=0;
function showInstall(i){
  const I=DATA("ins"); ii=Math.min(i,I.length-1);
  [...itabs.children].forEach((t,j)=>{ t.setAttribute("aria-selected", ii===j?"true":"false"); t.tabIndex = ii===j?0:-1; });
  const d=I[ii];
  ipanel.innerHTML='<h3></h3><p class="sub"></p><pre class="code"><code></code></pre>';
  ipanel.querySelector("h3").textContent=d[0];
  ipanel.querySelector(".sub").textContent=d[1];
  ipanel.querySelector("code").textContent=d[2];
  wireCopy(ipanel);
}
function buildInstall(){
  const I=DATA("ins"); itabs.innerHTML="";
  I.forEach((d,i)=>{
    const b=document.createElement("button");
    b.className="tab"; b.type="button"; b.setAttribute("role","tab"); b.textContent=d[0];
    b.onclick=()=>showInstall(i);
    b.onkeydown=e=>{
      const k=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0;
      if(!k) return; e.preventDefault();
      const n=(i+k+I.length)%I.length; showInstall(n); itabs.children[n].focus();
    };
    itabs.appendChild(b);
  });
  showInstall(ii);
}

/* ═══ checklist table ═══ */
function buildChecks(){
  const tb=document.querySelector("#chk tbody"); tb.innerHTML="";
  DATA("chk").forEach(r=>{
    const tr=document.createElement("tr");
    const a=document.createElement("td"); a.className="mono"; a.style.color="var(--accent-ink)"; a.textContent=r[0];
    const b=document.createElement("td"); const s=document.createElement("b"); s.textContent=r[1]; b.appendChild(s);
    const c=document.createElement("td"); c.style.color="var(--muted)"; c.textContent=r[2];
    tr.append(a,b,c); tb.appendChild(tr);
  });
}

/* ═══ builder ═══ */
const gsel=document.getElementById("b-genre"), topic=document.getElementById("b-topic"),
      reader=document.getElementById("b-reader"), mode=document.getElementById("b-mode"),
      out=document.getElementById("b-out");
let touched={topic:false,reader:false};
topic.addEventListener("input",()=>touched.topic=true);
reader.addEventListener("input",()=>touched.reader=true);
function syncExamples(){                 /* sample values follow the language until edited */
  if(!touched.topic) topic.value=U("ex_topic");
  if(!touched.reader) reader.value=U("ex_reader");
}
function buildSelect(){
  const G=DATA("gen"), cur=gsel.value||"riset";
  gsel.innerHTML="";
  G.forEach(g=>{ const o=document.createElement("option"); o.value=g.k; o.textContent=g.t[0]; gsel.appendChild(o); });
  gsel.value = G.some(g=>g.k===cur) ? cur : G[0].k;
  mode.options[0].textContent=U("quick");
  mode.options[1].textContent=U("full");
}
function esc(s){return String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}
function mk(s){return esc(s)
  .replace(/\[[A-ZÀ-Üa-zà-ü؀-ۿ一-鿿]{2,10}:[^\]]*\]/g,m=>{
    const head=m.slice(1,m.indexOf(":"));
    const cls = head===U("verify")||head==="CEK"||head==="VERIFY" ? "cek":"isi";
    return '<span class="'+cls+'">'+m+'</span>';
  })}
function pad(s,n){ s=String(s); return s.length>=n ? s.slice(0,n) : s+" ".repeat(n-s.length) }
function render(){
  buildSelect(); syncExamples();
  const k=gsel.value, S_=DATA("skel")[k]||DATA("skel").riset;
  const F=U("fill"), V=U("verify");
  const t=topic.value.trim()||"["+F+": "+U("b_topic")+"]";
  const r=reader.value.trim()||"["+F+": "+U("b_readerph")+"]";
  const quick=mode.value==="cepat";
  const CH=DATA("chk"), G=DATA("gen");
  const n=[];
  n.push("# "+U("b_map"));
  n.push(U("b_reader")+": "+r);
  n.push(U("b_should")+": ["+F+": "+U("b_ideal")+" "+t+"]");
  n.push(U("b_is")+": ["+F+": "+U("b_obs")+"]");
  n.push(U("b_gap")+": ["+F+": "+U("b_diff")+"]");
  n.push(U("b_claim")+": "+S_.claim);
  n.push("");
  n.push("# "+U("b_out"));
  S_.sec.forEach((sec,i)=>{
    n.push((i+1)+". "+sec);
    n.push("   "+pad(U("b_job"),9)+": ["+F+": "+U("b_proves")+"]");
    n.push("   "+pad(U("b_content"),9)+": ["+F+": "+U("b_points")+"]");
    n.push("   "+pad(U("b_ev"),9)+": ["+F+": "+U("b_srcdata")+"]");
    n.push("   "+pad(U("b_len"),9)+": ["+F+": "+U("b_est")+"]");
  });
  n.push("");
  n.push("# "+U("b_chk"));
  const items = quick ? CH.filter(c=>["U1","U2","U4","U8","U9"].includes(c[0])) : CH;
  items.forEach(c=>n.push(pad(c[0],4)+" "+pad(c[1],30)+" "+U("b_wait")));
  const gname=(G.find(g=>g.k===k)||G[0]).t[0];
  n.push("+    "+U("b_allgenre")+" — "+gname);
  if(quick) n.push("("+U("b_mode_note")+")");
  n.push("");
  n.push("# "+U("b_title")+"  — "+U("b_prov"));
  n.push("a) ["+F+": "+U("b_titleline")+"]");
  n.push("");
  n.push("# "+U("b_need"));
  S_.fill.forEach(x=>n.push("["+F+": "+x+"]"));
  S_.ver.forEach(x=>n.push("["+V+": "+x+"]"));
  out.innerHTML=mk(n.join("\n"));
}
[gsel,topic,reader,mode].forEach(el=>el.addEventListener("input",render));
document.getElementById("b-copy").onclick=function(){
  const btn=this;
  navigator.clipboard.writeText(out.innerText).then(()=>{
    const o=U("copy"); btn.textContent=U("copied");
    document.getElementById("live").textContent=U("copied");
    setTimeout(()=>btn.textContent=o,1500);
  }).catch(()=>{});
};

/* ═══ copy buttons ═══ */
function wireCopy(root){
  root.querySelectorAll("pre.code").forEach(p=>{
    let b=p.querySelector(".copy");
    if(!b){
      b=document.createElement("button"); b.type="button"; b.className="copy";
      b.onclick=()=>navigator.clipboard.writeText(p.querySelector("code").innerText.trim()).then(()=>{
        b.textContent=U("copied");
        setTimeout(()=>b.textContent=U("copy"),1500);
      }).catch(()=>{});
      p.appendChild(b);
    }
    b.textContent=U("copy");
  });
}

/* ═══ genre icons ═══ */
const GICON={
 riset:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M8.5 11h5M11 8.5v5"/>',
 pasca:'<path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M7 11v4.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V11M21 9v5"/>',
 laporan:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 17v-3M13 17v-5M16 17v-2"/>',
 organisasi:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9.5" r="2.4"/><path d="M3.5 19c.6-3 2.8-4.7 5.5-4.7s4.9 1.7 5.5 4.7M15 14.6c2.6-.3 4.8 1 5.5 4"/>',
 persuasi:'<path d="M4 10v4h3l7 4V6L7 10z"/><path d="M17.5 9a4 4 0 010 6"/>',
 teknis:'<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
 video:'<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3z"/>'
};
function gIcon(k){ return '<span class="gi" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+(GICON[k]||GICON.riset)+'</svg></span>'; }

/* ═══ animated demo ═══ */
const dOut=document.getElementById("d-out"), dChk=document.getElementById("d-chk"), dMeter=document.getElementById("d-meter");
const RM=matchMedia("(prefers-reduced-motion: reduce)");
let dTimer=null, dSeen=false, dRun=0;
function stLabel(c){ const el=document.querySelector('[data-i18n="st_'+c+'_l"]'); return el?el.textContent:c; }
function demoLines(){
  const F=U("fill"), V=U("verify"), S_=DATA("skel").riset;
  return [
    "# "+U("b_map"),
    U("b_reader")+": "+U("ex_reader"),
    U("b_gap")+": ["+F+": "+U("b_diff")+"]",
    U("b_claim")+": "+S_.claim,
    "",
    "# "+U("b_out"),
    "1. "+S_.sec[0],
    "   "+U("b_job")+": ["+F+": "+U("b_proves")+"]",
    "   "+U("b_ev")+": ["+V+": "+S_.ver[1]+"]",
    "2. "+S_.sec[1],
    "   "+U("b_content")+": ["+F+": "+U("b_points")+"]",
    "3. "+S_.sec[6],
    "   "+U("b_ev")+": ["+F+": "+S_.fill[1]+"]"
  ];
}
const D_ST=[["U1","ok"],["U2","wait"],["U4","ok"],["U6","bad"],["U9","wait"],["U12","ok"]];
function demoTable(){
  const CH=DATA("chk"); dChk.innerHTML="";
  D_ST.forEach(([id])=>{
    const r=CH.find(c=>c[0]===id)||[id,id];
    const tr=document.createElement("tr");
    const a=document.createElement("td"); a.textContent=r[0];
    const b=document.createElement("td"); b.textContent=r[1];
    const c=document.createElement("td"); const p=document.createElement("span"); p.className="pill"; p.textContent="…"; c.appendChild(p);
    tr.append(a,b,c); dChk.appendChild(tr);
  });
  dMeter.style.width="0";
}
function setStatus(i){
  const tr=dChk.children[i]; if(!tr) return;
  [...dChk.children].forEach(x=>x.classList.remove("hot"));
  const st=D_ST[i][1], p=tr.querySelector(".pill");
  p.className="pill "+st+" on"; p.textContent=stLabel(st);
  tr.classList.add("hot");
  dMeter.style.width=((i+1)/D_ST.length*100)+"%";
}
function paintLines(lines,partial){
  dOut.innerHTML=lines.map((l,i)=>'<span class="line">'+mk(l)+(partial&&i===lines.length-1?'<i class="caret"></i>':'')+'</span>').join("");
}
function startDemo(){
  if(!dOut) return;
  clearTimeout(dTimer); const run=++dRun;
  const L=demoLines(); demoTable();
  if(RM.matches || !dSeen){
    if(RM.matches){ paintLines(L,false); D_ST.forEach((_,i)=>setStatus(i)); [...dChk.children].forEach(x=>x.classList.remove("hot")); }
    else paintLines([""],true);
    return;
  }
  let li=0, ci=0, done=[];
  (function step(){
    if(run!==dRun) return;
    if(li>=L.length){
      paintLines(L,false);
      let k=0;
      (function tick(){ if(run!==dRun) return; if(k<D_ST.length){ setStatus(k++); dTimer=setTimeout(tick,520);} else { [...dChk.children].forEach(x=>x.classList.remove("hot")); } })();
      return;
    }
    const line=L[li];
    ci=Math.min(line.length, ci+2+Math.floor(Math.random()*3));
    paintLines(done.concat([line.slice(0,ci)]),true);
    if(ci>=line.length){ done.push(line); li++; ci=0; dTimer=setTimeout(step,line?140:60); }
    else dTimer=setTimeout(step,22);
  })();
}
document.getElementById("d-replay").onclick=()=>{ dSeen=true; startDemo(); };
new IntersectionObserver((es,o)=>{ if(es.some(e=>e.isIntersecting)){ dSeen=true; startDemo(); o.disconnect(); } },{threshold:.35}).observe(document.querySelector(".demo"));


/* ═══ hero document mockup: tabs cycle through genres, outline assembles ═══ */
const HD_KEYS=["riset","laporan","organisasi","persuasi","teknis"];
let hdI=0, hdTimer=null, hdHover=false;
function hdRender(){
  const tabs=document.getElementById("hdoc-tabs"), body=document.getElementById("hdoc-body"), foot=document.getElementById("hdoc-foot");
  if(!tabs) return;
  const G=DATA("gen"), SK=DATA("skel"), k=HD_KEYS[hdI], s=SK[k];
  tabs.innerHTML=HD_KEYS.map((key,i)=>{
    const g=G.find(x=>x.k===key); return '<button type="button" tabindex="-1" data-i="'+i+'" class="'+(i===hdI?"on":"")+'">'+esc(g?g.t[0]:key)+'</button>';
  }).join("");
  const F=U("fill"), V=U("verify");
  let h='<p class="hd-claim"><span>'+esc(U("b_claim"))+'</span>'+esc(s.claim)+'</p><ol class="hd-sec">';
  s.sec.slice(0,6).forEach((t,i)=>{
    let chip="";
    if(i===1&&s.fill[0]) chip='<span class="isi">['+esc(F)+': '+esc(s.fill[0])+']</span>';
    if(i===3&&s.ver[0]) chip='<span class="cek">['+esc(V)+': '+esc(s.ver[0])+']</span>';
    h+='<li style="--d:'+(i*110+120)+'ms"><b>'+esc(t)+'</b><i class="bar" style="--w:'+(48+((i*37+hdI*23)%46))+'%"></i>'+chip+'<i class="tk"></i></li>';
  });
  body.innerHTML=h+'</ol>';
  const st=[["U1","ok"],["U2","wait"],["U4","ok"],["U9","ok"]];
  foot.innerHTML=st.map(([id,c],i)=>'<span class="pill '+c+'" style="--d:'+(900+i*140)+'ms">'+id+' · '+esc(stLabel(c))+'</span>').join("");
  const lab=document.getElementById("hf-lab"); if(lab) lab.textContent=V;
  const doc=document.getElementById("hdoc"), wrap=doc.parentNode; doc.classList.remove("play"); wrap.classList.remove("play"); void wrap.offsetWidth; wrap.classList.add("play"); void doc.offsetWidth; doc.classList.add("play");
}
function hdNext(){ clearTimeout(hdTimer); if(RM.matches) return; hdTimer=setTimeout(()=>{ if(!hdHover&&!document.hidden){ hdI=(hdI+1)%HD_KEYS.length; hdRender(); } hdNext(); },5200); }
(function(){
  const tabs=document.getElementById("hdoc-tabs"), doc=document.getElementById("hdoc"); if(!tabs) return;
  tabs.addEventListener("click",e=>{ const b=e.target.closest("button"); if(!b) return; hdI=+b.dataset.i; hdRender(); hdNext(); });
  doc.addEventListener("mouseenter",()=>hdHover=true); doc.addEventListener("mouseleave",()=>hdHover=false);
  hdNext();
})();

/* ═══ big numbers count up once ═══ */
(function(){
  const band=document.getElementById("bign"); if(!band||RM.matches) return;
  const els=[...band.querySelectorAll("b[data-n]")];
  const fmt=(el,v)=>el.textContent=v+(el.dataset.of?"/"+el.dataset.of:"");
  els.forEach(el=>fmt(el,0));
  new IntersectionObserver((es,o)=>{ if(!es.some(e=>e.isIntersecting)) return; o.disconnect();
    const t0=performance.now();
    (function f(t){ const p=Math.min(1,(t-t0)/1300), e=1-Math.pow(1-p,3);
      els.forEach(el=>fmt(el,Math.round(+el.dataset.n*e))); if(p<1) requestAnimationFrame(f); })(t0);
  },{threshold:.4}).observe(band);
})();

/* ═══ reveal, nav state, progress ═══ */
const io=new IntersectionObserver(es=>es.forEach((e,k)=>{
  if(e.isIntersecting){ setTimeout(()=>e.target.classList.add("in"),k*70); io.unobserve(e.target); }
}),{threshold:.14});
document.querySelectorAll(".rv").forEach(s=>io.observe(s));

const nav=document.getElementById("nav"), bar=document.getElementById("bar");
const links=[...document.querySelectorAll('#menu a[href^="#"]')];
let ticking=false;
function onScroll(){
  if(ticking) return; ticking=true;
  requestAnimationFrame(()=>{
    nav.classList.toggle("stuck",scrollY>8);
    const h=document.documentElement.scrollHeight-innerHeight;
    bar.style.width=(h>0?Math.min(100,scrollY/h*100):0)+"%";
    let active=null;
    links.forEach(a=>{
      const el=document.querySelector(a.getAttribute("href"));
      if(el && el.getBoundingClientRect().top<=140) active=a;
    });
    links.forEach(a=>a.setAttribute("aria-current", a===active?"true":"false"));
    ticking=false;
  });
}
addEventListener("scroll",onScroll,{passive:true});
onScroll();

/* ═══ boot ═══ */
(function(){
  let start="id";
  try{ const l=localStorage.getItem("rangka-lang"); if(l&&LANGS.some(x=>x.c===l)) start=l; }catch(e){}
  if(start==="id"){ applyLang(); } else { setLang(start); }
})();
