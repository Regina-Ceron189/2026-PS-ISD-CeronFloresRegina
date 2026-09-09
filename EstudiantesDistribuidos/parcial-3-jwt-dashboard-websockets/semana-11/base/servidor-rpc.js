const http = require('http');

const PORT = 5100;

const metodos = {

};

const servidor = http.createServer((req, res) => {

});

servidor.listen(PORT, () => {
  console.log(`Servidor RPC escuchando en el puerto ${PORT}`);
});
