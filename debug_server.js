const express = require('express');
const path = require('path');
const app = express();
app.use(express.static('public'));
app.get('/health', (req, res) => res.send('OK'));
app.listen(3001, '0.0.0.0', () => console.log('DEBUG_SERVER_LIVE'));