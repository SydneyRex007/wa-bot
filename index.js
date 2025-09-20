const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
let qrCodeData = "QR not generated yet";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true } // keeps it lightweight on Render
});

// Generate QR
client.on('qr', async (qr) => {
  qrCodeData = await qrcode.toDataURL(qr);
  console.log("📱 Open /qr in your browser to scan QR");
});

// When bot is ready
client.on('ready', () => {
  console.log('✅ Bot is ready!');
});

// Log every message
client.on('message', msg => {
  console.log(`💬 Message received: ${msg.body}`);

  // Reply to !ping
  if (msg.body === '!ping') {
    msg.reply('pong 🏓');
  }
});

// Start bot
client.initialize();

// Web server
app.get('/', (req, res) => res.send('Bot is running'));
app.get('/qr', (req, res) => {
  res.send(`<h2>Scan this QR with WhatsApp</h2><img src="${qrCodeData}" />`);
});
app.listen(process.env.PORT || 3000, () => {
  console.log("🌍 Web server running");
});
