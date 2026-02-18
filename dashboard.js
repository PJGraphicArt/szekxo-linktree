function timeAgo(dateStr) {
    const now = Date.now();
    const date = new Date(dateStr).getTime();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `il y a ${diff}s`;
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    return `il y a ${Math.floor(diff / 86400)}j`;
}

function renderUser(user) {
    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=128`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';

    const avatar = document.getElementById('dashboard-avatar');
    const username = document.getElementById('dashboard-username');

    if (avatar) avatar.src = avatarUrl;
    if (username) username.textContent = user.username;
}

function renderBalance(balance, totalEarned) {
    const balanceEl = document.getElementById('balance-amount');
    const totalEl = document.getElementById('balance-total');

    if (balanceEl) balanceEl.textContent = balance.toLocaleString('fr-FR');
    if (totalEl) totalEl.textContent = `Total gagné : ${totalEarned.toLocaleString('fr-FR')} 🪙`;
}

function renderLinks(links) {
    const kickVal = document.getElementById('platform-kick');
    const kickBadge = document.getElementById('platform-kick-badge');
    const dliveVal = document.getElementById('platform-dlive');
    const dliveBadge = document.getElementById('platform-dlive-badge');

    if (links.kick) {
        if (kickVal) kickVal.textContent = links.kick;
        if (kickBadge) {
            kickBadge.textContent = '✅';
            kickBadge.className = 'platform-badge platform-badge-linked';
        }
    } else {
        if (kickVal) kickVal.textContent = 'Non lié';
        if (kickBadge) {
            kickBadge.textContent = '❌';
            kickBadge.className = 'platform-badge platform-badge-unlinked';
        }
    }

    if (links.dlive) {
        if (dliveVal) dliveVal.textContent = links.dlive;
        if (dliveBadge) {
            dliveBadge.textContent = '✅';
            dliveBadge.className = 'platform-badge platform-badge-linked';
        }
    } else {
        if (dliveVal) dliveVal.textContent = 'Non lié';
        if (dliveBadge) {
            dliveBadge.textContent = '❌';
            dliveBadge.className = 'platform-badge platform-badge-unlinked';
        }
    }
}

function renderTransactions(transactions) {
    const list = document.getElementById('transactions-list');
    if (!list) return;

    if (!transactions || transactions.length === 0) {
        list.innerHTML = '<p class="transactions-empty">Aucune transaction pour le moment.</p>';
        return;
    }

    list.innerHTML = transactions.map(tx => {
        const isPositive = tx.amount >= 0;
        const amountClass = isPositive ? 'positive' : 'negative';
        const amountStr = isPositive ? `+${tx.amount}` : `${tx.amount}`;
        return `
            <div class="transaction-item">
                <span class="transaction-desc">${tx.description || tx.type}</span>
                <span class="transaction-amount ${amountClass}">${amountStr} 🪙</span>
                <span class="transaction-date">${timeAgo(tx.created_at)}</span>
            </div>
        `;
    }).join('');
}

async function loadDashboard() {
    try {
        const res = await fetch('/api/user/me');
        if (res.status === 401) {
            window.location.href = '/api/auth/discord/login';
            return;
        }
        if (!res.ok) throw new Error('Server error');

        const data = await res.json();
        renderUser(data.user);
        renderBalance(data.balance, data.total_earned);
        renderLinks(data.links);
        renderTransactions(data.transactions);
    } catch (err) {
        console.error('Dashboard error:', err);
        const wrapper = document.querySelector('.dashboard-wrapper');
        if (wrapper) {
            wrapper.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:40px">Erreur lors du chargement. <a href="/" style="color:var(--accent-purple)">Retour à l\'accueil</a></p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = '/api/auth/discord/logout';
        });
    }
});
