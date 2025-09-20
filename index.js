const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
let qrCodeData = "QR not generated yet";

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', async (qr) => {
  qrCodeData = await qrcode.toDataURL(qr); // make QR as an image
  console.log("📱 Open /qr in your browser to scan QR");
});

client.on('ready', () => {
  console.log('✅ Bot is ready!');
});

client.on('message', async msg => {
  if (msg.body === '!ping') {
    await msg.reply('pong 🏓');
  }
});

client.initialize();

// simple web server
app.get('/', (req, res) => res.send('Bot is running'));
app.get('/qr', (req, res) => {
  res.send(`<h2>Scan this QR with WhatsApp</h2><img src="${qrCodeData}" />`);
});
app.listen(process.env.PORT || 3000, () => {
  console.log("🌍 Web server running");
});
