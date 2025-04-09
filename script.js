document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const menuOverlay = document.querySelector(".menu-overlay");
    const cards = document.querySelectorAll(".card");
    const hero = document.querySelector(".hero");
    const themeToggle = document.querySelector(".theme-toggle");
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    // Animacja Hero
    if (hero) {
        setTimeout(() => hero.classList.add("animate"), 100);
    }

    // Animacja kart
    if (cards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        cards.forEach((card) => {
            observer.observe(card);
            const link = card.querySelector(".btn");
            if (link) {
                card.style.cursor = "pointer";
                card.addEventListener("click", (e) => {
                    if (e.target !== link) {
                        window.location.href = link.getAttribute("href");
                    }
                });
            }
        });
    }

    // Menu mobilne
    if (hamburger && navLinks && menuOverlay) {
        hamburger.addEventListener("click", () => {
            const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", !isExpanded);
            navLinks.classList.toggle("active");
            menuOverlay.classList.toggle("active");
            document.body.classList.toggle("no-scroll");
        });
        menuOverlay.addEventListener("click", () => {
            hamburger.setAttribute("aria-expanded", "false");
            navLinks.classList.remove("active");
            menuOverlay.classList.remove("active");
            document.body.classList.remove("no-scroll");
        });
        navLinks.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.setAttribute("aria-expanded", "false");
                navLinks.classList.remove("active");
                menuOverlay.classList.remove("active");
                document.body.classList.remove("no-scroll");
            });
        });
    }

    // Parallax dla Hero
    if (hero) {
        window.addEventListener("scroll", () => {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
        });
    }

    // Tryb jasny/ciemny
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light");
            const isLight = document.body.classList.contains("light");
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem("theme", isLight ? "light" : "dark");
        });
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            document.body.classList.add("light");
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
});