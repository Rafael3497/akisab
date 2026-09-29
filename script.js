(function(){
  var b = document.getElementById('burger'),
      m = document.getElementById('menu'),
      hd = document.getElementById('hd');

  function set(o) {
    m.classList.toggle('open', o);
    b.setAttribute('aria-expanded', o);
  }
  
  b.addEventListener('click', function() {
    set(!m.classList.contains('open'));
  });
  
  m.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') set(false);
  });

  /* Barra de Progresso de Scroll */
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function() {
    hd.classList.toggle('sc', window.scrollY > 10);
    
    // Atualiza a largura da barra de progresso
    var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }, {passive: true});

  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Reveal + Contadores */
  function count(el) {
    var t = +el.dataset.count,
        s = el.dataset.suf || '',
        st = performance.now();
    (function f(now) {
      var p = Math.min((now - st) / 1400, 1);
      el.textContent = Math.round(t * p) + (p === 1 ? s : '');
      if (p < 1) requestAnimationFrame(f);
    })(st);
  }

  var els = document.querySelectorAll('.rv');
  if (rm || !('IntersectionObserver' in window)) {
    els.forEach(function(e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(es) {
      es.forEach(function(x) {
        if (x.isIntersecting) {
          x.target.classList.add('in');
          x.target.querySelectorAll('[data-count]').forEach(count);
          io.unobserve(x.target);
        }
      });
    }, {threshold: .15});
    els.forEach(function(e, i) {
      e.style.transitionDelay = (i % 4) * 90 + 'ms';
      io.observe(e);
    });
  }

  /* Flocos de neve */
  if (!rm) {
    var sn = document.getElementById('snow');
    for (var i = 0; i < 14; i++) {
      var s = document.createElement('i');
      s.textContent = '\u2744';
      s.style.left = Math.random() * 100 + '%';
      s.style.fontSize = (10 + Math.random() * 14) + 'px';
      s.style.opacity = .5 + Math.random() * .5;
      s.style.animationDuration = (9 + Math.random() * 10) + 's';
      s.style.animationDelay = (-Math.random() * 15) + 's';
      sn.appendChild(s);
    }
  }

  /* Formulário -> WhatsApp com Loading State Profissional */
  var form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var f = e.target, ok = true;
      [f.nome, f.tel, f.msg].forEach(function(x) {
        var bad = !x.value.trim();
        x.style.borderColor = bad ? '#e5484d' : '';
        if (bad) ok = false;
      });
      if (!ok) return;

      var btn = f.querySelector('button[type="submit"]');
      var originalHTML = btn.innerHTML;
      
      // Animação de carregamento no botão
      btn.style.transform = 'scale(0.97)';
      btn.innerHTML = '<svg style="animation:spin 1s linear infinite; display:inline-block; vertical-align:middle; margin-right:8px;" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke-width="2" stroke-linecap="round"/></svg> Preparando mensagem...';

      setTimeout(function() {
        var txt = 'Olá! Meu nome é ' + f.nome.value.trim() + '.\nTelefone: ' + f.tel.value.trim() + '\n\n' + f.msg.value.trim();
        window.open('https://api.whatsapp.com/send?phone=5585991425425&text=' + encodeURIComponent(txt), '_blank', 'noopener');
        
        // Restaura o botão
        btn.innerHTML = originalHTML;
        btn.style.transform = 'none';
      }, 500);
    });
  }

  /* Scroll Spy: Destaca o link ativo no menu conforme o scroll */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('nav a[href^="#"]');

  window.addEventListener('scroll', function() {
    var scrollY = window.pageYOffset;
    sections.forEach(function(current) {
      var sectionHeight = current.offsetHeight;
      var sectionTop = current.offsetTop - 120;
      var sectionId = current.getAttribute('id');
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {passive: true});

})();
