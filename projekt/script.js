document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    const themeToggle = document.querySelector('.theme-toggle');
    const backToTop = document.getElementById('back-to-top');
    const cookieBanner = document.getElementById('cookie-banner');
    const hero = document.querySelector('.hero');
    const cards = document.querySelectorAll('.card');

    // Animacje początkowe
    setTimeout(() => hero.classList.add('animate'), 100);
    cards.forEach((card, index) => {
        setTimeout(() => card.classList.add('animate'), 200 * (index + 1));
    });

    // Menu hamburger
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        const isOpen = this.classList.contains('active');
        this.setAttribute('aria-expanded', isOpen);
    });

    menuOverlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        this.classList.remove('active');
        document.body.classList.remove('no-scroll');
        hamburger.setAttribute('aria-expanded', 'false');
    });

    // Przełączanie motywu
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        this.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Przycisk powrotu na górę
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Baner cookies
    function checkCookies() {
        if (!localStorage.getItem('cookies-accepted')) {
            cookieBanner.style.display = 'block';
        } else {
            cookieBanner.style.display = 'none';
        }
    }

    document.getElementById('accept-cookies').addEventListener('click', function() {
        localStorage.setItem('cookies-accepted', 'true');
        cookieBanner.style.display = 'none';
    });

    document.getElementById('reject-cookies').addEventListener('click', function() {
        localStorage.setItem('cookies-accepted', 'rejected');
        cookieBanner.style.display = 'none';
    });

    checkCookies();

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../sw.js').catch(err => {
            console.error('Service Worker registration failed:', err);
        });
    }
});