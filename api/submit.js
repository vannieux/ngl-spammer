export default async function handler(req, res) {
  // CORS Headers for internal API route handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight options request
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

    const payload = new URLSearchParams({
      username: username,
      question: question || '',
      deviceId: deviceId || 'ff89eecc-15e6-4557-8a8e-51eac1b5f29f',
      gameSlug: '',
      referrer: ''
    });

    // Send backend-to-backend HTTP request
    const nglResponse = await fetch('https://ngl.link/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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