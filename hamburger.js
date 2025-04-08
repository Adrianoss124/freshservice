class HamburgerMenu {
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
          noScroll: 'no-scroll'
      };

      this.options = {
          breakpoint: 1024,
          animationDelay: 100
      };

      this.state = {
          isOpen: false,
          isDesktop: window.innerWidth > this.options.breakpoint
      };

      this.init();
  }

  init() {
      this.cacheDom();
      if (this.isValidDom()) {
          this.setupEvents();
          this.setupAccessibility();
          this.handleInitialState();
      } else {
          console.warn('HamburgerMenu: Brak wymaganych elementów DOM. Sprawdź HTML.');
      }
  }

  cacheDom() {
      this.hamburger = document.querySelector(this.selectors.hamburger);
      this.navLinks = document.querySelector(this.selectors.navLinks);
      this.menuOverlay = document.querySelector(this.selectors.menuOverlay) || document.createElement('div'); // Fallback dla overlay
      this.navLinksItems = document.querySelectorAll(this.selectors.navLink);
      this.body = document.querySelector(this.selectors.body);

      // Jeśli overlay nie istnieje, dodaj go dynamicznie
      if (!document.querySelector(this.selectors.menuOverlay)) {
          this.menuOverlay.className = 'menu-overlay';
          document.body.appendChild(this.menuOverlay);
      }
  }

  isValidDom() {
      return this.hamburger && this.navLinks && this.body && this.navLinksItems.length > 0;
  }

  setupEvents() {
      this.hamburger.addEventListener('click', (e) => this.toggleMenu(e));
      this.menuOverlay.addEventListener('click', () => this.closeMenu());
      this.navLinksItems.forEach(link => {
          link.addEventListener('click', () => this.closeMenu());
      });
      document.addEventListener('keydown', (e) => this.handleKeydown(e));
      window.addEventListener('resize', () => this.handleResize());
  }

  setupAccessibility() {
      this.hamburger.setAttribute('aria-label', 'Toggle navigation menu');
      this.hamburger.setAttribute('aria-expanded', 'false');
      this.hamburger.setAttribute('aria-controls', 'nav-links');
      this.navLinks.setAttribute('role', 'navigation');
      if (!this.state.isDesktop) {
          this.navLinks.inert = true;
      }
  }

  toggleMenu(e) {
      if (this.state.isDesktop) return;

      e.stopPropagation();
      this.state.isOpen = !this.state.isOpen;

      this.hamburger.classList.toggle(this.classes.active);
      this.navLinks.classList.toggle(this.classes.active);
      this.menuOverlay.classList.toggle(this.classes.active);
      this.body.classList.toggle(this.classes.noScroll);

      this.hamburger.setAttribute('aria-expanded', this.state.isOpen);
      this.navLinks.inert = !this.state.isOpen;

      if (this.state.isOpen) {
          this.animateNavLinks();
          this.trapFocus();
          this.navLinksItems[0]?.focus();
      } else {
          this.resetNavLinks();
          this.hamburger.focus();
      }
  }

  closeMenu() {
      if (this.state.isDesktop) return;

      this.state.isOpen = false;
      this.hamburger.classList.remove(this.classes.active);
      this.navLinks.classList.remove(this.classes.active);
      this.menuOverlay.classList.remove(this.classes.active);
      this.body.classList.remove(this.classes.noScroll);
      this.hamburger.setAttribute('aria-expanded', 'false');
      this.navLinks.inert = true;
      this.resetNavLinks();
      this.hamburger.focus();
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
          }, index * this.options.animationDelay);
      });
  }

  resetNavLinks() {
      this.navLinksItems.forEach(link => {
          link.style.transition = 'none';
          link.style.opacity = '1';
          link.style.transform = 'none';
      });
  }

  handleKeydown(e) {
      if (this.state.isOpen) {
          if (e.key === 'Escape') {
              this.closeMenu();
          } else if (e.key === 'Tab') {
              this.handleTabKey(e);
          }
      }
  }

  handleTabKey(e) {
      const focusableElements = this.navLinks.querySelectorAll('a[href], button:not([disabled])');
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
          if (this.state.isOpen) {
              this.navLinks.focus();
          }
      }, { once: true });
  }

  handleResize() {
      const wasDesktop = this.state.isDesktop;
      this.state.isDesktop = window.innerWidth > this.options.breakpoint;

      if (this.state.isDesktop && !wasDesktop) {
          this.closeMenu();
          this.navLinks.inert = false;
          this.resetNavLinks();
      } else if (!this.state.isDesktop && wasDesktop && !this.state.isOpen) {
          this.navLinks.inert = true;
      }
  }

  handleInitialState() {
      if (this.state.isDesktop) {
          this.navLinks.inert = false;
          this.resetNavLinks();
      } else {
          this.navLinks.inert = true;
      }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
      new HamburgerMenu();
  } catch (error) {
      console.error('HamburgerMenu: Błąd inicjalizacji:', error);
  }
});