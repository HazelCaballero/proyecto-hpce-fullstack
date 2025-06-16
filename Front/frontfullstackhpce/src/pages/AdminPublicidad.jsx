import React, { useState } from 'react';
import AsideAdmin from '../components/AsideAdmin';
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
import ServiciosAdmin from '../components/ServiciosAdmin';
import Publicity from '../components/Publicity';

/**
 * Página de administración de publicidad, servicios y categorías.
 * Permite gestionar anuncios, servicios y categorías desde un solo panel.
 */
export default function AdminPublicidad() {
  const [reload, setReload] = useState(false);
  return (
    <div className="page-grid">
      <div>
        <AsideAdmin />
      </div>
      <div>
        <Header titulo="Panel de Publicidad, Servicios y Categorías" />
        <Main>
          <div>
            <ServiciosAdmin />
          </div>
          <Publicity onCreated={() => setReload(r => !r)} />
        </Main>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
