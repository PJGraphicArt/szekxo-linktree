let currentPage = 1;
let currentFilter = 'all';
let hasMore = true;
let loading = false;

function coinImg() {
    return `<img src="images/moon-coin.png" class="moon-coin-icon-sm" alt="🪙">`;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function appendTransactions(transactions) {
    const list = document.getElementById('transactions-list');
    if (!list) return;

    if (!transactions || transactions.length === 0) {
        if (currentPage === 1) {
            list.innerHTML = '<p class="transactions-empty">Aucune transaction pour le moment.</p>';
        }
        return;
    }

    const html = transactions.map(tx => {
        const isPositive = tx.amount >= 0;
        const sign = isPositive ? '+' : '';
        const amount = (tx.amount || 0).toLocaleString('fr-FR');
        return `
            <div class="transaction-item">
                <span class="transaction-desc">${tx.description || tx.type}</span>
                <span class="transaction-amount ${isPositive ? 'positive' : 'negative'}">${sign}${amount} ${coinImg()}</span>
                <span class="transaction-date">${formatDate(tx.created_at)}</span>
            </div>
        `;
    }).join('');

    list.innerHTML += html;
}

async function loadTransactions(reset = false) {
    if (loading || (!hasMore && !reset)) return;
    loading = true;

    if (reset) {
        currentPage = 1;
        hasMore = true;
        const list = document.getElementById('transactions-list');
        if (list) list.innerHTML = '<p class="transactions-empty">Chargement...</p>';
    }

    try {
        const res = await fetch(`/api/transactions?page=${currentPage}&filter=${currentFilter}`);
        if (res.status === 401) {
            window.location.href = '/api/auth/discord/login';
            return;
        }
        if (!res.ok) throw new Error('Server error');

        if (reset) {
            const list = document.getElementById('transactions-list');
            if (list) list.innerHTML = '';
        }

        const data = await res.json();
        appendTransactions(data.transactions);
        hasMore = data.hasMore;
        currentPage++;

        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) loadMoreBtn.style.display = hasMore ? 'block' : 'none';
    } catch (err) {
        console.error('Error loading transactions:', err);
        const list = document.getElementById('transactions-list');
        if (list && currentPage === 1) {
            list.innerHTML = '<p class="transactions-empty">Erreur lors du chargement.</p>';
        }
    } finally {
        loading = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Filtres
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadTransactions(true);
        });
    });

    // Charger plus
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => loadTransactions());

    loadTransactions();
});
