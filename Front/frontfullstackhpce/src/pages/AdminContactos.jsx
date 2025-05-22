import React from 'react'
import AsideAdmin from '../components/AsideAdmin'
import Header from '../components/Header';
import Main from '../components/Main';
import AContactos from '../components/AContactos';
import Footer from '../components/Footer';

export default function 
() {
  return (
    <div>
        <div >
            <AsideAdmin/>
        </div>
        
        <div>
            <Header titulo="Panel De Administración Contactos" />
        </div>
    
        <div>
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
