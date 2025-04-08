class MobileMenu {
  constructor() {
      this.selectors = {
          hamburger: '.hamburger',
          navLinks: '.nav-links',
          menuOverlay: '.menu-overlay',
          navLink: '.nav-link',
          body: 'body'
      };

      this.classes = {
          active: 'active',
          noScroll: 'no-scroll',
          animate: 'animate'
      };

      this.options = {
          observerThreshold: 0.1,
          observerRootMargin: '0px 0px -50px 0px'
      };

      this.init();
  }

  init() {
      this.cacheDom();
      if (this.hamburger && this.navLinks && this.menuOverlay) {
          this.initMenuEvents();
          this.initA11y();
          this.handleResize();
      }
      this.initAnimations();
  }

  cacheDom() {
      this.hamburger = document.querySelector(this.selectors.hamburger);
      this.navLinks = document.querySelector(this.selectors.navLinks);
      this.menuOverlay = document.querySelector(this.selectors.menuOverlay);
      this.navLinksItems = document.querySelectorAll(this.selectors.navLink);
      this.body = document.querySelector(this.selectors.body);
      this.section = document.querySelector('.projects-section');
      this.items = document.querySelectorAll('.project-item');
  }

  initMenuEvents() {
      this.hamburger.addEventListener('click', (e) => this.toggleMenu(e));
      this.menuOverlay.addEventListener('click', () => this.closeMenu());
      this.navLinksItems.forEach(link => {
          link.addEventListener('click', () => this.closeMenu());
      });
      document.addEventListener('keydown', (e) => this.handleKeydown(e));
      window.addEventListener('resize', () => this.handleResize());
  }

  initA11y() {
      if (window.innerWidth <= 1024) {
          this.navLinks.inert = true;
      }
      this.navLinks.setAttribute('role', 'navigation');
      this.hamburger.setAttribute('aria-label', 'Toggle menu');
  }

  toggleMenu(e) {
      if (window.innerWidth > 1024) return;

      e.stopPropagation();
      const isOpening = !this.hamburger.classList.contains(this.classes.active);

      this.hamburger.classList.toggle(this.classes.active);
      this.navLinks.classList.toggle(this.classes.active);
      this.menuOverlay.classList.toggle(this.classes.active);
      this.body.classList.toggle(this.classes.noScroll);

      this.hamburger.setAttribute('aria-expanded', isOpening);
      this.navLinks.inert = !isOpening;

      if (isOpening) {
          this.trapFocus();
          this.animateNavLinks();
          this.navLinksItems[0]?.focus();
      }
  }

  closeMenu() {
      if (window.innerWidth > 1024) return;

      this.hamburger.classList.remove(this.classes.active);
      this.navLinks.classList.remove(this.classes.active);
      this.menuOverlay.classList.remove(this.classes.active);
      this.body.classList.remove(this.classes.noScroll);
      this.hamburger.setAttribute('aria-expanded', 'false');
      this.navLinks.inert = true;
      this.hamburger.focus();
  }

  handleKeydown(e) {
      if (e.key === 'Escape' && this.navLinks.classList.contains(this.classes.active)) {
          this.closeMenu();
      }

      if (e.key === 'Tab' && this.navLinks.classList.contains(this.classes.active)) {
          this.handleTabKey(e);
      }
  }

  handleTabKey(e) {
      const focusableElements = this.navLinks.querySelectorAll('a[href], button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
      }
  }

  trapFocus() {
      this.navLinks.addEventListener('transitionend', () => {
          this.navLinks.focus();
      }, { once: true });
  }

  animateNavLinks() {
      this.navLinksItems.forEach((link, index) => {
          link.style.transition = 'none';
          link.style.opacity = '0';
          link.style.transform = 'translateX(20px)';
          setTimeout(() => {
              link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              link.style.opacity = '1';
              link.style.transform = 'translateX(0)';
          }, index * 100);
      });
  }

  handleResize() {
      if (window.innerWidth > 1024) {
          this.closeMenu();
          this.navLinks.inert = false;
          this.navLinksItems.forEach(link => {
              link.style.transition = 'none';
              link.style.opacity = '1';
              link.style.transform = 'none';
          });
      } else if (!this.navLinks.classList.contains(this.classes.active)) {
          this.navLinks.inert = true;
      }
  }

  initAnimations() {
      if (this.section) {
          setTimeout(() => this.section.classList.add(this.classes.animate), 100);
      }

      if (this.items.length > 0) {
          const observer = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      entry.target.classList.add(this.classes.animate);
                      observer.unobserve(entry.target);
                  }
              });
          }, {
              threshold: this.options.observerThreshold,
              rootMargin: this.options.observerRootMargin
          });

          this.items.forEach(item => observer.observe(item));

          // Efekt dotyku na urządzeniach mobilnych
          this.items.forEach(item => {
              item.addEventListener('touchstart', () => {
                  item.classList.add('touch-hover');
              });
              item.addEventListener('touchend', () => {
                  setTimeout(() => item.classList.remove('touch-hover'), 100);
              });
          });
      }

      // Efekt parallax dla tła sekcji
      if (this.section) {
          window.addEventListener('scroll', () => {
              const scrollPosition = window.scrollY;
              this.section.style.backgroundPositionY = `${scrollPosition * 0.2}px`;
          });
      }
  }
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
});

// Lazy loading dla dynamicznie ładowanych elementów (opcjonalne)
const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          const element = entry.target;
          if (element.dataset.src) {
              element.src = element.dataset.src;
              element.removeAttribute('data-src');
          }
          observer.unobserve(element);
      }
  });
}, { threshold: 0.01 });

document.querySelectorAll('[data-src]').forEach(element => {
  lazyLoadObserver.observe(element);
});