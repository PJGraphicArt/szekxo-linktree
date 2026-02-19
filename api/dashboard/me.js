const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { pool } = require('../lib/db');

const RANKS = [
    { tier: 'bronze',   level: 5, xp_required: 0,        bonus: 0     },
    { tier: 'bronze',   level: 4, xp_required: 500,       bonus: 30    },
    { tier: 'bronze',   level: 3, xp_required: 1400,      bonus: 30    },
    { tier: 'bronze',   level: 2, xp_required: 2900,      bonus: 30    },
    { tier: 'bronze',   level: 1, xp_required: 5400,      bonus: 30    },
    { tier: 'argent',   level: 5, xp_required: 9400,      bonus: 200   },
    { tier: 'argent',   level: 4, xp_required: 15400,     bonus: 75    },
    { tier: 'argent',   level: 3, xp_required: 24400,     bonus: 75    },
    { tier: 'argent',   level: 2, xp_required: 37400,     bonus: 75    },
    { tier: 'argent',   level: 1, xp_required: 55400,     bonus: 75    },
    { tier: 'or',       level: 5, xp_required: 80400,     bonus: 500   },
    { tier: 'or',       level: 4, xp_required: 115400,    bonus: 150   },
    { tier: 'or',       level: 3, xp_required: 163400,    bonus: 150   },
    { tier: 'or',       level: 2, xp_required: 228400,    bonus: 150   },
    { tier: 'or',       level: 1, xp_required: 313400,    bonus: 150   },
    { tier: 'emeraude', level: 5, xp_required: 423400,    bonus: 1000  },
    { tier: 'emeraude', level: 4, xp_required: 568400,    bonus: 300   },
    { tier: 'emeraude', level: 3, xp_required: 758400,    bonus: 300   },
    { tier: 'emeraude', level: 2, xp_required: 1003400,   bonus: 300   },
    { tier: 'emeraude', level: 1, xp_required: 1313400,   bonus: 300   },
    { tier: 'diamant',  level: 5, xp_required: 1703400,   bonus: 2000  },
    { tier: 'diamant',  level: 4, xp_required: 2203400,   bonus: 500   },
    { tier: 'diamant',  level: 3, xp_required: 2853400,   bonus: 500   },
    { tier: 'diamant',  level: 2, xp_required: 3683400,   bonus: 500   },
    { tier: 'diamant',  level: 1, xp_required: 4733400,   bonus: 500   },
    { tier: 'lunar',    level: 1, xp_required: 6083400,   bonus: 10000 },
];

function getRankFromXP(xp) {
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (xp >= r.xp_required) rank = r;
        else break;
    }
    return rank;
}

function getNextRank(current) {
    const idx = RANKS.findIndex(r => r.tier === current.tier && r.level === current.level);
    return RANKS[idx + 1] || null;
}

function getProgressPercent(xp, current, next) {
    if (!next) return 100;
    const into = xp - current.xp_required;
    const needed = next.xp_required - current.xp_required;
    return Math.min(100, Math.floor((into / needed) * 100));
}

module.exports = async function handler(req, res) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.session;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = payload.discordId;

    try {
        const [userRow, statsRow, txRow, linksRow] = await Promise.all([
            pool.query(
                'SELECT balance, total_earned, COALESCE(total_xp,0) AS total_xp, COALESCE(rank_tier,\'bronze\') AS rank_tier, COALESCE(rank_level,5) AS rank_level FROM moon_coins_balance WHERE user_id = $1',
                [userId]
            ),
            pool.query(
                `SELECT
                    COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0) AS total_spent,
                    COUNT(CASE WHEN type = 'gamble' THEN 1 END)::int AS games_played,
                    COUNT(CASE WHEN type LIKE 'watchtime%' THEN 1 END)::int AS watchtime_txs
                 FROM moon_coins_transactions WHERE user_id = $1`,
                [userId]
            ),
            pool.query(
                'SELECT amount, type, description, created_at FROM moon_coins_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3',
                [userId]
            ),
            pool.query(
                'SELECT platform, platform_username FROM platform_links WHERE discord_id = $1',
                [userId]
            ),
        ]);

        const u = userRow.rows[0] || { balance: 0, total_earned: 0, total_xp: 0, rank_tier: 'bronze', rank_level: 5 };
        const s = statsRow.rows[0] || { total_spent: 0, games_played: 0, watchtime_txs: 0 };

        const totalXp = parseInt(u.total_xp) || 0;
        const currentRank = getRankFromXP(totalXp);
        const nextRank = getNextRank(currentRank);
        const progressPercent = getProgressPercent(totalXp, currentRank, nextRank);

        const links = { kick: null, dlive: null };
        for (const row of linksRow.rows) {
            if (row.platform === 'kick') links.kick = row.platform_username;
            if (row.platform === 'dlive') links.dlive = row.platform_username;
        }

        return res.status(200).json({
            user: {
                discordId: payload.discordId,
                username: payload.username,
                avatar: payload.avatar,
                balance: u.balance || 0,
                total_xp: totalXp,
                rank_tier: currentRank.tier,
                rank_level: currentRank.level,
                total_earned: u.total_earned || 0,
                total_spent: parseInt(s.total_spent) || 0,
                games_played: parseInt(s.games_played) || 0,
                watchtime_minutes: (parseInt(s.watchtime_txs) || 0) * 2,
            },
            rank: {
                current: currentRank,
                next: nextRank,
                progress_percent: progressPercent,
                xp_current: totalXp,
                xp_next: nextRank ? nextRank.xp_required : currentRank.xp_required,
            },
            transactions: txRow.rows,
            links,
        });
    } catch (err) {
        console.error('DB error in /api/dashboard/me:', err);
        return res.status(500).json({ error: 'Internal server error', detail: err.message });
    }
};
