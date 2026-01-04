// Sign_up.js - backend friendly (no localStorage), show password works

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-Data');

    const elements = {
        fn: document.getElementById('fn'),
        ln: document.getElementById('ln'),
        pass: document.getElementById('pass'),
        cpass: document.getElementById('cpass'),
        mail: document.getElementById('mail'),
        date: document.getElementById('date')
    };

    const errorElements = {
        fn: document.getElementById('fError'),
        ln: document.getElementById('lError'),
        pass: document.getElementById('pError'),
        cpass: document.getElementById('cError'),
        mail: document.getElementById('mError'),
        date: document.getElementById('dError')
    };

    const toggleSignupPass = document.getElementById('toggle-signup-pass');

    // Show/hide password + confirm password
    if (toggleSignupPass) {
        toggleSignupPass.addEventListener('change', () => {
            const type = toggleSignupPass.checked ? 'text' : 'password';
            elements.pass.type = type;
            elements.cpass.type = type;
        });
    }

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

    // allow space, minLength variable (First: 2, Last: 1)
    function validateName(input, errorElement, fieldName, minLen) {
        const value = input.value.trim();
        const nameRegex = /^[A-Za-z ]+$/; 

        if (value === '') {
            return setError(input, errorElement, `${fieldName} cannot be empty.`);
        }
        if (value.length < minLen) {
            return setError(input, errorElement, `${fieldName} must be at least ${minLen} characters.`);
        }
        if (!nameRegex.test(value)) {
            return setError(input, errorElement, `${fieldName} can only contain letters and spaces.`);
        }
        return clearError(input, errorElement);
    }

    function validatePassword() {
        const input = elements.pass;
        const errorElement = errorElements.pass;
        const value = input.value.trim();
        
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (value === '') {
            return setError(input, errorElement, 'Password cannot be empty.');
        }
        if (value.length < 8) {
            return setError(input, errorElement, 'Password must be at least 8 characters.');
        }
        if (!passRegex.test(value)) {
            return setError(input, errorElement, 'Must include 1 U/L case, 1 number, 1 special char.');
        }
        return clearError(input, errorElement);
    }

    function validateConfirmPassword() {
        const input = elements.cpass;
        const errorElement = errorElements.cpass;
        const value = input.value.trim();
        const passValue = elements.pass.value.trim();

        if (value === '') {
            return setError(input, errorElement, 'Confirm Password cannot be empty.');
        }
        if (passValue !== value) {
            return setError(input, errorElement, 'Passwords do not match.');
        }
        return clearError(input, errorElement);
    }

    function validateEmail() {
        const input = elements.mail;
        const errorElement = errorElements.mail;
        const value = input.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (value === '') {
            return setError(input, errorElement, 'Email cannot be empty.');
        }
        if (!emailPattern.test(value)) {
            return setError(input, errorElement, 'Enter a valid Email ID (e.g., user@domain.com).');
        }
        return clearError(input, errorElement);
    }

    function validateDateOfBirth() {
        const input = elements.date;
        const errorElement = errorElements.date;
        const dateValue = input.value.trim();

        if (dateValue === '') {
            return setError(input, errorElement, 'Date of Birth cannot be empty.');
        }

        const dob = new Date(dateValue);
        const today = new Date();
        const minAgeDate = new Date();
        minAgeDate.setFullYear(today.getFullYear() - 16); 

        if (dob > today) {
             return setError(input, errorElement, 'Date cannot be in the future.');
        }
        if (dob > minAgeDate) {
            return setError(input, errorElement, 'You must be at least 16 years old.');
        }

        return clearError(input, errorElement);
    }

    // MAIN SUBMIT
    form.addEventListener('submit', (e) => {
        const isFnValid   = validateName(elements.fn,   errorElements.fn,   'First Name', 2);
        const isLnValid   = validateName(elements.ln,   errorElements.ln,   'Last Name', 1);
        const isPassValid = validatePassword();
        const isCValid    = validateConfirmPassword();
        const isMailValid = validateEmail();
        const isDateValid = validateDateOfBirth();

        const isFormValid = isFnValid && isLnValid && isPassValid && isCValid && isMailValid && isDateValid;

        if (!isFormValid) {
            e.preventDefault(); // block submit only if invalid
        }
        // if valid => normal submit to /signup (no preventDefault)
    });

    // Blur validations
    elements.fn.addEventListener('blur',   () => validateName(elements.fn, errorElements.fn, 'First Name', 2));
    elements.ln.addEventListener('blur',   () => validateName(elements.ln, errorElements.ln, 'Last Name', 1));
    elements.mail.addEventListener('blur', validateEmail);
    elements.pass.addEventListener('blur', validatePassword);
    elements.cpass.addEventListener('blur', validateConfirmPassword);
    elements.date.addEventListener('blur', validateDateOfBirth);
});
