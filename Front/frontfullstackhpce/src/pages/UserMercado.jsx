import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Mercado from '../components/Mercado';
import Footer from '../components/Footer';

/**
 * Página de mercado para usuarias.
 * Muestra el panel de trueques y productos disponibles.
 */
export default function UserMercado() {
  return (
    <div className="page-grid">
            <div >
                <AsideUsuarias/>
            </div>
            
            <div>
                <Header titulo="Mercado" />
                <Main>
                <Mercado/>
                </Main>
            </div>   
    
            <div>
                <Footer/>
            </div>
        
    </div>
  )
}
