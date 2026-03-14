const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.get('/generate-image', async (req, res) => {
    const { prompt, seed, width = 1024, height = 1024, model = 'flux' } = req.query;

    if (!prompt) {
        return res.status(400).send('Prompt is required');
    }

    // 使用官方推薦的生成端點以獲取原始圖片數據
    const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&model=${model}&seed=${seed || Math.floor(Math.random() * 1000000)}`;

    console.log(`🚀 代理請求至: ${url}`);

    try {
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}`
            },
            responseType: 'stream',
            timeout: 60000 // 1 minute timeout for image generation
        });

        // 轉發內容類型 (應該是 image/png 或 image/jpeg)
        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        console.error('❌ 請求失敗:', error.message);
        if (error.response) {
            res.status(error.response.status).send('Pollinations API Error');
        } else {
            res.status(500).send('Internal Proxy Error');
        }
    }
});

app.listen(port, () => {
    console.log(`✅ 圖片代理伺服器已啟動於 http://localhost:${port}`);
});
