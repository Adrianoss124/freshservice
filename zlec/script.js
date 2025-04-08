document.addEventListener('DOMContentLoaded', () => {
  // Obsługa efektu focus dla pól formularza
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
      input.addEventListener('focus', function() {
          this.parentNode.classList.add('focus');
      });
      input.addEventListener('blur', function() {
          if (this.value === '') {
              this.parentNode.classList.remove('focus');
          }
      });
  });

  // Animacja wejścia dla sekcji formularza
  const formSection = document.querySelector('.form-section');
  if (formSection) {
      setTimeout(() => formSection.classList.add('animate'), 100);
  }
});
document.addEventListener('DOMContentLoaded', () => {
    // Animacja sekcji cennika
    const pricingSection = document.querySelector('.pricing-section');
    if (pricingSection) {
        setTimeout(() => pricingSection.classList.add('animate'), 100);
    }

    // Animacja wierszy tabeli
    const pricingRows = document.querySelectorAll('.pricing-table tr');
    pricingRows.forEach((row, index) => {
        setTimeout(() => row.classList.add('animate'), 200 + index * 100);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('repairForm');
    const inputs = document.querySelectorAll('.form-input');
    const emailInput = document.getElementById('email');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.validity.valid) {
                input.classList.remove('error');
                input.nextElementSibling?.remove(); // Usuń komunikat o błędzie
            } else {
                showError(input);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        inputs.forEach(input => {
            if (!input.validity.valid) {
                e.preventDefault();
                showError(input);
            }
        });
    });

    function showError(input) {
        if (input.nextElementSibling?.className === 'error-message') return;
        const error = document.createElement('span');
        error.className = 'error-message';
        error.style.color = '#ff4444';
        error.style.fontSize = '0.9rem';
        if (input.validity.valueMissing) {
            error.textContent = 'To pole jest wymagane.';
        } else if (input === emailInput && input.validity.typeMismatch) {
            error.textContent = 'Podaj poprawny adres email.';
        }
        input.classList.add('error');
        input.parentNode.appendChild(error);
    }
});
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
            form.reset();
            showModal('Zgłoszenie wysłane! Skontaktujemy się w ciągu 24 godzin.');
        } else {
            showModal('Błąd podczas wysyłania. Spróbuj ponownie.');
        }
    } catch (error) {
        showModal('Wystąpił problem z połączeniem.');
    }
});

function showModal(message) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p>${message}</p>
            <button class="modal-close">OK</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.querySelector('.modal-close').addEventListener('click', () => modal.remove());
}
