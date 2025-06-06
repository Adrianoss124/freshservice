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

    // Diagnostyka: Sprawdzenie, czy hamburger istnieje
    if (!hamburger) {
        console.error("Hamburger button not found in HTML! Check DOM structure.");
    } else {
        console.log("Hamburger button found:", hamburger);
        console.log("Hamburger display style:", window.getComputedStyle(hamburger).display);
    }

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

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});