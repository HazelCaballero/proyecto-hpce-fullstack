import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Componente de ruta protegida.
 * Si no hay token de acceso en localStorage, redirige a /UserInicio.
 * Si hay token, renderiza los hijos.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access');
  if (!token) {
    return <Navigate to="/UserInicio" replace />;
  }
  return children;
}
