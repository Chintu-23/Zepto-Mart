// Login.js - backend friendly, show password working

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-data');
    const userInput = document.getElementById('username-input');
    const passInput = document.getElementById('pass');

    const userError = document.getElementById('uError');
    const passError = document.getElementById('pError');

    const toggleLoginPass = document.getElementById('toggle-login-pass');

    function setError(inputElement, errorElement, message) {
        errorElement.textContent = message;
        inputElement.classList.add('is-invalid');
        return false;
    }

    function clearError(inputElement, errorElement) {
        errorElement.textContent = '';
        inputElement.classList.remove('is-invalid');
        return true;
    }

    function validateUsernameOrEmail() {
        const value = userInput.value.trim();
        if (value === '') {
            return setError(userInput, userError, 'Username or Email cannot be empty.');
        }
        if (value.length < 2) {
            return setError(userInput, userError, 'Input must be at least 2 characters.');
        }
        return clearError(userInput, userError);
    }

    function validatePassword() {
        const value = passInput.value.trim();
        if (value === '') {
            return setError(passInput, passError, 'Password cannot be empty.');
        }
        if (value.length < 8) {
            return setError(passInput, passError, 'Password seems too short.');
        }
        return clearError(passInput, passError);
    }

    // Show / hide password
    if (toggleLoginPass) {
        toggleLoginPass.addEventListener('change', () => {
            passInput.type = toggleLoginPass.checked ? 'text' : 'password';
        });
    }

    form.addEventListener('submit', (e) => {
        const isUserValid = validateUsernameOrEmail();
        const isPassValid = validatePassword();

        if (!isUserValid || !isPassValid) {
            e.preventDefault();  // stop only if invalid
        }
        // if valid → normal POST to /login handled by LoginServlet
    });

    userInput.addEventListener('blur', validateUsernameOrEmail);
    passInput.addEventListener('blur', validatePassword);
});
