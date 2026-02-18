const fetch = require('node-fetch');
const { saveTokens } = require('../../lib/kickAuth');

module.exports = async function handler(req, res) {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'Missing code' });

    const tokenRes = await fetch('https://id.kick.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.KICK_CLIENT_ID,
            client_secret: process.env.KICK_CLIENT_SECRET,
            code,
            redirect_uri: process.env.KICK_REDIRECT_URI
        })
    });

    if (!tokenRes.ok) {
        const err = await tokenRes.text();
        console.error('Kick token error:', err);
        return res.status(500).json({ error: 'Failed to get Kick token' });
    }

    const data = await tokenRes.json();
    await saveTokens(data.access_token, data.refresh_token, data.expires_in);

    return res.status(200).json({ ok: true, message: 'Kick connected!' });
};
