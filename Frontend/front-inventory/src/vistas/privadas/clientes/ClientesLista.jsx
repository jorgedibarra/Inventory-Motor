// Imports
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import ApiBack from "../../../utilidades/dominios/ApiBack";
import ServicioPrivado from "../../../servicios/ServicioPrivado";
import { MensajeToastify } from "../../../utilidades/funciones/MensajeToastify";

// Constants
const ITEMS_PER_PAGE_OPTIONS = [
  { value: 5, label: "5 items por página" },
  { value: 10, label: "10 items por página" },
  { value: 25, label: "25 items por página" },
  { value: 50, label: "50 items por página" },
];

export const ClienteLista = () => {
  // State Management
  const [show, setShow] = useState(false);
  const [arregloClientes, setArregloClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [objPro, setObjPro] = useState(null);

  // Pagination State
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  // Pagination Calculations
  const indexUltimoItem = paginaActual * itemsPorPagina;
  const indexPrimerItem = indexUltimoItem - itemsPorPagina;
  const clientesActuales =
    clientesFiltrados.length > 0
      ? clientesFiltrados.slice(indexPrimerItem, indexUltimoItem)
      : arregloClientes.slice(indexPrimerItem, indexUltimoItem);
  const totalPaginas = Math.ceil(
    (clientesFiltrados.length || arregloClientes.length) / itemsPorPagina
  );

  // Handlers
  const handleClose = () => setShow(false);

  // Función para manejar el evento de cambio en el input de búsqueda
  const handleInputChange = (event) => {
    const texto = event.target.value;
    setBusqueda(texto);
    filtrarClientes(texto);
  };

  // Función para manejar el evento de clic en el botón de búsqueda
  const handleSearchClick = (event) => {
    event.preventDefault();
    filtrarClientes(busqueda);
  };

  const handleItemsPorPaginaChange = (e) => {
    setItemsPorPagina(Number(e.target.value));
    setPaginaActual(1);
  };

  const handleDeleteClick = (proveedor) => {
    setShow(true);
    setObjPro(proveedor);
  };

  // Filter Functions
  // Función para filtrar clientes según la búsqueda
  const filtrarClientes = (texto) => {
    if (!texto.trim()) {
      setClientesFiltrados([]);
    } else {
      const filtrados = arregloClientes.filter((cliente) =>
        cliente.name.toLowerCase().includes(texto.toLowerCase())
      );
      setClientesFiltrados(filtrados);
    }
  };

  // Función para obtener clientes
  const obtenerClientes = async () => {
    const resultado = await ServicioPrivado.peticionGET(
      ApiBack.CLIENTES_OBTENER
    );
    setArregloClientes(resultado);
    return resultado;
  };

  const borrarCliente = async (clienteId) => {
    try {
        const urlBorrar = `${ApiBack.CLIENTES_ELIMINAR}${clienteId}`;
        await ServicioPrivado.peticionDELETE(urlBorrar);
        
        // Si no hay error, asumimos que la eliminación fue exitosa
        MensajeToastify("success", "Cliente eliminado correctamente", 6000);
    } catch (error) {
        console.error("Error al eliminar:", error);
        MensajeToastify("error", "Error al eliminar el cliente", 6000);
    } finally {
        obtenerClientes();
        handleClose();
    }
};

  // Hook de react que se usa cuando se renderiza o pinta la página (vista)
  useEffect(() => {
    obtenerClientes();
  }, []);

  // Component Parts
  const renderBreadcrumb = () => (
    <div className="pagetitle">
      <h1>Clientes</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/dashboard">Inicio</a>
          </li>
          <li className="breadcrumb-item active">Listado de clientes</li>
        </ol>
      </nav>
    </div>
  );

  const renderSearchBar = () => (
    <div className="row mb-4">
      <div className="col-lg-8">
        <form onSubmit={handleSearchClick}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar cliente por nombre"
              value={busqueda}
              onChange={handleInputChange}
            />
            <button className="btn btn-primary" type="submit">
              Buscar
            </button>
          </div>
        </form>
      </div>
      <div className="col-lg-4 text-end">
        <Link to="/dashboard/crearclientes" className="btn btn-success">
          <i className="fa-solid fa-plus me-2"></i>
          Agregar Nuevo Cliente
        </Link>
      </div>
    </div>
  );

  const renderTableRow = (miCliente, indice) => (
    <tr key={indice}>
      <td className="text-center">{miCliente.name}</td>
      <td className="text-center">{miCliente.lastName}</td>
      <td className="text-center">{miCliente.document}</td>
      <td className="text-center">{miCliente.address}</td>
      <td className="text-center">{miCliente.phone}</td>
      <td className="text-center">{miCliente.email}</td>
      <td className="text-center">
        <a href="/#" onClick={(e) => {
          e.preventDefault();
          handleDeleteClick(miCliente);
        }}>
          <i className="fa-solid fa-trash-can" style={{ color: "#990000" }}></i>
        </a>{" "}
        <Link to={`/dashboard/actualizarclientes/${miCliente.clientId}`}>
          <i className="fa-regular fa-pen-to-square" style={{ color: "#006600" }}></i>
        </Link>
      </td>
    </tr>
  );

  const renderPagination = () => (
    <div className="row mt-3">
      <div className="col-md-6">
        <select 
          className="form-select w-auto"
          value={itemsPorPagina}
          onChange={handleItemsPorPaginaChange}
        >
          {ITEMS_PER_PAGE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-end">
            <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link"
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                Anterior
              </button>
            </li>
            {[...Array(totalPaginas)].map((_, index) => (
              <li key={index} className={`page-item ${paginaActual === index + 1 ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPaginaActual(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
              <button 
                className="page-link"
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );

  const renderDeleteModal = () => (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Realmente desea eliminar el cliente?
        <br />
        <strong>{objPro?.name}</strong>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={() => borrarCliente(objPro?.clientId)}
        >
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // Main Render
  return (
    <main id="main" className="main">
      {renderBreadcrumb()}
      {renderSearchBar()}
      
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "15%" }}>Nombre</th>
                  <th className="text-center" style={{ width: "15%" }}>Apellido</th>
                  <th className="text-center" style={{ width: "15%" }}>Cedula</th>
                  <th className="text-center" style={{ width: "15%" }}>Dirección</th>
                  <th className="text-center" style={{ width: "15%" }}>Celular</th>
                  <th className="text-center" style={{ width: "15%" }}>Correo</th>
                  <th style={{ width: "5%" }}> </th>
                </tr>
              </thead>
              <tbody>
                {clientesActuales.map((miProveedor, indice) => renderTableRow(miProveedor, indice))}
              </tbody>
            </table>
            
            {renderPagination()}
            {renderDeleteModal()}
          </div>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
};
