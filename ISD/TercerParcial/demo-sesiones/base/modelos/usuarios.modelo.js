
// Consultas a la tabla usuarios. Siempre con ? (consulta parametrizada), nunca pegando texto en el SQL.
const bcrypt = require('bcryptjs');

function crearModeloUsuarios(pool) {
  // Regresa el usuario (sin el hash) si la contraseña es correcta, o null si no.
  async function verificar(usuario, contrasena) {
    const [filas] = await pool.execute(
      'SELECT id, usuario, nombre, rol, contrasena_hash FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    if (filas.length === 0) {
      return null;
    }

    const encontrado = filas[0];

    const correcta = await bcrypt.compare(
      contrasena,
      encontrado.contrasena_hash
    );

    if (!correcta) {
      return null;
    }

    const { contrasena_hash, ...datosUsuario } = encontrado;

    return datosUsuario;
  }

  return { verificar };
}

module.exports = { crearModeloUsuarios };