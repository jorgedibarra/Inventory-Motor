import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import ServicioPrivado from '../../../servicios/ServicioPrivado';
import ApiBack from '../../../utilidades/dominios/ApiBack';
import { Search, Eye } from 'lucide-react';

// Constants
const ITEMS_PER_PAGE_OPTIONS = [
  { value: 5, label: "5 items por página" },
  { value: 10, label: "10 items por página" },
  { value: 25, label: "25 items por página" },
  { value: 50, label: "50 items por página" }
];

export const VentaLista = () => {
  // State Management
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [clientes, setClientes] = useState([]);
  
  // Pagination State
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  // Pagination Calculations
  const indexUltimoItem = paginaActual * itemsPorPagina;
  const indexPrimerItem = indexUltimoItem - itemsPorPagina;
  const ventasActuales = ventasFiltradas.length > 0 
    ? ventasFiltradas.slice(indexPrimerItem, indexUltimoItem)
    : ventas.slice(indexPrimerItem, indexUltimoItem);
  const totalPaginas = Math.ceil((ventasFiltradas.length > 0 ? ventasFiltradas.length : ventas.length) / itemsPorPagina);

  // Handlers
  const handleInputChange = (event) => {
    const texto = event.target.value;
    setBusqueda(texto);
    filtrarVentas(texto);
  };

  const handleSearchClick = (event) => {
    event.preventDefault();
    filtrarVentas(busqueda);
  };

  const handleItemsPorPaginaChange = (e) => {
    setItemsPorPagina(Number(e.target.value));
    setPaginaActual(1);
  };

  // Filter Functions
  const filtrarVentas = (texto) => {
    if (!texto.trim()) {
      setVentasFiltradas([]);
    } else {
      const filtradas = ventas.filter((venta) => {
        const nombreCliente = obtenerNombreCliente(venta.clientId);
        return nombreCliente.toLowerCase().includes(texto.toLowerCase());
      });
      setVentasFiltradas(filtradas);
    }
  };

  // API Functions
  const obtenerVentas = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(ApiBack.VENTAS_OBTENER);
      setVentas(resultado);
      return resultado;
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  const obtenerClientes = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(ApiBack.CLIENTES_OBTENER);
      setClientes(resultado);
      return resultado;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  // Utility Functions
  const obtenerNombreCliente = (clienteId) => {
    const cliente = clientes.find((c) => c.clientId === clienteId);
    return cliente ? cliente.name : "Cliente no encontrado";
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

  // Effects
  useEffect(() => {
    const cargarDatos = async () => {
      await obtenerVentas();
    };
    cargarDatos();
    obtenerClientes();
  }, []);

  // Component Parts
  const renderBreadcrumb = () => (
    <div className="pagetitle">
      <h1>Ventas</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Inicio</Link>
          </li>
          <li className="breadcrumb-item active">Listado de ventas</li>
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
              placeholder="Buscar venta por cliente"
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
        <Link to="/dashboard/crearventa" className="btn btn-success">
          <i className="fa-solid fa-plus me-2"></i>
          Nueva Venta
        </Link>
      </div>
    </div>
  );

  const renderTableRow = (venta) => (
    <tr key={venta.id}>
      <td className="text-center">{venta.saleId}</td>
      <td className="text-center">{obtenerNombreCliente(venta.clientId)}</td>
      <td className="text-center">{formatearFecha(venta.date)}</td>
      <td className="text-center">{venta.paymentMethod}</td>
      <td className="text-center">{venta.items.reduce((total, item) => total + item.total, 0)}</td>
      <td className="text-center">
        
        <Link to={`/dashboard/verventa/${venta.saleId}`}>
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
                  <th className="text-center" style={{ width: "10%" }}>N° Factura</th>
                  <th className="text-center" style={{ width: "20%" }}>Cliente</th>
                  <th className="text-center" style={{ width: "20%" }}>Fecha</th>
                  <th className="text-center" style={{ width: "20%" }}>Medio de Pago</th>
                  <th className="text-center" style={{ width: "15%" }}>Total</th>
                  <th className="text-center" style={{ width: "10%" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasActuales.map((venta, indice) => renderTableRow(venta, indice))}
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