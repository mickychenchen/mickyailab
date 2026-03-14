require('dotenv').config();
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');

const prompt = process.argv[2] || 'A cybernetic dragon in a neon vault';
const filename = `images/gallery-${Date.now()}.png`;
const seed = Math.floor(Math.random() * 1000000);
const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&enhance=true&seed=${seed}`;

console.log(`🚀 啟動穩定版生圖流: ${prompt}`);

https.get(url, (res) => {
    if (res.statusCode !== 200) return console.error(`❌ 伺服器異常: ${res.statusCode}`);
    const fileStream = fs.createWriteStream(filename);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ 圖片下載成功: ${filename}`);
        let images = [];
        try { if (fs.existsSync('images.json')) images = JSON.parse(fs.readFileSync('images.json')); } catch(e) { images = []; }
        images.push({ path: filename, prompt: prompt, date: new Date().toLocaleString() });
        fs.writeFileSync('images.json', JSON.stringify(images, null, 2));
        // console.log(`🔄 正在同步至 GitHub...`);
        // exec(`git add . && git commit -m "feat: new artwork ${seed}" && git push`, (err) => {
        //     if (err) console.log('⚠️ 同步略過或發生錯誤');
        //     else console.log('🚀 畫廊已更新！請刷新您的網頁。');
        // });
        console.log('💡 注意：此腳本會將圖片存至伺服端。對於 GitHub Push 流程，請優先使用 web 介面及本地代理伺服器。');
    });
}).on('error', (e) => console.error(`❌ 連線失敗: ${e.message}`));
