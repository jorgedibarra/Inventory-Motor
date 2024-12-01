export const menuItemsEmpleados = [
    {
      id: 'users',
      title: 'Usuarios',
      icon: <Users size={20} />,
      submenu: [
        { title: 'Añadir Usuario', icon: <UserPlus size={18} />, path: '/users/add' },
        { title: 'Gestionar Usuarios', icon: <UserCog size={18} />, path: '/users/manage' }
      ]
    },
    {
      id: 'products',
      title: 'Productos',
      icon: <Package size={20} />,
      submenu: [
        { title: 'Catálogo', icon: <Tags size={18} />, path: '/products/catalog' },
        { title: 'Inventario', icon: <Boxes size={18} />, path: '/products/inventory' },
        { title: 'Añadir producto', icon: <Boxes size={18} />, path: '/products/inventory' }
      ]
    },
    {
      id: 'sales',
      title: 'Ventas',
      icon: <ShoppingCart size={20} />,
      submenu: [
        { title: 'Facturas', icon: <Receipt size={18} />, path: '/sales/invoices' },
        { title: 'Reportes', icon: <TrendingUp size={18} />, path: '/sales/reports' }
      ]
    },
    {
      id: 'orders',
      title: 'Pedidos',
      icon: <ClipboardList size={20} />,
      submenu: [
        { title: 'En Proceso', icon: <Truck size={18} />, path: '/orders/processing' },
        { title: 'Completados', icon: <ClipboardCheck size={18} />, path: '/orders/completed' }
      ]
    }
  ];

