const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { pool } = require('../lib/db');

const OUTCOME_DESCRIPTIONS = {
    win:       '🎉 Gain Blackjack',
    blackjack: '🌙 Blackjack naturel ×2.5',
    push:      '🤝 Égalité — Remboursement',
};

module.exports = async function handler(req, res) {
    const { action } = req.query;

    // ── Auth ────────────────────────────────────
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

    // ── GET /api/blackjack/balance ───────────────
    if (action === 'balance') {
        if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
        try {
            const result = await pool.query(
                'SELECT balance FROM moon_coins_balance WHERE user_id = $1',
                [userId]
            );
            return res.status(200).json({ balance: result.rows[0]?.balance ?? 0 });
        } catch (err) {
            console.error('DB error in /api/blackjack/balance:', err);
            return res.status(500).json({ error: 'Internal server error', detail: err.message });
        }
    }

    // ── POST /api/blackjack/bet ──────────────────
    if (action === 'bet') {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const { amount } = req.body;
        if (!amount || !Number.isInteger(amount) || amount < 1 || amount > 10000) {
            return res.status(400).json({ error: 'Mise invalide' });
        }
        try {
            const result = await pool.query(
                `UPDATE moon_coins_balance
                 SET balance = balance - $2
                 WHERE user_id = $1 AND balance >= $2
                 RETURNING balance`,
                [userId, amount]
            );
            if (result.rowCount === 0) {
                return res.status(400).json({ error: 'Solde insuffisant' });
            }
            await pool.query(
                `INSERT INTO moon_coins_transactions (user_id, amount, type, description)
                 VALUES ($1, $2, 'blackjack', $3)`,
                [userId, -amount, `Mise Blackjack (${amount} 🌙)`]
            );
            return res.status(200).json({ ok: true, balance: result.rows[0].balance });
        } catch (err) {
            console.error('DB error in /api/blackjack/bet:', err);
            return res.status(500).json({ error: 'Internal server error', detail: err.message });
        }
    }

    // ── POST /api/blackjack/result ───────────────
    if (action === 'result') {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const { outcome, bet, payout } = req.body;
        if (!['win', 'blackjack', 'push', 'lose'].includes(outcome)) {
            return res.status(400).json({ error: 'Résultat invalide' });
        }
        if (!Number.isInteger(bet) || bet < 1 || bet > 10000) {
            return res.status(400).json({ error: 'Mise invalide' });
        }
        if (!Number.isInteger(payout) || payout < 0) {
            return res.status(400).json({ error: 'Payout invalide' });
        }
        try {
            let newBalance;
            if (payout > 0) {
                const result = await pool.query(
                    `UPDATE moon_coins_balance
                     SET balance = balance + $2
                     WHERE user_id = $1
                     RETURNING balance`,
                    [userId, payout]
                );
                newBalance = result.rows[0]?.balance ?? 0;
                await pool.query(
                    `INSERT INTO moon_coins_transactions (user_id, amount, type, description)
                     VALUES ($1, $2, 'blackjack', $3)`,
                    [userId, payout, OUTCOME_DESCRIPTIONS[outcome]]
                );
            } else {
                const result = await pool.query(
                    'SELECT balance FROM moon_coins_balance WHERE user_id = $1',
                    [userId]
                );
                newBalance = result.rows[0]?.balance ?? 0;
            }
            return res.status(200).json({ balance: newBalance, outcome });
        } catch (err) {
            console.error('DB error in /api/blackjack/result:', err);
            return res.status(500).json({ error: 'Internal server error', detail: err.message });
        }
    }

    return res.status(404).json({ error: 'Unknown action' });
};
