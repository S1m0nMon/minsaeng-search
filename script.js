document.addEventListener('DOMContentLoaded', () => {
    const pages = {
        landing: document.getElementById('landing'),
        input: document.getElementById('input-step'),
        loading: document.getElementById('loading'),
        resultNegative: document.getElementById('result-negative'),
        resultPositive: document.getElementById('result-positive')
    };

    const buttons = {
        start: document.getElementById('start-btn'),
        check: document.getElementById('check-eligibility-btn'),
        backToLanding: document.getElementById('back-to-landing'),
        closeResult: document.getElementById('close-result-btn'),
        cancelNotify: document.getElementById('cancel-notify'),
        submitNotify: document.getElementById('submit-notify'),
        finishNotify: document.getElementById('finish-notify')
    };

    const modal = document.getElementById('notify-modal');
    const consentCheck = document.getElementById('consent-check');
    const notifyStep1 = document.getElementById('notify-step-1');
    const notifyStep2 = document.getElementById('notify-step-2');

    // Notification Modal Logic
    buttons.closeResult.addEventListener('click', () => {
        // If the user was ineligible, show the notification pop-up instead of just closing
        modal.classList.add('active');
    });

    buttons.cancelNotify.addEventListener('click', () => {
        modal.classList.remove('active');
        location.reload(); // Refresh the app
    });

    consentCheck.addEventListener('change', () => {
        if (consentCheck.checked) {
            buttons.submitNotify.classList.remove('disabled');
            buttons.submitNotify.disabled = false;
        } else {
            buttons.submitNotify.classList.add('disabled');
            buttons.submitNotify.disabled = true;
        }
    });

    buttons.submitNotify.addEventListener('click', () => {
        notifyStep1.style.display = 'none';
        notifyStep2.style.display = 'block';
    });

    buttons.finishNotify.addEventListener('click', () => {
        modal.classList.remove('active');
        location.reload();
    });

    const langSelect = document.getElementById('lang-select');

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
    }

    langSelect.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });

    // Default to Korean
    updateLanguage('ko');

    const inputs = {
        name: document.getElementById('user-name'),
        rrn1: document.getElementById('rrn-1'),
        rrn2: document.getElementById('rrn-2'),
        visa: document.getElementById('visa-type')
    };

    const visaButtons = document.querySelectorAll('.visa-btn');
    const displayName = document.getElementById('display-name');

    // Navigation function
    function showPage(pageId) {
        Object.values(pages).forEach(page => page.classList.remove('active'));
        pages[pageId].classList.add('active');
    }

    // Visa Selection Logic
    visaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            visaButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            inputs.visa.value = btn.dataset.value;
            validateInputs();
        });
    });

    // Input Validation
    function validateInputs() {
        const isNameValid = inputs.name.value.trim().length >= 2;
        const isRrn1Valid = inputs.rrn1.value.length === 6;
        const isRrn2Valid = inputs.rrn2.value.length === 7;
        const isVisaValid = inputs.visa.value !== '';

        if (isNameValid && isRrn1Valid && isRrn2Valid && isVisaValid) {
            buttons.check.classList.remove('disabled');
            buttons.check.disabled = false;
        } else {
            buttons.check.classList.add('disabled');
            buttons.check.disabled = true;
        }
    }

    [inputs.name, inputs.rrn1, inputs.rrn2].forEach(el => {
        el.addEventListener('input', validateInputs);
    });

    // Auto-capitalize name input
    inputs.name.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });

    // Event Listeners
    buttons.start.addEventListener('click', () => {
        showPage('input');
    });

    buttons.backToLanding.addEventListener('click', () => {
        showPage('landing');
    });

    buttons.check.addEventListener('click', async () => {
        const userName = inputs.name.value;
        const visa = inputs.visa.value;

        document.getElementById('display-name-neg').textContent = userName;
        document.getElementById('display-name-pos').textContent = userName;

        showPage('loading');

        // Simulate Loading Steps
        await simulateLoading();

        // simulateLoading() already called above

        // result logic
        // As per request: For D-2 and D-4 visa holders, always fail for this demo.
        if (visa === 'D-2' || visa === 'D-4') {
            document.getElementById('display-visa').textContent = visa === 'D-2' ? 'D-2 유학 비자' : 'D-4 일반연수 비자';
            showPage('resultNegative');
        } else {
            showPage('resultPositive');
        }
    });

    async function simulateLoading() {
        const step1 = document.getElementById('step-1');
        const step2 = document.getElementById('step-2');
        const step3 = document.getElementById('step-3');

        // Reset steps
        [step1, step2, step3].forEach(s => {
            s.classList.remove('done');
            s.classList.add('pending');
        });

        await wait(1500);
        step1.classList.replace('pending', 'done');

        await wait(1800);
        step2.classList.replace('pending', 'done');

        await wait(1200);
        step3.classList.replace('pending', 'done');

        await wait(800);
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Number input limits
    inputs.rrn1.addEventListener('input', (e) => {
        if (e.target.value.length > 6) e.target.value = e.target.value.slice(0, 6);
    });
    inputs.rrn2.addEventListener('input', (e) => {
        if (e.target.value.length > 7) e.target.value = e.target.value.slice(0, 7);
    });
});
