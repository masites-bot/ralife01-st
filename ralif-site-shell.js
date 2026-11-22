/* RALIF — shell compartilhado de menu e rodapé, espelhado no Index.html. */
(function () {
  "use strict";
  const HOME="index.html#/", CONTACT="index.html#/contato", BLOG="blog.html";
  const WA="https://wa.me/5511995566563?text=Ol%C3%A1!%20Quero%20informa%C3%A7%C3%B5es%20sobre%20projeto%20de%20impermeabiliza%C3%A7%C3%A3o";
  const EMAIL="sac@projetodeimpermeabilizacao.com.br", P1="(11) 99556-6563", P2="(11) 94933-1470";
  const ADDRESS="Rua Francisco Bellazzi, N° 244 Jd. Jaraguá São Paulo";
  const FACEBOOK="https://pt-br.facebook.com/Ralifeengenharia/";
  const LINKEDIN="https://br.linkedin.com/company/ralife-engenharia";
  const YOUTUBE="https://www.youtube.com/@RALIFEENGENHARIA";
  const projects=[
    ["01 — Lajes de Cobertura","index.html#/projeto/lajes-de-cobertura"],
    ["02 — Paredes de Contenção","index.html#/projeto/paredes-de-contencao"],
    ["03 — Piscinas","index.html#/projeto/piscinas"],
    ["04 — Caixas d'água e Reservatórios","index.html#/projeto/caixas-dagua-e-reservatorios"],
    ["05 — Fundação","index.html#/projeto/fundacao"],
    ["06 — Jardins Suspensos","index.html#/projeto/jardins-suspensos"],
    ["07 — Alicerces","index.html#/projeto/alicerces"],
    ["08 — Terraços e Áreas de Lazer","index.html#/projeto/terracos-e-areas-de-lazer"],
    ["09 — Banheiros e Áreas Molhadas","index.html#/projeto/banheiros-e-areas-molhadas"],
    ["10 — Garagens e Estacionamentos","index.html#/projeto/garagens-e-estacionamentos"],
    ["11 — Cozinhas","index.html#/projeto/cozinhas"],
    ["12 — Peitorais e Esquadrias de Janelas","index.html#/projeto/peitorais-e-esquadrias-de-janelas"],
    ["13 — Pátios","index.html#/projeto/patios"],
    ["14 — Sacadas e Varandas","index.html#/projeto/sacadas-e-varandas"]
  ];
  const services=projects.slice(0,6);
  const safe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const list=items=>items.map(v=>'<a href="'+safe(v[1])+'">'+safe(v[0])+'</a>').join("");
  const current=()=>{
    const f=(location.pathname.split("/").pop()||"index.html").toLowerCase();
    if(f==="quem-somos.html"||f==="consultoria.html")return "empresa";
    if(f==="blog.html"||f.startsWith("artigo-")||f.startsWith("categoria-")||f.startsWith("tag-"))return "blog";
    if(f.startsWith("projetos-"))return "projetos";
    if(f==="contato.html")return "contato";
    if(f==="home.html"||f==="home-nova.html")return "inicio";
    return "";
  };
  const nav=(label,href,section,active)=>'<a class="ralif-navlink" href="'+href+'"'+(active===section?' aria-current="page"':'')+'>'+label+'</a>';
  function makeHeader(){
    const active=current();
    return '<header id="ralif-site-header"><div class="ralif-header-main">'+
      '<a class="ralif-brand" href="'+HOME+'" aria-label="Ralif Engenharia — Início"><img src="logo_01.png" alt="Ralif Engenharia — Impermeabilização"></a>'+
      '<nav class="ralif-desktop-nav" aria-label="Navegação principal">'+
      nav("Início",HOME,"inicio",active)+
      '<div class="ralif-drop"><a class="ralif-navlink'+(active==="empresa"?' is-active':'')+'" href="index.html#/empresa">Empresa <span class="ralif-chevron">⌄</span></a><div class="ralif-drop-menu">'+list([["Quem somos","quem-somos.html"],["Consultoria","consultoria.html"]])+'</div></div>'+
      '<div class="ralif-drop"><a class="ralif-navlink" href="index.html#/servicos">Serviços <span class="ralif-chevron">⌄</span></a><div class="ralif-drop-menu ralif-drop-menu-wide">'+list(services)+'</div></div>'+
      '<div class="ralif-drop"><a class="ralif-navlink'+(active==="projetos"?' is-active':'')+'" href="index.html#/projetos">Projetos <span class="ralif-chevron">⌄</span></a><div class="ralif-drop-menu ralif-drop-menu-wide">'+list([["Todos os projetos","index.html#/projetos"],...projects])+'</div></div>'+
      nav("Blog",BLOG,"blog",active)+nav("Contato",CONTACT,"contato",active)+'</nav>'+
      '<div class="ralif-head-actions"><a class="ralif-header-btn" href="'+WA+'" target="_blank" rel="noopener">WhatsApp</a><a class="ralif-header-btn" href="'+CONTACT+'">Solicitar Projeto</a><button class="ralif-menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="ralif-mobile-drawer"><span></span><span></span><span></span></button></div></div>'+
      '<div class="ralif-contact-band"><div class="ralif-contact-inner"><span>✉　'+EMAIL+'</span><span>☎　'+P1+'　•　'+P2+'</span></div></div>'+
      '<div class="ralif-drawer" id="ralif-mobile-drawer" hidden><aside class="ralif-drawer-panel" aria-label="Menu mobile">'+
      '<div class="ralif-drawer-head"><a href="'+HOME+'"><img src="logo_01.png" alt="Ralif Engenharia"></a><button class="ralif-drawer-close" type="button" aria-label="Fechar menu">×</button></div>'+
      '<nav class="ralif-mobile-links" aria-label="Navegação mobile">'+list([["Início",HOME],["Quem somos","quem-somos.html"],["Consultoria","consultoria.html"],["Serviços","index.html#/servicos"],["Projetos","index.html#/projetos"],["Blog",BLOG],["Contato",CONTACT],["Perguntas frequentes","index.html#/faq"]])+'</nav>'+
      '<p class="ralif-mobile-projects-title">Projetos — 14 áreas</p><div class="ralif-mobile-projects">'+list(projects)+'</div>'+
      '<a class="ralif-mobile-cta" href="'+WA+'" target="_blank" rel="noopener">WhatsApp • '+P1+'</a><a class="ralif-mobile-cta ralif-mobile-cta-secondary" href="'+CONTACT+'">Solicitar projeto</a>'+
      '<p class="ralif-mobile-contact-text">Atendimento<br>'+EMAIL+'<br>'+P1+' • '+P2+'</p><p class="ralif-mobile-contact-text">'+ADDRESS+'</p>'+
      '</aside></div></header>';
  }
  function makeFooter(){
    const topics=["Áreas Críticas que Exigem Impermeabilização","Diferentes Tipos de Impermeabilização","O Processo de Impermeabilização","Impermeabilização em Áreas Úmidas"].map(t=>[t,BLOG]);
    return '<footer id="ralif-site-footer"><div class="ralif-footer-grid">'+
      '<div><img class="ralif-footer-logo" src="logo-rodape-ralif.png" alt="Ralif Engenharia — Impermeabilização"><p class="ralif-footer-description">A Ralif Engenharia é especialista em desenvolver projetos de impermeabilização que realmente protegem sua construção.</p></div>'+
      '<div><h3>Menu</h3><span class="ralif-footer-bar"></span><nav class="ralif-footer-links">'+list(topics)+'</nav></div>'+
      '<div><h3>Links</h3><span class="ralif-footer-bar"></span><nav class="ralif-footer-links">'+list([["Quem somos","quem-somos.html"],["Consultoria","consultoria.html"],["Contatos",CONTACT],["Projetos","index.html#/projetos"],["Serviços","index.html#/servicos"],["Blog",BLOG]])+'</nav></div>'+
      '<div><h3>Localização</h3><span class="ralif-footer-bar"></span><p class="ralif-footer-location">'+ADDRESS+'</p><h3 class="ralif-footer-subtitle">Contatos</h3><span class="ralif-footer-bar"></span><nav class="ralif-footer-links"><a href="mailto:'+EMAIL+'">'+EMAIL+'</a><a href="tel:+5511995566563">'+P1+'</a><a href="tel:+5511949331470">'+P2+'</a></nav></div>'+
      '<div><h3>Siga-nos nas Redes Sociais</h3><span class="ralif-footer-bar"></span><div class="ralif-footer-social"><a href="'+FACEBOOK+'" target="_blank" rel="noopener" aria-label="Facebook">f</a><a href="'+LINKEDIN+'" target="_blank" rel="noopener" aria-label="LinkedIn">in</a><a href="'+YOUTUBE+'" target="_blank" rel="noopener" aria-label="YouTube">▶</a></div><p class="ralif-footer-social-label">Facebook • LinkedIn • YouTube</p><a class="ralif-footer-whatsapp" href="'+WA+'" target="_blank" rel="noopener">WhatsApp • '+P1+'</a><p class="ralif-footer-small-links"><a href="index.html#/sitemap">Mapa do site</a> • <a href="'+BLOG+'">Blog</a></p></div>'+
      '</div><div class="ralif-footer-bottom"><div class="ralif-footer-bottom-inner"><span>Powered by Projeto de Impermeabilização</span><span class="ralif-footer-bottom-links"><a href="index.html#/politicas-privacidade">Políticas de Privacidade</a><a href="index.html#/termos-de-uso">Termos de Uso</a></span></div></div></footer>';
  }
  function install(){
    if(!document.body||document.getElementById("ralif-site-header"))return;
    document.querySelectorAll(".topbar,header.main,footer").forEach(el=>el.remove());
    document.body.insertAdjacentHTML("afterbegin",makeHeader());
    document.body.insertAdjacentHTML("beforeend",makeFooter());
    const toggle=document.querySelector("#ralif-site-header .ralif-menu-toggle"),drawer=document.getElementById("ralif-mobile-drawer"),close=document.querySelector("#ralif-site-header .ralif-drawer-close");
    if(!toggle||!drawer||!close)return;
    const shut=restore=>{drawer.hidden=true;toggle.setAttribute("aria-expanded","false");document.body.classList.remove("ralif-menu-open");if(restore)toggle.focus();};
    toggle.addEventListener("click",()=>{drawer.hidden=false;toggle.setAttribute("aria-expanded","true");document.body.classList.add("ralif-menu-open");close.focus();});
    close.addEventListener("click",()=>shut(true));drawer.addEventListener("click",e=>{if(e.target===drawer)shut(true);});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!drawer.hidden)shut(true);});
    drawer.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>shut(false)));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
})();