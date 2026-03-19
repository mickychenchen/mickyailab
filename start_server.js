const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const PORT = 3001;

// 1. Static Files serving
app.use(express.static(path.join(__dirname, 'public')));

// 2. API Proxy logic
app.use('/api', createProxyMiddleware({
    target: 'https://mickyailab.vercel.app',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' }
}));

// 3. Ultra-stable Catch-all for SPA
app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        next();
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('Micky AI Lab V4.4 (Stable) listening on port ' + PORT);
});
