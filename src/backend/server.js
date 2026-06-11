import express from 'express';
import cors from 'cors';
import { inicializarBaseDatos, crearUsuario } from './db.js';
import { login as loginAuth } from './auth.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensaje: 'Servidor Edupuente funcionando' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { usuario, correo, clave } = req.body;
    if (!usuario || !correo || !clave) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    if (clave.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    const resultado = await crearUsuario(usuario, correo, clave);
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: { id: resultado.id, usuario: resultado.usuario }
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { usuario, clave } = req.body;
    if (!usuario || !clave) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const resultado = await loginAuth(usuario, clave);
    res.json({ token: resultado.token, usuario: resultado.usuario });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(401).json({ error: err.message });
  }
});

inicializarBaseDatos();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
