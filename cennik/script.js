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
        this.initBundleComparison();
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
        
        // Animacja kart zaufania
        const trustCards = document.querySelectorAll('.trust-card');
        trustCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        const trustObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        trustCards.forEach(card => {
            trustObserver.observe(card);
        });
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
                if (!row.classList.contains('note-row')) {
                    row.addEventListener('touchstart', () => {
                        row.classList.add(this.classes.touchHover);
                    });
                    row.addEventListener('touchend', () => {
                        setTimeout(() => row.classList.remove(this.classes.touchHover), 100);
                    });

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
    
    // Porównanie pakietów
    initBundleComparison() {
        const comparisonTable = document.querySelector('.comparison-table');
        if (!comparisonTable) return;
        
        comparisonTable.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'TD') {
                const row = e.target.parentElement;
                const rows = comparisonTable.querySelectorAll('tr');
                const index = Array.from(row.parentElement.children).indexOf(row);
                
                rows.forEach(r => {
                    if (r !== row) {
                        r.style.opacity = '0.6';
                    }
                });
            }
        });
        
        comparisonTable.addEventListener('mouseout', () => {
            const rows = comparisonTable.querySelectorAll('tr');
            rows.forEach(r => r.style.opacity = '1');
        });
    }

    // Lazy loading dla obrazów
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
    
    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceRows = document.querySelectorAll('.pricing-table tbody tr');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            // Show/hide rows based on category
            serviceRows.forEach(row => {
                if (category === 'all' || row.dataset.category === category) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
    
    // Service selection buttons
    const selectBtns = document.querySelectorAll('.select-btn');
    selectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceName = btn.closest('tr').querySelector('.service-name').textContent;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'service-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Wybrano: ${serviceName}</h3>
                    <p>Przejdziemy teraz do formularza zgłoszeniowego, gdzie będziesz mógł dodać szczegóły swojej usługi</p>
                    <div class="modal-actions">
                        <button class="modal-btn cancel">Anuluj</button>
                        <button class="modal-btn confirm">Kontynuuj</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners to modal buttons
            modal.querySelector('.cancel').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.querySelector('.confirm').addEventListener('click', () => {
                window.location.href = '../zlec/zlec.html';
            });
        });
    });
    
    // Bundle selection buttons
    const bundleBtns = document.querySelectorAll('.bundle-btn');
    bundleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const bundleName = btn.closest('.bundle-card').querySelector('h3').textContent;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'service-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Wybrano pakiet: ${bundleName}</h3>
                    <p>To doskonały wybór! Przejdziemy teraz do formularza, gdzie potwierdzimy szczegóły Twojego pakietu.</p>
                    <div class="modal-actions">
                        <button class="modal-btn cancel">Anuluj</button>
                        <button class="modal-btn confirm">Kontynuuj</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners to modal buttons
            modal.querySelector('.cancel').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.querySelector('.confirm').addEventListener('click', () => {
                window.location.href = '../zlec/zlec.html?package=' + encodeURIComponent(bundleName);
            });
        });
    });
    
    // Consultation button
    document.querySelector('.consultation-btn').addEventListener('click', () => {
        window.location.href = '../contact.html';
    });
    
    // Highlight popular/recommended services on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('highlighted');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.popular, .recommended').forEach(el => {
        observer.observe(el);
    });
});

// Service modal styling
const style = document.createElement('style');
style.textContent = `
.service-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.modal-content {
    background: var(--card-bg);
    border-radius: 15px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    border: 1px solid rgba(223,41,25,0.3);
    text-align: center;
}

.modal-content h3 {
    color: var(--accent);
    margin-bottom: 15px;
    font-size: 1.4rem;
}

.modal-content p {
    color: #aaa;
    margin-bottom: 25px;
    line-height: 1.6;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.modal-btn {
    padding: 10px 25px;
    border: none;
    border-radius: 5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.modal-btn.cancel {
    background: rgba(255,255,255,0.1);
    color: #aaa;
}

.modal-btn.cancel:hover {
    background: rgba(255,255,255,0.2);
}

.modal-btn.confirm {
    background: var(--primary);
    color: white;
}

.modal-btn.confirm:hover {
    background: #c22417;
}
`;
document.head.appendChild(style);