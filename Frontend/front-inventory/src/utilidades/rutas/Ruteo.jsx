import { lazy } from "react";
import {Routes, Route} from "react-router-dom"
import {InicioSesion} from "../../vistas/publicas/InicioSesion"

export const Ruteo = () => {
    return (
        <Routes>
            <Route path="/login" element={<InicioSesion/>}/>
        </Routes>
    )
};

