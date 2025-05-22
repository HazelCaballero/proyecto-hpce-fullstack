import React from 'react'
import AsideAdmin from '../components/AsideAdmin'
import Header from '../components/Header';
import Main from '../components/Main';
import ATrueques from '../components/ATrueques';
import Footer from '../components/Footer';

export default function AdminTrueques() {
  return (
    <div>
        <div >
            <AsideAdmin/>
        </div>
        
        <div>
            <Header titulo="Panel De Administración Trueques" />
        </div>
    
        <div>
            <Main>
            <ATrueques/>
            </Main>
        </div>   
    
        <div>
            <Footer/>
        </div>
    </div>
  )
}
