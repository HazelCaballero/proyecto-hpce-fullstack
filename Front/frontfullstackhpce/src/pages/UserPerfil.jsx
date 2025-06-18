import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Perfil from '../components/Perfil';
import Footer from '../components/Footer';
import '../styles/Spages/UserPerfil.css';

/**
 * Página de perfil de la usuaria.
 * Muestra el menú lateral, encabezado, sección principal con el perfil y pie de página.
 */
export default function UserPerfil() {
  return (
    <div className="page-grid">
        <div >
            <AsideUsuarias/>
        </div>
        
        <div>
            <Header titulo="Perfil" />
            <Main>
            <Perfil/>
            </Main>
        </div>   

        <div>
            <Footer/>
        </div>
    </div>
  )
}
