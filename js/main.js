/**
 * AGRINHO 2026 - Main JavaScript
 * General utilities and initialization
 */

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Log initialization
console.log('✅ Agrinho 2026 - Simulador de Fazenda Sustentável carregado com sucesso');
console.log('Tecnologias: HTML5 Semântico + CSS3 + JavaScript Vanilla');
console.log('Sem frameworks ou dependências externas');
