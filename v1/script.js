/* ============================================
   PixelPulse Media LTD - Shared JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Page Loader --- */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    setTimeout(() => loader.classList.add('hidden'), 2500);
  }

  /* --- Header Scroll Effect --- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile Navigation --- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  function closeMobileNav() {
    menuToggle?.classList.remove('active');
    navLinks?.classList.remove('open');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    menuToggle?.classList.add('active');
    navLinks?.classList.add('open');
    navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  menuToggle?.addEventListener('click', () => {
    if (navLinks?.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  navOverlay?.addEventListener('click', closeMobileNav);

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* --- Scroll Reveal Animations --- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* --- Counter Animation --- */
  const counters = document.querySelectorAll('.count-up');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* --- Active Nav Link Highlighting --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta a)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Smooth scroll for same-page anchors --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --- Parallax Subtle Effect for Hero --- */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const shapes = heroSection.querySelectorAll('.hero-shape');
        shapes.forEach((shape, i) => {
          const speed = 0.03 * (i + 1);
          shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
      }
    }, { passive: true });
  }

  /* --- Contact Form Handler --- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      const origText = btn.innerHTML;
      btn.innerHTML = '<span>Sending...</span>';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        btn.innerHTML = '<span>Message Sent!</span> &#10003;';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        setTimeout(() => {
          btn.innerHTML = origText;
          btn.style.background = '';
          btn.style.pointerEvents = '';
          contactForm.reset();
        }, 2500);
      }, 1500);
    });
  }

  /* --- Typed Text Effect for Hero --- */
  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    const words = JSON.parse(typedEl.dataset.words || '[]');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function typeLoop() {
      const current = words[wordIndex];
      if (isDeleting) {
        charIndex--;
        typedEl.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timeout = setTimeout(typeLoop, 400);
          return;
        }
        timeout = setTimeout(typeLoop, 50);
      } else {
        charIndex++;
        typedEl.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          timeout = setTimeout(typeLoop, 2000);
          return;
        }
        timeout = setTimeout(typeLoop, 100);
      }
    }

    if (words.length) typeLoop();
  }

  /* --- Testimonial auto-scroll (horizontal) --- */
  const testimonialTrack = document.querySelector('.testimonial-auto-scroll');
  if (testimonialTrack) {
    let scrollPos = 0;
    const speed = 0.5;
    function autoScroll() {
      scrollPos += speed;
      if (scrollPos >= testimonialTrack.scrollWidth / 2) {
        scrollPos = 0;
      }
      testimonialTrack.style.transform = `translateX(-${scrollPos}px)`;
      requestAnimationFrame(autoScroll);
    }
    autoScroll();
  }

});
