const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
    try {
        const { code } = req.query;
        if (!code) return res.status(400).send('Missing code');

        // Vérifier les variables d'env
        if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET || !process.env.DISCORD_REDIRECT_URI) {
            console.error('Missing Discord env vars');
            return res.status(500).send('Server misconfiguration: missing Discord env vars');
        }
        if (!process.env.JWT_SECRET) {
            console.error('Missing JWT_SECRET env var');
            return res.status(500).send('Server misconfiguration: missing JWT_SECRET');
        }

        // 1. Échanger le code contre un access_token Discord
        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI
            })
        });

        if (!tokenRes.ok) {
            const err = await tokenRes.text();
            console.error('Discord token error:', err);
            return res.status(500).send('Failed to get Discord token: ' + err);
        }
        const tokenData = await tokenRes.json();

        // 2. Récupérer les infos de l'utilisateur Discord
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });

        if (!userRes.ok) {
            const err = await userRes.text();
            console.error('Discord user error:', err);
            return res.status(500).send('Failed to get Discord user');
        }
        const user = await userRes.json();

        // 3. Créer le JWT
        const token = jwt.sign(
            { discordId: user.id, username: user.username, avatar: user.avatar },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 4. Écrire le cookie httpOnly et rediriger
        res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 3600}; Path=/`);
        res.redirect('/dashboard.html');

    } catch (err) {
        console.error('Discord callback error:', err);
        res.status(500).send('Internal error: ' + err.message);
    }
};
