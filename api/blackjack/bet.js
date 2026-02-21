const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { pool } = require('../lib/db');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    const { amount } = req.body;

    if (!amount || !Number.isInteger(amount) || amount < 1 || amount > 10000) {
        return res.status(400).json({ error: 'Mise invalide' });
    }

    try {
        // Atomic debit: only deducts if sufficient balance
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

        const newBalance = result.rows[0].balance;

        // Log the bet transaction
        await pool.query(
            `INSERT INTO moon_coins_transactions (user_id, amount, type, description)
             VALUES ($1, $2, 'blackjack', $3)`,
            [userId, -amount, `Mise Blackjack (${amount} 🌙)`]
        );

        return res.status(200).json({ ok: true, balance: newBalance });
    } catch (err) {
        console.error('DB error in /api/blackjack/bet:', err);
        return res.status(500).json({ error: 'Internal server error', detail: err.message });
    }
};
