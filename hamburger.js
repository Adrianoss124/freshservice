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
            breakpoint: 992, // zsynchronizowany z CSS
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
            console.warn('HamburgerMenu: Brak wymaganych elementów DOM.');
        }
    }

    cacheDom() {
        this.hamburger = document.querySelector(this.selectors.hamburger);
        this.navLinks = document.querySelector(this.selectors.navLinks);
        this.menuOverlay = document.querySelector(this.selectors.menuOverlay);
        this.navLinksItems = document.querySelectorAll(this.selectors.navLink);
        this.body = document.querySelector(this.selectors.body);

        // Diagnostyka
        if (!this.hamburger) {
            console.error('HamburgerMenu: Przycisk hamburger nie znaleziony w HTML!');
        } else {
            console.log('HamburgerMenu: Przycisk hamburger znaleziony:', this.hamburger);
        }
        if (!this.navLinks) {
            console.error('HamburgerMenu: Element nav-links nie znaleziony w HTML!');
        } else {
            console.log('HamburgerMenu: Nav-links znalezione:', this.navLinks);
        }
    }

    isValidDom() {
        return this.hamburger && this.navLinks && this.body && this.navLinksItems.length > 0;
    }

    setupEvents() {
        this.hamburger.addEventListener('click', (e) => {
            console.log('Hamburger kliknięty');
            this.toggleMenu(e);
        });
        this.menuOverlay.addEventListener('click', () => {
            console.log('Kliknięto overlay menu');
            this.closeMenu();
        });
        this.navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                console.log('Kliknięto link:', link.textContent);
                this.closeMenu();
            });
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
        console.log(`Stan menu: ${this.state.isOpen ? 'otwarte' : 'zamknięte'}`);

        // Dodaj/usuń klasy aktywne
        this.hamburger.classList.toggle(this.classes.active);
        this.navLinks.classList.toggle(this.classes.active);
        this.menuOverlay.classList.toggle(this.classes.active);
        this.body.classList.toggle(this.classes.noScroll);

        if (this.state.isOpen) {
            // otwieranie menu
            this.navLinks.style.display = 'flex';
            this.navLinks.style.opacity = '1';
            this.navLinks.style.visibility = 'visible';
            console.log('NavLinks wyświetlone jako flex');
            this.animateNavLinks();
            this.navLinksItems[0]?.focus();
        } else {
            // zamykanie menu
            this.navLinks.style.display = 'none';
            this.resetNavLinks();
            this.hamburger.focus();
        }

        // Ustaw atrybut aria-expanded zgodnie ze stanem
        this.hamburger.setAttribute('aria-expanded', String(this.state.isOpen));
        this.navLinks.inert = !this.state.isOpen;

        console.log('Klasy navLinks po toggle:', this.navLinks.classList);
    }

    closeMenu() {
        if (this.state.isDesktop) return;

        this.state.isOpen = false;
        this.hamburger.classList.remove(this.classes.active);
        this.navLinks.classList.remove(this.classes.active);
        this.menuOverlay.classList.remove(this.classes.active);
        this.body.classList.remove(this.classes.noScroll);

        this.navLinks.style.display = 'none';
        this.navLinks.inert = true;
        this.resetNavLinks();

        this.hamburger.setAttribute('aria-expanded', 'false');
        this.hamburger.focus();
        console.log('Menu zamknięte; NavLinks display:', this.navLinks.style.display);
    }

    animateNavLinks() {
        console.log('Animacja linków, liczba pozycji:', this.navLinksItems.length);
        this.navLinksItems.forEach((link, index) => {
            link.style.transition = 'none';
            link.style.opacity = '0';
            link.style.transform = 'translateX(20px)';
            setTimeout(() => {
                console.log('Animowanie linku:', link.textContent);
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
        if (this.state.isOpen && e.key === 'Escape') {
            console.log('Wciśnięto Escape, zamykam menu');
            this.closeMenu();
        }
    }

    handleResize() {
        const wasDesktop = this.state.isDesktop;
        this.state.isDesktop = window.innerWidth > this.options.breakpoint;
        console.log(`Resize: isDesktop=${this.state.isDesktop}, wasDesktop=${wasDesktop}, isOpen=${this.state.isOpen}`);

        if (this.state.isDesktop && !wasDesktop) {
            // przejście z trybu mobilnego do desktop: natychmiast wyświetl nav-links
            this.closeMenu();
            this.navLinks.inert = false;
            this.navLinks.style.display = 'flex';
            console.log('Przełączono na desktop; NavLinks display: flex');
        } else if (!this.state.isDesktop && wasDesktop) {
            // przejście z desktop do mobilnego
            this.navLinks.inert = true;
            if (this.state.isOpen) {
                this.navLinks.style.display = 'flex';
                console.log('Przełączono na mobilne z otwartym menu; NavLinks display: flex');
            } else {
                this.navLinks.style.display = 'none';
                console.log('Przełączono na mobilne z zamkniętym menu; NavLinks display: none');
            }
        }
    }

    handleInitialState() {
        console.log('Stan początkowy: isDesktop=', this.state.isDesktop);
        if (this.state.isDesktop) {
            this.navLinks.inert = false;
            this.navLinks.style.display = 'flex';
        } else {
            this.navLinks.inert = true;
            this.navLinks.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        new HamburgerMenu();
    } catch (error) {
        console.error('HamburgerMenu initialization failed:', error);
    }
});
