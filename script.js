// ============================================
// GLOBAL VARIABLES
// ============================================
let currentUser = null;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuth();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize statistics counter
    initStatsCounter();
    
    // Initialize contact form
    initContactForm();
    
    // Load user data on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardData();
    }
});

// ============================================
// NAVBAR FUNCTIONS
// ============================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        if (menu.style.display === 'flex') {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'flex';
        }
    }
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        
        // Update navbar buttons for authenticated users
        const navButtons = document.getElementById('navButtons');
        if (navButtons && !window.location.pathname.includes('dashboard.html')) {
            navButtons.innerHTML = `
                <a href="dashboard.html" class="btn-primary">Dashboard</a>
                <button onclick="logout()" class="btn-outline">Logout</button>
            `;
        }
    }
}

function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showToast('Login successful! Welcome back!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        return true;
    } else {
        showToast('Invalid email or password', 'error');
        return false;
    }
}

function signup(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
        showToast('User already exists with this email', 'error');
        return false;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showToast('Account created successfully! Welcome!', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
    return true;
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// ============================================
// LOGIN PAGE HANDLERS
// ============================================
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        login(email, password);
    });
}

function fillDemoCredentials() {
    document.getElementById('loginEmail').value = 'demo@nexusai.com';
    document.getElementById('loginPassword').value = 'demo123';
    showToast('Demo credentials filled!', 'success');
}

// ============================================
// SIGNUP PAGE HANDLERS
// ============================================
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        // Validation
        if (name.length < 2) {
            showToast('Name must be at least 2 characters', 'error');
            return;
        }
        
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        signup(name, email, password);
    });
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text';
    } else {
        field.type = 'password';
    }
}

// ============================================
// DASHBOARD FUNCTIONS
// ============================================
function loadDashboardData() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user name
    const userNameSpan = document.getElementById('userName');
    if (userNameSpan) userNameSpan.textContent = user.name;
    
    const dashboardUserName = document.getElementById('dashboardUserName');
    if (dashboardUserName) dashboardUserName.textContent = user.name;
    
    const dashboardUserEmail = document.getElementById('dashboardUserEmail');
    if (dashboardUserEmail) dashboardUserEmail.textContent = user.email;
    
    // Update current date
    const currentDateSpan = document.getElementById('currentDate');
    if (currentDateSpan) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateSpan.textContent = new Date().toLocaleDateString('en-US', options);
    }
    
    // Update stats with animation
    animateNumber('statVisits', 1247);
    animateNumber('statConversions', 89);
    animateNumber('statRevenue', 12450, true);
    animateNumber('statEngagement', 78);
}

function animateNumber(elementId, targetValue, isCurrency = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            if (isCurrency) {
                element.textContent = `$${Math.round(targetValue).toLocaleString()}`;
            } else if (targetValue === 78) {
                element.textContent = `${Math.round(targetValue)}%`;
            } else {
                element.textContent = Math.round(targetValue).toLocaleString();
            }
            clearInterval(timer);
        } else {
            if (isCurrency) {
                element.textContent = `$${Math.round(current).toLocaleString()}`;
            } else if (targetValue === 78) {
                element.textContent = `${Math.round(current)}%`;
            } else {
                element.textContent = Math.round(current).toLocaleString();
            }
        }
    }, 20);
}

function showNotification() {
    showToast('No new notifications', 'success');
}

function showSettings() {
    showToast('Settings feature coming soon!', 'success');
}

// ============================================
// STATS COUNTER (Landing Page)
// ============================================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.getAttribute('data-target'));
                    let current = 0;
                    const increment = target / 50;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            element.textContent = target === 99 ? '99.9%' : target + (target === 10000 ? '+' : '%');
                            clearInterval(timer);
                        } else {
                            element.textContent = Math.floor(current) + (target === 99 ? '.9%' : target === 10000 ? '+' : '%');
                        }
                    }, 30);
                    
                    observer.unobserve(element);
                }
            });
        });
        
        statNumbers.forEach(num => observer.observe(num));
    }
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            
            // Save to localStorage
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push({
                id: Date.now(),
                name: name,
                email: email,
                message: message,
                date: new Date().toISOString()
            });
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// DEMO VIDEO
// ============================================
function showDemo() {
    showToast('Demo video coming soon!', 'success');
}

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});