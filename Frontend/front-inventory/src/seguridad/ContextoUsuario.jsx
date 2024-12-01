// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserFromSession } from '../servicios/ServicioAutenticacion';

// Crear el contexto
const AuthContext = createContext(null);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Función para actualizar el usuario
  const updateUser = () => {
    const usuarioActual = getUserFromSession();
    setUsuario(usuarioActual);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsuario(null);
    window.location.href = '/login';
  };

  // Cargar usuario al inicio
  useEffect(() => {
    updateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      updateUser, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};