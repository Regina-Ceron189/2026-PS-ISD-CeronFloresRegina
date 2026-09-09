const net = require('net');

const PORT = 5000;
const clientes = new Map();
let siguienteId = 1;

function broadcast(mensaje) {

}

const servidor = net.createServer((socket) => {
  const id = siguienteId++;
  clientes.set(id, socket);
  console.log(`[conexión] Cliente #${id} conectado (${clientes.size} conectados en total)`);

  socket.write(`Bienvenido, eres el cliente #${id}. Conectados: ${clientes.size}\n`);

  socket.on('data', (datos) => {
    const mensaje = datos.toString().trim();
    console.log(`[cliente #${id}] dice: ${mensaje}`);
    socket.write(`Eco del servidor: ${mensaje}\n`);
  });

  socket.on('close', () => {
    clientes.delete(id);
    console.log(`[desconexión] Cliente #${id} se desconectó (${clientes.size} conectados restantes)`);
  });

  socket.on('error', (error) => {
    console.error(`[error] Cliente #${id}:`, error.message);
  });
});

servidor.listen(PORT, () => {
  console.log(`Servidor de sockets escuchando en el puerto ${PORT}`);
});
