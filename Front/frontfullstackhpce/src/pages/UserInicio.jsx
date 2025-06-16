import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
import FormularioRegistro from '../components/formularioRegistro';
import FormularioInicioSesion from '../components/FormularioInicioSesion';
import '../styles/Spages/UserInicio.css';

/**
 * Página de inicio para usuarias.
 * Muestra el menú lateral, encabezado, formularios de registro e inicio de sesión y pie de página.
 */
export default function UserInicio() {
  return (
    <div className="page-grid">
         <div >
            <AsideUsuarias/>
          </div>
          
          <div>
            <Header titulo="Inicio"/>
            <Main>
              <div className="formularios-grid">
                <div >
                  <FormularioRegistro />
                </div>
                <div>
                  <FormularioInicioSesion />
                </div>
              </div>
            </Main>
          </div>   

          <div>
            <Footer/>
          </div>   
    </div>
  )
}
