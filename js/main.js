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

  function showFormSuccess() {
    if (!formSuccess) return;
    formSuccess.style.display = 'flex';
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
  }

});
