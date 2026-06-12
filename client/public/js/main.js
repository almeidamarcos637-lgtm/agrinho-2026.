// ===== MAIN UTILITIES =====

// Smooth Scroll for Navigation Links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Console Message
console.log('%c🌱 Agrinho 2026 - Simulador de Fazenda Sustentável', 'color: #2d8659; font-size: 16px; font-weight: bold;');
console.log('%cDesenvolvido com HTML5, CSS3 e JavaScript Vanilla', 'color: #003d7a; font-size: 12px;');
console.log('%cTema: Agricultura Sustentável | Concurso: Agrinho 2026', 'color: #f39c12; font-size: 12px;');
