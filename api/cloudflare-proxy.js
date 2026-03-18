const axios = require('axios');

module.exports = async (req, res) => {
  const { prompt } = req.body;
  const ACCOUNT_ID = process.env.ACCOUNT_ID;
  const API_TOKEN = process.env.WORKERS_AI_API;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await axios({
      url: `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_TOKEN}` },
      data: { prompt },
      responseType: 'arraybuffer'
    });

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    res.status(200).json({ image: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    res.status(500).json({ error: 'Cloudflare API failed', details: error.message });
  }
};
