/* Pequenas correções da home oficial: CTA Blog, teaser antigo e acessibilidade mobile. */
(function(){
"use strict";
function fix(){
  const socialTargets={
    "Facebook":"https://pt-br.facebook.com/Ralifeengenharia/",
    "Instagram":"https://br.linkedin.com/company/ralife-engenharia",
    "Youtube":"https://www.youtube.com/@RALIFEENGENHARIA"
  };
  document.querySelectorAll("footer a[aria-label]").forEach(function(a){
    const label=a.getAttribute("aria-label");
    if(!label||!socialTargets[label])return;
    a.setAttribute("href",socialTargets[label]);
    if(label==="Instagram"){
      a.setAttribute("aria-label","LinkedIn");
      a.textContent="in";
    }else if(label==="Youtube"){
      a.setAttribute("aria-label","YouTube");
    }
  });
  document.querySelectorAll("footer p").forEach(function(p){
    if(/Facebook\s*[•·]\s*Instagram\s*[•·]\s*Youtube/i.test(p.textContent||"")){
      p.textContent="Facebook • LinkedIn • YouTube";
    }
  });

  document.querySelectorAll("a").forEach(function(a){
    if((a.textContent||"").replace(/\s+/g," ").trim().replace(/→/g,"").trim().toUpperCase()==="BLOG RALIF"){
      a.setAttribute("href","blog.html");
      a.removeAttribute("target");
    }
  });
  document.querySelectorAll("p,span,div").forEach(function(el){
    if(el.children.length===0 && /Blog completo com 69 artigos, categorias e tags\.?/i.test(el.textContent||"")){
      el.remove();
    }
  });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",fix,{once:true});else fix();
new MutationObserver(fix).observe(document.documentElement,{childList:true,subtree:true});
})();