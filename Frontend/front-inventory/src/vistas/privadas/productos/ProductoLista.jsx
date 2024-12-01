import React, { useState, useEffect } from 'react';
import ServicioPrivado  from '../../../servicios/ServicioPrivado';
import ApiBack from '../../../utilidades/dominios/ApiBack';

export const ProductoLista = () => {

  const [arregloProductos, setArregloProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Función para obtener productos
  const obtenerProductos = async () => {
    const resultado = await ServicioPrivado.peticionGET( ApiBack.PRODUCTOS_OBTENER );
    console.log("Resultado de obtenerProductos:", resultado);
    setArregloProductos(resultado);
    return resultado;
  };

  // Función para filtrar productos según la búsqueda
  const filtrarProductos = (texto) => {
    const productosFiltrados = arregloProductos.filter((producto) =>
      producto.name.toLowerCase().includes(texto.toLowerCase())
    );
    setProductosFiltrados(productosFiltrados);
  };

  // Función para manejar el evento de cambio en el input de búsqueda
  const handleInputChange = (event) => {
    setBusqueda(event.target.value);
  };

  // Función para manejar el evento de clic en el botón de búsqueda
  const handleSearchClick = (event) => {
    event.preventDefault();
    filtrarProductos(busqueda);
  };

  // Obtener la lista de proveedores
  const obtenerProveedores = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(ApiBack.PROVEEDORES_OBTENER);
      setProveedores(resultado);
      return resultado;
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  // Obtener la lista de categorias
  const obtenerCategorias = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(ApiBack.CATEGORIA_OBTENER);
      setCategorias(resultado);
      return resultado;
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  // Hook de react que se usa cuando se renderiza o pinta la página (vista)
  useEffect(() => {
    obtenerProductos();
    obtenerProveedores();
    obtenerCategorias();
  }, []);

  // Función para obtener el nombre del proveedor por su ID
  const obtenerNombreProveedor = (proveedorId) => {
    const proveedor = proveedores.find(p => p.id === proveedorId);
    return proveedor ? proveedor.name : 'Proveedor no encontrado';
  };

  // Función para obtener el nombre del proveedor por su ID
  const obtenerNombreCategoria = (categoriaId) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.name : 'Categoria no encontrado';
  };

  return (
    <main id="main" className="main">

      {/* Navegación estilo breadcrumb: Inicio */}
      <div className="pagetitle">
        <h1>Productos</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard">Inicio</a>
            </li>
            <li className="breadcrumb-item active">Listado de productos</li>
          </ol>
        </nav>
      </div>
      {/* Navegación estilo breadcrumb: Fin */}
      <div className="row mb-4">
        <div className="col-lg-12">
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
      </div>

      {/* Ejemplo de una tabla para presentación de datos: Inicio */}
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "10%" }}>Orden</th>
                  <th className="text-center" style={{ width: "12%" }}>Nombre producto</th>
                  <th className="text-center" style={{ width: "18%" }}>Descripcion</th>
                  <th className="text-center" style={{ width: "12%" }}>Categoria</th>
                  <th className="text-center" style={{ width: "12%" }}>Proveedor</th>
                  <th className="text-center" style={{ width: "12%" }}>Precio V</th>
                  <th className="text-center" style={{ width: "12%" }}>Precio C</th>
                  <th className="text-center" style={{ width: "12%" }}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {arregloProductos.map((miProducto, indice) => (
                  <tr key={indice}>
                    <td className="text-center">{indice + 1}</td>
                    <td className="text-center">{miProducto.name}</td>
                    <td className="text-center">{miProducto.description}</td>
                    <td className="text-center">{obtenerNombreCategoria(miProducto.category)}</td>
                    <td className="text-center">{obtenerNombreProveedor(miProducto.providerId)}</td>
                    <td className="text-center">{miProducto.priceSale}</td>
                    <td className="text-center">{miProducto.priceBuy}</td>
                    <td className="text-center">{miProducto.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Ejemplo de una tabla para presentación de datos: Fin */}

    </main>
  );
};

