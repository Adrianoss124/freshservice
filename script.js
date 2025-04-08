document.addEventListener("DOMContentLoaded", function () {
  /* ============================= */
  /*  Inicjalizacja zmiennych     */
  /* ============================= */
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const menuOverlay = document.querySelector(".menu-overlay");
  const cards = document.querySelectorAll(".card");
  const hero = document.querySelector(".hero");
  const observerOptions = {
      threshold: 0.1, // Element widoczny w 10% wyzwala animację
      rootMargin: "0px 0px -50px 0px" // Lekkie przesunięcie dla płynności
  };

  /* ============================= */
  /*  Animacja wejścia elementów  */
  /* ============================= */
  // Animacja sekcji Hero
  if (hero) {
      setTimeout(() => hero.classList.add("animate"), 100);
  }

  // Animacja kart z Intersection Observer
  if (cards.length > 0) {
      const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
              if (entry.isIntersecting) {
                  entry.target.classList.add("animate");
                  observer.unobserve(entry.target); // Jednorazowa animacja
              }
          });
      }, observerOptions);

      cards.forEach((card) => {
          observer.observe(card);

          // Kliknięcie całej karty – przeniesienie do linku z atrybutu href w .btn
          const link = card.querySelector(".btn");
          if (link) {
              card.style.cursor = "pointer";
              card.addEventListener("click", (e) => {
                  if (e.target !== link) { // Unikamy podwójnego kliknięcia w link
                      window.location.href = link.getAttribute("href");
                  }
              });
          }

          // Efekt dotyku na urządzeniach mobilnych
          card.addEventListener("touchstart", () => {
              card.classList.add("touch-hover");
          });
          card.addEventListener("touchend", () => {
              setTimeout(() => card.classList.remove("touch-hover"), 100);
          });
      });
  }

  /* ============================= */
  /*    Toggle menu mobilne       */
  /* ============================= */
  if (hamburger && navLinks && menuOverlay) {
      hamburger.addEventListener("click", () => {
          const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
          hamburger.setAttribute("aria-expanded", !isExpanded);
          navLinks.classList.toggle("active");
          menuOverlay.classList.toggle("active");
          document.body.classList.toggle("no-scroll"); // Blokada przewijania
      });

      // Zamykanie menu po kliknięciu w overlay
      menuOverlay.addEventListener("click", () => {
          hamburger.setAttribute("aria-expanded", "false");
          navLinks.classList.remove("active");
          menuOverlay.classList.remove("active");
          document.body.classList.remove("no-scroll");
      });

      // Zamykanie menu po kliknięciu w link
      navLinks.querySelectorAll(".nav-link").forEach(link => {
          link.addEventListener("click", () => {
              hamburger.setAttribute("aria-expanded", "false");
              navLinks.classList.remove("active");
              menuOverlay.classList.remove("active");
              document.body.classList.remove("no-scroll");
          });
      });
  }

  /* ============================= */
  /*    Efekt przewijania (parallax) dla tła hero */
  /* ============================= */
  if (hero) {
      window.addEventListener("scroll", () => {
          const scrollPosition = window.scrollY;
          hero.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
      });
  }
});