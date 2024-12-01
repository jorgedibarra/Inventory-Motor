import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiBack from "../../../utilidades/dominios/ApiBack";
import ServicioPrivado from "../../../servicios/ServicioPrivado";
import { MensajeToastify } from "../../../utilidades/funciones/MensajeToastify";
import { ToastContainer } from "react-toastify";

export const ClienteActualizar = () => {
  // Navigation and Parameters
  const navigate = useNavigate();
  const { codigo } = useParams();

  // Form State
  const [cliente, setCliente] = useState({
    name: "",
    lastName: "",
    document: "",
    address: "",
    phone: "",
    email: "",
    clientId: ""
  });

  // Destructure client data
  const { name, lastName, document, address, phone, email } = cliente;

  // Load client data on component mount
  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const resultado = await ServicioPrivado.peticionGET(
          ApiBack.CLIENTES_OBTENER_UNO + codigo
        );
        if (resultado) {
          setCliente(resultado);
        } else {
          MensajeToastify(
            "error",
            "No se encontró el cliente especificado",
            6000
          );
          navigate("/dashboard/clientes");
        }
      } catch (error) {
        console.log(error);
        MensajeToastify(
          "error",
          "Error al obtener los datos del cliente",
          6000
        );
        navigate("/dashboard/clientes");
      }
    };

    obtenerCliente();
  }, [codigo, navigate]);

  // Event Handlers
  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if ([name, lastName, document, address, phone, email].includes("")) {
      MensajeToastify("error", "Todos los campos son obligatorios", 6000);
      return;
    }

    try {
      // Send PUT request to update client
      const resultado = await ServicioPrivado.peticionPUT(
        `${ApiBack.CLIENTES_ACTUALIZAR}`,
        cliente
      );

      if (resultado.clientId) {
        MensajeToastify(
          "success",
          "Cliente actualizado exitosamente",
          4000
        );
        navigate("/dashboard/listaclientes");
      } else {
        MensajeToastify(
          "error",
          "No se pudo actualizar el cliente. Por favor intente de nuevo",
          4000
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
          <li className="breadcrumb-item active">Actualizar Cliente</li>
        </ol>
      </nav>
    </div>
  );

  const renderForm = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Actualizar Cliente</h5>
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
              Actualizar Cliente
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

  const renderLoadingOrForm = () => {
    if (!cliente.clientId) {
      return (
        <div className="card">
          <div className="card-body">
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando información del cliente...</p>
            </div>
          </div>
        </div>
      );
    }
    return renderForm();
  };

  return (
    <main id="main" className="main">
      {renderBreadcrumb()}
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            {renderLoadingOrForm()}
          </div>
        </div>
      </section>
      <ToastContainer />
    </main>
  );
};