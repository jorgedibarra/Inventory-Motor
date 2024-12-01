import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import axios from "axios"; // Make sure to install axios: npm install axios

import ApiBack from "../../../utilidades/dominios/ApiBack";
import ServicioPrivado from "../../../servicios/ServicioPrivado";
import { MensajeToastify } from "../../../utilidades/funciones/MensajeToastify";

export const UsuarioCrear = () => {
  const navigate = useNavigate();

  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [state, setState] = useState(true);

  // Validation state
  const [validated, setValidated] = useState(false);

  // Roles options
  const rolesOptions = [
    { value: "", label: "Seleccione un rol" },
    { value: "ADMIN", label: "Administrador" },
    { value: "USUARIO", label: "Usuario" },
  ];

  // Handle file upload
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        MensajeToastify("error", "La imagen no debe superar 5MB", 3000);
        e.target.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        MensajeToastify("error", "Solo se permiten imágenes JPG, PNG o GIF", 3000);
        e.target.value = '';
        return;
      }

      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Crear usuario
  const crearNuevoUsuario = async (usuarioData) => {
    try {

      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      // First, create the user
      const userResponse = await ServicioPrivado.peticionPOST(
        ApiBack.USUARIOS_CREAR, 
        {
          name: usuarioData.name,
          email: usuarioData.email,
          createdDate: new Date(),
          password: usuarioData.password,
          state: usuarioData.state,
          role: usuarioData.role
        },
        config
      );

      // If user creation is successful and photo exists, upload the image
      if (userResponse && usuarioData.photo) {
        const formData = new FormData();
        formData.append('file', usuarioData.photo);
        formData.append('userId', usuarioData.name); 

        const imageUploadConfig = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        };

        const imageUploadResponse = await axios.post(
          'http://localhost:8099/inventory/api/user/upload-image', 
          formData, 
          imageUploadConfig,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (imageUploadResponse.status === 200) {
          MensajeToastify("success", "Usuario y foto creados correctamente", 6000);
        }
      } else {
        MensajeToastify("success", "Usuario creado correctamente", 6000);
      }

      // Navigate to user list
      navigate("/dashboard/adminusuarios");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      MensajeToastify("error", "No se pudo crear el usuario", 6000);
    }
  };

  // Manejar submit del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Validación del formulario
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // Objeto para enviar
    const usuarioNuevo = {
      name,
      email,
      password,
      role,
      photo,
      state
    };

    crearNuevoUsuario(usuarioNuevo);
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Crear Usuario</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard">Inicio</a>
            </li>
            <li className="breadcrumb-item">
              <Link to="/dashboard/adminusuarios">Usuarios</Link>
            </li>
            <li className="breadcrumb-item active">Crear usuario</li>
          </ol>
        </nav>
      </div>

      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Formulario de Registro de Usuario</h5>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="row">
                {/* Nombre */}
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el nombre"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    El nombre es obligatorio
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Correo */}
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingrese el correo"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Ingrese un correo válido
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingrese la contraseña"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    La contraseña es obligatoria (mínimo 8 caracteres)
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Rol */}
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {rolesOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Seleccione un rol
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Foto de Perfil */}
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Foto de Perfil</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={handleFotoChange}
                  />
                  {photoPreview && (
                    <div className="mt-2">
                      <img
                        src={photoPreview}
                        alt="Vista previa"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </Form.Group>
              </div>

              {/* Botones */}
              <div className="text-center mt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="me-2"
                >
                  <i className="fa-solid fa-floppy-disk me-2"></i>
                  Guardar
                </Button>
                <Link 
                  to="/dashboard/usuariosadmin" 
                  className="btn btn-secondary"
                >
                  <i className="fa-solid fa-xmark me-2"></i>
                  Cancelar
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
};