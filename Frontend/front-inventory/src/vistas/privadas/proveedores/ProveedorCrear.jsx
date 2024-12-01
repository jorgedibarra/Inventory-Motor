import { useState } from "react";
import { Link } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { ToastContainer } from "react-toastify";

import ApiBack from "../../../utilidades/dominios/ApiBack";
import ServicioPrivado from "../../../servicios/ServicioPrivado";
import { useFormulario } from "../../../utilidades/misHooks/useFormulario";
import { MensajeToastify } from "../../../utilidades/funciones/MensajeToastify";

export const ProveedorCrear = () => {
  // Variables de estado
  const [enProceso, setEnProceso] = useState(false);

  // Objeto para el formulario
  const {
    name,
    identificationDocument,
    address,
    phone,
    email,
    dobleEnlace,
    objeto,
  } = useFormulario({
    name: "",
    identificationDocument: "",
    address: "",
    phone: "",
    email: "",
    state: true
  });

  // Verificar y crear el formulario
  const verificarFormulario = async (fh) => {
    fh.preventDefault();
    setEnProceso(true);
    const formularioActual = fh.currentTarget;

    formularioActual.classList.add("was-validated");
    if (formularioActual.checkValidity() === false) {
      fh.preventDefault();
      fh.stopPropagation();
    } else {
      try {
        const urlCrear = ApiBack.PROVEEDORES_CREAR;
        const resultado = await ServicioPrivado.peticionPOST(urlCrear, objeto);

        if (resultado && resultado.id) {
          MensajeToastify("success", "Proveedor creado correctamente", 4000);
          
          // Reset form after successful creation
          Object.keys(objeto).forEach(key => {
            objeto[key] = key === 'state' ? true : '';
          });
        } else {
          MensajeToastify("error", "No se puede crear el proveedor", 6000);
        }
      } catch (error) {
        console.error("Error al crear el proveedor:", error);
        MensajeToastify("error", "Error al crear el proveedor", 6000);
      } finally {
        setEnProceso(false);
      }
    }
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Proveedores</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/dashboard/adminproveedores">Administración de Proveedores</Link>
            </li>
            <li className="breadcrumb-item active">Crear</li>
          </ol>
        </nav>
      </div>

      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Registrar nuevo proveedor</h5>

            <Form
              noValidate
              validated={enProceso}
              onSubmit={verificarFormulario}
            >
              <Form.Group as={Row} className="mb-3" controlId="name">
                <Form.Label column sm={3}>Nombre del proveedor:</Form.Label>
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

              <Form.Group as={Row} className="mb-3" controlId="identificationDocument">
                <Form.Label column sm={3}>NIT:</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    size="sm"
                    required
                    type="text"
                    name="identificationDocument"
                    value={identificationDocument}
                    onChange={dobleEnlace}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="address">
                <Form.Label column sm={3}>Dirección:</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    size="sm"
                    required
                    type="text"
                    name="address"
                    value={address}
                    onChange={dobleEnlace}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="phone">
                <Form.Label column sm={3}>Teléfono:</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    size="sm"
                    required
                    type="text"
                    name="phone"
                    value={phone}
                    onChange={dobleEnlace}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="email">
                <Form.Label column sm={3}>Correo electrónico:</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    size="sm"
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={dobleEnlace}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 9, offset: 3 }}>
                  <Button type="submit" className="btn btn-primary">
                    Crear proveedor
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
};