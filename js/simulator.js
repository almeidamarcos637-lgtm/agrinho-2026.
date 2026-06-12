/**
 * AGRINHO 2026 - Simulator Logic
 * Vanilla JavaScript - No frameworks
 * Manages game state, decisions, and scoring
 */

// Game State
let gameState = {
    mode: null, // 'normal' or 'challenge'
    profit: 0,
    environment: 0,
    decisions: [],
    currentDecision: 0,
    totalDecisions: 0,
    achievements: [],
    gameActive: false
};

// Decision Data
const decisions = [
    {
        id: 'solar',
        icon: '☀️',
        title: 'Energia Solar',
        description: 'Instale painéis solares para reduzir custos energéticos',
        effects: {
            profit: 15,
            environment: 20
        }
    },
    {
        id: 'irrigation',
        icon: '💧',
        title: 'Irrigação Eficiente',
        description: 'Implemente sistema de irrigação por gotejamento',
        effects: {
            profit: 10,
            environment: 15
        }
    },
    {
        id: 'organic',
        icon: '🌿',
        title: 'Agricultura Orgânica',
        description: 'Adote práticas de cultivo orgânico sem pesticidas',
        effects: {
            profit: 5,
            environment: 25
        }
    },
    {
        id: 'reforestation',
        icon: '🌳',
        title: 'Reflorestamento',
        description: 'Plante árvores nativas para combater mudanças climáticas',
        effects: {
            profit: -5,
            environment: 30
        }
    }
];

// Achievements
const achievements = [
    {
        id: 'balanced',
        icon: '⚖️',
        title: 'Equilibrista',
        description: 'Atingir 70%+ em lucro E ambiente',
        condition: (state) => state.profit >= 70 && state.environment >= 70
    },
    {
        id: 'green_champion',
        icon: '🌍',
        title: 'Campeão Verde',
        description: 'Atingir 90%+ em saúde ambiental',
        condition: (state) => state.environment >= 90
    },
    {
        id: 'profit_master',
        icon: '💰',
        title: 'Mestre do Lucro',
        description: 'Atingir 90%+ em lucro da fazenda',
        condition: (state) => state.profit >= 90
    },
    {
        id: 'challenge_winner',
        icon: '🏆',
        title: 'Vencedor do Desafio',
        description: 'Completar Modo Desafio com sucesso',
        condition: (state) => state.mode === 'challenge' && state.profit >= 80 && state.environment >= 80
    }
];

/**
 * Start simulator in normal or challenge mode
 */
function startSimulator(mode) {
    gameState.mode = mode;
    gameState.profit = 0;
    gameState.environment = 0;
    gameState.decisions = [];
    gameState.currentDecision = 0;
    gameState.gameActive = true;
    
    if (mode === 'normal') {
        gameState.totalDecisions = 4;
    } else if (mode === 'challenge') {
        gameState.totalDecisions = 5;
    }
    
    // Hide initial state and show simulator
    document.getElementById('simulatorInitial').style.display = 'none';
    document.getElementById('simulatorContainer').style.display = 'block';
    
    // Update mode info
    const modeInfo = document.getElementById('modeInfo');
    if (mode === 'challenge') {
        modeInfo.innerHTML = '<strong>🎯 Modo Desafio:</strong> Você precisa atingir 80%+ em lucro E saúde ambiental em 5 decisões!';
    } else {
        modeInfo.innerHTML = '<strong>📊 Modo Normal:</strong> Explore diferentes combinações de decisões e veja os resultados.';
    }
    
    renderDecisions();
    updateGauges();
}

/**
 * Render decision buttons
 */
function renderDecisions() {
    const grid = document.getElementById('decisionsGrid');
    grid.innerHTML = '';
    
    decisions.forEach((decision, index) => {
        const card = document.createElement('div');
        card.className = 'decision-card';
        card.innerHTML = `
            <div class="decision-icon">${decision.icon}</div>
            <h3>${decision.title}</h3>
            <p>${decision.description}</p>
        `;
        card.onclick = () => makeDecision(index);
        grid.appendChild(card);
    });
}

/**
 * Make a decision and update game state
 */
function makeDecision(decisionIndex) {
    if (!gameState.gameActive) return;
    
    const decision = decisions[decisionIndex];
    gameState.decisions.push(decision.id);
    gameState.currentDecision++;
    
    // Apply effects
    gameState.profit = Math.min(100, Math.max(0, gameState.profit + decision.effects.profit));
    gameState.environment = Math.min(100, Math.max(0, gameState.environment + decision.effects.environment));
    
    // Update UI
    updateGauges();
    showFeedback(decision);
    
    // Check if game is complete
    if (gameState.currentDecision >= gameState.totalDecisions) {
        endGame();
    }
}

/**
 * Update gauge displays
 */
function updateGauges() {
    // Profit gauge
    const profitValue = document.getElementById('profitValue');
    const profitCircle = document.getElementById('profitCircle');
    profitValue.textContent = Math.round(gameState.profit);
    const profitDasharray = (gameState.profit / 100) * 283;
    profitCircle.style.strokeDasharray = `${profitDasharray}, 283`;
    
    // Environment gauge
    const environmentValue = document.getElementById('environmentValue');
    const environmentCircle = document.getElementById('environmentCircle');
    environmentValue.textContent = Math.round(gameState.environment);
    const environmentDasharray = (gameState.environment / 100) * 283;
    environmentCircle.style.strokeDasharray = `${environmentDasharray}, 283`;
}

/**
 * Show feedback for decision
 */
function showFeedback(decision) {
    const feedbackBox = document.getElementById('feedbackBox');
    const profitChange = decision.effects.profit > 0 ? `+${decision.effects.profit}%` : `${decision.effects.profit}%`;
    const envChange = decision.effects.environment > 0 ? `+${decision.effects.environment}%` : `${decision.effects.environment}%`;
    
    feedbackBox.innerHTML = `
        <div>
            <strong>${decision.title}</strong><br>
            Lucro: ${profitChange} | Ambiente: ${envChange}
        </div>
    `;
    
    // Scroll to feedback
    feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * End game and check achievements
 */
function endGame() {
    gameState.gameActive = false;
    
    // Calculate final score
    const finalScore = Math.round((gameState.profit + gameState.environment) / 2);
    
    // Check achievements
    checkAchievements();
    
    // Show results
    const feedbackBox = document.getElementById('feedbackBox');
    let resultMessage = `<strong>🎉 Simulação Completa!</strong><br>`;
    resultMessage += `Lucro: ${Math.round(gameState.profit)}% | Ambiente: ${Math.round(gameState.environment)}%<br>`;
    resultMessage += `Pontuação Final: ${finalScore} pontos`;
    
    if (gameState.mode === 'challenge') {
        if (gameState.profit >= 80 && gameState.environment >= 80) {
            resultMessage += '<br>✅ Desafio Completado com Sucesso!';
        } else {
            resultMessage += '<br>❌ Desafio não completado. Tente novamente!';
        }
    }
    
    feedbackBox.innerHTML = resultMessage;
}

/**
 * Check and unlock achievements
 */
function checkAchievements() {
    achievements.forEach(achievement => {
        if (achievement.condition(gameState) && !gameState.achievements.includes(achievement.id)) {
            gameState.achievements.push(achievement.id);
            saveAchievement(achievement);
        }
    });
    
    renderAchievements();
}

/**
 * Save achievement to localStorage
 */
function saveAchievement(achievement) {
    const saved = JSON.parse(localStorage.getItem('achievements') || '[]');
    if (!saved.includes(achievement.id)) {
        saved.push(achievement.id);
        localStorage.setItem('achievements', JSON.stringify(saved));
    }
}

/**
 * Render achievements section
 */
function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    const savedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    
    grid.innerHTML = '';
    achievements.forEach(achievement => {
        const card = document.createElement('div');
        card.className = `achievement-card ${savedAchievements.includes(achievement.id) ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <h4>${achievement.title}</h4>
            <p class="achievement-description">${achievement.description}</p>
        `;
        grid.appendChild(card);
    });
}

/**
 * Save score to leaderboard
 */
function saveScore() {
    if (!gameState.gameActive && gameState.decisions.length > 0) {
        const finalScore = Math.round((gameState.profit + gameState.environment) / 2);
        
        const scores = JSON.parse(localStorage.getItem('scores') || '[]');
        scores.push({
            score: finalScore,
            profit: Math.round(gameState.profit),
            environment: Math.round(gameState.environment),
            mode: gameState.mode,
            date: new Date().toLocaleDateString('pt-BR'),
            decisions: gameState.decisions
        });
        
        // Keep only top 20 scores
        scores.sort((a, b) => b.score - a.score);
        scores.splice(20);
        
        localStorage.setItem('scores', JSON.stringify(scores));
        renderLeaderboard();
        
        // Show confirmation
        alert(`✅ Pontuação salva! Score: ${finalScore} pontos`);
    }
}

/**
 * Render leaderboard
 */
function renderLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');
    
    if (scores.length === 0) {
        leaderboard.innerHTML = '<p class="empty-state">Nenhuma pontuação registrada ainda. Comece a jogar!</p>';
        return;
    }
    
    scores.sort((a, b) => b.score - a.score);
    
    leaderboard.innerHTML = '';
    scores.forEach((score, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.innerHTML = `
            <div class="leaderboard-rank">#${index + 1}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-score">${score.mode === 'challenge' ? '🎯' : '📊'} ${score.profit}% lucro | ${score.environment}% ambiente</div>
                <div class="leaderboard-date">${score.date}</div>
            </div>
            <div class="leaderboard-points">${score.score} pts</div>
        `;
        leaderboard.appendChild(item);
    });
}

/**
 * Reset simulator
 */
function resetSimulator() {
    document.getElementById('simulatorContainer').style.display = 'none';
    document.getElementById('simulatorInitial').style.display = 'block';
    gameState.gameActive = false;
    gameState.decisions = [];
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderAchievements();
    renderLeaderboard();
});
