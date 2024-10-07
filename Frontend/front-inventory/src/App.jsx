import { useState } from 'react'
import './App.css'
import InicioSesion from './vistas/publicas/InicioSesion'

function App() {
  const [count, setCount] = useState(0)

  return (
    <InicioSesion />
  )
}

export default App
