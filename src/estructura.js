const API_URL = 'http://localhost:3000/api';

const loginForm = document.getElementById('loginForm');
const usuarioInput = document.getElementById('usuario');
const claveInput = document.getElementById('clave');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = loginForm.usuario.value.trim();
    const clave = loginForm.clave.value.trim();

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, clave }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Error al iniciar sesión');
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('nombreUsuario', data.usuario);

      alert('Inicio de sesión exitoso');
      window.location.href = 'panel.html';
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  });
}