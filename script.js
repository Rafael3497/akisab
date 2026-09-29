document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  const header = document.getElementById("hd");

  // Funcionalidade do Menu Hambúrguer no Mobile
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", isOpen);
    });

    // Fechar menu ao clicar em algum link interno
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Efeito de sombra no Header ao rolar a página
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("sc");
    } else {
      header.classList.remove("sc");
    }
  });

  // Animação de aparição ao rolar (Reveal)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".rv").forEach(el => observer.observe(el));

  // Envio do formulário integrado direto para o WhatsApp
  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = form.querySelector('[name="nome"]').value.trim();
      const tel = form.querySelector('[name="tel"]').value.trim();
      const msg = form.querySelector('[name="msg"]').value.trim();

      if (!nome || !tel || !msg) {
        alert("Por favor, preencha todos os campos antes de enviar.");
        return;
      }

      const textoZap = `Olá, meu nome é *${nome}* (Tel: ${tel}). ${msg}`;
      const urlZap = `https://api.whatsapp.com/send?phone=5585991425425&text=${encodeURIComponent(textoZap)}`;
      window.open(urlZap, "_blank");
    });
  }
});
