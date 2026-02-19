const RANK_CSS = {
    bronze:   { color: '#CD7F32', glow: 'rgba(205,127,50,0.4)',   emoji: '🥉' },
    argent:   { color: '#C0C0C0', glow: 'rgba(192,192,192,0.4)',  emoji: '🥈' },
    or:       { color: '#FFD700', glow: 'rgba(255,215,0,0.4)',    emoji: '🥇' },
    emeraude: { color: '#50C878', glow: 'rgba(80,200,120,0.4)',   emoji: '💚' },
    diamant:  { color: '#B9F2FF', glow: 'rgba(185,242,255,0.4)',  emoji: '💎' },
    lunar:    { color: '#E8D5FF', glow: 'rgba(232,213,255,0.6)',  emoji: '🌙' },
};

const RANK_NAMES = {
    bronze: 'Bronze', argent: 'Argent', or: 'Or',
    emeraude: 'Émeraude', diamant: 'Diamant', lunar: 'Lunar',
};

function fmt(n) {
    return (n || 0).toLocaleString('fr-FR');
}

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `il y a ${diff}s`;
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    return `il y a ${Math.floor(diff / 86400)}j`;
}

function coinImg() {
    return `<img src="images/moon-coin.png" class="moon-coin-icon-sm" alt="🪙">`;
}

function renderHeader(user) {
    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=128`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';

    const avatar = document.getElementById('dashboard-avatar');
    const username = document.getElementById('dashboard-username');
    const balance = document.getElementById('balance-amount');

    if (avatar) avatar.src = avatarUrl;
    if (username) username.textContent = user.username;
    if (balance) balance.innerHTML = fmt(user.balance) + ' ' + coinImg();
}

function renderRankCard(rank) {
    const tier = rank.current.tier;
    const style = RANK_CSS[tier] || RANK_CSS.bronze;
    const name = RANK_NAMES[tier] || tier;
    const isLunar = tier === 'lunar';

    const card = document.getElementById('rank-card');
    if (card) {
        card.style.setProperty('--rank-color', style.color);
        card.style.setProperty('--rank-glow', style.glow);
        if (isLunar) card.classList.add('lunar');
    }

    const rankLabel = isLunar ? 'LUNAR' : `${name} ${rank.current.level}`;

    const iconEl = document.getElementById('rank-icon');
    const nameEl = document.getElementById('rank-name');
    const barFill = document.getElementById('xp-bar-fill');
    const xpCurrentEl = document.getElementById('xp-current');
    const xpNextEl = document.getElementById('xp-next');
    const xpPctEl = document.getElementById('xp-pct');
    const nextInfo = document.getElementById('rank-next-info');

    if (iconEl) iconEl.textContent = style.emoji;
    if (nameEl) { nameEl.textContent = rankLabel; nameEl.style.color = style.color; }
    if (barFill) barFill.style.width = `${rank.progress_percent}%`;
    if (xpCurrentEl) xpCurrentEl.textContent = fmt(rank.xp_current) + ' XP';
    if (xpNextEl) xpNextEl.textContent = isLunar ? 'MAX' : fmt(rank.xp_next) + ' XP';
    if (xpPctEl) xpPctEl.textContent = `${rank.progress_percent}%`;

    if (nextInfo) {
        if (isLunar) {
            nextInfo.innerHTML = `<span style="color:${style.color};font-weight:600">🌙 Rang maximum atteint !</span>`;
        } else if (rank.next) {
            const nextName = RANK_NAMES[rank.next.tier] || rank.next.tier;
            const nextLabel = `${nextName} ${rank.next.level}`;
            const nextLabelEl = document.getElementById('rank-next-label');
            const bonusBadge = document.getElementById('rank-bonus');
            if (nextLabelEl) nextLabelEl.textContent = `Prochain : ${nextLabel}`;
            if (bonusBadge) bonusBadge.textContent = `+${rank.next.bonus} 🪙`;
        }
    }
}

function renderStats(user, links) {
    const earned = document.getElementById('stat-earned');
    const spent = document.getElementById('stat-spent');
    const xp = document.getElementById('stat-xp');
    const games = document.getElementById('stat-games');
    const watchtime = document.getElementById('stat-watchtime');

    if (earned) earned.innerHTML = fmt(user.total_earned) + ' ' + coinImg();
    if (spent) spent.innerHTML = fmt(user.total_spent) + ' ' + coinImg();
    if (xp) xp.textContent = fmt(user.total_xp);
    if (games) games.textContent = user.games_played || 0;

    if (watchtime) {
        const wt = user.watchtime_minutes || 0;
        if (wt >= 60) {
            const h = Math.floor(wt / 60);
            const m = wt % 60;
            watchtime.textContent = `${h}h ${m}min`;
        } else {
            watchtime.textContent = `${wt} min`;
        }
    }

    const kickVal = document.getElementById('platform-kick');
    const kickBadge = document.getElementById('platform-kick-badge');
    const dliveVal = document.getElementById('platform-dlive');
    const dliveBadge = document.getElementById('platform-dlive-badge');

    if (links.kick) {
        if (kickVal) kickVal.textContent = links.kick;
        if (kickBadge) kickBadge.textContent = '✅';
    } else {
        if (kickVal) kickVal.textContent = 'Non lié';
        if (kickBadge) kickBadge.textContent = '❌';
    }

    if (links.dlive) {
        if (dliveVal) dliveVal.textContent = links.dlive;
        if (dliveBadge) dliveBadge.textContent = '✅';
    } else {
        if (dliveVal) dliveVal.textContent = 'Non lié';
        if (dliveBadge) dliveBadge.textContent = '❌';
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
        const sign = isPositive ? '+' : '';
        return `
            <div class="transaction-item">
                <span class="transaction-desc">${tx.description || tx.type}</span>
                <span class="transaction-amount ${isPositive ? 'positive' : 'negative'}">${sign}${fmt(tx.amount)} ${coinImg()}</span>
                <span class="transaction-date">${timeAgo(tx.created_at)}</span>
            </div>
        `;
    }).join('');
}

async function loadDashboard() {
    try {
        const res = await fetch('/api/dashboard/me');
        if (res.status === 401) {
            window.location.href = '/api/auth/discord/login';
            return;
        }
        if (!res.ok) throw new Error('Server error');

        const data = await res.json();
        renderHeader(data.user);
        renderRankCard(data.rank);
        renderStats(data.user, data.links);
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
