const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(express.static('/home/ubuntu/mickyailab/public'));

// 簡化代理邏輯，直接透明轉發，不進行二次重寫以免 Vercel 混淆
app.use(['/api', '/beta/api'], createProxyMiddleware({
  target: 'https://mickyailab.vercel.app',
  changeOrigin: true,
  onProxyReq: (pReq, req) => {
    // 如果是 /beta/api，則修正路徑為 /api
    if (req.url.startsWith('/beta/api')) pReq.path = req.url.replace('/beta/api', '/api');
  }
}));

app.get(/^(?!\/api|\/beta\/api).*/, (req, res) => {
  res.sendFile('/home/ubuntu/mickyailab/public/index.html');
});

app.listen(3001, '0.0.0.0', () => console.log('V9_ULTIMATE_READY'));
