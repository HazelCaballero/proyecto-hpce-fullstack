import React from 'react';
import RountingCC from '../src/routes/RountingCC';

/* 
Componente principal de la aplicación.
Renderiza el contenedor principal y el sistema de rutas.
 */
function App() {
  return (
    <>
      {/* Contenedor principal de la app */}
      <div className='AppContainer'>
        <RountingCC />
      </div>
    </>
  );
}

export default App;
