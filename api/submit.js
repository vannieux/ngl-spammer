export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { username, question, deviceId } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required.' });
    }

    // Appends a unique hash to prevent duplicate-message shadow blocking
    const randomHash = Math.random().toString(36).substring(2, 7);
    const uniqueQuestion = `${question} [${randomHash}]`;

    const payload = new URLSearchParams({
      username: username,
      question: uniqueQuestion,
      deviceId: deviceId || 'ff89eecc-15e6-4557-8a8e-51eac1b5f29f',
      gameSlug: '',
      referrer: ''
    });

    // Rotate User-Agent strings
    const userAgents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    ];
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

    const nglResponse = await fetch('https://ngl.link/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': randomUA
      },
      body: payload
    });

    const statusCode = nglResponse.status;
    return res.status(statusCode).json({
      success: nglResponse.ok,
      status: statusCode
    });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal proxy error' });
  }
}
