module.exports = function handler(req, res) {
    res.setHeader('Set-Cookie', 'session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/');
    res.redirect('/');
};
