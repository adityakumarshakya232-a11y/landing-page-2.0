// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Real-time validation for better user experience
    nameInput.addEventListener('input', function() {
        validateName(this.value);
    });
    
    emailInput.addEventListener('input', function() {
        validateEmail(this.value);
    });
    
    passwordInput.addEventListener('input', function() {
        validatePassword(this.value);
    });
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Get values
        let name = nameInput.value.trim();
        let email = emailInput.value.trim();
        let password = passwordInput.value.trim();
        
        // Validate all fields
        isValid = validateName(name) && isValid;
        isValid = validateEmail(email) && isValid;
        isValid = validatePassword(password) && isValid;
        
        // If all valid, show success modal
        if (isValid) {
            showSuccessModal(name);
            form.reset();
            clearAllErrors();
            removeValidationClasses();
        }
    });
    
    // Name validation function
    function validateName(name) {
        const nameError = document.getElementById('nameError');
        const nameField = document.getElementById('name');
        
        if (name === "") {
            nameError.innerText = "Name is required";
            nameField.classList.add('error');
            nameField.classList.remove('valid');
            return false;
        } else if (name.length < 2) {
            nameError.innerText = "Name must be at least 2 characters";
            nameField.classList.add('error');
            nameField.classList.remove('valid');
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            nameError.innerText = "Name can only contain letters and spaces";
            nameField.classList.add('error');
            nameField.classList.remove('valid');
            return false;
        } else {
            nameError.innerText = "";
            nameField.classList.remove('error');
            nameField.classList.add('valid');
            return true;
        }
    }
    
    // Email validation function
    function validateEmail(email) {
        const emailError = document.getElementById('emailError');
        const emailField = document.getElementById('email');
        // More comprehensive email pattern
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (email === "") {
            emailError.innerText = "Email is required";
            emailField.classList.add('error');
            emailField.classList.remove('valid');
            return false;
        } else if (!emailPattern.test(email)) {
            emailError.innerText = "Enter a valid email (e.g., name@example.com)";
            emailField.classList.add('error');
            emailField.classList.remove('valid');
            return false;
        } else {
            emailError.innerText = "";
            emailField.classList.remove('error');
            emailField.classList.add('valid');
            return true;
        }
    }
    
    // Password validation function
    function validatePassword(password) {
        const passwordError = document.getElementById('passwordError');
        const passwordField = document.getElementById('password');
        
        if (password === "") {
            passwordError.innerText = "Password is required";
            passwordField.classList.add('error');
            passwordField.classList.remove('valid');
            return false;
        } else if (password.length < 6) {
            passwordError.innerText = "Password must be at least 6 characters";
            passwordField.classList.add('error');
            passwordField.classList.remove('valid');
            return false;
        } else if (password.length > 20) {
            passwordError.innerText = "Password must be less than 20 characters";
            passwordField.classList.add('error');
            passwordField.classList.remove('valid');
            return false;
        } else {
            passwordError.innerText = "";
            passwordField.classList.remove('error');
            passwordField.classList.add('valid');
            return true;
        }
    }
    
    // Show success modal with animation
    function showSuccessModal(userName) {
        const modal = document.getElementById('successModal');
        const modalMessage = modal.querySelector('.modal-message');
        
        // Update modal message with user's name
        if (userName) {
            modalMessage.innerHTML = `Welcome ${userName}! 🎉<br>Your account has been created successfully.`;
        } else {
            modalMessage.innerHTML = `Welcome aboard! 🎉<br>Your account has been created successfully.`;
        }
        
        // Show modal
        modal.style.display = 'block';
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }
    
    // Clear all error messages
    function clearAllErrors() {
        document.getElementById('nameError').innerText = "";
        document.getElementById('emailError').innerText = "";
        document.getElementById('passwordError').innerText = "";
    }
    
    // Remove validation classes from inputs
    function removeValidationClasses() {
        const inputs = ['name', 'email', 'password'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            input.classList.remove('error', 'valid');
        });
    }
});

// Global close modal function
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add some additional features
document.addEventListener('DOMContentLoaded', function() {
    // Add input focus effects
    const inputs = document.querySelectorAll('.input-field input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Add password strength indicator (optional enhancement)
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = getPasswordStrength(password);
            updatePasswordStrengthIndicator(strength);
        });
    }
});

// Password strength checker (optional feature)
function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
}

function updatePasswordStrengthIndicator(strength) {
    const passwordField = document.getElementById('password');
    const strengthColors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71'];
    const strengthTexts = ['Weak', 'Fair', 'Good', 'Strong'];
    
    if (strength > 0) {
        let indicator = document.querySelector('.password-strength');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'password-strength';
            indicator.style.marginTop = '5px';
            indicator.style.fontSize = '11px';
            passwordField.parentElement.parentElement.appendChild(indicator);
        }
        
        indicator.style.color = strengthColors[strength - 1];
        indicator.textContent = `Password strength: ${strengthTexts[strength - 1]}`;
        
        if (strength === 4) {
            indicator.textContent = 'Password strength: Excellent! ✓';
        }
    }
}
