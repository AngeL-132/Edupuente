import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

const DB_PATH = './database.db';

export function getDB() {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) console.error('Error al abrir la base de datos:', err);
    else console.log('Conectado a SQLite en', DB_PATH);
  });
}

export function inicializarBaseDatos() {
  const db = getDB();
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      contrasena TEXT NOT NULL,
      creadoEn DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Tabla usuarios lista.');
  });
  return db;
}

export function crearUsuario(usuario, correo, contrasena) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    const hash = bcrypt.hashSync(contrasena, 10);
    const sql = 'INSERT INTO usuarios (usuario, correo, contrasena) VALUES (?, ?, ?)';
    db.run(sql, [usuario, correo, hash], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          if (err.message.includes('usuarios.usuario')) {
            return reject(new Error('El nombre de usuario ya existe'));
          }
          return reject(new Error('El correo electrónico ya está registrado'));
        }
        return reject(err);
      }
      resolve({ id: this.lastID, usuario, correo });
    });
  });
}

export function buscarUsuarioPorUsuario(usuario) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    db.get('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function compararContrasena(contrasenaPlana, contrasenaHasheada) {
  return bcrypt.compareSync(contrasenaPlana, contrasenaHasheada);
}
