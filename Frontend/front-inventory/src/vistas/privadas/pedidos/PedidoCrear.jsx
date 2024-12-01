import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Plus, Search, Trash2 } from "lucide-react";
import ServicioPrivado from "../../../servicios/ServicioPrivado";
import { MensajeToastify } from "../../../utilidades/funciones/MensajeToastify";
import ApiBack from "../../../utilidades/dominios/ApiBack";

export const PedidoCrear = () => {
  const navigate = useNavigate();

  // State Management
  const [pedido, setPedido] = useState({
    idProvider: 0,
    date: new Date().toISOString().slice(0, 16),
    state: true,
    products: []
  });
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [proveedores, setProveedores] = useState([]);
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

  const obtenerProveedores = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(
        ApiBack.PROVEEDORES_OBTENER
      );
      setProveedores(resultado);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      MensajeToastify("error", "Error al cargar la lista de proveedores", 4000);
    } finally {
      setCargando(false);
    }
  };

  const crearPedido = async () => {
    try {
      if (!pedido.idProvider) {
        MensajeToastify("error", "Por favor seleccione un proveedor", 4000);
        return;
      }

      if (pedido.products.length === 0) {
        MensajeToastify("error", "Agregue al menos un producto a la pedido", 4000);
        return;
      }

      // Preparar el objeto de pedido según el formato requerido
      const pedidoParaEnviar = {
        idProvider: parseInt(pedido.idProvider),
        date: pedido.date,
        state: true,
        products: pedido.products.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          total: item.total
        }))
      };

      console.log('Datos a enviar:', pedidoParaEnviar);

      await ServicioPrivado.peticionPOST(
        ApiBack.PEDIDOS_CREAR,
        pedidoParaEnviar
      );
      
      MensajeToastify("success", "pedido creada correctamente", 4000);
      navigate("/dashboard/listapedidos");
    } catch (error) {
      console.error("Error al crear la pedido:", error);
      MensajeToastify("error", "Error al crear la pedido", 4000);
    }
  };

  const agregarProductoAPedido = () => {
    if (!productoSeleccionado || cantidadProducto <= 0) {
      MensajeToastify("error", "Por favor seleccione un producto y cantidad válida", 4000);
      return;
    }

    const nuevoItem = {
      productId: productoSeleccionado.productId,
      quantity: cantidadProducto,
      total: productoSeleccionado.priceBuy * cantidadProducto,
      nombreProducto: productoSeleccionado.name,
      precioUnitario: productoSeleccionado.priceBuy
    };

    setPedido(prevPedido => ({
      ...prevPedido,
      products: [...prevPedido.products, nuevoItem]
    }));

    setMostrarModalProducto(false);
    limpiarFormularioProducto();
    MensajeToastify("success", "Producto agregado correctamente", 4000);
  };

  const eliminarProductoDePedido = (index) => {
    setPedido(prevPedido => ({
      ...prevPedido,
      products: prevPedido.products.filter((_, i) => i !== index)
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
    return pedido.products.reduce((total, item) => total + item.total, 0);
  };

  const limpiarFormularioProducto = () => {
    setProductoSeleccionado(null);
    setCantidadProducto(1);
    setBusquedaProducto('');
  };

  // Effects
  useEffect(() => {
    obtenerProveedores();
    obtenerProductos();
  }, []);

  // Render Functions
  const renderFormularioPedido = () => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Datos del Pedido</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Proveedor</label>
            <select
              className="form-select"
              value={pedido.idOrder}
              onChange={(e) => setPedido({ ...pedido, idProvider: e.target.value })}
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="datetime-local"
              className="form-control"
              value={pedido.date}
              onChange={(e) => setPedido({ ...pedido, date: e.target.value })}
            />
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
            {pedido.products.map((item, index) => (
              <tr key={index}>
                <td>{item.nombreProducto}</td>
                <td>{item.quantity}</td>
                <td>${item.precioUnitario.toFixed(2)}</td>
                <td>${item.total.toFixed(2)}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => eliminarProductoDePedido(index)}
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
        <Modal.Title>Agregar Producto al Pedido</Modal.Title>
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
                  <span className="badge bg-secondary">${producto.priceBuy}</span>
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
                    Precio: ${productoSeleccionado.priceBuy}
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
                  Subtotal: ${(productoSeleccionado.priceBuy * cantidadProducto).toFixed(2)}
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
        <h1>Crear Pedido</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/dashboard/listapedidos">Pedidos</Link>
            </li>
            <li className="breadcrumb-item active">Crear Pedido</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            {renderFormularioPedido()}
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
              <Button variant="success" onClick={crearPedido}>
                Crear Pedido
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