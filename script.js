document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  const header = document.getElementById("hd");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     0. Preferências de cookies e carregamento do Google Maps
     ------------------------------------------------------------------ */
  const cookieBanner = document.getElementById("cookie-banner");
  const consentCookieName = "akisab_cookie_consent";
  const readCookieConsent = () => {
    const item = document.cookie.split("; ").find((cookie) => cookie.startsWith(`${consentCookieName}=`));
    return item ? item.split("=").slice(1).join("=") : null;
  };
  const loadGoogleMaps = () => {
    document.querySelectorAll("iframe[data-cookie-map]").forEach((frame) => {
      frame.src = frame.dataset.cookieMap;
      frame.hidden = false;
      const placeholder = frame.parentElement.querySelector("[data-map-placeholder]");
      if (placeholder) placeholder.hidden = true;
    });
  };
  const unloadGoogleMaps = () => {
    document.querySelectorAll("iframe[data-cookie-map]").forEach((frame) => {
      frame.removeAttribute("src");
      frame.hidden = true;
      const placeholder = frame.parentElement.querySelector("[data-map-placeholder]");
      if (placeholder) placeholder.hidden = false;
    });
  };
  const saveCookieConsent = (choice) => {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${consentCookieName}=${choice}; Max-Age=15552000; Path=/; SameSite=Lax${secure}`;
    if (cookieBanner) cookieBanner.hidden = true;
    if (choice === "accepted") loadGoogleMaps();
    else unloadGoogleMaps();
  };
  const cookieConsent = readCookieConsent();
  if (cookieConsent === "accepted") loadGoogleMaps();
  else if (cookieConsent !== "rejected" && cookieBanner) cookieBanner.hidden = false;

  document.getElementById("cookie-accept")?.addEventListener("click", () => saveCookieConsent("accepted"));
  document.getElementById("cookie-reject")?.addEventListener("click", () => saveCookieConsent("rejected"));
  document.getElementById("cookie-settings")?.addEventListener("click", () => {
    if (cookieBanner) cookieBanner.hidden = false;
  });
  document.querySelector("[data-consent-load-map]")?.addEventListener("click", () => saveCookieConsent("accepted"));

  /* ------------------------------------------------------------------
     1. Menu hambúrguer (mobile)
     ------------------------------------------------------------------ */
  const setMenu = (open) => {
    if (!burger || !menu) return;
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };

  if (burger && menu) {
    burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));

    // fecha ao clicar em um link
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

    // fecha ao clicar fora
    document.addEventListener("click", (e) => {
      if (menu.classList.contains("open") && !menu.contains(e.target) && !burger.contains(e.target)) {
        setMenu(false);
      }
    });

    // fecha com ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        setMenu(false);
        burger.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     2. Sombra no header ao rolar
     ------------------------------------------------------------------ */
  if (header) {
    const onScroll = () => header.classList.toggle("sc", window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     3. Aparição ao rolar (reveal) + contadores
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".rv");

  const runCounters = (root) => {
    root.querySelectorAll("[data-count]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";

      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suf || "";
      if (Number.isNaN(target)) return;

      if (reduceMotion) {
        el.textContent = target + suffix;
        return;
      }

      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          runCounters(entry.target);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // navegador antigo: mostra tudo
    revealEls.forEach((el) => {
      el.classList.add("in");
      runCounters(el);
    });
  }

  /* ------------------------------------------------------------------
     4. Link ativo no menu conforme a seção visível
     ------------------------------------------------------------------ */
  if ("IntersectionObserver" in window && menu) {
    const links = [...menu.querySelectorAll('a[href^="#"]')];
    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => {
            a.classList.remove("active");
            a.removeAttribute("aria-current");
          });
          const active = byId.get(entry.target.id);
          if (active) {
            active.classList.add("active");
            active.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    byId.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     5. Formulário -> WhatsApp
     ------------------------------------------------------------------ */
  const reviewsCarousel = document.querySelector("[data-reviews-carousel]");
  if (reviewsCarousel) {
    const track = reviewsCarousel.querySelector("[data-reviews-track]");
    const originalCards = [...track.children];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;
    let timer;

    originalCards.slice(0, 2).forEach((card) => track.append(card.cloneNode(true)));
    const cardStep = () => originalCards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
    const move = () => { track.style.transform = `translateX(${-index * cardStep()}px)`; };
    const advance = () => {
      if (index >= originalCards.length) {
        track.style.transition = "none";
        index = 0;
        move();
        requestAnimationFrame(() => requestAnimationFrame(() => { track.style.transition = ""; }));
      } else {
        index += 1;
        move();
      }
    };
    const start = () => {
      window.clearInterval(timer);
      if (!reducedMotion.matches) timer = window.setInterval(advance, 4200);
    };
    const pause = () => window.clearInterval(timer);

    reviewsCarousel.addEventListener("mouseenter", pause);
    reviewsCarousel.addEventListener("mouseleave", start);
    reviewsCarousel.addEventListener("focusin", pause);
    reviewsCarousel.addEventListener("focusout", start);
    reducedMotion.addEventListener("change", start);
    window.addEventListener("resize", move);
    start();
  }

  const form = document.getElementById("form");
  const formMsg = document.getElementById("form-msg");

  if (form) {
    const fields = {
      nome: form.querySelector('[name="nome"]'),
      tel: form.querySelector('[name="tel"]'),
      msg: form.querySelector('[name="msg"]'),
    };

    const showError = (text, field) => {
      if (formMsg) formMsg.textContent = text;
      Object.values(fields).forEach((f) => f && f.removeAttribute("aria-invalid"));
      if (field) {
        field.setAttribute("aria-invalid", "true");
        field.focus();
      }
    };

    // limpa o erro enquanto o usuário digita
    Object.values(fields).forEach((f) => {
      if (!f) return;
      f.addEventListener("input", () => {
        f.removeAttribute("aria-invalid");
        if (formMsg) formMsg.textContent = "";
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = fields.nome.value.trim();
      const tel = fields.tel.value.trim();
      const msg = fields.msg.value.trim();
      const telDigits = tel.replace(/\D/g, "");

      if (!nome) return showError("Informe seu nome.", fields.nome);
      if (telDigits.length < 10) return showError("Informe um telefone válido com DDD.", fields.tel);
      if (!msg) return showError("Conte qual aparelho e qual o problema.", fields.msg);

      showError("", null);

      const texto = `Olá, meu nome é *${nome}* (Tel: ${tel}). ${msg}`;
      const url = `https://api.whatsapp.com/send?phone=5585991425425&text=${encodeURIComponent(texto)}`;
      window.open(url, "_blank", "noopener");
    });
  }
});
