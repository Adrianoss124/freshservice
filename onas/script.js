document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    const themeToggle = document.querySelector('.theme-toggle');
    const backToTop = document.getElementById('back-to-top');
    const aboutSection = document.querySelector('.about-section');
    const featureCards = document.querySelectorAll('.feature-card');
    const aboutImg = document.querySelector('.about-img');
    const hero = document.querySelector('.hero');
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const rejectCookies = document.getElementById('reject-cookies');

    // Animacje
    if (hero) {
        setTimeout(() => hero.classList.add('animate'), 100);
    }

    if (aboutSection) {
        setTimeout(() => aboutSection.classList.add('animate'), 100);
    }

    if (featureCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        featureCards.forEach(card => observer.observe(card));
    }

    // Menu hamburger
    if (hamburger && navLinks && menuOverlay) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            const isOpen = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        menuOverlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            hamburger.setAttribute('aria-expanded', 'false');
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Przełączanie motywu
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light');
            const isLight = document.body.classList.contains('light');
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Przycisk powrotu na górę
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Interakcje z kartami
    if (featureCards.length > 0) {
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transition = 'transform 0.3s ease';
                    icon.style.transform = 'rotate(15deg) scale(1.1)';
                }
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'none';
                }
            });

            card.addEventListener('touchstart', () => {
                card.classList.add('touch-hover');
            });

            card.addEventListener('touchend', () => {
                setTimeout(() => card.classList.remove('touch-hover'), 100);
            });
        });
    }

    // Interakcja z obrazem
    if (aboutImg) {
        aboutImg.addEventListener('mouseenter', () => {
            aboutImg.style.transition = 'transform 0.3s ease';
            aboutImg.style.transform = 'scale(1.05)';
        });

        aboutImg.addEventListener('mouseleave', () => {
            aboutImg.style.transform = 'scale(1)';
        });
    }

    // Lazy loading
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.getAttribute('loading') === 'lazy') {
                    element.src = element.dataset.src || element.getAttribute('src');
                    element.removeAttribute('data-src');
                }
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.01 });

    document.querySelectorAll('img[loading="lazy"]').forEach(element => {
        lazyLoadObserver.observe(element);
    });

    // Cookie banner
    function checkCookies() {
        if (!localStorage.getItem('cookies-accepted') && cookieBanner) {
            cookieBanner.style.display = 'block';
        }
    }

    if (cookieBanner && acceptCookies && rejectCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookies-accepted', 'true');
            cookieBanner.style.display = 'none';
        });

        rejectCookies.addEventListener('click', () => {
            localStorage.setItem('cookies-accepted', 'rejected');
            cookieBanner.style.display = 'none';
        });

        checkCookies();
    }

    // Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../sw.js').catch(err => {
                console.error('Service Worker registration failed:', err);
            });
        });
    }

    // Parallax dla hero
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
        });
    }
});