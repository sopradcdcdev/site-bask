const aulas=[
  {t:"Aula 1",s:"Configurando seu ambiente e a corretora",v:"HB7rFDwPVa8",yt:true,m:"2:50",d:"Antes de analisar qualquer gráfico, deixe tudo pronto: conta, plataforma e conta demo. É aqui que você começa do jeito certo.",p:["Conhecendo a interface da plataforma de operações","Entendendo a estrutura do gráfico e os candles","Como acessar e adicionar indicadores ao gráfico","Configurando o indicador Bollinger Bands","Adicionando e personalizando a média móvel EMA","Ajustando cores e aparência dos indicadores","Organizando o gráfico para deixar seu ambiente de operação preparado"]},
  {t:"Aula 2",s:"Lendo o gráfico",v:"kRHwTgNQ1Go",yt:true,m:"20 min",d:"O preço conta uma história. Aprenda a língua do mercado para parar de operar no escuro.",p:["Aprendendo a interpretar os movimentos do gráfico","Como identificar movimentos de alta e baixa","Entendendo o comportamento dos candles","Como realizar a leitura do gráfico na prática","Identificando possíveis pontos de entrada","A importância de proteger sua banca durante as operações","Consistência nas operações: por que ela vence a sorte","Demonstração prática de leitura de mercado"]},
  {t:"Aula 3",s:"Gestão de risco",m:"18 min",d:"A aula que separa quem dura de quem some. Sem controle de risco, nenhuma estratégia se sustenta.",p:["Quanto arriscar por operação (1% a 2% da banca)","Stop diário: a hora de fechar a plataforma","Como evitar dobrar a aposta depois de uma perda","Diário de operações: aprender com os seus erros"]}
];
let done=new Set();
try{done=new Set(JSON.parse(localStorage.getItem("bask-done3")||"[]"))}catch(e){}
const $=id=>document.getElementById(id);
const save=()=>{try{localStorage.setItem("bask-done3",JSON.stringify([...done]))}catch(e){}};

function lista(){
  $("list").innerHTML=aulas.map((a,i)=>`<a class="row${done.has(i)?" done":""}" href="#aula${i+1}"><span class="n">${i+1}</span><h3>${a.t}<small>${a.s} · ${a.m}</small></h3><span class="chip">${done.has(i)?"Concluída":"Não assistida"}</span><span class="go">›</span></a>`).join("");
  $("pt").textContent=`${done.size} de ${aulas.length} concluídas`;
  $("pb").style.width=done.size/aulas.length*100+"%";
  if(done.size===aulas.length){$("list").insertAdjacentHTML("afterbegin",`<button class="banner" type="button" id="reopen"><span>✓</span><div>Curso concluído<small>Ver os próximos passos</small></div></button>`);$("reopen").onclick=showCongrats}
  let nx=aulas.findIndex((_,i)=>!done.has(i));
  const c=$("cont");
  if(nx<0){c.textContent="Rever a Aula 1";c.href="#aula1"}
  else{c.textContent=(done.size?"Continuar: ":"Começar: ")+aulas[nx].t;c.href="#aula"+(nx+1)}
}
const BROKER=`<div class="broker"><h3>Passo a passo: cadastro na corretora</h3><ol><li>Abra o link abaixo, crie a sua conta e confirme o e-mail.</li><li>Verifique os seus dados, se a corretora pedir.</li><li>Basta operar com as análises das próximas aulas ou pegar sinais direto da live</li></ol><a class="btn" href="https://r.ryvon.io/l/1255/892" target="_blank" rel="noopener sponsored">Abrir conta na corretora</a></div>`;
function aula(i){
  const a=aulas[i];
  $("at").textContent=a.t;$("am").textContent=a.s+" · "+a.m;
  
  const videoEl=document.querySelector(".video");
  if(videoEl&&videoEl.dataset.lesson!==String(i)){
    videoEl.dataset.lesson=i;
    if(a.v){
      if(a.yt)buildYTPlayer(videoEl,a.v,"a"+(i+1));
      else buildPlayer(videoEl,a.v,"a"+(i+1));
    }else{videoEl.className="video";videoEl.innerHTML='<div class="play"></div>'}
  }
  $("ad").innerHTML=`<p>${a.d}</p><h3>O que você vai ver</h3><ul>${a.p.map(x=>`<li>${x}</li>`).join("")}</ul>${BROKER}`;
  
  $("mk").textContent=done.has(i)?"Concluída ✓":"Marcar como concluída";
  $("mk").onclick=()=>{
    const wasComplete=done.size===aulas.length;
    done.has(i)?done.delete(i):done.add(i);
    save();
    if(!wasComplete&&done.size===aulas.length){
      confetti();
      showCongrats();
    }
    aula(i);
  };
  const pv=$("pv"),nx=$("nx");
  pv.style.display=i>0?"":"none";pv.href="#aula"+i;
  if(i<aulas.length-1){nx.textContent="Próxima →";nx.href="#aula"+(i+2)}else{nx.textContent="Ver todas";nx.href="#aulas"}
  $("side").innerHTML=aulas.map((x,j)=>`<a href="#aula${j+1}" class="${j===i?"on ":""}${done.has(j)?"d":""}"><span>${done.has(j)?"✓":j+1}</span>${x.t}</a>`).join("");
}
const fmt=s=>{if(!isFinite(s))return"0:00";const m=Math.floor(s/60),x=Math.floor(s%60);return m+":"+(x<10?"0":"")+x};
function buildYTPlayer(box,videoId,key){
  box.className="video has-video";
  box.innerHTML=`<div class="vp yt-player" tabindex="0" aria-label="Player de vídeo">
    <div id="yt-${key}"></div>
    <button class="vp-big" type="button" aria-label="Reproduzir"><span><svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg></span></span></button>
  </div>`;
  
  const vp=box.querySelector(".vp");
  const btn=box.querySelector(".vp-big");
  
  // Carregar API do YouTube
  if(!window.YT){
    const tag=document.createElement("script");
    tag.src="https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }
  
  // Aguardar API carregar
  const initPlayer=()=>{
    const player=new YT.Player("yt-"+key,{
      videoId:videoId,
      playerVars:{
        rel:0,
        modestbranding:1,
        controls:1,
        fs:1,
        playsinline:1
      },
      events:{
        onReady:()=>{
          btn.style.display="none";
          vp.classList.add("yt-ready");
        },
        onStateChange:(e)=>{
          if(e.data===YT.PlayerState.PLAYING){
            vp.classList.add("playing");
            btn.style.display="none";
          }else{
            vp.classList.remove("playing");
          }
        }
      }
    });
    
    btn.onclick=()=>{
      player.playVideo();
      btn.style.display="none";
    };
  };
  
  if(window.YT&&window.YT.Player){
    initPlayer();
  }else{
    window.onYouTubeIframeAPIReady=initPlayer;
  }
}
function buildPlayer(box,src,key){
  const pk="bask-pos-"+key;
  box.className="video has-video";
  box.innerHTML=`<div class="vp" tabindex="0" aria-label="Player de vídeo">
    <video playsinline preload="auto" src="${src}#t=1.5"></video>
    <button class="vp-big" type="button" aria-label="Reproduzir"><span><svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg></span></button>
    <div class="vp-load"></div><div class="vp-err">Não foi possível carregar o vídeo.</div>
    <div class="vp-bar">
      <div class="vp-seek"><div class="vp-buf"></div><div class="vp-fill"></div><div class="vp-tip">0:00</div></div>
      <div class="vp-row">
        <button class="vp-b" data-a="play" type="button" aria-label="Play/Pause"><svg class="i-play" viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg><svg class="i-pause" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg></button>
        <button class="vp-b" data-a="rw" type="button" aria-label="Voltar 10 segundos">−10</button>
        <button class="vp-b" data-a="ff" type="button" aria-label="Avançar 10 segundos">+10</button>
        <span class="vp-t">0:00 / 0:00</span><span class="vp-sp"></span>
        <span class="vp-volw"><button class="vp-b" data-a="mute" type="button" aria-label="Som"><svg class="i-vol" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg><svg class="i-mute" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16 9l5 6m0-6l-5 6" stroke="currentColor" stroke-width="2" fill="none"/></svg></button><input class="vp-vol" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume"></span>
        <button class="vp-b" data-a="speed" type="button" aria-label="Velocidade">1x</button>
        <button class="vp-b" data-a="fs" type="button" aria-label="Tela cheia"><svg viewBox="0 0 24 24"><path d="M4 9V4h5v2H6v3H4zm14-3h-3V4h5v5h-2V6zM6 15v3h3v2H4v-5h2zm12 0h2v5h-5v-2h3v-3z"/></svg></button>
      </div>
    </div></div>`;
  const q=s=>box.querySelector(s),vp=q(".vp"),v=q("video"),seek=q(".vp-seek"),fill=q(".vp-fill"),buf=q(".vp-buf"),tip=q(".vp-tip"),tm=q(".vp-t"),spd=q("[data-a=speed]");
  const speeds=[1,1.25,1.5,2];const PV=1.5;let si=0,hide,last=0,preview=true;
  const vol=q(".vp-vol");
  const sv=()=>{vol.value=v.muted?0:v.volume;vol.style.setProperty("--v",vol.value*100+"%");vp.classList.toggle("muted",v.muted||v.volume===0)};
  vol.addEventListener("input",()=>{v.volume=+vol.value;v.muted=v.volume===0;try{localStorage.setItem("bask-vol",v.volume)}catch(e){}});
  v.addEventListener("volumechange",sv);
  try{const s=parseFloat(localStorage.getItem("bask-vol"));if(s>=0&&s<=1)v.volume=s}catch(e){}
  sv();
  const dur=()=>v.duration||0;
  const toggle=()=>{if(v.paused&&preview){v.currentTime=0;preview=false}v.paused?v.play():v.pause()};
  const paint=()=>{const d=dur(),t=preview?0:v.currentTime;fill.style.width=d?t/d*100+"%":"0";tm.textContent=fmt(t)+" / "+fmt(d)};
  const wake=()=>{vp.classList.add("show");clearTimeout(hide);hide=setTimeout(()=>vp.classList.remove("show"),2500)};
  const fs=()=>{
    if(document.fullscreenElement||document.webkitFullscreenElement)(document.exitFullscreen||document.webkitExitFullscreen).call(document);
    else if(vp.requestFullscreen||vp.webkitRequestFullscreen)(vp.requestFullscreen||vp.webkitRequestFullscreen).call(vp);
    else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();
  };
  const act=a=>{
    if(a==="play")toggle();
    else if(a==="rw"){preview=false;v.currentTime=Math.max(0,v.currentTime-10)}
    else if(a==="ff"){preview=false;v.currentTime=Math.min(dur(),v.currentTime+10)}
    else if(a==="mute"){v.muted=!v.muted;if(!v.muted&&v.volume===0)v.volume=.5}
    else if(a==="speed"){si=(si+1)%speeds.length;v.playbackRate=speeds[si];spd.textContent=speeds[si]+"x"}
    else if(a==="fs")fs();
  };
  // Primeiro frame sempre visível (evita tela preta) e retomada de onde parou
  const first=()=>{
    if(!v.paused)return;
    let s=0;
    try{s=parseFloat(localStorage.getItem(pk))||0}catch(e){}
    if(s>5&&s<dur()-5){preview=false;try{v.currentTime=s}catch(e){}}
    else if(v.currentTime<.05)try{v.currentTime=PV}catch(e){}
  };
  v.addEventListener("loadedmetadata",()=>{first();paint()});
  v.addEventListener("loadeddata",first);
  v.addEventListener("play",()=>{vp.classList.add("playing");wake()});
  v.addEventListener("pause",()=>{vp.classList.remove("playing");try{localStorage.setItem(pk,v.currentTime)}catch(e){}});
  v.addEventListener("ended",()=>{vp.classList.remove("playing");try{localStorage.removeItem(pk)}catch(e){}});
  v.addEventListener("waiting",()=>vp.classList.add("wait"));
  v.addEventListener("playing",()=>vp.classList.remove("wait"));
  v.addEventListener("canplay",()=>vp.classList.remove("wait"));
  v.addEventListener("error",()=>vp.classList.add("err"));
  v.addEventListener("timeupdate",()=>{paint();if(Math.abs(v.currentTime-last)>3){last=v.currentTime;try{localStorage.setItem(pk,last)}catch(e){}}});
  v.addEventListener("progress",()=>{const b=v.buffered;if(b.length&&dur())buf.style.width=b.end(b.length-1)/dur()*100+"%"});
  v.addEventListener("dblclick",fs);
  v.load();
  const at=e=>{const r=seek.getBoundingClientRect();return Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))};
  seek.addEventListener("pointerdown",e=>{preview=false;seek.setPointerCapture(e.pointerId);vp.classList.add("drag");v.currentTime=at(e)*dur()});
  seek.addEventListener("pointermove",e=>{const p=at(e);tip.style.left=p*100+"%";tip.textContent=fmt(p*dur());if(vp.classList.contains("drag"))v.currentTime=p*dur()});
  seek.addEventListener("pointerup",()=>vp.classList.remove("drag"));
  vp.addEventListener("click",e=>{
    const b=e.target.closest("[data-a]");
    if(b)return act(b.dataset.a);
    if(e.target===v||e.target.closest(".vp-big"))toggle();
  });
  vp.addEventListener("mousemove",wake);
  vp.addEventListener("touchstart",wake,{passive:true});
  vp.addEventListener("keydown",e=>{
    if(e.target!==vp)return;
    const k=e.key;
    if(k===" "||k==="k"){e.preventDefault();toggle()}
    else if(k==="ArrowRight")act("ff");
    else if(k==="ArrowLeft")act("rw");
    else if(k==="f")fs();
    else if(k==="m")act("mute");
    else if(k==="ArrowUp"||k==="ArrowDown"){e.preventDefault();const n=Math.min(1,Math.max(0,v.volume+(k==="ArrowUp"?.1:-.1)));v.volume=n;v.muted=n===0}
  });
}
function closeCongrats(){
  const m=$("congrats");
  if(!m)return;
  m.classList.remove("show");
  document.body.style.overflow="";
  setTimeout(()=>m.remove(),250);
}
addEventListener("keydown",e=>{if(e.key==="Escape")closeCongrats()});
function showCongrats(){
  closeCongrats();
  const m=document.createElement("div");
  m.className="modal-overlay";m.id="congrats";
  m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-labelledby","cgT");
  m.innerHTML=`
    <div class="done-card" tabindex="-1">
      <div class="seal"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 15-17"/></svg></div>
      <span class="tag"><b>●</b> Curso básico concluído</span>
      <h2 id="cgT">Parabéns, você terminou!</h2>
      <p class="lead">Você concluiu as ${aulas.length} aulas e já sabe preparar o ambiente, ler o gráfico e controlar o risco. Agora é praticar com disciplina.</p>
      <ul class="recap">${aulas.map(a=>`<li><span>✓</span><div><b>${a.t}</b><small>${a.s}</small></div></li>`).join("")}</ul>
      <h3 class="next-t">Próximos passos</h3>
      <div class="next">
        <a class="btn" href="https://r.ryvon.io/l/1255/892" target="_blank" rel="noopener sponsored">Abrir conta na corretora</a>
        <a class="btn ghost" href="https://t.me/" target="_blank" rel="noopener">Entrar no grupo do Telegram</a>
        <a class="btn ghost" href="https://www.tiktok.com/@basktrader" target="_blank" rel="noopener">Seguir @basktrader no TikTok</a>
      </div>
      <div class="done-foot">
        <button class="btn ghost" type="button" id="cgReview">Rever as aulas</button>
        <button class="btn ghost" type="button" id="cgClose">Fechar</button>
      </div>
    </div>`;
  document.body.appendChild(m);
  document.body.style.overflow="hidden";
  m.addEventListener("click",e=>{if(e.target===m)closeCongrats()});
  $("cgClose").onclick=closeCongrats;
  $("cgReview").onclick=()=>{closeCongrats();location.hash="aulas"};
  setTimeout(()=>{m.classList.add("show");m.querySelector(".done-card").focus({preventScroll:true})},10);
}
function confetti(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const colors=["#2cf27a","#f2f7f4","#8da094","#0fb856"];
  for(let i=0;i<90;i++){
    const p=document.createElement("div");
    p.className="confetti";
    p.style.left=Math.random()*100+"%";
    p.style.width=(Math.random()*6+6)+"px";
    p.style.height=(Math.random()*8+8)+"px";
    p.style.background=colors[Math.floor(Math.random()*colors.length)];
    p.style.setProperty("--dx",(Math.random()*160-80)+"px");
    p.style.animationDelay=Math.random()*0.5+"s";
    p.style.animationDuration=(Math.random()*1.6+2)+"s";
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),4500);
  }
}
function rota(){
  const h=location.hash.slice(1)||"inicio";
  const m=h.match(/^aula(\d+)$/);
  let v="inicio",tab="inicio";
  if(h==="aulas"){v="aulas";tab="aulas";lista()}
  else if(m&&aulas[m[1]-1]){v="aula";tab="aulas";aula(m[1]-1)}
  document.querySelectorAll(".view").forEach(e=>e.classList.toggle("on",e.id==="v-"+v));
  document.querySelectorAll("[data-r]").forEach(e=>e.classList.toggle("on",e.dataset.r===tab));
  if(v!=="aula")document.querySelectorAll("video").forEach(x=>x.pause());
  window.scrollTo(0,0);
}
(function(){
  const cv=document.getElementById("bg"),cx=cv.getContext("2d");
  const CW=14,STEP=26;let W,H,cs=[],off=0,p=0;
  function nc(){const o=p,c=o+(Math.random()-.5)*.14-o*.03;p=c;const w=Math.random()*.056;return{o,c,hi:Math.max(o,c)+w,lo:Math.min(o,c)-Math.random()*.056}}
  function size(){const d=devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);while(cs.length*STEP<W+STEP*2)cs.push(nc());draw()}
  const y=v=>H*.5-v*H*.8;
  function draw(){
    cx.clearRect(0,0,W,H);cx.lineWidth=1.5;cx.strokeStyle=cx.fillStyle="#2cf27a";
    cs.forEach((k,i)=>{
      const x=i*STEP-off,m=x+CW/2,up=k.c>=k.o;
      cx.globalAlpha=up?1:.55;
      cx.beginPath();cx.moveTo(m,y(k.hi));cx.lineTo(m,y(k.lo));cx.stroke();
      const t=y(Math.max(k.o,k.c)),h=Math.max(2,Math.abs(y(k.o)-y(k.c)));
      if(up)cx.fillRect(x,t,CW,h);else cx.strokeRect(x+.75,t,CW-1.5,h);
    });
    cx.globalAlpha=1;
  }
  function loop(){off+=.3;if(off>=STEP){off-=STEP;cs.shift();cs.push(nc())}draw();requestAnimationFrame(loop)}
  addEventListener("resize",size);size();
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches)requestAnimationFrame(loop);
})();
$("abImg").src=document.querySelector(".mark").src;
addEventListener("hashchange",rota);rota();