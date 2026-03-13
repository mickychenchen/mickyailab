require('dotenv').config();
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');
const API_KEY = process.env.POLLINATIONS_API_KEY;
const prompt = process.argv[2] || 'A futuristic laboratory';
const filename = `images/gallery-${Date.now()}.png`;
const options = {
    hostname: 'image.pollinations.ai',
    path: `/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&enhance=true`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${API_KEY}` }
};
console.log(`🚀 授權生圖中: ${prompt}`);
const req = https.request(options, (res) => {
    if (res.statusCode !== 200) return console.error(`❌ API 錯誤: ${res.statusCode}`);
    const fileStream = fs.createWriteStream(filename);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
        fileStream.close();
        let images = [];
        if (fs.existsSync('images.json')) images = JSON.parse(fs.readFileSync('images.json'));
        images.push({ path: filename, prompt: prompt, date: new Date().toLocaleString() });
        fs.writeFileSync('images.json', JSON.stringify(images, null, 2));
        exec(`git add . && git commit -m "feat: new art - ${prompt}" && git push`);
        console.log(`✅ 成功並已同步: ${filename}`);
    });
});
req.on('error', (e) => console.error(e));
req.end();
