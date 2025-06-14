document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    const themeToggle = document.querySelector('.theme-toggle');
    const backToTop = document.getElementById('back-to-top');
    const cookieBanner = document.getElementById('cookie-banner');
    const form = document.getElementById('repairForm');
    const modal = document.getElementById('responseModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalClose = document.querySelector('.modal-close');
    
    // Initialize form section animation
    const formSection = document.querySelector('.form-section');
    setTimeout(() => formSection.classList.add('animate'), 100);
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Close menu when clicking on overlay
    menuOverlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        this.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Back to top button
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
    
    // Cookie banner
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
    
    // Form validation and submission
    function validateForm() {
        let isValid = true;
        const fields = [
            { id: 'system', errorId: 'system-error', message: 'Proszę wybrać system operacyjny' },
            { id: 'serviceType', errorId: 'serviceType-error', message: 'Proszę wybrać typ usługi' },
            { id: 'fullName', errorId: 'fullName-error', message: 'Proszę podać imię i nazwisko' },
            { id: 'email', errorId: 'email-error', message: 'Proszę podać poprawny adres email' },
            { id: 'phone', errorId: 'phone-error', message: 'Proszę podać numer telefonu' },
            { id: 'description', errorId: 'description-error', message: 'Proszę opisać problem' }
        ];
        
        // Reset errors
        fields.forEach(field => {
            document.getElementById(field.id).classList.remove('error');
            document.getElementById(field.errorId).textContent = '';
        });
        
        // Validate each field
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element.value.trim()) {
                element.classList.add('error');
                document.getElementById(field.errorId).textContent = field.message;
                isValid = false;
            }
        });
        
        // Validate email format
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            email.classList.add('error');
            document.getElementById('email-error').textContent = 'Nieprawidłowy format adresu email';
            isValid = false;
        }
        
        // Validate consent
        const consent = document.getElementById('consent');
        if (!consent.checked) {
            isValid = false;
            modalMessage.textContent = 'Proszę wyrazić zgodę na przetwarzanie danych';
            modal.classList.add('active');
        }
        
        return isValid;
    }
    
    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const submitBtn = document.getElementById('wyslij');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                form.reset();
                modalMessage.textContent = 'Dziękujemy! Twoje zgłoszenie zostało wysłane. Skontaktujemy się z Tobą w ciągu 24 godzin.';
            } else {
                const errorData = await response.json();
                modalMessage.textContent = 'Wystąpił błąd podczas wysyłania formularza. Prosimy spróbować ponownie później.';
            }
        } catch (error) {
            modalMessage.textContent = 'Wystąpił błąd połączenia. Prosimy spróbować ponownie później.';
        } finally {
            modal.classList.add('active');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Wyślij zgłoszenie';
            submitBtn.disabled = false;
        }
    });
    
    // Close modal
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});