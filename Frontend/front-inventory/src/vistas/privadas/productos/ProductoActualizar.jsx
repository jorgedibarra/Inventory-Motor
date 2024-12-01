import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { ToastContainer } from "react-toastify";

import ApiBack from "../../../utilidades/dominios/ApiBack";
import ServicioPrivado from "../../../servicios/ServicioPrivado";
import { useFormulario } from "../../../utilidades/misHooks/useFormulario";
import { MensajeToastify } from "../../../utilidades/funciones/MensajeToastify";

export const ProductoActualizar = () => {
  // Variables
  const { codigo } = useParams();

  const [todoListo, setTodoListo] = useState(false);
  const cargaFinalizada = todoListo !== false;

  const [enProceso, setEnProceso] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // Objeto para el formulario
  const {
    name,
    description,
    categoryId,
    providerId,
    priceSale,
    priceBuy,
    vat,
    stock,
    image,
    dobleEnlace,
    objeto,
  } = useFormulario({
    name: "",
    description: "",
    categoryId: 0,
    providerId: 0,
    priceSale: 0,
    priceBuy: 0,
    vat: 0,
    stock: 0,
    image: "",
    state: true,
  });

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

  const obtenerProveedores = async () => {
    try {
      const resultado = await ServicioPrivado.peticionGET(
        ApiBack.PROVEEDORES_OBTENER
      );
      setProveedores(resultado);
      return resultado;
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  const handleProveedorChange = (e) => {
    const selectedProveedorId = parseInt(e.target.value);
    objeto.providerId = selectedProveedorId;
    dobleEnlace(e);
  };


  // Consultar datos del producto a modificar
  const obtenerUnProducto = async () => {
    const urlCargarUnProducto = ApiBack.PRODUCTOS_OBTENER_UNO + codigo;
    const productoRecibido = await ServicioPrivado.peticionGET(
      urlCargarUnProducto
    );

    // Mapear los campos recibidos al objeto
    objeto.productId = productoRecibido.productId;
    objeto.name = productoRecibido.name;
    objeto.description = productoRecibido.description;
    objeto.categoryId = productoRecibido.categoryId;
    objeto.providerId = productoRecibido.providerId;
    objeto.priceSale = productoRecibido.priceSale;
    objeto.priceBuy = productoRecibido.priceBuy;
    objeto.vat = productoRecibido.vat;
    objeto.stock = productoRecibido.stock;
    objeto.image = productoRecibido.image;
    objeto.state = true; // Siempre establecer en true

    dobleEnlace({
      target: {
        name: "categoryId",
        value: productoRecibido.categoryId,
      },
    });

    if (productoRecibido) {
      setTodoListo(true);
    }
  };

  // Verificar y actualizar el formulario
  const verificarFormulario = async (fh) => {
    fh.preventDefault();
    setEnProceso(true);
    const formularioActual = fh.currentTarget;

    formularioActual.classList.add("was-validated");
    if (formularioActual.checkValidity() === false) {
      fh.preventDefault();
      fh.stopPropagation();
    } else {
      const datosAEnviar = {
        ...objeto,
        categoryId: parseInt(objeto.categoryId),
      };
      const urlActualizar = ApiBack.PRODUCTOS_ACTUALIZAR;
      const resultado = await ServicioPrivado.peticionPUT(
        urlActualizar,
        datosAEnviar
      );

      console.log("Resultado de verificarFormulario:", resultado);

      if (resultado && resultado.productId) {
        setEnProceso(false);
        MensajeToastify("success", "Producto actualizado correctamente", 5000);
      } else {
        MensajeToastify("error", "No se puede actualizar el producto", 5000);
      }
    }
  };

  // Manejador para cambiar la categoría
  const handleCategoryChange = (e) => {
    const selectedCategoryId = parseInt(e.target.value);
    console.log("Categoría seleccionada:", selectedCategoryId);
    objeto.categoryId = selectedCategoryId;
    dobleEnlace({
      ...e,
      target: {
        name: "categoryId",
        value: selectedCategoryId,
      },
    });
  };

  // Hook para cargar información una vez renderizado el componente
  useEffect(() => {
    obtenerUnProducto();
    obtenerCategorias();
    obtenerProveedores();
  }, []);

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Productos</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/dashboard/adminproductos">
                Administrar de Productos
              </Link>
            </li>
            <li className="breadcrumb-item active">Actualizar</li>
          </ol>
        </nav>
      </div>

      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Actualiza los campos del producto</h5>

            {cargaFinalizada ? (
              <Form
                noValidate
                validated={enProceso}
                onSubmit={verificarFormulario}
              >
                <Form.Group as={Row} className="mb-3" controlId="name">
                  <Form.Label column sm={3}>
                    Nombre del producto:
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      size="sm"
                      required
                      type="text"
                      name="name"
                      value={name}
                      onChange={dobleEnlace}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="description">
                  <Form.Label column sm={3}>
                    Descripción:
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      size="sm"
                      required
                      type="text"
                      name="description"
                      value={description}
                      onChange={dobleEnlace}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="categoryId">
                  <Form.Label column sm={3}>
                    Categoría:
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Select
                      size="sm"
                      required
                      name="categoryId"
                      value={categoryId || ""}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Seleccione una categoría</option>
                      {categorias.map((categoria) => (
                        <option
                          key={categoria.categoryId}
                          value={categoria.categoryId}
                        >
                          {categoria.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="providerId">
                <Form.Label column sm={3}>
                  Proveedor:
                </Form.Label>
                <Col sm={9}>
                  <Form.Select
                    size="sm"
                    required
                    name="providerId"
                    value={providerId}
                    onChange={handleProveedorChange}
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map((proveedor) => (
                      <option
                        key={proveedor.id}
                        value={proveedor.id}
                      >
                        {proveedor.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="priceSale">
                  <Form.Label column sm={3}>
                    Precio de Venta:
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      size="sm"
                      required
                      type="number"
                      name="priceSale"
                      value={priceSale}
                      onChange={dobleEnlace}
                      step="0.01"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="priceBuy">
                  <Form.Label column sm={3}>
                    Precio de Compra:
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      size="sm"
                      required
                      type="number"
                      name="priceBuy"
                      value={priceBuy}
                      onChange={dobleEnlace}
                      step="0.01"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="vat">
                  <Form.Label column sm={3}>
                    IVA:
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      size="sm"
                      required
                      type="number"
                      name="vat"
                      value={vat}
                      onChange={dobleEnlace}
                      step="0.01"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="stock">
                  <Form.Label column sm={3}>
                    Cantidad:
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      size="sm"
                      required
                      type="number"
                      name="stock"
                      value={stock}
                      onChange={dobleEnlace}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Col sm={{ span: 9, offset: 3 }}>
                    <Button type="submit" className="btn btn-primary">
                      Actualizar producto
                    </Button>
                  </Col>
                </Form.Group>
              </Form>
            ) : (
              <div>Cargando información del producto</div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
};
