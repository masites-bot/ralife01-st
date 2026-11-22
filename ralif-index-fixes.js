/* Pequenas correções da home oficial: CTA Blog, teaser antigo e acessibilidade mobile. */
(function(){
"use strict";
function fix(){
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