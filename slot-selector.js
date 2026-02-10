/**
 * Slot Selector - Tirage aleatoire de machines a sous
 */

let slotMachines = [];
let providers = []; // { name, count, checked }

// ==================== DATA LOADING ====================
async function loadSlotMachines() {
    try {
        const response = await fetch('data/slot-machines.json');
        const raw = await response.json();
        // Filter out entries where name matches provider name (bad data)
        slotMachines = raw.filter(m =>
            m.name && m.provider && m.name.toLowerCase() !== m.provider.toLowerCase()
        );
        console.log(`${slotMachines.length} machines chargees (${raw.length - slotMachines.length} exclues)`);
    } catch (error) {
        console.error('Erreur lors du chargement des machines:', error);
        slotMachines = [];
    }
}

function extractProviders() {
    const providerMap = {};
    slotMachines.forEach(machine => {
        const name = machine.provider;
        if (!providerMap[name]) {
            providerMap[name] = 0;
        }
        providerMap[name]++;
    });

    providers = Object.entries(providerMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, count]) => ({ name, count, checked: true }));
}

// ==================== UI RENDERING ====================
function renderProviders() {
    const grid = document.getElementById('providers-grid');
    grid.innerHTML = providers.map((provider, index) => `
        <div class="provider-chip">
            <input type="checkbox" id="provider-${index}" data-index="${index}" ${provider.checked ? 'checked' : ''}>
            <label for="provider-${index}">
                <span class="provider-name" title="${provider.name}">${provider.name}</span>
                <span class="provider-count">${provider.count}</span>
            </label>
        </div>
    `).join('');

    // Bind change events
    grid.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            providers[index].checked = e.target.checked;
            updateMachineCount();
        });
    });

    updateMachineCount();
}

function updateMachineCount() {
    const filtered = getFilteredMachines();
    document.getElementById('machine-count').textContent = filtered.length;

    const btnPick = document.getElementById('btn-pick');
    btnPick.disabled = filtered.length === 0;
}

function getFilteredMachines() {
    const checkedProviders = new Set(
        providers.filter(p => p.checked).map(p => p.name)
    );
    return slotMachines.filter(m => checkedProviders.has(m.provider));
}

// ==================== SPIN ANIMATION ====================
function pickRandomSlot() {
    const filtered = getFilteredMachines();
    if (filtered.length === 0) return;

    const resultSection = document.getElementById('result-section');
    const spinDisplay = document.getElementById('spin-display');
    const resultName = document.getElementById('result-name');
    const resultProvider = document.getElementById('result-provider');
    const btnPick = document.getElementById('btn-pick');
    const btnReroll = document.getElementById('btn-reroll');

    // Show result section
    resultSection.classList.remove('hidden');

    // Reset display
    resultName.textContent = '';
    resultProvider.textContent = '';
    resultName.style.display = 'none';
    resultProvider.style.display = 'none';
    document.getElementById('btn-copy').style.display = 'none';
    document.getElementById('btn-casino').style.display = 'none';
    spinDisplay.style.display = 'flex';

    // Disable buttons during animation
    btnPick.disabled = true;
    btnReroll.disabled = true;

    // Pick the winner
    const winner = filtered[Math.floor(Math.random() * filtered.length)];

    // Spin animation - cycle through random names
    let spinCount = 0;
    const totalSpins = 15;
    const baseDelay = 50;

    function spinStep() {
        if (spinCount < totalSpins) {
            const randomMachine = filtered[Math.floor(Math.random() * filtered.length)];
            spinDisplay.textContent = randomMachine.name;

            spinCount++;
            // Gradually slow down (~3s total)
            const delay = baseDelay + (spinCount * spinCount * 1.5);
            setTimeout(spinStep, delay);
        } else {
            // Reveal the winner
            spinDisplay.style.display = 'none';

            resultName.textContent = winner.name;
            resultProvider.textContent = winner.provider;
            resultName.style.display = 'block';
            resultProvider.style.display = 'block';
            document.getElementById('btn-copy').style.display = 'flex';

            // Casino link
            const btnCasino = document.getElementById('btn-casino');
            const slug = (winner.provider + ' ' + winner.name)
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-');
            btnCasino.href = 'https://www.crazybet.com/fr/slot/' + slug;
            btnCasino.style.display = 'inline-flex';

            // Re-trigger animation
            resultName.style.animation = 'none';
            resultName.offsetHeight; // Force reflow
            resultName.style.animation = 'scaleIn 0.4s ease';

            // Re-enable buttons
            btnPick.disabled = getFilteredMachines().length === 0;
            btnReroll.disabled = false;

            // Scroll to result
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    spinStep();
}

// ==================== SELECT ALL / DESELECT ALL ====================
function selectAllProviders() {
    providers.forEach(p => p.checked = true);
    document.querySelectorAll('#providers-grid input[type="checkbox"]').forEach(cb => cb.checked = true);
    updateMachineCount();
}

function deselectAllProviders() {
    providers.forEach(p => p.checked = false);
    document.querySelectorAll('#providers-grid input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateMachineCount();
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    await loadSlotMachines();
    extractProviders();
    renderProviders();

    // Action buttons
    document.getElementById('btn-pick').addEventListener('click', pickRandomSlot);
    document.getElementById('btn-reroll').addEventListener('click', pickRandomSlot);
    document.getElementById('btn-select-all').addEventListener('click', selectAllProviders);
    document.getElementById('btn-deselect-all').addEventListener('click', deselectAllProviders);

    // Copy button
    document.getElementById('btn-copy').addEventListener('click', () => {
        const name = document.getElementById('result-name').textContent;
        if (!name) return;
        navigator.clipboard.writeText(name).then(() => {
            const btn = document.getElementById('btn-copy');
            btn.classList.add('copied');
            btn.innerHTML = '<i data-lucide="check"></i>';
            lucide.createIcons();
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = '<i data-lucide="copy"></i>';
                lucide.createIcons();
            }, 1500);
        });
    });

    console.log('Slot Selector initialise');
});
