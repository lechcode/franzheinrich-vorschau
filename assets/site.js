/* ============================================================================
   FRANZ HEINRICH — gemeinsames Verhalten aller Seiten (Runde 9, 01.10.2026)
   Burger-Menü · Auftauchen · Video-Lightbox · Formular-Klappe
   · Vorschau-Formulare · Sprachschalter DE/EN
   ========================================================================== */
(function(){
  var d=document;

  /* Burger-Menü */
  var burger=d.getElementById('burger'),menu=d.getElementById('mobile-menu');
  if(burger&&menu){
    var menuSet=function(open){
      d.body.classList.toggle('menu-open',open);
      burger.setAttribute('aria-expanded',open?'true':'false');
      burger.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');
    };
    burger.addEventListener('click',function(){menuSet(!d.body.classList.contains('menu-open'));});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menuSet(false);});});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')menuSet(false);});
  }

  /* Ankommen mit Anker (z. B. „Dein Weg" → index.html#weg): direkt hinspringen statt
     von oben zu gleiten, und nach dem Laden der Bilder noch einmal nachjustieren */
  var ziel=location.hash.length>1&&d.getElementById(location.hash.slice(1));
  if(ziel){
    var spring=function(){ziel.scrollIntoView({behavior:'instant',block:'start'});};
    spring();window.addEventListener('load',spring);
  }

  /* Auftauchen beim Scrollen (einmalig, gestaffelt über --d) */
  var els=d.querySelectorAll('.rv, .rv-img, .rise, .rise-img');
  var show=function(el){el.classList.add('in');};
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)){
    els.forEach(show);
  }else{
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target);}});
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){if(el.getBoundingClientRect().top<window.innerHeight*0.92){show(el);}else{io.observe(el);}});
  }

  /* Video-Lightbox (alle Play-Knöpfe mit .video-open) */
  var box=d.getElementById('lightbox'),boxX=d.getElementById('lightbox-x');
  if(box&&boxX){
    var hide=function(){box.classList.remove('on');var v=box.querySelector('video');if(v)v.pause();};
    d.querySelectorAll('.video-open').forEach(function(b){b.addEventListener('click',function(){box.classList.add('on');boxX.focus();});});
    boxX.addEventListener('click',hide);
    box.addEventListener('click',function(e){if(e.target===box)hide();});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')hide();});
  }

  /* Formular-Klappe: Anker #kontaktform öffnet sie */
  var fb=d.getElementById('kontaktform');
  if(fb){
    d.querySelectorAll('a[href$="#kontaktform"]').forEach(function(a){a.addEventListener('click',function(){fb.open=true;});});
    if(location.hash==='#kontaktform')fb.open=true;
  }

  /* Formulare: in der Vorschau nur bestätigen, nicht senden */
  d.querySelectorAll('form[data-vorschau]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();var b=f.querySelector('button[type=submit]');
      b.textContent='Danke — in der Vorschau wird noch nichts gesendet';b.disabled=true;
    });
  });

  /* Sprachschalter. Deutsch steht im HTML, Englisch in assets/i18n-en.js (Schlüssel = data-t).
     Übersetzt ist die Startseite; auf den Unterseiten führt EN dorthin. */
  var KEY='fh-lang';
  var cur=function(){try{return localStorage.getItem(KEY)||'de';}catch(e){return 'de';}};
  var save=function(l){try{localStorage.setItem(KEY,l);}catch(e){}};
  var langBtns=d.querySelectorAll('.lang');
  var hasDict=function(){return !!window.FH_EN&&d.querySelector('[data-t]');};
  var apply=function(lang){
    var en=window.FH_EN||{};
    d.querySelectorAll('[data-t]').forEach(function(el){
      var k=el.getAttribute('data-t');
      if(!el.dataset.de)el.dataset.de=el.innerHTML;
      el.innerHTML=(lang==='en'&&en[k]!==undefined)?en[k]:el.dataset.de;
    });
    d.documentElement.lang=lang;
    langBtns.forEach(function(b){
      b.textContent=lang==='en'?'DE':'EN';
      b.setAttribute('aria-label',lang==='en'?'Auf Deutsch umschalten':'Switch to English');
    });
  };
  if(hasDict())apply(cur());
  langBtns.forEach(function(b){b.addEventListener('click',function(){
    if(hasDict()){var next=cur()==='en'?'de':'en';save(next);apply(next);}
    else{save('en');location.href='index.html';}
  });});
})();
