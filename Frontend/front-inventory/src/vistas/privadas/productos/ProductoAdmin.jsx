// Imports
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import Producto from "../../../modelos/Producto";
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

export const ProductoAdmin = () => {
  // State Management
  const [show, setShow] = useState(false);
  const [arregloProductos, setArregloProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [objPro, setObjPro] = useState(
    new Producto("", "", 0, 0, 0, 0, 0, "", 0)
  );

  // Pagination State
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  // Pagination Calculations
  const indexUltimoItem = paginaActual * itemsPorPagina;
  const indexPrimerItem = indexUltimoItem - itemsPorPagina;
  const productosActuales = productosFiltrados.slice(
    indexPrimerItem,
    indexUltimoItem
  );
  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);

  // Handlers
  const handleClose = () => setShow(false);

  const handleInputChange = (event) => {
    const texto = event.target.value;
    setBusqueda(texto);
    filtrarProductos(texto);
  };

  const handleSearchClick = (event) => {
    event.preventDefault();
    filtrarProductos(busqueda);
  };

  const handleItemsPorPaginaChange = (e) => {
    setItemsPorPagina(Number(e.target.value));
    setPaginaActual(1);
  };

  const handleDeleteClick = (producto) => {
    setShow(true);
    setObjPro(producto);
  };

  // Filter Functions
  const filtrarProductos = (texto) => {
    if (!texto.trim()) {
      setProductosFiltrados(arregloProductos);
    } else {
      const productosFiltrados = arregloProductos.filter((producto) =>
        producto.name.toLowerCase().includes(texto.toLowerCase())
      );
      setProductosFiltrados(productosFiltrados);
    }
  };

  // API Functions
  const obtenerProductos = async () => {
    const resultado = await ServicioPrivado.peticionGET(
      ApiBack.PRODUCTOS_OBTENER
    );
    setArregloProductos(resultado);
    return resultado;
  };

  const borrarProductos = async (codigoProducto) => {
    const urlBorrar = `${ApiBack.PRODUCTOS_ELIMINAR}/${codigoProducto}`;
    const resultado = await ServicioPrivado.peticionDELETE(urlBorrar);

    if (typeof resultado.eliminado === "undefined") {
      MensajeToastify("error", "No se puede eliminar el producto.", 6000);
    } else {
      MensajeToastify(
        "success",
        "Producto eliminado de la base de datos",
        6000
      );
    }
    obtenerProductos();
  };

  const obtenerProveedores = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(
        ApiBack.PROVEEDORES_OBTENER
      );
      setProveedores(resultado);
      return resultado;
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(
        ApiBack.CATEGORIA_OBTENER
      );
      setCategorias(resultado);

      // Filtrar solo categorías activas
      const categoriasActivas = resultado.filter(
        (categoria) => categoria.active === true
      );
      setCategorias(categoriasActivas);
      return categoriasActivas;
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  // Utility Functions
  const obtenerNombreProveedor = (proveedorId) => {
    const proveedor = proveedores.find((p) => p.id === proveedorId);
    return proveedor ? proveedor.name : "Proveedor no encontrado";
  };

  const obtenerNombreCategoria = (categoriaId) => {
    const categoria = categorias.find((c) => c.categoryId === categoriaId);
    return categoria ? categoria.name : "Categoria no encontrado";
  };

  // Effects
  useEffect(() => {
    const cargarDatos = async () => {
      const productos = await obtenerProductos();
      setProductosFiltrados(productos);
    };
    cargarDatos();
    obtenerProveedores();
    obtenerCategorias();
  }, []);

  // Component Parts
  const renderBreadcrumb = () => (
    <div className="pagetitle">
      <h1>Productos</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="index.html">Inicio</a>
          </li>
          <li className="breadcrumb-item active">
            Administración de productos
          </li>
        </ol>
      </nav>
    </div>
  );

  const renderSearchBar = () => (
    <div className="row mb-4">
      <div className="col-lg-6">
        <form onSubmit={handleSearchClick}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar producto por nombre"
              value={busqueda}
              onChange={handleInputChange}
            />
            <button className="btn btn-primary" type="submit">
              Buscar
            </button>
          </div>
        </form>
      </div>
      <div className="col-lg-3 text-end">
        <Link to="/dashboard/crearproducto" className="btn btn-success">
          <i className="fa-solid fa-plus me-2"></i>
          Agregar Nuevo Producto
        </Link>
      </div>
      <div className="col-lg-3 text-end">
        <Link to="/dashboard/admincategorias" className="btn btn-success">
          <i className="fa-solid fa-plus me-2"></i>
          Administrar las categorias
        </Link>
      </div>
    </div>
  );

  const renderTableRow = (miProducto, indice) => (
    <tr key={indice}>
      <td>{indice + 1}</td>
      <td>{miProducto.name}</td>
      <td>{miProducto.description}</td>
      <td>{obtenerNombreCategoria(miProducto.categoryId)}</td>
      <td>{obtenerNombreProveedor(miProducto.providerId)}</td>
      <td>{miProducto.priceSale}</td>
      <td>{miProducto.priceBuy}</td>
      <td>{miProducto.stock}</td>
      <td className="text-center">
        <a
          href="/#"
          onClick={(e) => {
            e.preventDefault();
            handleDeleteClick(miProducto);
          }}
        >
          <i className="fa-solid fa-trash-can" style={{ color: "#990000" }}></i>
        </a>{" "}
        <Link to={`/dashboard/actualizarproducto/${miProducto.productId}`}>
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
        <Modal.Title>Eliminar producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {objPro.stock > 0 ? (
          <div className="alert alert-warning">
            No se puede eliminar este producto porque tiene {objPro.stock}{" "}
            unidades en existencia. Reduzca el inventario a 0 antes de eliminar.
          </div>
        ) : (
          <>
            ¿Realmente desea eliminar el producto?
            <br />
            <strong>{objPro.name}</strong>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={() => borrarProductos(objPro._id)}
          disabled={objPro.stock > 0}
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
                  <th style={{ width: "5%" }}>Orden</th>
                  <th style={{ width: "15%" }}>Nombre producto</th>
                  <th style={{ width: "17%" }}>Descripcion</th>
                  <th style={{ width: "8%" }}>Categoria</th>
                  <th style={{ width: "10%" }}>Proveedor</th>
                  <th style={{ width: "9%" }}>Precio V</th>
                  <th style={{ width: "9%" }}>Precio C</th>
                  <th style={{ width: "6%" }}>Cantidad</th>
                  <th style={{ width: "5%" }}> </th>
                </tr>
              </thead>
              <tbody>
                {productosActuales.map((miProducto, indice) =>
                  renderTableRow(miProducto, indice)
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
