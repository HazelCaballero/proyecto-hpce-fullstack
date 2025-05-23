import React from 'react'
import AsideAdmin from '../components/AsideAdmin'
import Header from '../components/Header';
import Main from '../components/Main';
import APublicaciones from '../components/APublicaciones';
import Footer from '../components/Footer';
import '../styles/Spages/AdminPublicaciones.css'

export default function AdminPublicaciones() {
  return (
    <div className="page-grid">
      <AsideAdmin />
      <div>
        <Header titulo="Panel De Administración Publicaciones" />
        <Main>
          <APublicaciones/>
        </Main>
      </div>
      <Footer />
    </div>
  )
}
