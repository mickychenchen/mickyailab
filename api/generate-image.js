export default async function handler(req, res) {
    const { prompt, seed, width = 1024, height = 1024, model = 'flux' } = req.query;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.POLLINATIONS_API_KEY) {
        console.error('❌ Missing POLLINATIONS_API_KEY in environment variables');
        return res.status(500).json({ 
            error: 'Server configuration error: Missing API Key',
            message: '請在 Vercel 控制面板中設定 POLLINATIONS_API_KEY 環境變數。' 
        });
    }

    const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&model=${model}&seed=${seed || Math.floor(Math.random() * 1000000)}`;

    console.log(`🚀 Vercel API 請求代理至: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Pollinations API 報錯 (${response.status}):`, errorText);
            return res.status(response.status).json({ 
                error: 'Pollinations AI API Error',
                status: response.status 
            });
        }

        // 轉發內容類型
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');

        // 使用 ReadableStream 讀取並寫入 response
        const reader = response.body.getReader();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
        }
        
        res.end();
    } catch (error) {
        console.error('❌ 伺服器代理髮生錯誤:', error.message);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
