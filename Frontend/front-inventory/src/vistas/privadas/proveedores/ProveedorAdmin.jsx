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

export const ProveedorAdmin = () => {
  // State Management
  const [show, setShow] = useState(false);
  const [arregloProveedores, setArregloProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [objPro, setObjPro] = useState(null);

  // Pagination State
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  // Pagination Calculations
  const indexUltimoItem = paginaActual * itemsPorPagina;
  const indexPrimerItem = indexUltimoItem - itemsPorPagina;
  const proveedoresActuales =
    proveedoresFiltrados.length > 0
      ? proveedoresFiltrados.slice(indexPrimerItem, indexUltimoItem)
      : arregloProveedores.slice(indexPrimerItem, indexUltimoItem);
  const totalPaginas = Math.ceil(
    (proveedoresFiltrados.length || arregloProveedores.length) / itemsPorPagina
  );

  // Handlers
  const handleClose = () => setShow(false);

  const handleInputChange = (event) => {
    const texto = event.target.value;
    setBusqueda(texto);
    filtrarProveedores(texto);
  };

  const handleSearchClick = (event) => {
    event.preventDefault();
    filtrarProveedores(busqueda);
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
  const filtrarProveedores = (texto) => {
    if (!texto.trim()) {
      setProveedoresFiltrados([]);
    } else {
      const filtrados = arregloProveedores.filter((proveedor) =>
        proveedor.name.toLowerCase().includes(texto.toLowerCase())
      );
      setProveedoresFiltrados(filtrados);
    }
  };

  // API Functions
  const obtenerProveedores = async () => {
    const resultado = await ServicioPrivado.peticionGET(
      ApiBack.PROVEEDORES_OBTENER
    );
    setArregloProveedores(resultado);
    return resultado;
  };

  const borrarProveedor = async (providerId) => {
    try {
        const urlBorrar = ApiBack.PROVEEDORES_ELIMINAR + providerId;
        await ServicioPrivado.peticionDELETE(urlBorrar);
        
        // Si no hay error, asumimos que la eliminación fue exitosa
        MensajeToastify("success", "Proveedor eliminado correctamente", 6000);
    } catch (error) {
        console.error("Error al eliminar:", error);
        MensajeToastify("error", "Error al eliminar el proveedor", 6000);
    } finally {
        obtenerProveedores(); // Actualizamos la lista independientemente del resultado
        handleClose();    // Cerramos el modal después de todo el proceso
    }
};

  // Effects
  useEffect(() => {
    obtenerProveedores();
  }, []);

  // Component Parts
  const renderBreadcrumb = () => (
    <div className="pagetitle">
      <h1>Proveedores</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/dashboard">Inicio</a>
          </li>
          <li className="breadcrumb-item active">Listado de proveedores</li>
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
              placeholder="Buscar proveedor por nombre"
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
        <Link to="/dashboard/crearproveedores" className="btn btn-success">
          <i className="fa-solid fa-plus me-2"></i>
          Agregar Nuevo Proveedor
        </Link>
      </div>
    </div>
  );

  const renderTableRow = (miProveedor, indice) => (
    <tr key={indice}>
      <td className="text-center">{miProveedor.name}</td>
      <td className="text-center">{miProveedor.identificationDocument}</td>
      <td className="text-center">{miProveedor.address}</td>
      <td className="text-center">{miProveedor.phone}</td>
      <td className="text-center">{miProveedor.email}</td>
      <td className="text-center">
        <a
          href="/#"
          onClick={(e) => {
            e.preventDefault();
            handleDeleteClick(miProveedor);
          }}
        >
          <i className="fa-solid fa-trash-can" style={{ color: "#990000" }}></i>
        </a>{" "}
        <Link to={`/dashboard/actproveedores/${miProveedor.id}`}>
          <i
            className="fa-regular fa-pen-to-square"
            style={{ color: "#006600" }}
          ></i>
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
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-end">
            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                Anterior
              </button>
            </li>
            {[...Array(totalPaginas)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  paginaActual === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPaginaActual(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                paginaActual === totalPaginas ? "disabled" : ""
              }`}
            >
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
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Realmente desea eliminar el proveedor?
        <br />
        <strong>{objPro?.name}</strong>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => borrarProveedor(objPro?.id)}>
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
                  <th className="text-center" style={{ width: "20%" }}>
                    Nombre
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    NIT
                  </th>
                  <th className="text-center" style={{ width: "20%" }}>
                    Dirección
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Celular
                  </th>
                  <th className="text-center" style={{ width: "20%" }}>
                    Correo
                  </th>
                  <th style={{ width: "5%" }}> </th>
                </tr>
              </thead>
              <tbody>
                {proveedoresActuales.map((miProveedor, indice) =>
                  renderTableRow(miProveedor, indice)
                )}
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
