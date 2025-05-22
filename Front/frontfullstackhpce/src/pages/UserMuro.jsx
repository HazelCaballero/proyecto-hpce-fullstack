import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Muro from '../components/Muro';
import Footer from '../components/Footer';

export default function UserMuro() {
  return (
    <div>
        <div >
            <AsideUsuarias/>
        </div>
        
        <div>
            <Header titulo="Muro" />
        </div>
    
        <div>
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
