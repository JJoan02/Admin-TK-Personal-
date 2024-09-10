export async function handleMessage(message) {
  // Lógica para manejar mensajes
  if (message.body === 'ping') {
    message.reply('pong');
  }
}
