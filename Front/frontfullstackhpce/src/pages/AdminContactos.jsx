import React from 'react'
import AsideAdmin from '../components/AsideAdmin'
import Header from '../components/Header';
import Main from '../components/Main';
import AContactos from '../components/AContactos';
import Footer from '../components/Footer';

export default function 
() {
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
