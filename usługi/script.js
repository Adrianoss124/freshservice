class MobileMenu {
    constructor() {
      this.selectors = {
        hamburger: '.hamburger',
        navLinks: '.nav-links',
        menuOverlay: '.menu-overlay',
        navLink: '.nav-link',
        body: 'body',
      };
  
      this.classes = {
        active: 'active',
        noScroll: 'no-scroll',
      };
  
      this.init();
    }
  
    init() {
      this.cacheDom();
      this.initEvents();
      this.initA11y();
      this.handleResize(); // Inicjalizacja stanu na starcie
    }
  
    cacheDom() {
      this.hamburger = document.querySelector(this.selectors.hamburger);
      this.navLinks = document.querySelector(this.selectors.navLinks);
      this.menuOverlay = document.querySelector(this.selectors.menuOverlay);
      this.navLinksItems = [...document.querySelectorAll(this.selectors.navLink)];
      this.body = document.querySelector(this.selectors.body);
    }
  
    initEvents() {
      // Delegacja zdarzeń
      this.hamburger?.addEventListener('click', (e) => this.toggleMenu(e));
      this.menuOverlay?.addEventListener('click', () => this.closeMenu());
      this.navLinksItems.forEach((link) => {
        link.addEventListener('click', () => this.closeMenu());
      });
      document.addEventListener('keydown', (e) => this.handleKeydown(e));
      window.addEventListener('resize', () => this.handleResize());
    }
  
    initA11y() {
      if (this.navLinks && window.innerWidth <= 1024) {
        this.navLinks.inert = true;
      }
    }
  
    toggleMenu(e) {
      if (window.innerWidth > 1024) return; // Ignoruj na desktopie
  
      e.stopPropagation();
      const isOpening = !this.hamburger.classList.contains(this.classes.active);
  
      this.hamburger.classList.toggle(this.classes.active);
      this.navLinks.classList.toggle(this.classes.active);
      this.menuOverlay.classList.toggle(this.classes.active);
      this.body.classList.toggle(this.classes.noScroll);
  
      // Aktualizacja ARIA
      this.hamburger.setAttribute('aria-expanded', isOpening);
      this.navLinks.inert = !isOpening;
  
      // Zarządzanie focusem
      if (isOpening) {
        this.trapFocus();
        this.navLinksItems[0]?.focus();
      }
    }
  
    closeMenu() {
      if (window.innerWidth > 1024) return; // Ignoruj na desktopie
  
      this.hamburger?.classList.remove(this.classes.active);
      this.navLinks?.classList.remove(this.classes.active);
      this.menuOverlay?.classList.remove(this.classes.active);
      this.body?.classList.remove(this.classes.noScroll);
      this.hamburger?.setAttribute('aria-expanded', 'false');
      this.navLinks.inert = true;
    }
  
    handleKeydown(e) {
      if (e.key === 'Escape' && this.navLinks?.classList.contains(this.classes.active)) {
        this.closeMenu();
      }
  
      // Trap tab key within menu
      if (e.key === 'Tab' && this.navLinks?.classList.contains(this.classes.active)) {
        this.handleTabKey(e);
      }
    }
  
    handleTabKey(e) {
      const focusableElements = this.navLinks.querySelectorAll('a, button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
  
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  
    trapFocus() {
      this.navLinks.addEventListener('transitionend', () => {
        this.navLinks.focus();
      }, { once: true });
    }
  
    handleResize() {
      if (window.innerWidth > 1024) {
        // Resetuj menu na desktopie
        this.closeMenu();
        if (this.navLinks) {
          this.navLinks.inert = false;
        }
      } else {
        // Upewnij się, że menu jest zamknięte na mobile
        this.closeMenu();
        if (this.navLinks) {
          this.navLinks.inert = true;
        }
      }
    }
  }
  
  // Inicjalizacja
  document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
  });