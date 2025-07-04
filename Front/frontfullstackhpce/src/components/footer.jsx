import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Scomponents/Footer.css'

/**
 * Componente de pie de página.
 * Muestra información de contacto y un botón para ir a la página de contacto.
 */
export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer-container">
      <div>
      <button
          className="contact-btn"
          onClick={() => navigate('/UserContactanos')}
        >
          Contáctanos
        </button>
      </div>

      <div>
        <button
          className="contact-btn"
          onClick={() => navigate('/UserContactanos')}
        >
          Fundadora
        </button>
      </div>

          <div>
        Hazel Caballero <br />
        Hazel, desarrolladora y consultora web.
        Formada en el programa educativo de FWD Costa Rica Tech & Freedom
      </div>

      <div className="footer-info">
        <ul>
          <li><strong>Teléfono:</strong > 83031497</li>
          <li><strong>Correo:</strong> hazelcaballeroelizondo@gmail.com</li>
          <li>
            <strong>
              <a
                href="https://www.instagram.com/fwdcostarica/#"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                <img className='insta-icon' src="../public/instagram.png" alt="insta-icon" />
              </a>
            </strong>
            
            <a href="https://www.facebook.com/fwdcostarica"
             target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
            ><img className='insta-icon' src="../public/facebook.png" alt="facebook-icon" />
            </a>
            
            <a href="https://www.tiktok.com/@fwd0905"
             target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
            ><img className='insta-icon' src="../public/tiktok.png" alt="tiktok-icon" />
            </a>
            
            <a href="https://www.youtube.com/@forwardcr"
             target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
            ><img className='insta-icon' src="../public/youtube.png" alt="youtube-icon" />
            </a>
          </li>
        </ul>
      </div>

    </footer>
  )
}

