const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');

const prompt = process.argv[2] || 'A futuristic laboratory';
const isFavicon = process.argv[3] === 'favicon';
const filename = isFavicon ? 'favicon.png' : 'images/gallery-' + Date.now() + '.png';
const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}`;

console.log(`🎨 正在生成: ${prompt}`);

https.get(url, (res) => {
    const fileStream = fs.createWriteStream(filename);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ 成功! 儲存至: ${filename}`);
        if (!isFavicon) {
            console.log('🚀 同步至 GitHub...');
            exec(`git add . && git commit -m "feat: add artwork - ${prompt}" && git push`, (err) => {
                if (err) console.error('❌ 同步失敗');
                else console.log('🌐 網頁已更新!');
            });
        }
    });
});
