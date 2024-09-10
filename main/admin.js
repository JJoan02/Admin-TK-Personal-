import { Client } from 'whatsapp-web.js';
import { handleMessage } from '../handler/messageHandler.js';
import qrcode from 'qrcode-terminal';
import config from '../config/config.js';
import fs from 'fs';

export async function startBot() {
  // Cargar la sesión de forma dinámica si existe
  let session = undefined;
  if (fs.existsSync(config.sessionPath)) {
    session = await import(config.sessionPath).then(module => module.default);
  }

  // Crear la instancia del cliente
  const client = new Client({
    session: session,
    puppeteer: { headless: true } // Ejecuta el navegador en segundo plano
  });

  // Mostrar el código QR en consola cuando el cliente esté listo
  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  // Guardar la sesión cuando se autentique el cliente
  client.on('authenticated', (session) => {
    fs.writeFileSync(config.sessionPath, JSON.stringify(session));
  });

  // Manejar mensajes
  client.on('message', handleMessage);

  // Inicializar el cliente
  client.initialize();
}
