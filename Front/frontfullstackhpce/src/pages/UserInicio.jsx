import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Inicio from '../components/Inicio';
import Footer from '../components/Footer';

export default function UserPanel() {
  return (
    <div>
         <div >
            <AsideUsuarias/>
          </div>
          
          <div>
            <Header />
          </div>

          <div>
            <Main>
              <Inicio/>
            </Main>
          </div>   

          <div>
            <Footer/>
          </div>   
    </div>
  )
}
