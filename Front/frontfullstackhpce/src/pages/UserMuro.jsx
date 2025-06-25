import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Muro from '../components/Muro';
import Footer from '../components/Footer';
import '../styles/Spages/UserMuro.css';

/**
 * Página de muro para usuarias.
 * Muestra publicaciones, anuncios y permite interactuar con el muro.
 */
export default function UserMuro() {
  return (
    <div className="grid-muro">
        <div >
            <AsideUsuarias/>
        </div>
        
        <div>
            <Header titulo="Muro" />
            <Main>
            <Muro/>
            </Main>
        </div>   
    
        <div>
            <Footer/>
        </div>
    </div>
  )
}
