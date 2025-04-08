class PricingPage {
    constructor() {
        this.selectors = {
            hamburger: '.hamburger',
            navLinks: '.nav-links',
            menuOverlay: '.menu-overlay',
            navLink: '.nav-link',
            body: 'body',
            pricingSection: '.pricing-section',
            pricingRow: '.pricing-table tr',
            pricingTable: '.pricing-table'
        };

        this.classes = {
            active: 'active',
            noScroll: 'no-scroll',
            animate: 'animate',
            touchHover: 'touch-hover'
        };

        this.options = {
            observerThreshold: 0.1,
            observerRootMargin: '0px 0px -50px 0px',
            parallaxSpeed: 0.2
        };

        this.init();
    }

    init() {
        this.cacheDom();
        this.initMenu();
        this.initAnimations();
        this.initInteractions();
        this.initLazyLoading();
    }

    cacheDom() {
        this.hamburger = document.querySelector(this.selectors.hamburger);
        this.navLinks = document.querySelector(this.selectors.navLinks);
        this.menuOverlay = document.querySelector(this.selectors.menuOverlay);
        this.navLinksItems = document.querySelectorAll(this.selectors.navLink);
        this.body = document.querySelector(this.selectors.body);
        this.pricingSection = document.querySelector(this.selectors.pricingSection);
        this.pricingRows = document.querySelectorAll(this.selectors.pricingRow);
        this.pricingTable = document.querySelector(this.selectors.pricingTable);
    }

    // Inicjalizacja menu mobilnego
    initMenu() {
        if (!this.hamburger || !this.navLinks || !this.menuOverlay) return;

        this.hamburger.addEventListener('click', (e) => this.toggleMenu(e));
        this.menuOverlay.addEventListener('click', () => this.closeMenu());
        this.navLinksItems.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        window.addEventListener('resize', () => this.handleResize());

        // Dostępność
        this.navLinks.setAttribute('role', 'navigation');
        this.hamburger.setAttribute('aria-label', 'Toggle menu');
        if (window.innerWidth <= 1024) {
            this.navLinks.inert = true;
        }
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
            this.animateNavLinks();
            this.navLinksItems[0]?.focus();
        } else {
            this.hamburger.focus();
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

    // Inicjalizacja animacji
    initAnimations() {
        // Animacja sekcji "Cennik"
        if (this.pricingSection) {
            setTimeout(() => this.pricingSection.classList.add(this.classes.animate), 100);
            this.addParallaxEffect(this.pricingSection);
        }

        // Animacja wierszy tabeli
        if (this.pricingRows.length > 0) {
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

            this.pricingRows.forEach(row => observer.observe(row));
        }
    }

    addParallaxEffect(element) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            element.style.backgroundPositionY = `${scrollPosition * this.options.parallaxSpeed}px`;
        });
    }

    // Inicjalizacja interakcji
    initInteractions() {
        if (this.pricingRows.length > 0) {
            this.pricingRows.forEach(row => {
                if (!row.classList.contains('note-row')) { // Pomijamy wiersz z notatką
                    // Efekt dotyku na urządzeniach mobilnych
                    row.addEventListener('touchstart', () => {
                        row.classList.add(this.classes.touchHover);
                    });
                    row.addEventListener('touchend', () => {
                        setTimeout(() => row.classList.remove(this.classes.touchHover), 100);
                    });

                    // Efekt hover dla myszy
                    row.addEventListener('mouseenter', () => {
                        row.style.transition = 'background 0.3s ease';
                    });
                    row.addEventListener('mouseleave', () => {
                        row.style.transition = 'background 0.3s ease';
                    });
                }
            });
        }
    }

    // Lazy loading dla obrazów (opcjonalne)
    initLazyLoading() {
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                        element.classList.add(this.classes.animate);
                    }
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.01 });

        document.querySelectorAll('[data-src]').forEach(element => {
            lazyLoadObserver.observe(element);
        });
    }
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    new PricingPage();
});
document.addEventListener('DOMContentLoaded', () => {
    const rows = Array.from(document.querySelectorAll('.pricing-table tbody tr:not(.note-row)'));
    const sortPriceBtn = document.getElementById('sortPrice');
    const filterCheapBtn = document.getElementById('filterCheap');
    const resetBtn = document.getElementById('resetFilter');
    const tbody = document.querySelector('.pricing-table tbody');

    sortPriceBtn.addEventListener('click', () => {
        const sortedRows = rows.sort((a, b) => {
            const priceA = parsePrice(a.cells[1].textContent);
            const priceB = parsePrice(b.cells[1].textContent);
            return priceA - priceB;
        });
        tbody.innerHTML = '';
        sortedRows.forEach(row => tbody.appendChild(row));
        appendNoteRow();
    });
    resetBtn.addEventListener('click', () => {
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
        appendNoteRow();
    });

    function parsePrice(priceText) {
        const match = priceText.match(/(\d+)/);
        return match ? parseInt(match[0]) : Infinity;
    }

    function appendNoteRow() {
        const noteRow = document.querySelector('.note-row');
        if (noteRow) tbody.appendChild(noteRow);
    }
});