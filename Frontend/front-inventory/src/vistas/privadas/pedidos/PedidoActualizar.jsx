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

export const PedidoActualizar = () => {
  const { codigo } = useParams();

  // State Management
  const [pedido, setPedido] = useState(null);
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [estadosPedido, setEstadosPedido] = useState([
    "PENDIENTE", "EN PROCESO", "ENVIADO", "ENTREGADO", "CANCELADO"
  ]);
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
  const itemsActuales = pedido?.items
    ? pedido.items.slice(indexPrimerItem, indexUltimoItem)
    : [];
  const totalPaginas = pedido?.items
    ? Math.ceil(pedido.items.length / itemsPorPagina)
    : 0;

  // API Functions
  const obtenerPedido = async () => {
    try {
      setCargando(true);
      const pedidoRecibido = await ServicioPrivado.peticionGET(
        ApiBack.PEDIDOS_OBTENER_UNO + codigo
      );

      // Obtener los detalles de los productos del pedido
      const itemsConDetalles = await Promise.all(
        pedidoRecibido.items.map(async (item) => {
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

      setPedido({
        ...pedidoRecibido,
        items: itemsConDetalles
      });
    } catch (error) {
      console.error("Error al obtener el pedido:", error);
      MensajeToastify("error", "Error al cargar el pedido", 6000);
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

  const actualizarPedido = async () => {
    try {
      // Preparar el objeto de pedido según el formato requerido
      const pedidoParaEnviar = {
        orderId: pedido.orderId,
        clientId: pedido.clientId,
        date: pedido.date,
        status: pedido.status,
        observation: pedido.observation || "",
        items: pedido.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          total: item.total
        }))
      };

      await ServicioPrivado.peticionPUT(
        ApiBack.PEDIDOS_ACTUALIZAR,
        pedidoParaEnviar
      );
      
      MensajeToastify("success", "Pedido actualizado correctamente", 6000);
      obtenerPedido(); // Recargar los datos
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
      MensajeToastify("error", "Error al actualizar el pedido", 6000);
    }
  };

  const agregarProductoAPedido = () => {
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

    const pedidoActualizado = {
      ...pedido,
      items: [...pedido.items, nuevoItem]
    };

    setPedido(pedidoActualizado);
    setMostrarModalProducto(false);
    limpiarFormularioProducto();
    MensajeToastify("success", "Producto agregado correctamente", 6000);
  };

  const eliminarProductoDePedido = (index) => {
    const nuevosItems = pedido.items.filter((_, i) => i !== index);
    setPedido({
      ...pedido,
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
    return pedido.items.reduce((total, item) => total + item.total, 0);
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
    obtenerPedido();
    obtenerClientes();
    obtenerProductos();
  }, []);

  // Render Functions
  const renderDetallePedido = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Detalles del Pedido #{pedido?.orderId}</h5>
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Cliente:</strong> {obtenerNombreCliente(pedido?.clientId)}
            </p>
            <p>
              <strong>Fecha:</strong> {formatearFecha(pedido?.date)}
            </p>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="estadoPedido" className="form-label">Estado del Pedido</label>
              <select
                className="form-select"
                id="estadoPedido"
                value={pedido?.status || ""}
                onChange={(e) => setPedido({...pedido, status: e.target.value})}
              >
                {estadosPedido.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="observacionPedido" className="form-label">Observaciones</label>
              <textarea
                className="form-control"
                id="observacionPedido"
                rows={3}
                value={pedido?.observation || ""}
                onChange={(e) => setPedido({...pedido, observation: e.target.value})}
                placeholder="Ingrese observaciones del pedido"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductosPedido = () => (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Productos del Pedido</h5>
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
                    onClick={() => eliminarProductoDePedido(index + indexPrimerItem)}
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
        
        {renderPaginacion()}
      </div>
    </div>
  );

  const renderPaginacion = () => (
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
        <Modal.Title>Agregar Producto al Pedido</Modal.Title>
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
          onClick={agregarProductoAPedido}
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
        <h1>Ver Pedido</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/dashboard/listapedidos">Pedidos</Link>
            </li>
            <li className="breadcrumb-item active">Ver Pedido</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            {renderDetallePedido()}
            {renderProductosPedido()}

            <div className="mt-4">
              <Button
                variant="primary"
                className="me-2"
                onClick={() => setMostrarModalProducto(true)}
              >
                <Plus size={16} className="me-2" />
                Agregar Producto
              </Button>
              <Button variant="success" onClick={actualizarPedido}>
                <RefreshCw size={16} className="me-2" />
                Actualizar Pedido
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