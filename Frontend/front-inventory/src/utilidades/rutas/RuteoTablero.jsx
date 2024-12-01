import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ProductoLista } from "../../vistas/privadas/productos/ProductoLista";
import { ProductoAdmin } from "../../vistas/privadas/productos/ProductoAdmin";
import { ProductoActualizar } from "../../vistas/privadas/productos/ProductoActualizar";
import { ProductoCrear } from "../../vistas/privadas/productos/ProductoCrear";

import { VentaLista } from "../../vistas/privadas/ventas/VentaLista";

import { PedidoLista } from "../../vistas/privadas/pedidos/PedidosLista";

import { ClienteLista } from "../../vistas/privadas/clientes/ClientesLista";

import { ProveedorAdmin } from "../../vistas/privadas/proveedores/ProveedorAdmin";
import { VentaVer } from "../../vistas/privadas/ventas/VentaVer";
import { VentaCrear } from "../../vistas/privadas/ventas/VentaCrear";
import { ProveedorCrear } from "../../vistas/privadas/proveedores/ProveedorCrear";
import { ProveedorActualizar } from "../../vistas/privadas/proveedores/ProveedorActualizar";
import { ClienteCrear } from "../../vistas/privadas/clientes/ClienteCrear";
import { ClienteActualizar } from "../../vistas/privadas/clientes/ClienteActualizar"
import { PedidoCrear } from "../../vistas/privadas/pedidos/PedidoCrear";
import { UsuarioAdmin } from "../../vistas/privadas/usuarios/UsuarioAdmin";
import { UsuarioCrear } from "../../vistas/privadas/usuarios/UsuarioCrear";
import { CategoriaAdmin } from "../../vistas/privadas/categorias/CategoriaAdmin";
import { UsuarioActualizar } from "../../vistas/privadas/usuarios/UsuarioActualizar";
import { PedidoActualizar } from "../../vistas/privadas/pedidos/PedidoActualizar";

const cargando = (
    <div className="d-flex justify-content-center">
      <div className="mt-3">
        <button className="btn btn-primary" type="button" disabled>
          <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" ></span>
          Cargando información...
        </button>
      </div>
    </div>
  );

  const LazyInicio = lazy(() => import("../../vistas/publicas/Inicio"));
  const LazyProductoListado = lazy(() => import("../../vistas/privadas/productos/ProductoLista").then(() => ({ default: ProductoLista })));
  const LazyProductoAdmin = lazy(() => import("../../vistas/privadas/productos/ProductoAdmin").then(() => ({ default: ProductoAdmin })));
  const LazyProductoActualizar = lazy(() => import("../../vistas/privadas/productos/ProductoActualizar").then(() => ({ default: ProductoActualizar })));
  const LazyProductoCrear = lazy(() => import("../../vistas/privadas/productos/ProductoCrear").then(() => ({ default: ProductoCrear })));

  const LazyVentaLista = lazy(() => import("../../vistas/privadas/ventas/VentaLista").then(() => ({ default: VentaLista })));
  const LazyVentaVer = lazy(() => import("../../vistas/privadas/ventas/VentaVer").then(() => ({ default: VentaVer })));
  const LazyVentaCrear = lazy(() => import("../../vistas/privadas/ventas/VentaCrear").then(() => ({ default: VentaCrear })));

  const LazyPedidoLista = lazy(() => import("../../vistas/privadas/pedidos/PedidosLista").then(() => ({ default: PedidoLista })));
  const LazyPedidoCrear = lazy(() => import("../../vistas/privadas/pedidos/PedidoCrear").then(() => ({ default: PedidoCrear })));
  const LazyPedidoActualizar = lazy(() => import("../../vistas/privadas/pedidos/PedidoActualizar").then(() => ({ default: PedidoActualizar })));

  const LazyClienteLista = lazy(() => import("../../vistas/privadas/clientes/ClientesLista").then(() => ({ default: ClienteLista })));
  const LazyClienteCrear = lazy(() => import("../../vistas/privadas/clientes/ClienteCrear").then(() => ({ default: ClienteCrear })));
  const LazyClienteActualizar = lazy(() => import("../../vistas/privadas/clientes/ClienteActualizar").then(() => ({ default: ClienteActualizar })));

  const LazyProveedorAdmin = lazy(() => import("../../vistas/privadas/proveedores/ProveedorAdmin").then(() => ({ default: ProveedorAdmin })));
  const LazyProveedorCrear = lazy(() => import("../../vistas/privadas/proveedores/ProveedorCrear").then(() => ({ default: ProveedorCrear })));
  const LazyProveedorActualizar = lazy(() => import("../../vistas/privadas/proveedores/ProveedorActualizar").then(() => ({ default: ProveedorActualizar })));

  const LazyUsuarioLista = lazy(() => import("../../vistas/privadas/usuarios/UsuarioAdmin").then(() => ({ default: UsuarioAdmin })));
  const LazyUsuarioCrear = lazy(() => import("../../vistas/privadas/usuarios/UsuarioCrear").then(() => ({ default: UsuarioCrear })));
  const LazyUsuarioActualizar = lazy(() => import("../../vistas/privadas/usuarios/UsuarioActualizar").then(() => ({ default: UsuarioActualizar })));

  const LazyCategoriaAdmin = lazy(() => import("../../vistas/privadas/categorias/CategoriaAdmin").then(() => ({ default: CategoriaAdmin })));

export const RuteoTablero = () => {
    return (
        <Suspense fallback={cargando}>
            <Routes>
                <Route path="/" element={<LazyInicio/>}/>
                <Route path="/listaproductos" element={<LazyProductoListado/>}/>
                <Route path="/adminproductos" element={<LazyProductoAdmin/>}/>
                <Route path="/actualizarproducto/:codigo" element={<LazyProductoActualizar/>}/>
                <Route path="/crearproducto" element={<LazyProductoCrear/>}/>

                <Route path="/listaventas" element={<LazyVentaLista/>}/>
                <Route path="/verventa/:codigo" element={<LazyVentaVer/>}/>
                <Route path="/crearventa" element={<LazyVentaCrear/>}/>

                <Route path="/listapedidos" element={<LazyPedidoLista/>}/>
                <Route path="/crearpedidos" element={<LazyPedidoCrear/>}/>
                <Route path="/actualizarpedidos" element={<LazyPedidoActualizar/>}/>

                <Route path="/listaclientes" element={<LazyClienteLista/>}/>
                <Route path="/crearclientes" element={<LazyClienteCrear/>}/>
                <Route path="/actualizarclientes/:codigo" element={<LazyClienteActualizar/>}/>

                <Route path="/adminproveedores" element={<LazyProveedorAdmin/>}/>
                <Route path="/crearproveedores" element={<LazyProveedorCrear/>}/>
                <Route path="/actproveedores/:codigo" element={<LazyProveedorActualizar/>}/>

                <Route path="/adminusuarios" element={<LazyUsuarioLista/>}/>
                <Route path="/crearusuarios" element={<LazyUsuarioCrear/>}/>
                <Route path="/actualizarusuarios/:id" element={<LazyUsuarioActualizar/>}/>

                <Route path="/admincategorias" element={<LazyCategoriaAdmin/>}/>
            </Routes>
        </Suspense>
    )
};