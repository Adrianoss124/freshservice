// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Inicjalizacja AOS (animacje)
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-out-back'
    });

    // Menu mobilne
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Płynne przewijanie
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Modal rejestracji
    const modal = document.getElementById('registrationModal');
    const openModalBtn = document.querySelector('.nav-cta');
    const closeModal = document.querySelector('.close-modal');

    openModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Obsługa formularzy
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            Swal.fire({
                title: 'Wysłano!',
                text: 'Twoja wiadomość została pomyślnie przesłana.',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: { confirmButton: 'btn btn-primary' }
            });
            form.reset();
            if (form.id === 'registrationForm') modal.style.display = 'none';
        });
    });

    // Interaktywne przyciski specyfikacji
    const specButtons = document.querySelectorAll('.product-btn');
    specButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const specType = btn.getAttribute('data-spec');
            Swal.fire({
                title: `Specyfikacja: ${specType.charAt(0).toUpperCase() + specType.slice(1)}`,
                text: `Szczegółowe informacje o produkcie "${specType}" dostępne po kontakcie z nami.`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Skontaktuj się',
                cancelButtonText: 'Zamknij',
                customClass: { confirmButton: 'btn btn-primary', cancelButton: 'btn btn-outline' }
            }).then(result => {
                if (result.isConfirmed) window.location.hash = '#contact';
            });
        });
    });

    // Efekt paralaksy dla hero
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        const hero = document.querySelector('.hero');
        hero.style.backgroundPositionY = `${scrollPos * 0.5}px`;
    });
});