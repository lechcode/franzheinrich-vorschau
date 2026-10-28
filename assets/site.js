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

  /* YouTube direkt im Bildrahmen (.video-yt[data-yt]): Vorschaubild bleibt, bis jemand auf Play klickt —
     erst dann wird der Player (youtube-nocookie) an derselben Stelle geladen. */
  d.querySelectorAll('.video-yt[data-yt]').forEach(function(b){b.addEventListener('click',function(){
    var stage=b.closest('.videostage'),f=d.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(b.getAttribute('data-yt'))+'?autoplay=1&rel=0&playsinline=1&modestbranding=1';
    f.title=b.getAttribute('data-yt-title')||'Video';
    f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('allowfullscreen','');
    f.referrerPolicy='strict-origin-when-cross-origin';
    stage.classList.add('spielt');stage.innerHTML='';stage.appendChild(f);f.focus();
  });});

  /* Video-Lightbox (alle Play-Knöpfe mit .video-open) */
  var box=d.getElementById('lightbox'),boxX=d.getElementById('lightbox-x');
  if(box&&boxX){
    var hide=function(){box.classList.remove('on');var v=box.querySelector('video');if(v)v.pause();};
    d.querySelectorAll('.video-open').forEach(function(b){b.addEventListener('click',function(){box.classList.add('on');boxX.focus();});});
    boxX.addEventListener('click',hide);
    box.addEventListener('click',function(e){if(e.target===box)hide();});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')hide();});
  }

  /* Formulare: in der Vorschau nur bestätigen, nicht senden.
     data-weiter: zeigt in der Vorschau, wohin die echte Anmeldung später weiterleitet. */
  d.querySelectorAll('form[data-vorschau]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();var b=f.querySelector('button[type=submit]');
      var en=d.documentElement.lang==='en';
      b.textContent=en?'Thanks — nothing is sent in this preview yet':'Danke — in der Vorschau wird noch nichts gesendet';b.disabled=true;
      if(f.dataset.weiter&&!f.querySelector('.weiter')){
        var p=d.createElement('p');p.className='form-note weiter';
        p.innerHTML='<a href="'+f.dataset.weiter+'">'+(en?'See the page you’ll land on →':'So sieht die Seite danach aus →')+'</a>';
        f.appendChild(p);
      }
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
    /* Alt-Texte von Bildern (data-t-alt) */
    d.querySelectorAll('[data-t-alt]').forEach(function(el){
      var k=el.getAttribute('data-t-alt');
      if(el.dataset.deAlt===undefined)el.dataset.deAlt=el.alt;
      el.alt=(lang==='en'&&en[k]!==undefined)?en[k]:el.dataset.deAlt;
    });
    /* Platzhalter in Eingabefeldern (data-t-ph) */
    d.querySelectorAll('[data-t-ph]').forEach(function(el){
      var k=el.getAttribute('data-t-ph');
      if(!el.dataset.dePh)el.dataset.dePh=el.placeholder;
      el.placeholder=(lang==='en'&&en[k]!==undefined)?en[k]:el.dataset.dePh;
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
