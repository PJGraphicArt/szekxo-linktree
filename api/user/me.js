const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { pool } = require('../lib/db');

module.exports = async function handler(req, res) {
    // 1. Parser le cookie session
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.session;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // 2. Vérifier le JWT
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = payload.discordId;

    try {
        // 3. Requêtes DB en parallèle
        const [balanceResult, txResult, linksResult] = await Promise.all([
            pool.query('SELECT balance, total_earned FROM moon_coins_balance WHERE user_id = $1', [userId]),
            pool.query(
                'SELECT amount, type, description, created_at FROM moon_coins_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 15',
                [userId]
            ),
            pool.query('SELECT platform, platform_username FROM platform_links WHERE discord_id = $1', [userId])
        ]);

        const balanceRow = balanceResult.rows[0] || { balance: 0, total_earned: 0 };

        // Formater les plateformes liées
        const links = { kick: null, dlive: null };
        for (const row of linksResult.rows) {
            if (row.platform === 'kick') links.kick = row.platform_username;
            if (row.platform === 'dlive') links.dlive = row.platform_username;
        }

        return res.status(200).json({
            user: {
                discordId: payload.discordId,
                username: payload.username,
                avatar: payload.avatar
            },
            balance: balanceRow.balance,
            total_earned: balanceRow.total_earned,
            transactions: txResult.rows,
            links
        });
    } catch (err) {
        console.error('DB error in /api/user/me:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
