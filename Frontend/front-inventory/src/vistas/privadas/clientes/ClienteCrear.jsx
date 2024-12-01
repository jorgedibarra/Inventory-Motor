import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiBack from "../../../utilidades/dominios/ApiBack";
import ServicioPrivado from "../../../servicios/ServicioPrivado";
import { MensajeToastify } from "../../../utilidades/funciones/MensajeToastify";
import { ToastContainer } from "react-toastify";

export const ClienteCrear = () => {
  // Navigation
  const navigate = useNavigate();

  // Form State
  const [cliente, setCliente] = useState({
    name: "",
    lastName: "",
    document: "",
    address: "",
    phone: "",
    email: "",
    state: true
  });

  // Destructure client data for easier access
  const { name, lastName, document, address, phone, email } = cliente;

  // Event Handlers
  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if ([name, lastName, document, address, phone, email].includes("")) {
      MensajeToastify("error", "Todos los campos son obligatorios", 6000);
      return;
    }

    try {
      // Send POST request to create client
      const resultado = await ServicioPrivado.peticionPOST(
        ApiBack.CLIENTES_CREAR,
        cliente
      );

      if (resultado.clientId) {
        MensajeToastify(
          "success",
          "Cliente creado exitosamente",
          6000
        );
        // Redirect to client list
        navigate("/dashboard/listaclientes");
      } else {
        MensajeToastify(
          "error",
          "No se pudo crear el cliente. Por favor intente de nuevo",
          6000
        );
      }
    } catch (error) {
      console.log(error);
      MensajeToastify(
        "error",
        "Hubo un error al procesar la solicitud",
        6000
      );
    }
  };

  // Component Parts
  const renderBreadcrumb = () => (
    <div className="pagetitle">
      <h1>Clientes</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/dashboard">Inicio</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/dashboard/listaclientes">Clientes</a>
          </li>
          <li className="breadcrumb-item active">Crear Cliente</li>
        </ol>
      </nav>
    </div>
  );

  const renderForm = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Crear Nuevo Cliente</h5>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="document" className="form-label">
              Documento
            </label>
            <input
              type="text"
              className="form-control"
              id="document"
              name="document"
              value={document}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="address" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-primary">
              Guardar Cliente
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate("/dashboard/listaclientes")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <main id="main" className="main">
      {renderBreadcrumb()}
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            {renderForm()}
          </div>
        </div>
      </section>
      <ToastContainer />
    </main>
  );
};
