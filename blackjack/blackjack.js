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

const STAGGER         = 220; // ms entre chaque carte
const SPRING_DURATION = 420; // ms pour l'animation spring

// ── Système de son ───────────────────────────
const CARD_SOUNDS = Array.from({ length: 8 }, (_, i) => {
    const a = new Audio(`/sounds/cardSlide${i + 1}.wav`);
    a.volume = 0.32;
    return a;
});

let soundEnabled = true;

// Un seul son par "salve" de cartes (ex: deal initial = 4 cartes)
let _soundPending = false;

function playCardSound() {
    if (!soundEnabled) return;
    if (_soundPending) return; // déjà un son prévu dans cette salve
    _soundPending = true;
    setTimeout(() => { _soundPending = false; }, 180); // fenêtre anti-doublon

    const snd = CARD_SOUNDS[Math.floor(Math.random() * CARD_SOUNDS.length)];
    snd.currentTime = 0;
    snd.play().catch(() => {});
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('btn-sound-toggle');
    if (btn) {
        btn.textContent = soundEnabled ? '🔊' : '🔇';
        btn.classList.toggle('muted', !soundEnabled);
    }
}

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

// ── Spring animation ─────────────────────────
// cubic-bezier(0.34, 1.56, 0.64, 1) reproduit stiffness:100, damping:15
function animateCardSpring(el, delay = 0) {
    el.style.transform = 'translateY(-180px) translateX(80px) rotate(30deg)';
    el.style.opacity   = '0';
    el.style.transition = 'none';

    setTimeout(() => {
        void el.offsetWidth; // force reflow
        el.style.transition = `transform ${SPRING_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 220ms ease`;
        el.style.transform  = 'none';
        el.style.opacity    = '1';
        playCardSound();
    }, delay);
}

// ── Rendu des cartes ─────────────────────────
function buildCardInner(card) {
    const { symbol, color } = SUIT_SYMBOLS[card.suit];
    return `
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

function createCardElement(card, hidden = false, delay = 0) {
    if (hidden) {
        // Flip wrapper : front = dos de carte, back = face de la carte
        const wrapper = document.createElement('div');
        wrapper.className = 'card-flip-wrapper';

        const inner = document.createElement('div');
        inner.className = 'card-flip-inner';

        // Face visible initialement (dos)
        const front = document.createElement('div');
        front.className = 'card card-face card-face-front';
        front.innerHTML = `<div class="card-back"><span>🌙</span></div>`;

        // Face cachée (valeur réelle, révélée au flip)
        const back = document.createElement('div');
        back.className = 'card card-face card-face-back';
        back.innerHTML = buildCardInner(card);

        inner.appendChild(front);
        inner.appendChild(back);
        wrapper.appendChild(inner);

        animateCardSpring(wrapper, delay);
        return wrapper;
    }

    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = buildCardInner(card);
    animateCardSpring(el, delay);
    return el;
}

// interleave=true → P1@0ms, D1@STAGGER, P2@2×STAGGER, D2@3×STAGGER
function renderHands(hideDealer = false, interleave = false) {
    const dealerArea = document.getElementById('dealer-cards');
    const playerArea = document.getElementById('player-cards');
    dealerArea.innerHTML = '';
    playerArea.innerHTML = '';

    gameState.dealerHand.forEach((card, i) => {
        const hidden = hideDealer && i === 1;
        const delay  = interleave ? (i * 2 + 1) * STAGGER : i * STAGGER;
        dealerArea.appendChild(createCardElement(card, hidden, delay));
    });

    gameState.playerHand.forEach((card, i) => {
        const delay = interleave ? i * 2 * STAGGER : i * STAGGER;
        playerArea.appendChild(createCardElement(card, false, delay));
    });
}

function updateScores(hideDealer = false) {
    const playerVal     = calculateHandValue(gameState.playerHand);
    const playerScoreEl = document.getElementById('player-score');

    if (gameState.playerHand.length) {
        playerScoreEl.textContent = playerVal;
        playerScoreEl.classList.toggle('score-bust',      playerVal > 21);
        playerScoreEl.classList.toggle('score-blackjack', playerVal === 21 && gameState.playerHand.length === 2);
    } else {
        playerScoreEl.textContent = '';
        playerScoreEl.classList.remove('score-bust', 'score-blackjack');
    }

    const dealerScoreEl = document.getElementById('dealer-score');
    if (hideDealer && gameState.dealerHand.length) {
        dealerScoreEl.textContent = getCardValue(gameState.dealerHand[0]);
        dealerScoreEl.classList.remove('score-bust', 'score-blackjack');
    } else {
        const dealerVal = calculateHandValue(gameState.dealerHand);
        if (gameState.dealerHand.length) {
            dealerScoreEl.textContent = dealerVal;
            dealerScoreEl.classList.toggle('score-bust',      dealerVal > 21);
            dealerScoreEl.classList.toggle('score-blackjack', dealerVal === 21 && gameState.dealerHand.length === 2);
        } else {
            dealerScoreEl.textContent = '';
            dealerScoreEl.classList.remove('score-bust', 'score-blackjack');
        }
    }
}

// ── UI ────────────────────────────────────────
function showScreen(screen) {
    document.getElementById('screen-login').style.display = screen === 'login' ? 'flex' : 'none';
    document.getElementById('screen-game').style.display  = screen === 'game'  ? 'flex' : 'none';
}

function showControls(phase) {
    const ids = ['controls-betting', 'controls-player', 'controls-result'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        el.style.display = 'none';
        el.classList.remove('controls-active');
    });

    const idMap = {
        'betting': 'controls-betting',
        'player':  'controls-player',
        'result':  'controls-result',
    };
    if (idMap[phase]) {
        const el = document.getElementById(idMap[phase]);
        el.style.display = 'flex';
        void el.offsetWidth; // force reflow pour l'animation
        el.classList.add('controls-active');
    }
}

function updateBalance() {
    const balanceEl = document.getElementById('balance-display');
    const betEl     = document.getElementById('current-bet-display');

    // Flash quand le solde change
    const prevText = balanceEl.textContent.replace(/\s/g, '');
    const prevVal  = parseInt(prevText) || 0;
    if (prevVal !== gameState.balance && gameState.balance !== 0) {
        balanceEl.classList.remove('balance-flash');
        void balanceEl.offsetWidth;
        balanceEl.classList.add('balance-flash');
    }

    balanceEl.textContent = gameState.balance.toLocaleString('fr-FR');
    betEl.textContent     = gameState.currentBet.toLocaleString('fr-FR');

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
    el.className = 'bj-message';
    if (type) el.classList.add('message-' + type);
    if (msg) {
        void el.offsetWidth; // force reflow
        el.classList.add('message-visible');
    }
}

function updateUI() {
    const hideDealer = gameState.status === 'player-turn';
    renderHands(hideDealer);
    updateScores(hideDealer);
    updateBalance();
    setMessage(gameState.message, gameState.messageType);

    const phaseMap = {
        'betting':     'betting',
        'player-turn': 'player',
        'result':      'result',
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
            gameState.balance    += gameState.currentBet;
            gameState.currentBet  = 0;
            gameState.message     = err.error || 'Erreur lors de la mise';
            gameState.messageType = 'error';
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

    gameState.playerHand  = [gameState.deck.pop(), gameState.deck.pop()];
    gameState.dealerHand  = [gameState.deck.pop(), gameState.deck.pop()];
    gameState.status      = 'player-turn';
    gameState.message     = '';
    gameState.messageType = '';

    // Deal alternant : P1 → D1 → P2 → D2
    renderHands(true, true);
    updateScores(true);
    updateBalance();
    setMessage('', '');
    showControls('player');

    // Blackjack naturel ? (attendre que les 4 cartes soient apparues)
    if (calculateHandValue(gameState.playerHand) === 21) {
        setTimeout(() => handleStand(), STAGGER * 3 + 900);
    }
}

async function handleHit() {
    if (gameState.status !== 'player-turn') return;

    const newCard = gameState.deck.pop();
    gameState.playerHand.push(newCard);

    // Append uniquement la nouvelle carte (les existantes ne re-animent pas)
    document.getElementById('player-cards').appendChild(createCardElement(newCard, false, 0));
    updateScores(true);

    const value = calculateHandValue(gameState.playerHand);
    if (value > 21) {
        gameState.status = 'result';
        await pause(380);
        setMessage('💥 Bust ! Le dealer gagne.', 'lose');
        showControls('result');
        await submitResult('lose', 0);
    } else if (value === 21) {
        setTimeout(() => handleStand(), 900);
    }
}

async function handleStand() {
    if (gameState.status !== 'player-turn') return;
    gameState.status = 'dealer-turn';
    showControls('none');

    // Retourner la carte cachée du dealer avec animation flip 3D
    await pause(220);
    revealDealerCard();
    updateScores(false);

    // Pause avant que le dealer joue
    await pause(980);
    await dealerDraw();
}

function revealDealerCard() {
    const wrapper = document.querySelector('#dealer-cards .card-flip-wrapper');
    if (!wrapper) return;
    const inner = wrapper.querySelector('.card-flip-inner');
    if (inner) inner.classList.add('flipped');
}

async function dealerDraw() {
    const dealerValue = calculateHandValue(gameState.dealerHand);

    if (dealerValue < 17) {
        await pause(1100);
        const newCard = gameState.deck.pop();
        gameState.dealerHand.push(newCard);
        document.getElementById('dealer-cards').appendChild(createCardElement(newCard, false, 0));
        updateScores(false);
        await dealerDraw();
        return;
    }

    // Pause dramatique avant le résultat
    await pause(480);

    const playerValue        = calculateHandValue(gameState.playerHand);
    const isNaturalBlackjack = gameState.playerHand.length === 2 && playerValue === 21;

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
    setMessage(message, msgType);
    showControls('result');

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
