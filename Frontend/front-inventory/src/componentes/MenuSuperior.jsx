import React, { useContext, useState, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../seguridad/ContextoUsuario';

export const MenuSuperior = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [username, setUsername] = useState(''); 
    const { usuario, logout } = useAuth();

    // Cargar el username desde localStorage al montar el componente
    useEffect(() => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
          setUsername(storedUsername);
      }
  }, []);

    return (
      <nav className="navbar">
        <style>
          {`
            .navbar {
              background-color: #ffffff;
              height: 70px;
              padding: 0 2rem;
              box-shadow: 0 2px 4px rgba(0,0,0,0.08);
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              z-index: 1000;
              display: flex;
              align-items: center;
            }
  
            .navbar-container {
              max-width: 1400px;
              margin: 0 auto;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
  
            .nav-left {
              display: flex;
              align-items: center;
              gap: 1rem;
            }
  
            .menu-button {
              display: none;
              background: none;
              border: none;
              cursor: pointer;
              padding: 0.5rem;
            }
  
            .brand {
              font-size: 1.5rem;
              font-weight: bold;
              color: #2563eb;
              text-decoration: none;
            }
  
            .search-container {
              position: relative;
              width: 400px;
              margin: 0 2rem;
            }
  
            .search-input {
              width: 100%;
              padding: 0.75rem 1rem 0.75rem 2.5rem;
              border: 1px solid #e5e7eb;
              border-radius: 0.5rem;
              outline: none;
              transition: all 0.3s ease;
            }
  
            .search-input:focus {
              border-color: #2563eb;
              box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
            }
  
            .search-icon {
              position: absolute;
              left: 0.75rem;
              top: 50%;
              transform: translateY(-50%);
              color: #6b7280;
            }
  
            .nav-right {
              display: flex;
              align-items: center;
              gap: 1rem;
            }
  
            .nav-button {
              background: none;
              border: none;
              padding: 0.5rem;
              cursor: pointer;
              position: relative;
              display: flex;
              align-items: center;
              color: #1f2937;
              border-radius: 0.375rem;
            }
  
            .nav-button:hover {
              background-color: #f3f4f6;
            }
  
            .notification-badge {
              position: absolute;
              top: 0;
              right: 0;
              background-color: #ef4444;
              color: white;
              font-size: 0.75rem;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
  
            .profile-button {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.5rem 1rem;
            }
  
            .profile-avatar {
              width: 38px;
              height: 38px;
              background-color: #2563eb;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
            }
  
            .profile-info {
              text-align: left;
            }
  
            .profile-name {
              font-weight: 600;
              color: #1f2937;
            }
  
            .profile-role {
              font-size: 0.875rem;
              color: #6b7280;
            }
  
            .dropdown {
              position: absolute;
              top: 100%;
              right: 0;
              background-color: white;
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
              border: 1px solid #e5e7eb;
              min-width: 200px;
              margin-top: 0.5rem;
              opacity: 0;
              visibility: hidden;
              transform: translateY(-10px);
              transition: all 0.3s ease;
            }
  
            .dropdown.active {
              opacity: 1;
              visibility: visible;
              transform: translateY(0);
            }
  
            .dropdown-item {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.75rem 1rem;
              color: #1f2937;
              text-decoration: none;
              transition: background-color 0.2s ease;
            }
  
            .dropdown-item:hover {
              background-color: #f3f4f6;
            }
  
            .dropdown-divider {
              height: 1px;
              background-color: #e5e7eb;
              margin: 0.5rem 0;
            }
  
            .dropdown-item.danger {
              color: #dc2626;
            }
  
            @media (max-width: 1024px) {
              .search-container {
                width: 300px;
              }
  
              .profile-info {
                display: none;
              }
            }
  
            @media (max-width: 768px) {
              .navbar {
                padding: 0 1rem;
              }
  
              .menu-button {
                display: block;
              }
  
              .search-container {
                display: none;
              }
  
              .nav-right {
                gap: 0.5rem;
              }
            }
          `}
        </style>
  
        <div className="navbar-container">
          <div className="nav-left">
            
            <a href="/dashboard" className="brand">InventoryMotor</a>
          </div>
  
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="search-input"
            />
            <Search className="search-icon" size={20} />
          </div>
  
          <div className="nav-right">
            <div style={{ position: 'relative' }}>
              <button 
                className="nav-button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell size={22} />
                <span className="notification-badge">3</span>
              </button>
              {isNotificationsOpen && (
                <div className={`dropdown ${isNotificationsOpen ? 'active' : ''}`}>
                  <a href="#" className="dropdown-item">
                    <span>Nuevo mensaje recibido</span>
                  </a>
                  <div className="dropdown-divider" />
                  <a href="#" className="dropdown-item">
                    <span>Sistema actualizado</span>
                  </a>
                  <div className="dropdown-divider" />
                  <a href="#" className="dropdown-item">
                    <span>Ver todas las notificaciones</span>
                  </a>
                </div>
              )}
            </div>
  
            <div style={{ position: 'relative' }}>
              <button 
                className="nav-button profile-button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="profile-avatar">
                  <User size={20} />
                </div>
                <div className="profile-info">
                  <div className="profile-name">{username}</div>
                  <div className="profile-role">Administrador</div>
                </div>
              </button>
  
              {isProfileOpen && (
                <div className={`dropdown ${isProfileOpen ? 'active' : ''}`}>
                  <a href="#" className="dropdown-item">
                    <User size={18} />
                    <span>Mi perfil</span>
                  </a>
                  <a href="#" className="dropdown-item">
                    <Settings size={18} />
                    <span>Configuración</span>
                  </a>
                  <div className="dropdown-divider" />
                  <a href="/" className="dropdown-item danger">
                    <LogOut size={18} />
                    <span>Salir</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
};