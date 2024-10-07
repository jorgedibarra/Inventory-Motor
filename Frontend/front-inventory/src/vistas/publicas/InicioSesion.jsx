import React, { useState } from "react";
import "../../assets/css/InicioSesion.css";
import Image from "../../assets/images/portada_ia.png";

const InicioSesion = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para hacer la llamada al backend para autenticar al usuario
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="container-fluid vh-100 no-padding no-scroll">
      <div className="row h-100">
        <div className="col-lg-6 d-flex align-items-center justify-content-center">
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <h2>Iniciar Sesion</h2>
              <div className="mb-3">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  id="EntradaCorreo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Contraseña</label>
                <input
                  type="password"
                  class="form-control"
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
