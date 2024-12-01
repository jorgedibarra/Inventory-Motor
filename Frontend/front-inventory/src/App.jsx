import './App.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import { Ruteo } from './utilidades/rutas/Ruteo'
import { AuthProvider } from './seguridad/ContextoUsuario'

const teTocaEsperar = (
  <div className="spinner-border" role="status">
  <span className="visually-hidden">Cargando...</span>
  </div>
);

function App() {
  return (
    <div>
      <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={teTocaEsperar}>
          <Ruteo />
        </Suspense>
      </BrowserRouter>
      </AuthProvider>
      
    </div>
    
  )
}

export default App
