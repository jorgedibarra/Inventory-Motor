import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ServicioPrivado from '../../../servicios/ServicioPrivado';
import ApiBack from '../../../utilidades/dominios/ApiBack';
import { Search } from 'lucide-react';

// Constants
const ITEMS_PER_PAGE_OPTIONS = [
  { value: 5, label: "5 items por página" },
  { value: 10, label: "10 items por página" },
  { value: 25, label: "25 items por página" },
  { value: 50, label: "50 items por página" }
];

export const PedidoLista = () => {
  // State Management
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [proveedores, setProveedores] = useState([]);
  
  // Pagination State
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  // Pagination Calculations
  const indexUltimoItem = paginaActual * itemsPorPagina;
  const indexPrimerItem = indexUltimoItem - itemsPorPagina;
  const pedidosActuales = pedidosFiltrados.length > 0 
    ? pedidosFiltrados.slice(indexPrimerItem, indexUltimoItem)
    : pedidos.slice(indexPrimerItem, indexUltimoItem);
  const totalPaginas = Math.ceil((pedidosFiltrados.length > 0 ? pedidosFiltrados.length : pedidos.length) / itemsPorPagina);

  // Handlers
  const handleInputChange = (event) => {
    const texto = event.target.value;
    setBusqueda(texto);
    filtrarPedidos(texto);
  };

  const handleSearchClick = (event) => {
    event.preventDefault();
    filtrarPedidos(busqueda);
  };

  const handleItemsPorPaginaChange = (e) => {
    setItemsPorPagina(Number(e.target.value));
    setPaginaActual(1);
  };

  // Filter Functions
  const filtrarPedidos = (texto) => {
    if (!texto.trim()) {
      setPedidosFiltrados([]);
    } else {
      const filtrados = pedidos.filter((pedido) => {
        const nombreProveedor = obtenerNombreProveedor(pedido.providerId);
        return nombreProveedor.toLowerCase().includes(texto.toLowerCase());
      });
      setPedidosFiltrados(filtrados);
    }
  };

  // API Functions
  const obtenerPedidos = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(ApiBack.PEDIDOS_OBTENER);
      setPedidos(resultado);
      return resultado;
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  const obtenerProveedores = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(ApiBack.PROVEEDORES_OBTENER);
      setProveedores(resultado);
      return resultado;
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  // Utility Functions
  const obtenerNombreProveedor = (providerId) => {
    const proveedor = proveedores.find((p) => p.providerId === providerId);
    return proveedor ? proveedor.name : "Proveedor no encontrado";
  };

  const formatearFecha = (fechaArray) => {
    if (!Array.isArray(fechaArray) || fechaArray.length < 3) return "";
    
    const [year, month, day] = fechaArray;
    const diaFormateado = day.toString().padStart(2, '0');
    const mesFormateado = month.toString().padStart(2, '0');
    
    return `${diaFormateado}/${mesFormateado}/${year}`;
  };

  // Effects
  useEffect(() => {
    const cargarDatos = async () => {
      await obtenerPedidos();
    };
    cargarDatos();
    obtenerProveedores();
  }, []);

  // Component Parts
  const renderBreadcrumb = () => (
    <div className="pagetitle">
      <h1>Pedidos</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Inicio</Link>
          </li>
          <li className="breadcrumb-item active">Listado de pedidos</li>
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
              placeholder="Buscar pedido por proveedor"
              value={busqueda}
              onChange={handleInputChange}
            />
            <button className="btn btn-primary" type="submit">
              <Search size={16} className="me-2" />
              Buscar
            </button>
          </div>
        </form>
      </div>
      <div className="col-lg-4 text-end">
        <Link to="/dashboard/crearpedidos" className="btn btn-success">
          <i className="fa-solid fa-plus me-2"></i>
          Nuevo Pedido
        </Link>
      </div>
    </div>
  );

  const renderTableRow = (pedido) => (
    <tr key={pedido.id}>
      <td className="text-center">{pedido.idOrder}</td>
      <td className="text-center">{obtenerNombreProveedor(pedido.providerId)}</td>
      <td className="text-center">{formatearFecha(pedido.date)}</td>
      <td className="text-center">{pedido.products.reduce((total, item) => total + item.total, 0)}</td>
      <td className="text-center">
        <Link to={`/dashboard/actualizarpedidos/${pedido.idOrder}`}>
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
                  <th className="text-center" style={{ width: "15%" }}>N° Pedido</th>
                  <th className="text-center" style={{ width: "30%" }}>Proveedor</th>
                  <th className="text-center" style={{ width: "25%" }}>Fecha</th>
                  <th className="text-center" style={{ width: "20%" }}>Total</th>
                  <th className="text-center" style={{ width: "10%" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosActuales.map((pedido) => renderTableRow(pedido))}
              </tbody>
            </table>
            
            {renderPagination()}
          </div>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
};
