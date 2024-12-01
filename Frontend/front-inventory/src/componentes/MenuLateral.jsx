import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingCart,
  PackageSearch,
  UserPlus,
  UserCog,
  Boxes,
  Receipt,
  Factory,
  Contact,
  ListOrdered,
} from "lucide-react";
import axios from "axios";
import ApiBack from "../utilidades/dominios/ApiBack";

export const MenuLateral = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Obtener el username desde localStorage
    const username = localStorage.getItem('username');
    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwtToken');
    console.log("Username:", username);
    console.log("Token:", token);
    
    const fetchUserRole = async () => {
      if (username && token) {
        try {
          // Realiza una petición para obtener el rol del usuario
          const response = await axios.get(
            `${ApiBack.URL}${ApiBack.ROLES_OBTENER}`, 
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          setUserRole(response.data.role);
          console.log("User role:", response.data.role);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
}, []);

  const allMenuItems = [
    {
      id: "users",
      title: "Usuarios",
      icon: <Users size={20} />,
      path: "/dashboard/adminusuarios",
      requiredRole: "ADMIN"
    },
    {
      id: "products",
      title: "Productos",
      icon: <Boxes size={20} />,
      path: "/dashboard/adminproductos",
      requiredRole: null // Accesible para todos
    },
    {
      id: "sales",
      title: "Ventas",
      icon: <ShoppingCart size={20} />,
      path: "/dashboard/listaventas",
      requiredRole: null // Accesible para todos
    },
    {
      id: "orders",
      title: "Pedidos",
      icon: <PackageSearch size={20} />,
      path: "/dashboard/listapedidos",
      requiredRole: null // Accesible para todos
    },
    {
      id: "providers",
      title: "Proveedores",
      icon: <Factory size={20} />,
      path: "/dashboard/adminproveedores",
      requiredRole: null // Accesible para todos
    },
    {
      id: "clients",
      title: "Clientes",
      icon: <Contact size={20} />,
      path: "/dashboard/listaclientes",
      requiredRole: null // Accesible para todos
    },
  ];

   // Filtrar menú según el rol
   const menuItems = allMenuItems.filter(
    item => item.requiredRole === null || (userRole === "ADMIN" && item.requiredRole === "ADMIN")
  );

  return (
    <aside id="sidebar"
      className="sidebar"
    >
      <style>
        {`
          .menu-link {
            text-decoration: none;
          }
          .menu-button {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
            padding: 0.875rem 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            color: #1f2937;
            transition: all 0.3s ease;
          }
          .menu-button:hover {
            background-color: #e6f2ff;
            color: #2563eb;
          }
          .menu-button.active {
            background-color: #e6f2ff;
            color: #2563eb;
          }
          .menu-button-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .menu-title {
            font-weight: 500;
            font-size: 0.9375rem;
          }
        `}
      </style>
      {menuItems.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className="menu-link"
          onClick={() => {
            setActiveMenu(item.path);
          }}
        >
          <div
            className={`menu-button ${
              activeMenu === item.path ? "active" : ""
            }`}
          >
            <div className="menu-button-content">
              {item.icon}
              <span className="menu-title">{item.title}</span>
            </div>
          </div>
        </Link>
      ))}
    </aside>
  );
};