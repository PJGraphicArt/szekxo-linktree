/* ============================================
   BLACKJACK — Moon Coins | SZEKXO
   ============================================ */

// ── Constantes ──────────────────────────────
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const SUIT_SYMBOLS = {
    hearts:   { symbol: '♥', color: '#e53e3e' },
    diamonds: { symbol: '♦', color: '#e53e3e' },
    clubs:    { symbol: '♣', color: '#1a1a1a' },
    spades:   { symbol: '♠', color: '#1a1a1a' },
};

// ── État du jeu ──────────────────────────────
let gameState = {
    deck:        [],
    playerHand:  [],
    dealerHand:  [],
    balance:     0,
    currentBet:  0,
    status:      'loading', // 'loading' | 'betting' | 'player-turn' | 'dealer-turn' | 'result'
    message:     '',
    messageType: '',
    isLoggedIn:  false,
};

// ── Deck ─────────────────────────────────────
function createDeck() {
    const deck = [];
    SUITS.forEach(suit => {
        RANKS.forEach(rank => {
            deck.push({ suit, rank, id: `${rank}-${suit}-${Math.random()}` });
        });
    });
    return shuffle(deck);
}

function shuffle(deck) {
    const d = [...deck];
    for (let i = d.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [d[i], d[j]] = [d[j], d[i]];
    }
    return d;
}

// ── Calcul des valeurs ───────────────────────
function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.rank)) return 10;
    if (card.rank === 'A') return 11;
    return parseInt(card.rank);
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    hand.forEach(card => {
        if (card.rank === 'A') aces++;
        value += getCardValue(card);
    });
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    return value;
}

// ── Rendu des cartes ─────────────────────────
function createCardElement(card, hidden = false, delay = 0) {
    const el = document.createElement('div');
    el.className = `card card-deal${hidden ? ' card-hidden' : ''}`;
    el.style.animationDelay = `${delay}ms`;

    if (hidden) {
        el.innerHTML = `<div class="card-back"><span>🌙</span></div>`;
    } else {
        const { symbol, color } = SUIT_SYMBOLS[card.suit];
        el.innerHTML = `
            <div class="card-corner card-top-left" style="color:${color}">
                <span class="card-rank">${card.rank}</span>
                <span class="card-suit">${symbol}</span>
            </div>
            <div class="card-center" style="color:${color}">${symbol}</div>
            <div class="card-corner card-bottom-right" style="color:${color}">
                <span class="card-rank">${card.rank}</span>
                <span class="card-suit">${symbol}</span>
            </div>
        `;
    }
    return el;
}

function renderHands(hideDealer = false) {
    const dealerArea = document.getElementById('dealer-cards');
    const playerArea = document.getElementById('player-cards');
    dealerArea.innerHTML = '';
    playerArea.innerHTML = '';

    gameState.dealerHand.forEach((card, i) => {
        const hidden = hideDealer && i === 1;
        dealerArea.appendChild(createCardElement(card, hidden, i * 100));
    });

    gameState.playerHand.forEach((card, i) => {
        playerArea.appendChild(createCardElement(card, false, i * 100));
    });
}

function updateScores(hideDealer = false) {
    const playerVal = calculateHandValue(gameState.playerHand);
    document.getElementById('player-score').textContent =
        gameState.playerHand.length ? playerVal : '';

    if (hideDealer && gameState.dealerHand.length) {
        document.getElementById('dealer-score').textContent =
            getCardValue(gameState.dealerHand[0]);
    } else {
        const dealerVal = calculateHandValue(gameState.dealerHand);
        document.getElementById('dealer-score').textContent =
            gameState.dealerHand.length ? dealerVal : '';
    }
}

// ── UI ────────────────────────────────────────
function showScreen(screen) {
    document.getElementById('screen-login').style.display = screen === 'login' ? 'flex' : 'none';
    document.getElementById('screen-game').style.display  = screen === 'game'  ? 'flex' : 'none';
}

function showControls(phase) {
    document.getElementById('controls-betting').style.display = phase === 'betting' ? 'flex' : 'none';
    document.getElementById('controls-player').style.display  = phase === 'player'  ? 'flex' : 'none';
    document.getElementById('controls-result').style.display  = phase === 'result'  ? 'flex' : 'none';
}

function updateBalance() {
    document.getElementById('balance-display').textContent =
        gameState.balance.toLocaleString('fr-FR');
    document.getElementById('current-bet-display').textContent =
        gameState.currentBet.toLocaleString('fr-FR');

    // Deal button
    const btnDeal = document.getElementById('btn-deal');
    if (btnDeal) btnDeal.disabled = gameState.currentBet === 0;

    // Désactiver chips si solde insuffisant
    [10, 50, 100, 500].forEach(amount => {
        const chip = document.getElementById(`chip-${amount}`);
        if (chip) {
            chip.disabled =
                gameState.balance < amount ||
                gameState.currentBet + amount > Math.min(gameState.balance + gameState.currentBet, 10000);
        }
    });
}

function setMessage(msg, type = '') {
    const el = document.getElementById('game-message');
    el.textContent = msg;
    el.className = `bj-message${type ? ' message-' + type : ''}`;
}

function updateUI() {
    const hideDealer = gameState.status === 'player-turn';
    renderHands(hideDealer);
    updateScores(hideDealer);
    updateBalance();
    setMessage(gameState.message, gameState.messageType);

    const phaseMap = {
        'betting':      'betting',
        'player-turn':  'player',
        'result':       'result',
    };
    showControls(phaseMap[gameState.status] || 'none');
}

// ── Actions de jeu ────────────────────────────
function placeBet(amount) {
    if (gameState.status !== 'betting') return;
    if (gameState.balance < amount) return;
    if (gameState.currentBet + amount > Math.min(gameState.balance + gameState.currentBet, 10000)) return;

    gameState.currentBet += amount;
    gameState.balance    -= amount;
    updateBalance();
}

function resetBet() {
    if (gameState.status !== 'betting') return;
    gameState.balance    += gameState.currentBet;
    gameState.currentBet  = 0;
    updateBalance();
}

async function deal() {
    if (gameState.status !== 'betting' || gameState.currentBet === 0) return;

    document.getElementById('btn-deal').disabled = true;

    try {
        const res = await fetch('/api/blackjack/bet', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ amount: gameState.currentBet }),
        });

        if (!res.ok) {
            const err = await res.json();
            // Rembourser la mise optimiste
            gameState.balance     += gameState.currentBet;
            gameState.currentBet   = 0;
            gameState.messageType  = 'error';
            gameState.message      = err.error || 'Erreur lors de la mise';
            updateBalance();
            setMessage(gameState.message, 'error');
            document.getElementById('btn-deal').disabled = false;
            return;
        }

        const data = await res.json();
        gameState.balance = data.balance; // sync avec DB

    } catch (e) {
        gameState.balance    += gameState.currentBet;
        gameState.currentBet  = 0;
        setMessage('Erreur réseau, réessaie.', 'error');
        document.getElementById('btn-deal').disabled = false;
        updateBalance();
        return;
    }

    // Distribuer les cartes
    if (gameState.deck.length < 10) gameState.deck = createDeck();

    gameState.playerHand = [gameState.deck.pop(), gameState.deck.pop()];
    gameState.dealerHand = [gameState.deck.pop(), gameState.deck.pop()];
    gameState.status     = 'player-turn';
    gameState.message    = '';
    gameState.messageType = '';

    updateUI();

    // Blackjack naturel ?
    if (calculateHandValue(gameState.playerHand) === 21) {
        setTimeout(() => handleStand(), 700);
    }
}

async function handleHit() {
    if (gameState.status !== 'player-turn') return;

    gameState.playerHand.push(gameState.deck.pop());
    const value = calculateHandValue(gameState.playerHand);
    updateUI();

    if (value > 21) {
        gameState.status      = 'result';
        gameState.message     = '💥 Bust ! Le dealer gagne.';
        gameState.messageType = 'lose';
        updateUI();
        await submitResult('lose', 0);
    } else if (value === 21) {
        setTimeout(() => handleStand(), 400);
    }
}

async function handleStand() {
    if (gameState.status !== 'player-turn') return;
    gameState.status = 'dealer-turn';

    // Révéler la carte cachée du dealer
    renderHands(false);
    updateScores(false);
    showControls('none');

    await dealerDraw();
}

async function dealerDraw() {
    const dealerValue = calculateHandValue(gameState.dealerHand);

    if (dealerValue < 17) {
        await pause(820);
        gameState.dealerHand.push(gameState.deck.pop());
        renderHands(false);
        updateScores(false);
        await dealerDraw();
        return;
    }

    // Déterminer le résultat
    const playerValue         = calculateHandValue(gameState.playerHand);
    const isNaturalBlackjack  = gameState.playerHand.length === 2 && playerValue === 21;

    let outcome, payout, message, msgType;

    if (dealerValue > 21) {
        outcome = 'win';
        payout  = gameState.currentBet * 2;
        message = '🎉 Dealer bust ! Vous gagnez !';
        msgType = 'win';
    } else if (isNaturalBlackjack && dealerValue !== 21) {
        outcome = 'blackjack';
        payout  = Math.floor(gameState.currentBet * 2.5);
        message = '🌙 Blackjack naturel ! ×2.5 !';
        msgType = 'blackjack';
    } else if (playerValue > dealerValue) {
        outcome = 'win';
        payout  = gameState.currentBet * 2;
        message = '🎉 Vous gagnez !';
        msgType = 'win';
    } else if (playerValue < dealerValue) {
        outcome = 'lose';
        payout  = 0;
        message = '😞 Le dealer gagne.';
        msgType = 'lose';
    } else {
        outcome = 'push';
        payout  = gameState.currentBet;
        message = '🤝 Égalité — mise remboursée.';
        msgType = 'push';
    }

    gameState.status      = 'result';
    gameState.message     = message;
    gameState.messageType = msgType;
    updateUI();

    await submitResult(outcome, payout);
}

async function submitResult(outcome, payout) {
    try {
        const res = await fetch('/api/blackjack/result', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ outcome, bet: gameState.currentBet, payout }),
        });

        if (res.ok) {
            const data = await res.json();
            gameState.balance = data.balance;
            updateBalance();
        }
    } catch (e) {
        console.error('Erreur submitResult:', e);
    }
}

function startNewGame() {
    gameState.playerHand  = [];
    gameState.dealerHand  = [];
    gameState.currentBet  = 0;
    gameState.message     = '';
    gameState.messageType = '';
    gameState.status      = 'betting';
    if (gameState.deck.length < 10) gameState.deck = createDeck();
    updateUI();
}

// ── Utilitaire ────────────────────────────────
function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Initialisation ────────────────────────────
async function init() {
    try {
        const res = await fetch('/api/blackjack/balance');

        if (res.status === 401) {
            showScreen('login');
            return;
        }

        if (!res.ok) {
            showScreen('login');
            return;
        }

        const data = await res.json();
        gameState.balance    = data.balance;
        gameState.isLoggedIn = true;
        gameState.status     = 'betting';
        gameState.deck       = createDeck();

        showScreen('game');
        updateUI();

    } catch (e) {
        console.error('Erreur init blackjack:', e);
        showScreen('login');
    }
}

document.addEventListener('DOMContentLoaded', init);
