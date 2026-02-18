const crypto = require('crypto');
const fetch = require('node-fetch');
const { pool } = require('../lib/db');
const { getAccessToken, refreshIfNeeded } = require('../lib/kickAuth');

// Cooldowns légers en mémoire (perdus entre invocations, acceptable pour le watch time)
const watchCooldowns = new Map();

async function sendKickMessage(message) {
    await refreshIfNeeded();
    const token = await getAccessToken();
    await fetch('https://api.kick.com/public/v1/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access_token}`
        },
        body: JSON.stringify({
            broadcaster_user_id: parseInt(process.env.KICK_BROADCASTER_ID),
            content: message,
            type: 'bot'
        })
    });
}

async function resolveUserId(senderId, senderUsername) {
    const { rows } = await pool.query(
        'SELECT discord_id FROM platform_links WHERE platform = $1 AND platform_username = $2',
        ['kick', senderUsername]
    );
    return rows.length ? rows[0].discord_id : `kick:${senderId}`;
}

async function getOrCreateBalance(userId) {
    const { rows } = await pool.query('SELECT balance FROM moon_coins_balance WHERE user_id = $1', [userId]);
    if (rows.length) return rows[0].balance;
    await pool.query(
        'INSERT INTO moon_coins_balance (user_id, username, balance, total_earned) VALUES ($1, $2, 0, 0) ON CONFLICT DO NOTHING',
        [userId, userId]
    );
    return 0;
}

async function addCoins(userId, amount, type, description) {
    await pool.query(`
        INSERT INTO moon_coins_balance (user_id, username, balance, total_earned)
        VALUES ($1, $1, $2, $2)
        ON CONFLICT (user_id) DO UPDATE SET
            balance = moon_coins_balance.balance + $2,
            total_earned = moon_coins_balance.total_earned + GREATEST($2, 0)
    `, [userId, amount]);
    await pool.query(
        'INSERT INTO moon_coins_transactions (user_id, amount, type, description) VALUES ($1, $2, $3, $4)',
        [userId, amount, type, description]
    );
}

async function handleCommand(command, args, userId, username) {
    if (command === '!mooncoins') {
        const balance = await getOrCreateBalance(userId);
        await sendKickMessage(`@${username} 🪙 You have ${balance} Moon Coins!`);

    } else if (command === '!daily') {
        // Cooldown 24h en DB
        const { rows } = await pool.query(`
            SELECT created_at FROM moon_coins_transactions
            WHERE user_id = $1 AND type = 'daily'
            ORDER BY created_at DESC LIMIT 1
        `, [userId]);

        if (rows.length) {
            const lastDaily = new Date(rows[0].created_at);
            const hoursSince = (Date.now() - lastDaily.getTime()) / (1000 * 3600);
            if (hoursSince < 24) {
                const hoursLeft = Math.ceil(24 - hoursSince);
                await sendKickMessage(`@${username} ⏳ Come back in ${hoursLeft}h for your daily bonus!`);
                return;
            }
        }

        await addCoins(userId, 50, 'daily', 'Daily bonus');
        await sendKickMessage(`@${username} 🎉 You received +50 Moon Coins! Daily bonus claimed!`);

    } else if (command === '!gamble') {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) {
            await sendKickMessage(`@${username} ❌ Usage: !gamble <amount>`);
            return;
        }

        const balance = await getOrCreateBalance(userId);
        if (balance < amount) {
            await sendKickMessage(`@${username} ❌ Not enough Moon Coins! You have ${balance} 🪙`);
            return;
        }

        const win = Math.random() < 0.5;
        const delta = win ? amount : -amount;
        await addCoins(userId, delta, 'gamble', `Gamble ${win ? 'win' : 'loss'}`);
        const newBalance = balance + delta;

        if (win) {
            await sendKickMessage(`@${username} 🎰 You WON +${amount} Moon Coins! New balance: ${newBalance} 🪙`);
        } else {
            await sendKickMessage(`@${username} 💸 You LOST ${amount} Moon Coins! New balance: ${newBalance} 🪙`);
        }

    } else if (command === '!top') {
        const { rows } = await pool.query(
            'SELECT username, balance FROM moon_coins_balance ORDER BY balance DESC LIMIT 5'
        );
        const leaderboard = rows.map((r, i) => `#${i + 1} ${r.username}: ${r.balance} 🪙`).join(' | ');
        await sendKickMessage(`🏆 Top 5: ${leaderboard}`);

    } else if (command === '!discord') {
        await sendKickMessage(`👉 Join the Discord: https://discord.gg/QPpGyhN4rU`);
    }
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    // 1. Vérifier la signature HMAC-SHA256
    const signature = req.headers['kick-event-signature'];
    const secret = process.env.KICK_WEBHOOK_SECRET;
    const body = JSON.stringify(req.body);
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (signature !== expected) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const eventType = req.headers['kick-event-type'];

    if (eventType === 'chat.message.sent') {
        const { sender, content } = req.body;
        if (!sender || !content) return res.status(200).json({ ok: true });

        const userId = await resolveUserId(sender.id, sender.username);

        // Mettre à jour la watch session
        await pool.query(`
            INSERT INTO moon_coins_watch_sessions (user_id, platform, started_at, last_seen)
            VALUES ($1, 'kick', NOW(), NOW())
            ON CONFLICT (user_id, platform) DO UPDATE SET last_seen = NOW()
        `, [userId]);

        if (content.startsWith('!')) {
            const parts = content.trim().split(/\s+/);
            const command = parts[0].toLowerCase();
            const args = parts.slice(1);
            await handleCommand(command, args, userId, sender.username);
        } else {
            // +5 coins par message (cooldown 2 min en mémoire)
            const lastMessage = watchCooldowns.get(userId);
            const now = Date.now();
            if (!lastMessage || now - lastMessage > 2 * 60 * 1000) {
                watchCooldowns.set(userId, now);
                await addCoins(userId, 5, 'watch', 'Watch time reward');
            }
        }
    }

    return res.status(200).json({ ok: true });
};
