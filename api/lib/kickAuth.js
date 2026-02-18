const fetch = require('node-fetch');
const { pool } = require('./db');

async function getAccessToken() {
    const { rows } = await pool.query('SELECT access_token, refresh_token, expires_at FROM kick_tokens WHERE id = 1');
    if (!rows.length) throw new Error('No Kick token found in DB');
    return rows[0];
}

async function saveTokens(accessToken, refreshToken, expiresIn) {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    await pool.query(`
        INSERT INTO kick_tokens (id, access_token, refresh_token, expires_at)
        VALUES (1, $1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET
            access_token = EXCLUDED.access_token,
            refresh_token = EXCLUDED.refresh_token,
            expires_at = EXCLUDED.expires_at
    `, [accessToken, refreshToken, expiresAt]);
}

async function refreshIfNeeded() {
    const token = await getAccessToken();
    const expiresAt = new Date(token.expires_at);
    const nowPlus60 = new Date(Date.now() + 60 * 1000);

    if (expiresAt > nowPlus60) return; // Pas besoin de refresh

    const res = await fetch('https://id.kick.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.KICK_CLIENT_ID,
            client_secret: process.env.KICK_CLIENT_SECRET,
            refresh_token: token.refresh_token
        })
    });

    if (!res.ok) throw new Error('Failed to refresh Kick token');
    const data = await res.json();
    await saveTokens(data.access_token, data.refresh_token, data.expires_in);
}

module.exports = { getAccessToken, saveTokens, refreshIfNeeded };
