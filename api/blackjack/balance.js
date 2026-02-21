const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { pool } = require('../lib/db');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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
        const result = await pool.query(
            'SELECT balance FROM moon_coins_balance WHERE user_id = $1',
            [userId]
        );
        const balance = result.rows[0]?.balance ?? 0;
        return res.status(200).json({ balance });
    } catch (err) {
        console.error('DB error in /api/blackjack/balance:', err);
        return res.status(500).json({ error: 'Internal server error', detail: err.message });
    }
};
