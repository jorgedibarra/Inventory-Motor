import axios from "axios";
import ApiBack from "../utilidades/dominios/ApiBack";

export const iniciarSesion = async (username, password) => {
  try {
    const url = `${ApiBack.URL}${ApiBack.INICIAR_SESION}`;
    const response = await axios.post(url, { username, password }, {
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    });
    // Extraer el token desde los headers
    const token = response.headers["authorization"];
    if (token) {
      // Guardar el token en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        id: response.data.name,
        role: response.data.roles,
        imagenPerfil: response.data.photo
      }));
      console.log("Token guardado exitosamente:", token);
      console.log("Usuario guardado exitosamente:", response.data.name);
      
    } else {
      console.error("No se encontró el token en los headers.");
    }
    return response.data; // Devuelve los datos recibidos
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error.response?.data || "Error en la solicitud"; // Maneja el error
  }
};

// Función para obtener usuario desde localStorage
export const getUserFromSession = () => {
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : null;
};
