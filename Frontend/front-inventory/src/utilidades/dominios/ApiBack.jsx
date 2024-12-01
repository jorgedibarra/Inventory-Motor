const ApiBack = {
    URL: 'http://localhost:8099/inventory/api',
    INICIAR_SESION: '/auth/login',

    PRODUCTOS_OBTENER: '/products/all',
    PRODUCTOS_OBTENER_UNO: '/products/',
    PRODUCTOS_ACTUALIZAR: '/products/update',
    PRODUCTOS_CREAR: '/products/save',
    PRODUCTOS_ELIMINAR: '/products/delete',
    PRODUCTOS_OBTENER_CATEGORIA: '/products/category/',

    VENTAS_OBTENER: '/sale/all',
    VENTAS_OBTENER_UNO: '/sale/',
    VENTAS_ACTUALIZAR: '/sale/update',
    VENTAS_CREAR: '/sale/save',


    PEDIDOS_OBTENER: '/order/all',
    PEDIDOS_OBTENER_UNO: '/order/',
    PEDIDOS_ACTUALIZAR: '/order/update',
    PEDIDOS_CREAR: '/order/save',


    CLIENTES_OBTENER: '/client/all',
    CLIENTES_OBTENER_UNO: '/client/',
    CLIENTES_ACTUALIZAR: '/client/update',
    CLIENTES_CREAR: '/client/save',
    CLIENTES_ELIMINAR: '/client/delete/',


    PROVEEDORES_OBTENER: '/provider/all',
    PROVEEDORES_OBTENER_UNO: '/provider/',
    PROVEEDORES_ACTUALIZAR: '/provider/update',
    PROVEEDORES_CREAR: '/provider/save',
    PROVEEDORES_ELIMINAR: '/provider/delete/',


    CATEGORIA_OBTENER: '/category/all',
    CATEGORIA_OBTENER_UNO: '/category/',
    CATEGORIA_ACTUALIZAR: '/category/update',
    CATEGORIA_CREAR: '/category/save',
    CATEGORIA_ELIMINAR: '/category/delete/',


    USUARIOS_OBTENER: '/user/all',
    USUARIOS_OBTENER_UNO: '/user/',
    USUARIOS_ACTUALIZAR: '/user/update',
    USUARIOS_CREAR: '/user/save',
    USUARIOS_ELIMINAR: '/user/delete/',

    ROLES_OBTENER: '/role/all',
    ROLES_OBTENER_UNO: '/role/',
}

export default ApiBack;