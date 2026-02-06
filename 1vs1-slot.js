// ==================== STATE MANAGEMENT ====================
let state = {
    step: 'setup', // 'setup' | 'battle'
    currentSlot: 0, // 0, 1, 2
    battleData: {
        player1: '',
        player2: '',
        slots: [null, null, null] // Array of SlotData or null
    }
};

let slotMachines = []; // Will be loaded from JSON

// ==================== SLOT MACHINES DATA ====================
async function loadSlotMachines() {
    try {
        const response = await fetch('data/slot-machines.json');
        slotMachines = await response.json();
        console.log(`${slotMachines.length} machines à sous chargées`);
    } catch (error) {
        console.error('Erreur lors du chargement des machines:', error);
        // Fallback data si le fichier ne charge pas
        slotMachines = [
            { name: "Gates of Olympus", provider: "Pragmatic Play" },
            { name: "Sweet Bonanza", provider: "Pragmatic Play" },
            { name: "Big Bass Bonanza", provider: "Pragmatic Play" }
        ];
    }
}

// ==================== UTILITY FUNCTIONS ====================
function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num) + 'x';
}

function formatCurrency(num) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

function calculateScores() {
    const scores = {
        player1: 0,
        player2: 0
    };

    state.battleData.slots.forEach(slot => {
        if (slot) {
            scores.player1 += slot.player1Multiplier;
            scores.player2 += slot.player2Multiplier;
        }
    });

    return scores;
}

function getLeader() {
    const scores = calculateScores();
    if (scores.player1 > scores.player2) {
        return {
            name: state.battleData.player1,
            score: scores.player1,
            difference: scores.player1 - scores.player2
        };
    } else if (scores.player2 > scores.player1) {
        return {
            name: state.battleData.player2,
            score: scores.player2,
            difference: scores.player2 - scores.player1
        };
    }
    return null; // Égalité
}

// ==================== SETUP PHASE ====================
function handleSetupSubmit(e) {
    e.preventDefault();

    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');

    const player1 = player1Input.value.trim();
    const player2 = player2Input.value.trim();

    if (!player1 || !player2) {
        alert('Veuillez renseigner les deux pseudos');
        return;
    }

    if (player1.toLowerCase() === player2.toLowerCase()) {
        alert('Les deux joueurs doivent avoir des pseudos différents');
        return;
    }

    // Update state
    state.step = 'battle';
    state.currentSlot = 0;
    state.battleData.player1 = player1;
    state.battleData.player2 = player2;
    state.battleData.slots = [null, null, null];

    // Update UI
    transitionToBattle();
}

function transitionToBattle() {
    const setupPhase = document.getElementById('setup-phase');
    const battlePhase = document.getElementById('battle-phase');

    setupPhase.classList.add('hidden');
    battlePhase.classList.remove('hidden');

    renderBattleCards();
}

// ==================== BATTLE PHASE ====================
function renderBattleCards() {
    const battleCardsContainer = document.getElementById('battle-cards');
    battleCardsContainer.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const card = createBattleCard(i);
        battleCardsContainer.appendChild(card);
    }

    // Show sticky leader if at least one slot is completed
    const completedSlots = state.battleData.slots.filter(s => s !== null).length;
    if (completedSlots > 0) {
        updateStickyLeader();
    }
}

// Fonction pour sélectionner une machine aléatoire
function selectRandomMachine(playerNumber, form) {
    if (slotMachines.length === 0) return;

    const randomIndex = Math.floor(Math.random() * slotMachines.length);
    const randomMachine = slotMachines[randomIndex];

    // Remplir l'input correspondant
    const input = form.querySelector(`[data-autocomplete-input][data-player="${playerNumber}"]`);
    if (input) {
        input.value = randomMachine.name;
        // Fermer le dropdown si ouvert
        const dropdown = form.querySelector(`[data-autocomplete-dropdown][data-player="${playerNumber}"]`);
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    }
}

function createBattleCard(slotIndex) {
    const slotData = state.battleData.slots[slotIndex];
    const isActive = slotIndex === state.currentSlot && !slotData;
    const isCompleted = slotData !== null;
    const isWaiting = slotIndex > state.currentSlot;

    const card = document.createElement('div');
    card.className = `battle-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isWaiting ? 'waiting' : ''}`;
    card.dataset.slotIndex = slotIndex;

    if (isCompleted) {
        // Show completed slot
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Manche ${slotIndex + 1}</h3>
                <span class="card-status completed">
                    <i data-lucide="check-circle"></i>
                    Terminée
                </span>
            </div>
            <div class="players-results-detailed">
                <div class="player-result-detailed ${slotData.player1Multiplier > slotData.player2Multiplier ? 'winner' : ''}">
                    <div class="player-result-header">
                        <div class="player-name">${state.battleData.player1}</div>
                        <div class="player-multiplier">${formatNumber(slotData.player1Multiplier)}</div>
                    </div>
                    <div class="player-machine">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5,4v11.6h4v0c0-2.1,1.8-3.9,4-3.9h5l-2.8,3.4C11.8,19.2,9.3,23.9,8,29l0,0h13v0c0-5.7,1.5-11.3,4.5-16.2l3.5-6L26,3l-1.2,0.6c-3.1,1.5-6.6,1.8-9.9,0.9l0,0C13.6,4.1,12.4,4,11.1,4H5"/>
                        </svg>
                        ${slotData.player1Machine}
                    </div>
                    <div class="player-stats">
                        <div class="stat">
                            <span class="stat-label">Bet:</span>
                            <span class="stat-value">${formatCurrency(slotData.player1Bet)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Gain:</span>
                            <span class="stat-value">${formatCurrency(slotData.player1Gain)}</span>
                        </div>
                    </div>
                </div>

                <div class="vs-separator">VS</div>

                <div class="player-result-detailed ${slotData.player2Multiplier > slotData.player1Multiplier ? 'winner' : ''}">
                    <div class="player-result-header">
                        <div class="player-name">${state.battleData.player2}</div>
                        <div class="player-multiplier">${formatNumber(slotData.player2Multiplier)}</div>
                    </div>
                    <div class="player-machine">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5,4v11.6h4v0c0-2.1,1.8-3.9,4-3.9h5l-2.8,3.4C11.8,19.2,9.3,23.9,8,29l0,0h13v0c0-5.7,1.5-11.3,4.5-16.2l3.5-6L26,3l-1.2,0.6c-3.1,1.5-6.6,1.8-9.9,0.9l0,0C13.6,4.1,12.4,4,11.1,4H5"/>
                        </svg>
                        ${slotData.player2Machine}
                    </div>
                    <div class="player-stats">
                        <div class="stat">
                            <span class="stat-label">Bet:</span>
                            <span class="stat-value">${formatCurrency(slotData.player2Bet)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Gain:</span>
                            <span class="stat-value">${formatCurrency(slotData.player2Gain)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (isActive) {
        // Show active slot form
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Manche ${slotIndex + 1}</h3>
                <span class="card-status active">
                    <i data-lucide="play-circle"></i>
                    En cours
                </span>
            </div>
            <form class="slot-form" data-slot-index="${slotIndex}">
                <div class="player-section">
                    <h4 class="player-section-title">${state.battleData.player1}</h4>

                    <div class="form-group">
                        <label class="form-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5,4v11.6h4v0c0-2.1,1.8-3.9,4-3.9h5l-2.8,3.4C11.8,19.2,9.3,23.9,8,29l0,0h13v0c0-5.7,1.5-11.3,4.5-16.2l3.5-6L26,3l-1.2,0.6c-3.1,1.5-6.6,1.8-9.9,0.9l0,0C13.6,4.1,12.4,4,11.1,4H5"/>
                            </svg>
                            Slot Machine
                        </label>
                        <div class="autocomplete-wrapper">
                            <div class="slot-input-group">
                                <input
                                    type="text"
                                    class="form-input"
                                    placeholder="Rechercher une machine..."
                                    autocomplete="off"
                                    data-autocomplete-input
                                    data-player="1"
                                    required
                                />
                                <button type="button" class="btn-random-slot" data-player="1" aria-label="Machine aléatoire">
                                    <i data-lucide="shuffle"></i>
                                </button>
                            </div>
                            <div class="autocomplete-dropdown hidden" data-autocomplete-dropdown data-player="1"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 9.5C21 11.9853 16.9706 14 12 14M21 9.5C21 7.01472 16.9706 5 12 5C7.02944 5 3 7.01472 3 9.5M21 9.5V15C21 17.2091 16.9706 19 12 19M12 14C7.02944 14 3 11.9853 3 9.5M12 14V19M3 9.5V15C3 17.2091 7.02944 19 12 19M7 18.3264V13.2422M17 18.3264V13.2422"/>
                            </svg>
                            Bet (Mise)
                        </label>
                        <input
                            type="number"
                            class="form-input"
                            placeholder="Ex: 1.00"
                            min="0"
                            step="0.01"
                            data-player="1"
                            data-bet
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 64 64" fill="currentColor">
                                <path d="M34,30H31a2,2,0,0,1,0-4h6a2,2,0,0,0,0-4H34V20a2,2,0,0,0-4,0v2.09A6,6,0,0,0,31,34h3a2,2,0,0,1,0,4H28a2,2,0,0,0,0,4h2v2a2,2,0,0,0,4,0V42a6,6,0,0,0,0-12Z"/>
                                <path d="M54.9,9H9.1A6.11,6.11,0,0,0,3,15.1V48.9A6.11,6.11,0,0,0,9.1,55H54.9A6.11,6.11,0,0,0,61,48.9V15.1A6.11,6.11,0,0,0,54.9,9ZM57,48.9A2.1,2.1,0,0,1,54.9,51H9.1A2.1,2.1,0,0,1,7,48.9V15.1A2.1,2.1,0,0,1,9.1,13H54.9A2.1,2.1,0,0,1,57,15.1Z"/>
                            </svg>
                            Gain
                        </label>
                        <input
                            type="number"
                            class="form-input"
                            placeholder="Ex: 120.00"
                            min="0"
                            step="0.01"
                            data-player="1"
                            data-gain
                            required
                        />
                    </div>
                </div>

                <div class="vs-divider">VS</div>

                <div class="player-section">
                    <h4 class="player-section-title">${state.battleData.player2}</h4>

                    <div class="form-group">
                        <label class="form-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5,4v11.6h4v0c0-2.1,1.8-3.9,4-3.9h5l-2.8,3.4C11.8,19.2,9.3,23.9,8,29l0,0h13v0c0-5.7,1.5-11.3,4.5-16.2l3.5-6L26,3l-1.2,0.6c-3.1,1.5-6.6,1.8-9.9,0.9l0,0C13.6,4.1,12.4,4,11.1,4H5"/>
                            </svg>
                            Slot Machine
                        </label>
                        <div class="autocomplete-wrapper">
                            <div class="slot-input-group">
                                <input
                                    type="text"
                                    class="form-input"
                                    placeholder="Rechercher une machine..."
                                    autocomplete="off"
                                    data-autocomplete-input
                                    data-player="2"
                                    required
                                />
                                <button type="button" class="btn-random-slot" data-player="2" aria-label="Machine aléatoire">
                                    <i data-lucide="shuffle"></i>
                                </button>
                            </div>
                            <div class="autocomplete-dropdown hidden" data-autocomplete-dropdown data-player="2"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 9.5C21 11.9853 16.9706 14 12 14M21 9.5C21 7.01472 16.9706 5 12 5C7.02944 5 3 7.01472 3 9.5M21 9.5V15C21 17.2091 16.9706 19 12 19M12 14C7.02944 14 3 11.9853 3 9.5M12 14V19M3 9.5V15C3 17.2091 7.02944 19 12 19M7 18.3264V13.2422M17 18.3264V13.2422"/>
                            </svg>
                            Bet (Mise)
                        </label>
                        <input
                            type="number"
                            class="form-input"
                            placeholder="Ex: 0.60"
                            min="0"
                            step="0.01"
                            data-player="2"
                            data-bet
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 64 64" fill="currentColor">
                                <path d="M34,30H31a2,2,0,0,1,0-4h6a2,2,0,0,0,0-4H34V20a2,2,0,0,0-4,0v2.09A6,6,0,0,0,31,34h3a2,2,0,0,1,0,4H28a2,2,0,0,0,0,4h2v2a2,2,0,0,0,4,0V42a6,6,0,0,0,0-12Z"/>
                                <path d="M54.9,9H9.1A6.11,6.11,0,0,0,3,15.1V48.9A6.11,6.11,0,0,0,9.1,55H54.9A6.11,6.11,0,0,0,61,48.9V15.1A6.11,6.11,0,0,0,54.9,9ZM57,48.9A2.1,2.1,0,0,1,54.9,51H9.1A2.1,2.1,0,0,1,7,48.9V15.1A2.1,2.1,0,0,1,9.1,13H54.9A2.1,2.1,0,0,1,57,15.1Z"/>
                            </svg>
                            Gain
                        </label>
                        <input
                            type="number"
                            class="form-input"
                            placeholder="Ex: 94.00"
                            min="0"
                            step="0.01"
                            data-player="2"
                            data-gain
                            required
                        />
                    </div>
                </div>
                <div class="form-actions" style="display: flex;
    flex-direction: row;
    justify-content: center;">
                <button type="submit" class="btn-submit">
                    <i data-lucide="check"></i>
                    <span>Valider la manche</span>
                </button>
                </div>
            </form>
        `;

        // Initialize autocomplete for this form
        const form = card.querySelector('.slot-form');
        initializeAutocompleteForBothPlayers(form);

        // Add form submit handler
        form.addEventListener('submit', handleSlotSubmit);

        // Add random slot button event listeners
        const randomButtons = form.querySelectorAll('.btn-random-slot');
        randomButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const playerNumber = btn.dataset.player;
                selectRandomMachine(playerNumber, form);
            });
        });
    } else {
        // Show waiting slot
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Manche ${slotIndex + 1}</h3>
                <span class="card-status waiting">
                    <i data-lucide="clock"></i>
                    En attente
                </span>
            </div>
            <div class="waiting-message">
                <i data-lucide="hourglass"></i>
                <p>Cette manche sera disponible après la manche ${slotIndex}</p>
            </div>
        `;
    }

    // Initialize Lucide icons
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 0);

    return card;
}

function handleSlotSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const slotIndex = parseInt(form.dataset.slotIndex);

    // Get form values for player 1
    const machine1Input = form.querySelector('[data-autocomplete-input][data-player="1"]');
    const bet1Input = form.querySelector('[data-bet][data-player="1"]');
    const gain1Input = form.querySelector('[data-gain][data-player="1"]');

    const player1Machine = machine1Input.value.trim();
    const player1Bet = parseFloat(bet1Input.value);
    const player1Gain = parseFloat(gain1Input.value);

    // Get form values for player 2
    const machine2Input = form.querySelector('[data-autocomplete-input][data-player="2"]');
    const bet2Input = form.querySelector('[data-bet][data-player="2"]');
    const gain2Input = form.querySelector('[data-gain][data-player="2"]');

    const player2Machine = machine2Input.value.trim();
    const player2Bet = parseFloat(bet2Input.value);
    const player2Gain = parseFloat(gain2Input.value);

    // Allow free text input for slot machines - no strict validation required

    // Validate player 1 bet
    if (isNaN(player1Bet) || player1Bet <= 0) {
        alert('Mise invalide pour ' + state.battleData.player1);
        bet1Input.focus();
        return;
    }

    // Validate player 1 gain
    if (isNaN(player1Gain) || player1Gain < 0) {
        alert('Gain invalide pour ' + state.battleData.player1);
        gain1Input.focus();
        return;
    }

    // Allow free text input for slot machines - no strict validation required

    // Validate player 2 bet
    if (isNaN(player2Bet) || player2Bet <= 0) {
        alert('Mise invalide pour ' + state.battleData.player2);
        bet2Input.focus();
        return;
    }

    // Validate player 2 gain
    if (isNaN(player2Gain) || player2Gain < 0) {
        alert('Gain invalide pour ' + state.battleData.player2);
        gain2Input.focus();
        return;
    }

    // Calculate multipliers automatically
    const player1Multiplier = player1Gain / player1Bet;
    const player2Multiplier = player2Gain / player2Bet;

    // Save slot data
    state.battleData.slots[slotIndex] = {
        player1Machine,
        player1Bet,
        player1Gain,
        player1Multiplier,
        player2Machine,
        player2Bet,
        player2Gain,
        player2Multiplier
    };

    // Move to next slot or show winner
    if (slotIndex < 2) {
        state.currentSlot = slotIndex + 1;
        renderBattleCards();
        updateStickyLeader();
    } else {
        // All 3 slots completed - show winner
        showWinnerDialog();
    }
}

// ==================== AUTOCOMPLETE ====================
function initializeAutocompleteForBothPlayers(form) {
    // Initialize autocomplete for player 1
    const input1 = form.querySelector('[data-autocomplete-input][data-player="1"]');
    const dropdown1 = form.querySelector('[data-autocomplete-dropdown][data-player="1"]');
    if (input1 && dropdown1) {
        initializeAutocompleteForInput(input1, dropdown1);
    }

    // Initialize autocomplete for player 2
    const input2 = form.querySelector('[data-autocomplete-input][data-player="2"]');
    const dropdown2 = form.querySelector('[data-autocomplete-dropdown][data-player="2"]');
    if (input2 && dropdown2) {
        initializeAutocompleteForInput(input2, dropdown2);
    }
}

function initializeAutocompleteForInput(input, dropdown) {
    let selectedIndex = -1;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
            selectedIndex = -1;
            return;
        }

        // Filter machines
        const matches = slotMachines.filter(machine =>
            machine.name.toLowerCase().includes(query) ||
            machine.provider.toLowerCase().includes(query)
        ).slice(0, 8); // Limit to 8 results

        if (matches.length === 0) {
            dropdown.innerHTML = '<div class="autocomplete-item no-results">Aucune machine trouvée</div>';
            dropdown.classList.remove('hidden');
            return;
        }

        // Render dropdown
        dropdown.innerHTML = matches.map((machine, index) => `
            <div class="autocomplete-item" data-index="${index}" data-machine-name="${machine.name}">
                <div class="machine-name">${highlightMatch(machine.name, query)}</div>
                <div class="machine-provider">${machine.provider}</div>
            </div>
        `).join('');

        dropdown.classList.remove('hidden');
        selectedIndex = -1;

        // Add click handlers
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const machineName = item.dataset.machineName;
                if (machineName) {
                    input.value = machineName;
                    dropdown.classList.add('hidden');
                    dropdown.innerHTML = '';
                }
            });
        });
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('.autocomplete-item:not(.no-results)');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection(items, selectedIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSelection(items, selectedIndex);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            const selectedItem = items[selectedIndex];
            const machineName = selectedItem.dataset.machineName;
            if (machineName) {
                input.value = machineName;
                dropdown.classList.add('hidden');
                dropdown.innerHTML = '';
                selectedIndex = -1;
            }
        } else if (e.key === 'Escape') {
            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
            selectedIndex = -1;
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
            selectedIndex = -1;
        }
    });
}

function highlightMatch(text, query) {
    if (!query.trim()) return text;
    // Trim and normalize spaces, then escape special regex characters
    const normalizedQuery = query.trim().replace(/\s+/g, ' ');
    const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

function updateSelection(items, selectedIndex) {
    items.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('selected');
        }
    });
}

// ==================== STICKY LEADER BAR ====================
function updateStickyLeader() {
    const stickyLeader = document.getElementById('sticky-leader');
    const leaderInfo = document.getElementById('leader-info');
    const scoresComparison = document.getElementById('scores-comparison');

    const leader = getLeader();
    const scores = calculateScores();

    if (!leader) {
        // Égalité
        leaderInfo.innerHTML = `
            <i data-lucide="trophy"></i>
            <span class="leader-text">Égalité parfaite !</span>
        `;
    } else {
        leaderInfo.innerHTML = `
            <i data-lucide="crown"></i>
            <span class="leader-text">${leader.name} en tête</span>
        `;
    }

    scoresComparison.innerHTML = `
        <div class="score-item">
            <span class="score-name">${state.battleData.player1}</span>
            <span class="score-value">${formatNumber(scores.player1)}</span>
        </div>
        <div class="score-separator">-</div>
        <div class="score-item">
            <span class="score-name">${state.battleData.player2}</span>
            <span class="score-value">${formatNumber(scores.player2)}</span>
        </div>
    `;

    stickyLeader.classList.remove('hidden');

    // Initialize Lucide icons
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 0);
}

// ==================== WINNER DIALOG ====================
function showWinnerDialog() {
    const dialog = document.getElementById('winner-dialog');
    const content = document.getElementById('winner-content');
    const newBattleBtn = document.getElementById('new-battle-btn');

    const scores = calculateScores();
    const leader = getLeader();

    let html = '';

    if (!leader) {
        // Égalité
        html = `
            <div class="winner-animation">
                <i data-lucide="trophy" class="winner-icon equal"></i>
            </div>
            <h2 class="winner-name">Égalité !</h2>
            <p class="winner-subtitle">Les deux joueurs sont à égalité</p>
            <div class="final-scores">
                <div class="final-score">
                    <div class="final-score-name">${state.battleData.player1}</div>
                    <div class="final-score-value">${formatNumber(scores.player1)}</div>
                </div>
                <div class="final-score">
                    <div class="final-score-name">${state.battleData.player2}</div>
                    <div class="final-score-value">${formatNumber(scores.player2)}</div>
                </div>
            </div>
            <button id="restart-battle-btn" class="restart-battle-btn">
                <i data-lucide="refresh-cw"></i>
                Nouveau Battle
            </button>
        `;
    } else {
        const winner = leader.name === state.battleData.player1 ? state.battleData.player1 : state.battleData.player2;
        const loser = winner === state.battleData.player1 ? state.battleData.player2 : state.battleData.player1;
        const winnerScore = leader.name === state.battleData.player1 ? scores.player1 : scores.player2;
        const loserScore = leader.name === state.battleData.player1 ? scores.player2 : scores.player1;

        html = `
            <div class="winner-animation">
                <i data-lucide="crown" class="winner-icon"></i>
            </div>
            <h2 class="winner-name">${winner} remporte le battle !</h2>
            <p class="winner-subtitle">Victoire avec ${formatNumber(leader.difference)} d'avance</p>
            <div class="final-scores">
                <div class="final-score winner">
                    <div class="final-score-name">${winner}</div>
                    <div class="final-score-value">${formatNumber(winnerScore)}</div>
                </div>
                <div class="final-score">
                    <div class="final-score-name">${loser}</div>
                    <div class="final-score-value">${formatNumber(loserScore)}</div>
                </div>
            </div>
            <div class="battle-recap">
                <h3 class="recap-title">Récapitulatif des manches</h3>
                <div class="recap-slots">
                    ${state.battleData.slots.map((slot, index) => `
                        <div class="recap-slot">
                            <div class="recap-slot-header">
                                <span class="recap-slot-number">Manche ${index + 1}</span>
                            </div>
                            <div class="recap-players">
                                <div class="recap-player ${slot.player1Multiplier > slot.player2Multiplier ? 'winner' : ''}">
                                    <div class="recap-player-name">${state.battleData.player1}</div>
                                    <div class="recap-player-machine">${slot.player1Machine}</div>
                                    <div class="recap-player-details">
                                        <span>Bet: ${formatCurrency(slot.player1Bet)}</span>
                                        <span>Gain: ${formatCurrency(slot.player1Gain)}</span>
                                        <span class="recap-multiplier">${formatNumber(slot.player1Multiplier)}</span>
                                    </div>
                                </div>
                                <div class="recap-player ${slot.player2Multiplier > slot.player1Multiplier ? 'winner' : ''}">
                                    <div class="recap-player-name">${state.battleData.player2}</div>
                                    <div class="recap-player-machine">${slot.player2Machine}</div>
                                    <div class="recap-player-details">
                                        <span>Bet: ${formatCurrency(slot.player2Bet)}</span>
                                        <span>Gain: ${formatCurrency(slot.player2Gain)}</span>
                                        <span class="recap-multiplier">${formatNumber(slot.player2Multiplier)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <button id="restart-battle-btn" class="restart-battle-btn">
                <i data-lucide="refresh-cw"></i>
                Nouveau Battle
            </button>
        `;
    }

    content.innerHTML = html;
    dialog.classList.remove('hidden');
    newBattleBtn.classList.remove('hidden');

    // Initialize Lucide icons
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 0);

    // Close button handler
    const closeBtn = document.getElementById('dialog-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            dialog.classList.add('hidden');
            handleNewBattle();
        });
    }

    // Restart battle button handler
    const restartBtn = document.getElementById('restart-battle-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            dialog.classList.add('hidden');
            handleNewBattle();
        });
    }

    // Close dialog on click outside
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.classList.add('hidden');
            handleNewBattle();
        }
    });
}

// ==================== NEW BATTLE ====================
function handleNewBattle() {
    // Reset state
    state = {
        step: 'setup',
        currentSlot: 0,
        battleData: {
            player1: '',
            player2: '',
            slots: [null, null, null]
        }
    };

    // Reset UI
    const setupPhase = document.getElementById('setup-phase');
    const battlePhase = document.getElementById('battle-phase');
    const dialog = document.getElementById('winner-dialog');
    const stickyLeader = document.getElementById('sticky-leader');
    const newBattleBtn = document.getElementById('new-battle-btn');

    dialog.classList.add('hidden');
    battlePhase.classList.add('hidden');
    stickyLeader.classList.add('hidden');
    newBattleBtn.classList.add('hidden');
    setupPhase.classList.remove('hidden');

    // Clear form
    document.getElementById('setup-form').reset();
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    // Load slot machines
    await loadSlotMachines();

    // Setup form handler
    const setupForm = document.getElementById('setup-form');
    if (setupForm) {
        setupForm.addEventListener('submit', handleSetupSubmit);
    }

    // New battle button handler
    const newBattleBtn = document.getElementById('new-battle-btn');
    if (newBattleBtn) {
        newBattleBtn.addEventListener('click', handleNewBattle);
    }

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    console.log('1VS1 SLOT app initialized');
});
