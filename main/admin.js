import { Client } from 'whatsapp-web.js';
import { handleMessage } from '../handler/messageHandler.js';
import qrcode from 'qrcode-terminal';
import config from '../config/config.js';
import fs from 'fs';

export function startBot(config) {
  const client = new Client({
    session: fs.existsSync(config.sessionPath) ? require(config.sessionPath) : undefined,
    puppeteer: { headless: true }
  });

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on('authenticated', (session) => {
    fs.writeFileSync(config.sessionPath, JSON.stringify(session));
  });

  client.on('message', handleMessage);

  client.initialize();
}
