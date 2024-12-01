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

export const UsuarioAdmin = () => {
  // State Management
  const [show, setShow] = useState(false);
  const [arregloUsuarios, setArregloUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [objUsuario, setObjUsuario] = useState(null);

  // Pagination State
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  // Pagination Calculations
  const indexUltimoItem = paginaActual * itemsPorPagina;
  const indexPrimerItem = indexUltimoItem - itemsPorPagina;
  const usuariosActuales =
    usuariosFiltrados.length > 0
      ? usuariosFiltrados.slice(indexPrimerItem, indexUltimoItem)
      : arregloUsuarios.slice(indexPrimerItem, indexUltimoItem);
  const totalPaginas = Math.ceil(
    (usuariosFiltrados.length || arregloUsuarios.length) / itemsPorPagina
  );

  // Handlers
  const handleClose = () => setShow(false);

  // Función para manejar el evento de cambio en el input de búsqueda
  const handleInputChange = (event) => {
    const texto = event.target.value;
    setBusqueda(texto);
    filtrarUsuarios(texto);
  };

  // Función para manejar el evento de clic en el botón de búsqueda
  const handleSearchClick = (event) => {
    event.preventDefault();
    filtrarUsuarios(busqueda);
  };

  const handleItemsPorPaginaChange = (e) => {
    setItemsPorPagina(Number(e.target.value));
    setPaginaActual(1);
  };

  const handleDeleteClick = (usuario) => {
    setShow(true);
    setObjUsuario(usuario);
  };

  // Filter Functions
  // Función para filtrar usuarios según la búsqueda
  const filtrarUsuarios = (texto) => {
    if (!texto.trim()) {
      setUsuariosFiltrados([]);
    } else {
      const filtrados = arregloUsuarios.filter((usuario) =>
        usuario.nombre.toLowerCase().includes(texto.toLowerCase())
      );
      setUsuariosFiltrados(filtrados);
    }
  };

  // Función para obtener usuarios
  const obtenerUsuarios = async () => {
    const resultado = await ServicioPrivado.peticionGET(
      ApiBack.USUARIOS_OBTENER
    );
    setArregloUsuarios(resultado);
    return resultado;
  };

  const borrarUsuario = async (name) => {
    try {
        const urlBorrar = `${ApiBack.USUARIOS_ELIMINAR}${name}`;
        await ServicioPrivado.peticionDELETE(urlBorrar);
        
        // Si no hay error, asumimos que la eliminación fue exitosa
        MensajeToastify("success", "Usuario eliminado correctamente", 6000);
    } catch (error) {
        console.error("Error al eliminar:", error);
        MensajeToastify("error", "Error al eliminar el usuario", 6000);
    } finally {
        obtenerUsuarios();
        handleClose();
    }
};

const formatearFecha = (fechaArray) => {
  if (!Array.isArray(fechaArray) || fechaArray.length < 3) return "";
  
  // Extraemos día, mes y año del array
  const [year, month, day] = fechaArray;
  
  // Aseguramos que día y mes tengan dos dígitos
  const diaFormateado = day.toString().padStart(2, '0');
  const mesFormateado = month.toString().padStart(2, '0');
  
  return `${diaFormateado}/${mesFormateado}/${year}`;
};

  // Hook de react que se usa cuando se renderiza o pinta la página (vista)
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Component Parts
  const renderBreadcrumb = () => (
    <div className="pagetitle">
      <h1>Usuarios</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/dashboard">Inicio</a>
          </li>
          <li className="breadcrumb-item active">Listado de usuarios</li>
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
              placeholder="Buscar usuario por nombre"
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
        <Link to="/dashboard/crearusuarios" className="btn btn-success">
          <i className="fa-solid fa-plus me-2"></i>
          Agregar Nuevo Usuario
        </Link>
      </div>
    </div>
  );

  const renderTableRow = (miUsuario, indice) => {
    // Obtener el primer rol del usuario (o concatenar si hay múltiples)
    const userRoles = miUsuario.roles 
      ? miUsuario.roles.map(rol => rol.role).join(', ') 
      : 'Sin rol asignado';
  
      console.log(miUsuario);
    return (
      <tr key={indice}>
        <td className="text-center">{miUsuario.name}</td>
        <td className="text-center">{miUsuario.email}</td>
        <td className="text-center">{formatearFecha(miUsuario.createdDate)}</td>
        <td className="text-center">{userRoles}</td>
        <td className="text-center">
          <img 
            src={miUsuario.photo} 
            alt="Foto de usuario" 
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} 
          />
        </td>
        <td className="text-center">
          <a href="/#" onClick={(e) => {
            e.preventDefault();
            handleDeleteClick(miUsuario);
          }}>
            <i className="fa-solid fa-trash-can" style={{ color: "#990000" }}></i>
          </a>{" "}
          <Link to={`/dashboard/actualizarusuarios/${miUsuario.name}`}>
            <i className="fa-regular fa-pen-to-square" style={{ color: "#006600" }}></i>
          </Link>
        </td>
      </tr>
    );
  };

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
        <Modal.Title>Eliminar usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Realmente desea eliminar el usuario?
        <br />
        <strong>{objUsuario?.nombre}</strong>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={() => borrarUsuario(objUsuario?.name)}
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
                  <th className="text-center" style={{ width: "20%" }}>Correo</th>
                  <th className="text-center" style={{ width: "15%" }}>Fecha de Creación</th>
                  <th className="text-center" style={{ width: "10%" }}>Rol</th>
                  <th className="text-center" style={{ width: "10%" }}>Foto</th>
                  <th style={{ width: "5%" }}> </th>
                </tr>
              </thead>
              <tbody>
                {usuariosActuales.map((miUsuario, indice) => renderTableRow(miUsuario, indice))}
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