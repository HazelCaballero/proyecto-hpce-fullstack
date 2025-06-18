import React from 'react'
import AsideAdmin from '../components/AsideAdmin'
import Header from '../components/Header';
import Main from '../components/Main';
import AContactos from '../components/AContactos';
import Footer from '../components/Footer';
import '../styles/Spages/AdminContactos.css';

/**
 * Página de administración de contactos.
 * Muestra el panel de gestión de mensajes de contacto para el administrador.
 */
export default function AdminContactos() {
  return (
    <div className="page-grid">
        <div >
            <AsideAdmin/>
        </div>
        
        <div>
            <Header titulo="Panel De Administración Contactos" />
            <Main>
            <AContactos/>
            </Main>
        </div>   
    
        <div>
            <Footer/>
        </div>
    </div>
  )
}
