// api/index.js
const serverless = require('serverless-http');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API root — serverless is working' });
});

module.exports = serverless(app);
