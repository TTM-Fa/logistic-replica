module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Vercel may or may not auto-parse body depending on content-type
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const password = body?.password;

  if (!password || password !== (process.env.AUTH_PASSWORD || '').trim()) {
    res.status(401).json({ error: 'Wrong password' });
    return;
  }

  const token = (process.env.AUTH_SECRET || '').trim();
  res.setHeader(
    'Set-Cookie',
    `_auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${60 * 60 * 24 * 30}`
  );
  res.status(200).json({ ok: true });
};
