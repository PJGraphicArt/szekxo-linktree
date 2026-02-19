const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { pool } = require('./lib/db');

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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const filter = req.query.filter || 'all';
    const limit = 20;
    const offset = (page - 1) * limit;

    let whereExtra = '';
    if (filter === 'gains') whereExtra = ' AND amount > 0';
    else if (filter === 'depenses') whereExtra = ' AND amount < 0';
    else if (filter === 'watchtime') whereExtra = " AND type LIKE 'watchtime%'";

    try {
        const result = await pool.query(
            `SELECT amount, type, description, created_at
             FROM moon_coins_transactions
             WHERE user_id = $1${whereExtra}
             ORDER BY created_at DESC
             LIMIT $2 OFFSET $3`,
            [userId, limit + 1, offset]
        );

        const rows = result.rows;
        const hasMore = rows.length > limit;
        if (hasMore) rows.pop();

        return res.status(200).json({ transactions: rows, hasMore });
    } catch (err) {
        console.error('DB error in /api/transactions:', err);
        return res.status(500).json({ error: 'Internal server error', detail: err.message });
    }
};
