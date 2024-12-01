import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/InicioSesion.css";
import Image from "../../assets/images/portada_ia.png";
import { iniciarSesion } from "../../servicios/ServicioAutenticacion";

const InicioSesion = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { token } = await iniciarSesion(username, password); // Llama al servicio
      localStorage.setItem("jwtToken", token); // Guarda el token en localStorage
      localStorage.setItem("username", username); // Guarda el nombre de usuario
      console.log("Inicio de sesión exitoso. Token guardado.");
      console.log("Token:", token);
      console.log("Usuario:", username);
      navigate("/dashboard"); // Redirige al usuario
    } catch (error) {
      setError(
        error.message || "Credenciales incorrectas. Por favor, intenta nuevamente."
      );
    }
  };

  return (
    <div className="container-fluid vh-100 no-padding no-scroll">
      <div className="row h-100">
        <div className="col-lg-6 d-flex align-items-center justify-content-center">
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <h2>Iniciar Sesion</h2>
              {error && <p className="text-danger">{error}</p>}
              <div className="mb-3">
                <label className="form-label">Nombre de Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  id="EntradaUsuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="EntradaContraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-6 d-none d-lg-block">
          <img
            src={Image}
            alt="Imagen de login"
            layout="fill"
            className="h-100 w-100 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;
