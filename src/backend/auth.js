import jwt from 'jsonwebtoken';
import { buscarUsuarioPorUsuario, compararContrasena } from './db.js';

const SECRET = 'edupuente_secret_key_2026';

export function generarToken(usuario) {
  return jwt.sign({ id: usuario.id, usuario: usuario.usuario }, SECRET, { expiresIn: '2h' });
}

export async function login(usuarioNombre, contrasena) {
  const usuario = await buscarUsuarioPorUsuario(usuarioNombre);
  if (!usuario) {
    throw new Error('Usuario o contraseña incorrectos');
  }
  const coincide = compararContrasena(contrasena, usuario.contrasena);
  if (!coincide) {
    throw new Error('Usuario o contraseña incorrectos');
  }
  const token = generarToken(usuario);
  return { token, usuario: usuario.usuario };
}

export function verificarToken(token) {
  return jwt.verify(token, SECRET);
}
