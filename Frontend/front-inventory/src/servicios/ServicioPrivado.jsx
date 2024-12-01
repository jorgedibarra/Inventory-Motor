import ApiBack from "../utilidades/dominios/ApiBack";

// ServicioPrivado.js
class ServicioPrivado {
  // Servicio con bearer para hacer peticiones GET
  static async peticionGET(urlServicio) {
    try {
      const bearer = `Bearer ${localStorage.getItem("jwtToken")}`;
      const response = await fetch(`${ApiBack.URL}${urlServicio}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: bearer,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error en peticionGET:", error);
      throw error;
    }
  }

  // Servicio con bearer para hacer peticiones POST
  static async peticionPOST(urlServicio, miJSON) {
    try {
      const bearer = `Bearer ${localStorage.getItem("jwtToken")}`;
      const response = await fetch(`${ApiBack.URL}${urlServicio}`, {
        method: "POST",
        body: JSON.stringify(miJSON),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: bearer,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error en peticionPOST:", error);
      throw error;
    }
  }

  // Servicio con bearer para hacer peticiones DELETE
  static async peticionDELETE(urlServicio) {
    try {
      const bearer = `Bearer ${localStorage.getItem("jwtToken")}`;
      const response = await fetch(`${ApiBack.URL}${urlServicio}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: bearer,
        },
      });
      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Verifica si hay contenido antes de hacer el parse
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Error en peticionDELETE:", error);
      throw error;
    }
  }

  // Servicio con bearer para hacer peticiones PUT
  static async peticionPUT(urlServicio, miJSON) {
    try {
      const bearer = `Bearer ${localStorage.getItem("jwtToken")}`;
      const response = await fetch(`${ApiBack.URL}${urlServicio}`, {
        method: "PUT",
        body: JSON.stringify(miJSON),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: bearer,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error en peticionPUT:", error);
      throw error;
    }
  }
}

export default ServicioPrivado;
