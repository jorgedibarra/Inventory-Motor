import React from 'react';
import imagenFondo from '../../assets/images/Inventory Motor.png'; // Importa tu imagen

const FondoPantalla = () => {
  const estiloFondo = {
    position: 'fixed',
    top: 0,
    left: 140,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${imagenFondo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: -1,
    opacity: 0.4,
  };

  return <div style={estiloFondo}></div>;
};

// En tu componente principal o layout
function Inicio() {
  return (
    <>
      <FondoPantalla />
      {/* Resto de tu contenido */}
    </>
  );
}

export default Inicio;