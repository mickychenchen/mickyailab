const express = require('express');
const app = express();
app.get('/ping', (req, res) => res.send('pong'));
app.listen(3002, '0.0.0.0', () => console.log('PORT_3002_ALIVE'));