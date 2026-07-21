import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegistering
      ? 'http://localhost:8000/api/register/'
      : 'http://localhost:8000/api/login/';

    try {
      const response = await axios.post(url, {
        username,
        password,
      });

      console.log("Respuesta del servidor:", response.data);

      if (isRegistering) {
        setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
      } else {
        if (response.data.access) {
          // Guardar token
          localStorage.setItem('token', response.data.access);

          // Actualizar estado
          setToken(response.data.access);

          setMessage('Inicio de sesión exitoso.');
        } else {
          setMessage('No se recibió el token del servidor.');
        }
      }
    } catch (error) {
      console.error("Error completo:", error);

      if (error.response) {
        console.error("Respuesta:", error.response.data);
        setMessage(
          error.response.data.detail ||
          error.response.data.error ||
          'Hubo un error. Verifica tus datos.'
        );
      } else {
        setMessage('No se pudo conectar con el servidor.');
      }
    }
  };

  return (
    <div>
      <h1 className="cecyflix-logo">CECYFLIX</h1>

      <h2>{isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isRegistering ? 'Registrarse' : 'Ingresar'}
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        {isRegistering ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
        <span
          onClick={() => {
            setIsRegistering(!isRegistering);
            setMessage('');
          }}
          style={{ color: '#e50914', cursor: 'pointer' }}
        >
          {isRegistering ? 'Inicia sesión' : 'Regístrate'}
        </span>
      </p>
    </div>
  );
};

export default Login;