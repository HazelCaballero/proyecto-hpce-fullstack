import React from 'react'
import AsideAdmin from '../components/AsideAdmin'
import Header from '../components/Header';
import Main from '../components/Main';
import AUsuarias from '../components/AUsuarias';
import Footer from '../components/Footer';


function AdminUsuarias() {
  return (
    <div>
      <div>
          <AsideAdmin/>
      </div>
      
      <div>
        <Header titulo="Panel De Administración Usuarias" />
      </div>
      <div>
        <Main>
          <AUsuarias/>
        </Main>
      </div>
      <div>
        <Footer/>
      </div>

    </div>
  )
}

export default AdminUsuarias;

