import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Contactanos from '../components/Contactanos';
import Footer from '../components/Footer';
import '../styles/Spages/UserContactanos.css';

/**
 * Página de contacto para usuarias.
 * Muestra el formulario de contacto y datos de la fundadora.
 */
export default function UserContactanos() {
  return (
    <div className="page-grid-contactos">
        <div >
            <AsideUsuarias/>
        </div>
        
        <div>
            <Header titulo="Este espacio es para vos. Contáctanos con ¡Confianza!" />
            <Main>
            <Contactanos/>
            </Main>
        </div>   

        <div>
            <Footer/>
        </div>
    </div>
  )
}
