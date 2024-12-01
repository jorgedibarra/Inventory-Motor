import { lazy } from "react";
import {Routes, Route} from "react-router-dom"
import InicioSesion from "../../vistas/publicas/InicioSesion";
import { TableroPrincipal } from "../../componentes/TableroPrincipal";


const LazyInicioSesion = lazy(() => import("../../vistas/publicas/InicioSesion").then(() => ({ default: InicioSesion })));

const LazyTablero = lazy(() => import("../../componentes/TableroPrincipal").then(() => ({ default: TableroPrincipal })));


export const Ruteo = () => {
    return (
        <Routes>
            <Route path="/inventario-front" element={<LazyInicioSesion/>}/>
            <Route path="/dashboard/*" element={<LazyTablero/>}/>
        </Routes>
    )
};

