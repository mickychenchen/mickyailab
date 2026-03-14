import axios from 'axios';

export default async function handler(req, res) {
    const { prompt, seed, width = 1024, height = 1024, model = 'flux' } = req.query;

    if (!prompt) {
        return res.status(400).send('Prompt is required');
    }

    // 官方推薦的生成端點
    const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&model=${model}&seed=${seed || Math.floor(Math.random() * 1000000)}`;

    console.log(`🚀 Vercel API 請求代理至: ${url}`);

    try {
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}`
            },
            responseType: 'stream',
            timeout: 60000 
        });

        // 轉發內容類型
        res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
        // 增加緩存控制（選用），可加速重複請求
        res.setHeader('Cache-Control', 's-maxage=86400'); 
        
        response.data.pipe(res);
    } catch (error) {
        console.error('❌ Vercel API 請求失敗:', error.message);
        if (error.response) {
            res.status(error.response.status).send('Pollinations API Error');
        } else {
            res.status(500).send('Internal Proxy Error');
        }
    }
}
