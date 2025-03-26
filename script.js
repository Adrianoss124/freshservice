// Dodanie efektu parallax dla sekcji usług
window.addEventListener('scroll', () => {
    const servicesSection = document.querySelector('.services-section');
    const scrollPosition = window.scrollY;

    servicesSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
});

// Animacja pojawiania się kart przy przewijaniu
const serviceCards = document.querySelectorAll('.service-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

serviceCards.forEach(card => {
    observer.observe(card);
});

// Dodanie efektu hover dla przycisków
const serviceButtons = document.querySelectorAll('.service-btn');

serviceButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateX(5px)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateX(0)';
    });
});
// Skrypt wykonujący animację elementów przy przewijaniu oraz toggle menu mobilnego

document.addEventListener("DOMContentLoaded", function () {
    /* ============================= */
    /*  Animacja wejścia kart (scroll) */
    /* ============================= */
    const cards = document.querySelectorAll(".card");
    const observerOptions = {
      threshold: 0.1,
    };
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    cards.forEach((card) => {
      observer.observe(card);
    });
  
    /* ============================= */
    /*    Toggle menu mobilne        */
    /* ============================= */
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
  
    if (hamburger) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });
    }
  });
  
// Skrypt odpowiedzialny za animację wejścia kart, efekt dotyku oraz kliknięcie całej karty przenoszące do docelowej strony

document.addEventListener("DOMContentLoaded", function () {
    /* ============================= */
    /*  Animacja wejścia kart (scroll) */
    /* ============================= */
    const cards = document.querySelectorAll(".card");
    const observerOptions = {
      threshold: 0.1,
    };
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    cards.forEach((card) => {
      observer.observe(card);
  
      // Kliknięcie całej karty – przeniesienie do strony zapisanej w atrybucie data-href
      card.addEventListener("click", function () {
        window.location.href = card.getAttribute("data-href");
      });
  
      // Efekt dotyku: dodanie klasy symulującej hover na urządzeniach mobilnych
      card.addEventListener("touchstart", function () {
        card.classList.add("touch-hover");
      });
      card.addEventListener("touchend", function () {
        setTimeout(() => {
          card.classList.remove("touch-hover");
        }, 100);
      });
    });
  
    /* ============================= */
    /*    Toggle menu mobilne        */
    /* ============================= */
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
  
    if (hamburger) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });
    }
  });
  