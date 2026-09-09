const net = require('net');

const PORT = 5000;
const clientes = new Map();

const servidor = net.createServer((socket) => {

});

servidor.listen(PORT, () => {
  console.log(`Servidor de sockets escuchando en el puerto ${PORT}`);
});
