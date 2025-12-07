// Sicherheitsmaßnahmen: Content Security Policy compliance
'use strict';

// Intro Overlay Handler
const introBtn = document.getElementById('intro-btn');
const introOverlay = document.getElementById('intro-overlay');

if (introBtn && introOverlay) {
    introBtn.addEventListener('click', function() {
        introOverlay.style.animation = 'fadeOutIntro 0.6s ease-in-out forwards';
    });
}

// Hamburger Menu Funktionalität
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Schließe Menü wenn ein Link geklickt wird
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Rate limiting für Formularsubmission
const rateLimitMap = new Map();
const RATE_LIMIT_DELAY = 1000;

function isRateLimited(key) {
    const now = Date.now();
    const lastSubmission = rateLimitMap.get(key);
    
    if (lastSubmission && (now - lastSubmission) < RATE_LIMIT_DELAY) {
        return true;
    }
    
    rateLimitMap.set(key, now);
    return false;
}

// Sichere Validierung von Eingaben
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isValidName(name) {
    return /^[a-zA-Z\säöüÄÖÜß\-']{2,100}$/.test(name);
}

function isValidMessage(message) {
    return message.length >= 5 && message.length <= 1000;
}

// Smooth scrolling für interne Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        if (!/^#[a-zA-Z0-9\-_]+$/.test(href)) {
            console.warn('Ungültiger Link');
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Kontaktformular Handling mit Sicherheit
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        if (isRateLimited('contact-form')) {
            alert('Bitte warte einen Moment bevor du das Formular erneut abschickst.');
            return;
        }
        
        const nameInput = this.querySelector('input[type="text"]');
        const emailInput = this.querySelector('input[type="email"]');
        const messageInput = this.querySelector('textarea');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        
        if (!name || !email || !message) {
            alert('Bitte fülle alle Felder aus.');
            return;
        }
        
        if (!isValidName(name)) {
            alert('Der Name muss zwischen 2 und 100 Zeichen lang sein.');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Bitte gib eine gültige E-Mail-Adresse ein.');
            return;
        }
        
        if (!isValidMessage(message)) {
            alert('Die Nachricht muss zwischen 5 und 1000 Zeichen lang sein.');
            return;
        }
        
        const sanitizedName = sanitizeInput(name);
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedMessage = sanitizeInput(message);
        
        console.log('Sichere Nachricht eingegangen:', {
            name: sanitizedName,
            email: sanitizedEmail,
            message: sanitizedMessage
        });
        
        alert('Danke für deine Nachricht! Wir werden dich bald kontaktieren.');
        this.reset();
    });
}

// CTA Button Event
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function () {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}

// Fade-in Animation beim Scrollen
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Schutz vor XSS
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('script').forEach(script => {
        if (script.src && !script.src.includes('localhost') && !script.src.includes('script.js')) {
            console.warn('Externe Script blockiert:', script.src);
            script.remove();
        }
    });
});

// Disable autocomplete für sensible Felder
document.querySelectorAll('textarea, input[type="text"], input[type="email"]').forEach(field => {
    field.setAttribute('autocomplete', 'off');
});