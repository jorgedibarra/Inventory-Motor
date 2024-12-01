import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Plus, Search, Trash2 } from "lucide-react";
import ServicioPrivado from "../../../servicios/ServicioPrivado";
import { MensajeToastify } from "../../../utilidades/funciones/MensajeToastify";
import ApiBack from "../../../utilidades/dominios/ApiBack";

export const VentaCrear = () => {
  const navigate = useNavigate();

  // State Management
  const [venta, setVenta] = useState({
    clientId: 0,
    date: new Date().toISOString().slice(0, 16),
    paymentMethod: "Efectivo",
    state: true,
    items: []
  });
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [busquedaProducto, setBusquedaProducto] = useState("");

  // API Functions
  const obtenerProductos = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(
        ApiBack.PRODUCTOS_OBTENER
      );
      setProductos(resultado);
      setProductosFiltrados(resultado);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      MensajeToastify("error", "Error al cargar la lista de productos", 4000);
    }
  };

  const obtenerClientes = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(
        ApiBack.CLIENTES_OBTENER
      );
      setClientes(resultado);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      MensajeToastify("error", "Error al cargar la lista de clientes", 4000);
    } finally {
      setCargando(false);
    }
  };

  const crearVenta = async () => {
    try {
      if (!venta.clientId) {
        MensajeToastify("error", "Por favor seleccione un cliente", 4000);
        return;
      }

      if (venta.items.length === 0) {
        MensajeToastify("error", "Agregue al menos un producto a la venta", 4000);
        return;
      }

      // Preparar el objeto de venta según el formato requerido
      const ventaParaEnviar = {
        clientId: parseInt(venta.clientId),
        date: venta.date,
        paymentMethod: venta.paymentMethod,
        state: true,
        items: venta.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          total: item.total
        }))
      };

      console.log('Datos a enviar:', ventaParaEnviar);

      await ServicioPrivado.peticionPOST(
        ApiBack.VENTAS_CREAR,
        ventaParaEnviar
      );
      
      MensajeToastify("success", "Venta creada correctamente", 4000);
      navigate("/dashboard/listaventas");
    } catch (error) {
      console.error("Error al crear la venta:", error);
      MensajeToastify("error", "Error al crear la venta", 4000);
    }
  };

  const agregarProductoAVenta = () => {
    if (!productoSeleccionado || cantidadProducto <= 0) {
      MensajeToastify("error", "Por favor seleccione un producto y cantidad válida", 4000);
      return;
    }

    const nuevoItem = {
      productId: productoSeleccionado.productId,
      quantity: cantidadProducto,
      total: productoSeleccionado.priceSale * cantidadProducto,
      nombreProducto: productoSeleccionado.name,
      precioUnitario: productoSeleccionado.priceSale
    };

    setVenta(prevVenta => ({
      ...prevVenta,
      items: [...prevVenta.items, nuevoItem]
    }));

    setMostrarModalProducto(false);
    limpiarFormularioProducto();
    MensajeToastify("success", "Producto agregado correctamente", 4000);
  };

  const eliminarProductoDeVenta = (index) => {
    setVenta(prevVenta => ({
      ...prevVenta,
      items: prevVenta.items.filter((_, i) => i !== index)
    }));
    MensajeToastify("success", "Producto eliminado correctamente", 4000);
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

  const limpiarFormularioProducto = () => {
    setProductoSeleccionado(null);
    setCantidadProducto(1);
    setBusquedaProducto('');
  };

  // Effects
  useEffect(() => {
    obtenerClientes();
    obtenerProductos();
  }, []);

  // Render Functions
  const renderFormularioVenta = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Datos de la Venta</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Cliente</label>
            <select
              className="form-select"
              value={venta.clientId}
              onChange={(e) => setVenta({ ...venta, clientId: e.target.value })}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.clientId} value={cliente.clientId}>
                  {cliente.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="datetime-local"
              className="form-control"
              value={venta.date}
              onChange={(e) => setVenta({ ...venta, date: e.target.value })}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Método de Pago</label>
            <select
              className="form-select"
              value={venta.paymentMethod}
              onChange={(e) => setVenta({ ...venta, paymentMethod: e.target.value })}
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
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
            {venta.items.map((item, index) => (
              <tr key={index}>
                <td>{item.nombreProducto}</td>
                <td>{item.quantity}</td>
                <td>${item.precioUnitario.toFixed(2)}</td>
                <td>${item.total.toFixed(2)}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => eliminarProductoDeVenta(index)}
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
      </div>
    </div>
  );

  const renderModalAgregarProducto = () => (
    <Modal
      show={mostrarModalProducto}
      onHide={() => {
        setMostrarModalProducto(false);
        limpiarFormularioProducto();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto a la Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!productoSeleccionado ? (
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
              <div className="card mt-2">
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
        <h1>Crear Venta</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/dashboard/listaventas">Ventas</Link>
            </li>
            <li className="breadcrumb-item active">Crear Venta</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            {renderFormularioVenta()}
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
              <Button variant="success" onClick={crearVenta}>
                Crear Venta
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