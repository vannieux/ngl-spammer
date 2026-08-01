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
    const { username, question } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required.' });
    }

    // Matches Python script payload
    const payload = new URLSearchParams({
      username: username,
      question: question || '',
      deviceId: '0', // Python script uses static '0'
      gameSlug: '',
      referrer: ''
    });

    // Exact headers from the Python script
    const headers = {
      'Host': 'ngl.link',
      'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      'accept': '*/*',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'x-requested-with': 'XMLHttpRequest',
      'sec-ch-ua-mobile': '?0',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      'sec-ch-ua-platform': '"Windows"',
      'origin': 'https://ngl.link',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': `https://ngl.link/${username}`,
      'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
    };

    const nglResponse = await fetch('https://ngl.link/api/submit', {
      method: 'POST',
      headers: headers,
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
