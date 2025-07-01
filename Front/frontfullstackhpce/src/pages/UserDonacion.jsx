import React from 'react'
import AsideUsuarias from '../components/AsideUsuarias'
import Header from '../components/Header';
import Main from '../components/Main';
import Hogar from '../components/Hogar';
import Footer from '../components/Footer';
import DonacionUser from '../components/DonacionUser';
import '../styles/Spages/UserDonacion.css'

export default function UserDonacion
() {
  return (
  <div className="grid-muro">
        <div >
            <AsideUsuarias/>
        </div>
        
        <div>
            <Header titulo="Donacion" />
            <Main>
                <DonacionUser />
            </Main>
        </div>   
        <div>
            <Footer/>
        </div>
    </div>
  )
}
