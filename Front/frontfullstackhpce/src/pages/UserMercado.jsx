import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Mercado from '../components/Mercado';
import Footer from '../components/Footer';


export default function 
() {
  return (
    <div>
            <div >
                <AsideUsuarias/>
            </div>
            
            <div>
                <Header titulo="Mercado" />
            </div>
    
            <div>
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
