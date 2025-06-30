import React, { useState, useEffect } from 'react';
import CallsServicios from '../services/CallsServicios';
import '../styles/Spages/AdminPublicidad.css';
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
  const [servicios, setServicios] = useState([]);
  useEffect(() => {
    CallsServicios.GetServicios()
      .then(data => setServicios(Array.isArray(data) ? data : []))
      .catch(() => setServicios([]));
  }, []);
  return (
    <div className="page-grid">
      <div>
        <AsideAdmin />
      </div>
      <div>
        <Header titulo="Panel de Publicidad" />
        <Main>
          <div className="adminpub-main">
            <div className="adminpub-section">
              <h2>Servicio a usuarias</h2>
              <ServiciosAdmin servicios={servicios} setServicios={setServicios} />
            </div>
            <Publicity servicios={servicios} setServicios={setServicios} />
          </div>
        </Main>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
