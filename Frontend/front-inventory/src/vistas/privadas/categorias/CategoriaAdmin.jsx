import React, { useState, useEffect, act } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";

import { ToastContainer } from "react-toastify";

import ApiBack from "../../../utilidades/dominios/ApiBack";
import ServicioPrivado from "../../../servicios/ServicioPrivado";
import { MensajeToastify } from "../../../utilidades/funciones/MensajeToastify";

export const CategoriaAdmin = () => {
  // Estados para manejo de categorías
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Estados para el formulario
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [activa, setActiva] = useState("");

  // Estados para modales
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  // Verificar si la categoría tiene productos
  const verificarProductosEnCategoria = async (categoriaId) => {
    try {
      const urlProductosCategoria = `${ApiBack.PRODUCTOS_OBTENER_CATEGORIA}${categoriaId}`;
      const productos = await ServicioPrivado.peticionGET(
        urlProductosCategoria
      );
      return productos.length > 0;
    } catch (error) {
      console.error("Error al verificar productos:", error);
      return false;
    }
  };

  // Función para manejar la selección de categoría
  const handleSeleccionCategoria = (categoria) => {
    setCategoriaSeleccionada(
      categoria.categoryId === categoriaSeleccionada?.categoryId
        ? null
        : categoria
    );
  };

  // Cargar categorías
  const obtenerCategorias = async () => {
    try {
      const urlCategorias = ApiBack.CATEGORIA_OBTENER;
      const respuestaCategorias = await ServicioPrivado.peticionGET(
        urlCategorias
      );
      setCategorias(respuestaCategorias);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      MensajeToastify("error", "No se pudieron cargar las categorías", 5000);
    }
  };

  // Crear nueva categoría
  const crearCategoria = async (e) => {
    e.preventDefault();
    try {
      const nuevaCategoria = {
        name: nombreCategoria,
        active: activa,
      };

      const urlCrear = ApiBack.CATEGORIA_CREAR;
      const resultado = await ServicioPrivado.peticionPOST(
        urlCrear,
        nuevaCategoria
      );

      if (resultado && resultado.categoryId) {
        MensajeToastify("success", "Categoría creada correctamente", 5000);
        obtenerCategorias();
        setMostrarModalCrear(false);
        // Limpiar campos
        setNombreCategoria("");
        setActiva(true);
      }
    } catch (error) {
      console.error("Error al crear categoría:", error);
      MensajeToastify("error", "No se pudo crear la categoría", 5000);
    }
  };

  // Preparar edición
  const prepararEdicion = () => {
    if (!categoriaSeleccionada) {
      MensajeToastify(
        "warning",
        "Por favor, seleccione una categoría para editar",
        5000
      );
      return;
    }

    setNombreCategoria(categoriaSeleccionada.name);
    setActiva(categoriaSeleccionada.active);
    setMostrarModalEditar(true);
  };

  // Actualizar categoría
  const actualizarCategoria = async (e) => {
    e.preventDefault();
    try {
      const categoriaActualizada = {
        ...categoriaSeleccionada,
        name: nombreCategoria,
        active: activa,
      };

      const urlActualizar = ApiBack.CATEGORIA_ACTUALIZAR;
      const resultado = await ServicioPrivado.peticionPUT(
        urlActualizar,
        categoriaActualizada
      );

      if (resultado && resultado.categoryId) {
        MensajeToastify("success", "Categoría actualizada correctamente", 5000);
        obtenerCategorias();
        setMostrarModalEditar(false);
      }
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      MensajeToastify("error", "No se pudo actualizar la categoría", 5000);
    }
  };

  // Preparar eliminación con verificación
  const prepararEliminacion = async () => {
    if (!categoriaSeleccionada) {
      MensajeToastify(
        "warning",
        "Por favor, seleccione una categoría para eliminar",
        5000
      );
      return;
    }

    setMensajeError("");
    const tieneProductos = await verificarProductosEnCategoria(
      categoriaSeleccionada.categoryId
    );

    if (tieneProductos) {
      setMensajeError(
        "No se puede eliminar esta categoría porque tiene productos asociados."
      );
    }

    setMostrarModalEliminar(true);
  };

  // Eliminar categoría
  const eliminarCategoria = async () => {
    try {
      const urlEliminar = `${ApiBack.CATEGORIA_ELIMINAR}${categoriaSeleccionada.categoryId}`;
      await ServicioPrivado.peticionDELETE(urlEliminar);

      MensajeToastify("success", "Categoría eliminada correctamente", 5000);
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      MensajeToastify("error", "No se pudo eliminar la categoría", 5000);
    } finally {
      setMensajeError("");
      obtenerCategorias();
      setMostrarModalEliminar(false);
      setCategoriaSeleccionada(null);
    }
  };

  // Efecto para cargar categorías al montar el componente
  useEffect(() => {
    obtenerCategorias();
  }, []);

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Administración de Categorías</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/dashboard/adminproductos">Administrar productos</Link>
            </li>
            <li className="breadcrumb-item active">Categorías</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Lista de Categorías</h5>

                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Codigo</th>
                      <th>Nombre</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((categoria) => (
                      <tr
                        key={categoria.categoryId}
                        onClick={() => handleSeleccionCategoria(categoria)}
                        className={
                          categoriaSeleccionada?.categoryId ===
                          categoria.categoryId
                            ? "table-primary"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td>{categoria.categoryId}</td>
                        <td>{categoria.name}</td>
                        <td>
                          <Badge bg={categoria.active ? "success" : "danger"}>
                            {categoria.active ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button
                    variant="success"
                    onClick={() => setMostrarModalCrear(true)}
                  >
                    Nueva Categoría
                  </Button>
                  <Button
                    variant="primary"
                    onClick={prepararEdicion}
                    disabled={!categoriaSeleccionada}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={prepararEliminacion}
                    disabled={!categoriaSeleccionada}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Crear Categoría */}
      <Modal
        show={mostrarModalCrear}
        onHide={() => setMostrarModalCrear(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={crearCategoria}>
            <Form.Group className="mb-3" controlId="nombreCategoria">
              <Form.Label>Nombre de la Categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Activa">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                placeholder="Activar la categoría"
                value={activa}
                onChange={(e) => setActiva(e.target.value === "true")}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Crear Categoría
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Editar Categoría */}
      <Modal
        show={mostrarModalEditar}
        onHide={() => setMostrarModalEditar(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={actualizarCategoria}>
            <Form.Group className="mb-3" controlId="nombreCategoriaEditar">
              <Form.Label>Nombre de la Categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="ActivaEditar">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                placeholder="Activar la categoría"
                value={activa}
                onChange={(e) => setActiva(e.target.value === "true")}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Actualizar Categoría
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Eliminar Categoría */}
      <Modal
        show={mostrarModalEliminar}
        onHide={() => setMostrarModalEliminar(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mensajeError ? (
            <div className="alert alert-danger">{mensajeError}</div>
          ) : (
            <p>
              ¿Está seguro que desea eliminar la categoría:{" "}
              <strong>{categoriaSeleccionada?.name}</strong>?
            </p>
          )}
          <Button
            variant="danger"
            onClick={eliminarCategoria}
            className="me-2"
            disabled={!!mensajeError}
          >
            Eliminar
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMostrarModalEliminar(false)}
          >
            Cancelar
          </Button>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </main>
  );
};
