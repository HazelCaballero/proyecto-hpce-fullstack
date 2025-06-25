import React from 'react'
import AsideAdmin from '../components/AsideAdmin'
import Header from '../components/Header';
import Main from '../components/Main';
import APublicaciones from '../components/APublicaciones';
import Footer from '../components/Footer';
import '../styles/Spages/AdminPublicaciones.css'

/**
 * Página de administración de publicaciones.
 * Muestra el panel de gestión de publicaciones para el administrador.
 */
export default function AdminPublicaciones() {
  return (
    <div className="page-grid-publicaciones">
      <div><AsideAdmin /></div>
      
      <div>
        <Header titulo="Panel De Administración Publicaciones" />
        <Main>
          <APublicaciones/>
        </Main>
      </div>
      <div><Footer /></div>
      
    </div>
  )
}
