import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Edit, Trash2, Plus, RefreshCw, Search } from "lucide-react";
import ServicioPrivado from "../../../servicios/ServicioPrivado";
import { MensajeToastify } from "../../../utilidades/funciones/MensajeToastify";
import ApiBack from "../../../utilidades/dominios/ApiBack";

// Constants
const ITEMS_PER_PAGE_OPTIONS = [
  { value: 5, label: "5 items por página" },
  { value: 10, label: "10 items por página" },
  { value: 25, label: "25 items por página" },
];

export const VentaVer = () => {
  const { codigo } = useParams();

  // State Management
  const [venta, setVenta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [busquedaProducto, setBusquedaProducto] = useState("");

  // Pagination State
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  // Pagination Calculations
  const indexUltimoItem = paginaActual * itemsPorPagina;
  const indexPrimerItem = indexUltimoItem - itemsPorPagina;
  const itemsActuales = venta?.items
    ? venta.items.slice(indexPrimerItem, indexUltimoItem)
    : [];
  const totalPaginas = venta?.items
    ? Math.ceil(venta.items.length / itemsPorPagina)
    : 0;

  // API Functions
  const obtenerVenta = async () => {
    try {
      setCargando(true);
      const ventaRecibida = await ServicioPrivado.peticionGET(
        ApiBack.VENTAS_OBTENER_UNO + codigo
      );

      // Obtener los detalles de los productos de la venta
      const itemsConDetalles = await Promise.all(
        ventaRecibida.items.map(async (item) => {
          try {
            const productoDetalle = await ServicioPrivado.peticionGET(
              ApiBack.PRODUCTOS_OBTENER_UNO + item.productId
            );
            return {
              ...item,
              nombreProducto: productoDetalle.name,
              precioUnitario: productoDetalle.priceSale
            };
          } catch (error) {
            console.error(`Error al obtener detalles del producto ${item.productId}:`, error);
            return {
              ...item,
              nombreProducto: "Producto no encontrado",
              precioUnitario: 0
            };
          }
        })
      );

      setVenta({
        ...ventaRecibida,
        items: itemsConDetalles
      });
    } catch (error) {
      console.error("Error al obtener la venta:", error);
      MensajeToastify("error", "Error al cargar la venta", 6000);
    } finally {
      setCargando(false);
    }
  };

  const obtenerProductos = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(
        ApiBack.PRODUCTOS_OBTENER
      );
      setProductos(resultado);
      setProductosFiltrados(resultado);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      MensajeToastify("error", "Error al cargar la lista de productos", 6000);
    }
  };

  const obtenerClientes = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(
        ApiBack.CLIENTES_OBTENER
      );
      setClientes(resultado);
      return resultado;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const actualizarVenta = async () => {
    try {
      // Preparar el objeto de venta según el formato requerido
      const ventaParaEnviar = {
        saleId: venta.saleId,
        clientId: venta.clientId,
        date: venta.date,
        paymentMethod: venta.paymentMethod,
        state: true,
        items: venta.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          total: item.total
        }))
      };

      console.log(ventaParaEnviar);

      await ServicioPrivado.peticionPUT(
        ApiBack.VENTAS_ACTUALIZAR,
        ventaParaEnviar
      );
      
      MensajeToastify("success", "Venta actualizada correctamente", 6000);
      obtenerVenta(); // Recargar los datos
    } catch (error) {
      console.error("Error al actualizar la venta:", error);
      MensajeToastify("error", "Error al actualizar la venta", 6000);
    }
  };

  const agregarProductoAVenta = () => {
    if (!productoSeleccionado || cantidadProducto <= 0) {
      MensajeToastify("error", "Por favor seleccione un producto y cantidad válida", 6000);
      return;
    }

    const nuevoItem = {
      productId: productoSeleccionado.productId,
      quantity: cantidadProducto,
      total: productoSeleccionado.priceSale * cantidadProducto,
      nombreProducto: productoSeleccionado.name,
      precioUnitario: productoSeleccionado.priceSale
    };

    const ventaActualizada = {
      ...venta,
      items: [...venta.items, nuevoItem]
    };

    setVenta(ventaActualizada);
    setMostrarModalProducto(false);
    limpiarFormularioProducto();
    MensajeToastify("success", "Producto agregado correctamente", 6000);
  };

  const eliminarProductoDeVenta = (index) => {
    const nuevosItems = venta.items.filter((_, i) => i !== index);
    setVenta({
      ...venta,
      items: nuevosItems
    });
    MensajeToastify("success", "Producto eliminado correctamente", 6000);
  };

  // Utility Functions
  const filtrarProductos = (busqueda) => {
    setBusquedaProducto(busqueda);
    const filtered = productos.filter((producto) =>
      producto.name.toLowerCase().includes(busqueda.toLowerCase())
    );
    setProductosFiltrados(filtered);
  };

  const calcularTotal = () => {
    return venta.items.reduce((total, item) => total + item.total, 0);
  };

  const obtenerNombreCliente = (clienteId) => {
    const cliente = clientes.find((c) => c.clientId === clienteId);
    return cliente ? cliente.name : "Cliente no encontrado";
  };

  const formatearFecha = (fechaArray) => {
    if (!Array.isArray(fechaArray) || fechaArray.length < 3) return "";
    const [year, month, day] = fechaArray;
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const limpiarFormularioProducto = () => {
    setProductoSeleccionado(null);
    setCantidadProducto(1);
    setBusquedaProducto('');
  };

  const handleItemsPorPaginaChange = (e) => {
    setItemsPorPagina(Number(e.target.value));
    setPaginaActual(1);
  };

  // Effects
  useEffect(() => {
    obtenerVenta();
    obtenerClientes();
    obtenerProductos();
  }, []);

  // Render Functions
  const renderDetalleVenta = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Detalles de la Venta #{venta?.saleId}</h5>
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Cliente:</strong> {obtenerNombreCliente(venta?.clientId)}
            </p>
            <p>
              <strong>Fecha:</strong> {formatearFecha(venta?.date)}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Método de Pago:</strong> {venta?.paymentMethod}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductosVenta = () => (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Productos de la Venta</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {itemsActuales.map((item, index) => (
              <tr key={index}>
                <td>{item.nombreProducto}</td>
                <td>{item.quantity}</td>
                <td>${item.precioUnitario?.toFixed(2)}</td>
                <td>${item.total?.toFixed(2)}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => eliminarProductoDeVenta(index + indexPrimerItem)}
                    className="btn-icon"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end"><strong>Total:</strong></td>
              <td colSpan="2"><strong>${calcularTotal().toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        {renderPagination()}
      </div>
    </div>
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

  const renderModalAgregarProducto = () => (
    <Modal
      show={mostrarModalProducto}
      onHide={() => {
        setMostrarModalProducto(false);
        limpiarFormularioProducto();
        setBusquedaProducto(''); // Limpiar búsqueda al cerrar
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto a la Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!productoSeleccionado ? (
          // Vista de búsqueda cuando no hay producto seleccionado
          <div className="mb-3">
            <label htmlFor="busquedaProducto" className="form-label">Buscar Producto</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="busquedaProducto"
                placeholder="Buscar por nombre..."
                value={busquedaProducto}
                onChange={(e) => filtrarProductos(e.target.value)}
              />
              <span className="input-group-text">
                <Search size={16} />
              </span>
            </div>
            <div className="list-group mt-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {productosFiltrados.map(producto => (
                
                <button
                  key={producto.productId}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={() => setProductoSeleccionado(producto)}
                >
                    
                  <span>{producto.name}</span>
                  <span className="badge bg-secondary">${producto.priceSale}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Vista del producto seleccionado
          <div>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Producto Seleccionado</h6>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setProductoSeleccionado(null);
                    setBusquedaProducto('');
                  }}
                >
                  Cambiar Producto
                </button>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{productoSeleccionado.name}</h5>
                  <p className="card-text">
                    Precio: ${productoSeleccionado.priceSale}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="cantidad" className="form-label">Cantidad</label>
              <input 
                type="number" 
                className="form-control" 
                id="cantidad"
                value={cantidadProducto}
                onChange={(e) => setCantidadProducto(parseInt(e.target.value) || 0)}
                min="1"
              />
              {cantidadProducto > 0 && (
                <div className="mt-2 text-end text-muted">
                  Subtotal: ${(productoSeleccionado.priceSale * cantidadProducto).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          setMostrarModalProducto(false);
          limpiarFormularioProducto();
          setBusquedaProducto('');
        }}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={agregarProductoAVenta}
          disabled={!productoSeleccionado || cantidadProducto <= 0}
        >
          Agregar Producto
        </Button>
      </Modal.Footer>
    </Modal>
  );
  
  // Loading State
  if (cargando) {
    return (
      <main id="main" className="main">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </main>
    );
  }

  // Main Render
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Ver Venta</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/dashboard/listaventas">Ventas</Link>
            </li>
            <li className="breadcrumb-item active">Ver Venta</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            {renderDetalleVenta()}
            {renderProductosVenta()}

            <div className="mt-4">
              <Button
                variant="primary"
                className="me-2"
                onClick={() => setMostrarModalProducto(true)}
              >
                <Plus size={16} className="me-2" />
                Agregar Producto
              </Button>
              <Button variant="success" onClick={actualizarVenta}>
                <RefreshCw size={16} className="me-2" />
                Actualizar Venta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {renderModalAgregarProducto()}
      <ToastContainer />
    </main>
  );
};
