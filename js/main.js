/* ==========================================================================
   NEUMÁTICOS NORTE — main.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------------------------------
  // 1. Init AOS
  // -----------------------------------------------------------------------
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });


  // -----------------------------------------------------------------------
  // 2. Navbar — solidify on scroll
  // -----------------------------------------------------------------------
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  // -----------------------------------------------------------------------
  // 3. Hamburger menu
  // -----------------------------------------------------------------------
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });


  // -----------------------------------------------------------------------
  // 4. Active nav link on scroll (Intersection Observer)
  // -----------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id], div[id="inicio"]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    {
      rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--navbar-h') || '70px'} 0px -60% 0px`,
    }
  );

  sections.forEach(section => observer.observe(section));


  // -----------------------------------------------------------------------
  // 5. Smooth scroll for anchor links
  // -----------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navbarH = navbar.offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navbarH;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });


  // -----------------------------------------------------------------------
  // 6. Contact form — show success message (Formspree AJAX)
  // -----------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      // Only intercept if Formspree ID is still a placeholder
      const action = contactForm.getAttribute('action');
      if (action.includes('[FORMSPREE_ID]')) {
        e.preventDefault();
        // Simulate success for demo
        showFormSuccess();
        return;
      }

      // Real Formspree AJAX submission
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';

      try {
        const data = new FormData(contactForm);
        const response = await fetch(action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          showFormSuccess();
          contactForm.reset();
        } else {
          submitBtn.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> Error – intentá de nuevo';
          submitBtn.disabled = false;
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
          }, 3000);
        }
      } catch {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // -----------------------------------------------------------------------
  // 7. Service card slider — rotación automática entre 5 servicios
  // -----------------------------------------------------------------------
  const sliderCard   = document.getElementById('serviceSliderCard');
  const sliderInner  = document.getElementById('serviceSliderInner');
  const sliderDots   = document.getElementById('serviceSliderDots');

  if (sliderCard && sliderInner) {
    const slides  = sliderInner.querySelectorAll('.service-card__slide');
    const dots    = sliderDots  ? sliderDots.querySelectorAll('.service-slider__dot') : [];
    const prevBtn = sliderCard.querySelector('.service-slider__prev');
    const nextBtn = sliderCard.querySelector('.service-slider__next');
    let current   = 0;
    let timer     = null;
    const DELAY   = 4500;

    function goTo(idx) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function startAuto() { timer = setInterval(() => goTo(current + 1), DELAY); }
    function stopAuto()  { clearInterval(timer); }
    function resetAuto() { stopAuto(); startAuto(); }

    startAuto();

    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.idx, 10)); resetAuto(); });
    });

    // Pausar en hover / focus para que el usuario pueda leer
    sliderCard.addEventListener('mouseenter', stopAuto);
    sliderCard.addEventListener('mouseleave', startAuto);
    sliderCard.addEventListener('focusin',    stopAuto);
    sliderCard.addEventListener('focusout',   startAuto);
  }


  // -----------------------------------------------------------------------
  // 8. WhatsApp float — toggle menú de sucursales
  // -----------------------------------------------------------------------
  const waToggle = document.getElementById('waToggle');
  const waFloat  = document.getElementById('waFloat');
  const waMenu   = document.getElementById('waMenu');
  const waIcon   = document.getElementById('waIcon');

  if (waToggle && waFloat) {
    waToggle.addEventListener('click', () => {
      const isOpen = waFloat.classList.toggle('open');
      waToggle.setAttribute('aria-expanded', isOpen.toString());
      waMenu.setAttribute('aria-hidden', (!isOpen).toString());
      // Cambiar ícono: WA ↔ X
      waIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-brands fa-whatsapp';
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', e => {
      if (!waFloat.contains(e.target)) {
        waFloat.classList.remove('open');
        waToggle.setAttribute('aria-expanded', 'false');
        waMenu.setAttribute('aria-hidden', 'true');
        waIcon.className = 'fa-brands fa-whatsapp';
      }
    });

    // Cerrar al elegir una sucursal (cierra el menú antes de abrir WA)
    waMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        waFloat.classList.remove('open');
        waToggle.setAttribute('aria-expanded', 'false');
        waMenu.setAttribute('aria-hidden', 'true');
        waIcon.className = 'fa-brands fa-whatsapp';
      });
    });
  }


  function showFormSuccess() {
    if (!formSuccess) return;
    formSuccess.style.display = 'flex';
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
  }

});
