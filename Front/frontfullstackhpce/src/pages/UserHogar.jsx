import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Hogar from '../components/Hogar';
import Footer from '../components/Footer';

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

