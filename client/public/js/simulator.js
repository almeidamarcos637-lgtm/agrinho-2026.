// ===== SIMULATOR LOGIC =====

// Game State
const gameState = {
    mode: 'normal',
    decisions: {
        energia: false,
        irrigacao: false,
        organico: false,
        reflorestamento: false
    },
    lucro: 50,
    ambiente: 50,
    score: 0,
    achievements: []
};

// Decision Definitions
const decisions = [
    {
        id: 'energia',
        title: 'Energia Solar',
        icon: '☀️',
        description: 'Instale painéis solares para reduzir custos de energia',
        lucroImpact: 15,
        ambienteImpact: 20
    },
    {
        id: 'irrigacao',
        title: 'Irrigação de Precisão',
        icon: '💧',
        description: 'Use sistemas de irrigação inteligentes para economizar água',
        lucroImpact: 10,
        ambienteImpact: 15
    },
    {
        id: 'organico',
        title: 'Cultivos Orgânicos',
        icon: '🌱',
        description: 'Elimine pesticidas e cultive de forma orgânica',
        lucroImpact: 5,
        ambienteImpact: 25
    },
    {
        id: 'reflorestamento',
        title: 'Restauração Florestal',
        icon: '🌳',
        description: 'Reflorestar áreas degradadas da fazenda',
        lucroImpact: 0,
        ambienteImpact: 30
    }
];

// Achievements
const achievements = [
    {
        id: 'equilibrista',
        title: 'Equilibrista',
        icon: '⚖️',
        condition: (lucro, ambiente) => Math.abs(lucro - ambiente) <= 10,
        description: 'Equilibre lucro e ambiente (diferença ≤ 10%)'
    },
    {
        id: 'campeao-verde',
        title: 'Campeão Verde',
        icon: '🏆',
        condition: (lucro, ambiente) => ambiente >= 80,
        description: 'Alcance 80%+ de saúde ambiental'
    },
    {
        id: 'mestre-lucro',
        title: 'Mestre do Lucro',
        icon: '💰',
        condition: (lucro, ambiente) => lucro >= 80,
        description: 'Alcance 80%+ de lucro'
    },
    {
        id: 'vencedor-desafio',
        title: 'Vencedor do Desafio',
        icon: '🥇',
        condition: (lucro, ambiente, mode) => mode === 'desafio' && lucro >= 80 && ambiente >= 80,
        description: 'Vença o Modo Desafio com 80%+ em ambos'
    }
];

// Initialize Simulator
function initSimulator() {
    renderDecisions();
    setupEventListeners();
    updateMeters();
}

// Render Decision Cards
function renderDecisions() {
    const grid = document.getElementById('decisionsGrid');
    grid.innerHTML = '';

    decisions.forEach(decision => {
        const card = document.createElement('div');
        card.className = 'decision-card';
        card.dataset.id = decision.id;
        card.innerHTML = `
            <div class="decision-icon">${decision.icon}</div>
            <div class="decision-title">${decision.title}</div>
            <div class="decision-description">${decision.description}</div>
        `;

        card.addEventListener('click', () => toggleDecision(decision.id, card));
        grid.appendChild(card);
    });
}

// Toggle Decision Selection
function toggleDecision(id, cardElement) {
    gameState.decisions[id] = !gameState.decisions[id];
    cardElement.classList.toggle('selected');
    updateMeters();
}

// Update Meters
function updateMeters() {
    let lucroBonus = 0;
    let ambienteBonus = 0;

    Object.keys(gameState.decisions).forEach(key => {
        if (gameState.decisions[key]) {
            const decision = decisions.find(d => d.id === key);
            lucroBonus += decision.lucroImpact;
            ambienteBonus += decision.ambienteImpact;
        }
    });

    gameState.lucro = Math.min(100, 50 + lucroBonus);
    gameState.ambiente = Math.min(100, 50 + ambienteBonus);

    // Update UI
    document.getElementById('lucroValue').textContent = `R$ ${Math.round(gameState.lucro * 1000)}`;
    document.getElementById('ambienteValue').textContent = `${gameState.ambiente}%`;
    document.getElementById('lucroMeter').style.width = `${gameState.lucro}%`;
    document.getElementById('ambienteMeter').style.width = `${gameState.ambiente}%`;
}

// Calculate Result
function calculateResult() {
    // Calculate score
    gameState.score = Math.round((gameState.lucro + gameState.ambiente) / 2);

    // Check achievements
    gameState.achievements = [];
    achievements.forEach(achievement => {
        if (achievement.condition(gameState.lucro, gameState.ambiente, gameState.mode)) {
            gameState.achievements.push(achievement);
        }
    });

    // Show result modal
    showResultModal();
}

// Show Result Modal
function showResultModal() {
    const modal = document.getElementById('resultModal');
    document.getElementById('resultLucro').textContent = `R$ ${Math.round(gameState.lucro * 1000)}`;
    document.getElementById('resultAmbiente').textContent = `${gameState.ambiente}%`;
    document.getElementById('resultScore').textContent = gameState.score;

    // Show achievements
    const achievementsContainer = document.getElementById('achievementsContainer');
    achievementsContainer.innerHTML = '';
    if (gameState.achievements.length > 0) {
        const title = document.createElement('h4');
        title.textContent = 'Conquistas Desbloqueadas! 🎉';
        achievementsContainer.appendChild(title);
        gameState.achievements.forEach(achievement => {
            const div = document.createElement('div');
            div.className = 'achievement';
            div.innerHTML = `
                <span class="achievement-icon">${achievement.icon}</span>
                <strong>${achievement.title}</strong>
                <p>${achievement.description}</p>
            `;
            achievementsContainer.appendChild(div);
        });
    }

    modal.classList.add('active');
}

// Save Score to LocalStorage
function saveScore() {
    const scores = JSON.parse(localStorage.getItem('agrinho_scores') || '[]');
    scores.push({
        score: gameState.score,
        lucro: gameState.lucro,
        ambiente: gameState.ambiente,
        mode: gameState.mode,
        date: new Date().toLocaleDateString('pt-BR'),
        achievements: gameState.achievements.map(a => a.id)
    });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10); // Keep only top 10
    localStorage.setItem('agrinho_scores', JSON.stringify(scores));
    updateRanking();
    showNotification('Pontuação salva com sucesso!');
}

// Update Ranking
function updateRanking() {
    const scores = JSON.parse(localStorage.getItem('agrinho_scores') || '[]');
    const table = document.getElementById('rankingTable');

    if (scores.length === 0) {
        table.innerHTML = '<div class="ranking-empty">Nenhuma pontuação salva ainda. Jogue agora!</div>';
        return;
    }

    table.innerHTML = '';
    scores.forEach((score, index) => {
        const row = document.createElement('div');
        row.className = 'ranking-row';
        const position = index + 1;
        let positionClass = '';
        if (position === 1) positionClass = 'top-1';
        else if (position === 2) positionClass = 'top-2';
        else if (position === 3) positionClass = 'top-3';

        row.innerHTML = `
            <div class="ranking-position ${positionClass}">#${position}</div>
            <div>
                <strong>${score.score} pontos</strong>
                <br>
                <small>${score.date} - ${score.mode === 'desafio' ? 'Desafio' : 'Normal'}</small>
            </div>
            <div>Lucro: <strong>${score.lucro}%</strong></div>
            <div>Ambiente: <strong>${score.ambiente}%</strong></div>
        `;
        table.appendChild(row);
    });
}

// Reset Game
function resetGame() {
    gameState.decisions = {
        energia: false,
        irrigacao: false,
        organico: false,
        reflorestamento: false
    };
    gameState.lucro = 50;
    gameState.ambiente = 50;
    gameState.score = 0;
    gameState.achievements = [];

    document.querySelectorAll('.decision-card').forEach(card => {
        card.classList.remove('selected');
    });

    updateMeters();
    document.getElementById('resultModal').classList.remove('active');
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2d8659;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideUp 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Mode Selection
    document.getElementById('normalMode').addEventListener('click', () => {
        gameState.mode = 'normal';
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('normalMode').classList.add('active');
        resetGame();
    });

    document.getElementById('desafioMode').addEventListener('click', () => {
        gameState.mode = 'desafio';
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('desafioMode').classList.add('active');
        resetGame();
    });

    // Buttons
    document.getElementById('calcularBtn').addEventListener('click', calculateResult);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('resultModal').classList.remove('active');
    });
    document.getElementById('saveScoreBtn').addEventListener('click', saveScore);

    // Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initSimulator();
    updateRanking();
});
