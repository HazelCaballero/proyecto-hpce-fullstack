import React from 'react'
import AsideAdmin from '../components/AsideAdmin'
import Header from '../components/Header';
import Main from '../components/Main';
import APublicaciones from '../components/APublicaciones';
import Footer from '../components/Footer';

export default function AdminPublicaciones() {
  return (
    <div>
        <div >
            <AsideAdmin/>
        </div>
        
        <div>
            <Header titulo="Panel De Administración Publicaciones" />
        </div>
    
        <div>
            <Main>
            <APublicaciones/>
            </Main>
        </div>   
    
        <div>
            <Footer/>
        </div>
    </div>
  )
}
