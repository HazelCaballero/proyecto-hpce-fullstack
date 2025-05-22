import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Perfil from '../components/Perfil';
import Footer from '../components/Footer';


export default function 
() {
  return (
    <div>
        <div >
            <AsideUsuarias/>
        </div>
        
        <div>
            <Header titulo="Perfil" />
        </div>
    
        <div>
            <Main>
            <Perfil/>
            </Main>
        </div>   

        <div>
            <Footer/>
        </div>
    </div>
  )
}
