import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Hogar from '../components/Hogar';
import Footer from '../components/Footer';
import '../styles/Spages/UserHogar.css';

/**
 * Página de inicio (hogar) para usuarias.
 * Muestra información sobre la plataforma, misión, visión y valores.
 */
export default function UserHogar() {
  return (
    <div className="page-grid">
            <div >
                <AsideUsuarias/>
            </div>
            
            <div>
                <Header titulo="Hogar" />
                <Main>
                <Hogar/>
                </Main>
            </div>   
    
            <div>
                <Footer/>
            </div>
        
    </div>
  )
}

