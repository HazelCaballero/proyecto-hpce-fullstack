import React from 'react'
import AsideAdmin from '../components/AsideAdmin'
import Header from '../components/Header';
import Main from '../components/Main';
import ATrueques from '../components/ATrueques';
import Footer from '../components/Footer';
import '../styles/Spages/AdminTrueques.css';

/**
 * Página de administración de trueques.
 * Muestra el panel de gestión de trueques para el administrador.
 */
export default function AdminTrueques() {
  return (
    <div className="page-grid">
        <div >
            <AsideAdmin/>
        </div>
        
        <div>
            <Header titulo="Panel De Administración Trueques" />
            <Main>
            <ATrueques/>
            </Main>
        </div>   
    
        <div>
            <Footer/>
        </div>
    </div>
  )
}
