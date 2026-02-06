/**
 * Bonus Hunt Tracker - Module principal
 * Gestion des sessions de Bonus Hunt avec calculs BEA en temps réel
 */

// Configuration
const CONFIG = {
  CURRENCY: '€',
  DECIMALS: 2,
  STORAGE_KEY: 'bonusHunt:v1',
  DEBOUNCE_DELAY: 200
};

// État global de l'application
let state = {
  start: 0,
  currency: CONFIG.CURRENCY,
  bonuses: []
};

// Slot machines data
let slotMachines = [];

// Utilitaires
const utils = {
  /**
   * Parse un nombre en acceptant virgule et point comme séparateur décimal
   * @param {string} value - La valeur à parser
   * @returns {number} - Le nombre parsé ou NaN
   */
  parseNumber(value) {
    if (!value || value === '') return 0;
    const normalized = value.toString().replace(',', '.');
    return parseFloat(normalized);
  },

  /**
   * Formate un multiplicateur pour l'affichage
   * @param {number} multi - Le multiplicateur
   * @returns {string} - Le multiplicateur formaté (ex: x256.00)
   */
  formatMulti(multi) {
    if (!multi || multi <= 0) return '—';
    return `x${multi.toFixed(CONFIG.DECIMALS)}`;
  },

  /**
   * Formate un montant avec la devise
   * @param {number} amount - Le montant
   * @returns {string} - Le montant formaté avec devise
   */
  formatMoney(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '—';
    return `${amount.toFixed(CONFIG.DECIMALS)}${CONFIG.CURRENCY}`;
  },

  /**
   * Génère un UUID simple pour les IDs
   * @returns {string} - UUID généré
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Debounce une fonction
   * @param {Function} func - La fonction à debouncer
   * @param {number} delay - Le délai en ms
   * @returns {Function} - La fonction debouncée
   */
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
};

// Calculs métier
const calculations = {
  /**
   * Calcule le BEA (Break Even Average)
   * @returns {number|null} - Le BEA ou null si pas calculable
   */
  calculateBEA() {
    const totalBets = this.getTotalBets();
    if (totalBets <= 0 || state.start <= 0) return null;
    return state.start / totalBets;
  },

  /**
   * Calcule la somme totale des mises
   * @returns {number} - Somme des mises
   */
  getTotalBets() {
    return state.bonuses.reduce((sum, bonus) => sum + (bonus.bet || 0), 0);
  },

  /**
   * Calcule la mise moyenne
   * @returns {number|null} - Mise moyenne ou null
   */
  getAverageBet() {
    if (state.bonuses.length === 0) return null;
    return this.getTotalBets() / state.bonuses.length;
  },

  /**
   * Calcule la somme totale des gains
   * @returns {number} - Somme des gains
   */
  getTotalWins() {
    return state.bonuses.reduce((sum, bonus) => sum + (bonus.gain || 0), 0);
  },

  /**
   * Calcule le multiplicateur moyen réalisé
   * @returns {number|null} - Multiplicateur moyen ou null
   */
  getAverageMultiplier() {
    const bonusesWithGains = state.bonuses.filter(bonus =>
      bonus.gain > 0 && bonus.bet > 0
    );

    if (bonusesWithGains.length === 0) return null;

    const totalMulti = bonusesWithGains.reduce((sum, bonus) =>
      sum + (bonus.gain / bonus.bet), 0
    );

    return totalMulti / bonusesWithGains.length;
  },

  /**
   * Calcule l'écart entre multiplicateur moyen et BEA
   * @returns {number|null} - L'écart ou null
   */
  getMultiplierGap() {
    const avgMulti = this.getAverageMultiplier();
    const bea = this.calculateBEA();

    if (avgMulti === null || bea === null) return null;
    return avgMulti - bea;
  },

  /**
   * Calcule le multiplicateur d'un bonus
   * @param {Object} bonus - Le bonus
   * @returns {number|null} - Le multiplicateur ou null
   */
  getMultiplier(bonus) {
    if (!bonus.gain || !bonus.bet || bonus.gain <= 0 || bonus.bet <= 0) {
      return null;
    }
    return bonus.gain / bonus.bet;
  }
};

// Gestion de la persistance
const storage = {
  /**
   * Sauvegarde l'état en localStorage
   */
  save() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      this.showError('Impossible de sauvegarder les données localement');
    }
  },

  /**
   * Charge l'état depuis localStorage
   */
  load() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
        return true;
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      this.showError('Impossible de charger les données sauvegardées');
    }
    return false;
  },

  /**
   * Efface les données sauvegardées
   */
  clear() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de l\'effacement:', error);
    }
  },

  /**
   * Affiche un message d'erreur
   * @param {string} message - Le message d'erreur
   */
  showError(message) {
    const errorContainer = document.getElementById('form-errors');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
      setTimeout(() => {
        errorContainer.style.display = 'none';
      }, 5000);
    }
  }
};

// Sauvegarde debouncée
const debouncedSave = utils.debounce(() => storage.save(), CONFIG.DEBOUNCE_DELAY);

// Validation
const validation = {
  /**
   * Valide le formulaire d'ajout de bonus
   * @returns {Object} - Résultat de validation avec erreurs
   */
  validateBonusForm() {
    const errors = [];
    const machine = document.getElementById('machine-name').value.trim();
    const bet = utils.parseNumber(document.getElementById('bet-amount').value);

    if (!machine) {
      errors.push('Le nom de la machine est requis');
    }

    if (!bet || bet <= 0) {
      errors.push('La mise doit être supérieure à 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: { machine, bet, gain: 0 }
    };
  },

  /**
   * Valide le montant Start
   * @param {number} value - La valeur à valider
   * @returns {boolean} - True si valide
   */
  validateStart(value) {
    return !isNaN(value) && value >= 0;
  }
};

// Autocomplete
const autocomplete = {
  /**
   * Initialise l'autocomplete pour le champ machine
   */
  init() {
    const input = document.querySelector('[data-autocomplete-input]');
    const dropdown = document.querySelector('[data-autocomplete-dropdown]');

    if (!input || !dropdown) return;

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
      ).slice(0, 8);

      if (matches.length === 0) {
        dropdown.innerHTML = '<div class="autocomplete-item no-results">Aucune machine trouvée</div>';
        dropdown.classList.remove('hidden');
        return;
      }

      // Render dropdown
      dropdown.innerHTML = matches.map((machine, index) => `
        <div class="autocomplete-item" data-index="${index}" data-machine-name="${machine.name}">
          <div class="machine-name">${this.highlightMatch(machine.name, query)}</div>
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

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        this.updateSelection(items, selectedIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        this.updateSelection(items, selectedIndex);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selected = items[selectedIndex];
        if (selected) {
          input.value = selected.dataset.machineName;
          dropdown.classList.add('hidden');
          dropdown.innerHTML = '';
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
      }
    });
  },

  /**
   * Highlight matching text
   */
  highlightMatch(text, query) {
    if (!query.trim()) return text;
    const normalizedQuery = query.trim().replace(/\s+/g, ' ');
    const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  },

  /**
   * Update selection highlight
   */
  updateSelection(items, selectedIndex) {
    items.forEach((item, index) => {
      if (index === selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }
};

// Chargement des machines à sous
async function loadSlotMachines() {
  try {
    const response = await fetch('data/slot-machines.json');
    const data = await response.json();
    slotMachines = data.slotMachines || [];
    console.log(`${slotMachines.length} machines à sous chargées`);
  } catch (error) {
    console.error('Erreur lors du chargement des machines:', error);
    slotMachines = [];
  }
}

// Gestion des bonus
const bonusManager = {
  /**
   * Ajoute un nouveau bonus
   * @param {Object} bonusData - Les données du bonus
   */
  addBonus(bonusData) {
    const bonus = {
      id: utils.generateId(),
      machine: bonusData.machine,
      bet: bonusData.bet,
      gain: bonusData.gain || 0
    };

    state.bonuses.push(bonus);
    debouncedSave();
    ui.render();
    this.clearForm();
  },

  /**
   * Met à jour un bonus existant
   * @param {string} id - L'ID du bonus
   * @param {Object} updates - Les mises à jour
   */
  updateBonus(id, updates) {
    const index = state.bonuses.findIndex(bonus => bonus.id === id);
    if (index !== -1) {
      state.bonuses[index] = { ...state.bonuses[index], ...updates };
      debouncedSave();
      ui.render();
    }
  },

  /**
   * Supprime un bonus
   * @param {string} id - L'ID du bonus à supprimer
   */
  removeBonus(id) {
    state.bonuses = state.bonuses.filter(bonus => bonus.id !== id);
    debouncedSave();
    ui.render();
  },

  /**
   * Efface tous les bonus
   */
  clearAll() {
    state.bonuses = [];
    state.start = 0;
    debouncedSave();
    ui.render();
  },

  /**
   * Efface le formulaire
   */
  clearForm() {
    document.getElementById('bonus-form').reset();
    this.updateFormValidation();
  },

  /**
   * Met à jour la validation du formulaire
   */
  updateFormValidation() {
    const validation = this.validateForm();
    const submitBtn = document.getElementById('add-bonus-btn');
    const errorContainer = document.getElementById('form-errors');

    submitBtn.disabled = !validation.isValid;

    if (validation.errors.length > 0) {
      errorContainer.textContent = validation.errors[0];
      errorContainer.style.display = 'block';
    } else {
      errorContainer.style.display = 'none';
    }
  },

  /**
   * Valide le formulaire
   * @returns {Object} - Résultat de validation
   */
  validateForm() {
    return validation.validateBonusForm();
  }
};

// Interface utilisateur
const ui = {
  /**
   * Initialise l'interface utilisateur
   */
  init() {
    this.bindEvents();
    this.render();
  },

  /**
   * Lie tous les événements
   */
  bindEvents() {
    // Formulaire de bonus
    const form = document.getElementById('bonus-form');
    form.addEventListener('submit', this.handleBonusSubmit.bind(this));

    // Validation en temps réel du formulaire
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', bonusManager.updateFormValidation.bind(bonusManager));
    });

    // Start amount
    const startInput = document.getElementById('start-amount');
    startInput.addEventListener('input', this.handleStartChange.bind(this));

    // Actions globales
    document.getElementById('clear-all-btn').addEventListener('click', this.handleClearAll.bind(this));
    document.getElementById('export-btn').addEventListener('click', this.handleExport.bind(this));

    // Modal
    document.getElementById('modal-cancel').addEventListener('click', this.hideModal.bind(this));
    document.getElementById('modal-confirm').addEventListener('click', this.handleModalConfirm.bind(this));
    document.getElementById('confirm-modal').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.hideModal();
      }
    });

    // Navigation clavier pour la modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
      }
    });
  },

  /**
   * Gère la soumission du formulaire de bonus
   * @param {Event} e - L'événement de soumission
   */
  handleBonusSubmit(e) {
    e.preventDefault();

    const validation = bonusManager.validateForm();
    if (validation.isValid) {
      bonusManager.addBonus(validation.data);
    }
  },

  /**
   * Gère le changement du montant Start
   * @param {Event} e - L'événement de changement
   */
  handleStartChange(e) {
    const value = utils.parseNumber(e.target.value);
    if (validation.validateStart(value)) {
      state.start = value;
      debouncedSave();
      this.renderSummary();
    }
  },

  /**
   * Gère la suppression d'un bonus
   * @param {string} id - L'ID du bonus à supprimer
   */
  handleRemoveBonus(id) {
    const bonus = state.bonuses.find(b => b.id === id);
    if (bonus) {
      this.showConfirmModal(
        `Supprimer le bonus "${bonus.machine}" ?`,
        () => bonusManager.removeBonus(id)
      );
    }
  },

  /**
   * Gère l'édition d'un bonus
   * @param {string} id - L'ID du bonus à éditer
   * @param {string} field - Le champ à éditer
   * @param {string} value - La nouvelle valeur
   */
  handleEditBonus(id, field, value) {
    const updates = {};

    if (field === 'machine') {
      updates.machine = value.trim();
    } else if (field === 'bet') {
      const numValue = utils.parseNumber(value);
      if (numValue > 0) {
        updates.bet = numValue;
      }
    } else if (field === 'gain') {
      const numValue = utils.parseNumber(value);
      if (numValue >= 0) {
        updates.gain = numValue;
      }
    }

    if (Object.keys(updates).length > 0) {
      bonusManager.updateBonus(id, updates);
    }
  },

  /**
   * Gère l'effacement de toute la session
   */
  handleClearAll() {
    this.showConfirmModal(
      'Effacer toute la session ? Cette action est irréversible.',
      () => bonusManager.clearAll()
    );
  },

  /**
   * Gère l'export des données
   */
  handleExport() {
    const data = {
      ...state,
      exportDate: new Date().toISOString(),
      summary: {
        bea: calculations.calculateBEA(),
        totalBets: calculations.getTotalBets(),
        avgBet: calculations.getAverageBet(),
        totalWins: calculations.getTotalWins(),
        avgMulti: calculations.getAverageMultiplier(),
        multiGap: calculations.getMultiplierGap()
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bonus-hunt-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Affiche la modal de confirmation
   * @param {string} message - Le message à afficher
   * @param {Function} callback - Fonction à appeler si confirmé
   */
  showConfirmModal(message, callback) {
    const modal = document.getElementById('confirm-modal');
    const messageEl = document.getElementById('modal-message');

    messageEl.textContent = message;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    // Focus sur le bouton d'annulation
    document.getElementById('modal-cancel').focus();

    this.modalCallback = callback;
  },

  /**
   * Cache la modal
   */
  hideModal() {
    const modal = document.getElementById('confirm-modal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    this.modalCallback = null;
  },

  /**
   * Gère la confirmation de la modal
   */
  handleModalConfirm() {
    if (this.modalCallback) {
      this.modalCallback();
    }
    this.hideModal();
  },

  /**
   * Rend toute l'interface
   */
  render() {
    this.renderSummary();
    this.renderBonusList();
    this.updateFormValidation();
  },

  /**
   * Rend le résumé des statistiques
   */
  renderSummary() {
    // Start amount
    document.getElementById('start-amount').value = state.start || '';

    // Statistiques
    const bonusCount = state.bonuses.length;
    const totalBets = calculations.getTotalBets();
    const avgBet = calculations.getAverageBet();
    const bea = calculations.calculateBEA();
    const totalWins = calculations.getTotalWins();
    const avgMulti = calculations.getAverageMultiplier();
    const multiGap = calculations.getMultiplierGap();

    document.getElementById('bonus-count').textContent = bonusCount;
    document.getElementById('total-bets').textContent = utils.formatMoney(totalBets);
    document.getElementById('avg-bet').textContent = avgBet ? utils.formatMoney(avgBet) : '—';

    // BEA avec indication visuelle
    const beaEl = document.getElementById('bea-value');
    if (bea) {
      beaEl.textContent = utils.formatMulti(bea);
      beaEl.className = 'stat-value bea-value bea-calculated';
    } else {
      beaEl.textContent = '—';
      beaEl.className = 'stat-value bea-value';
    }

    document.getElementById('total-wins').textContent = utils.formatMoney(totalWins);
    document.getElementById('avg-multi').textContent = avgMulti ? utils.formatMulti(avgMulti) : '—';

    // Écart avec code couleur
    const gapEl = document.getElementById('multi-gap');
    if (multiGap !== null) {
      gapEl.textContent = `${multiGap >= 0 ? '+' : ''}${multiGap.toFixed(CONFIG.DECIMALS)}`;
      gapEl.className = `stat-value ${multiGap >= 0 ? 'positive' : 'negative'}`;
    } else {
      gapEl.textContent = '—';
      gapEl.className = 'stat-value';
    }
  },

  /**
   * Rend la liste des bonus
   */
  renderBonusList() {
    const tbody = document.getElementById('bonus-list');
    const emptyState = document.getElementById('empty-state');

    if (state.bonuses.length === 0) {
      tbody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    tbody.innerHTML = state.bonuses.map(bonus => {
      const multiplier = calculations.getMultiplier(bonus);
      return `
        <tr data-id="${bonus.id}">
          <td>
            <input type="text" class="inline-edit" value="${bonus.machine}"
                   data-field="machine" data-id="${bonus.id}"
                   aria-label="Nom de la machine">
          </td>
          <td>
            <div class="currency-input">
              <input type="number" class="inline-edit" value="${bonus.bet}"
                     step="0.01" min="0.01" data-field="bet" data-id="${bonus.id}"
                     aria-label="Montant de la mise">
              <span class="currency-symbol">€</span>
            </div>
          </td>
          <td>
            <div class="currency-input">
              <input type="number" class="inline-edit" value="${bonus.gain || ''}"
                     step="0.01" min="0" data-field="gain" data-id="${bonus.id}"
                     placeholder="0.00" aria-label="Montant du gain">
              <span class="currency-symbol">€</span>
            </div>
          </td>
          <td class="multiplier-cell">
            <span class="multiplier ${multiplier ? 'has-value' : ''}" aria-label="Multiplicateur">
              ${multiplier ? utils.formatMulti(multiplier) : '—'}
            </span>
          </td>
          <td>
            <button type="button" class="btn-icon delete"
                    onclick="ui.handleRemoveBonus('${bonus.id}')"
                    aria-label="Supprimer ce bonus">
              <i data-lucide="trash-2"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Bind événements d'édition inline
    tbody.querySelectorAll('.inline-edit').forEach(input => {
      input.addEventListener('blur', (e) => {
        const field = e.target.dataset.field;
        const id = e.target.dataset.id;
        const value = e.target.value;
        this.handleEditBonus(id, field, value);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.target.blur();
        }
      });
    });

    // Réinitialiser les icônes Lucide
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Met à jour la validation du formulaire
   */
  updateFormValidation() {
    bonusManager.updateFormValidation();
  }
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async () => {
  // Charger les machines à sous
  await loadSlotMachines();

  // Initialiser l'autocomplete
  autocomplete.init();

  // Charger les données sauvegardées
  storage.load();

  // Initialiser l'interface
  ui.init();

  console.log('Bonus Hunt Tracker initialisé');
});

// Export pour les tests (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    state,
    utils,
    calculations,
    bonusManager,
    ui
  };
}
