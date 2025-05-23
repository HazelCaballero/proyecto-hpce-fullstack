import React from 'react';
import FormularioRegistro from './formularioRegistro';
import FormularioInicioSesion from './FormularioInicioSesion'


export default function Inicio() {
  return (
    <div>
      <div>
        <FormularioRegistro/>
      </div>
      <div>
        <FormularioInicioSesion/>
      </div>
    </div>
  )
}

